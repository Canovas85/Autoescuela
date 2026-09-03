import { describe, it, expect, vi } from "vitest";

import { PromocionesController } from "../promociones.controller.js";

describe("PromocionesController", () => {
  it("debe crear una promoción y devolver HTTP 201", async () => {
    const promocionCreada = {
      id: "promo-1",
      nombre: "Promoción verano",
      precioOriginal: 600,
      precioPromocional: 450,
      licenciasAplicables: ["B"],
    };

    const serviceMock = {
      create: vi.fn().mockResolvedValue(promocionCreada),
    };

    const controller = new PromocionesController(serviceMock);
    const req = {
      body: {
        nombre: "Promoción verano",
        precioOriginal: 600,
        precioPromocional: 450,
        licenciasAplicables: ["B"],
      },
      file: null,
    };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.create(req, res);

    expect(serviceMock.create).toHaveBeenCalledWith(req.body, req.file);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(promocionCreada);
  });

  it("debe devolver 500 si la creación falla", async () => {
    const serviceMock = {
      create: vi.fn().mockRejectedValue(new Error("Error al crear promoción")),
    };

    const controller = new PromocionesController(serviceMock);
    const req = { body: {}, file: null };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.create(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error al crear promoción",
    });
  });

  it("debe devolver todas las promociones con HTTP 200", async () => {
    const promociones = [
      { id: "promo-1", nombre: "Promoción verano" },
      { id: "promo-2", nombre: "Promoción otoño" },
    ];

    const serviceMock = {
      getAll: vi.fn().mockResolvedValue(promociones),
    };

    const controller = new PromocionesController(serviceMock);
    const req = {};
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.getAll(req, res);

    expect(serviceMock.getAll).toHaveBeenCalledOnce();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(promociones);
  });

  it("debe devolver promociones públicas con HTTP 200", async () => {
    const promociones = [
      { id: "promo-1", nombre: "Promoción pública", activa: true },
    ];

    const serviceMock = {
      getPublic: vi.fn().mockResolvedValue(promociones),
    };

    const controller = new PromocionesController(serviceMock);
    const req = {};
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.getPublic(req, res);

    expect(serviceMock.getPublic).toHaveBeenCalledOnce();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(promociones);
  });

  it("debe devolver una promoción por id con HTTP 200", async () => {
    const promocion = { id: "promo-1", nombre: "Promoción verano" };

    const serviceMock = {
      getById: vi.fn().mockResolvedValue(promocion),
    };

    const controller = new PromocionesController(serviceMock);
    const req = { params: { id: "promo-1" } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.getById(req, res);

    expect(serviceMock.getById).toHaveBeenCalledWith("promo-1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(promocion);
  });

  it("debe devolver 404 si la promoción no existe", async () => {
    const serviceMock = {
      getById: vi.fn().mockRejectedValue(new Error("Promoción no encontrada")),
    };

    const controller = new PromocionesController(serviceMock);
    const req = { params: { id: "promo-404" } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.getById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Promoción no encontrada",
    });
  });

  it("debe actualizar una promoción y devolver HTTP 200", async () => {
    const promocionActualizada = {
      id: "promo-1",
      nombre: "Nuevo nombre",
      precioPromocional: 400,
    };

    const serviceMock = {
      update: vi.fn().mockResolvedValue(promocionActualizada),
    };

    const controller = new PromocionesController(serviceMock);
    const req = {
      params: { id: "promo-1" },
      body: { nombre: "Nuevo nombre", precioPromocional: 400 },
      file: null,
    };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.update(req, res);

    expect(serviceMock.update).toHaveBeenCalledWith(
      "promo-1",
      req.body,
      req.file,
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(promocionActualizada);
  });

  it("debe eliminar una promoción y devolver HTTP 200", async () => {
    const serviceMock = {
      delete: vi.fn().mockResolvedValue(undefined),
    };

    const controller = new PromocionesController(serviceMock);
    const req = { params: { id: "promo-1" } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.delete(req, res);

    expect(serviceMock.delete).toHaveBeenCalledWith("promo-1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Promoción eliminada correctamente",
    });
  });

  it("debe devolver 400 si falla la eliminación", async () => {
    const serviceMock = {
      delete: vi.fn().mockRejectedValue(new Error("No se pudo eliminar")),
    };

    const controller = new PromocionesController(serviceMock);
    const req = { params: { id: "promo-1" } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.delete(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "No se pudo eliminar" });
  });

  it("debe activar una promoción y devolver HTTP 200", async () => {
    const promocionActivada = { id: "promo-1", activa: true };

    const serviceMock = {
      activate: vi.fn().mockResolvedValue(promocionActivada),
    };

    const controller = new PromocionesController(serviceMock);
    const req = { params: { id: "promo-1" } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.activate(req, res);

    expect(serviceMock.activate).toHaveBeenCalledWith("promo-1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(promocionActivada);
  });

  it("debe desactivar una promoción y devolver HTTP 200", async () => {
    const promocionDesactivada = { id: "promo-1", activa: false };

    const serviceMock = {
      deactivate: vi.fn().mockResolvedValue(promocionDesactivada),
    };

    const controller = new PromocionesController(serviceMock);
    const req = { params: { id: "promo-1" } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.deactivate(req, res);

    expect(serviceMock.deactivate).toHaveBeenCalledWith("promo-1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(promocionDesactivada);
  });
});
