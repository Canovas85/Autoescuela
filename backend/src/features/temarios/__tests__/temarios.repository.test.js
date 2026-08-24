import { describe, it, expect, vi } from "vitest";

import { TemariosRepository } from "../temarios.repository.js";

describe("TemariosRepository", () => {
  it("debe crear un temario utilizando Prisma", async () => {
    const temarioCreado = {
      id: "temario-1",
      titulo: "Señales",
      tipoLicenciaObjetivo: "B",
      orden: 1,
    };

    const prismaMock = {
      temario: {
        create: vi.fn().mockResolvedValue(temarioCreado),
      },
    };

    const repository = new TemariosRepository(prismaMock);

    const result = await repository.create({
      titulo: "Señales",
      descripcion: "Temario base",
      tipoLicenciaObjetivo: "B",
      orden: 1,
    });

    expect(prismaMock.temario.create).toHaveBeenCalledWith({
      data: {
        titulo: "Señales",
        descripcion: "Temario base",
        tipoLicenciaObjetivo: "B",
        orden: 1,
      },
    });
    expect(result).toEqual(temarioCreado);
  });

  it("debe devolver todos los temarios ordenados por permiso y orden", async () => {
    const temarios = [
      {
        id: "temario-1",
        titulo: "Señales",
      },
      {
        id: "temario-2",
        titulo: "Prioridad",
      },
    ];

    const prismaMock = {
      temario: {
        findMany: vi.fn().mockResolvedValue(temarios),
      },
    };

    const repository = new TemariosRepository(prismaMock);

    const result = await repository.findAll();

    expect(prismaMock.temario.findMany).toHaveBeenCalledWith({
      orderBy: [{ tipoLicenciaObjetivo: "asc" }, { orden: "asc" }],
    });
    expect(result).toEqual(temarios);
  });

  it("debe devolver un temario por id", async () => {
    const temario = {
      id: "temario-1",
      titulo: "Señales",
    };

    const prismaMock = {
      temario: {
        findUnique: vi.fn().mockResolvedValue(temario),
      },
    };

    const repository = new TemariosRepository(prismaMock);

    const result = await repository.findById("temario-1");

    expect(prismaMock.temario.findUnique).toHaveBeenCalledWith({
      where: {
        id: "temario-1",
      },
    });
    expect(result).toEqual(temario);
  });

  it("debe actualizar un temario existente", async () => {
    const temarioActualizado = {
      id: "temario-1",
      titulo: "Prioridad",
      tipoLicenciaObjetivo: "B",
      orden: 2,
    };

    const prismaMock = {
      temario: {
        update: vi.fn().mockResolvedValue(temarioActualizado),
      },
    };

    const repository = new TemariosRepository(prismaMock);

    const result = await repository.update("temario-1", {
      titulo: "Prioridad",
      descripcion: "Temario actualizado",
      tipoLicenciaObjetivo: "B",
      orden: 2,
    });

    expect(prismaMock.temario.update).toHaveBeenCalledWith({
      where: {
        id: "temario-1",
      },
      data: {
        titulo: "Prioridad",
        descripcion: "Temario actualizado",
        tipoLicenciaObjetivo: "B",
        orden: 2,
      },
    });
    expect(result).toEqual(temarioActualizado);
  });

  it("debe eliminar un temario existente", async () => {
    const temarioEliminado = {
      id: "temario-1",
    };

    const prismaMock = {
      temario: {
        delete: vi.fn().mockResolvedValue(temarioEliminado),
      },
    };

    const repository = new TemariosRepository(prismaMock);

    const result = await repository.delete("temario-1");

    expect(prismaMock.temario.delete).toHaveBeenCalledWith({
      where: {
        id: "temario-1",
      },
    });
    expect(result).toEqual(temarioEliminado);
  });
});
