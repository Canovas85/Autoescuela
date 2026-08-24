import { describe, it, expect, vi } from "vitest";

import { SolicitudesExamenController } from "../solicitudes-examen.controller.js";

describe("SolicitudesExamenController", () => {
  it("debe crear una solicitud y devolver HTTP 201", async () => {
    const solicitudCreada = {
      id: "solicitud-1",
      alumnoId: "alumno-1",
      tipo: "TEORICO",
      estado: "PENDIENTE",
    };

    const serviceMock = {
      create: vi.fn().mockResolvedValue(solicitudCreada),
    };

    const controller = new SolicitudesExamenController(serviceMock);

    const req = {
      body: {
        alumnoId: "alumno-1",
        tipo: "TEORICO",
        estado: "PENDIENTE",
        fechaSolicitud: "2026-08-24T10:00:00.000Z",
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.create(req, res);

    expect(serviceMock.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(solicitudCreada);
  });

  it("debe devolver el listado completo de solicitudes", async () => {
    const solicitudes = [
      {
        id: "solicitud-1",
        tipo: "TEORICO",
      },
      {
        id: "solicitud-2",
        tipo: "PRACTICO",
      },
    ];

    const serviceMock = {
      getAll: vi.fn().mockResolvedValue(solicitudes),
    };

    const controller = new SolicitudesExamenController(serviceMock);

    const req = {};
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.getAll(req, res);

    expect(serviceMock.getAll).toHaveBeenCalledOnce();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(solicitudes);
  });

  it("debe devolver una solicitud por id", async () => {
    const solicitud = {
      id: "solicitud-1",
      tipo: "TEORICO",
      estado: "PENDIENTE",
    };

    const serviceMock = {
      getById: vi.fn().mockResolvedValue(solicitud),
    };

    const controller = new SolicitudesExamenController(serviceMock);

    const req = {
      params: { id: "solicitud-1" },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.getById(req, res);

    expect(serviceMock.getById).toHaveBeenCalledWith("solicitud-1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(solicitud);
  });

  it("debe devolver HTTP 404 cuando la solicitud no existe", async () => {
    const serviceMock = {
      getById: vi.fn().mockRejectedValue(new Error("Solicitud no encontrada")),
    };

    const controller = new SolicitudesExamenController(serviceMock);

    const req = {
      params: { id: "solicitud-1" },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.getById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Solicitud no encontrada",
    });
  });

  it("debe actualizar una solicitud existente", async () => {
    const solicitudActualizada = {
      id: "solicitud-1",
      tipo: "PRACTICO",
      estado: "PROGRAMADO",
    };

    const serviceMock = {
      update: vi.fn().mockResolvedValue(solicitudActualizada),
    };

    const controller = new SolicitudesExamenController(serviceMock);

    const req = {
      params: { id: "solicitud-1" },
      body: {
        alumnoId: "alumno-1",
        tipo: "PRACTICO",
        estado: "PROGRAMADO",
        fechaSolicitud: "2026-08-24T10:00:00.000Z",
        fechaProgramada: "2026-09-02T10:00:00.000Z",
        observaciones: "Revisado",
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.update(req, res);

    expect(serviceMock.update).toHaveBeenCalledWith("solicitud-1", req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(solicitudActualizada);
  });

  it("debe devolver HTTP 400 cuando falla la actualización", async () => {
    const serviceMock = {
      update: vi.fn().mockRejectedValue(new Error("El alumno es obligatorio")),
    };

    const controller = new SolicitudesExamenController(serviceMock);

    const req = {
      params: { id: "solicitud-1" },
      body: {},
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.update(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "El alumno es obligatorio",
    });
  });

  it("debe eliminar una solicitud", async () => {
    const serviceMock = {
      delete: vi.fn().mockResolvedValue({ id: "solicitud-1" }),
    };

    const controller = new SolicitudesExamenController(serviceMock);

    const req = {
      params: { id: "solicitud-1" },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.delete(req, res);

    expect(serviceMock.delete).toHaveBeenCalledWith("solicitud-1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Solicitud eliminada correctamente",
    });
  });
});
