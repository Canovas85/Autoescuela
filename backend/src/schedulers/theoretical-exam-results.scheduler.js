import { tasaDgtConfig } from "../config/tasa-dgt.config.js";
import prisma from "../config/prisma.js";
import { SolicitudesExamenRepository } from "../features/solicitudes-examen/solicitudes-examen.repository.js";
import { SolicitudesExamenService } from "../features/solicitudes-examen/solicitudes-examen.service.js";
import { normalizeLicenseCode } from "../shared/domain/exam-license-rules.js";

const DEFAULT_HOUR = 9;
const DEFAULT_MINUTE = 30;
const DEFAULT_TIMEZONE = "Europe/Madrid";

const parseScheduleNumber = ({ value, min, max, fallback }) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
    return fallback;
  }

  return parsed;
};

const formatDateForLog = (date, timeZone) =>
  new Intl.DateTimeFormat("es-ES", {
    timeZone,
    dateStyle: "short",
    timeStyle: "medium",
  }).format(date);

const getZonedDateTimeParts = (date, timeZone) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const year = Number(parts.find((item) => item.type === "year")?.value || 0);
  const month = Number(parts.find((item) => item.type === "month")?.value || 1);
  const day = Number(parts.find((item) => item.type === "day")?.value || 1);
  const hour = Number(parts.find((item) => item.type === "hour")?.value || 0);
  const minute = Number(
    parts.find((item) => item.type === "minute")?.value || 0,
  );

  return { year, month, day, hour, minute };
};

const zonedTimeToUtcDate = ({ year, month, day, hour, minute, timeZone }) => {
  const desiredUtcLike = Date.UTC(year, month - 1, day, hour, minute, 0);
  let candidate = new Date(desiredUtcLike);

  for (let i = 0; i < 3; i += 1) {
    const zoned = getZonedDateTimeParts(candidate, timeZone);
    const zonedUtcLike = Date.UTC(
      zoned.year,
      zoned.month - 1,
      zoned.day,
      zoned.hour,
      zoned.minute,
      0,
    );

    const diffMs = desiredUtcLike - zonedUtcLike;
    if (diffMs === 0) {
      break;
    }

    candidate = new Date(candidate.getTime() + diffMs);
  }

  return candidate;
};

const getNextExecutionDate = ({ hour, minute, timeZone }) => {
  const now = new Date();
  const todayInZone = getZonedDateTimeParts(now, timeZone);
  let nextRun = zonedTimeToUtcDate({
    year: todayInZone.year,
    month: todayInZone.month,
    day: todayInZone.day,
    hour,
    minute,
    timeZone,
  });

  if (nextRun <= now) {
    const tomorrow = new Date(
      Date.UTC(todayInZone.year, todayInZone.month - 1, todayInZone.day + 1),
    );
    const tomorrowInZone = getZonedDateTimeParts(tomorrow, timeZone);
    nextRun = zonedTimeToUtcDate({
      year: tomorrowInZone.year,
      month: tomorrowInZone.month,
      day: tomorrowInZone.day,
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

  const hour = parseScheduleNumber({
    value: process.env.THEORETICAL_EXAM_RESULTS_HOUR,
    min: 0,
    max: 23,
    fallback: DEFAULT_HOUR,
  });
  const minute = parseScheduleNumber({
    value: process.env.THEORETICAL_EXAM_RESULTS_MINUTE,
    min: 0,
    max: 59,
    fallback: DEFAULT_MINUTE,
  });
  const timezone =
    process.env.THEORETICAL_EXAM_RESULTS_TIMEZONE ||
    process.env.TZ ||
    DEFAULT_TIMEZONE;
  const licensesRaw = String(
    process.env.THEORETICAL_EXAM_RESULTS_LICENSES || "",
  ).trim();
  const licenses = licensesRaw
    ? licensesRaw
        .split(",")
        .map((item) => normalizeLicenseCode(item))
        .filter(Boolean)
    : null;
  const service = buildService();

  const scheduleNextRun = () => {
    const nextRun = getNextExecutionDate({
      hour,
      minute,
      timeZone: timezone,
    });
    const delayMs = nextRun.getTime() - Date.now();

    console.log(
      `[scheduler] Teórico programado para ${formatDateForLog(nextRun, timezone)} (${timezone}) [hora=${hour}, minuto=${minute}]`,
    );

    setTimeout(async () => {
      try {
        const result = await service.processScheduledTheoreticalResults({
          licenses,
        });
        console.log(
          `[scheduler] Resultados teórico procesados: ${result.procesadas} (aptos: ${result.aptos}, no aptos: ${result.noAptos}, aciertos: ${result.aciertosTotales}, errores: ${result.erroresTotales})`,
        );
        if (result?.porLicencia) {
          console.log(
            `[scheduler] Resumen teórico por licencia: ${JSON.stringify(result.porLicencia)}`,
          );
        }
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
