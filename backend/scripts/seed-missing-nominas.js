import "dotenv/config";

import prisma from "../src/config/prisma.js";
import { NominasRepository } from "../src/features/nominas/nominas.repository.js";
import { NominasService } from "../src/features/nominas/nominas.service.js";

const resolveHistoricalProfessor = async (solicitud) => {
  if (solicitud.profesorResolucionId) {
    return solicitud.profesorResolucionId;
  }

  if (solicitud.alumno?.profesorAsignadoId) {
    return solicitud.alumno.profesorAsignadoId;
  }

  const referencia =
    solicitud.fechaResolucion ||
    solicitud.fechaProgramada ||
    solicitud.fechaSolicitud;

  const historialPosterior = await prisma.alumnoProfesorHistorial.findFirst({
    where: {
      alumnoId: solicitud.alumnoId,
      motivo: "LICENCIA_OBTENIDA",
      changedAt: {
        gte: referencia,
      },
    },
    orderBy: {
      changedAt: "asc",
    },
    select: {
      profesorAnteriorId: true,
    },
  });

  if (historialPosterior?.profesorAnteriorId) {
    return historialPosterior.profesorAnteriorId;
  }

  const historialPrevio = await prisma.alumnoProfesorHistorial.findFirst({
    where: {
      alumnoId: solicitud.alumnoId,
      changedAt: {
        lte: referencia,
      },
    },
    orderBy: {
      changedAt: "desc",
    },
    select: {
      profesorNuevoId: true,
      profesorAnteriorId: true,
    },
  });

  return (
    historialPrevio?.profesorNuevoId ||
    historialPrevio?.profesorAnteriorId ||
    null
  );
};

const enrichHistoricalPracticalClosures = async () => {
  const solicitudes = await prisma.solicitudExamen.findMany({
    where: {
      tipo: "PRACTICO",
      estado: {
        in: ["APTO", "NO_APTO"],
      },
      OR: [{ fechaResolucion: null }, { profesorResolucionId: null }],
    },
    include: {
      alumno: {
        select: {
          profesorAsignadoId: true,
        },
      },
    },
  });

  let updated = 0;

  for (const solicitud of solicitudes) {
    const profesorResolucionId = await resolveHistoricalProfessor(solicitud);
    const fechaResolucion =
      solicitud.fechaResolucion ||
      solicitud.fechaProgramada ||
      solicitud.fechaSolicitud ||
      new Date();

    await prisma.solicitudExamen.update({
      where: {
        id: solicitud.id,
      },
      data: {
        fechaResolucion,
        profesorResolucionId,
      },
    });

    updated += 1;
  }

  return updated;
};

async function run() {
  const enriched = await enrichHistoricalPracticalClosures();

  const repository = new NominasRepository(prisma);
  const service = new NominasService(repository);

  const result = await service.generateMissingFrom2026();

  const generatedTotal = result.summary.reduce(
    (acc, item) => acc + Number(item.generated || 0),
    0,
  );

  console.log("Seed historico de nominas completado");
  console.log(`- Solicitudes practicas historicas enriquecidas: ${enriched}`);
  console.log(`- Meses procesados: ${result.totalMeses}`);
  console.log(`- Nominas generadas: ${generatedTotal}`);
}

run()
  .catch((error) => {
    console.error("Error seed historico de nominas:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
