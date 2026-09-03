import { describe, expect, it, vi } from "vitest";

import { FacturasService } from "../facturas.service.js";

describe("FacturasService", () => {
  it("debe devolver todas las facturas", async () => {
    const facturas = [{ id: "fac-1" }, { id: "fac-2" }];

    const repositoryMock = {
      findAll: vi.fn().mockResolvedValue(facturas),
    };

    const service = new FacturasService(repositoryMock);

    const result = await service.getAll();

    expect(repositoryMock.findAll).toHaveBeenCalledOnce();
    expect(result).toEqual(facturas);
  });

  it("debe devolver las facturas del alumno autenticado", async () => {
    const facturas = [{ id: "fac-1", alumnoId: "alumno-1" }];

    const repositoryMock = {
      findByAlumnoId: vi.fn().mockResolvedValue(facturas),
    };

    const service = new FacturasService(repositoryMock);

    const result = await service.getMine("alumno-1");

    expect(repositoryMock.findByAlumnoId).toHaveBeenCalledWith("alumno-1");
    expect(result).toEqual(facturas);
  });
});
