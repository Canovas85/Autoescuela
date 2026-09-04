const LICENCIAS_VALIDAS = ["B", "A1", "A2", "A", "C", "D", "E"];

const normalizarTexto = (valor) =>
  typeof valor === "string" ? valor.trim() : "";

export class PreguntasDGTService {
  constructor(repository) {
    this.repository = repository;
  }

  validarPayload(data) {
    const enunciado = normalizarTexto(data.enunciado);

    if (!enunciado) {
      throw new Error("El enunciado es obligatorio");
    }

    const licencia = Array.isArray(data.licencia)
      ? data.licencia
      : [data.licencia];

    if (licencia.length === 0) {
      throw new Error("Debe existir al menos una licencia");
    }

    const licenciasInvalidas = licencia.filter(
      (item) => !LICENCIAS_VALIDAS.includes(item),
    );

    if (licenciasInvalidas.length > 0) {
      throw new Error("Existen licencias no válidas");
    }

    if (!Array.isArray(data.respuestas)) {
      throw new Error("Debe existir un listado de respuestas");
    }

    if (data.respuestas.length !== 4) {
      throw new Error("Debe existir exactamente 4 respuestas");
    }

    const correctas = data.respuestas.filter(
      (respuesta) => respuesta.correcta === true,
    );

    if (correctas.length !== 1) {
      throw new Error("Debe existir una única respuesta correcta");
    }

    return {
      licencia,

      enunciado,

      imagenRuta: data.imagenRuta || null,

      explicacion: normalizarTexto(data.explicacion) || null,

      activa: data.activa === undefined ? true : Boolean(data.activa),

      respuestas: data.respuestas,
    };
  }

  async create(data) {
    const payload = this.validarPayload(data);

    return this.repository.create({
      licencia: payload.licencia,
      enunciado: payload.enunciado,
      imagenRuta: payload.imagenRuta,
      explicacion: payload.explicacion,
      activa: payload.activa,

      respuestas: {
        create: payload.respuestas,
      },
    });
  }

  async getAll() {
    return this.repository.findAll();
  }

  async getById(id) {
    const pregunta = await this.repository.findById(id);

    if (!pregunta) {
      throw new Error("Pregunta no encontrada");
    }

    return pregunta;
  }

  async update(id, data) {
    const payload = this.validarPayload(data);

    return this.repository.update(id, {
      licencia: payload.licencia,

      enunciado: payload.enunciado,

      imagenRuta: payload.imagenRuta,

      explicacion: payload.explicacion,

      activa: payload.activa,
    });
  }

  async delete(id) {
    return this.repository.delete(id);
  }

  async activate(id) {
    return this.repository.activate(id);
  }

  async deactivate(id) {
    return this.repository.deactivate(id);
  }

  async generateExam(alumnoId, licencia) {
    const preguntas = await this.repository.getRandomQuestions(licencia, 30);

    return preguntas;
  }

  async corregirExamen({
    alumnoId,
    licencia,
    respuestasAlumno,
    preguntas,
    duracionSegundos,
  }) {
    let aciertos = 0;

    preguntas.forEach((pregunta) => {
      const respuestaAlumno = respuestasAlumno.find(
        (r) => r.preguntaId === pregunta.id,
      );

      const correcta = pregunta.respuestas.find((r) => r.correcta);

      if (
        respuestaAlumno &&
        correcta &&
        respuestaAlumno.respuestaId === correcta.id
      ) {
        aciertos++;
      }
    });

    const totalPreguntas = preguntas.length;

    const fallos = totalPreguntas - aciertos;

    const aprobado = fallos <= 3;

    const examen = await this.repository.saveExamResult({
      alumnoId,
      licencia,

      totalPreguntas,

      aciertos,

      fallos,

      aprobado,

      duracionSegundos,
    });

    return {
      examenId: examen.id,

      aciertos,

      fallos,

      aprobado,
    };
  }
}
