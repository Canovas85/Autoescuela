import { describe, it, expect, vi } from "vitest";

import { PagosRepository } from "../pagos.repository.js";

describe("PagosRepository", () => {
  it("debe listar todos los pagos con relaciones", async () => {
    const pagos = [{ id: "pago-1" }];

    const prismaMock = {
      pago: {
        findMany: vi.fn().mockResolvedValue(pagos),
      },
    };

    const repository = new PagosRepository(prismaMock);

    const result = await repository.findAll();

    expect(prismaMock.pago.findMany).toHaveBeenCalledWith({
      include: {
        alumno: {
          include: {
            usuario: true,
          },
        },
        matricula: true,
      },
      orderBy: [{ estado: "asc" }, { fechaCreacion: "desc" }],
    });
    expect(result).toEqual(pagos);
  });

  it("debe listar pagos por alumno", async () => {
    const pagos = [{ id: "pago-1", alumnoId: "alumno-1" }];

    const prismaMock = {
      pago: {
        findMany: vi.fn().mockResolvedValue(pagos),
      },
    };

    const repository = new PagosRepository(prismaMock);

    const result = await repository.findByAlumnoId("alumno-1");

    expect(prismaMock.pago.findMany).toHaveBeenCalledWith({
      where: {
        alumnoId: "alumno-1",
      },
      include: {
        matricula: true,
      },
      orderBy: [{ estado: "asc" }, { fechaCreacion: "desc" }],
    });
    expect(result).toEqual(pagos);
  });

  it("debe marcar pago como pagado y crear factura asociada", async () => {
    const fechaPago = new Date("2026-09-08T10:00:00.000Z");
    vi.useFakeTimers();
    vi.setSystemTime(fechaPago);

    const txMock = {
      pago: {
        update: vi.fn().mockResolvedValue({
          id: "pago-1",
          alumnoId: "alumno-1",
          matriculaId: "matricula-1",
          concepto: "Tasa DGT (Tasa 2.1)",
          importe: 94.05,
          estado: "PAGADO",
        }),
      },
      factura: {
        create: vi.fn().mockResolvedValue({ id: "factura-1" }),
      },
    };

    const prismaMock = {
      $transaction: vi.fn(async (callback) => callback(txMock)),
    };

    const repository = new PagosRepository(prismaMock);

    const result = await repository.pay("pago-1");

    expect(txMock.pago.update).toHaveBeenCalledWith({
      where: {
        id: "pago-1",
      },
      data: {
        estado: "PAGADO",
        fechaPago,
        numeroFacturaPago: expect.stringMatching(/^FAC-PAGO-/),
      },
    });

    expect(txMock.factura.create).toHaveBeenCalledWith({
      data: {
        numero: expect.stringMatching(/^FAC-PAGO-/),
        alumnoId: "alumno-1",
        matriculaId: "matricula-1",
        concepto: "Tasa DGT (Tasa 2.1)",
        baseImponible: 94.05,
        descuento: 0,
        total: 94.05,
        estado: "PAGADA",
        fechaPago,
      },
    });

    expect(result.id).toBe("pago-1");
    vi.useRealTimers();
  });

  it("no debe crear factura si el pago no tiene matrícula", async () => {
    const txMock = {
      pago: {
        update: vi.fn().mockResolvedValue({
          id: "pago-1",
          alumnoId: "alumno-1",
          matriculaId: null,
          concepto: "Otro concepto",
          importe: 50,
          estado: "PAGADO",
        }),
      },
      factura: {
        create: vi.fn(),
      },
    };

    const prismaMock = {
      $transaction: vi.fn(async (callback) => callback(txMock)),
    };

    const repository = new PagosRepository(prismaMock);

    await repository.pay("pago-1");

    expect(txMock.factura.create).not.toHaveBeenCalled();
  });
});
