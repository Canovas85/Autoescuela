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

export class SolicitudesExamenService {
  constructor(repository) {
    this.repository = repository;
  }

  validarPayload(data) {
    const alumnoId = normalizarTexto(data.alumnoId);
    if (!alumnoId) {
      throw new Error("El alumno es obligatorio");
    }

    const tipo = normalizarTexto(data.tipo).toUpperCase();
    if (!TIPOS_VALIDOS.includes(tipo)) {
      throw new Error("El tipo de examen debe ser TEORICO o PRACTICO");
    }

    const estado = normalizarTexto(data.estado || "PENDIENTE").toUpperCase();
    if (!ESTADOS_VALIDOS.includes(estado)) {
      throw new Error("El estado de la solicitud no es válido");
    }

    const fechaSolicitud = data.fechaSolicitud
      ? new Date(data.fechaSolicitud)
      : new Date();
    if (Number.isNaN(fechaSolicitud.getTime())) {
      throw new Error("La fecha de solicitud no es válida");
    }

    const fechaProgramada = data.fechaProgramada
      ? new Date(data.fechaProgramada)
      : null;
    if (data.fechaProgramada && Number.isNaN(fechaProgramada.getTime())) {
      throw new Error("La fecha programada no es válida");
    }

    return {
      alumnoId,
      tipo,
      estado,
      fechaSolicitud,
      fechaProgramada,
      observaciones: normalizarTexto(data.observaciones) || null,
    };
  }

  async create(data) {
    return this.repository.create(this.validarPayload(data));
  }

  async getAll() {
    return this.repository.findAll();
  }

  async getById(id) {
    const solicitud = await this.repository.findById(id);

    if (!solicitud) {
      throw new Error("Solicitud no encontrada");
    }

    return solicitud;
  }

  async update(id, data) {
    return this.repository.update(id, this.validarPayload(data));
  }

  async delete(id) {
    return this.repository.delete(id);
  }
}
