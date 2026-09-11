import { describe, expect, it, vi } from "vitest";

import { ConvocatoriasExamenService } from "../convocatorias-examen.service.js";

describe("ConvocatoriasExamenService", () => {
  it("crea convocatoria con datos validos", async () => {
    const repositoryMock = {
      findDuplicate: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({
        id: "conv-1",
        licencia: "B",
        tipoExamen: "TEORICO",
      }),
    };

    const service = new ConvocatoriasExamenService(repositoryMock);

    const result = await service.create({
      fecha: "2026-09-25",
      licencia: " b ",
      tipoExamen: " teorico ",
      activo: true,
    });

    expect(repositoryMock.findDuplicate).toHaveBeenCalledOnce();
    expect(repositoryMock.create).toHaveBeenCalledOnce();
    expect(result.id).toBe("conv-1");
  });

  it("falla cuando la fecha es invalida", async () => {
    const repositoryMock = {
      create: vi.fn(),
    };

    const service = new ConvocatoriasExamenService(repositoryMock);

    await expect(
      service.create({
        fecha: "no-fecha",
        licencia: "B",
        tipoExamen: "TEORICO",
      }),
    ).rejects.toThrow("obligatoria");
  });

  it("falla cuando existe una convocatoria duplicada", async () => {
    const repositoryMock = {
      findDuplicate: vi.fn().mockResolvedValue({
        id: "conv-existente",
        fecha: new Date("2026-09-25T12:00:00.000Z"),
        licencia: "B",
        tipoExamen: "TEORICO",
      }),
      create: vi.fn(),
    };

    const service = new ConvocatoriasExamenService(repositoryMock);

    await expect(
      service.create({
        fecha: "2026-09-25",
        licencia: "B",
        tipoExamen: "TEORICO",
      }),
    ).rejects.toThrow("Ya existe una convocatoria");

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });

  it("valida parametros de agenda", async () => {
    const repositoryMock = {
      findAgendaWithConfirmedStudents: vi.fn().mockResolvedValue([]),
    };

    const service = new ConvocatoriasExamenService(repositoryMock);

    await expect(service.getAgenda({ year: "abc", month: 9 })).rejects.toThrow(
      "year",
    );

    await expect(service.getAgenda({ year: 2026, month: 13 })).rejects.toThrow(
      "month",
    );
  });

  it("valida tipo en filtros de listado", async () => {
    const repositoryMock = {
      findAll: vi.fn().mockResolvedValue([]),
    };

    const service = new ConvocatoriasExamenService(repositoryMock);

    await expect(service.getAll({ tipoExamen: "otro" })).rejects.toThrow(
      "TEORICO o PRACTICO",
    );
  });
});
