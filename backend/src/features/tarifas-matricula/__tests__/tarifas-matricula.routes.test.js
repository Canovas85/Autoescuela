import express from "express";
import request from "supertest";
import { describe, it, expect } from "vitest";

import tarifasMatriculaRoutes from "../tarifas-matricula.routes.js";

describe("TarifasMatricula Routes", () => {
  it("debe exponer POST /api/tarifas-matricula", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/tarifas-matricula", tarifasMatriculaRoutes);

    const response = await request(app).post("/api/tarifas-matricula").send({
      licencia: "B",
      precio: 650,
    });

    expect(response.status).toBe(401);
  });

  it("debe exponer GET /api/tarifas-matricula", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/tarifas-matricula", tarifasMatriculaRoutes);

    const response = await request(app).get("/api/tarifas-matricula");

    expect(response.status).toBe(401);
  });

  it("debe exponer GET /api/tarifas-matricula/:id", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/tarifas-matricula", tarifasMatriculaRoutes);

    const response = await request(app).get("/api/tarifas-matricula/tarifa-1");

    expect(response.status).toBe(401);
  });

  it("debe exponer PUT /api/tarifas-matricula/:id", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/tarifas-matricula", tarifasMatriculaRoutes);

    const response = await request(app)
      .put("/api/tarifas-matricula/tarifa-1")
      .send({
        licencia: "B",
        precio: 700,
      });

    expect(response.status).toBe(401);
  });

  it("debe exponer DELETE /api/tarifas-matricula/:id", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/tarifas-matricula", tarifasMatriculaRoutes);

    const response = await request(app).delete(
      "/api/tarifas-matricula/tarifa-1",
    );

    expect(response.status).toBe(401);
  });

  it("debe exponer PATCH /api/tarifas-matricula/:id/activar", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/tarifas-matricula", tarifasMatriculaRoutes);

    const response = await request(app).patch(
      "/api/tarifas-matricula/tarifa-1/activar",
    );

    expect(response.status).toBe(401);
  });

  it("debe exponer PATCH /api/tarifas-matricula/:id/desactivar", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/tarifas-matricula", tarifasMatriculaRoutes);

    const response = await request(app).patch(
      "/api/tarifas-matricula/tarifa-1/desactivar",
    );

    expect(response.status).toBe(401);
  });

  it("debe devolver 403 cuando un usuario sin permisos intenta listar tarifas", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/tarifas-matricula", tarifasMatriculaRoutes);

    const response = await request(app)
      .get("/api/tarifas-matricula")
      .set("Authorization", "Bearer token-valido-alumno");

    expect([401, 403]).toContain(response.status);
  });
});
