import { describe, it, expect, vi } from "vitest";

import { BonosController } from "../bonos.controller.js";

describe("BonosController", () => {
  it("debe crear un bono y devolver HTTP 201", async () => {
    const bonoCreado = {
      id: "bono-1",
      nombre: "Pack 10",
      clasesIncluidas: 10,
      validezDias: 90,
      activo: true,
    };

    const serviceMock = {
      create: vi.fn().mockResolvedValue(bonoCreado),
    };

    const controller = new BonosController(serviceMock);

    const req = {
      body: {
        nombre: "Pack 10",
        descripcion: "Bono base",
        clasesIncluidas: 10,
        validezDias: 90,
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.create(req, res);

    expect(serviceMock.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(bonoCreado);
  });

  it("debe devolver el listado completo de bonos", async () => {
    const bonos = [
      {
        id: "bono-1",
        nombre: "Pack 10",
      },
      {
        id: "bono-2",
        nombre: "Pack 20",
      },
    ];

    const serviceMock = {
      getAll: vi.fn().mockResolvedValue(bonos),
    };

    const controller = new BonosController(serviceMock);

    const req = {};
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.getAll(req, res);

    expect(serviceMock.getAll).toHaveBeenCalledOnce();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(bonos);
  });

  it("debe devolver un bono por id", async () => {
    const bono = {
      id: "bono-1",
      nombre: "Pack 10",
      clasesIncluidas: 10,
      validezDias: 90,
      activo: true,
    };

    const serviceMock = {
      getById: vi.fn().mockResolvedValue(bono),
    };

    const controller = new BonosController(serviceMock);

    const req = {
      params: { id: "bono-1" },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.getById(req, res);

    expect(serviceMock.getById).toHaveBeenCalledWith("bono-1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(bono);
  });

  it("debe devolver HTTP 404 cuando el bono no existe", async () => {
    const serviceMock = {
      getById: vi.fn().mockRejectedValue(new Error("Bono no encontrado")),
    };

    const controller = new BonosController(serviceMock);

    const req = {
      params: { id: "bono-1" },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.getById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Bono no encontrado" });
  });

  it("debe actualizar un bono existente", async () => {
    const bonoActualizado = {
      id: "bono-1",
      nombre: "Pack 10 renovado",
    };

    const serviceMock = {
      update: vi.fn().mockResolvedValue(bonoActualizado),
    };

    const controller = new BonosController(serviceMock);

    const req = {
      params: { id: "bono-1" },
      body: {
        nombre: "Pack 10 renovado",
        descripcion: "Renovado",
        clasesIncluidas: 10,
        validezDias: 90,
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.update(req, res);

    expect(serviceMock.update).toHaveBeenCalledWith("bono-1", req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(bonoActualizado);
  });

  it("debe devolver HTTP 400 cuando falla la actualización", async () => {
    const serviceMock = {
      update: vi.fn().mockRejectedValue(new Error("El nombre es obligatorio")),
    };

    const controller = new BonosController(serviceMock);

    const req = {
      params: { id: "bono-1" },
      body: {},
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.update(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "El nombre es obligatorio",
    });
  });

  it("debe eliminar un bono", async () => {
    const serviceMock = {
      delete: vi.fn().mockResolvedValue({ id: "bono-1" }),
    };

    const controller = new BonosController(serviceMock);

    const req = {
      params: { id: "bono-1" },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.delete(req, res);

    expect(serviceMock.delete).toHaveBeenCalledWith("bono-1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Bono eliminado correctamente",
    });
  });

  it("debe activar un bono", async () => {
    const bonoActivado = {
      id: "bono-1",
      activo: true,
    };

    const serviceMock = {
      activate: vi.fn().mockResolvedValue(bonoActivado),
    };

    const controller = new BonosController(serviceMock);

    const req = {
      params: { id: "bono-1" },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.activate(req, res);

    expect(serviceMock.activate).toHaveBeenCalledWith("bono-1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(bonoActivado);
  });

  it("debe desactivar un bono", async () => {
    const bonoDesactivado = {
      id: "bono-1",
      activo: false,
    };

    const serviceMock = {
      deactivate: vi.fn().mockResolvedValue(bonoDesactivado),
    };

    const controller = new BonosController(serviceMock);

    const req = {
      params: { id: "bono-1" },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.deactivate(req, res);

    expect(serviceMock.deactivate).toHaveBeenCalledWith("bono-1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(bonoDesactivado);
  });
});
