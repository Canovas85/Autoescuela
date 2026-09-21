import { describe, expect, it, vi } from "vitest";

import { FacturasService } from "../facturas.service.js";

describe("FacturasService", () => {
  it("debe devolver todas las facturas", async () => {
    const facturas = [{ id: "fac-1" }, { id: "fac-2" }];

    const repositoryMock = {
      findAll: vi.fn().mockResolvedValue(facturas),
    };

    const service = new FacturasService(repositoryMock);

    const result = await service.getAll();

    expect(repositoryMock.findAll).toHaveBeenCalledOnce();
    expect(result).toEqual(facturas);
  });

  it("debe devolver las facturas del alumno autenticado", async () => {
    const facturas = [{ id: "fac-1", alumnoId: "alumno-1" }];

    const repositoryMock = {
      findByAlumnoId: vi.fn().mockResolvedValue(facturas),
    };

    const service = new FacturasService(repositoryMock);

    const result = await service.getMine("alumno-1");

    expect(repositoryMock.findByAlumnoId).toHaveBeenCalledWith("alumno-1");
    expect(result).toEqual(facturas);
  });

  it("debe devolver preview de factura por id", async () => {
    const repositoryMock = {
      findById: vi.fn().mockResolvedValue({
        id: "fac-1",
        numero: "F-0001",
        concepto: "Matricula",
        estado: "EMITIDA",
        fechaEmision: "2026-09-18T00:00:00.000Z",
        fechaPago: null,
        baseImponible: "100.00",
        descuento: "10.00",
        total: "90.00",
        alumno: {
          id: "a-1",
          usuario: {
            nombre: "Alumno Uno",
            email: "alumno@demo.com",
            telefono: "600000000",
            dni: "12345678Z",
          },
        },
        matricula: { licencia: "B" },
        compraBono: null,
        clasePractica: null,
      }),
    };

    const service = new FacturasService(repositoryMock);
    const result = await service.getPreview("fac-1");

    expect(repositoryMock.findById).toHaveBeenCalledWith("fac-1");
    expect(result.numero).toBe("F-0001");
    expect(result.licencia).toBe("B");
    expect(result.alumno.nombre).toBe("Alumno Uno");
  });

  it("debe fallar si el email de envio no es valido", async () => {
    const repositoryMock = {
      findById: vi.fn(),
    };

    const emailServiceMock = {
      sendEmail: vi.fn(),
    };

    const service = new FacturasService(repositoryMock, emailServiceMock);

    await expect(service.sendDuplicate("fac-1", "")).rejects.toThrow(
      "Debes indicar un email valido para el envio",
    );
  });
});
