import { describe, it, expect, vi } from "vitest";

import { PromocionesRepository } from "../promociones.repository.js";

describe("PromocionesRepository", () => {
  it("debe crear una promoción utilizando Prisma", async () => {
    const promocionCreada = {
      id: "promo-1",
      nombre: "Promoción verano",
      precioOriginal: 600,
      precioPromocional: 450,
      licenciasAplicables: ["B", "A1"],
      activa: true,
    };

    const prismaMock = {
      promocion: {
        create: vi.fn().mockResolvedValue(promocionCreada),
      },
    };

    const repository = new PromocionesRepository(prismaMock);

    const result = await repository.create({
      nombre: "Promoción verano",
      precioOriginal: 600,
      precioPromocional: 450,
      licenciasAplicables: ["B", "A1"],
      activa: true,
    });

    expect(prismaMock.promocion.create).toHaveBeenCalledWith({
      data: {
        nombre: "Promoción verano",
        precioOriginal: 600,
        precioPromocional: 450,
        licenciasAplicables: ["B", "A1"],
        activa: true,
      },
    });

    expect(result).toEqual(promocionCreada);
  });

  it("debe devolver todas las promociones ordenadas por activa y nombre", async () => {
    const promociones = [
      { id: "promo-1", nombre: "Promoción verano", activa: true },
      { id: "promo-2", nombre: "Promoción otoño", activa: false },
    ];

    const prismaMock = {
      promocion: {
        findMany: vi.fn().mockResolvedValue(promociones),
      },
    };

    const repository = new PromocionesRepository(prismaMock);

    const result = await repository.findAll();

    expect(prismaMock.promocion.findMany).toHaveBeenCalledWith({
      orderBy: [{ activa: "desc" }, { nombre: "asc" }],
    });

    expect(result).toEqual(promociones);
  });

  it("debe devolver una promoción por id", async () => {
    const promocion = { id: "promo-1", nombre: "Promoción verano" };

    const prismaMock = {
      promocion: {
        findUnique: vi.fn().mockResolvedValue(promocion),
      },
    };

    const repository = new PromocionesRepository(prismaMock);

    const result = await repository.findById("promo-1");

    expect(prismaMock.promocion.findUnique).toHaveBeenCalledWith({
      where: {
        id: "promo-1",
      },
    });

    expect(result).toEqual(promocion);
  });

  it("debe actualizar una promoción existente", async () => {
    const promocionActualizada = {
      id: "promo-1",
      nombre: "Nuevo nombre",
      precioPromocional: 400,
    };

    const prismaMock = {
      promocion: {
        update: vi.fn().mockResolvedValue(promocionActualizada),
      },
    };

    const repository = new PromocionesRepository(prismaMock);

    const result = await repository.update("promo-1", {
      nombre: "Nuevo nombre",
      precioPromocional: 400,
    });

    expect(prismaMock.promocion.update).toHaveBeenCalledWith({
      where: {
        id: "promo-1",
      },
      data: {
        nombre: "Nuevo nombre",
        precioPromocional: 400,
      },
    });

    expect(result).toEqual(promocionActualizada);
  });

  it("debe borrar una promoción", async () => {
    const promocionEliminada = { id: "promo-1", nombre: "Promoción verano" };

    const prismaMock = {
      promocion: {
        delete: vi.fn().mockResolvedValue(promocionEliminada),
      },
    };

    const repository = new PromocionesRepository(prismaMock);

    const result = await repository.delete("promo-1");

    expect(prismaMock.promocion.delete).toHaveBeenCalledWith({
      where: {
        id: "promo-1",
      },
    });

    expect(result).toEqual(promocionEliminada);
  });

  it("debe activar una promoción", async () => {
    const promocionActivada = { id: "promo-1", activa: true };

    const prismaMock = {
      promocion: {
        update: vi.fn().mockResolvedValue(promocionActivada),
      },
    };

    const repository = new PromocionesRepository(prismaMock);

    const result = await repository.activate("promo-1");

    expect(prismaMock.promocion.update).toHaveBeenCalledWith({
      where: {
        id: "promo-1",
      },
      data: {
        activa: true,
      },
    });

    expect(result).toEqual(promocionActivada);
  });

  it("debe desactivar una promoción", async () => {
    const promocionDesactivada = { id: "promo-1", activa: false };

    const prismaMock = {
      promocion: {
        update: vi.fn().mockResolvedValue(promocionDesactivada),
      },
    };

    const repository = new PromocionesRepository(prismaMock);

    const result = await repository.deactivate("promo-1");

    expect(prismaMock.promocion.update).toHaveBeenCalledWith({
      where: {
        id: "promo-1",
      },
      data: {
        activa: false,
      },
    });

    expect(result).toEqual(promocionDesactivada);
  });

  it("debe devolver solo las promociones publicadas y activas", async () => {
    const promociones = [
      { id: "promo-1", nombre: "Promoción pública", activa: true },
    ];

    const prismaMock = {
      promocion: {
        findMany: vi.fn().mockResolvedValue(promociones),
      },
    };

    const repository = new PromocionesRepository(prismaMock);

    const result = await repository.findPublic();

    expect(prismaMock.promocion.findMany).toHaveBeenCalledWith({
      where: {
        activa: true,
      },
      orderBy: [{ createdAt: "desc" }],
    });

    expect(result).toEqual(promociones);
  });

  it("debe buscar la mejor promoción aplicable para una licencia", async () => {
    const promo = {
      id: "promo-1",
      nombre: "Promo B",
      licencia: "B",
      activa: true,
      precioPromocional: 400,
    };

    const prismaMock = {
      promocion: {
        findFirst: vi.fn().mockResolvedValue(promo),
      },
    };

    const repository = new PromocionesRepository(prismaMock);

    const result = await repository.findBestPromotionForLicense("B");

    expect(prismaMock.promocion.findFirst).toHaveBeenCalledWith({
      where: {
        activa: true,
        licenciasAplicables: { has: "B" },
        OR: [{ fechaInicio: null }, { fechaInicio: { lte: expect.any(Date) } }],
        AND: [
          {
            OR: [{ fechaFin: null }, { fechaFin: { gte: expect.any(Date) } }],
          },
        ],
      },
      orderBy: {
        precioPromocional: "asc",
      },
    });

    expect(result).toEqual(promo);
  });
});
