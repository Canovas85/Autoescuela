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

  it("debe bloquear la solicitud si no existe pago de Tasa DGT 2.1", async () => {
    const repositoryMock = {
      create: vi.fn(),
      findUltimoPagoTasaDGT: vi.fn().mockResolvedValue(null),
      countSuspensosDesdeFecha: vi.fn(),
    };

    const service = new SolicitudesExamenService(repositoryMock);

    await expect(
      service.create({
        alumnoId: "alumno-1",
        tipo: "TEORICO",
        licenciaObjetivo: "B",
      }),
    ).rejects.toThrow("no tiene abonada la Tasa DGT (Tasa 2.1)");

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });

  it("debe bloquear la solicitud cuando la tasa está agotada tras 2 suspensos", async () => {
    const repositoryMock = {
      create: vi.fn(),
      findUltimoPagoTasaDGT: vi.fn().mockResolvedValue({
        id: "mc-1",
        createdAt: new Date("2026-08-01T10:00:00.000Z"),
        matricula: {
          fechaPago: new Date("2026-08-01T10:00:00.000Z"),
          fechaCreacion: new Date("2026-08-01T09:00:00.000Z"),
        },
      }),
      countSuspensosDesdeFecha: vi.fn().mockResolvedValue(2),
      findSuspensosDesdeFecha: vi.fn().mockResolvedValue([
        { id: "e-1", fecha: new Date("2026-08-10T10:00:00.000Z") },
        { id: "e-2", fecha: new Date("2026-08-20T10:00:00.000Z") },
      ]),
      countClasesCompletadasDesdeFecha: vi.fn().mockResolvedValue(0),
    };

    const service = new SolicitudesExamenService(repositoryMock);

    await expect(
      service.create({
        alumnoId: "alumno-1",
        tipo: "PRACTICO",
        licenciaObjetivo: "B",
      }),
    ).rejects.toThrow("Tasa DGT agotada tras 2 suspensos");
  });

  it("debe permitir solicitud cuando hay pago y no se agotan suspensos", async () => {
    const repositoryMock = {
      create: vi.fn().mockResolvedValue({
        id: "solicitud-1",
        alumnoId: "alumno-1",
        tipo: "TEORICO",
        estado: "PENDIENTE",
      }),
      findUltimoPagoTasaDGT: vi.fn().mockResolvedValue({
        id: "mc-1",
        createdAt: new Date("2026-08-01T10:00:00.000Z"),
        matricula: {
          fechaPago: new Date("2026-08-01T10:00:00.000Z"),
          fechaCreacion: new Date("2026-08-01T09:00:00.000Z"),
        },
      }),
      countSuspensosDesdeFecha: vi.fn().mockResolvedValue(1),
    };

    const service = new SolicitudesExamenService(repositoryMock);

    const result = await service.create({
      alumnoId: "alumno-1",
      tipo: "TEORICO",
      licenciaObjetivo: "B",
    });

    expect(repositoryMock.create).toHaveBeenCalledOnce();
    expect(result.estado).toBe("PENDIENTE");
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
      erroresExamen: null,
      aciertosExamen: null,
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

  it("debe devolver elegibilidad positiva para solicitud teórica de alumno", async () => {
    const repositoryMock = {
      findMatriculaPagada: vi.fn().mockResolvedValue({
        id: "matricula-1",
        licencia: "B",
      }),
      hasPsicotecnicoValidado: vi.fn().mockResolvedValue(true),
      findSolicitudTeoricoActiva: vi.fn().mockResolvedValue(null),
      findUltimoPagoTasaDGT: vi.fn().mockResolvedValue({
        id: "pago-1",
        fechaPago: new Date("2026-09-01T10:00:00.000Z"),
        convocatoriasIncluidas: 2,
      }),
      countNoAptosTeoricoDesdeFecha: vi.fn().mockResolvedValue(1),
    };

    const service = new SolicitudesExamenService(repositoryMock);

    const result =
      await service.getTheoreticalEligibilityForStudent("alumno-1");

    expect(result.canRequest).toBe(true);
    expect(result.tasa.convocatoriasDisponibles).toBe(1);
    expect(result.bloqueos).toEqual([]);
  });

  it("debe bloquear solicitud teórica cuando no hay psicotécnico validado", async () => {
    const repositoryMock = {
      findMatriculaPagada: vi.fn().mockResolvedValue({
        id: "matricula-1",
        licencia: "B",
      }),
      hasPsicotecnicoValidado: vi.fn().mockResolvedValue(false),
      findSolicitudTeoricoActiva: vi.fn().mockResolvedValue(null),
      findUltimoPagoTasaDGT: vi.fn().mockResolvedValue({
        id: "pago-1",
        fechaPago: new Date("2026-09-01T10:00:00.000Z"),
        convocatoriasIncluidas: 2,
      }),
      countNoAptosTeoricoDesdeFecha: vi.fn().mockResolvedValue(0),
    };

    const service = new SolicitudesExamenService(repositoryMock);

    const result =
      await service.getTheoreticalEligibilityForStudent("alumno-1");

    expect(result.canRequest).toBe(false);
    expect(result.bloqueos[0]).toContain("CERTIFICADO_PSICOTECNICO");
  });

  it("debe procesar resultados teóricos y marcar apto/no apto con errores", async () => {
    const repositoryMock = {
      findSolicitudesTeoricoPendientesResultado: vi.fn().mockResolvedValue([
        {
          id: "sol-1",
          alumnoId: "alumno-1",
        },
      ]),
      updateResultadoSolicitudTeorico: vi.fn().mockResolvedValue({
        id: "sol-1",
        estado: "NO_APTO",
      }),
      findMatriculaPagada: vi.fn().mockResolvedValue({
        id: "matricula-1",
        licencia: "B",
      }),
      findUltimoPagoTasaDGT: vi.fn().mockResolvedValue({
        id: "pago-1",
        convocatoriasIncluidas: 2,
        convocatoriasConsumidas: 0,
      }),
      incrementarConvocatoriasConsumidas: vi
        .fn()
        .mockResolvedValue({ id: "pago-1" }),
    };

    const service = new SolicitudesExamenService(repositoryMock);

    const result = await service.processScheduledTheoreticalResults({
      randomFn: () => 0.8,
    });

    expect(repositoryMock.updateResultadoSolicitudTeorico).toHaveBeenCalledWith(
      "sol-1",
      "NO_APTO",
      8,
      22,
    );
    expect(
      repositoryMock.incrementarConvocatoriasConsumidas,
    ).toHaveBeenCalledWith("pago-1");
    expect(result.procesadas).toBe(1);
    expect(result.noAptos).toBe(1);
  });

  it("debe construir la evaluacion admin mezclando solicitudes y examenes", async () => {
    const repositoryMock = {
      findEvaluacionSolicitudesByTipo: vi.fn().mockResolvedValue([
        {
          id: "sol-1",
          alumnoId: "alumno-1",
          estado: "NO_APTO",
          fechaSolicitud: new Date("2026-09-01T10:00:00.000Z"),
          fechaProgramada: new Date("2026-09-05T10:00:00.000Z"),
          erroresExamen: 4,
          aciertosExamen: 26,
          observaciones: "Fallos en señales",
          alumno: {
            tipoLicenciaObjetivo: "B",
            usuario: { nombre: "Ana" },
            profesorAsignado: {
              usuario: { nombre: "Profesor Uno" },
            },
          },
        },
      ]),
      findEvaluacionExamenesByTipo: vi.fn().mockResolvedValue([
        {
          id: "ex-1",
          alumnoId: "alumno-1",
          estado: "APROBADO",
          fecha: new Date("2026-09-07T10:00:00.000Z"),
          alumno: {
            tipoLicenciaObjetivo: "B",
            usuario: { nombre: "Ana" },
            profesorAsignado: {
              usuario: { nombre: "Profesor Uno" },
            },
          },
        },
      ]),
      findUltimoPagoTasaDGT: vi.fn().mockResolvedValue({
        convocatoriasIncluidas: 2,
        convocatoriasConsumidas: 1,
      }),
    };

    const service = new SolicitudesExamenService(repositoryMock);

    const result = await service.getAdminEvaluationByTipo("teorico");

    expect(repositoryMock.findEvaluacionSolicitudesByTipo).toHaveBeenCalledWith(
      "TEORICO",
    );
    expect(repositoryMock.findEvaluacionExamenesByTipo).toHaveBeenCalledWith(
      "TEORICO",
    );
    expect(result).toHaveLength(2);
    expect(result[1].estado).toBe("SUSPENSO");
    expect(result[1].aciertosExamen).toBe(26);
    expect(result[1].convocatoriasRestantes).toBe(1);
    expect(result[1].profesorAsignado).toBe("Profesor Uno");
  });
});
