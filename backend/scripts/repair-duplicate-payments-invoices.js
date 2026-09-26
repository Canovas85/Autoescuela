import prisma from "../src/config/prisma.js";

const DRY_RUN = process.argv.includes("--dry-run");

const ACTIVE_PAYMENT_STATES = ["PENDIENTE", "PAGADO"];
const ACTIVE_INVOICE_STATES = ["EMITIDA", "PENDIENTE", "PAGADA"];

const paymentGroupKey = (pago) =>
  [
    pago.alumnoId,
    pago.tipo,
    pago.permiso || "-",
    (pago.concepto || "").trim().toUpperCase(),
  ].join("|");

const invoiceGroupKey = (factura) =>
  [
    factura.alumnoId,
    (factura.concepto || "").trim().toUpperCase(),
    Number(factura.total || 0).toFixed(2),
  ].join("|");

const pickKeeper = (rows) => {
  const sorted = [...rows].sort((a, b) => {
    const aPaid = String(a.estado || "").toUpperCase() === "PAGADO" ? 1 : 0;
    const bPaid = String(b.estado || "").toUpperCase() === "PAGADO" ? 1 : 0;
    if (aPaid !== bPaid) {
      return bPaid - aPaid;
    }

    const aDate =
      new Date(
        a.fechaPago || a.fechaCreacion || a.fechaEmision || 0,
      ).getTime() || 0;
    const bDate =
      new Date(
        b.fechaPago || b.fechaCreacion || b.fechaEmision || 0,
      ).getTime() || 0;
    return bDate - aDate;
  });

  return sorted[0] || null;
};

const main = async () => {
  const pagos = await prisma.pago.findMany({
    where: {
      estado: {
        in: ACTIVE_PAYMENT_STATES,
      },
      tipo: {
        in: ["TASA_DGT_21", "EXAMEN_PRACTICO_GASTOS"],
      },
    },
    orderBy: [{ fechaCreacion: "desc" }],
  });

  const facturas = await prisma.factura.findMany({
    where: {
      estado: {
        in: ACTIVE_INVOICE_STATES,
      },
    },
    orderBy: [{ fechaEmision: "desc" }],
  });

  const paymentGroups = new Map();
  for (const pago of pagos) {
    const key = paymentGroupKey(pago);
    if (!paymentGroups.has(key)) {
      paymentGroups.set(key, []);
    }
    paymentGroups.get(key).push(pago);
  }

  const invoiceGroups = new Map();
  for (const factura of facturas) {
    const key = invoiceGroupKey(factura);
    if (!invoiceGroups.has(key)) {
      invoiceGroups.set(key, []);
    }
    invoiceGroups.get(key).push(factura);
  }

  const duplicatePayments = [...paymentGroups.values()].filter(
    (rows) => rows.length > 1,
  );
  const duplicateInvoices = [...invoiceGroups.values()].filter(
    (rows) => rows.length > 1,
  );

  let cancelledPayments = 0;
  let cancelledInvoices = 0;

  for (const group of duplicatePayments) {
    const keeper = pickKeeper(group);
    const dropIds = group
      .filter((row) => row.id !== keeper?.id)
      .map((row) => row.id);

    if (!dropIds.length) {
      continue;
    }

    if (!DRY_RUN) {
      const updated = await prisma.pago.updateMany({
        where: {
          id: {
            in: dropIds,
          },
          estado: {
            in: ACTIVE_PAYMENT_STATES,
          },
        },
        data: {
          estado: "CANCELADO",
          observaciones: "Cancelado por reparación de duplicados (script)",
        },
      });

      cancelledPayments += Number(updated.count || 0);
    }
  }

  for (const group of duplicateInvoices) {
    const keeper = pickKeeper(group);
    const dropIds = group
      .filter((row) => row.id !== keeper?.id)
      .map((row) => row.id);

    if (!dropIds.length) {
      continue;
    }

    if (!DRY_RUN) {
      const updated = await prisma.factura.updateMany({
        where: {
          id: {
            in: dropIds,
          },
          estado: {
            in: ["EMITIDA", "PENDIENTE"],
          },
        },
        data: {
          estado: "ANULADA",
        },
      });

      cancelledInvoices += Number(updated.count || 0);
    }
  }

  console.log(
    JSON.stringify(
      {
        dryRun: DRY_RUN,
        duplicatePaymentGroups: duplicatePayments.length,
        duplicateInvoiceGroups: duplicateInvoices.length,
        cancelledPayments,
        cancelledInvoices,
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
