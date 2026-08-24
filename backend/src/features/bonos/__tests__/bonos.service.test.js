import { describe, it, expect, vi } from "vitest";

import { BonosService } from "../bonos.service.js";

describe("BonosService", () => {
  it("debe crear un bono cuando los datos son válidos", async () => {
    const bonoCreado = {
      id: "bono-1",
      nombre: "Pack 10",
      descripcion: "Bono base",
      clasesIncluidas: 10,
      validezDias: 90,
      activo: true,
    };

    const repositoryMock = {
      create: vi.fn().mockResolvedValue(bonoCreado),
    };

    const service = new BonosService(repositoryMock);

    const result = await service.create({
      nombre: " Pack 10 ",
      descripcion: " Bono base ",
      clasesIncluidas: "10",
      validezDias: "90",
    });

    expect(repositoryMock.create).toHaveBeenCalledWith({
      nombre: "Pack 10",
      descripcion: "Bono base",
      clasesIncluidas: 10,
      validezDias: 90,
      activo: true,
    });
    expect(result).toEqual(bonoCreado);
  });

  it("debe lanzar un error cuando el nombre es obligatorio", async () => {
    const repositoryMock = {
      create: vi.fn(),
    };

    const service = new BonosService(repositoryMock);

    await expect(
      service.create({
        clasesIncluidas: 10,
        validezDias: 90,
      }),
    ).rejects.toThrow("El nombre es obligatorio");
  });

  it("debe lanzar un error cuando las clases incluidas no son válidas", async () => {
    const repositoryMock = {
      create: vi.fn(),
    };

    const service = new BonosService(repositoryMock);

    await expect(
      service.create({
        nombre: "Pack 10",
        clasesIncluidas: 0,
        validezDias: 90,
      }),
    ).rejects.toThrow(
      "Las clases incluidas deben ser un número entero mayor que 0",
    );
  });

  it("debe lanzar un error cuando la validez no es válida", async () => {
    const repositoryMock = {
      create: vi.fn(),
    };

    const service = new BonosService(repositoryMock);

    await expect(
      service.create({
        nombre: "Pack 10",
        clasesIncluidas: 10,
        validezDias: 0,
      }),
    ).rejects.toThrow("La validez debe ser un número entero mayor que 0");
  });

  it("debe devolver todos los bonos", async () => {
    const bonos = [
      {
        id: "bono-1",
        nombre: "Pack 10",
      },
    ];

    const repositoryMock = {
      findAll: vi.fn().mockResolvedValue(bonos),
    };

    const service = new BonosService(repositoryMock);

    const result = await service.getAll();

    expect(repositoryMock.findAll).toHaveBeenCalledOnce();
    expect(result).toEqual(bonos);
  });

  it("debe devolver un bono por id", async () => {
    const bono = {
      id: "bono-1",
      nombre: "Pack 10",
    };

    const repositoryMock = {
      findById: vi.fn().mockResolvedValue(bono),
    };

    const service = new BonosService(repositoryMock);

    const result = await service.getById("bono-1");

    expect(repositoryMock.findById).toHaveBeenCalledWith("bono-1");
    expect(result).toEqual(bono);
  });

  it("debe lanzar un error cuando el bono no existe", async () => {
    const repositoryMock = {
      findById: vi.fn().mockResolvedValue(null),
    };

    const service = new BonosService(repositoryMock);

    await expect(service.getById("bono-1")).rejects.toThrow(
      "Bono no encontrado",
    );
  });

  it("debe activar y desactivar bonos", async () => {
    const repositoryMock = {
      activate: vi.fn().mockResolvedValue({ id: "bono-1", activo: true }),
      deactivate: vi.fn().mockResolvedValue({ id: "bono-1", activo: false }),
    };

    const service = new BonosService(repositoryMock);

    await expect(service.activate("bono-1")).resolves.toEqual({
      id: "bono-1",
      activo: true,
    });
    await expect(service.deactivate("bono-1")).resolves.toEqual({
      id: "bono-1",
      activo: false,
    });
  });

  it("debe eliminar un bono", async () => {
    const repositoryMock = {
      delete: vi.fn().mockResolvedValue({ id: "bono-1" }),
    };

    const service = new BonosService(repositoryMock);

    const result = await service.delete("bono-1");

    expect(repositoryMock.delete).toHaveBeenCalledWith("bono-1");
    expect(result).toEqual({ id: "bono-1" });
  });
});
