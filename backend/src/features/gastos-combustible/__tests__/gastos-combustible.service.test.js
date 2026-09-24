import { describe, expect, it, vi } from "vitest";

import { GastosCombustibleService } from "../gastos-combustible.service.js";

describe("GastosCombustibleService", () => {
  it("debe crear gasto y repostar al 100% cuando el vehículo está por debajo del 20%", async () => {
    const repositoryMock = {
      findProfesorById: vi.fn().mockResolvedValue({
        id: "profesor-1",
        permisosLicencias: ["B"],
      }),
      findVehiculoCompatible: vi.fn().mockResolvedValue({
        id: "vehiculo-1",
        matricula: "1234ABC",
        marca: "Seat",
        modelo: "Ibiza",
        tipoPermiso: "B",
        kmActuales: 152340,
        combustibleActualPct: 10,
      }),
      createGastoAndRefuelVehiculo: vi.fn().mockResolvedValue({
        id: "gasto-1",
        numeroFactura: "FAC-202609180001",
        titularTarjeta: "Autoescuela Eguzkilore",
        numeroTarjeta: "5102 1234 4321 5015",
        combustibleAntesPct: 10,
        combustibleDespuesPct: 100,
        litrosRepostados: "54.00",
        precioLitro: "1.83",
        total: "98.82",
        kilometrosVehiculo: 152340,
        rutaRecibo: null,
        createdAt: new Date("2026-09-18T08:00:00.000Z"),
        profesor: {
          id: "profesor-1",
          usuario: {
            nombre: "Profesor Demo",
            email: "profesor@demo.com",
          },
        },
        vehiculo: {
          id: "vehiculo-1",
          matricula: "1234ABC",
          marca: "Seat",
          modelo: "Ibiza",
          tipoPermiso: "B",
        },
      }),
    };

    const service = new GastosCombustibleService(repositoryMock);

    const result = await service.createRefuelExpense(
      "profesor-1",
      "vehiculo-1",
      null,
    );

    expect(repositoryMock.findProfesorById).toHaveBeenCalledWith("profesor-1");
    expect(repositoryMock.findVehiculoCompatible).toHaveBeenCalledWith(
      ["B"],
      "vehiculo-1",
    );
    expect(repositoryMock.createGastoAndRefuelVehiculo).toHaveBeenCalledWith(
      expect.objectContaining({
        profesorId: "profesor-1",
        vehiculoId: "vehiculo-1",
        titularTarjeta: "Autoescuela Eguzkilore",
        numeroTarjeta: "5102 1234 4321 5015",
        combustibleAntesPct: 10,
        litrosRepostados: "54.00",
        precioLitro: "1.83",
        total: "98.82",
        kilometrosVehiculo: 152340,
      }),
    );

    expect(result.gasto.combustibleDespuesPct).toBe(100);
    expect(result.resumenRepostaje.total).toBe(98.82);
  });

  it("debe rechazar repostaje si el combustible no está por debajo del 20%", async () => {
    const repositoryMock = {
      findProfesorById: vi.fn().mockResolvedValue({
        id: "profesor-1",
        permisosLicencias: ["B"],
      }),
      findVehiculoCompatible: vi.fn().mockResolvedValue({
        id: "vehiculo-1",
        tipoPermiso: "B",
        kmActuales: 1000,
        combustibleActualPct: 20,
      }),
    };

    const service = new GastosCombustibleService(repositoryMock);

    await expect(
      service.createRefuelExpense("profesor-1", "vehiculo-1", null),
    ).rejects.toThrow("menos del 20%");
  });

  it("debe listar gastos del profesor autenticado", async () => {
    const repositoryMock = {
      findMine: vi.fn().mockResolvedValue([
        {
          id: "gasto-1",
          numeroFactura: "FAC-202609180001",
          titularTarjeta: "Autoescuela Eguzkilore",
          numeroTarjeta: "5102 1234 4321 5015",
          combustibleAntesPct: 12,
          combustibleDespuesPct: 100,
          litrosRepostados: "52.80",
          precioLitro: "1.83",
          total: "96.62",
          kilometrosVehiculo: 84220,
          rutaRecibo: "/api/uploads/gastos-combustible/recibo.pdf",
          createdAt: new Date("2026-09-18T09:00:00.000Z"),
          profesor: {
            id: "profesor-1",
            usuario: {
              nombre: "Profesor Uno",
              email: "profesor1@demo.com",
            },
          },
          vehiculo: {
            id: "vehiculo-1",
            matricula: "1234ABC",
            marca: "Seat",
            modelo: "Ibiza",
            tipoPermiso: "B",
          },
        },
      ]),
    };

    const service = new GastosCombustibleService(repositoryMock);

    const result = await service.getMine("profesor-1");

    expect(repositoryMock.findMine).toHaveBeenCalledWith("profesor-1");
    expect(result).toHaveLength(1);
    expect(result[0].numeroFactura).toBe("FAC-202609180001");
    expect(result[0].vehiculo.matricula).toBe("1234ABC");
  });
});
