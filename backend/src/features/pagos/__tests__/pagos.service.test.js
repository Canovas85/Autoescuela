import { describe, it, expect, vi } from "vitest";

import { PagosService } from "../pagos.service.js";

describe("PagosService", () => {
  it("debe devolver pagos del alumno", async () => {
    const repositoryMock = {
      findByAlumnoId: vi.fn().mockResolvedValue([{ id: "pago-1" }]),
    };

    const service = new PagosService(repositoryMock);

    const result = await service.getMine("alumno-1");

    expect(repositoryMock.findByAlumnoId).toHaveBeenCalledWith("alumno-1");
    expect(result).toEqual([{ id: "pago-1" }]);
  });

  it("debe pagar un pago pendiente del propio alumno", async () => {
    const repositoryMock = {
      findById: vi.fn().mockResolvedValue({
        id: "pago-1",
        alumnoId: "alumno-1",
        estado: "PENDIENTE",
      }),
      pay: vi.fn().mockResolvedValue({
        id: "pago-1",
        estado: "PAGADO",
      }),
    };

    const service = new PagosService(repositoryMock);

    const result = await service.payMine("pago-1", "alumno-1");

    expect(repositoryMock.pay).toHaveBeenCalledWith("pago-1");
    expect(result.estado).toBe("PAGADO");
  });

  it("debe devolver un pago por id del propio alumno", async () => {
    const repositoryMock = {
      findById: vi.fn().mockResolvedValue({
        id: "pago-1",
        alumnoId: "alumno-1",
        estado: "PENDIENTE",
      }),
    };

    const service = new PagosService(repositoryMock);

    const result = await service.getMineById("pago-1", "alumno-1");

    expect(repositoryMock.findById).toHaveBeenCalledWith("pago-1");
    expect(result.id).toBe("pago-1");
  });

  it("debe lanzar error si el pago no existe", async () => {
    const repositoryMock = {
      findById: vi.fn().mockResolvedValue(null),
      pay: vi.fn(),
    };

    const service = new PagosService(repositoryMock);

    await expect(service.payMine("pago-1", "alumno-1")).rejects.toThrow(
      "Pago no encontrado",
    );

    expect(repositoryMock.pay).not.toHaveBeenCalled();
  });

  it("debe lanzar error si el pago por id pertenece a otro alumno", async () => {
    const repositoryMock = {
      findById: vi.fn().mockResolvedValue({
        id: "pago-1",
        alumnoId: "alumno-2",
        estado: "PENDIENTE",
      }),
    };

    const service = new PagosService(repositoryMock);

    await expect(service.getMineById("pago-1", "alumno-1")).rejects.toThrow(
      "No puedes acceder a un pago que no te pertenece",
    );
  });

  it("debe lanzar error si el pago pertenece a otro alumno", async () => {
    const repositoryMock = {
      findById: vi.fn().mockResolvedValue({
        id: "pago-1",
        alumnoId: "alumno-2",
        estado: "PENDIENTE",
      }),
      pay: vi.fn(),
    };

    const service = new PagosService(repositoryMock);

    await expect(service.payMine("pago-1", "alumno-1")).rejects.toThrow(
      "No puedes pagar un pago que no te pertenece",
    );

    expect(repositoryMock.pay).not.toHaveBeenCalled();
  });
});
