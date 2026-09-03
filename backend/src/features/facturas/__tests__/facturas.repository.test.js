import { describe, expect, it, vi } from "vitest";

import { FacturasRepository } from "../facturas.repository.js";

describe("FacturasRepository", () => {
  it("debe listar todas las facturas con relaciones", async () => {
    const facturas = [{ id: "fac-1" }];

    const prismaMock = {
      factura: {
        findMany: vi.fn().mockResolvedValue(facturas),
      },
    };

    const repository = new FacturasRepository(prismaMock);

    const result = await repository.findAll();

    expect(prismaMock.factura.findMany).toHaveBeenCalledWith({
      include: {
        alumno: {
          include: {
            usuario: true,
          },
        },
        matricula: {
          include: {
            promocion: true,
          },
        },
      },
      orderBy: {
        fechaEmision: "desc",
      },
    });

    expect(result).toEqual(facturas);
  });

  it("debe listar facturas por alumno", async () => {
    const facturas = [{ id: "fac-1", alumnoId: "alumno-1" }];

    const prismaMock = {
      factura: {
        findMany: vi.fn().mockResolvedValue(facturas),
      },
    };

    const repository = new FacturasRepository(prismaMock);

    const result = await repository.findByAlumnoId("alumno-1");

    expect(prismaMock.factura.findMany).toHaveBeenCalledWith({
      where: {
        alumnoId: "alumno-1",
      },
      include: {
        matricula: {
          include: {
            promocion: true,
          },
        },
      },
      orderBy: {
        fechaEmision: "desc",
      },
    });

    expect(result).toEqual(facturas);
  });
});
