import dotenv from "dotenv";
import app from "./app.js";
import { startTheoreticalExamResultsScheduler } from "./schedulers/theoretical-exam-results.scheduler.js";
import { startPracticalExamResultsScheduler } from "./schedulers/practical-exam-results.scheduler.js";
import { startClassPaymentNotificationScheduler } from "./schedulers/class-payment-notification.scheduler.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

startTheoreticalExamResultsScheduler();
startPracticalExamResultsScheduler();
startClassPaymentNotificationScheduler();

app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});
