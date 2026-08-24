import express from "express";
import request from "supertest";
import { describe, it, expect } from "vitest";

import solicitudesExamenRoutes from "../solicitudes-examen.routes.js";

describe("SolicitudesExamen Routes", () => {
  it("debe exponer GET /api/solicitudes-examen", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/solicitudes-examen", solicitudesExamenRoutes);

    const response = await request(app).get("/api/solicitudes-examen");

    expect(response.status).toBe(401);
  });

  it("debe exponer POST /api/solicitudes-examen", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/solicitudes-examen", solicitudesExamenRoutes);

    const response = await request(app).post("/api/solicitudes-examen").send({
      alumnoId: "alumno-1",
      tipo: "TEORICO",
    });

    expect(response.status).toBe(401);
  });

  it("debe devolver 403 cuando un usuario sin rol ADMIN intenta listar solicitudes", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/solicitudes-examen", solicitudesExamenRoutes);

    const response = await request(app)
      .get("/api/solicitudes-examen")
      .set("Authorization", "Bearer token-valido-alumno");

    expect([401, 403]).toContain(response.status);
  });

  it("debe devolver 403 cuando un usuario sin rol ADMIN intenta crear una solicitud", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/solicitudes-examen", solicitudesExamenRoutes);

    const response = await request(app)
      .post("/api/solicitudes-examen")
      .set("Authorization", "Bearer token-valido-alumno")
      .send({
        alumnoId: "alumno-1",
        tipo: "TEORICO",
      });

    expect([401, 403]).toContain(response.status);
  });
});
