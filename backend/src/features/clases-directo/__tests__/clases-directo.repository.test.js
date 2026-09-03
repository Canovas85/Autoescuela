import { describe, it, expect, vi } from "vitest";

import { ClasesDirectoRepository } from "../clases-directo.repository.js";

describe("ClasesDirectoRepository", () => {
  it("debe devolver todas las clases directas con profesor incluido", async () => {
    const clases = [
      { id: "clase-directo-1", titulo: "Manejo en ciudad" },
      { id: "clase-directo-2", titulo: "Manejo en autopista" },
    ];

    const prismaMock = {
      claseDirecto: {
        findMany: vi.fn().mockResolvedValue(clases),
      },
    };

    const repository = new ClasesDirectoRepository(prismaMock);

    const result = await repository.findAll();

    expect(prismaMock.claseDirecto.findMany).toHaveBeenCalledWith({
      include: {
        profesor: {
          include: {
            usuario: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    expect(result).toEqual(clases);
  });

  it("debe devolver solo las clases directas activas", async () => {
    const clases = [
      { id: "clase-directo-1", titulo: "Manejo en ciudad", activa: true },
    ];

    const prismaMock = {
      claseDirecto: {
        findMany: vi.fn().mockResolvedValue(clases),
      },
    };

    const repository = new ClasesDirectoRepository(prismaMock);

    const result = await repository.findAllActive();

    expect(prismaMock.claseDirecto.findMany).toHaveBeenCalledWith({
      where: {
        activa: true,
      },
      include: {
        profesor: {
          include: {
            usuario: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    expect(result).toEqual(clases);
  });

  it("debe devolver una clase directa por id con profesor incluido", async () => {
    const clase = { id: "clase-directo-1", titulo: "Manejo en ciudad" };

    const prismaMock = {
      claseDirecto: {
        findUnique: vi.fn().mockResolvedValue(clase),
      },
    };

    const repository = new ClasesDirectoRepository(prismaMock);

    const result = await repository.findById("clase-directo-1");

    expect(prismaMock.claseDirecto.findUnique).toHaveBeenCalledWith({
      where: {
        id: "clase-directo-1",
      },
      include: {
        profesor: {
          include: {
            usuario: true,
          },
        },
      },
    });

    expect(result).toEqual(clase);
  });

  it("debe crear una clase directa utilizando Prisma", async () => {
    const claseCreada = {
      id: "clase-directo-1",
      titulo: "Manejo en ciudad",
      videoUrl: "https://youtube.com/watch?v=abc123",
      activa: true,
    };

    const prismaMock = {
      claseDirecto: {
        create: vi.fn().mockResolvedValue(claseCreada),
      },
    };

    const repository = new ClasesDirectoRepository(prismaMock);

    const result = await repository.create({
      titulo: "Manejo en ciudad",
      videoUrl: "https://youtube.com/watch?v=abc123",
      activa: true,
    });

    expect(prismaMock.claseDirecto.create).toHaveBeenCalledWith({
      data: {
        titulo: "Manejo en ciudad",
        videoUrl: "https://youtube.com/watch?v=abc123",
        activa: true,
      },
    });

    expect(result).toEqual(claseCreada);
  });

  it("debe actualizar una clase directa existente", async () => {
    const claseActualizada = {
      id: "clase-directo-1",
      titulo: "Manejo en ciudad actualizado",
      videoUrl: "https://youtube.com/watch?v=nuevo",
    };

    const prismaMock = {
      claseDirecto: {
        update: vi.fn().mockResolvedValue(claseActualizada),
      },
    };

    const repository = new ClasesDirectoRepository(prismaMock);

    const result = await repository.update("clase-directo-1", {
      titulo: "Manejo en ciudad actualizado",
      videoUrl: "https://youtube.com/watch?v=nuevo",
    });

    expect(prismaMock.claseDirecto.update).toHaveBeenCalledWith({
      where: {
        id: "clase-directo-1",
      },
      data: {
        titulo: "Manejo en ciudad actualizado",
        videoUrl: "https://youtube.com/watch?v=nuevo",
      },
    });

    expect(result).toEqual(claseActualizada);
  });

  it("debe desactivar una clase directa", async () => {
    const claseDesactivada = { id: "clase-directo-1", activa: false };

    const prismaMock = {
      claseDirecto: {
        update: vi.fn().mockResolvedValue(claseDesactivada),
      },
    };

    const repository = new ClasesDirectoRepository(prismaMock);

    const result = await repository.deactivate("clase-directo-1");

    expect(prismaMock.claseDirecto.update).toHaveBeenCalledWith({
      where: {
        id: "clase-directo-1",
      },
      data: {
        activa: false,
      },
    });

    expect(result).toEqual(claseDesactivada);
  });

  it("debe activar una clase directa", async () => {
    const claseActivada = { id: "clase-directo-1", activa: true };

    const prismaMock = {
      claseDirecto: {
        update: vi.fn().mockResolvedValue(claseActivada),
      },
    };

    const repository = new ClasesDirectoRepository(prismaMock);

    const result = await repository.activate("clase-directo-1");

    expect(prismaMock.claseDirecto.update).toHaveBeenCalledWith({
      where: {
        id: "clase-directo-1",
      },
      data: {
        activa: true,
      },
    });

    expect(result).toEqual(claseActivada);
  });
});
