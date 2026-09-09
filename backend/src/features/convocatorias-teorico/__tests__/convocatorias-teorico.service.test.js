import { describe, expect, it, vi } from "vitest";

import { ConvocatoriasTeoricoService } from "../convocatorias-teorico.service.js";

describe("ConvocatoriasTeoricoService", () => {
  it("crea convocatoria con datos validos", async () => {
    const repositoryMock = {
      create: vi.fn().mockResolvedValue({
        id: "conv-1",
        licencia: "B",
      }),
    };

    const service = new ConvocatoriasTeoricoService(repositoryMock);

    const result = await service.create({
      fecha: "2026-09-25",
      licencia: " b ",
      activo: true,
    });

    expect(repositoryMock.create).toHaveBeenCalledOnce();
    expect(result.id).toBe("conv-1");
  });

  it("falla cuando la fecha es invalida", async () => {
    const repositoryMock = {
      create: vi.fn(),
    };

    const service = new ConvocatoriasTeoricoService(repositoryMock);

    await expect(
      service.create({
        fecha: "no-fecha",
        licencia: "B",
      }),
    ).rejects.toThrow("obligatoria");
  });
});
