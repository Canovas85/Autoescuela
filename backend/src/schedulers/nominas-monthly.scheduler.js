import prisma from "../config/prisma.js";
import { NominasRepository } from "../features/nominas/nominas.repository.js";
import { NominasService } from "../features/nominas/nominas.service.js";

const DEFAULT_HOUR = 23;
const DEFAULT_MINUTE = 59;
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

const isLastDayOfMonthInTimezone = (date, timeZone) => {
  const { year, month, day } = getZonedDateParts(date, timeZone);
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return day === lastDay;
};

const buildService = () => {
  const repository = new NominasRepository(prisma);
  return new NominasService(repository);
};

export const startNominasMonthlyScheduler = () => {
  if (process.env.NODE_ENV === "test") {
    return;
  }

  if (
    String(
      process.env.NOMINAS_MONTHLY_SCHEDULER_ENABLED || "true",
    ).toLowerCase() === "false"
  ) {
    return;
  }

  const hour = Number(
    process.env.NOMINAS_MONTHLY_SCHEDULER_HOUR || DEFAULT_HOUR,
  );
  const minute = Number(
    process.env.NOMINAS_MONTHLY_SCHEDULER_MINUTE || DEFAULT_MINUTE,
  );
  const timezone =
    process.env.NOMINAS_MONTHLY_SCHEDULER_TIMEZONE || DEFAULT_TIMEZONE;

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
        const runDate = new Date();

        if (!isLastDayOfMonthInTimezone(runDate, timezone)) {
          scheduleNextRun();
          return;
        }

        const parts = getZonedDateParts(runDate, timezone);
        const result = await service.generateMonthlyPayrolls({
          year: parts.year,
          month: parts.month,
        });

        console.log(
          `[scheduler] Nominas ${parts.year}-${String(parts.month).padStart(2, "0")}: generadas=${result.generated}, omitidas=${result.skipped}`,
        );
      } catch (error) {
        console.error("[scheduler] Error generando nominas mensuales:", error);
      } finally {
        scheduleNextRun();
      }
    }, delayMs);
  };

  scheduleNextRun();
};
