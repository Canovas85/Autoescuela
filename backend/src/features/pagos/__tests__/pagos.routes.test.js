import express from "express";
import request from "supertest";
import { describe, it, expect } from "vitest";

import pagosRoutes from "../pagos.routes.js";

describe("Pagos Routes", () => {
  it("debe exponer GET /api/pagos", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/pagos", pagosRoutes);

    const response = await request(app).get("/api/pagos");

    expect(response.status).toBe(401);
  });

  it("debe exponer GET /api/pagos/mine", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/pagos", pagosRoutes);

    const response = await request(app).get("/api/pagos/mine");

    expect(response.status).toBe(401);
  });

  it("debe exponer GET /api/pagos/:id", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/pagos", pagosRoutes);

    const response = await request(app).get("/api/pagos/pago-1");

    expect(response.status).toBe(401);
  });

  it("debe exponer PATCH /api/pagos/:id/pagar", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/pagos", pagosRoutes);

    const response = await request(app).patch("/api/pagos/pago-1/pagar");

    expect(response.status).toBe(401);
  });
});
