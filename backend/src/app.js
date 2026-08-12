import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";

import cors from "cors";

import alumnosRoutes from "./features/alumnos/alumnos.routes.js";
import profesoresRoutes from "./features/profesores/profesores.routes.js";
import authRoutes from "./features/auth/auth.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ success: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/alumnos", alumnosRoutes);
app.use("/api/profesores", profesoresRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
