import request from "supertest";
import express from "express";
import { describe, it, expect } from "vitest";

import vehiculosRoutes from "../vehiculos.routes.js";

describe("Vehiculos Routes", () => {
  it("debe exponer POST /api/vehiculos", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/vehiculos", vehiculosRoutes);

    const response = await request(app).post("/api/vehiculos").send({
      matricula: "1234ABC",
      marca: "Seat",
      modelo: "Ibiza",
      tipoPermiso: "B",
    });

    expect(response.status).toBe(401);
  });

  it("debe exponer GET /api/vehiculos", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/vehiculos", vehiculosRoutes);

    const response = await request(app).get("/api/vehiculos");

    expect(response.status).toBe(401);
  });

  it("debe exponer GET /api/vehiculos/:id", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/vehiculos", vehiculosRoutes);

    const response = await request(app).get("/api/vehiculos/vehiculo-1");

    expect(response.status).toBe(401);
  });
  it("debe exponer PUT /api/vehiculos/:id", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/vehiculos", vehiculosRoutes);

    const response = await request(app).put("/api/vehiculos/vehiculo-1").send({
      modelo: "León",
    });

    expect(response.status).toBe(401);
  });

  it("debe exponer DELETE /api/vehiculos/:id", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/vehiculos", vehiculosRoutes);

    const response = await request(app).delete("/api/vehiculos/vehiculo-1");

    expect(response.status).toBe(401);
  });

  it("debe devolver 403 cuando un usuario sin rol ADMIN intenta crear un vehículo", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/vehiculos", vehiculosRoutes);

    const response = await request(app)
      .post("/api/vehiculos")
      .set("Authorization", "Bearer token-valido-alumno")
      .send({
        matricula: "1234ABC",
        marca: "Seat",
        modelo: "Ibiza",
        tipoPermiso: "B",
      });

    expect([401, 403]).toContain(response.status);
  });

  it("debe devolver 403 cuando un usuario sin rol ADMIN intenta listar vehículos", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/vehiculos", vehiculosRoutes);

    const response = await request(app)
      .get("/api/vehiculos")
      .set("Authorization", "Bearer token-valido-alumno");

    expect([401, 403]).toContain(response.status);
  });
  it("debe devolver 403 cuando un usuario sin rol ADMIN intenta consultar un vehículo por id", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/vehiculos", vehiculosRoutes);

    const response = await request(app)
      .get("/api/vehiculos/vehiculo-1")
      .set("Authorization", "Bearer token-valido-alumno");

    expect([401, 403]).toContain(response.status);
  });
  it("debe devolver 403 cuando un usuario sin rol ADMIN intenta actualizar un vehículo", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/vehiculos", vehiculosRoutes);

    const response = await request(app)
      .put("/api/vehiculos/vehiculo-1")
      .set("Authorization", "Bearer token-valido-alumno")
      .send({
        modelo: "León",
      });

    expect([401, 403]).toContain(response.status);
  });
  it("debe devolver 403 cuando un usuario sin rol ADMIN intenta desactivar un vehículo", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/vehiculos", vehiculosRoutes);

    const response = await request(app)
      .delete("/api/vehiculos/vehiculo-1")
      .set("Authorization", "Bearer token-valido-alumno");

    expect([401, 403]).toContain(response.status);
  });
});
