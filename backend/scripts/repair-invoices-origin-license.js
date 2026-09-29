import "dotenv/config";

import prisma from "../src/config/prisma.js";

const DRY_RUN = process.argv.includes("--dry-run");

const FACTURA_ACTIVA_STATES = ["EMITIDA", "PENDIENTE", "PAGADA", "ANULADA"];

const classifyConcepto = (concepto) => {
  const text = String(concepto || "").toLowerCase();

  if (text.includes("matricul")) {
    return "MATRICULA";
  }

  if (text.includes("tasa") || text.includes("dgt")) {
    return "TASA_DGT";
  }

  if (text.includes("bono")) {
    return "BONO";
  }

  if (text.includes("clase")) {
    return "CLASE_PRACTICA";
  }

  if (
    text.includes("practico") ||
    text.includes("práctico") ||
    text.includes("examen")
  ) {
    return "EXAMEN_PRACTICO";
  }

  return "OTROS";
};

const buildGroupKey = (factura) =>
  [
    factura.alumnoId,
    String(factura.concepto || "")
      .trim()
      .toUpperCase(),
    Number(factura.total || 0).toFixed(2),
  ].join("|");

const sortByPriority = (rows) => {
  const priority = {
    PAGADA: 3,
    PENDIENTE: 2,
    EMITIDA: 1,
    ANULADA: 0,
  };

  return [...rows].sort((a, b) => {
    const aPriority = priority[String(a.estado || "").toUpperCase()] || 0;
    const bPriority = priority[String(b.estado || "").toUpperCase()] || 0;

    if (aPriority !== bPriority) {
      return bPriority - aPriority;
    }

    const aDate = new Date(a.fechaPago || a.fechaEmision || 0).getTime() || 0;
    const bDate = new Date(b.fechaPago || b.fechaEmision || 0).getTime() || 0;

    return bDate - aDate;
  });
};

const buildPagoTasaRenovacionKey = (pago) =>
  [
    pago.alumnoId,
    pago.permiso || "-",
    String(pago.concepto || "")
      .trim()
      .toUpperCase(),
    String(pago.observaciones || "")
      .trim()
      .toUpperCase(),
  ].join("|");

