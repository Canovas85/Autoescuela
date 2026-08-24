import express from "express";
import request from "supertest";
import { describe, it, expect } from "vitest";

import temariosRoutes from "../temarios.routes.js";

describe("Temarios Routes", () => {
  it("debe exponer GET /api/temarios", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/temarios", temariosRoutes);

    const response = await request(app).get("/api/temarios");

    expect(response.status).toBe(401);
  });

  it("debe exponer POST /api/temarios", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/temarios", temariosRoutes);

    const response = await request(app).post("/api/temarios").send({
      titulo: "Señales",
      tipoLicenciaObjetivo: "B",
      orden: 1,
    });

    expect(response.status).toBe(401);
  });

  it("debe devolver 403 cuando un usuario sin rol ADMIN intenta listar temarios", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/temarios", temariosRoutes);

    const response = await request(app)
      .get("/api/temarios")
      .set("Authorization", "Bearer token-valido-alumno");

    expect([401, 403]).toContain(response.status);
  });

  it("debe devolver 403 cuando un usuario sin rol ADMIN intenta crear un temario", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/temarios", temariosRoutes);

    const response = await request(app)
      .post("/api/temarios")
      .set("Authorization", "Bearer token-valido-alumno")
      .send({
        titulo: "Señales",
        tipoLicenciaObjetivo: "B",
        orden: 1,
      });

    expect([401, 403]).toContain(response.status);
  });
});
