import { describe, it, expect, vi } from "vitest";

import { ClasesController } from "../clases.controller.js";

describe("ClasesController", () => {
  it("debe crear una clase práctica y devolver HTTP 201", async () => {
    const claseCreada = {
      id: "clase-1",
      alumnoId: "alumno-1",
      profesorId: "profesor-1",
      vehiculoId: "vehiculo-1",
      fecha: "2026-09-01T10:00:00Z",
      duracion: 60,
      estado: "PROGRAMADA",
    };

    const serviceMock = {
      create: vi.fn().mockResolvedValue(claseCreada),
    };

    const controller = new ClasesController(serviceMock);

    const req = {
      body: {
        alumnoId: "alumno-1",
        profesorId: "profesor-1",
        vehiculoId: "vehiculo-1",
        fecha: "2026-09-01T10:00:00Z",
        duracion: 60,
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

  it("debe devolver el listado completo de clases prácticas", async () => {
    const clases = [
      {
        id: "clase-1",
        alumnoId: "alumno-1",
        profesorId: "profesor-1",
        vehiculoId: "vehiculo-1",
        fecha: "2026-09-01T10:00:00Z",
        duracion: 60,
        estado: "PROGRAMADA",
      },
      {
        id: "clase-2",
        alumnoId: "alumno-2",
        profesorId: "profesor-2",
        vehiculoId: "vehiculo-2",
        fecha: "2026-09-01T12:00:00Z",
        duracion: 90,
        estado: "PROGRAMADA",
      },
    ];

    const serviceMock = {
      getAll: vi.fn().mockResolvedValue(clases),
    };

    const controller = new ClasesController(serviceMock);

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

  it("debe devolver una clase práctica por id", async () => {
    const clase = {
      id: "clase-1",
      alumnoId: "alumno-1",
      profesorId: "profesor-1",
      vehiculoId: "vehiculo-1",
      fecha: "2026-09-01T10:00:00Z",
      duracion: 60,
      estado: "PROGRAMADA",
    };

    const serviceMock = {
      getById: vi.fn().mockResolvedValue(clase),
    };

    const controller = new ClasesController(serviceMock);

    const req = {
      params: {
        id: "clase-1",
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.getById(req, res);

    expect(serviceMock.getById).toHaveBeenCalledWith("clase-1");

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith(clase);
  });

  it("debe actualizar una clase práctica existente", async () => {
    const claseActualizada = {
      id: "clase-1",
      alumnoId: "alumno-1",
      profesorId: "profesor-1",
      vehiculoId: "vehiculo-1",
      fecha: "2026-09-02T10:00:00Z",
      duracion: 90,
      estado: "PROGRAMADA",
    };

    const serviceMock = {
      update: vi.fn().mockResolvedValue(claseActualizada),
    };

    const controller = new ClasesController(serviceMock);

    const req = {
      params: {
        id: "clase-1",
      },
      body: {
        fecha: "2026-09-02T10:00:00Z",
        duracion: 90,
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.update(req, res);

    expect(serviceMock.update).toHaveBeenCalledWith("clase-1", {
      fecha: "2026-09-02T10:00:00Z",
      duracion: 90,
    });

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith(claseActualizada);
  });
  it("debe cancelar una clase práctica existente", async () => {
    const claseCancelada = {
      id: "clase-1",
      alumnoId: "alumno-1",
      profesorId: "profesor-1",
      vehiculoId: "vehiculo-1",
      fecha: "2026-09-01T10:00:00Z",
      duracion: 60,
      estado: "CANCELADA",
    };

    const serviceMock = {
      cancel: vi.fn().mockResolvedValue(claseCancelada),
    };

    const controller = new ClasesController(serviceMock);

    const req = {
      params: {
        id: "clase-1",
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.cancel(req, res);

    expect(serviceMock.cancel).toHaveBeenCalledWith("clase-1");

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith(claseCancelada);
  });
});
