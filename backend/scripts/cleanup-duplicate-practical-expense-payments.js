import prisma from "../src/config/prisma.js";

const DRY_RUN = process.argv.includes("--dry-run");

const main = async () => {
  const pagos = await prisma.pago.findMany({
    where: {
      tipo: "EXAMEN_PRACTICO_GASTOS",
      estado: {
        in: ["PENDIENTE", "PAGADO"],
      },
    },
    include: {
      solicitudesExamenPractico: {
        select: {
          id: true,
          estado: true,
          fasePractica: true,
        },
      },
    },
    orderBy: [
      { alumnoId: "asc" },
      { permiso: "asc" },
      { fechaCreacion: "desc" },
    ],
  });

  const groups = new Map();

  for (const pago of pagos) {
    const key = [
      pago.alumnoId,
      String(pago.permiso || "-").toUpperCase(),
      String(pago.estado || "").toUpperCase(),
    ].join("|");

    if (!groups.has(key)) {
      groups.set(key, []);
    }

    groups.get(key).push(pago);
  }

  let duplicateGroups = 0;
  let cancelledPayments = 0;
  let annulledInvoices = 0;

  for (const rows of groups.values()) {
    const pendingRows = rows.filter(
      (row) => String(row.estado || "").toUpperCase() === "PENDIENTE",
    );

    if (pendingRows.length <= 1) {
      continue;
    }

    duplicateGroups += 1;

    const keep = pendingRows[0];
    const drops = pendingRows.slice(1).filter((row) => {
      const linked = Array.isArray(row.solicitudesExamenPractico)
        ? row.solicitudesExamenPractico.length > 0
        : false;

      return !linked;
    });

    if (!drops.length) {
      continue;
    }

    if (DRY_RUN) {
      continue;
    }

    for (const drop of drops) {
      await prisma.pago.update({
        where: {
          id: drop.id,
        },
        data: {
          estado: "CANCELADO",
          observaciones:
            "Pago duplicado limpiado automáticamente (script histórico)",
        },
      });

      cancelledPayments += 1;

      if (drop.numeroFacturaPago) {
        const updated = await prisma.factura.updateMany({
          where: {
            numero: drop.numeroFacturaPago,
            estado: {
              in: ["EMITIDA", "PENDIENTE"],
            },
          },
          data: {
            estado: "ANULADA",
          },
        });

        annulledInvoices += Number(updated.count || 0);
      }
    }

    void keep;
  }

  console.log(
    JSON.stringify(
      {
        dryRun: DRY_RUN,
        processed: pagos.length,
        duplicateGroups,
        cancelledPayments,
        annulledInvoices,
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
