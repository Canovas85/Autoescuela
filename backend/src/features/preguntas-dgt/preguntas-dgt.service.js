import fs from "fs";
import path from "path";

import { PREGUNTAS_DGT_UPLOAD_DIR } from "./preguntas-dgt.upload.js";

const LICENCIAS_VALIDAS = ["B", "A1", "A2", "A", "C", "D", "E"];

const normalizarTexto = (valor) =>
  typeof valor === "string" ? valor.trim() : "";

const parsearJsonSiString = (valor) => {
  if (typeof valor !== "string") {
    return valor;
  }

  const texto = valor.trim();

  if (!texto.startsWith("[") && !texto.startsWith("{")) {
    return valor;
  }

  try {
    return JSON.parse(texto);
  } catch {
    return valor;
  }
};

const normalizarBoolean = (valor, valorPorDefecto = false) => {
  if (valor === undefined || valor === null || valor === "") {
    return valorPorDefecto;
  }

  if (typeof valor === "boolean") {
    return valor;
  }

  if (typeof valor === "string") {
    const normalizado = valor.trim().toLowerCase();

    if (normalizado === "true" || normalizado === "1") {
      return true;
    }

    if (normalizado === "false" || normalizado === "0") {
      return false;
    }
  }

  if (valor === 1) {
    return true;
  }

  if (valor === 0) {
    return false;
  }

  return Boolean(valor);
};

const mezclarAleatorio = (items = []) => {
  const copia = [...items];

  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }

  return copia;
};

export class PreguntasDGTService {
  constructor(repository) {
    this.repository = repository;
  }

  validarLicenciaUnica(licencia) {
    const licenciaNormalizada = normalizarTexto(licencia).toUpperCase();

    if (!licenciaNormalizada) {
      throw new Error("La licencia es obligatoria");
    }

    if (!LICENCIAS_VALIDAS.includes(licenciaNormalizada)) {
      throw new Error("Licencia no válida");
    }

    return licenciaNormalizada;
  }

  normalizarLicencias(licenciaInput) {
    const licenciaParseada = parsearJsonSiString(licenciaInput);

    const licencia = Array.isArray(licenciaParseada)
      ? licenciaParseada
      : [licenciaParseada];

    const licenciasNormalizadas = licencia
      .map((item) => normalizarTexto(item).toUpperCase())
      .filter(Boolean);

    if (licenciasNormalizadas.length === 0) {
      throw new Error("Debe existir al menos una licencia");
    }

    const licenciasUnicas = [...new Set(licenciasNormalizadas)];

    const licenciasInvalidas = licenciasUnicas.filter(
      (item) => !LICENCIAS_VALIDAS.includes(item),
    );

    if (licenciasInvalidas.length > 0) {
      throw new Error("Existen licencias no válidas");
    }

    return licenciasUnicas;
  }

  normalizarRespuestas(respuestasInput) {
    const respuestasParseadas = parsearJsonSiString(respuestasInput);

    if (!Array.isArray(respuestasParseadas)) {
      throw new Error("Debe existir un listado de respuestas");
    }

    if (respuestasParseadas.length < 3 || respuestasParseadas.length > 4) {
      throw new Error("Debe existir entre 3 y 4 respuestas");
    }

    const respuestasNormalizadas = respuestasParseadas.map((respuesta, index) => {
      if (!respuesta || typeof respuesta !== "object") {
        throw new Error(`La respuesta ${index + 1} no es válida`);
      }

      const texto = normalizarTexto(respuesta.texto);

      if (!texto) {
        throw new Error(`La respuesta ${index + 1} debe tener texto`);
      }

      const correcta = normalizarBoolean(respuesta.correcta, false);

      return {
        texto,
        correcta,
        orden:
          Number.isInteger(respuesta.orden) && respuesta.orden > 0
            ? respuesta.orden
            : index + 1,
      };
    });

    const correctas = respuestasNormalizadas.filter(
      (respuesta) => respuesta.correcta === true,
    );

    if (correctas.length !== 1) {
      throw new Error("Debe existir una única respuesta correcta");
    }

    return respuestasNormalizadas;
  }

  validarPayload(data) {
    const enunciado = normalizarTexto(data.enunciado);

    if (!enunciado) {
      throw new Error("El enunciado es obligatorio");
    }

    const licencia = this.normalizarLicencias(data.licencia);
    const respuestas = this.normalizarRespuestas(data.respuestas);

    return {
      licencia,
      enunciado,
      imagenRuta: data.imagenRuta || null,
      explicacion: normalizarTexto(data.explicacion) || null,
      activa: normalizarBoolean(data.activa, true),
      respuestas,
    };
  }

