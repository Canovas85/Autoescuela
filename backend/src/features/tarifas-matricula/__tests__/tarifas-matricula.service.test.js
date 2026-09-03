import { describe, it, expect, vi } from "vitest";

import { TarifasMatriculaService } from "../tarifas-matricula.service.js";

describe("TarifasMatriculaService", () => {
  it("debe crear una tarifa cuando los datos son válidos", async () => {
    const tarifaCreada = {
      id: "tarifa-1",
      licencia: "B",
      precio: 650,
      activa: true,
    };

    const repositoryMock = {
      findByLicencia: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue(tarifaCreada),
    };

    const service = new TarifasMatriculaService(repositoryMock);

    const result = await service.create({
      licencia: " b ",
      precio: "650",
    });

    expect(repositoryMock.findByLicencia).toHaveBeenCalledWith(" b ");
    expect(repositoryMock.create).toHaveBeenCalledWith({
      licencia: "B",
      precio: 650,
      activa: true,
    });
    expect(result).toEqual(tarifaCreada);
  });

  it("debe lanzar un error si la licencia no es válida", async () => {
    const repositoryMock = {
      findByLicencia: vi.fn(),
      create: vi.fn(),
    };

    const service = new TarifasMatriculaService(repositoryMock);

    await expect(
      service.create({
        licencia: "X",
        precio: 650,
      }),
    ).rejects.toThrow("Licencia no válida");

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });

  it("debe lanzar un error si el precio es menor o igual a 0", async () => {
    const repositoryMock = {
      findByLicencia: vi.fn(),
      create: vi.fn(),
    };

    const service = new TarifasMatriculaService(repositoryMock);

    await expect(
      service.create({
        licencia: "B",
        precio: 0,
      }),
    ).rejects.toThrow("El precio debe ser mayor que 0");

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });

  it("debe lanzar un error si ya existe una tarifa para la licencia", async () => {
    const repositoryMock = {
      findByLicencia: vi
        .fn()
        .mockResolvedValue({ id: "tarifa-1", licencia: "B" }),
      create: vi.fn(),
    };

    const service = new TarifasMatriculaService(repositoryMock);

    await expect(
      service.create({
        licencia: "B",
        precio: 650,
      }),
    ).rejects.toThrow("Ya existe una tarifa para esa licencia");

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });

  it("debe devolver todas las tarifas", async () => {
    const tarifas = [
      { id: "tarifa-1", licencia: "B", precio: 650, activa: true },
      { id: "tarifa-2", licencia: "A", precio: 800, activa: false },
    ];

    const repositoryMock = {
      findAll: vi.fn().mockResolvedValue(tarifas),
    };

    const service = new TarifasMatriculaService(repositoryMock);

    const result = await service.getAll();

    expect(repositoryMock.findAll).toHaveBeenCalledOnce();
    expect(result).toEqual(tarifas);
  });

  it("debe devolver una tarifa por id cuando existe", async () => {
    const tarifa = { id: "tarifa-1", licencia: "B", precio: 650, activa: true };

    const repositoryMock = {
      findById: vi.fn().mockResolvedValue(tarifa),
    };

    const service = new TarifasMatriculaService(repositoryMock);

    const result = await service.getById("tarifa-1");

    expect(repositoryMock.findById).toHaveBeenCalledWith("tarifa-1");
    expect(result).toEqual(tarifa);
  });

  it("debe lanzar un error si la tarifa no existe", async () => {
    const repositoryMock = {
      findById: vi.fn().mockResolvedValue(null),
    };

    const service = new TarifasMatriculaService(repositoryMock);

    await expect(service.getById("tarifa-404")).rejects.toThrow(
      "Tarifa no encontrada",
    );
  });

  it("debe actualizar una tarifa existente", async () => {
    const tarifaActualizada = {
      id: "tarifa-1",
      licencia: "B",
      precio: 700,
      activa: true,
    };

    const repositoryMock = {
      update: vi.fn().mockResolvedValue(tarifaActualizada),
    };

    const service = new TarifasMatriculaService(repositoryMock);

    const result = await service.update("tarifa-1", {
      licencia: "B",
      precio: 700,
    });

    expect(repositoryMock.update).toHaveBeenCalledWith("tarifa-1", {
      licencia: "B",
      precio: 700,
      activa: true,
    });
    expect(result).toEqual(tarifaActualizada);
  });

  it("debe eliminar una tarifa", async () => {
    const repositoryMock = {
      delete: vi.fn().mockResolvedValue({ id: "tarifa-1" }),
    };

    const service = new TarifasMatriculaService(repositoryMock);

    const result = await service.delete("tarifa-1");

    expect(repositoryMock.delete).toHaveBeenCalledWith("tarifa-1");
    expect(result).toEqual({ id: "tarifa-1" });
  });

  it("debe activar una tarifa", async () => {
    const tarifaActivada = { id: "tarifa-1", licencia: "B", activa: true };

    const repositoryMock = {
      activate: vi.fn().mockResolvedValue(tarifaActivada),
    };

    const service = new TarifasMatriculaService(repositoryMock);

    const result = await service.activate("tarifa-1");

    expect(repositoryMock.activate).toHaveBeenCalledWith("tarifa-1");
    expect(result).toEqual(tarifaActivada);
  });

  it("debe desactivar una tarifa", async () => {
    const tarifaDesactivada = { id: "tarifa-1", licencia: "B", activa: false };

    const repositoryMock = {
      deactivate: vi.fn().mockResolvedValue(tarifaDesactivada),
    };

    const service = new TarifasMatriculaService(repositoryMock);

    const result = await service.deactivate("tarifa-1");

    expect(repositoryMock.deactivate).toHaveBeenCalledWith("tarifa-1");
    expect(result).toEqual(tarifaDesactivada);
  });
});
