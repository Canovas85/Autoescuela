import { describe, it, expect, vi } from "vitest";

import { MatriculasRepository } from "../matriculas.repository.js";

describe("MatriculasRepository", () => {
  it("debe crear una matrícula usando Prisma", async () => {
    const matriculaCreada = {
      id: "matricula-1",
      alumnoId: "alumno-1",
      promocionId: "promocion-1",
      estado: "PENDIENTE",
    };

    const prismaMock = {
      matricula: {
        create: vi.fn().mockResolvedValue(matriculaCreada),
      },
    };

    const repository = new MatriculasRepository(prismaMock);

    const result = await repository.create({
      alumnoId: "alumno-1",
      promocionId: "promocion-1",
      estado: "PENDIENTE",
    });

    expect(prismaMock.matricula.create).toHaveBeenCalledWith({
      data: {
        alumnoId: "alumno-1",
        promocionId: "promocion-1",
        estado: "PENDIENTE",
      },
    });

    expect(result).toEqual(matriculaCreada);
  });

  it("debe devolver todas las matrículas con alumno y promoción incluidos", async () => {
    const matriculas = [
      { id: "matricula-1", alumnoId: "alumno-1", estado: "PENDIENTE" },
      { id: "matricula-2", alumnoId: "alumno-2", estado: "PAGADA" },
    ];

    const prismaMock = {
      matricula: {
        findMany: vi.fn().mockResolvedValue(matriculas),
      },
    };

    const repository = new MatriculasRepository(prismaMock);

    const result = await repository.findAll();

    expect(prismaMock.matricula.findMany).toHaveBeenCalledWith({
      include: {
        alumno: {
          include: {
            usuario: true,
          },
        },
        promocion: true,
        factura: true,
      },
      orderBy: {
        fechaCreacion: "desc",
      },
    });

    expect(result).toEqual(matriculas);
  });

  it("debe devolver una matrícula por id con relaciones incluidas", async () => {
    const matricula = {
      id: "matricula-1",
      alumnoId: "alumno-1",
      estado: "PENDIENTE",
    };

    const prismaMock = {
      matricula: {
        findUnique: vi.fn().mockResolvedValue(matricula),
      },
    };

    const repository = new MatriculasRepository(prismaMock);

    const result = await repository.findById("matricula-1");

    expect(prismaMock.matricula.findUnique).toHaveBeenCalledWith({
      where: {
        id: "matricula-1",
      },
      include: {
        alumno: {
          include: {
            usuario: true,
          },
        },
        promocion: true,
        factura: true,
      },
    });

    expect(result).toEqual(matricula);
  });

  it("debe actualizar una matrícula existente", async () => {
    const matriculaActualizada = {
      id: "matricula-1",
      alumnoId: "alumno-1",
      promocionId: "promocion-2",
      estado: "PENDIENTE",
    };

    const prismaMock = {
      matricula: {
        update: vi.fn().mockResolvedValue(matriculaActualizada),
      },
    };

    const repository = new MatriculasRepository(prismaMock);

    const result = await repository.update("matricula-1", {
      promocionId: "promocion-2",
    });

    expect(prismaMock.matricula.update).toHaveBeenCalledWith({
      where: {
        id: "matricula-1",
      },
      data: {
        promocionId: "promocion-2",
      },
    });

    expect(result).toEqual(matriculaActualizada);
  });

  it("debe marcar una matrícula como pagada", async () => {
    const matriculaPagada = {
      id: "matricula-1",
      alumnoId: "alumno-1",
      estado: "PAGADA",
      fechaPago: new Date("2026-09-03T10:00:00Z"),
    };

    const prismaMock = {
      matricula: {
        update: vi.fn().mockResolvedValue(matriculaPagada),
      },
    };

    const repository = new MatriculasRepository(prismaMock);

    const result = await repository.pagar("matricula-1");

    expect(prismaMock.matricula.update).toHaveBeenCalledWith({
      where: {
        id: "matricula-1",
      },
      data: {
        estado: "PAGADA",
        fechaPago: expect.any(Date),
      },
    });

    expect(result).toEqual(matriculaPagada);
  });

  it("debe anular una matrícula", async () => {
    const matriculaAnulada = {
      id: "matricula-1",
      alumnoId: "alumno-1",
      estado: "ANULADA",
    };

    const prismaMock = {
      matricula: {
        update: vi.fn().mockResolvedValue(matriculaAnulada),
      },
    };

    const repository = new MatriculasRepository(prismaMock);

    const result = await repository.anular("matricula-1");

    expect(prismaMock.matricula.update).toHaveBeenCalledWith({
      where: {
        id: "matricula-1",
      },
      data: {
        estado: "ANULADA",
      },
    });

    expect(result).toEqual(matriculaAnulada);
  });

  it("debe buscar la matrícula del alumno por alumnoId", async () => {
    const matricula = {
      id: "matricula-1",
      alumnoId: "alumno-1",
      estado: "PENDIENTE",
    };

    const prismaMock = {
      matricula: {
        findFirst: vi.fn().mockResolvedValue(matricula),
      },
    };

    const repository = new MatriculasRepository(prismaMock);

    const result = await repository.findByAlumnoId("alumno-1");

    expect(prismaMock.matricula.findFirst).toHaveBeenCalledWith({
      where: {
        alumnoId: "alumno-1",
      },
      include: {
        promocion: true,
        factura: true,
      },
      orderBy: {
        fechaCreacion: "desc",
      },
    });

    expect(result).toEqual(matricula);
  });

  it("debe buscar la tarifa por licencia", async () => {
    const tarifa = {
      id: "tarifa-1",
      licencia: "B",
      precio: 500,
    };

    const prismaMock = {
      tarifaMatricula: {
        findUnique: vi.fn().mockResolvedValue(tarifa),
      },
    };

    const repository = new MatriculasRepository(prismaMock);

    const result = await repository.findTarifaByLicencia("B");

    expect(prismaMock.tarifaMatricula.findUnique).toHaveBeenCalledWith({
      where: {
        licencia: "B",
      },
    });

    expect(result).toEqual(tarifa);
  });

  it("debe buscar la matrícula activa por alumnoId", async () => {
    const matricula = {
      id: "matricula-1",
      alumnoId: "alumno-1",
      estado: "PENDIENTE",
    };

    const prismaMock = {
      matricula: {
        findFirst: vi.fn().mockResolvedValue(matricula),
      },
    };

    const repository = new MatriculasRepository(prismaMock);

    const result = await repository.findActiveByAlumnoId("alumno-1");

    expect(prismaMock.matricula.findFirst).toHaveBeenCalledWith({
      where: {
        alumnoId: "alumno-1",
      },
      orderBy: {
        fechaCreacion: "desc",
      },
    });

    expect(result).toEqual(matricula);
  });

  it("debe crear matrícula y factura en una transacción", async () => {
    const txMock = {
      matricula: {
        create: vi.fn().mockResolvedValue({ id: "matricula-1" }),
      },
      factura: {
        create: vi.fn().mockResolvedValue({ id: "factura-1" }),
      },
    };

    const prismaMock = {
      $transaction: vi.fn(async (callback) => callback(txMock)),
    };

    const repository = new MatriculasRepository(prismaMock);

    await repository.createWithFactura(
      {
        alumnoId: "alumno-1",
        licencia: "B",
        precioBase: 700,
        precioFinal: 650,
        promocionId: "promo-1",
        estado: "PENDIENTE",
      },
      {
        concepto: "Matricula licencia B - Promo",
        baseImponible: 700,
        descuento: 50,
        total: 650,
      },
    );

    expect(txMock.matricula.create).toHaveBeenCalledWith({
      data: {
        alumnoId: "alumno-1",
        licencia: "B",
        precioBase: 700,
        precioFinal: 650,
        promocionId: "promo-1",
        estado: "PENDIENTE",
      },
    });

    expect(txMock.factura.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          alumnoId: "alumno-1",
          matriculaId: "matricula-1",
          concepto: "Matricula licencia B - Promo",
          baseImponible: 700,
          descuento: 50,
          total: 650,
          estado: "EMITIDA",
        }),
      }),
    );
  });
});
