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

  it("debe devolver preview de factura con HTTP 200", async () => {
    const preview = { id: "fac-1", numero: "F-0001" };

    const serviceMock = {
      getPreview: vi.fn().mockResolvedValue(preview),
    };

    const controller = new FacturasController(serviceMock);
    const req = { params: { id: "fac-1" } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.getPreview(req, res);

    expect(serviceMock.getPreview).toHaveBeenCalledWith("fac-1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(preview);
  });

  it("debe enviar duplicado de factura con HTTP 200", async () => {
    const serviceMock = {
      sendDuplicate: vi
        .fn()
        .mockResolvedValue({
          message: "Duplicado de factura enviado correctamente",
        }),
    };

    const controller = new FacturasController(serviceMock);
    const req = {
      params: { id: "fac-1" },
      body: { email: "destino@demo.com" },
    };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.sendDuplicate(req, res);

    expect(serviceMock.sendDuplicate).toHaveBeenCalledWith(
      "fac-1",
      "destino@demo.com",
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
