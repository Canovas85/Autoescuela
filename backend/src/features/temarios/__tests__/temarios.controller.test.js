import { describe, it, expect, vi } from "vitest";

import { TemariosController } from "../temarios.controller.js";

describe("TemariosController", () => {
  it("debe crear un temario y devolver HTTP 201", async () => {
    const temarioCreado = {
      id: "temario-1",
      titulo: "Señales",
      tipoLicenciaObjetivo: "B",
      orden: 1,
    };

    const serviceMock = {
      create: vi.fn().mockResolvedValue(temarioCreado),
    };

    const controller = new TemariosController(serviceMock);

    const req = {
      body: {
        titulo: "Señales",
        descripcion: "Temario base",
        tipoLicenciaObjetivo: "B",
        orden: 1,
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.create(req, res);

    expect(serviceMock.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(temarioCreado);
  });

  it("debe devolver el listado completo de temarios", async () => {
    const temarios = [
      {
        id: "temario-1",
        titulo: "Señales",
      },
      {
        id: "temario-2",
        titulo: "Prioridad",
      },
    ];

    const serviceMock = {
      getAll: vi.fn().mockResolvedValue(temarios),
    };

    const controller = new TemariosController(serviceMock);

    const req = {};
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.getAll(req, res);

    expect(serviceMock.getAll).toHaveBeenCalledOnce();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(temarios);
  });

  it("debe devolver los temarios del alumno autenticado", async () => {
    const temarios = [
      {
        id: "temario-001",
        titulo: "Señales",
        tipoLicenciaObjetivo: "B",
      },
    ];

    const serviceMock = {
      getForAlumno: vi.fn().mockResolvedValue(temarios),
    };

    const controller = new TemariosController(serviceMock);

    const req = {
      user: { id: "alumno-1" },
    };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.getForAlumno(req, res);

    expect(serviceMock.getForAlumno).toHaveBeenCalledWith("alumno-1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(temarios);
  });

  it("debe devolver un tema del alumno autenticado", async () => {
    const temario = {
      id: "temario-001",
      titulo: "Señales",
      tipoLicenciaObjetivo: "B",
    };

    const serviceMock = {
      getTemaForAlumno: vi.fn().mockResolvedValue(temario),
    };

    const controller = new TemariosController(serviceMock);

    const req = {
      user: { id: "alumno-1" },
      params: { id: "temario-001" },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.getTemaForAlumno(req, res);

    expect(serviceMock.getTemaForAlumno).toHaveBeenCalledWith(
      "alumno-1",
      "temario-001",
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(temario);
  });

  it("debe guardar el resultado del mini test del alumno", async () => {
    const payload = {
      message: "Resultado de mini test guardado correctamente",
      resultado: {
        aciertos: 4,
        totalPreguntas: 5,
        porcentaje: 80,
      },
    };

    const serviceMock = {
      saveMiniTestResultado: vi.fn().mockResolvedValue(payload),
    };

    const controller = new TemariosController(serviceMock);

    const req = {
      user: { id: "alumno-1" },
      params: { id: "temario-001" },
      body: { aciertos: 4, totalPreguntas: 5, porcentaje: 80 },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.saveMiniTestResultado(req, res);

    expect(serviceMock.saveMiniTestResultado).toHaveBeenCalledWith(
      "alumno-1",
      "temario-001",
      req.body,
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(payload);
  });

  it("debe devolver un temario por id", async () => {
    const temario = {
      id: "temario-1",
      titulo: "Señales",
      tipoLicenciaObjetivo: "B",
      orden: 1,
    };

    const serviceMock = {
      getById: vi.fn().mockResolvedValue(temario),
    };

    const controller = new TemariosController(serviceMock);

    const req = {
      params: { id: "temario-1" },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.getById(req, res);

    expect(serviceMock.getById).toHaveBeenCalledWith("temario-1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(temario);
  });

  it("debe devolver HTTP 404 cuando el temario no existe", async () => {
    const serviceMock = {
      getById: vi.fn().mockRejectedValue(new Error("Temario no encontrado")),
    };

    const controller = new TemariosController(serviceMock);

    const req = {
      params: { id: "temario-1" },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.getById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Temario no encontrado",
    });
  });

  it("debe actualizar un temario existente", async () => {
    const temarioActualizado = {
      id: "temario-1",
      titulo: "Prioridad",
      tipoLicenciaObjetivo: "B",
      orden: 2,
    };

    const serviceMock = {
      update: vi.fn().mockResolvedValue(temarioActualizado),
    };

    const controller = new TemariosController(serviceMock);

    const req = {
      params: { id: "temario-1" },
      body: {
        titulo: "Prioridad",
        descripcion: "Temario actualizado",
        tipoLicenciaObjetivo: "B",
        orden: 2,
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.update(req, res);

    expect(serviceMock.update).toHaveBeenCalledWith("temario-1", req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(temarioActualizado);
  });

  it("debe devolver HTTP 400 cuando falla la actualización", async () => {
    const serviceMock = {
      update: vi.fn().mockRejectedValue(new Error("El título es obligatorio")),
    };

    const controller = new TemariosController(serviceMock);

    const req = {
      params: { id: "temario-1" },
      body: {},
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.update(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "El título es obligatorio",
    });
  });

  it("debe eliminar un temario", async () => {
    const serviceMock = {
      delete: vi.fn().mockResolvedValue({ id: "temario-1" }),
    };

    const controller = new TemariosController(serviceMock);

    const req = {
      params: { id: "temario-1" },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.delete(req, res);

    expect(serviceMock.delete).toHaveBeenCalledWith("temario-1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Temario eliminado correctamente",
    });
  });
});