  async create(data, imagenFile) {
    const payload = this.validarPayload(data);
    payload.imagenRuta = imagenFile
      ? `/api/uploads/preguntas-dgt/${imagenFile.filename}`
      : null;

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

  async update(id, data, imagenFile) {
    const preguntaActual = await this.repository.findById(id);

    if (!preguntaActual) {
      throw new Error("Pregunta no encontrada");
    }

    const payload = this.validarPayload(data);
    const eliminarImagen = normalizarBoolean(data.eliminarImagen, false);

    if (imagenFile) {
      payload.imagenRuta = `/api/uploads/preguntas-dgt/${imagenFile.filename}`;
    }

    if (!imagenFile && eliminarImagen) {
      payload.imagenRuta = null;
    }

    if (!imagenFile && !eliminarImagen && preguntaActual?.imagenRuta) {
      payload.imagenRuta = preguntaActual.imagenRuta;
    }

    const preguntaActualizada = await this.repository.update(id, {
      licencia: payload.licencia,
      enunciado: payload.enunciado,
      imagenRuta: payload.imagenRuta,
      explicacion: payload.explicacion,
      activa: payload.activa,
      respuestas: {
        deleteMany: {},
        create: payload.respuestas,
      },
    });

    if ((imagenFile || eliminarImagen) && preguntaActual?.imagenRuta) {
      const oldFilename = path.basename(preguntaActual.imagenRuta);
      const oldPath = path.join(PREGUNTAS_DGT_UPLOAD_DIR, oldFilename);

      try {
        fs.unlinkSync(oldPath);
      } catch {
        // no bloquea actualización
      }
    }

    return preguntaActualizada;
  }

  async delete(id) {
    const pregunta = await this.repository.findById(id);

    if (!pregunta) {
      throw new Error("Pregunta no encontrada");
    }

    return this.repository.delete(id);
  }

  async activate(id) {
    const pregunta = await this.repository.findById(id);

    if (!pregunta) {
      throw new Error("Pregunta no encontrada");
    }

    return this.repository.activate(id);
  }

  async deactivate(id) {
    const pregunta = await this.repository.findById(id);

    if (!pregunta) {
      throw new Error("Pregunta no encontrada");
    }

    return this.repository.deactivate(id);
  }

  async generateExam(alumnoId, licencia) {
    if (!alumnoId) {
      throw new Error("Alumno no válido");
    }

    const licenciaNormalizada = this.validarLicenciaUnica(licencia);

    const preguntas = await this.repository.getRandomQuestions(
      licenciaNormalizada,
      30,
    );

    if (preguntas.length < 30) {
      throw new Error(
        "No hay suficientes preguntas activas para esta licencia (mínimo 30)",
      );
    }

    return preguntas.map((pregunta) => ({
      id: pregunta.id,
      enunciado: pregunta.enunciado,
      imagenRuta: pregunta.imagenRuta || null,
      respuestas: mezclarAleatorio(
        (pregunta.respuestas || []).map((respuesta) => ({
          id: respuesta.id,
          texto: respuesta.texto,
          orden: respuesta.orden,
        })),
      ),
    }));
  }

  async corregirExamen({
    alumnoId,
    licencia,
    respuestasAlumno,
    preguntas,
    duracionSegundos,
  }) {
    if (!alumnoId) {
      throw new Error("Alumno no válido");
    }

    const licenciaNormalizada = this.validarLicenciaUnica(licencia);

    if (!Array.isArray(respuestasAlumno) || respuestasAlumno.length === 0) {
      throw new Error("Debe existir al menos una respuesta del alumno");
    }

    const respuestasNormalizadas = respuestasAlumno.map((respuesta, index) => {
      const preguntaId = normalizarTexto(respuesta?.preguntaId);
      const respuestaId = normalizarTexto(respuesta?.respuestaId);

      if (!preguntaId || !respuestaId) {
        throw new Error(
          `La respuesta del alumno en posición ${index + 1} no es válida`,
        );
      }

      return {
        preguntaId,
        respuestaId,
      };
    });

    const idsDesdePreguntas = Array.isArray(preguntas)
      ? preguntas
          .map((pregunta) => {
            if (typeof pregunta === "string") {
              return normalizarTexto(pregunta);
            }

            return normalizarTexto(pregunta?.id);
          })
          .filter(Boolean)
      : [];

    const preguntaIds = [
      ...new Set(
        idsDesdePreguntas.length > 0
          ? idsDesdePreguntas
          : respuestasNormalizadas.map((item) => item.preguntaId),
      ),
    ];

    if (preguntaIds.length === 0) {
      throw new Error("No se han recibido preguntas para corregir");
    }

    const preguntasValidas = await this.repository.getActiveQuestionsByIds(
      preguntaIds,
      licenciaNormalizada,
    );

    if (preguntasValidas.length !== preguntaIds.length) {
      throw new Error(
        "Algunas preguntas no existen, no están activas o no corresponden a la licencia",
      );
    }

    const correctasByPregunta = new Map();

    preguntasValidas.forEach((pregunta) => {
      const correcta = pregunta.respuestas.find((respuesta) => respuesta.correcta);

      if (correcta) {
        correctasByPregunta.set(pregunta.id, correcta.id);
      }
    });

    let aciertos = 0;

    respuestasNormalizadas.forEach((respuesta) => {
      const correctaId = correctasByPregunta.get(respuesta.preguntaId);

      if (correctaId && respuesta.respuestaId === correctaId) {
        aciertos++;
      }
    });

    const totalPreguntas = preguntasValidas.length;
    const fallos = totalPreguntas - aciertos;
    const aprobado = fallos <= 3;

    const duracionNormalizada = Number(duracionSegundos);
    const duracionSegundosValida =
      Number.isFinite(duracionNormalizada) && duracionNormalizada >= 0
        ? Math.trunc(duracionNormalizada)
        : null;

    const examen = await this.repository.saveExamResult({
      alumnoId,
      licencia: licenciaNormalizada,
      totalPreguntas,
      aciertos,
      fallos,
      aprobado,
      duracionSegundos: duracionSegundosValida,
    });

    return {
      examenId: examen.id,
      aciertos,
      fallos,
      aprobado,
    };
  }
}
