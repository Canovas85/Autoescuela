import { describe, it, expect, vi } from "vitest";

import { AlumnosRepository } from "../alumnos.repository.js";

describe("AlumnosRepository", () => {
  it("debe crear un alumno utilizando Prisma", async () => {
    const alumnoCreado = {
      id: "alumno-id",
      nombre: "Pedro Sánchez",
      email: "pedro@autodrive.com",
      rol: "ALUMNO",
      activo: true,
    };

    const prismaMock = {
      alumno: {
        create: vi.fn().mockResolvedValue(alumnoCreado),
      },
    };

    const repository = new AlumnosRepository(prismaMock);

    const result = await repository.create({
      nombre: "Pedro Sánchez",
      email: "pedro@autodrive.com",
      password: "hash",
    });

    expect(prismaMock.alumno.create).toHaveBeenCalledWith({
      data: {
        nombre: "Pedro Sánchez",
        email: "pedro@autodrive.com",
        password: "hash",
      },
    });

    expect(result).toEqual(alumnoCreado);
  });

  it("debe buscar un alumno por email", async () => {
    const alumno = {
      id: "alumno-1",
      nombre: "Pedro Sánchez",
      email: "pedro@autodrive.com",
      rol: "ALUMNO",
      activo: true,
    };

    const prismaMock = {
      alumno: {
        findFirst: vi.fn().mockResolvedValue(alumno),
      },
    };

    const repository = new AlumnosRepository(prismaMock);

    const result = await repository.findByEmail("pedro@autodrive.com");

    expect(prismaMock.alumno.findFirst).toHaveBeenCalledWith({
      where: {
        email: "pedro@autodrive.com",
      },
    });

    expect(result).toEqual(alumno);
  });
  it("debe devolver todos los alumnos", async () => {
    const alumnos = [
      {
        id: "alumno-1",
        nombre: "Pedro Sánchez",
        email: "pedro@autodrive.com",
        activo: true,
      },
      {
        id: "alumno-2",
        nombre: "Laura Martín",
        email: "laura@autodrive.com",
        activo: true,
      },
    ];

    const prismaMock = {
      alumno: {
        findMany: vi.fn().mockResolvedValue(alumnos),
      },
    };

    const repository = new AlumnosRepository(prismaMock);

    const result = await repository.findAll();

    expect(prismaMock.alumno.findMany).toHaveBeenCalledOnce();

    expect(result).toEqual(alumnos);
  });
  it("debe devolver un alumno por id", async () => {
    const alumno = {
      id: "alumno-1",
      nombre: "Pedro Sánchez",
      email: "pedro@autodrive.com",
      tipoLicencia: "B",
      activo: true,
    };

    const prismaMock = {
      alumno: {
        findUnique: vi.fn().mockResolvedValue(alumno),
      },
    };

    const repository = new AlumnosRepository(prismaMock);

    const result = await repository.findById("alumno-1");

    expect(prismaMock.alumno.findUnique).toHaveBeenCalledWith({
      where: {
        id: "alumno-1",
      },
    });

    expect(result).toEqual(alumno);
  });

  it("debe actualizar un alumno existente", async () => {
    const alumnoActualizado = {
      id: "alumno-1",
      nombre: "Pedro Sánchez Actualizado",
      email: "pedro@autodrive.com",
      telefono: "699999999",
      tipoLicencia: "B",
      activo: true,
    };

    const prismaMock = {
      alumno: {
        update: vi.fn().mockResolvedValue(alumnoActualizado),
      },
    };

    const repository = new AlumnosRepository(prismaMock);

    const result = await repository.update("alumno-1", {
      nombre: "Pedro Sánchez Actualizado",
      telefono: "699999999",
    });

    expect(prismaMock.alumno.update).toHaveBeenCalledWith({
      where: {
        id: "alumno-1",
      },
      data: {
        nombre: "Pedro Sánchez Actualizado",
        telefono: "699999999",
      },
    });

    expect(result).toEqual(alumnoActualizado);
  });

  it("debe realizar la baja lógica de un alumno", async () => {
    const alumnoDesactivado = {
      id: "alumno-1",
      nombre: "Pedro Sánchez",
      email: "pedro@autodrive.com",
      activo: false,
    };

    const prismaMock = {
      alumno: {
        update: vi.fn().mockResolvedValue(alumnoDesactivado),
      },
    };

    const repository = new AlumnosRepository(prismaMock);

    const result = await repository.deactivate("alumno-1");

    expect(prismaMock.alumno.update).toHaveBeenCalledWith({
      where: {
        id: "alumno-1",
      },
      data: {
        activo: false,
      },
    });

    expect(result).toEqual(alumnoDesactivado);
  });
});
