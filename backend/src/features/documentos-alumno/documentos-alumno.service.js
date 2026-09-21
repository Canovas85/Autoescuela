const TIPOS_PERMITIDOS = new Set([
  "DNI",
  "CERTIFICADO_PSICOTECNICO",
  "FOTOGRAFIA",
  "PERMISO_RESIDENCIA",
  "JUSTIFICANTE",
  "OTRO",
]);

const ESTADOS_PERMITIDOS = new Set([
  "PENDIENTE_VALIDACION",
  "VALIDADO",
  "RECHAZADO",
]);

const normalizarString = (valor) =>
  typeof valor === "string" ? valor.trim() : "";

export class DocumentosAlumnoService {
  constructor(repository, notificacionesRepository = null) {
    this.repository = repository;
    this.notificacionesRepository = notificacionesRepository;
  }

  validarTipo(tipo) {
    const valor = normalizarString(tipo).toUpperCase();

    if (!TIPOS_PERMITIDOS.has(valor)) {
      throw new Error(
        "El tipo de documento no es válido. Usa DNI, CERTIFICADO_PSICOTECNICO, FOTOGRAFIA, PERMISO_RESIDENCIA, JUSTIFICANTE u OTRO.",
      );
    }

    return valor;
  }

  validarEstado(estado) {
    const valor = normalizarString(estado).toUpperCase();

    if (!ESTADOS_PERMITIDOS.has(valor)) {
      throw new Error("El estado indicado para la validación no es válido");
    }

    return valor;
  }

  normalizarArchivos(files = []) {
    return (files || []).map((file) => ({
      originalname: file.originalname,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
    }));
  }

  async getMine(alumnoId) {
    return this.repository.findByAlumnoId(alumnoId);
  }

  async getAllAdmin(filters = {}) {
    return this.repository.findAllAdmin(filters);
  }

  async create(alumnoId, data = {}, files = []) {
    const tipo = this.validarTipo(data.tipo);
    const observaciones = normalizarString(data.observaciones) || null;

    if (!files.length) {
      throw new Error("Debes adjuntar al menos un archivo");
    }

    const archivos = this.normalizarArchivos(files);

    const documento = await this.repository.createWithFiles({
      alumnoId,
      tipo,
      observaciones,
      archivos,
    });

    if (this.notificacionesRepository) {
      await this.notificacionesRepository.createForRole("ADMIN", {
        tipo: "DOCUMENTO_PENDIENTE_VALIDACION",
        titulo: "Documento pendiente de validar",
        mensaje: `Nuevo documento ${tipo} pendiente de validar para ${documento.alumno?.usuario?.nombre || "alumno"}`,
        metadata: {
          documentoId: documento.id,
          alumnoId,
          route: "/documentos-alumno-admin",
        },
      });
    }

    return documento;
  }

  async update(id, alumnoId, data = {}, files = []) {
    const documentoActual = await this.repository.findById(id);

    if (!documentoActual) {
      throw new Error("Documento no encontrado");
    }

    if (documentoActual.alumnoId !== alumnoId) {
      throw new Error("No tienes permisos para modificar este documento");
    }

    if (documentoActual.estado !== "PENDIENTE_VALIDACION") {
      throw new Error("Solo puedes editar documentos pendientes de validación");
    }

    const tipo = data.tipo ? this.validarTipo(data.tipo) : documentoActual.tipo;
    const observaciones =
      data.observaciones !== undefined
        ? normalizarString(data.observaciones) || null
        : documentoActual.observaciones;

    const archivos = this.normalizarArchivos(files);

    return this.repository.updateWithFiles(
      id,
      { tipo, observaciones },
      archivos,
    );
  }

  async remove(id, alumnoId) {
    const documentoActual = await this.repository.findById(id);

    if (!documentoActual) {
      throw new Error("Documento no encontrado");
    }

    if (documentoActual.alumnoId !== alumnoId) {
      throw new Error("No tienes permisos para eliminar este documento");
    }

    if (documentoActual.estado !== "PENDIENTE_VALIDACION") {
      throw new Error(
        "Solo se pueden eliminar documentos pendientes de validación",
      );
    }

    return this.repository.softDelete(id);
  }

  async validate(id, estado) {
    const estadoNormalizado = this.validarEstado(estado || "VALIDADO");

    const documentoActual = await this.repository.findById(id);

    if (!documentoActual) {
      throw new Error("Documento no encontrado");
    }

    return this.repository.updateEstado(id, estadoNormalizado);
  }
}
