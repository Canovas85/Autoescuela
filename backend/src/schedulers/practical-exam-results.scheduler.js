import { tasaDgtConfig } from "../config/tasa-dgt.config.js";
import prisma from "../config/prisma.js";
import { SolicitudesExamenRepository } from "../features/solicitudes-examen/solicitudes-examen.repository.js";
import { SolicitudesExamenService } from "../features/solicitudes-examen/solicitudes-examen.service.js";

const DEFAULT_HOUR = 23;
const DEFAULT_MINUTE = 59;

const getNextExecutionDate = (hour, minute) => {
  const now = new Date();
  const next = new Date(now);
  next.setHours(hour, minute, 0, 0);

  if (next <= now) {
    next.setDate(next.getDate() + 1);
  }

  return next;
};

const buildService = () => {
  const repository = new SolicitudesExamenRepository(prisma);
  return new SolicitudesExamenService(repository, tasaDgtConfig);
};

export const startPracticalExamResultsScheduler = () => {
  if (process.env.NODE_ENV === "test") {
    return;
  }

  if (
    String(
      process.env.PRACTICAL_EXAM_RESULTS_SCHEDULER_ENABLED || "true",
    ).toLowerCase() === "false"
  ) {
    return;
  }

  const hour = Number(process.env.PRACTICAL_EXAM_RESULTS_HOUR || DEFAULT_HOUR);
  const minute = Number(
    process.env.PRACTICAL_EXAM_RESULTS_MINUTE || DEFAULT_MINUTE,
  );
  const service = buildService();

  const scheduleNextRun = () => {
    const nextRun = getNextExecutionDate(hour, minute);
    const delayMs = nextRun.getTime() - Date.now();

    setTimeout(async () => {
      try {
        const result = await service.processScheduledPracticalResults();
        console.log(
          `[scheduler] Resultados práctico procesados: ${result.procesadas} (aptos: ${result.aptos}, no aptos: ${result.noAptos}, leves: ${result.faltasLevesTotales}, deficientes: ${result.faltasDeficientesTotales}, eliminatorias: ${result.faltasEliminatoriasTotales})`,
        );
      } catch (error) {
        console.error(
          "[scheduler] Error procesando resultados prácticos:",
          error,
        );
      } finally {
        scheduleNextRun();
      }
    }, delayMs);
  };

  scheduleNextRun();
};
