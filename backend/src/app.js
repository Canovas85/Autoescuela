import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import path from "path";
import { fileURLToPath } from "url";

import cors from "cors";

import alumnosRoutes from "./features/alumnos/alumnos.routes.js";
import profesoresRoutes from "./features/profesores/profesores.routes.js";
import authRoutes from "./features/auth/auth.routes.js";
import clasesRoutes from "./features/clases/clases.routes.js";
import examenesRoutes from "./features/examenes/examenes.routes.js";
import dashboardRoutes from "./features/dashboard/dashboard.routes.js";
import vehiculosRoutes from "./features/vehiculos/vehiculos.routes.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsPath = path.resolve(__dirname, "../uploads");

app.use(cors());
app.use(express.json());
app.use("/api/uploads", express.static(uploadsPath));

app.get("/api/health", (req, res) => {
  res.json({ success: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/alumnos", alumnosRoutes);
app.use("/api/profesores", profesoresRoutes);
app.use("/api/clases", clasesRoutes);
app.use("/api/examenes", examenesRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/vehiculos", vehiculosRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((error, req, res, next) => {
  console.error("MIDDLEWARE GLOBAL EJECUTADO");
  console.error(error);

  return res.status(400).json({
    message: error.message,
  });
});

// app.use((error, req, res, next) => {
//   console.error(error);

//   return res.status(400).json({
//     message: error.message,
//   });
// });

export default app;
