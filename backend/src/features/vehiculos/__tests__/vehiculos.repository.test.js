import { describe, it, expect, vi } from "vitest";

import { VehiculosRepository } from "../vehiculos.repository.js";

describe("VehiculosRepository", () => {
  it("debe crear un vehículo utilizando Prisma", async () => {
    const vehiculoCreado = {
      id: "vehiculo-1",
      matricula: "1234ABC",
      marca: "Seat",
      modelo: "Ibiza",
      tipoPermiso: "B",
      activo: true,
    };

    const prismaMock = {
      vehiculo: {
        create: vi.fn().mockResolvedValue(vehiculoCreado),
      },
    };

    const repository = new VehiculosRepository(prismaMock);

    const result = await repository.create({
      matricula: "1234ABC",
      marca: "Seat",
      modelo: "Ibiza",
      tipoPermiso: "B",
      activo: true,
    });

    expect(prismaMock.vehiculo.create).toHaveBeenCalledWith({
      data: {
        matricula: "1234ABC",
        marca: "Seat",
        modelo: "Ibiza",
        tipoPermiso: "B",
        activo: true,
      },
    });

    expect(result).toEqual(vehiculoCreado);
  });

  it("debe buscar un vehículo por matrícula", async () => {
    const vehiculo = {
      id: "vehiculo-1",
      matricula: "1234ABC",
      marca: "Seat",
      modelo: "Ibiza",
      tipoPermiso: "B",
      activo: true,
    };

    const prismaMock = {
      vehiculo: {
        findFirst: vi.fn().mockResolvedValue(vehiculo),
      },
    };

    const repository = new VehiculosRepository(prismaMock);

    const result = await repository.findByMatricula("1234ABC");

    expect(prismaMock.vehiculo.findFirst).toHaveBeenCalledWith({
      where: {
        matricula: "1234ABC",
      },
    });

    expect(result).toEqual(vehiculo);
  });

  it("debe devolver todos los vehículos", async () => {
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

    const prismaMock = {
      vehiculo: {
        findMany: vi.fn().mockResolvedValue(vehiculos),
      },
    };

    const repository = new VehiculosRepository(prismaMock);

    const result = await repository.findAll();

    expect(prismaMock.vehiculo.findMany).toHaveBeenCalledOnce();

    expect(result).toEqual(vehiculos);
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

    const prismaMock = {
      vehiculo: {
        findUnique: vi.fn().mockResolvedValue(vehiculo),
      },
    };

    const repository = new VehiculosRepository(prismaMock);

    const result = await repository.findById("vehiculo-1");

    expect(prismaMock.vehiculo.findUnique).toHaveBeenCalledWith({
      where: {
        id: "vehiculo-1",
      },
    });

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

    const prismaMock = {
      vehiculo: {
        update: vi.fn().mockResolvedValue(vehiculoActualizado),
      },
    };

    const repository = new VehiculosRepository(prismaMock);

    const result = await repository.update("vehiculo-1", {
      modelo: "León",
    });

    expect(prismaMock.vehiculo.update).toHaveBeenCalledWith({
      where: {
        id: "vehiculo-1",
      },
      data: {
        modelo: "León",
      },
    });

    expect(result).toEqual(vehiculoActualizado);
  });

  it("debe realizar la baja lógica de un vehículo", async () => {
    const vehiculoDesactivado = {
      id: "vehiculo-1",
      matricula: "1234ABC",
      marca: "Seat",
      modelo: "Ibiza",
      tipoPermiso: "B",
      activo: false,
    };

    const prismaMock = {
      vehiculo: {
        update: vi.fn().mockResolvedValue(vehiculoDesactivado),
      },
    };

    const repository = new VehiculosRepository(prismaMock);

    const result = await repository.deactivate("vehiculo-1");

    expect(prismaMock.vehiculo.update).toHaveBeenCalledWith({
      where: {
        id: "vehiculo-1",
      },
      data: {
        activo: false,
      },
    });

    expect(result).toEqual(vehiculoDesactivado);
  });
});
