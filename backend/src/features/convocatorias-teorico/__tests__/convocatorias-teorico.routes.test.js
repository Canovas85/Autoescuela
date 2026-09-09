import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";

import convocatoriasTeoricoRoutes from "../convocatorias-teorico.routes.js";

describe("ConvocatoriasTeorico Routes", () => {
  it("expone GET /api/convocatorias-teorico", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/convocatorias-teorico", convocatoriasTeoricoRoutes);

    const response = await request(app).get("/api/convocatorias-teorico");

    expect(response.status).toBe(401);
  });

  it("expone POST /api/convocatorias-teorico", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/convocatorias-teorico", convocatoriasTeoricoRoutes);

    const response = await request(app)
      .post("/api/convocatorias-teorico")
      .send({ fecha: "2026-09-25", licencia: "B" });

    expect(response.status).toBe(401);
  });
});
