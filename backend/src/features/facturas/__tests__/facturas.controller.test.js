import { describe, expect, it, vi } from "vitest";

import { FacturasController } from "../facturas.controller.js";

describe("FacturasController", () => {
  it("debe devolver todas las facturas con HTTP 200", async () => {
    const facturas = [{ id: "fac-1" }];

    const serviceMock = {
      getAll: vi.fn().mockResolvedValue(facturas),
    };

    const controller = new FacturasController(serviceMock);
    const req = {};
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.getAll(req, res);

    expect(serviceMock.getAll).toHaveBeenCalledOnce();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(facturas);
  });

  it("debe devolver las facturas del alumno autenticado con HTTP 200", async () => {
    const facturas = [{ id: "fac-1", alumnoId: "alumno-1" }];

    const serviceMock = {
      getMine: vi.fn().mockResolvedValue(facturas),
    };

    const controller = new FacturasController(serviceMock);
    const req = { user: { id: "alumno-1" } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.getMine(req, res);

    expect(serviceMock.getMine).toHaveBeenCalledWith("alumno-1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(facturas);
  });
});
