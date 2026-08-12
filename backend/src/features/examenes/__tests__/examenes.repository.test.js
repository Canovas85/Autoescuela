import { describe, it, expect, vi } from "vitest";

import { ExamenesRepository } from "../examenes.repository.js";

describe("ExamenesRepository", () => {
  it("debe crear un examen utilizando Prisma", async () => {
    const examenCreado = {
      id: "examen-1",
      alumnoId: "alumno-1",
      tipo: "TEORICO",
      fecha: "2026-10-10T09:00:00Z",
      estado: "PROGRAMADO",
    };

    const prismaMock = {
      examen: {
        create: vi.fn().mockResolvedValue(examenCreado),
      },
    };

    const repository = new ExamenesRepository(prismaMock);

    const result = await repository.create({
      alumnoId: "alumno-1",
      tipo: "TEORICO",
      fecha: "2026-10-10T09:00:00Z",
      estado: "PROGRAMADO",
    });

    expect(prismaMock.examen.create).toHaveBeenCalledWith({
      data: {
        alumnoId: "alumno-1",
        tipo: "TEORICO",
        fecha: "2026-10-10T09:00:00Z",
        estado: "PROGRAMADO",
      },
    });

    expect(result).toEqual(examenCreado);
  });
  it("debe devolver todos los exámenes", async () => {
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

    const prismaMock = {
      examen: {
        findMany: vi.fn().mockResolvedValue(examenes),
      },
    };

    const repository = new ExamenesRepository(prismaMock);

    const result = await repository.findAll();

    expect(prismaMock.examen.findMany).toHaveBeenCalledOnce();

    expect(result).toEqual(examenes);
  });
  it("debe devolver un examen por id", async () => {
    const examen = {
      id: "examen-1",
      alumnoId: "alumno-1",
      tipo: "TEORICO",
      fecha: "2026-10-10T09:00:00Z",
      estado: "PROGRAMADO",
    };

    const prismaMock = {
      examen: {
        findUnique: vi.fn().mockResolvedValue(examen),
      },
    };

    const repository = new ExamenesRepository(prismaMock);

    const result = await repository.findById("examen-1");

    expect(prismaMock.examen.findUnique).toHaveBeenCalledWith({
      where: {
        id: "examen-1",
      },
    });

    expect(result).toEqual(examen);
  });
  it("debe actualizar un examen existente", async () => {
    const examenActualizado = {
      id: "examen-1",
      alumnoId: "alumno-1",
      tipo: "PRACTICO",
      fecha: "2026-10-15T11:00:00Z",
      estado: "PROGRAMADO",
    };

    const prismaMock = {
      examen: {
        update: vi.fn().mockResolvedValue(examenActualizado),
      },
    };

    const repository = new ExamenesRepository(prismaMock);

    const result = await repository.update("examen-1", {
      tipo: "PRACTICO",
      fecha: "2026-10-15T11:00:00Z",
    });

    expect(prismaMock.examen.update).toHaveBeenCalledWith({
      where: {
        id: "examen-1",
      },
      data: {
        tipo: "PRACTICO",
        fecha: "2026-10-15T11:00:00Z",
      },
    });

    expect(result).toEqual(examenActualizado);
  });
});
