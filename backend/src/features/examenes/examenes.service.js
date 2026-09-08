const TIPOS_VALIDOS = ["TEORICO", "PRACTICO"];
const ESTADOS_VALIDOS = [
  "PENDIENTE",
  "PROGRAMADO",
  "APROBADO",
  "SUSPENDIDO",
  "CANCELADO",
];

const DEFAULT_TASA_DGT_CONFIG = {
  conceptoPattern: "Tasa DGT (Tasa 2.1)",
  maxSuspensosIncluidos: 2,
  reglasRenovacion: {
    default: {
      diasEspera: 0,
      clasesPracticasObligatorias: 0,
    },
  },
};

const normalizarTexto = (valor) =>
  typeof valor === "string" ? valor.trim() : "";

const normalizarLicenciaObjetivo = (valor) =>
  String(valor || "")
    .trim()
    .toUpperCase() || "B";

const calcularDiasDesde = (fecha) => {
  const msPorDia = 1000 * 60 * 60 * 24;
  return Math.floor((Date.now() - new Date(fecha).getTime()) / msPorDia);
};

export class ExamenesService {
  constructor(repository, tasaDgtConfig = {}) {
    this.repository = repository;
    this.tasaDgtConfig = {
      ...DEFAULT_TASA_DGT_CONFIG,
      ...tasaDgtConfig,
      reglasRenovacion: {
        ...DEFAULT_TASA_DGT_CONFIG.reglasRenovacion,
        ...(tasaDgtConfig.reglasRenovacion || {}),
      },
    };
  }

  getReglasRenovacion(licenciaObjetivo) {
    return (
      this.tasaDgtConfig.reglasRenovacion[licenciaObjetivo] ||
      this.tasaDgtConfig.reglasRenovacion.default || {
        diasEspera: 0,
        clasesPracticasObligatorias: 0,
      }
    );
  }

  async validarDerechoExamenPorTasaDGT(alumnoId, licenciaObjetivo) {
    if (
      typeof this.repository.findUltimoPagoTasaDGT !== "function" ||
      typeof this.repository.countSuspensosDesdeFecha !== "function"
    ) {
      return;
    }

    const pagoTasa = await this.repository.findUltimoPagoTasaDGT(
      alumnoId,
      licenciaObjetivo,
      this.tasaDgtConfig.conceptoPattern,
    );

    if (!pagoTasa) {
      throw new Error(
        "El alumno no tiene abonada la Tasa DGT (Tasa 2.1) para este permiso. Debes registrar el pago antes de programar examen.",
      );
    }

    const fechaInicioCobertura =
      pagoTasa.fechaPago ||
      pagoTasa.fechaCreacion ||
      pagoTasa.createdAt ||
      new Date();

    const suspensosConsumidos = await this.repository.countSuspensosDesdeFecha(
      alumnoId,
      fechaInicioCobertura,
    );

    if (suspensosConsumidos < this.tasaDgtConfig.maxSuspensosIncluidos) {
      return;
    }

    const suspensos =
      typeof this.repository.findSuspensosDesdeFecha === "function"
        ? await this.repository.findSuspensosDesdeFecha(
            alumnoId,
            fechaInicioCobertura,
          )
        : [];

    const fechaAgotamiento =
      suspensos[this.tasaDgtConfig.maxSuspensosIncluidos - 1]?.fecha ||
      fechaInicioCobertura;

    const reglas = this.getReglasRenovacion(licenciaObjetivo);
    const diasEspera = Number(reglas.diasEspera || 0);
    const clasesObligatorias = Number(reglas.clasesPracticasObligatorias || 0);

    if (diasEspera > 0) {
      const diasTranscurridos = calcularDiasDesde(fechaAgotamiento);

      if (diasTranscurridos < diasEspera) {
        throw new Error(
          `Tasa DGT agotada. Debes renovar expediente y esperar ${diasEspera} días desde el agotamiento de convocatorias antes de volver a examen.`,
        );
      }
    }

    if (
      clasesObligatorias > 0 &&
      typeof this.repository.countClasesCompletadasDesdeFecha === "function"
    ) {
      const clasesRealizadas =
        await this.repository.countClasesCompletadasDesdeFecha(
          alumnoId,
          fechaAgotamiento,
        );

      if (clasesRealizadas < clasesObligatorias) {
        throw new Error(
          `Tasa DGT agotada. Debes renovar expediente y completar ${clasesObligatorias} clases prácticas antes de volver a examen.`,
        );
      }
    }

    throw new Error(
      "Tasa DGT agotada tras 2 suspensos. Debes registrar una nueva Tasa DGT (Tasa 2.1) y tramitar renovación de expediente.",
    );
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

    const licenciaObjetivo = normalizarLicenciaObjetivo(data.licenciaObjetivo);
    await this.validarDerechoExamenPorTasaDGT(
      payload.alumnoId,
      licenciaObjetivo,
    );

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
    const payload = this.validarPayload(data);

    if (payload.estado === "PROGRAMADO" && payload.alumnoId) {
      const licenciaObjetivo = normalizarLicenciaObjetivo(
        data.licenciaObjetivo,
      );
      await this.validarDerechoExamenPorTasaDGT(
        payload.alumnoId,
        licenciaObjetivo,
      );
    }

    return this.repository.update(id, payload);
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
