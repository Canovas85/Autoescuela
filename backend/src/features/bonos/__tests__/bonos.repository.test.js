import { describe, it, expect, vi } from "vitest";

import { BonosRepository } from "../bonos.repository.js";

describe("BonosRepository", () => {
  it("debe crear un bono utilizando Prisma", async () => {
    const bonoCreado = {
      id: "bono-1",
      nombre: "Pack 10",
      clasesIncluidas: 10,
      validezDias: 90,
      activo: true,
    };

    const prismaMock = {
      bono: {
        create: vi.fn().mockResolvedValue(bonoCreado),
      },
    };

    const repository = new BonosRepository(prismaMock);

    const result = await repository.create({
      nombre: "Pack 10",
      descripcion: "Bono base",
      clasesIncluidas: 10,
      validezDias: 90,
      activo: true,
    });

    expect(prismaMock.bono.create).toHaveBeenCalledWith({
      data: {
        nombre: "Pack 10",
        descripcion: "Bono base",
        clasesIncluidas: 10,
        validezDias: 90,
        activo: true,
      },
    });
    expect(result).toEqual(bonoCreado);
  });

  it("debe devolver todos los bonos ordenados por activo y nombre", async () => {
    const bonos = [
      {
        id: "bono-1",
        nombre: "Pack 10",
      },
      {
        id: "bono-2",
        nombre: "Pack 20",
      },
    ];

    const prismaMock = {
      bono: {
        findMany: vi.fn().mockResolvedValue(bonos),
      },
    };

    const repository = new BonosRepository(prismaMock);

    const result = await repository.findAll();

    expect(prismaMock.bono.findMany).toHaveBeenCalledWith({
      orderBy: [{ activo: "desc" }, { nombre: "asc" }],
    });
    expect(result).toEqual(bonos);
  });

  it("debe devolver un bono por id", async () => {
    const bono = {
      id: "bono-1",
      nombre: "Pack 10",
    };

    const prismaMock = {
      bono: {
        findUnique: vi.fn().mockResolvedValue(bono),
      },
    };

    const repository = new BonosRepository(prismaMock);

    const result = await repository.findById("bono-1");

    expect(prismaMock.bono.findUnique).toHaveBeenCalledWith({
      where: {
        id: "bono-1",
      },
    });
    expect(result).toEqual(bono);
  });

  it("debe actualizar un bono existente", async () => {
    const bonoActualizado = {
      id: "bono-1",
      nombre: "Pack 10 renovado",
    };

    const prismaMock = {
      bono: {
        update: vi.fn().mockResolvedValue(bonoActualizado),
      },
    };

    const repository = new BonosRepository(prismaMock);

    const result = await repository.update("bono-1", {
      nombre: "Pack 10 renovado",
      descripcion: "Renovado",
      clasesIncluidas: 10,
      validezDias: 90,
      activo: true,
    });

    expect(prismaMock.bono.update).toHaveBeenCalledWith({
      where: {
        id: "bono-1",
      },
      data: {
        nombre: "Pack 10 renovado",
        descripcion: "Renovado",
        clasesIncluidas: 10,
        validezDias: 90,
        activo: true,
      },
    });
    expect(result).toEqual(bonoActualizado);
  });

  it("debe eliminar un bono existente", async () => {
    const bonoEliminado = {
      id: "bono-1",
    };

    const prismaMock = {
      bono: {
        delete: vi.fn().mockResolvedValue(bonoEliminado),
      },
    };

    const repository = new BonosRepository(prismaMock);

    const result = await repository.delete("bono-1");

    expect(prismaMock.bono.delete).toHaveBeenCalledWith({
      where: {
        id: "bono-1",
      },
    });
    expect(result).toEqual(bonoEliminado);
  });

  it("debe activar un bono", async () => {
    const bonoActivado = {
      id: "bono-1",
      activo: true,
    };

    const prismaMock = {
      bono: {
        update: vi.fn().mockResolvedValue(bonoActivado),
      },
    };

    const repository = new BonosRepository(prismaMock);

    const result = await repository.activate("bono-1");

    expect(prismaMock.bono.update).toHaveBeenCalledWith({
      where: {
        id: "bono-1",
      },
      data: {
        activo: true,
      },
    });
    expect(result).toEqual(bonoActivado);
  });

  it("debe desactivar un bono", async () => {
    const bonoDesactivado = {
      id: "bono-1",
      activo: false,
    };

    const prismaMock = {
      bono: {
        update: vi.fn().mockResolvedValue(bonoDesactivado),
      },
    };

    const repository = new BonosRepository(prismaMock);

    const result = await repository.deactivate("bono-1");

    expect(prismaMock.bono.update).toHaveBeenCalledWith({
      where: {
        id: "bono-1",
      },
      data: {
        activo: false,
      },
    });
    expect(result).toEqual(bonoDesactivado);
  });
});
