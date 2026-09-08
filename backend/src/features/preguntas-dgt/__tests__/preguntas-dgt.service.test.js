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
        licencia: '[" b ", "B"]',
        enunciado: "  ¿Qué debes hacer?  ",
        explicacion: "  Mantener distancia  ",
        activa: "false",
        respuestas: JSON.stringify([
          { texto: "A", correcta: "false" },
          { texto: "B", correcta: "true" },
          { texto: "C", correcta: false },
          { texto: "D", correcta: false },
        ]),
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
        ],
      }),
    ).rejects.toThrow("El enunciado es obligatorio");

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });

  it("debe lanzar error si no hay suficientes preguntas para generar examen", async () => {
    const repositoryMock = {
      getRandomQuestions: vi.fn().mockResolvedValue(
        Array.from({ length: 12 }, (_, i) => ({
          id: `p-${i}`,
          enunciado: `Pregunta ${i + 1}`,
          imagenRuta: null,
          respuestas: [
            { id: `r-${i}-1`, texto: "A", orden: 1 },
            { id: `r-${i}-2`, texto: "B", orden: 2 },
            { id: `r-${i}-3`, texto: "C", orden: 3 },
          ],
        })),
      ),
    };

    const service = new PreguntasDGTService(repositoryMock);

    await expect(service.generateExam("alumno-1", "b")).rejects.toThrow(
      "No hay suficientes preguntas activas para esta licencia (mínimo 30)",
    );

    expect(repositoryMock.getRandomQuestions).toHaveBeenCalledWith("B", 30);
  });

  it("debe generar examen cuando hay preguntas suficientes", async () => {
    const preguntas = Array.from({ length: 30 }, (_, i) => ({
      id: `p-${i}`,
      enunciado: `Pregunta ${i + 1}`,
      imagenRuta: `/api/uploads/preguntas-dgt/p-${i}.webp`,
      respuestas: [
        { id: `r-${i}-1`, texto: "A", orden: 1, correcta: false },
        { id: `r-${i}-2`, texto: "B", orden: 2, correcta: true },
        { id: `r-${i}-3`, texto: "C", orden: 3, correcta: false },
      ],
    }));

    const repositoryMock = {
      getRandomQuestions: vi.fn().mockResolvedValue(preguntas),
    };

    const service = new PreguntasDGTService(repositoryMock);

    const result = await service.generateExam("alumno-1", "B");

    expect(repositoryMock.getRandomQuestions).toHaveBeenCalledWith("B", 30);
    expect(result).toHaveLength(30);
    expect(result[0]).toEqual({
      id: "p-0",
      enunciado: "Pregunta 1",
      imagenRuta: "/api/uploads/preguntas-dgt/p-0.webp",
      respuestas: expect.arrayContaining([
        expect.objectContaining({ id: "r-0-1", texto: "A", orden: 1 }),
        expect.objectContaining({ id: "r-0-2", texto: "B", orden: 2 }),
        expect.objectContaining({ id: "r-0-3", texto: "C", orden: 3 }),
      ]),
    });
    expect(result[0].respuestas[0].correcta).toBeUndefined();
  });

  it("debe aceptar una pregunta con 3 respuestas", async () => {
    const repositoryMock = {
      create: vi.fn().mockResolvedValue({ id: "preg-3-resp" }),
    };

    const service = new PreguntasDGTService(repositoryMock);

    await service.create({
      licencia: ["B"],
      enunciado: "¿Qué prioridad aplica?",
      respuestas: [
        { texto: "Primera", correcta: false },
        { texto: "Segunda", correcta: true },
        { texto: "Tercera", correcta: false },
      ],
    });

    expect(repositoryMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        respuestas: {
          create: [
            { texto: "Primera", correcta: false, orden: 1 },
            { texto: "Segunda", correcta: true, orden: 2 },
            { texto: "Tercera", correcta: false, orden: 3 },
          ],
        },
      }),
    );
  });

  it("debe rechazar si hay más de 4 respuestas", async () => {
    const repositoryMock = {
      create: vi.fn(),
    };

    const service = new PreguntasDGTService(repositoryMock);

    await expect(
      service.create({
        licencia: ["B"],
        enunciado: "¿Pregunta inválida?",
        respuestas: [
          { texto: "A", correcta: true },
          { texto: "B", correcta: false },
          { texto: "C", correcta: false },
          { texto: "D", correcta: false },
          { texto: "E", correcta: false },
        ],
      }),
    ).rejects.toThrow("Debe existir entre 3 y 4 respuestas");
  });

  it("debe permitir eliminar imagen existente al actualizar", async () => {
    const repositoryMock = {
      findById: vi.fn().mockResolvedValue({
        id: "preg-1",
        imagenRuta: "/api/uploads/preguntas-dgt/old.webp",
      }),
      update: vi.fn().mockResolvedValue({ id: "preg-1", imagenRuta: null }),
    };

    const service = new PreguntasDGTService(repositoryMock);

    await service.update("preg-1", {
      licencia: ["B"],
      enunciado: "Pregunta",
      respuestas: [
        { texto: "A", correcta: true },
        { texto: "B", correcta: false },
        { texto: "C", correcta: false },
      ],
      eliminarImagen: "true",
    });

    expect(repositoryMock.update).toHaveBeenCalledWith(
      "preg-1",
      expect.objectContaining({
        imagenRuta: null,
      }),
    );
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
      duracionSegundos: null,
    });

    expect(result).toEqual({
      examenId: "exam-1",
      aciertos: 1,
      fallos: 1,
      aprobado: true,
      correccion: [
        {
          preguntaId: "preg-1",
          respuestaAlumnoId: "r1",
          respuestaCorrectaId: "r1",
          esCorrecta: true,
        },
        {
          preguntaId: "preg-2",
          respuestaAlumnoId: "r3",
          respuestaCorrectaId: "r4",
          esCorrecta: false,
        },
      ],
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
