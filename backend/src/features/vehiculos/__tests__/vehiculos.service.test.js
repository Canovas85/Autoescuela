import { describe, it, expect, vi } from "vitest";

import { VehiculosService } from "../vehiculos.service.js";

describe("VehiculosService", () => {
  it("debe crear un vehículo cuando los datos son válidos", async () => {
    const vehiculoCreado = {
      id: "vehiculo-1",
      matricula: "1234ABC",
      marca: "Seat",
      modelo: "Ibiza",
      tipoPermiso: "B",
      activo: true,
    };

    const repositoryMock = {
      findByMatricula: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue(vehiculoCreado),
    };

    const service = new VehiculosService(repositoryMock);

    const result = await service.create({
      matricula: "1234ABC",
      marca: "Seat",
      modelo: "Ibiza",
      tipoPermiso: "B",
    });
    expect(repositoryMock.create).toHaveBeenCalledOnce();

    expect(result).toEqual(vehiculoCreado);
  });

  it("debe lanzar un error cuando la matrícula es obligatoria", async () => {
    const repositoryMock = {
      create: vi.fn(),
    };

    const service = new VehiculosService(repositoryMock);

    await expect(
      service.create({
        marca: "Seat",
        modelo: "Ibiza",
        tipoPermiso: "B",
      }),
    ).rejects.toThrow("La matrícula es obligatoria");

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });

  it("debe lanzar un error cuando la matrícula ya existe", async () => {
    const repositoryMock = {
      findByMatricula: vi.fn().mockResolvedValue({
        id: "vehiculo-1",
        matricula: "1234ABC",
      }),
      create: vi.fn(),
    };

    const service = new VehiculosService(repositoryMock);

    await expect(
      service.create({
        matricula: "1234ABC",
        marca: "Seat",
        modelo: "Ibiza",
        tipoPermiso: "B",
      }),
    ).rejects.toThrow("La matrícula ya existe");

    expect(repositoryMock.findByMatricula).toHaveBeenCalledWith("1234ABC");

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });

  it("debe lanzar un error cuando el tipo de permiso es obligatorio", async () => {
    const repositoryMock = {
      findByMatricula: vi.fn().mockResolvedValue(null),
      create: vi.fn(),
    };

    const service = new VehiculosService(repositoryMock);

    await expect(
      service.create({
        matricula: "1234ABC",
        marca: "Seat",
        modelo: "Ibiza",
      }),
    ).rejects.toThrow("El tipo de permiso es obligatorio");

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });

  it("debe crear siempre el vehículo como activo aunque se envíe activo false", async () => {
    const repositoryMock = {
      findByMatricula: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockImplementation(async (data) => data),
    };

    const service = new VehiculosService(repositoryMock);

    const result = await service.create({
      matricula: "1234ABC",
      marca: "Seat",
      modelo: "Ibiza",
      tipoPermiso: "B",
      activo: false,
    });

    expect(result.activo).toBe(true);
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

    const repositoryMock = {
      findAll: vi.fn().mockResolvedValue(vehiculos),
    };

    const service = new VehiculosService(repositoryMock);

    const result = await service.getAll();

    expect(repositoryMock.findAll).toHaveBeenCalledOnce();

    expect(result).toEqual(vehiculos);
  });

  it("debe devolver un vehículo cuando existe el id", async () => {
    const vehiculo = {
      id: "vehiculo-1",
      matricula: "1234ABC",
      marca: "Seat",
      modelo: "Ibiza",
      tipoPermiso: "B",
      activo: true,
    };

    const repositoryMock = {
      findById: vi.fn().mockResolvedValue(vehiculo),
    };

    const service = new VehiculosService(repositoryMock);

    const result = await service.getById("vehiculo-1");

    expect(repositoryMock.findById).toHaveBeenCalledWith("vehiculo-1");

    expect(result).toEqual(vehiculo);
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

    const repositoryMock = {
      update: vi.fn().mockResolvedValue(vehiculoActualizado),
    };

    const service = new VehiculosService(repositoryMock);

    const result = await service.update("vehiculo-1", {
      modelo: "León",
    });

    expect(repositoryMock.update).toHaveBeenCalledWith("vehiculo-1", {
      modelo: "León",
    });

    expect(result).toEqual(vehiculoActualizado);
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

    const repositoryMock = {
      deactivate: vi.fn().mockResolvedValue(vehiculoDesactivado),
    };

    const service = new VehiculosService(repositoryMock);

    const result = await service.deactivate("vehiculo-1");

    expect(repositoryMock.deactivate).toHaveBeenCalledWith("vehiculo-1");

    expect(result).toEqual(vehiculoDesactivado);
  });
});