const main = async () => {
  const facturas = await prisma.factura.findMany({
    where: {
      estado: {
        in: FACTURA_ACTIVA_STATES,
      },
    },
    include: {
      compraBono: {
        include: {
          bono: true,
        },
      },
      clasePractica: {
        include: {
          vehiculo: true,
        },
      },
      matricula: true,
    },
    orderBy: [{ fechaEmision: "desc" }],
  });

  let fixedFacturaLinks = 0;
  let fixedPracticalAmounts = 0;
  let cancelledDuplicates = 0;
  let cancelledDuplicateDgtRenewalPayments = 0;
  let cancelledDuplicateDgtRenewalInvoices = 0;
  let cancelledInvoicesFromCancelledPayments = 0;

  for (const factura of facturas) {
    const updates = {};
    const category = classifyConcepto(factura.concepto);

    if (category === "BONO") {
      if (!factura.compraBonoId && factura.matriculaId) {
        const pagoBono = await prisma.pago.findFirst({
          where: {
            numeroFacturaPago: factura.numero,
            tipo: "BONO_CLASES",
          },
          select: {
            compraBonoId: true,
          },
        });

        if (pagoBono?.compraBonoId) {
          updates.compraBonoId = pagoBono.compraBonoId;
          updates.matriculaId = null;
        }
      }
    }

    if (category === "CLASE_PRACTICA") {
      if (!factura.clasePracticaId && factura.matriculaId) {
        const pagoClase = await prisma.pago.findFirst({
          where: {
            numeroFacturaPago: factura.numero,
            tipo: "CLASE_PRACTICA",
          },
          select: {
            clasePracticaId: true,
          },
        });

        if (pagoClase?.clasePracticaId) {
          updates.clasePracticaId = pagoClase.clasePracticaId;
          updates.matriculaId = null;
        }
      }
    }

    if (category === "EXAMEN_PRACTICO") {
      const pagoPractico = await prisma.pago.findFirst({
        where: {
          numeroFacturaPago: factura.numero,
          tipo: "EXAMEN_PRACTICO_GASTOS",
        },
        select: {
          id: true,
          importe: true,
        },
      });

      const importeCorrecto = Number(
        pagoPractico?.importe ?? factura.total ?? 0,
      );
      const currentBase = Number(factura.baseImponible || 0);
      const currentDiscount = Number(factura.descuento || 0);
      const currentTotal = Number(factura.total || 0);

      if (
        Number.isFinite(importeCorrecto) &&
        (currentBase !== importeCorrecto ||
          currentDiscount !== 0 ||
          currentTotal !== importeCorrecto)
      ) {
        updates.baseImponible = importeCorrecto;
        updates.descuento = 0;
        updates.total = importeCorrecto;
      }
    }

    if (Object.keys(updates).length > 0) {
      if (!DRY_RUN) {
        await prisma.factura.update({
          where: {
            id: factura.id,
          },
          data: updates,
        });
      }

      if (updates.compraBonoId || updates.clasePracticaId) {
        fixedFacturaLinks += 1;
      }

      if (
        updates.baseImponible !== undefined ||
        updates.descuento !== undefined ||
        updates.total !== undefined
      ) {
        fixedPracticalAmounts += 1;
      }
    }
  }

  const refreshedFacturas = await prisma.factura.findMany({
    where: {
      estado: {
        in: FACTURA_ACTIVA_STATES,
      },
    },
    orderBy: [{ fechaEmision: "desc" }],
  });

  const groups = new Map();
  for (const factura of refreshedFacturas) {
    const category = classifyConcepto(factura.concepto);

    if (category !== "EXAMEN_PRACTICO") {
      continue;
    }

    const key = buildGroupKey(factura);
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key).push(factura);
  }

  for (const group of groups.values()) {
    if (group.length <= 1) {
      continue;
    }

    const sorted = sortByPriority(group);
    const keeper = sorted[0];

    const toCancel = sorted.filter(
      (item) =>
        item.id !== keeper.id &&
        String(item.estado || "").toUpperCase() !== "ANULADA",
    );

    if (!toCancel.length) {
      continue;
    }

    if (!DRY_RUN) {
      const updated = await prisma.factura.updateMany({
        where: {
          id: {
            in: toCancel.map((row) => row.id),
          },
        },
        data: {
          estado: "ANULADA",
        },
      });

      cancelledDuplicates += Number(updated.count || 0);
    } else {
      cancelledDuplicates += toCancel.length;
    }
  }

  const pagosTasaPendientes = await prisma.pago.findMany({
    where: {
      tipo: "TASA_DGT_21",
      estado: "PENDIENTE",
      concepto: {
        contains: "Tasa",
        mode: "insensitive",
      },
      observaciones: {
        contains:
          "Renovación automática por agotamiento de convocatorias de Tasa DGT",
        mode: "insensitive",
      },
    },
    orderBy: [{ fechaCreacion: "desc" }],
  });

  const pagosPorGrupo = new Map();
  for (const pago of pagosTasaPendientes) {
    const key = buildPagoTasaRenovacionKey(pago);
    if (!pagosPorGrupo.has(key)) {
      pagosPorGrupo.set(key, []);
    }
    pagosPorGrupo.get(key).push(pago);
  }

  for (const group of pagosPorGrupo.values()) {
    if (group.length <= 1) {
      continue;
    }

    const toCancel = group
      .slice(1)
      .filter((row) => String(row.estado || "").toUpperCase() === "PENDIENTE");

    if (!toCancel.length) {
      continue;
    }

    const pagoIds = toCancel.map((row) => row.id);
    const numerosFactura = toCancel
      .map((row) => row.numeroFacturaPago)
      .filter(Boolean);

    if (!DRY_RUN) {
      const pagosUpdated = await prisma.pago.updateMany({
        where: {
          id: {
            in: pagoIds,
          },
          estado: "PENDIENTE",
        },
        data: {
          estado: "CANCELADO",
          observaciones: "Pago duplicado limpiado automáticamente",
        },
      });

      cancelledDuplicateDgtRenewalPayments += Number(pagosUpdated.count || 0);

      if (numerosFactura.length > 0) {
        const facturasUpdated = await prisma.factura.updateMany({
          where: {
            numero: {
              in: numerosFactura,
            },
            estado: {
              in: ["EMITIDA", "PENDIENTE"],
            },
          },
          data: {
            estado: "ANULADA",
          },
        });

        cancelledDuplicateDgtRenewalInvoices += Number(
          facturasUpdated.count || 0,
        );
      }
    } else {
      cancelledDuplicateDgtRenewalPayments += toCancel.length;
      cancelledDuplicateDgtRenewalInvoices += numerosFactura.length;
    }
  }

  const pagosCanceladosConNumero = await prisma.pago.findMany({
    where: {
      estado: "CANCELADO",
      numeroFacturaPago: {
        not: null,
      },
    },
    select: {
      numeroFacturaPago: true,
    },
  });

  const numerosCancelados = [
    ...new Set(
      pagosCanceladosConNumero
        .map((row) => row.numeroFacturaPago)
        .filter(Boolean),
    ),
  ];

  if (numerosCancelados.length > 0) {
    if (!DRY_RUN) {
      const updated = await prisma.factura.updateMany({
        where: {
          numero: {
            in: numerosCancelados,
          },
          estado: {
            in: ["EMITIDA", "PENDIENTE"],
          },
        },
        data: {
          estado: "ANULADA",
        },
      });

      cancelledInvoicesFromCancelledPayments += Number(updated.count || 0);
    } else {
      const count = await prisma.factura.count({
        where: {
          numero: {
            in: numerosCancelados,
          },
          estado: {
            in: ["EMITIDA", "PENDIENTE"],
          },
        },
      });

      cancelledInvoicesFromCancelledPayments += Number(count || 0);
    }
  }

  console.log(
    JSON.stringify(
      {
        dryRun: DRY_RUN,
        fixedFacturaLinks,
        fixedPracticalAmounts,
        cancelledDuplicates,
        cancelledDuplicateDgtRenewalPayments,
        cancelledDuplicateDgtRenewalInvoices,
        cancelledInvoicesFromCancelledPayments,
      },
      null,
      2,
    ),
  );
};

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
