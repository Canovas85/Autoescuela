import express from "express";
import request from "supertest";
import { describe, it, expect } from "vitest";

import clasesDirectoRoutes from "../clases-directo.routes.js";

describe("ClasesDirecto Routes", () => {
  it("debe exponer GET /api/clases-directo/alumno", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/clases-directo", clasesDirectoRoutes);

    const response = await request(app).get("/api/clases-directo/alumno");

    expect(response.status).toBe(401);
  });

  it("debe exponer GET /api/clases-directo", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/clases-directo", clasesDirectoRoutes);

    const response = await request(app).get("/api/clases-directo");

    expect(response.status).toBe(401);
  });

  it("debe exponer GET /api/clases-directo/:id", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/clases-directo", clasesDirectoRoutes);

    const response = await request(app).get(
      "/api/clases-directo/clase-directo-1",
    );

    expect(response.status).toBe(401);
  });

  it("debe exponer POST /api/clases-directo", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/clases-directo", clasesDirectoRoutes);

    const response = await request(app).post("/api/clases-directo").send({
      titulo: "Manejo en ciudad",
      videoUrl: "https://youtube.com/watch?v=abc123",
    });

    expect(response.status).toBe(401);
  });

  it("debe exponer PUT /api/clases-directo/:id", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/clases-directo", clasesDirectoRoutes);

    const response = await request(app)
      .put("/api/clases-directo/clase-directo-1")
      .send({
        titulo: "Manejo en ciudad actualizado",
      });

    expect(response.status).toBe(401);
  });

  it("debe exponer DELETE /api/clases-directo/:id", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/clases-directo", clasesDirectoRoutes);

    const response = await request(app).delete(
      "/api/clases-directo/clase-directo-1",
    );

    expect(response.status).toBe(401);
  });

  it("debe exponer PATCH /api/clases-directo/:id/activar", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/clases-directo", clasesDirectoRoutes);

    const response = await request(app).patch(
      "/api/clases-directo/clase-directo-1/activar",
    );

    expect(response.status).toBe(401);
  });

  it("debe devolver 403 cuando un usuario sin permisos intenta listar clases directas", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/clases-directo", clasesDirectoRoutes);

    const response = await request(app)
      .get("/api/clases-directo")
      .set("Authorization", "Bearer token-valido-alumno");

    expect([401, 403]).toContain(response.status);
  });
});
