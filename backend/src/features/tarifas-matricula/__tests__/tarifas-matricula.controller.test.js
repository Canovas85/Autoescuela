import { describe, it, expect, vi } from "vitest";

import { TarifasMatriculaController } from "../tarifas-matricula.controller.js";

describe("TarifasMatriculaController", () => {
  it("debe crear una tarifa y devolver HTTP 201", async () => {
    const tarifaCreada = {
      id: "tarifa-1",
      licencia: "B",
      precio: 650,
      activa: true,
    };

    const serviceMock = {
      create: vi.fn().mockResolvedValue(tarifaCreada),
    };

    const controller = new TarifasMatriculaController(serviceMock);
    const req = {
      body: {
        licencia: "B",
        precio: 650,
      },
    };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.create(req, res);

    expect(serviceMock.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(tarifaCreada);
  });

  it("debe devolver 400 si falla la creación", async () => {
    const serviceMock = {
      create: vi.fn().mockRejectedValue(new Error("No se pudo crear tarifa")),
    };

    const controller = new TarifasMatriculaController(serviceMock);
    const req = { body: { licencia: "B", precio: 650 } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "No se pudo crear tarifa",
    });
  });

  it("debe devolver todas las tarifas con HTTP 200", async () => {
    const tarifas = [
      { id: "tarifa-1", licencia: "B", precio: 650, activa: true },
      { id: "tarifa-2", licencia: "A", precio: 800, activa: false },
    ];

    const serviceMock = {
      getAll: vi.fn().mockResolvedValue(tarifas),
    };

    const controller = new TarifasMatriculaController(serviceMock);
    const req = {};
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.getAll(req, res);

    expect(serviceMock.getAll).toHaveBeenCalledOnce();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(tarifas);
  });

  it("debe devolver una tarifa por id con HTTP 200", async () => {
    const tarifa = { id: "tarifa-1", licencia: "B", precio: 650, activa: true };

    const serviceMock = {
      getById: vi.fn().mockResolvedValue(tarifa),
    };

    const controller = new TarifasMatriculaController(serviceMock);
    const req = { params: { id: "tarifa-1" } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.getById(req, res);

    expect(serviceMock.getById).toHaveBeenCalledWith("tarifa-1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(tarifa);
  });

  it("debe devolver 404 si la tarifa no existe", async () => {
    const serviceMock = {
      getById: vi.fn().mockRejectedValue(new Error("Tarifa no encontrada")),
    };

    const controller = new TarifasMatriculaController(serviceMock);
    const req = { params: { id: "tarifa-404" } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.getById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Tarifa no encontrada" });
  });

  it("debe actualizar una tarifa y devolver HTTP 200", async () => {
    const tarifaActualizada = {
      id: "tarifa-1",
      licencia: "B",
      precio: 700,
      activa: true,
    };

    const serviceMock = {
      update: vi.fn().mockResolvedValue(tarifaActualizada),
    };

    const controller = new TarifasMatriculaController(serviceMock);
    const req = {
      params: { id: "tarifa-1" },
      body: { licencia: "B", precio: 700 },
    };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.update(req, res);

    expect(serviceMock.update).toHaveBeenCalledWith("tarifa-1", {
      licencia: "B",
      precio: 700,
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(tarifaActualizada);
  });

  it("debe devolver 400 si falla la actualización", async () => {
    const serviceMock = {
      update: vi
        .fn()
        .mockRejectedValue(new Error("No se pudo actualizar tarifa")),
    };

    const controller = new TarifasMatriculaController(serviceMock);
    const req = {
      params: { id: "tarifa-1" },
      body: { licencia: "B", precio: 700 },
    };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.update(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "No se pudo actualizar tarifa",
    });
  });

  it("debe eliminar una tarifa y devolver HTTP 200", async () => {
    const serviceMock = {
      delete: vi.fn().mockResolvedValue(undefined),
    };

    const controller = new TarifasMatriculaController(serviceMock);
    const req = { params: { id: "tarifa-1" } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.delete(req, res);

    expect(serviceMock.delete).toHaveBeenCalledWith("tarifa-1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Tarifa eliminada correctamente",
    });
  });

  it("debe devolver 400 si falla la eliminación", async () => {
    const serviceMock = {
      delete: vi
        .fn()
        .mockRejectedValue(new Error("No se pudo eliminar tarifa")),
    };

    const controller = new TarifasMatriculaController(serviceMock);
    const req = { params: { id: "tarifa-1" } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.delete(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "No se pudo eliminar tarifa",
    });
  });

  it("debe activar una tarifa y devolver HTTP 200", async () => {
    const tarifaActivada = { id: "tarifa-1", licencia: "B", activa: true };

    const serviceMock = {
      activate: vi.fn().mockResolvedValue(tarifaActivada),
    };

    const controller = new TarifasMatriculaController(serviceMock);
    const req = { params: { id: "tarifa-1" } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.activate(req, res);

    expect(serviceMock.activate).toHaveBeenCalledWith("tarifa-1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(tarifaActivada);
  });

  it("debe desactivar una tarifa y devolver HTTP 200", async () => {
    const tarifaDesactivada = { id: "tarifa-1", licencia: "B", activa: false };

    const serviceMock = {
      deactivate: vi.fn().mockResolvedValue(tarifaDesactivada),
    };

    const controller = new TarifasMatriculaController(serviceMock);
    const req = { params: { id: "tarifa-1" } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.deactivate(req, res);

    expect(serviceMock.deactivate).toHaveBeenCalledWith("tarifa-1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(tarifaDesactivada);
  });
});
