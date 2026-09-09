import dotenv from "dotenv";
import app from "./app.js";
import { startTheoreticalExamResultsScheduler } from "./schedulers/theoretical-exam-results.scheduler.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

startTheoreticalExamResultsScheduler();

app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});
