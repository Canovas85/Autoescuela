import { describe, it, expect, vi } from "vitest";

import { TarifasConceptoService } from "../tarifas-concepto.service.js";

describe("TarifasConceptoService", () => {
  it("debe crear una tarifa de concepto cuando los datos son válidos", async () => {
    const tarifaCreada = {
      id: "tarifa-1",
      permiso: "A",
      concepto: "Tasa DGT (Tasa 2.1)",
      precio: 94.05,
      tipo: "FIJO",
      descripcion: "Obligatoria para derecho a examen",
      activa: true,
    };

    const repositoryMock = {
      findByPermisoYConcepto: vi.fn().mockResolvedValue(null),
      createMany: vi.fn().mockResolvedValue([tarifaCreada]),
    };

    const service = new TarifasConceptoService(repositoryMock);

    const result = await service.create({
      permiso: " a ",
      concepto: "  Tasa DGT (Tasa 2.1)  ",
      precio: "94.05",
      tipo: "FIJO",
      descripcion: "  Obligatoria para derecho a examen  ",
    });

    expect(repositoryMock.findByPermisoYConcepto).toHaveBeenCalledWith(
      "A",
      "Tasa DGT (Tasa 2.1)",
    );
    expect(repositoryMock.createMany).toHaveBeenCalledWith([
      {
        permiso: "A",
        concepto: "Tasa DGT (Tasa 2.1)",
        precio: 94.05,
        tipo: "FIJO",
        descripcion: "Obligatoria para derecho a examen",
        activa: true,
      },
    ]);
    expect(result).toEqual(tarifaCreada);
  });

  it("debe crear varias tarifas cuando se envían múltiples permisos", async () => {
    const repositoryMock = {
      findByPermisoYConcepto: vi.fn().mockResolvedValue(null),
      createMany: vi.fn().mockResolvedValue([
        {
          id: "tarifa-1",
          permiso: "A",
          concepto: "Tasa DGT (Tasa 2.1)",
          precio: 94.05,
          tipo: "FIJO",
          descripcion: null,
          activa: true,
        },
        {
          id: "tarifa-2",
          permiso: "B",
          concepto: "Tasa DGT (Tasa 2.1)",
          precio: 94.05,
          tipo: "FIJO",
          descripcion: null,
          activa: true,
        },
      ]),
    };

    const service = new TarifasConceptoService(repositoryMock);

    const result = await service.create({
      permiso: ["a", "B"],
      concepto: "Tasa DGT (Tasa 2.1)",
      precio: 94.05,
      tipo: "FIJO",
    });

    expect(repositoryMock.findByPermisoYConcepto).toHaveBeenCalledTimes(2);
    expect(repositoryMock.createMany).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(2);
  });

  it("debe lanzar un error cuando ya existe la combinación permiso + concepto", async () => {
    const repositoryMock = {
      findByPermisoYConcepto: vi.fn().mockResolvedValue({ id: "tarifa-1" }),
      createMany: vi.fn(),
    };

    const service = new TarifasConceptoService(repositoryMock);

    await expect(
      service.create({
        permiso: "A",
        concepto: "Tasa DGT (Tasa 2.1)",
        precio: 94.05,
        tipo: "FIJO",
      }),
    ).rejects.toThrow("Ya existe un concepto para el permiso A");

    expect(repositoryMock.createMany).not.toHaveBeenCalled();
  });

  it("debe lanzar un error cuando el precio no es válido", async () => {
    const repositoryMock = {
      findByPermisoYConcepto: vi.fn().mockResolvedValue(null),
      createMany: vi.fn(),
    };

    const service = new TarifasConceptoService(repositoryMock);

    await expect(
      service.create({
        permiso: "A",
        concepto: "Tasa DGT (Tasa 2.1)",
        precio: "-1",
        tipo: "FIJO",
      }),
    ).rejects.toThrow("El precio debe ser mayor que 0");
  });

  it("debe devolver todas las tarifas de un permiso", async () => {
    const tarifas = [
      {
        id: "tarifa-1",
        permiso: "A",
        concepto: "Tasa DGT (Tasa 2.1)",
        activa: true,
      },
      { id: "tarifa-2", permiso: "A", concepto: "Psicotécnico", activa: true },
    ];

    const repositoryMock = {
      findAll: vi.fn().mockResolvedValue(tarifas),
    };

    const service = new TarifasConceptoService(repositoryMock);

    const result = await service.getAll({ permiso: "A" });

    expect(repositoryMock.findAll).toHaveBeenCalledWith({ permiso: "A" });
    expect(result).toEqual(tarifas);
  });

  it("debe lanzar un error si la tarifa no existe", async () => {
    const repositoryMock = {
      findById: vi.fn().mockResolvedValue(null),
    };

    const service = new TarifasConceptoService(repositoryMock);

    await expect(service.getById("tarifa-404")).rejects.toThrow(
      "Tarifa no encontrada",
    );
  });
});
