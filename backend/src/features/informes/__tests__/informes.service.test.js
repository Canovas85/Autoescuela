import { describe, expect, it, vi } from "vitest";

import { InformesService } from "../informes.service.js";

describe("InformesService", () => {
  it("calcula KPIs y movimientos del informe contable", async () => {
    const repositoryMock = {
      findFacturasBetween: vi.fn().mockResolvedValue([
        {
          id: "fac-1",
          numero: "FAC-1",
          concepto: "Matricula permiso B",
          estado: "PAGADA",
          total: 300,
          fechaEmision: new Date("2026-10-01T10:00:00.000Z"),
          fechaPago: new Date("2026-10-01T10:05:00.000Z"),
          alumno: { usuario: { nombre: "Alumno A" } },
        },
        {
          id: "fac-2",
          numero: "FAC-2",
          concepto: "Matricula permiso A2",
          estado: "PENDIENTE",
          total: 200,
          fechaEmision: new Date("2026-10-02T10:00:00.000Z"),
          alumno: { usuario: { nombre: "Alumno B" } },
        },
      ]),
      findPagosBetween: vi.fn().mockResolvedValue([
        {
          id: "pay-1",
          concepto: "Matricula permiso B",
          estado: "PAGADO",
          importe: 300,
          fechaCreacion: new Date("2026-10-01T09:00:00.000Z"),
          fechaPago: new Date("2026-10-01T10:05:00.000Z"),
          numeroFacturaPago: "FAC-1",
          alumno: { usuario: { nombre: "Alumno A" } },
        },
      ]),
      findGastosCombustibleBetween: vi.fn().mockResolvedValue([
        {
          id: "gas-1",
          numeroFactura: "GAS-1",
          total: 50,
          createdAt: new Date("2026-10-03T12:00:00.000Z"),
          vehiculo: { matricula: "1234ABC", marca: "Seat", modelo: "Ibiza" },
        },
      ]),
    };

    const service = new InformesService(repositoryMock);

    const result = await service.getAdminAccountingReport({
      period: "CUSTOM",
      dateFrom: "2026-10-01",
      dateTo: "2026-10-05",
    });

    expect(result.kpis.ingresosTotales).toBe(300);
    expect(result.kpis.gastosTotales).toBe(50);
    expect(result.kpis.beneficioNeto).toBe(250);
    expect(result.kpis.cobrosPendientesMatricula).toBe(200);
    expect(result.movimientos.length).toBe(4);
    expect(result.distribucionIngresos[0].categoria).toBe("Matrículas");
  });

  it("falla si el filtro personalizado no tiene rango completo", async () => {
    const repositoryMock = {
      findFacturasBetween: vi.fn(),
      findPagosBetween: vi.fn(),
      findGastosCombustibleBetween: vi.fn(),
    };

    const service = new InformesService(repositoryMock);

    await expect(
      service.getAdminAccountingReport({
        period: "CUSTOM",
        dateFrom: "2026-10-01",
      }),
    ).rejects.toThrow("dateTo");
  });
});
