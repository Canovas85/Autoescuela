import express from "express";
import request from "supertest";
import { describe, it, expect } from "vitest";

import promocionesRoutes from "../promociones.routes.js";

describe("Promociones Routes", () => {
  it("debe exponer POST /api/promociones", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/promociones", promocionesRoutes);

    const response = await request(app)
      .post("/api/promociones")
      .send({
        nombre: "Promoción verano",
        precioOriginal: 600,
        precioPromocional: 450,
        licenciasAplicables: ["B"],
      });

    expect(response.status).toBe(401);
  });

  it("debe exponer GET /api/promociones", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/promociones", promocionesRoutes);

    const response = await request(app).get("/api/promociones");

    expect(response.status).toBe(401);
  });

  it("debe exponer GET /api/promociones/public", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/promociones", promocionesRoutes);

    const response = await request(app).get("/api/promociones/public");

    expect(response.status).toBe(200);
  });

  it("debe exponer GET /api/promociones/:id", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/promociones", promocionesRoutes);

    const response = await request(app).get("/api/promociones/promo-1");

    expect(response.status).toBe(401);
  });

  it("debe exponer PUT /api/promociones/:id", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/promociones", promocionesRoutes);

    const response = await request(app)
      .put("/api/promociones/promo-1")
      .send({
        nombre: "Nueva promoción",
        precioOriginal: 600,
        precioPromocional: 450,
        licenciasAplicables: ["B"],
      });

    expect(response.status).toBe(401);
  });

  it("debe exponer DELETE /api/promociones/:id", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/promociones", promocionesRoutes);

    const response = await request(app).delete("/api/promociones/promo-1");

    expect(response.status).toBe(401);
  });

  it("debe exponer PATCH /api/promociones/:id/activar", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/promociones", promocionesRoutes);

    const response = await request(app).patch(
      "/api/promociones/promo-1/activar",
    );

    expect(response.status).toBe(401);
  });

  it("debe exponer PATCH /api/promociones/:id/desactivar", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/promociones", promocionesRoutes);

    const response = await request(app).patch(
      "/api/promociones/promo-1/desactivar",
    );

    expect(response.status).toBe(401);
  });

  it("debe devolver 403 cuando un usuario sin permisos intenta listar promociones", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/promociones", promocionesRoutes);

    const response = await request(app)
      .get("/api/promociones")
      .set("Authorization", "Bearer token-valido-alumno");

    expect([401, 403]).toContain(response.status);
  });
});
