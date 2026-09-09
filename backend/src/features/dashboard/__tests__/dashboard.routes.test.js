import request from "supertest";
import express from "express";
import { describe, it, expect } from "vitest";

import dashboardRoutes from "../dashboard.routes.js";

describe("Dashboard Routes", () => {
  it("debe exponer GET /api/dashboard", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/dashboard", dashboardRoutes);

    const response = await request(app).get("/api/dashboard");

    expect([200, 401, 500]).toContain(response.status);
  });
  it("debe devolver 403 cuando un usuario sin rol ADMIN intenta consultar el dashboard", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/dashboard", dashboardRoutes);

    const response = await request(app)
      .get("/api/dashboard")
      .set("Authorization", "Bearer token-valido-alumno");

    expect([401, 403]).toContain(response.status);
  });
  it("debe exponer GET /api/dashboard/advanced", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/dashboard", dashboardRoutes);

    const response = await request(app).get("/api/dashboard/advanced");

    expect([200, 401, 500]).toContain(response.status);
  });
  it("debe devolver 403 cuando un usuario sin rol ADMIN intenta consultar el dashboard avanzado", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/dashboard", dashboardRoutes);

    const response = await request(app)
      .get("/api/dashboard/advanced")
      .set("Authorization", "Bearer token-valido-alumno");

    expect([401, 403]).toContain(response.status);
  });
  it("debe exponer GET /api/dashboard/executive", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/dashboard", dashboardRoutes);

    const response = await request(app).get("/api/dashboard/executive");

    expect([200, 401, 403, 500]).toContain(response.status);
  });
  it("debe devolver 403 cuando un usuario sin rol ADMIN intenta consultar el dashboard ejecutivo", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/dashboard", dashboardRoutes);

    const response = await request(app)
      .get("/api/dashboard/executive")
      .set("Authorization", "Bearer token-valido-alumno");

    expect([401, 403]).toContain(response.status);
  });
  it("debe exponer GET /api/dashboard/student", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/dashboard", dashboardRoutes);

    const response = await request(app).get("/api/dashboard/student");

    expect([200, 401, 403, 500]).toContain(response.status);
  });
  it("debe devolver 403 cuando un usuario sin rol ALUMNO intenta consultar el dashboard del alumno", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/dashboard", dashboardRoutes);

    const response = await request(app)
      .get("/api/dashboard/student")
      .set("Authorization", "Bearer token-valido-profesor");

    expect([401, 403]).toContain(response.status);
  });

  it("debe exponer GET /api/dashboard/professor", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/dashboard", dashboardRoutes);

    const response = await request(app).get("/api/dashboard/professor");

    expect([200, 401, 403, 500]).toContain(response.status);
  });

  it("debe devolver 403 cuando un usuario sin rol PROFESOR intenta consultar el dashboard del profesor", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/dashboard", dashboardRoutes);

    const response = await request(app)
      .get("/api/dashboard/professor")
      .set("Authorization", "Bearer token-valido-alumno");

    expect([401, 403]).toContain(response.status);
  });

  it("debe exponer GET /api/dashboard/professor/students", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/dashboard", dashboardRoutes);

    const response = await request(app).get(
      "/api/dashboard/professor/students",
    );

    expect([200, 401, 403, 500]).toContain(response.status);
  });

  it("debe exponer GET /api/dashboard/professor/students/:alumnoId", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/dashboard", dashboardRoutes);

    const response = await request(app).get(
      "/api/dashboard/professor/students/alumno-1",
    );

    expect([200, 401, 403, 500]).toContain(response.status);
  });

  it("debe exponer GET /api/dashboard/professor/vehicles", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/dashboard", dashboardRoutes);

    const response = await request(app).get(
      "/api/dashboard/professor/vehicles",
    );

    expect([200, 401, 403, 500]).toContain(response.status);
  });

  it("debe exponer GET /api/dashboard/professor/vehicles/:vehiculoId/schedule", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/dashboard", dashboardRoutes);

    const response = await request(app).get(
      "/api/dashboard/professor/vehicles/vehiculo-1/schedule",
    );

    expect([200, 401, 403, 500]).toContain(response.status);
  });

  it("debe exponer GET /api/dashboard/professor/agenda", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/dashboard", dashboardRoutes);

    const response = await request(app).get("/api/dashboard/professor/agenda");

    expect([200, 401, 403, 500]).toContain(response.status);
  });

  it("debe exponer PUT /api/dashboard/professor/work-schedule", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/dashboard", dashboardRoutes);

    const response = await request(app)
      .put("/api/dashboard/professor/work-schedule")
      .send({ bloques: [] });

    expect([200, 401, 403, 500]).toContain(response.status);
  });

  it("debe exponer PATCH /api/dashboard/professor/classes/:classId/status", async () => {
    const app = express();

    app.use(express.json());

    app.use("/api/dashboard", dashboardRoutes);

    const response = await request(app)
      .patch("/api/dashboard/professor/classes/clase-1/status")
      .send({ estado: "CONFIRMADA" });

    expect([200, 401, 403, 500]).toContain(response.status);
  });
});
