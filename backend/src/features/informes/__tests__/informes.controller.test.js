import { describe, expect, it, vi } from "vitest";

import { InformesController } from "../informes.controller.js";

describe("InformesController", () => {
  it("responde 200 con el informe contable", async () => {
    const payload = { kpis: { ingresosTotales: 100 } };

    const serviceMock = {
      getAdminAccountingReport: vi.fn().mockResolvedValue(payload),
    };

    const controller = new InformesController(serviceMock);

    const req = {
      query: { period: "MONTH", year: "2026", month: "10" },
    };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.getAccountingReport(req, res);

    expect(serviceMock.getAdminAccountingReport).toHaveBeenCalledWith(
      req.query,
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(payload);
  });

  it("responde 400 cuando el servicio lanza error", async () => {
    const serviceMock = {
      getAdminAccountingReport: vi
        .fn()
        .mockRejectedValue(new Error("Filtro inválido")),
    };

    const controller = new InformesController(serviceMock);

    const req = { query: {} };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.getAccountingReport(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Filtro inválido" });
  });
});
