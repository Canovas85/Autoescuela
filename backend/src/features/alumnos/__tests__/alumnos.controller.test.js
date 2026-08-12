import { describe, it, expect, vi } from "vitest";

import { AlumnosController } from "../alumnos.controller.js";

describe("AlumnosController", () => {
  it("debe crear un alumno y devolver HTTP 201", async () => {
    const alumnoCreado = {
      id: "alumno-1",
      nombre: "Pedro Sánchez",
      email: "pedro@autodrive.com",
      tipoLicencia: "B",
      telefono: "600123123",
      rol: "ALUMNO",
      activo: true,
    };

    const serviceMock = {
      create: vi.fn().mockResolvedValue(alumnoCreado),
    };

    const controller = new AlumnosController(serviceMock);

    const req = {
      body: {
        nombre: "Pedro Sánchez",
        email: "pedro@autodrive.com",
        password: "Password123",
        tipoLicencia: "B",
        telefono: "600123123",
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.create(req, res);

    expect(serviceMock.create).toHaveBeenCalledWith(req.body);

    expect(res.status).toHaveBeenCalledWith(201);

    expect(res.json).toHaveBeenCalledWith(alumnoCreado);
  });
  it("debe devolver el listado completo de alumnos", async () => {
    const alumnos = [
      {
        id: "alumno-1",
        nombre: "Pedro Sánchez",
        email: "pedro@autodrive.com",
        tipoLicencia: "B",
        activo: true,
      },
      {
        id: "alumno-2",
        nombre: "Laura Martín",
        email: "laura@autodrive.com",
        tipoLicencia: "A2",
        activo: true,
      },
    ];

    const serviceMock = {
      getAll: vi.fn().mockResolvedValue(alumnos),
    };

    const controller = new AlumnosController(serviceMock);

    const req = {};

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.getAll(req, res);

    expect(serviceMock.getAll).toHaveBeenCalledOnce();

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith(alumnos);
  });
  it("debe devolver un alumno por id", async () => {
    const alumno = {
      id: "alumno-1",
      nombre: "Pedro Sánchez",
      email: "pedro@autodrive.com",
      telefono: "600123123",
      tipoLicencia: "B",
      rol: "ALUMNO",
      activo: true,
    };

    const serviceMock = {
      getById: vi.fn().mockResolvedValue(alumno),
    };

    const controller = new AlumnosController(serviceMock);

    const req = {
      params: {
        id: "alumno-1",
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.getById(req, res);

    expect(serviceMock.getById).toHaveBeenCalledWith("alumno-1");

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith(alumno);
  });
  it("debe actualizar un alumno existente", async () => {
    const alumnoActualizado = {
      id: "alumno-1",
      nombre: "Pedro Sánchez Actualizado",
      email: "pedro@autodrive.com",
      telefono: "699999999",
      tipoLicencia: "B",
      rol: "ALUMNO",
      activo: true,
    };

    const serviceMock = {
      update: vi.fn().mockResolvedValue(alumnoActualizado),
    };

    const controller = new AlumnosController(serviceMock);

    const req = {
      params: {
        id: "alumno-1",
      },
      body: {
        nombre: "Pedro Sánchez Actualizado",
        telefono: "699999999",
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.update(req, res);

    expect(serviceMock.update).toHaveBeenCalledWith("alumno-1", {
      nombre: "Pedro Sánchez Actualizado",
      telefono: "699999999",
    });

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith(alumnoActualizado);
  });

  it("debe desactivar un alumno existente", async () => {
    const alumnoDesactivado = {
      id: "alumno-1",
      nombre: "Pedro Sánchez",
      email: "pedro@autodrive.com",
      activo: false,
      rol: "ALUMNO",
    };

    const serviceMock = {
      deactivate: vi.fn().mockResolvedValue(alumnoDesactivado),
    };

    const controller = new AlumnosController(serviceMock);

    const req = {
      params: {
        id: "alumno-1",
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.deactivate(req, res);

    expect(serviceMock.deactivate).toHaveBeenCalledWith("alumno-1");

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith(alumnoDesactivado);
  });
});
