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
      orderBy: [{ orden: "asc" }, { titulo: "asc" }],
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

  it("debe actualizar progreso existente al guardar mini test", async () => {
    const progresoActualizado = {
      id: "progreso-1",
      alumnoId: "alumno-1",
      temarioId: "temario-1",
      revisado: true,
      dominio: 80,
    };

    const prismaMock = {
      temarioProgreso: {
        findFirst: vi.fn().mockResolvedValue({ id: "progreso-1" }),
        update: vi.fn().mockResolvedValue(progresoActualizado),
      },
    };

    const repository = new TemariosRepository(prismaMock);

    const result = await repository.saveMiniTestResultado({
      alumnoId: "alumno-1",
      temarioId: "temario-1",
      dominio: 80,
    });

    expect(prismaMock.temarioProgreso.update).toHaveBeenCalled();
    expect(result).toEqual(progresoActualizado);
  });

  it("debe crear progreso si no existe al guardar mini test", async () => {
    const progresoCreado = {
      id: "progreso-2",
      alumnoId: "alumno-1",
      temarioId: "temario-1",
      revisado: true,
      dominio: 60,
    };

    const prismaMock = {
      temarioProgreso: {
        findFirst: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue(progresoCreado),
      },
    };

    const repository = new TemariosRepository(prismaMock);

    const result = await repository.saveMiniTestResultado({
      alumnoId: "alumno-1",
      temarioId: "temario-1",
      dominio: 60,
    });

    expect(prismaMock.temarioProgreso.create).toHaveBeenCalled();
    expect(result).toEqual(progresoCreado);
  });

  it("debe crear intento de mini test en tests_practica", async () => {
    const intentoCreado = {
      id: "test-1",
      resultado: "APROBADO",
      respuestasCorrectas: 5,
      totalPreguntas: 5,
    };

    const prismaMock = {
      testPractica: {
        create: vi.fn().mockResolvedValue(intentoCreado),
      },
    };

    const repository = new TemariosRepository(prismaMock);

    const result = await repository.createMiniTestIntento({
      alumnoId: "alumno-1",
      temarioId: "temario-1",
      aciertos: 5,
      totalPreguntas: 5,
      porcentaje: 100,
    });

    expect(prismaMock.testPractica.create).toHaveBeenCalled();
    expect(result).toEqual(intentoCreado);
  });

  it("debe devolver historial de intentos de mini test", async () => {
    const historial = [
      {
        id: "test-1",
        fecha: new Date(),
        resultado: "APROBADO",
        respuestasCorrectas: 4,
        totalPreguntas: 5,
      },
    ];

    const prismaMock = {
      testPractica: {
        findMany: vi.fn().mockResolvedValue(historial),
      },
    };

    const repository = new TemariosRepository(prismaMock);

    const result = await repository.getMiniTestHistorial(
      "alumno-1",
      "temario-1",
    );

    expect(prismaMock.testPractica.findMany).toHaveBeenCalled();
    expect(result).toEqual(historial);
  });
});
