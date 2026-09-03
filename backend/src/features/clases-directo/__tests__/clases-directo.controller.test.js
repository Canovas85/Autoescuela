import { describe, it, expect, vi } from "vitest";

import { ClasesDirectoController } from "../clases-directo.controller.js";

describe("ClasesDirectoController", () => {
  it("debe devolver todas las clases directas con HTTP 200", async () => {
    const clases = [
      { id: "clase-directo-1", titulo: "Manejo en ciudad" },
      { id: "clase-directo-2", titulo: "Manejo en autopista" },
    ];

    const serviceMock = {
      getAll: vi.fn().mockResolvedValue(clases),
    };

    const controller = new ClasesDirectoController(serviceMock);
    const req = {};
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.getAll(req, res);

    expect(serviceMock.getAll).toHaveBeenCalledOnce();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(clases);
  });

  it("debe devolver las clases directas activas con HTTP 200", async () => {
    const clases = [
      { id: "clase-directo-1", titulo: "Manejo en ciudad", activa: true },
    ];

    const serviceMock = {
      getAllActive: vi.fn().mockResolvedValue(clases),
    };

    const controller = new ClasesDirectoController(serviceMock);
    const req = {};
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.getAllActive(req, res);

    expect(serviceMock.getAllActive).toHaveBeenCalledOnce();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(clases);
  });

  it("debe devolver una clase directa por id con HTTP 200", async () => {
    const clase = { id: "clase-directo-1", titulo: "Manejo en ciudad" };

    const serviceMock = {
      getById: vi.fn().mockResolvedValue(clase),
    };

    const controller = new ClasesDirectoController(serviceMock);
    const req = { params: { id: "clase-directo-1" } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.getById(req, res);

    expect(serviceMock.getById).toHaveBeenCalledWith("clase-directo-1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(clase);
  });

  it("debe crear una clase directa y devolver HTTP 201", async () => {
    const claseCreada = {
      id: "clase-directo-1",
      titulo: "Manejo en ciudad",
      videoUrl: "https://youtube.com/watch?v=abc123",
      activa: true,
    };

    const serviceMock = {
      create: vi.fn().mockResolvedValue(claseCreada),
    };

    const controller = new ClasesDirectoController(serviceMock);
    const req = {
      body: {
        titulo: "Manejo en ciudad",
        videoUrl: "https://youtube.com/watch?v=abc123",
      },
    };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.create(req, res);

    expect(serviceMock.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(claseCreada);
  });

  it("debe actualizar una clase directa y devolver HTTP 200", async () => {
    const claseActualizada = {
      id: "clase-directo-1",
      titulo: "Manejo en ciudad actualizado",
      videoUrl: "https://youtube.com/watch?v=nuevo",
    };

    const serviceMock = {
      update: vi.fn().mockResolvedValue(claseActualizada),
    };

    const controller = new ClasesDirectoController(serviceMock);
    const req = {
      params: { id: "clase-directo-1" },
      body: {
        titulo: "Manejo en ciudad actualizado",
        videoUrl: "https://youtube.com/watch?v=nuevo",
      },
    };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.update(req, res);

    expect(serviceMock.update).toHaveBeenCalledWith(
      "clase-directo-1",
      req.body,
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(claseActualizada);
  });

  it("debe desactivar una clase directa y devolver HTTP 200", async () => {
    const claseDesactivada = { id: "clase-directo-1", activa: false };

    const serviceMock = {
      deactivate: vi.fn().mockResolvedValue(claseDesactivada),
    };

    const controller = new ClasesDirectoController(serviceMock);
    const req = { params: { id: "clase-directo-1" } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.deactivate(req, res);

    expect(serviceMock.deactivate).toHaveBeenCalledWith("clase-directo-1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(claseDesactivada);
  });

  it("debe activar una clase directa y devolver HTTP 200", async () => {
    const claseActivada = { id: "clase-directo-1", activa: true };

    const serviceMock = {
      activate: vi.fn().mockResolvedValue(claseActivada),
    };

    const controller = new ClasesDirectoController(serviceMock);
    const req = { params: { id: "clase-directo-1" } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.activate(req, res);

    expect(serviceMock.activate).toHaveBeenCalledWith("clase-directo-1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(claseActivada);
  });
});
