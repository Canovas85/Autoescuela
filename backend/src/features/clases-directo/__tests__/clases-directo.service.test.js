import { describe, it, expect, vi } from "vitest";

import { ClasesDirectoService } from "../clases-directo.service.js";

describe("ClasesDirectoService", () => {
  it("debe crear una clase directa cuando los datos son válidos", async () => {
    const claseCreada = {
      id: "clase-directo-1",
      titulo: "Manejo en ciudad",
      descripcion: "Sesión de conducción urbana",
      videoUrl: "https://youtube.com/watch?v=abc123",
      duracionSegundos: 120,
      permiso: "B",
      profesorId: "profesor-1",
      activa: true,
    };

    const repositoryMock = {
      create: vi.fn().mockResolvedValue(claseCreada),
    };

    const service = new ClasesDirectoService(repositoryMock);

    const result = await service.create({
      titulo: "  Manejo en ciudad  ",
      descripcion: "   Sesión de conducción urbana   ",
      videoUrl: "  https://youtube.com/watch?v=abc123  ",
      duracionSegundos: "120",
      permiso: "B",
      profesorId: "profesor-1",
    });

    expect(repositoryMock.create).toHaveBeenCalledWith({
      titulo: "Manejo en ciudad",
      descripcion: "   Sesión de conducción urbana   ",
      videoUrl: "https://youtube.com/watch?v=abc123",
      duracionSegundos: 120,
      permiso: "B",
      profesorId: "profesor-1",
      activa: true,
    });

    expect(result).toEqual(claseCreada);
  });

  it("debe lanzar un error cuando el título es obligatorio", async () => {
    const repositoryMock = {
      create: vi.fn(),
    };

    const service = new ClasesDirectoService(repositoryMock);

    await expect(
      service.create({
        videoUrl: "https://youtube.com/watch?v=abc123",
      }),
    ).rejects.toThrow("El título es obligatorio");

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });

  it("debe lanzar un error cuando la URL del vídeo es obligatoria", async () => {
    const repositoryMock = {
      create: vi.fn(),
    };

    const service = new ClasesDirectoService(repositoryMock);

    await expect(
      service.create({
        titulo: "Manejo en ciudad",
      }),
    ).rejects.toThrow("La URL del vídeo es obligatoria");

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });

  it("debe normalizar los valores por defecto al crear una clase directa", async () => {
    const claseCreada = {
      id: "clase-directo-2",
      titulo: "Manejo en autopista",
      descripcion: null,
      videoUrl: "https://youtube.com/watch?v=def456",
      duracionSegundos: 0,
      permiso: "B",
      profesorId: null,
      activa: true,
    };

    const repositoryMock = {
      create: vi.fn().mockResolvedValue(claseCreada),
    };

    const service = new ClasesDirectoService(repositoryMock);

    const result = await service.create({
      titulo: "Manejo en autopista",
      videoUrl: "https://youtube.com/watch?v=def456",
      duracionSegundos: "no-numero",
    });

    expect(repositoryMock.create).toHaveBeenCalledWith({
      titulo: "Manejo en autopista",
      descripcion: null,
      videoUrl: "https://youtube.com/watch?v=def456",
      duracionSegundos: 0,
      permiso: "B",
      profesorId: null,
      activa: true,
    });

    expect(result).toEqual(claseCreada);
  });

  it("debe devolver todas las clases directas", async () => {
    const clases = [
      { id: "clase-directo-1", titulo: "Manejo en ciudad" },
      { id: "clase-directo-2", titulo: "Manejo en autopista" },
    ];

    const repositoryMock = {
      findAll: vi.fn().mockResolvedValue(clases),
    };

    const service = new ClasesDirectoService(repositoryMock);

    const result = await service.getAll();

    expect(repositoryMock.findAll).toHaveBeenCalledOnce();
    expect(result).toEqual(clases);
  });

  it("debe devolver las clases directas activas", async () => {
    const clases = [
      { id: "clase-directo-1", titulo: "Manejo en ciudad", activa: true },
    ];

    const repositoryMock = {
      findAllActive: vi.fn().mockResolvedValue(clases),
    };

    const service = new ClasesDirectoService(repositoryMock);

    const result = await service.getAllActive();

    expect(repositoryMock.findAllActive).toHaveBeenCalledOnce();
    expect(result).toEqual(clases);
  });

  it("debe devolver una clase directa por id", async () => {
    const clase = { id: "clase-directo-1", titulo: "Manejo en ciudad" };

    const repositoryMock = {
      findById: vi.fn().mockResolvedValue(clase),
    };

    const service = new ClasesDirectoService(repositoryMock);

    const result = await service.getById("clase-directo-1");

    expect(repositoryMock.findById).toHaveBeenCalledWith("clase-directo-1");
    expect(result).toEqual(clase);
  });

  it("debe actualizar una clase directa existente", async () => {
    const claseActualizada = {
      id: "clase-directo-1",
      titulo: "Manejo en ciudad actualizado",
      videoUrl: "https://youtube.com/watch?v=nuevo",
    };

    const repositoryMock = {
      update: vi.fn().mockResolvedValue(claseActualizada),
    };

    const service = new ClasesDirectoService(repositoryMock);

    const result = await service.update("clase-directo-1", {
      titulo: "Manejo en ciudad actualizado",
      videoUrl: "https://youtube.com/watch?v=nuevo",
    });

    expect(repositoryMock.update).toHaveBeenCalledWith("clase-directo-1", {
      titulo: "Manejo en ciudad actualizado",
      videoUrl: "https://youtube.com/watch?v=nuevo",
    });
    expect(result).toEqual(claseActualizada);
  });

  it("debe activar una clase directa", async () => {
    const claseActivada = { id: "clase-directo-1", activa: true };

    const repositoryMock = {
      activate: vi.fn().mockResolvedValue(claseActivada),
    };

    const service = new ClasesDirectoService(repositoryMock);

    const result = await service.activate("clase-directo-1");

    expect(repositoryMock.activate).toHaveBeenCalledWith("clase-directo-1");
    expect(result).toEqual(claseActivada);
  });

  it("debe desactivar una clase directa", async () => {
    const claseDesactivada = { id: "clase-directo-1", activa: false };

    const repositoryMock = {
      deactivate: vi.fn().mockResolvedValue(claseDesactivada),
    };

    const service = new ClasesDirectoService(repositoryMock);

    const result = await service.deactivate("clase-directo-1");

    expect(repositoryMock.deactivate).toHaveBeenCalledWith("clase-directo-1");
    expect(result).toEqual(claseDesactivada);
  });
});
