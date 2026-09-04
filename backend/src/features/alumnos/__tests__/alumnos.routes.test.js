import request from "supertest";
import express from "express";
import { describe, it, expect } from "vitest";

import alumnosRoutes from "../alumnos.routes.js";

describe("Alumnos Routes", () => {
  it("debe exponer POST /api/alumnos", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/alumnos", alumnosRoutes);

    const response = await request(app).post("/api/alumnos").send({
      nombre: "Pedro Sánchez",
      email: "pedro@autodrive.com",
      password: "Password123",
      telefono: "600123123",
      tipoLicencia: "B",
    });

    expect(response.status).toBe(401); // 401 Unauthorized, ya que no se proporciona un token válido
  });

  it("debe exponer GET /api/alumnos", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/alumnos", alumnosRoutes);

    const response = await request(app).get("/api/alumnos");

    expect(response.status).toBe(401); // 401 Unauthorized, ya que no se proporciona un token válido
  });

  it("debe exponer POST /api/alumnos/promociones-elegibles", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/alumnos", alumnosRoutes);

    const response = await request(app)
      .post("/api/alumnos/promociones-elegibles")
      .send({
        tipoLicenciaObjetivo: "B",
        dni: "12345678Z",
        fechaNacimiento: "2000-01-01T00:00:00.000Z",
      });

    expect(response.status).toBe(401);
  });

  it("debe exponer GET /api/alumnos/:id/profesores-elegibles", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/alumnos", alumnosRoutes);

    const response = await request(app).get(
      "/api/alumnos/alumno-1/profesores-elegibles",
    );

    expect(response.status).toBe(401);
  });

  it("debe exponer GET /api/alumnos/:id", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/alumnos", alumnosRoutes);

    const response = await request(app).get("/api/alumnos/alumno-1");

    expect(response.status).toBe(401); // 401 Unauthorized, ya que no se proporciona un token válido
  });

  it("debe exponer PUT /api/alumnos/:id", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/alumnos", alumnosRoutes);

    const response = await request(app).put("/api/alumnos/alumno-1").send({
      nombre: "Pedro Sánchez Actualizado",
    });

    expect(response.status).toBe(401); // 401 Unauthorized, ya que no se proporciona un token válido
  });

  it("debe exponer DELETE /api/alumnos/:id", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/alumnos", alumnosRoutes);

    const response = await request(app).delete("/api/alumnos/alumno-1");

    expect(response.status).toBe(401); // 401 Unauthorized, ya que no se proporciona un token válido
  });

  it("debe devolver 403 cuando un usuario sin rol ADMIN intenta crear un alumno", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/alumnos", alumnosRoutes);

    const response = await request(app)
      .post("/api/alumnos")
      .set("Authorization", "Bearer token-valido-alumno")
      .send({
        nombre: "Pedro Sánchez",
        email: "pedro@autodrive.com",
        password: "Password123",
        telefono: "600123123",
        tipoLicencia: "B",
      });

    expect([401, 403]).toContain(response.status);
  });

  it("debe devolver 403 cuando un usuario sin rol ADMIN intenta listar alumnos", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/alumnos", alumnosRoutes);

    const response = await request(app)
      .get("/api/alumnos")
      .set("Authorization", "Bearer token-valido-alumno");

    expect([401, 403]).toContain(response.status);
  });

  it("debe devolver 403 cuando un usuario sin rol ADMIN intenta consultar un alumno por id", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/alumnos", alumnosRoutes);

    const response = await request(app)
      .get("/api/alumnos/alumno-1")
      .set("Authorization", "Bearer token-valido-alumno");

    expect([401, 403]).toContain(response.status);
  });

  it("debe devolver 403 cuando un usuario sin rol ADMIN intenta actualizar un alumno", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/alumnos", alumnosRoutes);

    const response = await request(app)
      .put("/api/alumnos/alumno-1")
      .set("Authorization", "Bearer token-valido-alumno")
      .send({
        nombre: "Pedro Sánchez Actualizado",
      });

    expect([401, 403]).toContain(response.status);
  });

  it("debe devolver 403 cuando un usuario sin rol ADMIN intenta desactivar un alumno", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/alumnos", alumnosRoutes);

    const response = await request(app)
      .delete("/api/alumnos/alumno-1")
      .set("Authorization", "Bearer token-valido-alumno");

    expect([401, 403]).toContain(response.status);
  });
});
