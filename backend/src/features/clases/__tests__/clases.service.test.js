import { describe, it, expect, vi } from "vitest";

import { ClasesService } from "../clases.service.js";

describe("ClasesService", () => {
  it("debe crear una clase práctica cuando los datos son válidos", async () => {
    const claseCreada = {
      id: "clase-1",
      alumnoId: "alumno-1",
      profesorId: "profesor-1",
      vehiculoId: "vehiculo-1",
      fecha: "2026-09-01T10:00:00Z",
      duracion: 60,
      estado: "PROGRAMADA",
    };

    const repositoryMock = {
      findByProfesorAndFecha: vi.fn().mockResolvedValue(null),
      findByVehiculoAndFecha: vi.fn().mockResolvedValue(null),
      findByAlumnoAndFecha: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue(claseCreada),
    };

    const service = new ClasesService(repositoryMock);

    const result = await service.create({
      alumnoId: "alumno-1",
      profesorId: "profesor-1",
      vehiculoId: "vehiculo-1",
      fecha: "2026-09-01T10:00:00Z",
      duracion: 60,
    });

    expect(repositoryMock.create).toHaveBeenCalledOnce();

    expect(result).toEqual(claseCreada);
  });

  it("debe lanzar un error cuando el alumno es obligatorio", async () => {
    const repositoryMock = {
      create: vi.fn(),
    };

    const service = new ClasesService(repositoryMock);

    await expect(
      service.create({
        profesorId: "profesor-1",
        vehiculoId: "vehiculo-1",
        fecha: "2026-09-01T10:00:00Z",
        duracion: 60,
      }),
    ).rejects.toThrow("El alumno es obligatorio");

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });
  it("debe lanzar un error cuando el profesor es obligatorio", async () => {
    const repositoryMock = {
      create: vi.fn(),
    };

    const service = new ClasesService(repositoryMock);

    await expect(
      service.create({
        alumnoId: "alumno-1",
        vehiculoId: "vehiculo-1",
        fecha: "2026-09-01T10:00:00Z",
        duracion: 60,
      }),
    ).rejects.toThrow("El profesor es obligatorio");

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });
  it("debe lanzar un error cuando el vehículo es obligatorio", async () => {
    const repositoryMock = {
      create: vi.fn(),
    };

    const service = new ClasesService(repositoryMock);

    await expect(
      service.create({
        alumnoId: "alumno-1",
        profesorId: "profesor-1",
        fecha: "2026-09-01T10:00:00Z",
        duracion: 60,
      }),
    ).rejects.toThrow("El vehículo es obligatorio");

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });
  it("debe lanzar un error cuando la fecha es obligatoria", async () => {
    const repositoryMock = {
      create: vi.fn(),
    };

    const service = new ClasesService(repositoryMock);

    await expect(
      service.create({
        alumnoId: "alumno-1",
        profesorId: "profesor-1",
        vehiculoId: "vehiculo-1",
        duracion: 60,
      }),
    ).rejects.toThrow("La fecha es obligatoria");

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });
  it("debe lanzar un error cuando la duración es obligatoria", async () => {
    const repositoryMock = {
      create: vi.fn(),
    };

    const service = new ClasesService(repositoryMock);

    await expect(
      service.create({
        alumnoId: "alumno-1",
        profesorId: "profesor-1",
        vehiculoId: "vehiculo-1",
        fecha: "2026-09-01T10:00:00Z",
      }),
    ).rejects.toThrow("La duración es obligatoria");

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });
  it("debe crear siempre la clase con estado PROGRAMADA", async () => {
    const repositoryMock = {
      findByProfesorAndFecha: vi.fn().mockResolvedValue(null),

      findByVehiculoAndFecha: vi.fn().mockResolvedValue(null),

      findByAlumnoAndFecha: vi.fn().mockResolvedValue(null),

      create: vi.fn().mockImplementation(async (data) => data),
    };

    const service = new ClasesService(repositoryMock);

    const result = await service.create({
      alumnoId: "alumno-1",
      profesorId: "profesor-1",
      vehiculoId: "vehiculo-1",
      fecha: "2026-09-01T10:00:00Z",
      duracion: 60,
      estado: "CANCELADA",
    });

    expect(result.estado).toBe("PROGRAMADA");
  });
  it("debe devolver el listado completo de clases prácticas", async () => {
    const clases = [
      {
        id: "clase-1",
        alumnoId: "alumno-1",
        profesorId: "profesor-1",
        vehiculoId: "vehiculo-1",
        fecha: "2026-09-01T10:00:00Z",
        duracion: 60,
        estado: "PROGRAMADA",
      },
      {
        id: "clase-2",
        alumnoId: "alumno-2",
        profesorId: "profesor-1",
        vehiculoId: "vehiculo-1",
        fecha: "2026-09-01T12:00:00Z",
        duracion: 90,
        estado: "PROGRAMADA",
      },
    ];

    const repositoryMock = {
      findAll: vi.fn().mockResolvedValue(clases),
    };

    const service = new ClasesService(repositoryMock);

    const result = await service.getAll();

    expect(repositoryMock.findAll).toHaveBeenCalledOnce();

    expect(result).toEqual(clases);
  });

  it("debe devolver una clase práctica cuando existe el id", async () => {
    const clase = {
      id: "clase-1",
      alumnoId: "alumno-1",
      profesorId: "profesor-1",
      vehiculoId: "vehiculo-1",
      fecha: "2026-09-01T10:00:00Z",
      duracion: 60,
      estado: "PROGRAMADA",
    };

    const repositoryMock = {
      findById: vi.fn().mockResolvedValue(clase),
    };

    const service = new ClasesService(repositoryMock);

    const result = await service.getById("clase-1");

    expect(repositoryMock.findById).toHaveBeenCalledWith("clase-1");

    expect(result).toEqual(clase);
  });

  it("debe actualizar una clase práctica existente", async () => {
    const claseActualizada = {
      id: "clase-1",
      alumnoId: "alumno-1",
      profesorId: "profesor-1",
      vehiculoId: "vehiculo-1",
      fecha: "2026-09-02T10:00:00Z",
      duracion: 90,
      estado: "PROGRAMADA",
    };

    const repositoryMock = {
      update: vi.fn().mockResolvedValue(claseActualizada),
    };

    const service = new ClasesService(repositoryMock);

    const result = await service.update("clase-1", {
      fecha: "2026-09-02T10:00:00Z",
      duracion: 90,
    });

    expect(repositoryMock.update).toHaveBeenCalledWith("clase-1", {
      fecha: "2026-09-02T10:00:00Z",
      duracion: 90,
    });

    expect(result).toEqual(claseActualizada);
  });

  it("debe cancelar una clase práctica existente", async () => {
    const claseCancelada = {
      id: "clase-1",
      alumnoId: "alumno-1",
      profesorId: "profesor-1",
      vehiculoId: "vehiculo-1",
      fecha: "2026-09-01T10:00:00Z",
      duracion: 60,
      estado: "CANCELADA",
    };

    const repositoryMock = {
      cancel: vi.fn().mockResolvedValue(claseCancelada),
    };

    const service = new ClasesService(repositoryMock);

    const result = await service.cancel("clase-1");

    expect(repositoryMock.cancel).toHaveBeenCalledWith("clase-1");

    expect(result).toEqual(claseCancelada);
  });
  it("debe lanzar un error cuando el profesor ya tiene una clase a esa hora", async () => {
    const repositoryMock = {
      findByProfesorAndFecha: vi.fn().mockResolvedValue({
        id: "clase-1",
      }),

      create: vi.fn(),
    };

    const service = new ClasesService(repositoryMock);

    await expect(
      service.create({
        alumnoId: "alumno-2",
        profesorId: "profesor-1",
        vehiculoId: "vehiculo-1",
        fecha: "2026-09-01T10:00:00Z",
        duracion: 60,
      }),
    ).rejects.toThrow(
      "El profesor ya tiene una clase programada en esa fecha y hora",
    );

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });

  it("debe lanzar un error cuando el vehículo ya tiene una clase a esa hora", async () => {
    const repositoryMock = {
      findByProfesorAndFecha: vi.fn().mockResolvedValue(null),

      findByVehiculoAndFecha: vi.fn().mockResolvedValue({
        id: "clase-1",
      }),

      create: vi.fn(),
    };

    const service = new ClasesService(repositoryMock);

    await expect(
      service.create({
        alumnoId: "alumno-1",
        profesorId: "profesor-1",
        vehiculoId: "vehiculo-1",
        fecha: "2026-09-01T10:00:00Z",
        duracion: 60,
      }),
    ).rejects.toThrow(
      "El vehículo ya está asignado a otra clase en esa fecha y hora",
    );
  });
  it("debe lanzar un error cuando el alumno ya tiene una clase a esa hora", async () => {
    const repositoryMock = {
      findByProfesorAndFecha: vi.fn().mockResolvedValue(null),

      findByVehiculoAndFecha: vi.fn().mockResolvedValue(null),

      findByAlumnoAndFecha: vi.fn().mockResolvedValue({
        id: "clase-1",
      }),

      create: vi.fn(),
    };

    const service = new ClasesService(repositoryMock);

    await expect(
      service.create({
        alumnoId: "alumno-1",
        profesorId: "profesor-1",
        vehiculoId: "vehiculo-1",
        fecha: "2026-09-01T10:00:00Z",
        duracion: 60,
      }),
    ).rejects.toThrow(
      "El alumno ya tiene una clase programada en esa fecha y hora",
    );
  });
});
