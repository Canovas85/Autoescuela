import { describe, it, expect, vi } from "vitest";

import { MatriculasController } from "../matriculas.controller.js";

describe("MatriculasController", () => {
  it("debe crear una matrícula y devolver HTTP 201", async () => {
    const matriculaCreada = {
      id: "matricula-1",
      alumnoId: "alumno-1",
      promocionId: "promocion-1",
      estado: "PENDIENTE",
    };

    const serviceMock = {
      create: vi.fn().mockResolvedValue(matriculaCreada),
    };

    const controller = new MatriculasController(serviceMock);
    const req = {
      body: {
        alumnoId: "alumno-1",
        promocionId: "promocion-1",
      },
    };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.create(req, res);

    expect(serviceMock.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(matriculaCreada);
  });

  it("debe devolver el error de creación en HTTP 400", async () => {
    const serviceMock = {
      create: vi.fn().mockRejectedValue(new Error("Error al crear matrícula")),
    };

    const controller = new MatriculasController(serviceMock);
    const req = { body: { alumnoId: "alumno-1" } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error al crear matrícula",
    });
  });

  it("debe devolver todas las matrículas con HTTP 200", async () => {
    const matriculas = [
      { id: "matricula-1", alumnoId: "alumno-1" },
      { id: "matricula-2", alumnoId: "alumno-2" },
    ];

    const serviceMock = {
      getAll: vi.fn().mockResolvedValue(matriculas),
    };

    const controller = new MatriculasController(serviceMock);
    const req = {};
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.getAll(req, res);

    expect(serviceMock.getAll).toHaveBeenCalledOnce();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(matriculas);
  });

  it("debe devolver una matrícula por id con HTTP 200", async () => {
    const matricula = {
      id: "matricula-1",
      alumnoId: "alumno-1",
      estado: "PENDIENTE",
    };

    const serviceMock = {
      getById: vi.fn().mockResolvedValue(matricula),
    };

    const controller = new MatriculasController(serviceMock);
    const req = { params: { id: "matricula-1" } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.getById(req, res);

    expect(serviceMock.getById).toHaveBeenCalledWith("matricula-1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(matricula);
  });

  it("debe devolver 404 si la matrícula no existe al buscar por id", async () => {
    const serviceMock = {
      getById: vi.fn().mockRejectedValue(new Error("Matrícula no encontrada")),
    };

    const controller = new MatriculasController(serviceMock);
    const req = { params: { id: "matricula-404" } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.getById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Matrícula no encontrada",
    });
  });

  it("debe actualizar una matrícula y devolver HTTP 200", async () => {
    const matriculaActualizada = {
      id: "matricula-1",
      alumnoId: "alumno-1",
      promocionId: "promocion-2",
      estado: "PENDIENTE",
    };

    const serviceMock = {
      update: vi.fn().mockResolvedValue(matriculaActualizada),
    };

    const controller = new MatriculasController(serviceMock);
    const req = {
      params: { id: "matricula-1" },
      body: { promocionId: "promocion-2" },
    };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.update(req, res);

    expect(serviceMock.update).toHaveBeenCalledWith("matricula-1", {
      promocionId: "promocion-2",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(matriculaActualizada);
  });

  it("debe devolver 400 si falla la actualización", async () => {
    const serviceMock = {
      update: vi.fn().mockRejectedValue(new Error("No se pudo actualizar")),
    };

    const controller = new MatriculasController(serviceMock);
    const req = {
      params: { id: "matricula-1" },
      body: { promocionId: "promocion-2" },
    };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.update(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "No se pudo actualizar" });
  });

  it("debe marcar una matrícula como pagada con HTTP 200", async () => {
    const matriculaPagada = { id: "matricula-1", estado: "PAGADA" };

    const serviceMock = {
      pagar: vi.fn().mockResolvedValue(matriculaPagada),
    };

    const controller = new MatriculasController(serviceMock);
    const req = { params: { id: "matricula-1" } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.pagar(req, res);

    expect(serviceMock.pagar).toHaveBeenCalledWith("matricula-1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(matriculaPagada);
  });

  it("debe anular una matrícula con HTTP 200", async () => {
    const matriculaAnulada = { id: "matricula-1", estado: "ANULADA" };

    const serviceMock = {
      anular: vi.fn().mockResolvedValue(matriculaAnulada),
    };

    const controller = new MatriculasController(serviceMock);
    const req = { params: { id: "matricula-1" } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.anular(req, res);

    expect(serviceMock.anular).toHaveBeenCalledWith("matricula-1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(matriculaAnulada);
  });

  it("debe devolver la matrícula del alumno autenticado con HTTP 200", async () => {
    const matricula = {
      id: "matricula-1",
      alumnoId: "alumno-1",
      estado: "PENDIENTE",
    };

    const serviceMock = {
      getMine: vi.fn().mockResolvedValue(matricula),
    };

    const controller = new MatriculasController(serviceMock);
    const req = { user: { id: "alumno-1" } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.getMine(req, res);

    expect(serviceMock.getMine).toHaveBeenCalledWith("alumno-1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(matricula);
  });

  it("debe devolver 404 si el alumno no tiene matrícula", async () => {
    const serviceMock = {
      getMine: vi
        .fn()
        .mockRejectedValue(
          new Error("No existe una matrícula asociada al alumno"),
        ),
    };

    const controller = new MatriculasController(serviceMock);
    const req = { user: { id: "alumno-404" } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.getMine(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "No existe una matrícula asociada al alumno",
    });
  });
});
