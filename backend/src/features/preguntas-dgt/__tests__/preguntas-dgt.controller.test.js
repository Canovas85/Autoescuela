import { describe, it, expect, vi } from "vitest";

import { PreguntasDGTController } from "../preguntas-dgt.controller.js";

describe("PreguntasDGTController", () => {
  it("debe crear pregunta y devolver HTTP 201", async () => {
    const pregunta = { id: "preg-1" };

    const serviceMock = {
      create: vi.fn().mockResolvedValue(pregunta),
    };

    const controller = new PreguntasDGTController(serviceMock);

    const req = {
      body: {
        enunciado: "¿Test?",
      },
      file: {
        filename: "img.webp",
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.create(req, res);

    expect(serviceMock.create).toHaveBeenCalledWith(req.body, req.file);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(pregunta);
  });

  it("debe devolver HTTP 400 en error de create", async () => {
    const serviceMock = {
      create: vi.fn().mockRejectedValue(new Error("Payload inválido")),
    };

    const controller = new PreguntasDGTController(serviceMock);

    const req = { body: {} };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Payload inválido",
    });
  });

  it("debe devolver HTTP 404 cuando getById falla", async () => {
    const serviceMock = {
      getById: vi.fn().mockRejectedValue(new Error("Pregunta no encontrada")),
    };

    const controller = new PreguntasDGTController(serviceMock);

    const req = {
      params: {
        id: "no-existe",
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.getById(req, res);

    expect(serviceMock.getById).toHaveBeenCalledWith("no-existe");
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Pregunta no encontrada",
    });
  });

  it("debe desactivar pregunta y devolver mensaje", async () => {
    const serviceMock = {
      delete: vi.fn().mockResolvedValue(undefined),
    };

    const controller = new PreguntasDGTController(serviceMock);

    const req = {
      params: {
        id: "preg-1",
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.delete(req, res);

    expect(serviceMock.delete).toHaveBeenCalledWith("preg-1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Pregunta desactivada correctamente",
    });
  });

  it("debe generar examen con licencia de body cuando user no la tiene", async () => {
    const preguntas = [{ id: "preg-1" }];

    const serviceMock = {
      generateExam: vi.fn().mockResolvedValue(preguntas),
    };

    const controller = new PreguntasDGTController(serviceMock);

    const req = {
      user: {
        id: "alumno-1",
      },
      body: {
        licencia: "B",
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.generarExamen(req, res);

    expect(serviceMock.generateExam).toHaveBeenCalledWith("alumno-1", "B");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(preguntas);
  });

  it("debe corregir examen y devolver resultado", async () => {
    const resultado = {
      examenId: "exam-1",
      aciertos: 28,
      fallos: 2,
      aprobado: true,
    };

    const serviceMock = {
      corregirExamen: vi.fn().mockResolvedValue(resultado),
    };

    const controller = new PreguntasDGTController(serviceMock);

    const req = {
      user: {
        id: "alumno-1",
      },
      body: {
        licencia: "B",
        preguntas: [{ id: "preg-1" }],
        respuestasAlumno: [{ preguntaId: "preg-1", respuestaId: "r1" }],
        duracionSegundos: 1200,
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.corregirExamen(req, res);

    expect(serviceMock.corregirExamen).toHaveBeenCalledWith({
      alumnoId: "alumno-1",
      licencia: "B",
      preguntas: [{ id: "preg-1" }],
      respuestasAlumno: [{ preguntaId: "preg-1", respuestaId: "r1" }],
      duracionSegundos: 1200,
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(resultado);
  });
});
