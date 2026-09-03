import { describe, it, expect, vi } from "vitest";

import { TarifasMatriculaRepository } from "../tarifas-matricula.repository.js";

describe("TarifasMatriculaRepository", () => {
  it("debe crear una tarifa usando Prisma", async () => {
    const tarifaCreada = {
      id: "tarifa-1",
      licencia: "B",
      precio: 650,
      activa: true,
    };

    const prismaMock = {
      tarifaMatricula: {
        create: vi.fn().mockResolvedValue(tarifaCreada),
      },
    };

    const repository = new TarifasMatriculaRepository(prismaMock);

    const result = await repository.create({
      licencia: "B",
      precio: 650,
      activa: true,
    });

    expect(prismaMock.tarifaMatricula.create).toHaveBeenCalledWith({
      data: {
        licencia: "B",
        precio: 650,
        activa: true,
      },
    });

    expect(result).toEqual(tarifaCreada);
  });

  it("debe devolver todas las tarifas ordenadas por activa y licencia", async () => {
    const tarifas = [
      { id: "tarifa-1", licencia: "B", precio: 650, activa: true },
      { id: "tarifa-2", licencia: "A", precio: 800, activa: false },
    ];

    const prismaMock = {
      tarifaMatricula: {
        findMany: vi.fn().mockResolvedValue(tarifas),
      },
    };

    const repository = new TarifasMatriculaRepository(prismaMock);

    const result = await repository.findAll();

    expect(prismaMock.tarifaMatricula.findMany).toHaveBeenCalledWith({
      orderBy: [{ activa: "desc" }, { licencia: "asc" }],
    });

    expect(result).toEqual(tarifas);
  });

  it("debe devolver una tarifa por id", async () => {
    const tarifa = { id: "tarifa-1", licencia: "B", precio: 650, activa: true };

    const prismaMock = {
      tarifaMatricula: {
        findUnique: vi.fn().mockResolvedValue(tarifa),
      },
    };

    const repository = new TarifasMatriculaRepository(prismaMock);

    const result = await repository.findById("tarifa-1");

    expect(prismaMock.tarifaMatricula.findUnique).toHaveBeenCalledWith({
      where: {
        id: "tarifa-1",
      },
    });

    expect(result).toEqual(tarifa);
  });

  it("debe buscar una tarifa por licencia", async () => {
    const tarifa = { id: "tarifa-1", licencia: "B", precio: 650, activa: true };

    const prismaMock = {
      tarifaMatricula: {
        findUnique: vi.fn().mockResolvedValue(tarifa),
      },
    };

    const repository = new TarifasMatriculaRepository(prismaMock);

    const result = await repository.findByLicencia("B");

    expect(prismaMock.tarifaMatricula.findUnique).toHaveBeenCalledWith({
      where: {
        licencia: "B",
      },
    });

    expect(result).toEqual(tarifa);
  });

  it("debe actualizar una tarifa existente", async () => {
    const tarifaActualizada = {
      id: "tarifa-1",
      licencia: "B",
      precio: 700,
      activa: true,
    };

    const prismaMock = {
      tarifaMatricula: {
        update: vi.fn().mockResolvedValue(tarifaActualizada),
      },
    };

    const repository = new TarifasMatriculaRepository(prismaMock);

    const result = await repository.update("tarifa-1", {
      licencia: "B",
      precio: 700,
    });

    expect(prismaMock.tarifaMatricula.update).toHaveBeenCalledWith({
      where: {
        id: "tarifa-1",
      },
      data: {
        licencia: "B",
        precio: 700,
      },
    });

    expect(result).toEqual(tarifaActualizada);
  });

  it("debe borrar una tarifa", async () => {
    const tarifaEliminada = { id: "tarifa-1", licencia: "B", precio: 650 };

    const prismaMock = {
      tarifaMatricula: {
        delete: vi.fn().mockResolvedValue(tarifaEliminada),
      },
    };

    const repository = new TarifasMatriculaRepository(prismaMock);

    const result = await repository.delete("tarifa-1");

    expect(prismaMock.tarifaMatricula.delete).toHaveBeenCalledWith({
      where: {
        id: "tarifa-1",
      },
    });

    expect(result).toEqual(tarifaEliminada);
  });

  it("debe activar una tarifa", async () => {
    const tarifaActivada = { id: "tarifa-1", licencia: "B", activa: true };

    const prismaMock = {
      tarifaMatricula: {
        update: vi.fn().mockResolvedValue(tarifaActivada),
      },
    };

    const repository = new TarifasMatriculaRepository(prismaMock);

    const result = await repository.activate("tarifa-1");

    expect(prismaMock.tarifaMatricula.update).toHaveBeenCalledWith({
      where: {
        id: "tarifa-1",
      },
      data: {
        activa: true,
      },
    });

    expect(result).toEqual(tarifaActivada);
  });

  it("debe desactivar una tarifa", async () => {
    const tarifaDesactivada = { id: "tarifa-1", licencia: "B", activa: false };

    const prismaMock = {
      tarifaMatricula: {
        update: vi.fn().mockResolvedValue(tarifaDesactivada),
      },
    };

    const repository = new TarifasMatriculaRepository(prismaMock);

    const result = await repository.deactivate("tarifa-1");

    expect(prismaMock.tarifaMatricula.update).toHaveBeenCalledWith({
      where: {
        id: "tarifa-1",
      },
      data: {
        activa: false,
      },
    });

    expect(result).toEqual(tarifaDesactivada);
  });
});
