import { describe, it, expect, vi } from "vitest";

import { ExamenesController } from "../examenes.controller.js";

describe("ExamenesController", () => {
  it("debe crear un examen y devolver HTTP 201", async () => {
    const examenCreado = {
      id: "examen-1",
      alumnoId: "alumno-1",
      tipo: "TEORICO",
      fecha: "2026-10-10T09:00:00Z",
      estado: "PROGRAMADO",
    };

    const serviceMock = {
      create: vi.fn().mockResolvedValue(examenCreado),
    };

    const controller = new ExamenesController(serviceMock);

    const req = {
      body: {
        alumnoId: "alumno-1",
        tipo: "TEORICO",
        fecha: "2026-10-10T09:00:00Z",
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.create(req, res);

    expect(serviceMock.create).toHaveBeenCalledWith(req.body);

    expect(res.status).toHaveBeenCalledWith(201);

    expect(res.json).toHaveBeenCalledWith(examenCreado);
  });
  it("debe devolver el listado completo de exámenes", async () => {
    const examenes = [
      {
        id: "examen-1",
        alumnoId: "alumno-1",
        tipo: "TEORICO",
        fecha: "2026-10-10T09:00:00Z",
        estado: "PROGRAMADO",
      },
      {
        id: "examen-2",
        alumnoId: "alumno-2",
        tipo: "PRACTICO",
        fecha: "2026-10-15T11:00:00Z",
        estado: "PROGRAMADO",
      },
    ];

    const serviceMock = {
      getAll: vi.fn().mockResolvedValue(examenes),
    };

    const controller = new ExamenesController(serviceMock);

    const req = {};

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.getAll(req, res);

    expect(serviceMock.getAll).toHaveBeenCalledOnce();

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith(examenes);
  });
  it("debe devolver un examen por id", async () => {
    const examen = {
      id: "examen-1",
      alumnoId: "alumno-1",
      tipo: "TEORICO",
      fecha: "2026-10-10T09:00:00Z",
      estado: "PROGRAMADO",
    };

    const serviceMock = {
      getById: vi.fn().mockResolvedValue(examen),
    };

    const controller = new ExamenesController(serviceMock);

    const req = {
      params: {
        id: "examen-1",
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.getById(req, res);

    expect(serviceMock.getById).toHaveBeenCalledWith("examen-1");

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith(examen);
  });
  it("debe actualizar un examen existente", async () => {
    const examenActualizado = {
      id: "examen-1",
      alumnoId: "alumno-1",
      tipo: "PRACTICO",
      fecha: "2026-10-15T11:00:00Z",
      estado: "PROGRAMADO",
    };

    const serviceMock = {
      update: vi.fn().mockResolvedValue(examenActualizado),
    };

    const controller = new ExamenesController(serviceMock);

    const req = {
      params: {
        id: "examen-1",
      },
      body: {
        tipo: "PRACTICO",
        fecha: "2026-10-15T11:00:00Z",
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.update(req, res);

    expect(serviceMock.update).toHaveBeenCalledWith("examen-1", {
      tipo: "PRACTICO",
      fecha: "2026-10-15T11:00:00Z",
    });

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith(examenActualizado);
  });
  it("debe registrar el resultado de un examen", async () => {
    const examenActualizado = {
      id: "examen-1",
      alumnoId: "alumno-1",
      tipo: "TEORICO",
      fecha: "2026-10-10T09:00:00Z",
      estado: "APROBADO",
    };

    const serviceMock = {
      registerResult: vi.fn().mockResolvedValue(examenActualizado),
    };

    const controller = new ExamenesController(serviceMock);

    const req = {
      params: {
        id: "examen-1",
      },
      body: {
        estado: "APROBADO",
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.registerResult(req, res);

    expect(serviceMock.registerResult).toHaveBeenCalledWith(
      "examen-1",
      "APROBADO",
    );

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith(examenActualizado);
  });
});
