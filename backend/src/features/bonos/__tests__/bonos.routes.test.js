import express from "express";
import request from "supertest";
import { describe, it, expect } from "vitest";

import bonosRoutes from "../bonos.routes.js";

describe("Bonos Routes", () => {
  it("debe exponer GET /api/bonos", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/bonos", bonosRoutes);

    const response = await request(app).get("/api/bonos");

    expect(response.status).toBe(401);
  });

  it("debe exponer POST /api/bonos", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/bonos", bonosRoutes);

    const response = await request(app).post("/api/bonos").send({
      nombre: "Pack 10",
      clasesIncluidas: 10,
      validezDias: 90,
    });

    expect(response.status).toBe(401);
  });

  it("debe devolver 403 cuando un usuario sin rol ADMIN intenta listar bonos", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/bonos", bonosRoutes);

    const response = await request(app)
      .get("/api/bonos")
      .set("Authorization", "Bearer token-valido-alumno");

    expect([401, 403]).toContain(response.status);
  });

  it("debe devolver 403 cuando un usuario sin rol ADMIN intenta crear un bono", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/bonos", bonosRoutes);

    const response = await request(app)
      .post("/api/bonos")
      .set("Authorization", "Bearer token-valido-alumno")
      .send({
        nombre: "Pack 10",
        clasesIncluidas: 10,
        validezDias: 90,
      });

    expect([401, 403]).toContain(response.status);
  });
});
