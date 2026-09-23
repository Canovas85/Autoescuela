import prisma from "../config/prisma.js";
import { ClasesRepository } from "../features/clases/clases.repository.js";
import { ClasesService } from "../features/clases/clases.service.js";

const DEFAULT_INTERVAL_MS = 60 * 1000;

const buildService = () => {
  const repository = new ClasesRepository(prisma);
  return new ClasesService(repository);
};

export const startClassPaymentNotificationScheduler = () => {
  if (process.env.NODE_ENV === "test") {
    return;
  }

  if (
    String(
      process.env.CLASS_PAYMENT_NOTIFICATION_SCHEDULER_ENABLED || "true",
    ).toLowerCase() === "false"
  ) {
    return;
  }

  const intervalMs = Math.max(
    Number.parseInt(
      process.env.CLASS_PAYMENT_NOTIFICATION_SCHEDULER_INTERVAL_MS ||
        String(DEFAULT_INTERVAL_MS),
      10,
    ) || DEFAULT_INTERVAL_MS,
    10 * 1000,
  );

  const service = buildService();

  const run = async () => {
    try {
      const result = await service.notifyPendingPaymentsDue24h();
      if (result?.notified) {
        console.log(
          `[scheduler] Avisos de pago 24h enviados: ${result.notified}`,
        );
      }
    } catch (error) {
      console.error("[scheduler] Error avisando pagos pendientes 24h:", error);
    }
  };

  run();
  setInterval(run, intervalMs);
};
