import { describe, expect, it, vi } from "vitest";

import { ConvocatoriasExamenController } from "../convocatorias-examen.controller.js";

describe("ConvocatoriasExamenController", () => {
  it("crea convocatoria y responde 201", async () => {
    const created = { id: "conv-1", licencia: "B", tipoExamen: "TEORICO" };

    const serviceMock = {
      create: vi.fn().mockResolvedValue(created),
    };

    const controller = new ConvocatoriasExamenController(serviceMock);

    const req = {
      body: {
        fecha: "2026-09-25",
        licencia: "B",
        tipoExamen: "TEORICO",
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.create(req, res);

    expect(serviceMock.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(created);
  });

  it("devuelve agenda y responde 200", async () => {
    const agenda = { year: 2026, month: 9, convocatorias: [] };

    const serviceMock = {
      getAgenda: vi.fn().mockResolvedValue(agenda),
    };

    const controller = new ConvocatoriasExamenController(serviceMock);

    const req = {
      query: {
        year: "2026",
        month: "9",
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.getAgenda(req, res);

    expect(serviceMock.getAgenda).toHaveBeenCalledWith(req.query);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(agenda);
  });
});
