import { describe, expect, it, vi } from "vitest";

import { HojasRutaService } from "../hojas-ruta.service.js";

describe("HojasRutaService", () => {
  it("debe devolver PENDIENTE cuando la clase ya pasó y no tiene hoja", async () => {
    const repositoryMock = {
      findProfessorClasses: vi.fn().mockResolvedValue([
        {
          id: "clase-1",
          profesorId: "prof-1",
          alumnoId: "al-1",
          fecha: "2026-01-01T10:00:00.000Z",
          duracion: 45,
          estado: "CONFIRMADA",
          canceladaConPenalizacion: false,
          alumno: { id: "al-1", usuario: { nombre: "Alumno" } },
          profesor: { id: "prof-1", usuario: { nombre: "Profesor" } },
          vehiculo: {
            id: "v-1",
            marca: "Opel",
            modelo: "Corsa",
            matricula: "1234",
          },
          hojaRuta: null,
        },
      ]),
    };

    const service = new HojasRutaService(repositoryMock);
    const result = await service.getProfessorDashboard("prof-1", {});

    expect(result.resumen.pendientes).toBe(1);
    expect(result.pendientes[0].estado).toBe("PENDIENTE");
  });

  it("debe guardar borrador EN_CURSO con faltas normalizadas", async () => {
    const clase = {
      id: "clase-1",
      profesorId: "prof-1",
      alumnoId: "al-1",
      fecha: "2026-01-01T10:00:00.000Z",
      duracion: 45,
      estado: "CONFIRMADA",
      canceladaConPenalizacion: false,
      alumno: { id: "al-1", usuario: { nombre: "Alumno" } },
      profesor: { id: "prof-1", usuario: { nombre: "Profesor" } },
      vehiculo: {
        id: "v-1",
        marca: "Opel",
        modelo: "Corsa",
        matricula: "1234",
      },
      hojaRuta: null,
    };

    const repositoryMock = {
      findClassById: vi
        .fn()
        .mockResolvedValueOnce(clase)
        .mockResolvedValueOnce({
          ...clase,
          hojaRuta: {
            id: "hr-1",
            estado: "EN_CURSO",
            observacionesProfesor: "Obs",
            kilometrosInicio: 100,
            kilometrosFin: 120,
            combustibleInicioPct: 80,
            combustibleFinPct: 60,
            faltas: [
              {
                id: "f-1",
                hora: "10:15",
                tipo: "LEVE",
                categoria: "Mandos",
                descripcion: "Error leve",
                catalogoId: null,
              },
            ],
          },
        }),
      upsertRoadmapByClass: vi.fn().mockResolvedValue({ id: "hr-1" }),
      replaceRoadmapFaults: vi.fn().mockResolvedValue(undefined),
    };

    const service = new HojasRutaService(repositoryMock);
    const result = await service.saveProfessorDraft("prof-1", "clase-1", {
      observacionesProfesor: "Obs",
      kilometrosInicio: 100,
      kilometrosFin: 120,
      combustibleInicioPct: 80,
      combustibleFinPct: 60,
      faltas: [
        {
          hora: "10:15",
          tipo: "LEVE",
          categoria: "Mandos",
          descripcion: "Error leve",
        },
      ],
    });

    expect(repositoryMock.upsertRoadmapByClass).toHaveBeenCalledWith(clase, {
      estado: "EN_CURSO",
      observacionesProfesor: "Obs",
      kilometrosInicio: 100,
      kilometrosFin: 120,
      combustibleInicioPct: 80,
      combustibleFinPct: 60,
      finalizedAt: null,
    });

    expect(repositoryMock.replaceRoadmapFaults).toHaveBeenCalledWith("hr-1", [
      {
        hora: "10:15",
        tipo: "LEVE",
        categoria: "Mandos",
        descripcion: "Error leve",
        orden: 0,
        catalogoId: null,
      },
    ]);

    expect(result.hojaRuta.estado).toBe("EN_CURSO");
  });

  it("debe lanzar error cuando el tipo de falta no es válido", async () => {
    const clase = {
      id: "clase-1",
      profesorId: "prof-1",
      alumnoId: "al-1",
      fecha: "2026-01-01T10:00:00.000Z",
      estado: "CONFIRMADA",
      hojaRuta: null,
    };

    const repositoryMock = {
      findClassById: vi.fn().mockResolvedValue(clase),
      upsertRoadmapByClass: vi.fn(),
      replaceRoadmapFaults: vi.fn(),
    };

    const service = new HojasRutaService(repositoryMock);

    await expect(
      service.saveProfessorDraft("prof-1", "clase-1", {
        faltas: [
          {
            hora: "10:15",
            tipo: "X",
            categoria: "Cat",
            descripcion: "Desc",
          },
        ],
      }),
    ).rejects.toThrow(
      "El tipo de falta debe ser LEVE, DEFICIENTE o ELIMINATORIA",
    );

    expect(repositoryMock.upsertRoadmapByClass).not.toHaveBeenCalled();
  });
});
