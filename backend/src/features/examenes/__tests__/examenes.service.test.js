import { describe, it, expect, vi } from "vitest";

import { ExamenesService } from "../examenes.service.js";

describe("ExamenesService", () => {
  it("debe crear un examen cuando los datos son válidos", async () => {
    const examenCreado = {
      id: "examen-1",
      alumnoId: "alumno-1",
      tipo: "TEORICO",
      fecha: "2026-10-10T09:00:00Z",
      estado: "PROGRAMADO",
    };

    const repositoryMock = {
      create: vi.fn().mockResolvedValue(examenCreado),
    };

    const service = new ExamenesService(repositoryMock);

    const result = await service.create({
      alumnoId: "alumno-1",
      tipo: "TEORICO",
      fecha: "2026-10-10T09:00:00Z",
    });

    expect(repositoryMock.create).toHaveBeenCalledOnce();

    expect(result).toEqual(examenCreado);
  });
  it("debe lanzar un error cuando el alumno es obligatorio", async () => {
    const repositoryMock = {
      create: vi.fn(),
    };

    const service = new ExamenesService(repositoryMock);

    await expect(
      service.create({
        tipo: "TEORICO",
        fecha: "2026-10-10T09:00:00Z",
      }),
    ).rejects.toThrow("El alumno es obligatorio");

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });
  it("debe lanzar un error cuando el tipo de examen es obligatorio", async () => {
    const repositoryMock = {
      create: vi.fn(),
    };

    const service = new ExamenesService(repositoryMock);

    await expect(
      service.create({
        alumnoId: "alumno-1",
        fecha: "2026-10-10T09:00:00Z",
      }),
    ).rejects.toThrow("El tipo de examen es obligatorio");

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });
  it("debe lanzar un error cuando la fecha del examen es obligatoria", async () => {
    const repositoryMock = {
      create: vi.fn(),
    };

    const service = new ExamenesService(repositoryMock);

    await expect(
      service.create({
        alumnoId: "alumno-1",
        tipo: "TEORICO",
      }),
    ).rejects.toThrow("La fecha del examen es obligatoria");

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });
  it("debe lanzar un error cuando el tipo de examen no es válido", async () => {
    const repositoryMock = {
      create: vi.fn(),
    };

    const service = new ExamenesService(repositoryMock);

    await expect(
      service.create({
        alumnoId: "alumno-1",
        tipo: "MIXTO",
        fecha: "2026-10-10T09:00:00Z",
      }),
    ).rejects.toThrow("El tipo de examen debe ser TEORICO o PRACTICO");

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });
  it("debe lanzar un error cuando la fecha del examen no es válida", async () => {
    const repositoryMock = {
      create: vi.fn(),
    };

    const service = new ExamenesService(repositoryMock);

    await expect(
      service.create({
        alumnoId: "alumno-1",
        tipo: "TEORICO",
        fecha: "fecha-no-valida",
      }),
    ).rejects.toThrow("La fecha del examen no es válida");

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });
  it("debe crear siempre el examen con estado PROGRAMADO", async () => {
    const repositoryMock = {
      create: vi.fn().mockImplementation(async (data) => data),
    };

    const service = new ExamenesService(repositoryMock);

    const result = await service.create({
      alumnoId: "alumno-1",
      tipo: "TEORICO",
      fecha: "2026-10-10T09:00:00Z",
      estado: "APROBADO",
    });

    expect(result.estado).toBe("PROGRAMADO");
  });

  it("debe bloquear alta de examen si no existe pago de Tasa DGT 2.1", async () => {
    const repositoryMock = {
      create: vi.fn(),
      findUltimoPagoTasaDGT: vi.fn().mockResolvedValue(null),
      countSuspensosDesdeFecha: vi.fn(),
    };

    const service = new ExamenesService(repositoryMock);

    await expect(
      service.create({
        alumnoId: "alumno-1",
        tipo: "TEORICO",
        fecha: "2026-10-10T09:00:00Z",
        licenciaObjetivo: "B",
      }),
    ).rejects.toThrow("no tiene abonada la Tasa DGT (Tasa 2.1)");

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });

  it("debe bloquear alta de examen cuando la tasa está agotada tras 2 suspensos", async () => {
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

    const service = new ExamenesService(repositoryMock);

    await expect(
      service.create({
        alumnoId: "alumno-1",
        tipo: "PRACTICO",
        fecha: "2026-10-10T09:00:00Z",
        licenciaObjetivo: "B",
      }),
    ).rejects.toThrow("Tasa DGT agotada tras 2 suspensos");

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });

  it("debe permitir alta de examen cuando hay pago y aún no se agotan suspensos", async () => {
    const repositoryMock = {
      create: vi.fn().mockResolvedValue({
        id: "examen-1",
        alumnoId: "alumno-1",
        tipo: "TEORICO",
        fecha: "2026-10-10T09:00:00Z",
        estado: "PROGRAMADO",
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

    const service = new ExamenesService(repositoryMock);

    const result = await service.create({
      alumnoId: "alumno-1",
      tipo: "TEORICO",
      fecha: "2026-10-10T09:00:00Z",
      licenciaObjetivo: "B",
    });

    expect(repositoryMock.create).toHaveBeenCalledOnce();
    expect(result.estado).toBe("PROGRAMADO");
  });

  it("debe exigir clases adicionales cuando la regla de renovación lo configure", async () => {
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
      countClasesCompletadasDesdeFecha: vi.fn().mockResolvedValue(1),
    };

    const service = new ExamenesService(repositoryMock, {
      reglasRenovacion: {
        B: {
          diasEspera: 0,
          clasesPracticasObligatorias: 3,
        },
      },
    });

    await expect(
      service.create({
        alumnoId: "alumno-1",
        tipo: "PRACTICO",
        fecha: "2026-10-10T09:00:00Z",
        licenciaObjetivo: "B",
      }),
    ).rejects.toThrow("completar 3 clases prácticas");
  });
  it("debe devolver el listado completo de exámenes", async () => {
    const examenes = [
      {
        id: "examen-1",
        alumnoId: "alumno-1",
        tipo: "TEORICO",
        fecha: "2026-10-10T09:00:00Z",
        estado: "PROGRAMADO",
      },
      {
        id: "examen-2",
        alumnoId: "alumno-2",
        tipo: "PRACTICO",
        fecha: "2026-10-15T11:00:00Z",
        estado: "PROGRAMADO",
      },
    ];

    const repositoryMock = {
      findAll: vi.fn().mockResolvedValue(examenes),
    };

    const service = new ExamenesService(repositoryMock);

    const result = await service.getAll();

    expect(repositoryMock.findAll).toHaveBeenCalledOnce();

    expect(result).toEqual(examenes);
  });
  it("debe devolver un examen cuando existe el id", async () => {
    const examen = {
      id: "examen-1",
      alumnoId: "alumno-1",
      tipo: "TEORICO",
      fecha: "2026-10-10T09:00:00Z",
      estado: "PROGRAMADO",
    };

    const repositoryMock = {
      findById: vi.fn().mockResolvedValue(examen),
    };

    const service = new ExamenesService(repositoryMock);

    const result = await service.getById("examen-1");

    expect(repositoryMock.findById).toHaveBeenCalledWith("examen-1");

    expect(result).toEqual(examen);
  });
  it("debe actualizar un examen existente", async () => {
    const examenActualizado = {
      id: "examen-1",
      alumnoId: "alumno-1",
      tipo: "PRACTICO",
      fecha: "2026-10-15T11:00:00Z",
      estado: "PROGRAMADO",
    };

    const repositoryMock = {
      update: vi.fn().mockResolvedValue(examenActualizado),
    };

    const service = new ExamenesService(repositoryMock);

    const result = await service.update("examen-1", {
      tipo: "PRACTICO",
      fecha: "2026-10-15T11:00:00Z",
    });

    expect(repositoryMock.update).toHaveBeenCalledWith("examen-1", {
      tipo: "PRACTICO",
      fecha: "2026-10-15T11:00:00Z",
    });

    expect(result).toEqual(examenActualizado);
  });
  it("debe registrar un resultado APROBADO", async () => {
    const examenActualizado = {
      id: "examen-1",
      alumnoId: "alumno-1",
      tipo: "TEORICO",
      fecha: "2026-10-10T09:00:00Z",
      estado: "APROBADO",
    };

    const repositoryMock = {
      update: vi.fn().mockResolvedValue(examenActualizado),
    };

    const service = new ExamenesService(repositoryMock);

    const result = await service.registerResult("examen-1", "APROBADO");

    expect(repositoryMock.update).toHaveBeenCalledWith("examen-1", {
      estado: "APROBADO",
    });

    expect(result).toEqual(examenActualizado);
  });
  it("debe eliminar un examen", async () => {
    const repositoryMock = {
      delete: vi.fn().mockResolvedValue({ id: "examen-1" }),
    };

    const service = new ExamenesService(repositoryMock);

    const result = await service.delete("examen-1");

    expect(repositoryMock.delete).toHaveBeenCalledWith("examen-1");
    expect(result).toEqual({ id: "examen-1" });
  });
  it("debe lanzar un error cuando el resultado no es válido", async () => {
    const repositoryMock = {
      update: vi.fn(),
    };

    const service = new ExamenesService(repositoryMock);

    await expect(
      service.registerResult("examen-1", "PENDIENTE"),
    ).rejects.toThrow("El resultado debe ser APROBADO o SUSPENDIDO");

    expect(repositoryMock.update).not.toHaveBeenCalled();
  });
});
