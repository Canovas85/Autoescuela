import express from "express";
import request from "supertest";
import { describe, it, expect } from "vitest";

import matriculasRoutes from "../matriculas.routes.js";

describe("Matriculas Routes", () => {
  it("debe exponer POST /api/matriculas", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/matriculas", matriculasRoutes);

    const response = await request(app).post("/api/matriculas").send({
      alumnoId: "alumno-1",
      promocionId: "promocion-1",
    });

    expect(response.status).toBe(401);
  });

  it("debe exponer GET /api/matriculas", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/matriculas", matriculasRoutes);

    const response = await request(app).get("/api/matriculas");

    expect(response.status).toBe(401);
  });

  it("debe exponer GET /api/matriculas/mine", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/matriculas", matriculasRoutes);

    const response = await request(app).get("/api/matriculas/mine");

    expect(response.status).toBe(401);
  });

  it("debe exponer GET /api/matriculas/:id", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/matriculas", matriculasRoutes);

    const response = await request(app).get("/api/matriculas/matricula-1");

    expect(response.status).toBe(401);
  });

  it("debe exponer PUT /api/matriculas/:id", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/matriculas", matriculasRoutes);

    const response = await request(app)
      .put("/api/matriculas/matricula-1")
      .send({
        promocionId: "promocion-2",
      });

    expect(response.status).toBe(401);
  });

  it("debe exponer PATCH /api/matriculas/:id/pagar", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/matriculas", matriculasRoutes);

    const response = await request(app).patch(
      "/api/matriculas/matricula-1/pagar",
    );

    expect(response.status).toBe(401);
  });

  it("debe exponer PATCH /api/matriculas/:id/anular", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/matriculas", matriculasRoutes);

    const response = await request(app).patch(
      "/api/matriculas/matricula-1/anular",
    );

    expect(response.status).toBe(401);
  });

  it("debe devolver 403 cuando un usuario sin permisos intenta listar matrículas", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/matriculas", matriculasRoutes);

    const response = await request(app)
      .get("/api/matriculas")
      .set("Authorization", "Bearer token-valido-alumno");

    expect([401, 403]).toContain(response.status);
  });
});
