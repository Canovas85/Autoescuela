import { tasaDgtConfig } from "../config/tasa-dgt.config.js";
import prisma from "../config/prisma.js";
import { SolicitudesExamenRepository } from "../features/solicitudes-examen/solicitudes-examen.repository.js";
import { SolicitudesExamenService } from "../features/solicitudes-examen/solicitudes-examen.service.js";

const DEFAULT_HOUR = 9;
const DEFAULT_MINUTE = 30;
const DEFAULT_TIMEZONE = "Europe/Madrid";

const getZonedDateParts = (date, timeZone) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = Number(parts.find((item) => item.type === "year")?.value || 0);
  const month = Number(parts.find((item) => item.type === "month")?.value || 1);
  const day = Number(parts.find((item) => item.type === "day")?.value || 1);

  return { year, month, day };
};

const zonedTimeToUtcDate = ({ year, month, day, hour, minute, timeZone }) => {
  const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
  const zonedGuess = new Date(
    utcGuess.toLocaleString("en-US", {
      timeZone,
    }),
  );
  const diffMs = utcGuess.getTime() - zonedGuess.getTime();
  return new Date(utcGuess.getTime() + diffMs);
};

const getNextExecutionDate = ({ hour, minute, timeZone }) => {
  const now = new Date();
  const todayInZone = getZonedDateParts(now, timeZone);
  let nextRun = zonedTimeToUtcDate({
    ...todayInZone,
    hour,
    minute,
    timeZone,
  });

  if (nextRun <= now) {
    const tomorrow = new Date(
      Date.UTC(todayInZone.year, todayInZone.month - 1, todayInZone.day + 1),
    );
    const tomorrowInZone = getZonedDateParts(tomorrow, timeZone);
    nextRun = zonedTimeToUtcDate({
      ...tomorrowInZone,
      hour,
      minute,
      timeZone,
    });
  }

  return nextRun;
};

const buildService = () => {
  const repository = new SolicitudesExamenRepository(prisma);
  return new SolicitudesExamenService(repository, tasaDgtConfig);
};

export const startTheoreticalExamResultsScheduler = () => {
  if (process.env.NODE_ENV === "test") {
    return;
  }

  if (
    String(
      process.env.THEORETICAL_EXAM_RESULTS_SCHEDULER_ENABLED || "true",
    ).toLowerCase() === "false"
  ) {
    return;
  }

  const hour = Number(
    process.env.THEORETICAL_EXAM_RESULTS_HOUR || DEFAULT_HOUR,
  );
  const minute = Number(
    process.env.THEORETICAL_EXAM_RESULTS_MINUTE || DEFAULT_MINUTE,
  );
  const timezone =
    process.env.THEORETICAL_EXAM_RESULTS_TIMEZONE || DEFAULT_TIMEZONE;
  const service = buildService();

  const scheduleNextRun = () => {
    const nextRun = getNextExecutionDate({
      hour,
      minute,
      timeZone: timezone,
    });
    const delayMs = nextRun.getTime() - Date.now();

    setTimeout(async () => {
      try {
        const result = await service.processScheduledTheoreticalResults();
        console.log(
          `[scheduler] Resultados teórico procesados: ${result.procesadas} (aptos: ${result.aptos}, no aptos: ${result.noAptos}, aciertos: ${result.aciertosTotales}, errores: ${result.erroresTotales})`,
        );
      } catch (error) {
        console.error(
          "[scheduler] Error procesando resultados teóricos:",
          error,
        );
      } finally {
        scheduleNextRun();
      }
    }, delayMs);
  };

  scheduleNextRun();
};
