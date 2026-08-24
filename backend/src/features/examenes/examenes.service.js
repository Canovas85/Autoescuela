const TIPOS_VALIDOS = ["TEORICO", "PRACTICO"];
const ESTADOS_VALIDOS = [
  "PENDIENTE",
  "PROGRAMADO",
  "APROBADO",
  "SUSPENDIDO",
  "CANCELADO",
];

const normalizarTexto = (valor) =>
  typeof valor === "string" ? valor.trim() : "";

export class ExamenesService {
  constructor(repository) {
    this.repository = repository;
  }

  validarPayload(data, { requireFull = false } = {}) {
    const alumnoId = normalizarTexto(data.alumnoId);

    if (requireFull && !alumnoId) {
      throw new Error("El alumno es obligatorio");
    }

    if (data.alumnoId !== undefined && !alumnoId) {
      throw new Error("El alumno es obligatorio");
    }

    const tipo = normalizarTexto(data.tipo || "").toUpperCase();

    if (requireFull && !tipo) {
      throw new Error("El tipo de examen es obligatorio");
    }

    if (data.tipo !== undefined && tipo && !TIPOS_VALIDOS.includes(tipo)) {
      throw new Error("El tipo de examen debe ser TEORICO o PRACTICO");
    }

    const fecha = data.fecha ? new Date(data.fecha) : null;

    if (data.fecha !== undefined && (!fecha || Number.isNaN(fecha.getTime()))) {
      throw new Error("La fecha del examen no es válida");
    }

    if (requireFull && !data.fecha) {
      throw new Error("La fecha del examen es obligatoria");
    }

    const payload = {};

    if (alumnoId) payload.alumnoId = alumnoId;
    if (tipo) payload.tipo = tipo;
    if (data.fecha !== undefined) {
      payload.fecha = data.fecha;
    }

    if (data.observaciones !== undefined) {
      payload.observaciones = normalizarTexto(data.observaciones) || null;
    }

    if (data.estado !== undefined) {
      const estado = normalizarTexto(data.estado).toUpperCase();
      if (!ESTADOS_VALIDOS.includes(estado)) {
        throw new Error("El estado del examen no es válido");
      }
      payload.estado = estado;
    }

    return payload;
  }

  async create(data) {
    const payload = this.validarPayload(data, { requireFull: true });

    return this.repository.create({
      ...payload,
      estado: "PROGRAMADO",
    });
  }

  async getAll() {
    return this.repository.findAll();
  }

  async getById(id) {
    const examen = await this.repository.findById(id);

    if (!examen) {
      throw new Error("Examen no encontrado");
    }

    return examen;
  }

  async update(id, data) {
    return this.repository.update(id, this.validarPayload(data));
  }

  async delete(id) {
    return this.repository.delete(id);
  }

  async registerResult(id, estado) {
    const validResults = ["APROBADO", "SUSPENDIDO"];

    if (!validResults.includes(estado)) {
      throw new Error("El resultado debe ser APROBADO o SUSPENDIDO");
    }

    return this.repository.update(id, {
      estado,
    });
  }
}
