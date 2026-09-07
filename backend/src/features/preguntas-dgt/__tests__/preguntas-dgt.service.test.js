import { describe, it, expect, vi } from "vitest";

import { PreguntasDGTService } from "../preguntas-dgt.service.js";

describe("PreguntasDGTService", () => {
  it("debe crear una pregunta con payload normalizado", async () => {
    const preguntaCreada = {
      id: "preg-1",
      enunciado: "¿Qué debes hacer?",
    };

    const repositoryMock = {
      create: vi.fn().mockResolvedValue(preguntaCreada),
    };

    const service = new PreguntasDGTService(repositoryMock);

    const result = await service.create(
      {
        licencia: [" b ", "B"],
        enunciado: "  ¿Qué debes hacer?  ",
        explicacion: "  Mantener distancia  ",
        activa: "false",
        respuestas: [
          { texto: "A", correcta: "false" },
          { texto: "B", correcta: "true" },
          { texto: "C", correcta: false },
          { texto: "D", correcta: false },
        ],
      },
      { filename: "pregunta.webp" },
    );

    expect(repositoryMock.create).toHaveBeenCalledWith({
      licencia: ["B"],
      enunciado: "¿Qué debes hacer?",
      imagenRuta: "/api/uploads/preguntas-dgt/pregunta.webp",
      explicacion: "Mantener distancia",
      activa: false,
      respuestas: {
        create: [
          { texto: "A", correcta: false, orden: 1 },
          { texto: "B", correcta: true, orden: 2 },
          { texto: "C", correcta: false, orden: 3 },
          { texto: "D", correcta: false, orden: 4 },
        ],
      },
    });

    expect(result).toEqual(preguntaCreada);
  });

  it("debe lanzar error si enunciado es obligatorio", async () => {
    const repositoryMock = {
      create: vi.fn(),
    };

    const service = new PreguntasDGTService(repositoryMock);

    await expect(
      service.create({
        licencia: ["B"],
        enunciado: "",
        respuestas: [
          { texto: "A", correcta: true },
          { texto: "B", correcta: false },
          { texto: "C", correcta: false },
          { texto: "D", correcta: false },
        ],
      }),
    ).rejects.toThrow("El enunciado es obligatorio");

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });

  it("debe lanzar error si no hay suficientes preguntas para generar examen", async () => {
    const repositoryMock = {
      getRandomQuestions: vi
        .fn()
        .mockResolvedValue(Array(12).fill({ id: "p" })),
    };

    const service = new PreguntasDGTService(repositoryMock);

    await expect(service.generateExam("alumno-1", "b")).rejects.toThrow(
      "No hay suficientes preguntas activas para esta licencia (mínimo 30)",
    );

    expect(repositoryMock.getRandomQuestions).toHaveBeenCalledWith("B", 30);
  });

  it("debe generar examen cuando hay preguntas suficientes", async () => {
    const preguntas = Array.from({ length: 30 }, (_, i) => ({ id: `p-${i}` }));

    const repositoryMock = {
      getRandomQuestions: vi.fn().mockResolvedValue(preguntas),
    };

    const service = new PreguntasDGTService(repositoryMock);

    const result = await service.generateExam("alumno-1", "B");

    expect(repositoryMock.getRandomQuestions).toHaveBeenCalledWith("B", 30);
    expect(result).toEqual(preguntas);
  });

  it("debe corregir examen usando preguntas válidas desde base de datos", async () => {
    const repositoryMock = {
      getActiveQuestionsByIds: vi.fn().mockResolvedValue([
        {
          id: "preg-1",
          respuestas: [
            { id: "r1", correcta: true },
            { id: "r2", correcta: false },
          ],
        },
        {
          id: "preg-2",
          respuestas: [
            { id: "r3", correcta: false },
            { id: "r4", correcta: true },
          ],
        },
      ]),
      saveExamResult: vi.fn().mockResolvedValue({ id: "exam-1" }),
    };

    const service = new PreguntasDGTService(repositoryMock);

    const result = await service.corregirExamen({
      alumnoId: "alumno-1",
      licencia: "b",
      preguntas: [{ id: "preg-1" }, { id: "preg-2" }],
      respuestasAlumno: [
        { preguntaId: "preg-1", respuestaId: "r1" },
        { preguntaId: "preg-2", respuestaId: "r3" },
      ],
      duracionSegundos: "1234",
    });

    expect(repositoryMock.getActiveQuestionsByIds).toHaveBeenCalledWith(
      ["preg-1", "preg-2"],
      "B",
    );

    expect(repositoryMock.saveExamResult).toHaveBeenCalledWith({
      alumnoId: "alumno-1",
      licencia: "B",
      totalPreguntas: 2,
      aciertos: 1,
      fallos: 1,
      aprobado: true,
      duracionSegundos: 1234,
    });

    expect(result).toEqual({
      examenId: "exam-1",
      aciertos: 1,
      fallos: 1,
      aprobado: true,
    });
  });

  it("debe lanzar error si hay preguntas no válidas para la licencia", async () => {
    const repositoryMock = {
      getActiveQuestionsByIds: vi.fn().mockResolvedValue([
        {
          id: "preg-1",
          respuestas: [{ id: "r1", correcta: true }],
        },
      ]),
      saveExamResult: vi.fn(),
    };

    const service = new PreguntasDGTService(repositoryMock);

    await expect(
      service.corregirExamen({
        alumnoId: "alumno-1",
        licencia: "B",
        preguntas: [{ id: "preg-1" }, { id: "preg-2" }],
        respuestasAlumno: [
          { preguntaId: "preg-1", respuestaId: "r1" },
          { preguntaId: "preg-2", respuestaId: "r9" },
        ],
      }),
    ).rejects.toThrow(
      "Algunas preguntas no existen, no están activas o no corresponden a la licencia",
    );

    expect(repositoryMock.saveExamResult).not.toHaveBeenCalled();
  });
});
