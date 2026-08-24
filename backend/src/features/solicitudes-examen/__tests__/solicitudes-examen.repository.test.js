import { describe, it, expect, vi } from "vitest";

import { SolicitudesExamenRepository } from "../solicitudes-examen.repository.js";

describe("SolicitudesExamenRepository", () => {
  it("debe crear una solicitud utilizando Prisma", async () => {
    const solicitudCreada = {
      id: "solicitud-1",
      alumnoId: "alumno-1",
      tipo: "TEORICO",
      estado: "PENDIENTE",
    };

    const prismaMock = {
      solicitudExamen: {
        create: vi.fn().mockResolvedValue(solicitudCreada),
      },
    };

    const repository = new SolicitudesExamenRepository(prismaMock);

    const result = await repository.create({
      alumnoId: "alumno-1",
      tipo: "TEORICO",
      estado: "PENDIENTE",
      fechaSolicitud: new Date("2026-08-24T10:00:00.000Z"),
      fechaProgramada: null,
      observaciones: "Pendiente",
    });

    expect(prismaMock.solicitudExamen.create).toHaveBeenCalledWith({
      data: {
        alumnoId: "alumno-1",
        tipo: "TEORICO",
        estado: "PENDIENTE",
        fechaSolicitud: new Date("2026-08-24T10:00:00.000Z"),
        fechaProgramada: null,
        observaciones: "Pendiente",
      },
    });
    expect(result).toEqual(solicitudCreada);
  });

  it("debe devolver todas las solicitudes incluyendo alumno y usuario", async () => {
    const solicitudes = [
      {
        id: "solicitud-1",
        tipo: "TEORICO",
      },
    ];

    const prismaMock = {
      solicitudExamen: {
        findMany: vi.fn().mockResolvedValue(solicitudes),
      },
    };

    const repository = new SolicitudesExamenRepository(prismaMock);

    const result = await repository.findAll();

    expect(prismaMock.solicitudExamen.findMany).toHaveBeenCalledWith({
      include: {
        alumno: {
          include: {
            usuario: true,
          },
        },
      },
      orderBy: [{ fechaSolicitud: "desc" }],
    });
    expect(result).toEqual(solicitudes);
  });

  it("debe devolver una solicitud por id", async () => {
    const solicitud = {
      id: "solicitud-1",
      tipo: "TEORICO",
    };

    const prismaMock = {
      solicitudExamen: {
        findUnique: vi.fn().mockResolvedValue(solicitud),
      },
    };

    const repository = new SolicitudesExamenRepository(prismaMock);

    const result = await repository.findById("solicitud-1");

    expect(prismaMock.solicitudExamen.findUnique).toHaveBeenCalledWith({
      where: {
        id: "solicitud-1",
      },
      include: {
        alumno: {
          include: {
            usuario: true,
          },
        },
      },
    });
    expect(result).toEqual(solicitud);
  });

  it("debe actualizar una solicitud existente", async () => {
    const solicitudActualizada = {
      id: "solicitud-1",
      tipo: "PRACTICO",
    };

    const prismaMock = {
      solicitudExamen: {
        update: vi.fn().mockResolvedValue(solicitudActualizada),
      },
    };

    const repository = new SolicitudesExamenRepository(prismaMock);

    const result = await repository.update("solicitud-1", {
      alumnoId: "alumno-1",
      tipo: "PRACTICO",
      estado: "PROGRAMADO",
      fechaSolicitud: new Date("2026-08-24T10:00:00.000Z"),
      fechaProgramada: new Date("2026-09-02T10:00:00.000Z"),
      observaciones: "Revisado",
    });

    expect(prismaMock.solicitudExamen.update).toHaveBeenCalledWith({
      where: {
        id: "solicitud-1",
      },
      data: {
        alumnoId: "alumno-1",
        tipo: "PRACTICO",
        estado: "PROGRAMADO",
        fechaSolicitud: new Date("2026-08-24T10:00:00.000Z"),
        fechaProgramada: new Date("2026-09-02T10:00:00.000Z"),
        observaciones: "Revisado",
      },
    });
    expect(result).toEqual(solicitudActualizada);
  });

  it("debe eliminar una solicitud existente", async () => {
    const solicitudEliminada = {
      id: "solicitud-1",
    };

    const prismaMock = {
      solicitudExamen: {
        delete: vi.fn().mockResolvedValue(solicitudEliminada),
      },
    };

    const repository = new SolicitudesExamenRepository(prismaMock);

    const result = await repository.delete("solicitud-1");

    expect(prismaMock.solicitudExamen.delete).toHaveBeenCalledWith({
      where: {
        id: "solicitud-1",
      },
    });
    expect(result).toEqual(solicitudEliminada);
  });
});
