import { describe, it, expect, vi } from "vitest";

import { SolicitudesExamenService } from "../solicitudes-examen.service.js";

describe("SolicitudesExamenService", () => {
  it("debe crear una solicitud cuando los datos son válidos", async () => {
    const solicitudCreada = {
      id: "solicitud-1",
      alumnoId: "alumno-1",
      tipo: "TEORICO",
      estado: "PENDIENTE",
    };

    const repositoryMock = {
      create: vi.fn().mockResolvedValue(solicitudCreada),
    };

    const service = new SolicitudesExamenService(repositoryMock);

    const result = await service.create({
      alumnoId: " alumno-1 ",
      tipo: " teorico ",
      estado: " pendiente ",
      fechaSolicitud: "2026-08-24T10:00:00.000Z",
      fechaProgramada: "2026-09-01T10:00:00.000Z",
      observaciones: " Revisar documentación ",
    });

    expect(repositoryMock.create).toHaveBeenCalledOnce();
    expect(result).toEqual(solicitudCreada);
  });

  it("debe lanzar un error cuando el alumno es obligatorio", async () => {
    const repositoryMock = {
      create: vi.fn(),
    };

    const service = new SolicitudesExamenService(repositoryMock);

    await expect(
      service.create({
        tipo: "TEORICO",
      }),
    ).rejects.toThrow("El alumno es obligatorio");
  });

  it("debe lanzar un error cuando el tipo de examen no es válido", async () => {
    const repositoryMock = {
      create: vi.fn(),
    };

    const service = new SolicitudesExamenService(repositoryMock);

    await expect(
      service.create({
        alumnoId: "alumno-1",
        tipo: "MIXTO",
      }),
    ).rejects.toThrow("El tipo de examen debe ser TEORICO o PRACTICO");
  });

  it("debe lanzar un error cuando el estado no es válido", async () => {
    const repositoryMock = {
      create: vi.fn(),
    };

    const service = new SolicitudesExamenService(repositoryMock);

    await expect(
      service.create({
        alumnoId: "alumno-1",
        tipo: "TEORICO",
        estado: "INVALIDO",
      }),
    ).rejects.toThrow("El estado de la solicitud no es válido");
  });

  it("debe devolver una solicitud por id", async () => {
    const solicitud = {
      id: "solicitud-1",
      tipo: "TEORICO",
    };

    const repositoryMock = {
      findById: vi.fn().mockResolvedValue(solicitud),
    };

    const service = new SolicitudesExamenService(repositoryMock);

    const result = await service.getById("solicitud-1");

    expect(repositoryMock.findById).toHaveBeenCalledWith("solicitud-1");
    expect(result).toEqual(solicitud);
  });

  it("debe lanzar un error cuando la solicitud no existe", async () => {
    const repositoryMock = {
      findById: vi.fn().mockResolvedValue(null),
    };

    const service = new SolicitudesExamenService(repositoryMock);

    await expect(service.getById("solicitud-1")).rejects.toThrow(
      "Solicitud no encontrada",
    );
  });

  it("debe devolver el listado completo de solicitudes", async () => {
    const solicitudes = [
      {
        id: "solicitud-1",
        tipo: "TEORICO",
      },
    ];

    const repositoryMock = {
      findAll: vi.fn().mockResolvedValue(solicitudes),
    };

    const service = new SolicitudesExamenService(repositoryMock);

    const result = await service.getAll();

    expect(repositoryMock.findAll).toHaveBeenCalledOnce();
    expect(result).toEqual(solicitudes);
  });

  it("debe actualizar una solicitud", async () => {
    const solicitudActualizada = {
      id: "solicitud-1",
      tipo: "PRACTICO",
    };

    const repositoryMock = {
      update: vi.fn().mockResolvedValue(solicitudActualizada),
    };

    const service = new SolicitudesExamenService(repositoryMock);

    const result = await service.update("solicitud-1", {
      alumnoId: "alumno-1",
      tipo: "practico",
      estado: "programado",
      fechaSolicitud: "2026-08-24T10:00:00.000Z",
      fechaProgramada: "2026-09-02T10:00:00.000Z",
    });

    expect(repositoryMock.update).toHaveBeenCalledWith("solicitud-1", {
      alumnoId: "alumno-1",
      tipo: "PRACTICO",
      estado: "PROGRAMADO",
      fechaSolicitud: expect.any(Date),
      fechaProgramada: expect.any(Date),
      observaciones: null,
    });
    expect(result).toEqual(solicitudActualizada);
  });

  it("debe eliminar una solicitud", async () => {
    const repositoryMock = {
      delete: vi.fn().mockResolvedValue({ id: "solicitud-1" }),
    };

    const service = new SolicitudesExamenService(repositoryMock);

    const result = await service.delete("solicitud-1");

    expect(repositoryMock.delete).toHaveBeenCalledWith("solicitud-1");
    expect(result).toEqual({ id: "solicitud-1" });
  });
});
