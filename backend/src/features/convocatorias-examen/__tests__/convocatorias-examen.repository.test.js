import { describe, expect, it, vi } from "vitest";

import { ConvocatoriasExamenRepository } from "../convocatorias-examen.repository.js";

describe("ConvocatoriasExamenRepository", () => {
  it("crea una convocatoria usando Prisma", async () => {
    const created = { id: "conv-1", licencia: "B", tipoExamen: "TEORICO" };

    const prismaMock = {
      convocatoriaExamen: {
        create: vi.fn().mockResolvedValue(created),
      },
    };

    const repository = new ConvocatoriasExamenRepository(prismaMock);

    const result = await repository.create({
      fecha: new Date("2026-09-25T12:00:00.000Z"),
      licencia: "B",
      tipoExamen: "TEORICO",
      activo: true,
    });

    expect(prismaMock.convocatoriaExamen.create).toHaveBeenCalledWith({
      data: {
        fecha: new Date("2026-09-25T12:00:00.000Z"),
        licencia: "B",
        tipoExamen: "TEORICO",
        activo: true,
      },
    });

    expect(result).toEqual(created);
  });

  it("obtiene agenda con alumnos confirmados", async () => {
    const convocatoria = {
      id: "conv-1",
      fecha: new Date("2026-09-25T12:00:00.000Z"),
      licencia: "B",
      tipoExamen: "TEORICO",
      activo: true,
    };

    const prismaMock = {
      convocatoriaExamen: {
        findMany: vi.fn().mockResolvedValue([convocatoria]),
      },
      solicitudExamen: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: "sol-1",
            alumnoId: "a-1",
            estado: "SOLICITADO",
            alumno: { usuario: { nombre: "Ana", email: "ana@mail.com" } },
          },
        ]),
      },
    };

    const repository = new ConvocatoriasExamenRepository(prismaMock);

    const result = await repository.findAgendaWithConfirmedStudents({
      monthStart: new Date("2026-09-01T00:00:00.000Z"),
      monthEnd: new Date("2026-09-30T23:59:59.999Z"),
    });

    expect(prismaMock.convocatoriaExamen.findMany).toHaveBeenCalledOnce();
    expect(prismaMock.solicitudExamen.findMany).toHaveBeenCalledOnce();
    expect(result[0].totalAlumnos).toBe(1);
    expect(result[0].alumnos[0].nombre).toBe("Ana");
  });

  it("incluye estados APTO y NO_APTO para convocatorias pasadas", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-20T10:00:00.000Z"));

    const convocatoria = {
      id: "conv-2",
      fecha: new Date("2026-09-10T12:00:00.000Z"),
      licencia: "B",
      tipoExamen: "TEORICO",
      activo: true,
    };

    const prismaMock = {
      convocatoriaExamen: {
        findMany: vi.fn().mockResolvedValue([convocatoria]),
      },
      solicitudExamen: {
        findMany: vi.fn().mockResolvedValue([]),
      },
    };

    const repository = new ConvocatoriasExamenRepository(prismaMock);

    await repository.findAgendaWithConfirmedStudents({
      monthStart: new Date("2026-09-01T00:00:00.000Z"),
      monthEnd: new Date("2026-09-30T23:59:59.999Z"),
    });

    expect(prismaMock.solicitudExamen.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          estado: {
            in: ["SOLICITADO", "PROGRAMADO", "APTO", "NO_APTO"],
          },
        }),
      }),
    );

    vi.useRealTimers();
  });
});
