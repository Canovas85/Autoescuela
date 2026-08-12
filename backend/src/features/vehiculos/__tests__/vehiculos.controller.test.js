import { describe, it, expect, vi } from "vitest";

import { VehiculosController } from "../vehiculos.controller.js";

describe("VehiculosController", () => {
  it("debe crear un vehículo y devolver HTTP 201", async () => {
    const vehiculoCreado = {
      id: "vehiculo-1",
      matricula: "1234ABC",
      marca: "Seat",
      modelo: "Ibiza",
      tipoPermiso: "B",
      activo: true,
    };

    const serviceMock = {
      create: vi.fn().mockResolvedValue(vehiculoCreado),
    };

    const controller = new VehiculosController(serviceMock);

    const req = {
      body: {
        matricula: "1234ABC",
        marca: "Seat",
        modelo: "Ibiza",
        tipoPermiso: "B",
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.create(req, res);

    expect(serviceMock.create).toHaveBeenCalledWith(req.body);

    expect(res.status).toHaveBeenCalledWith(201);

    expect(res.json).toHaveBeenCalledWith(vehiculoCreado);
  });

  it("debe devolver el listado completo de vehículos", async () => {
    const vehiculos = [
      {
        id: "vehiculo-1",
        matricula: "1234ABC",
        marca: "Seat",
        modelo: "Ibiza",
        tipoPermiso: "B",
        activo: true,
      },
      {
        id: "vehiculo-2",
        matricula: "5678DEF",
        marca: "Toyota",
        modelo: "Corolla",
        tipoPermiso: "B",
        activo: true,
      },
    ];

    const serviceMock = {
      getAll: vi.fn().mockResolvedValue(vehiculos),
    };

    const controller = new VehiculosController(serviceMock);

    const req = {};

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.getAll(req, res);

    expect(serviceMock.getAll).toHaveBeenCalledOnce();

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith(vehiculos);
  });

  it("debe devolver un vehículo por id", async () => {
    const vehiculo = {
      id: "vehiculo-1",
      matricula: "1234ABC",
      marca: "Seat",
      modelo: "Ibiza",
      tipoPermiso: "B",
      activo: true,
    };

    const serviceMock = {
      getById: vi.fn().mockResolvedValue(vehiculo),
    };

    const controller = new VehiculosController(serviceMock);

    const req = {
      params: {
        id: "vehiculo-1",
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.getById(req, res);

    expect(serviceMock.getById).toHaveBeenCalledWith("vehiculo-1");

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith(vehiculo);
  });

  it("debe actualizar un vehículo existente", async () => {
    const vehiculoActualizado = {
      id: "vehiculo-1",
      matricula: "1234ABC",
      marca: "Seat",
      modelo: "León",
      tipoPermiso: "B",
      activo: true,
    };

    const serviceMock = {
      update: vi.fn().mockResolvedValue(vehiculoActualizado),
    };

    const controller = new VehiculosController(serviceMock);

    const req = {
      params: {
        id: "vehiculo-1",
      },
      body: {
        modelo: "León",
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.update(req, res);

    expect(serviceMock.update).toHaveBeenCalledWith("vehiculo-1", {
      modelo: "León",
    });

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith(vehiculoActualizado);
  });

  it("debe desactivar un vehículo existente", async () => {
    const vehiculoDesactivado = {
      id: "vehiculo-1",
      matricula: "1234ABC",
      marca: "Seat",
      modelo: "Ibiza",
      tipoPermiso: "B",
      activo: false,
    };

    const serviceMock = {
      deactivate: vi.fn().mockResolvedValue(vehiculoDesactivado),
    };

    const controller = new VehiculosController(serviceMock);

    const req = {
      params: {
        id: "vehiculo-1",
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.deactivate(req, res);

    expect(serviceMock.deactivate).toHaveBeenCalledWith("vehiculo-1");

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith(vehiculoDesactivado);
  });
});
