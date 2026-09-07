import express from "express";
import request from "supertest";
import { describe, it, expect } from "vitest";

import tarifasConceptoRoutes from "../tarifas-concepto.routes.js";

describe("TarifasConcepto Routes", () => {
  it("debe exponer POST /api/tarifas-concepto", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/tarifas-concepto", tarifasConceptoRoutes);

    const response = await request(app).post("/api/tarifas-concepto").send({
      permiso: "A",
      concepto: "Tasa DGT (Tasa 2.1)",
      precio: 94.05,
      tipo: "FIJO",
    });

    expect(response.status).toBe(401);
  });

  it("debe exponer GET /api/tarifas-concepto", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/tarifas-concepto", tarifasConceptoRoutes);

    const response = await request(app).get("/api/tarifas-concepto");

    expect(response.status).toBe(401);
  });

  it("debe exponer GET /api/tarifas-concepto/:id", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/tarifas-concepto", tarifasConceptoRoutes);

    const response = await request(app).get("/api/tarifas-concepto/tarifa-1");

    expect(response.status).toBe(401);
  });

  it("debe exponer PUT /api/tarifas-concepto/:id", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/tarifas-concepto", tarifasConceptoRoutes);

    const response = await request(app)
      .put("/api/tarifas-concepto/tarifa-1")
      .send({
        permiso: "A",
        concepto: "Tasa DGT (Tasa 2.1)",
        precio: 100,
        tipo: "FIJO",
      });

    expect(response.status).toBe(401);
  });

  it("debe exponer DELETE /api/tarifas-concepto/:id", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/tarifas-concepto", tarifasConceptoRoutes);

    const response = await request(app).delete(
      "/api/tarifas-concepto/tarifa-1",
    );

    expect(response.status).toBe(401);
  });
});
