import { describe, it, expect, vi } from "vitest";

import { ProfesoresController } from "../profesores.controller.js";

describe("ProfesoresController", () => {
  it("debe crear un profesor y devolver HTTP 201", async () => {
    const profesorCreado = {
      id: "profesor-1",
      nombre: "Juan Pérez",
      email: "juan@autodrive.com",
      rol: "PROFESOR",
      activo: true,
    };

    const serviceMock = {
      create: vi.fn().mockResolvedValue(profesorCreado),
    };

    const controller = new ProfesoresController(serviceMock);

    const req = {
      body: {
        nombre: "Juan Pérez",
        email: "juan@autodrive.com",
        password: "Password123",
        licenciaConducir: "LIC-123",
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

    expect(res.json).toHaveBeenCalledWith(profesorCreado);
  });

  it("debe devolver el listado completo de profesores", async () => {
    const profesores = [
      {
        id: "profesor-1",
        nombre: "Juan Pérez",
        activo: true,
      },
      {
        id: "profesor-2",
        nombre: "Ana García",
        activo: true,
      },
    ];

    const serviceMock = {
      getAll: vi.fn().mockResolvedValue(profesores),
    };

    const controller = new ProfesoresController(serviceMock);

    const req = {};

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.getAll(req, res);

    expect(serviceMock.getAll).toHaveBeenCalledOnce();

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith(profesores);
  });

  it("debe devolver un profesor por id", async () => {
    const profesor = {
      id: "profesor-1",
      nombre: "Juan Pérez",
      email: "juan@autodrive.com",
      rol: "PROFESOR",
      activo: true,
    };

    const serviceMock = {
      getById: vi.fn().mockResolvedValue(profesor),
    };

    const controller = new ProfesoresController(serviceMock);

    const req = {
      params: {
        id: "profesor-1",
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.getById(req, res);

    expect(serviceMock.getById).toHaveBeenCalledWith("profesor-1");

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith(profesor);
  });

  it("debe desactivar un profesor existente", async () => {
    const profesorDesactivado = {
      id: "profesor-1",
      nombre: "Juan Pérez",
      email: "juan@autodrive.com",
      rol: "PROFESOR",
      activo: false,
    };

    const serviceMock = {
      deactivate: vi.fn().mockResolvedValue(profesorDesactivado),
    };

    const controller = new ProfesoresController(serviceMock);

    const req = {
      params: {
        id: "profesor-1",
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.deactivate(req, res);

    expect(serviceMock.deactivate).toHaveBeenCalledWith("profesor-1");

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith(profesorDesactivado);
  });
});
