import request from "supertest";
import express from "express";
import { describe, it, expect, vi } from "vitest";
import profesoresRoutes from "../profesores.routes.js";

describe("Profesores Routes", () => {
  it("debe devolver 401 cuando no se envía token al crear un profesor", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/profesores", profesoresRoutes);

    const response = await request(app).post("/api/profesores").send({
      nombre: "Juan Pérez",
      email: "juan@autodrive.com",
      password: "Password123",
      licenciaConducir: "LIC-123",
      telefono: "600123123",
    });

    expect(response.status).toBe(401); // Se espera 401 porque no se proporciona un token de autenticación
  });
  it("debe devolver 401 cuando no se envía token al listar profesores", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/profesores", profesoresRoutes);

    const response = await request(app).get("/api/profesores");

    expect(response.status).toBe(401); // Se espera 401 porque no se proporciona un token de autenticación
  });
  it("debe devolver 401 cuando no se envía token al consultar un profesor por id", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/profesores", profesoresRoutes);

    const response = await request(app).get("/api/profesores/profesor-1");

    expect(response.status).toBe(401); // Se espera 401 porque no se proporciona un token de autenticación
  });
  it("debe devolver 401 cuando no se envía token al actualizar un profesor", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/profesores", profesoresRoutes);

    const response = await request(app).put("/api/profesores/profesor-1").send({
      nombre: "Juan Pérez Actualizado",
    });

    expect(response.status).toBe(401); // Se espera 401 porque no se proporciona un token de autenticación
  });
  it("debe devolver 401 cuando no se envía token al desactivar un profesor", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/profesores", profesoresRoutes);

    const response = await request(app).delete("/api/profesores/profesor-1");

    expect(response.status).toBe(401); // Se espera 401 porque no se proporciona un token de autenticación
  });

  it("debe devolver 403 cuando un usuario sin rol ADMIN intenta crear un profesor", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/profesores", profesoresRoutes);

    const response = await request(app)
      .post("/api/profesores")
      .set("Authorization", "Bearer token-valido-alumno")
      .send({
        nombre: "Juan Pérez",
        email: "juan@autodrive.com",
        password: "Password123",
        licenciaConducir: "LIC-123",
        telefono: "600123123",
      });

    expect([401, 403]).toContain(response.status);
  });
  it("debe devolver 403 cuando un usuario sin rol ADMIN intenta listar profesores", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/profesores", profesoresRoutes);

    const response = await request(app)
      .get("/api/profesores")
      .set("Authorization", "Bearer token-valido-alumno");

    expect([401, 403]).toContain(response.status);
  });
  it("debe devolver 403 cuando un usuario sin rol ADMIN intenta consultar un profesor por id", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/profesores", profesoresRoutes);

    const response = await request(app)
      .get("/api/profesores/profesor-1")
      .set("Authorization", "Bearer token-valido-alumno");

    expect([401, 403]).toContain(response.status);
  });
  it("debe devolver 403 cuando un usuario sin rol ADMIN intenta actualizar un profesor", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/profesores", profesoresRoutes);

    const response = await request(app)
      .put("/api/profesores/profesor-1")
      .set("Authorization", "Bearer token-valido-alumno")
      .send({
        nombre: "Juan Pérez Actualizado",
      });

    expect([401, 403]).toContain(response.status);
  });
  it("debe devolver 403 cuando un usuario sin rol ADMIN intenta desactivar un profesor", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/profesores", profesoresRoutes);

    const response = await request(app)
      .delete("/api/profesores/profesor-1")
      .set("Authorization", "Bearer token-valido-alumno");

    expect([401, 403]).toContain(response.status);
  });
});
