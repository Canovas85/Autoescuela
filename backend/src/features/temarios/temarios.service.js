const LICENCIAS_PERMITIDAS = ["B", "A1", "A2", "A", "C", "D", "E"];

const normalizarTexto = (valor) =>
  typeof valor === "string" ? valor.trim() : "";

const normalizarLicenciasObjetivo = (valor) => {
  const listaBase = Array.isArray(valor) ? valor : [valor];

  const licencias = [
    ...new Set(
      listaBase
        .map((item) => normalizarTexto(item).toUpperCase())
        .filter(Boolean),
    ),
  ];

  if (licencias.length === 0) {
    throw new Error("Debe existir al menos una licencia objetivo");
  }

  const invalidas = licencias.filter(
    (licencia) => !LICENCIAS_PERMITIDAS.includes(licencia),
  );

  if (invalidas.length > 0) {
    throw new Error("Licencias objetivo no válidas: " + invalidas.join(", "));
  }

  return licencias;
};

export class TemariosService {
  constructor(repository) {
    this.repository = repository;
  }

  mapTemarioAlumno(temarioConProgreso) {
    const progreso = temarioConProgreso.progreso?.[0] || null;

    return {
      id: temarioConProgreso.id,
      titulo: temarioConProgreso.titulo,
      descripcion: temarioConProgreso.descripcion,
      tipoLicenciaObjetivo: temarioConProgreso.tipoLicenciaObjetivo,
      orden: temarioConProgreso.orden,
      revisado: progreso?.revisado ?? false,
      dominio: progreso?.dominio ?? 0,
      ultimaRevision: progreso?.ultimaRevision ?? null,
    };
  }

  mapMiniTestIntento(intento) {
    return {
      id: intento.id,
      fecha: intento.fecha,
      resultado: intento.resultado,
      aciertos: intento.respuestasCorrectas,
      totalPreguntas: intento.totalPreguntas,
      porcentaje:
        intento.totalPreguntas > 0
          ? Math.round(
              (intento.respuestasCorrectas / intento.totalPreguntas) * 100,
            )
          : 0,
    };
  }

  validarPayload(data) {
    const titulo = normalizarTexto(data.titulo);

    if (!titulo) {
      throw new Error("El título es obligatorio");
    }

    const tipoLicenciaObjetivo = normalizarLicenciasObjetivo(
      data.tipoLicenciaObjetivo,
    );

    const orden = Number(data.orden);
    if (!Number.isInteger(orden) || orden < 0) {
      throw new Error("El orden debe ser un número entero igual o mayor que 0");
    }

    return {
      titulo,
      descripcion: normalizarTexto(data.descripcion) || null,
      tipoLicenciaObjetivo,
      orden,
    };
  }

  validarMiniTestResultado(data) {
    const aciertos = Number(data.aciertos);
    const totalPreguntas = Number(data.totalPreguntas);
    const porcentaje = Number(data.porcentaje);

    if (!Number.isInteger(aciertos) || aciertos < 0) {
      throw new Error("Los aciertos del mini test no son válidos");
    }

    if (!Number.isInteger(totalPreguntas) || totalPreguntas <= 0) {
      throw new Error("El total de preguntas del mini test no es válido");
    }

    if (aciertos > totalPreguntas) {
      throw new Error("Los aciertos no pueden superar el total de preguntas");
    }

    if (!Number.isFinite(porcentaje) || porcentaje < 0 || porcentaje > 100) {
      throw new Error("El porcentaje del mini test no es válido");
    }

    return {
      aciertos,
      totalPreguntas,
      porcentaje: Math.round(porcentaje),
    };
  }

  async create(data) {
    return this.repository.create(this.validarPayload(data));
  }

  async getAll() {
    return this.repository.findAll();
  }

  async getForAlumno(alumnoId) {
    const alumno = await this.repository.findAlumnoById(alumnoId);

    if (!alumno) {
      throw new Error("Alumno no encontrado");
    }

    const temarios = await this.repository.findForAlumnoByLicencia(
      alumno.id,
      alumno.tipoLicenciaObjetivo,
    );

    return temarios.map((temario) => this.mapTemarioAlumno(temario));
  }

  async getTemaForAlumno(alumnoId, temarioId) {
    const alumno = await this.repository.findAlumnoById(alumnoId);

    if (!alumno) {
      throw new Error("Alumno no encontrado");
    }

    const temario = await this.repository.findTemaForAlumno(
      alumno.id,
      temarioId,
      alumno.tipoLicenciaObjetivo,
    );

    if (!temario) {
      throw new Error("Tema no encontrado para tu permiso");
    }

    const historialIntentos = await this.repository.getMiniTestHistorial(
      alumno.id,
      temarioId,
    );

    return {
      ...this.mapTemarioAlumno(temario),
      historialIntentos: historialIntentos.map((intento) =>
        this.mapMiniTestIntento(intento),
      ),
    };
  }

  async saveMiniTestResultado(alumnoId, temarioId, data) {
    const alumno = await this.repository.findAlumnoById(alumnoId);

    if (!alumno) {
      throw new Error("Alumno no encontrado");
    }

    const temario = await this.repository.findTemaForAlumno(
      alumno.id,
      temarioId,
      alumno.tipoLicenciaObjetivo,
    );

    if (!temario) {
      throw new Error("Tema no encontrado para tu permiso");
    }

    const resultado = this.validarMiniTestResultado(data);

    await this.repository.createMiniTestIntento({
      alumnoId: alumno.id,
      temarioId,
      aciertos: resultado.aciertos,
      totalPreguntas: resultado.totalPreguntas,
      porcentaje: resultado.porcentaje,
    });

    await this.repository.saveMiniTestResultado({
      alumnoId: alumno.id,
      temarioId,
      dominio: resultado.porcentaje,
    });

    const temaActualizado = await this.repository.findTemaForAlumno(
      alumno.id,
      temarioId,
      alumno.tipoLicenciaObjetivo,
    );

    const historialIntentos = await this.repository.getMiniTestHistorial(
      alumno.id,
      temarioId,
    );

    return {
      message: "Resultado de mini test guardado correctamente",
      resultado,
      temario: {
        ...this.mapTemarioAlumno(temaActualizado),
        historialIntentos: historialIntentos.map((intento) =>
          this.mapMiniTestIntento(intento),
        ),
      },
    };
  }

  async getById(id) {
    const temario = await this.repository.findById(id);

    if (!temario) {
      throw new Error("Temario no encontrado");
    }

    return temario;
  }

  async update(id, data) {
    return this.repository.update(id, this.validarPayload(data));
  }

  async delete(id) {
    return this.repository.delete(id);
  }
}
