import { describe, it, expect, vi } from "vitest";

import { MatriculasService } from "../matriculas.service.js";

describe("MatriculasService", () => {
  it("debe crear una matrícula cuando los datos son válidos", async () => {
    const matriculaCreada = {
      id: "matricula-1",
      alumnoId: "alumno-1",
      promocionId: "promocion-1",
      tarifaMatriculaId: "tarifa-1",
      estado: "PENDIENTE",
      fechaCreacion: "2026-09-01T10:00:00Z",
    };

    const repositoryMock = {
      create: vi.fn().mockResolvedValue(matriculaCreada),
    };

    const service = new MatriculasService(repositoryMock);

    const result = await service.create({
      alumnoId: "alumno-1",
      promocionId: "promocion-1",
      tarifaMatriculaId: "tarifa-1",
      estado: "PENDIENTE",
    });

    expect(repositoryMock.create).toHaveBeenCalledWith({
      alumnoId: "alumno-1",
      promocionId: "promocion-1",
      tarifaMatriculaId: "tarifa-1",
      estado: "PENDIENTE",
    });

    expect(result).toEqual(matriculaCreada);
  });

  it("debe devolver todas las matrículas", async () => {
    const matriculas = [
      { id: "matricula-1", alumnoId: "alumno-1", estado: "PENDIENTE" },
      { id: "matricula-2", alumnoId: "alumno-2", estado: "PAGADA" },
    ];

    const repositoryMock = {
      findAll: vi.fn().mockResolvedValue(matriculas),
    };

    const service = new MatriculasService(repositoryMock);

    const result = await service.getAll();

    expect(repositoryMock.findAll).toHaveBeenCalledOnce();
    expect(result).toEqual(matriculas);
  });

  it("debe devolver una matrícula por id cuando existe", async () => {
    const matricula = {
      id: "matricula-1",
      alumnoId: "alumno-1",
      estado: "PENDIENTE",
    };

    const repositoryMock = {
      findById: vi.fn().mockResolvedValue(matricula),
    };

    const service = new MatriculasService(repositoryMock);

    const result = await service.getById("matricula-1");

    expect(repositoryMock.findById).toHaveBeenCalledWith("matricula-1");
    expect(result).toEqual(matricula);
  });

  it("debe lanzar un error si la matrícula no existe al buscar por id", async () => {
    const repositoryMock = {
      findById: vi.fn().mockResolvedValue(null),
    };

    const service = new MatriculasService(repositoryMock);

    await expect(service.getById("matricula-404")).rejects.toThrow(
      "Matrícula no encontrada",
    );
  });

  it("debe actualizar una matrícula existente", async () => {
    const matriculaActualizada = {
      id: "matricula-1",
      alumnoId: "alumno-1",
      estado: "PENDIENTE",
      promocionId: "promocion-2",
    };

    const repositoryMock = {
      update: vi.fn().mockResolvedValue(matriculaActualizada),
    };

    const service = new MatriculasService(repositoryMock);

    const result = await service.update("matricula-1", {
      promocionId: "promocion-2",
    });

    expect(repositoryMock.update).toHaveBeenCalledWith("matricula-1", {
      promocionId: "promocion-2",
    });
    expect(result).toEqual(matriculaActualizada);
  });

  it("debe marcar una matrícula como pagada", async () => {
    const matriculaPagada = {
      id: "matricula-1",
      alumnoId: "alumno-1",
      estado: "PAGADA",
    };

    const repositoryMock = {
      pagar: vi.fn().mockResolvedValue(matriculaPagada),
    };

    const service = new MatriculasService(repositoryMock);

    const result = await service.pagar("matricula-1");

    expect(repositoryMock.pagar).toHaveBeenCalledWith("matricula-1");
    expect(result).toEqual(matriculaPagada);
  });

  it("debe anular una matrícula", async () => {
    const matriculaAnulada = {
      id: "matricula-1",
      alumnoId: "alumno-1",
      estado: "ANULADA",
    };

    const repositoryMock = {
      anular: vi.fn().mockResolvedValue(matriculaAnulada),
    };

    const service = new MatriculasService(repositoryMock);

    const result = await service.anular("matricula-1");

    expect(repositoryMock.anular).toHaveBeenCalledWith("matricula-1");
    expect(result).toEqual(matriculaAnulada);
  });

  it("debe devolver la matrícula del alumno autenticado", async () => {
    const matricula = {
      id: "matricula-1",
      alumnoId: "alumno-1",
      estado: "PENDIENTE",
    };

    const repositoryMock = {
      findByAlumnoId: vi.fn().mockResolvedValue(matricula),
    };

    const service = new MatriculasService(repositoryMock);

    const result = await service.getMine("alumno-1");

    expect(repositoryMock.findByAlumnoId).toHaveBeenCalledWith("alumno-1");
    expect(result).toEqual(matricula);
  });

  it("debe lanzar un error si el alumno no tiene matrícula", async () => {
    const repositoryMock = {
      findByAlumnoId: vi.fn().mockResolvedValue(null),
    };

    const service = new MatriculasService(repositoryMock);

    await expect(service.getMine("alumno-404")).rejects.toThrow(
      "No existe una matrícula asociada al alumno",
    );
  });
});
