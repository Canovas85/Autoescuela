import { describe, it, expect, vi } from "vitest";

import { TemariosService } from "../temarios.service.js";

describe("TemariosService", () => {
  it("debe crear un temario cuando los datos son válidos", async () => {
    const temarioCreado = {
      id: "temario-1",
      titulo: "Señales",
      descripcion: "Temario base",
      tipoLicenciaObjetivo: "B",
      orden: 1,
    };

    const repositoryMock = {
      create: vi.fn().mockResolvedValue(temarioCreado),
    };

    const service = new TemariosService(repositoryMock);

    const result = await service.create({
      titulo: " Señales ",
      descripcion: " Temario base ",
      tipoLicenciaObjetivo: "b",
      orden: "1",
    });

    expect(repositoryMock.create).toHaveBeenCalledWith({
      titulo: "Señales",
      descripcion: "Temario base",
      tipoLicenciaObjetivo: "B",
      orden: 1,
    });
    expect(result).toEqual(temarioCreado);
  });

  it("debe lanzar un error cuando el título es obligatorio", async () => {
    const repositoryMock = {
      create: vi.fn(),
    };

    const service = new TemariosService(repositoryMock);

    await expect(
      service.create({
        tipoLicenciaObjetivo: "B",
        orden: 1,
      }),
    ).rejects.toThrow("El título es obligatorio");

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });

  it("debe lanzar un error cuando la licencia objetivo no es válida", async () => {
    const repositoryMock = {
      create: vi.fn(),
    };

    const service = new TemariosService(repositoryMock);

    await expect(
      service.create({
        titulo: "Señales",
        tipoLicenciaObjetivo: "X",
        orden: 1,
      }),
    ).rejects.toThrow("El tipo de licencia objetivo no es válido");
  });

  it("debe lanzar un error cuando el orden no es un entero válido", async () => {
    const repositoryMock = {
      create: vi.fn(),
    };

    const service = new TemariosService(repositoryMock);

    await expect(
      service.create({
        titulo: "Señales",
        tipoLicenciaObjetivo: "B",
        orden: -1,
      }),
    ).rejects.toThrow("El orden debe ser un número entero igual o mayor que 0");
  });

  it("debe devolver todos los temarios", async () => {
    const temarios = [
      {
        id: "temario-1",
        titulo: "Señales",
      },
    ];

    const repositoryMock = {
      findAll: vi.fn().mockResolvedValue(temarios),
    };

    const service = new TemariosService(repositoryMock);

    const result = await service.getAll();

    expect(repositoryMock.findAll).toHaveBeenCalledOnce();
    expect(result).toEqual(temarios);
  });

  it("debe devolver un temario por id", async () => {
    const temario = {
      id: "temario-1",
      titulo: "Señales",
    };

    const repositoryMock = {
      findById: vi.fn().mockResolvedValue(temario),
    };

    const service = new TemariosService(repositoryMock);

    const result = await service.getById("temario-1");

    expect(repositoryMock.findById).toHaveBeenCalledWith("temario-1");
    expect(result).toEqual(temario);
  });

  it("debe lanzar un error cuando el temario no existe", async () => {
    const repositoryMock = {
      findById: vi.fn().mockResolvedValue(null),
    };

    const service = new TemariosService(repositoryMock);

    await expect(service.getById("temario-1")).rejects.toThrow(
      "Temario no encontrado",
    );
  });

  it("debe actualizar un temario existente", async () => {
    const temarioActualizado = {
      id: "temario-1",
      titulo: "Prioridad",
    };

    const repositoryMock = {
      update: vi.fn().mockResolvedValue(temarioActualizado),
    };

    const service = new TemariosService(repositoryMock);

    const result = await service.update("temario-1", {
      titulo: " Prioridad ",
      tipoLicenciaObjetivo: "b",
      orden: 2,
    });

    expect(repositoryMock.update).toHaveBeenCalledWith("temario-1", {
      titulo: "Prioridad",
      descripcion: null,
      tipoLicenciaObjetivo: "B",
      orden: 2,
    });
    expect(result).toEqual(temarioActualizado);
  });

  it("debe eliminar un temario", async () => {
    const repositoryMock = {
      delete: vi.fn().mockResolvedValue({ id: "temario-1" }),
    };

    const service = new TemariosService(repositoryMock);

    const result = await service.delete("temario-1");

    expect(repositoryMock.delete).toHaveBeenCalledWith("temario-1");
    expect(result).toEqual({ id: "temario-1" });
  });
});
