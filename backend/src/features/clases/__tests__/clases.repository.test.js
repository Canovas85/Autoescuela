import { describe, it, expect, vi } from "vitest";

import { ClasesRepository } from "../clases.repository.js";

describe("ClasesRepository", () => {
  it("debe crear una clase práctica utilizando Prisma", async () => {
    const claseCreada = {
      id: "clase-1",
      alumnoId: "alumno-1",
      profesorId: "profesor-1",
      vehiculoId: "vehiculo-1",
      fecha: "2026-09-01T10:00:00Z",
      duracion: 60,
      estado: "PROGRAMADA",
    };

    const prismaMock = {
      clasePractica: {
        create: vi.fn().mockResolvedValue(claseCreada),
      },
    };

    const repository = new ClasesRepository(prismaMock);

    const result = await repository.create({
      alumnoId: "alumno-1",
      profesorId: "profesor-1",
      vehiculoId: "vehiculo-1",
      fecha: "2026-09-01T10:00:00Z",
      duracion: 60,
      estado: "PROGRAMADA",
    });

    expect(prismaMock.clasePractica.create).toHaveBeenCalledWith({
      data: {
        alumnoId: "alumno-1",
        profesorId: "profesor-1",
        vehiculoId: "vehiculo-1",
        fecha: "2026-09-01T10:00:00Z",
        duracion: 60,
        estado: "PROGRAMADA",
      },
    });

    expect(result).toEqual(claseCreada);
  });
  it("debe devolver todas las clases prácticas", async () => {
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

    const prismaMock = {
      clasePractica: {
        findMany: vi.fn().mockResolvedValue(clases),
      },
    };

    const repository = new ClasesRepository(prismaMock);

    const result = await repository.findAll();

    expect(prismaMock.clasePractica.findMany).toHaveBeenCalledOnce();

    expect(result).toEqual(clases);
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

    const prismaMock = {
      clasePractica: {
        findUnique: vi.fn().mockResolvedValue(clase),
      },
    };

    const repository = new ClasesRepository(prismaMock);

    const result = await repository.findById("clase-1");

    expect(prismaMock.clasePractica.findUnique).toHaveBeenCalledWith({
      where: {
        id: "clase-1",
      },
    });

    expect(result).toEqual(clase);
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

    const prismaMock = {
      clasePractica: {
        update: vi.fn().mockResolvedValue(claseActualizada),
      },
    };

    const repository = new ClasesRepository(prismaMock);

    const result = await repository.update("clase-1", {
      fecha: "2026-09-02T10:00:00Z",
      duracion: 90,
    });

    expect(prismaMock.clasePractica.update).toHaveBeenCalledWith({
      where: {
        id: "clase-1",
      },
      data: {
        fecha: "2026-09-02T10:00:00Z",
        duracion: 90,
      },
    });

    expect(result).toEqual(claseActualizada);
  });

  it("debe cancelar una clase práctica", async () => {
    const claseCancelada = {
      id: "clase-1",
      alumnoId: "alumno-1",
      profesorId: "profesor-1",
      vehiculoId: "vehiculo-1",
      fecha: "2026-09-01T10:00:00Z",
      duracion: 60,
      estado: "CANCELADA",
    };

    const prismaMock = {
      clasePractica: {
        update: vi.fn().mockResolvedValue(claseCancelada),
      },
    };

    const repository = new ClasesRepository(prismaMock);

    const result = await repository.cancel("clase-1");

    expect(prismaMock.clasePractica.update).toHaveBeenCalledWith({
      where: {
        id: "clase-1",
      },
      data: {
        estado: "CANCELADA",
      },
    });

    expect(result).toEqual(claseCancelada);
  });
  it("debe buscar una clase por profesor y fecha", async () => {
    const clase = {
      id: "clase-1",
      profesorId: "profesor-1",
      fecha: "2026-09-01T10:00:00Z",
    };

    const prismaMock = {
      clasePractica: {
        findFirst: vi.fn().mockResolvedValue(clase),
      },
    };

    const repository = new ClasesRepository(prismaMock);

    const result = await repository.findByProfesorAndFecha(
      "profesor-1",
      "2026-09-01T10:00:00Z",
    );

    expect(prismaMock.clasePractica.findFirst).toHaveBeenCalledWith({
      where: {
        profesorId: "profesor-1",
        fecha: "2026-09-01T10:00:00Z",
      },
    });

    expect(result).toEqual(clase);
  });
  it("debe buscar una clase por vehículo y fecha", async () => {
    const clase = {
      id: "clase-1",
      vehiculoId: "vehiculo-1",
      fecha: "2026-09-01T10:00:00Z",
    };

    const prismaMock = {
      clasePractica: {
        findFirst: vi.fn().mockResolvedValue(clase),
      },
    };

    const repository = new ClasesRepository(prismaMock);

    const result = await repository.findByVehiculoAndFecha(
      "vehiculo-1",
      "2026-09-01T10:00:00Z",
    );

    expect(prismaMock.clasePractica.findFirst).toHaveBeenCalledWith({
      where: {
        vehiculoId: "vehiculo-1",
        fecha: "2026-09-01T10:00:00Z",
      },
    });

    expect(result).toEqual(clase);
  });
  it("debe buscar una clase por alumno y fecha", async () => {
    const clase = {
      id: "clase-1",
      alumnoId: "alumno-1",
      fecha: "2026-09-01T10:00:00Z",
    };

    const prismaMock = {
      clasePractica: {
        findFirst: vi.fn().mockResolvedValue(clase),
      },
    };

    const repository = new ClasesRepository(prismaMock);

    const result = await repository.findByAlumnoAndFecha(
      "alumno-1",
      "2026-09-01T10:00:00Z",
    );

    expect(prismaMock.clasePractica.findFirst).toHaveBeenCalledWith({
      where: {
        alumnoId: "alumno-1",
        fecha: "2026-09-01T10:00:00Z",
      },
    });

    expect(result).toEqual(clase);
  });
});
