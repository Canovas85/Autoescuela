import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";

import convocatoriasExamenRoutes from "../convocatorias-examen.routes.js";

describe("ConvocatoriasExamen Routes", () => {
  it("expone GET /api/convocatorias-examen", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/convocatorias-examen", convocatoriasExamenRoutes);

    const response = await request(app).get("/api/convocatorias-examen");

    expect(response.status).toBe(401);
  });

  it("expone POST /api/convocatorias-examen", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/convocatorias-examen", convocatoriasExamenRoutes);

    const response = await request(app)
      .post("/api/convocatorias-examen")
      .send({ fecha: "2026-09-25", licencia: "B", tipoExamen: "TEORICO" });

    expect(response.status).toBe(401);
  });

  it("expone GET /api/convocatorias-examen/agenda", async () => {
    const app = express();

    app.use(express.json());
    app.use("/api/convocatorias-examen", convocatoriasExamenRoutes);

    const response = await request(app).get("/api/convocatorias-examen/agenda");

    expect(response.status).toBe(401);
  });
});
