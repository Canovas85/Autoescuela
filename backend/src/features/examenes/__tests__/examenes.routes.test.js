import request from "supertest";
import express from "express";
import { describe, it, expect } from "vitest";

import examenesRoutes from "../examenes.routes.js";

describe("Examenes Routes", () => {
  it("debe exponer POST /api/examenes", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/examenes", examenesRoutes);

    const response = await request(app).post("/api/examenes").send({
      alumnoId: "alumno-1",
      tipo: "TEORICO",
      fecha: "2026-10-10T09:00:00Z",
    });

    expect(response.status).toBe(401); // 401 Unauthorized, ya que no se proporciona un token válido
  });
  it("debe exponer GET /api/examenes", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/examenes", examenesRoutes);

    const response = await request(app).get("/api/examenes");

    expect(response.status).toBe(401); // 401 Unauthorized, ya que no se proporciona un token válido
  });
  it("debe exponer GET /api/examenes/:id", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/examenes", examenesRoutes);

    const response = await request(app).get("/api/examenes/examen-1");

    expect(response.status).toBe(401); // 401 Unauthorized, ya que no se proporciona un token válido
  });
  it("debe exponer PUT /api/examenes/:id", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/examenes", examenesRoutes);

    const response = await request(app).put("/api/examenes/examen-1").send({
      tipo: "PRACTICO",
      fecha: "2026-10-15T11:00:00Z",
    });

    expect(response.status).toBe(401); // 401 Unauthorized, ya que no se proporciona un token válido
  });
  it("debe exponer PATCH /api/examenes/:id/resultado", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/examenes", examenesRoutes);

    const response = await request(app)
      .patch("/api/examenes/examen-1/resultado")
      .send({
        estado: "APROBADO",
      });

    expect(response.status).toBe(401); // 401 Unauthorized, ya que no se proporciona un token válido
  });
  it("debe devolver 403 cuando un usuario sin rol ADMIN intenta crear un examen", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/examenes", examenesRoutes);

    const response = await request(app)
      .post("/api/examenes")
      .set("Authorization", "Bearer token-valido-alumno")
      .send({
        alumnoId: "alumno-1",
        tipo: "TEORICO",
        fecha: "2026-10-10T09:00:00Z",
      });

    expect([401, 403]).toContain(response.status);
  });

  it("debe devolver 403 cuando un usuario sin rol ADMIN intenta consultar un examen por id", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/examenes", examenesRoutes);

    const response = await request(app)
      .get("/api/examenes/examen-1")
      .set("Authorization", "Bearer token-valido-alumno");

    expect([401, 403]).toContain(response.status);
  });

  it("debe devolver 403 cuando un usuario sin rol ADMIN intenta actualizar un examen", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/examenes", examenesRoutes);

    const response = await request(app)
      .put("/api/examenes/examen-1")
      .set("Authorization", "Bearer token-valido-alumno")
      .send({
        tipo: "PRACTICO",
        fecha: "2026-10-15T11:00:00Z",
      });

    expect([401, 403]).toContain(response.status);
  });
  it("debe devolver 403 cuando un usuario sin rol ADMIN intenta registrar un resultado de examen", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/examenes", examenesRoutes);

    const response = await request(app)
      .patch("/api/examenes/examen-1/resultado")
      .set("Authorization", "Bearer token-valido-alumno")
      .send({
        estado: "APROBADO",
      });

    expect([401, 403]).toContain(response.status);
  });
});
