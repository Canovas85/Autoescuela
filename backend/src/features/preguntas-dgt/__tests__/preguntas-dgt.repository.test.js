import { describe, it, expect, vi } from "vitest";

import { PreguntasDGTRepository } from "../preguntas-dgt.repository.js";

describe("PreguntasDGTRepository", () => {
  it("debe crear una pregunta DGT con include de respuestas", async () => {
    const preguntaCreada = {
      id: "preg-1",
      enunciado: "¿Qué significa esta señal?",
      respuestas: [],
    };

    const prismaMock = {
      preguntaDGT: {
        create: vi.fn().mockResolvedValue(preguntaCreada),
      },
    };

    const repository = new PreguntasDGTRepository(prismaMock);

    const data = {
      licencia: ["B"],
      enunciado: "¿Qué significa esta señal?",
      respuestas: {
        create: [],
      },
    };

    const result = await repository.create(data);

    expect(prismaMock.preguntaDGT.create).toHaveBeenCalledWith({
      data,
      include: {
        respuestas: true,
      },
    });

    expect(result).toEqual(preguntaCreada);
  });

  it("debe hacer baja lógica al eliminar", async () => {
    const desactivada = {
      id: "preg-1",
      activa: false,
    };

    const prismaMock = {
      preguntaDGT: {
        update: vi.fn().mockResolvedValue(desactivada),
      },
    };

    const repository = new PreguntasDGTRepository(prismaMock);

    const result = await repository.delete("preg-1");

    expect(prismaMock.preguntaDGT.update).toHaveBeenCalledWith({
      where: {
        id: "preg-1",
      },
      data: {
        activa: false,
      },
    });

    expect(result).toEqual(desactivada);
  });

  it("debe filtrar preguntas activas por licencia al obtener aleatorias", async () => {
    const preguntas = [{ id: "1" }, { id: "2" }, { id: "3" }];

    const prismaMock = {
      preguntaDGT: {
        findMany: vi.fn().mockResolvedValue(preguntas),
      },
    };

    const repository = new PreguntasDGTRepository(prismaMock);

    const result = await repository.getRandomQuestions("B", 2);

    expect(prismaMock.preguntaDGT.findMany).toHaveBeenCalledWith({
      where: {
        activa: true,
        licencia: {
          has: "B",
        },
      },
      include: {
        respuestas: true,
      },
    });

    expect(result).toHaveLength(2);
  });

  it("debe obtener preguntas activas por ids y licencia", async () => {
    const preguntas = [{ id: "preg-1" }];

    const prismaMock = {
      preguntaDGT: {
        findMany: vi.fn().mockResolvedValue(preguntas),
      },
    };

    const repository = new PreguntasDGTRepository(prismaMock);

    const result = await repository.getActiveQuestionsByIds(["preg-1"], "B");

    expect(prismaMock.preguntaDGT.findMany).toHaveBeenCalledWith({
      where: {
        id: {
          in: ["preg-1"],
        },
        activa: true,
        licencia: {
          has: "B",
        },
      },
      include: {
        respuestas: true,
      },
    });

    expect(result).toEqual(preguntas);
  });

  it("debe guardar el resultado del examen DGT", async () => {
    const examen = {
      id: "exam-1",
      alumnoId: "alumno-1",
      aprobado: true,
    };

    const prismaMock = {
      examenDGTAlumno: {
        create: vi.fn().mockResolvedValue(examen),
      },
    };

    const repository = new PreguntasDGTRepository(prismaMock);

    const data = {
      alumnoId: "alumno-1",
      licencia: "B",
      totalPreguntas: 30,
      aciertos: 28,
      fallos: 2,
      aprobado: true,
      duracionSegundos: 1100,
    };

    const result = await repository.saveExamResult(data);

    expect(prismaMock.examenDGTAlumno.create).toHaveBeenCalledWith({
      data,
    });

    expect(result).toEqual(examen);
  });

  it("debe devolver historial de exámenes de alumno ordenado por fecha", async () => {
    const historial = [{ id: "exam-1" }];

    const prismaMock = {
      examenDGTAlumno: {
        findMany: vi.fn().mockResolvedValue(historial),
      },
    };

    const repository = new PreguntasDGTRepository(prismaMock);

    const result = await repository.getHistorialAlumno("alumno-1");

    expect(prismaMock.examenDGTAlumno.findMany).toHaveBeenCalledWith({
      where: {
        alumnoId: "alumno-1",
      },
      orderBy: {
        fecha: "desc",
      },
    });

    expect(result).toEqual(historial);
  });
});
