import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";

import facturasRoutes from "../facturas.routes.js";

describe("Facturas Routes", () => {
  it("debe exponer GET /api/facturas", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/facturas", facturasRoutes);

    const response = await request(app).get("/api/facturas");

    expect(response.status).toBe(401);
  });

  it("debe exponer GET /api/facturas/mine", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/facturas", facturasRoutes);

    const response = await request(app).get("/api/facturas/mine");

    expect(response.status).toBe(401);
  });

  it("debe responder 401 o 403 si un token no válido intenta leer facturas admin", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/facturas", facturasRoutes);

    const response = await request(app)
      .get("/api/facturas")
      .set("Authorization", "Bearer token-invalido");

    expect([401, 403]).toContain(response.status);
  });
});
