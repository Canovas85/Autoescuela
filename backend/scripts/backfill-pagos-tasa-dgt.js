import "dotenv/config";

import prisma from "../src/config/prisma.js";
import { tasaDgtConfig } from "../src/config/tasa-dgt.config.js";

async function run() {
  const matriculasPagadas = await prisma.matricula.findMany({
    where: {
      estado: "PAGADA",
    },
    select: {
      id: true,
      alumnoId: true,
      licencia: true,
    },
  });

  let creados = 0;
  let existentes = 0;

  for (const matricula of matriculasPagadas) {
    const pagoExistente = await prisma.pago.findFirst({
      where: {
        matriculaId: matricula.id,
        tipo: "TASA_DGT_21",
      },
    });

    if (pagoExistente) {
      existentes += 1;
      continue;
    }

    const tarifaTasa = await prisma.tarifaConcepto.findFirst({
      where: {
        permiso: matricula.licencia,
        activa: true,
        concepto: {
          contains: tasaDgtConfig.conceptoPattern,
          mode: "insensitive",
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    await prisma.pago.create({
      data: {
        alumnoId: matricula.alumnoId,
        matriculaId: matricula.id,
        tipo: "TASA_DGT_21",
        concepto: tasaDgtConfig.conceptoPattern,
        permiso: matricula.licencia,
        importe: tarifaTasa?.precio ?? tasaDgtConfig.importeDefault,
        estado: "PENDIENTE",
        convocatoriasIncluidas: 2,
        convocatoriasConsumidas: 0,
        observaciones:
          "Pago generado por backfill tras despliegue de Tasa DGT 2.1",
      },
    });

    creados += 1;
  }

  console.log(
    `Backfill completado. Creados: ${creados}. Ya existentes: ${existentes}.`,
  );
}

run()
  .catch((error) => {
    console.error("Error en backfill de pagos Tasa DGT:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
