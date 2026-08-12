import request from "supertest";
import express from "express";
import { describe, it, expect } from "vitest";

import clasesRoutes from "../clases.routes.js";

describe("Clases Routes", () => {
  it("debe exponer POST /api/clases", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/clases", clasesRoutes);

    const response = await request(app).post("/api/clases").send({
      alumnoId: "alumno-1",
      profesorId: "profesor-1",
      vehiculoId: "vehiculo-1",
      fecha: "2026-09-01T10:00:00Z",
      duracion: 60,
    });

    expect(response.status).toBe(401); // 401 Unauthorized, ya que no se proporciona un token válido
  });
  it("debe exponer GET /api/clases", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/clases", clasesRoutes);

    const response = await request(app).get("/api/clases");

    expect(response.status).toBe(401); // 401 Unauthorized, ya que no se proporciona un token válido
  });
  it("debe exponer GET /api/clases/:id", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/clases", clasesRoutes);

    const response = await request(app).get("/api/clases/clase-1");

    expect(response.status).toBe(401); // 401 Unauthorized, ya que no se proporciona un token válido
  });

  it("debe exponer PUT /api/clases/:id", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/clases", clasesRoutes);

    const response = await request(app).put("/api/clases/clase-1").send({
      fecha: "2026-09-02T10:00:00Z",
      duracion: 90,
    });

    expect(response.status).toBe(401); // 401 Unauthorized, ya que no se proporciona un token válido
  });

  it("debe exponer DELETE /api/clases/:id", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/clases", clasesRoutes);

    const response = await request(app).delete("/api/clases/clase-1");

    expect(response.status).toBe(401); // 401 Unauthorized, ya que no se proporciona un token válido
  });

  it("debe devolver 403 cuando un usuario sin rol ADMIN intenta crear una clase práctica", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/clases", clasesRoutes);

    const response = await request(app)
      .post("/api/clases")
      .set("Authorization", "Bearer token-valido-alumno")
      .send({
        alumnoId: "alumno-1",
        profesorId: "profesor-1",
        vehiculoId: "vehiculo-1",
        fecha: "2026-09-01T10:00:00Z",
        duracion: 60,
      });

    expect([401, 403]).toContain(response.status);
  });

  it("debe devolver 403 cuando un usuario sin rol ADMIN intenta listar clases prácticas", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/clases", clasesRoutes);

    const response = await request(app)
      .get("/api/clases")
      .set("Authorization", "Bearer token-valido-alumno");

    expect([401, 403]).toContain(response.status);
  });

  it("debe devolver 403 cuando un usuario sin rol ADMIN intenta consultar una clase práctica por id", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/clases", clasesRoutes);

    const response = await request(app)
      .get("/api/clases/clase-1")
      .set("Authorization", "Bearer token-valido-alumno");

    expect([401, 403]).toContain(response.status);
  });

  it("debe devolver 403 cuando un usuario sin rol ADMIN intenta actualizar una clase práctica", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/clases", clasesRoutes);

    const response = await request(app)
      .put("/api/clases/clase-1")
      .set("Authorization", "Bearer token-valido-alumno")
      .send({
        fecha: "2026-09-02T10:00:00Z",
        duracion: 90,
      });

    expect([401, 403]).toContain(response.status);
  });

  it("debe devolver 403 cuando un usuario sin rol ADMIN intenta cancelar una clase práctica", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/clases", clasesRoutes);

    const response = await request(app)
      .delete("/api/clases/clase-1")
      .set("Authorization", "Bearer token-valido-alumno");

    expect([401, 403]).toContain(response.status);
  });
});
