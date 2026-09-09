const TIPOS_VALIDOS = ["TEORICO", "PRACTICO"];
const ESTADOS_VALIDOS = [
  "PENDIENTE",
  "SOLICITADO",
  "PROGRAMADO",
  "APROBADO",
  "SUSPENDIDO",
  "APTO",
  "NO_APTO",
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

const inicioDelDia = (fecha = new Date()) => {
  const value = new Date(fecha);
  value.setHours(0, 0, 0, 0);
  return value;
};

const finDelDia = (fecha = new Date()) => {
  const value = new Date(fecha);
  value.setHours(23, 59, 59, 999);
  return value;
};

export class SolicitudesExamenService {
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
        "El alumno no tiene abonada la Tasa DGT (Tasa 2.1) para este permiso. Debes registrar el pago antes de crear la solicitud.",
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
          `Tasa DGT agotada. Debes renovar expediente y esperar ${diasEspera} días desde el agotamiento de convocatorias antes de crear la solicitud.`,
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
          `Tasa DGT agotada. Debes renovar expediente y completar ${clasesObligatorias} clases prácticas antes de crear la solicitud.`,
        );
      }
    }

    throw new Error(
      "Tasa DGT agotada tras 2 suspensos. Debes registrar una nueva Tasa DGT (Tasa 2.1) y tramitar renovación de expediente.",
    );
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

    if (data.erroresExamen !== undefined && data.erroresExamen !== null) {
      const errores = Number(data.erroresExamen);

      if (!Number.isInteger(errores) || errores < 0) {
        throw new Error("El número de errores del examen no es válido");
      }
    }

    return {
      alumnoId,
      tipo,
      estado,
      fechaSolicitud,
      fechaProgramada,
      erroresExamen:
        data.erroresExamen === undefined || data.erroresExamen === null
          ? null
          : Number(data.erroresExamen),
      observaciones: normalizarTexto(data.observaciones) || null,
    };
  }

  async getTheoreticalEligibilityForStudent(alumnoId) {
    const bloqueos = [];
    const checks = {
      matriculaPagada: false,
      psicotecnicoValidado: false,
      tasaPagada: false,
      convocatoriasDisponibles: false,
      solicitudActiva: false,
    };

    const matriculaPagada = await this.repository.findMatriculaPagada(alumnoId);

    if (!matriculaPagada) {
      bloqueos.push(
        "Debes tener la matricula en estado PAGADA antes de solicitar convocatoria de examen teórico.",
      );
    } else {
      checks.matriculaPagada = true;
    }

    const psicotecnicoValidado =
      await this.repository.hasPsicotecnicoValidado(alumnoId);

    if (!psicotecnicoValidado) {
      bloqueos.push(
        "Debes subir y validar el CERTIFICADO_PSICOTECNICO antes de solicitar convocatoria.",
      );
    } else {
      checks.psicotecnicoValidado = true;
    }

    const licenciaObjetivo = normalizarLicenciaObjetivo(
      matriculaPagada?.licencia,
    );
    const solicitudActiva =
      await this.repository.findSolicitudTeoricoActiva(alumnoId);

    if (solicitudActiva) {
      checks.solicitudActiva = true;
      bloqueos.push(
        "Ya tienes una solicitud teórica activa. Debes esperar a su resultado para pedir una nueva convocatoria.",
      );
    }

    let convocatoriasIncluidas = 0;
    let convocatoriasConsumidas = 0;
    let convocatoriasDisponibles = 0;

    if (matriculaPagada) {
      const pagoTasa = await this.repository.findUltimoPagoTasaDGT(
        alumnoId,
        licenciaObjetivo,
        this.tasaDgtConfig.conceptoPattern,
      );

      if (!pagoTasa) {
        bloqueos.push("Debes tener pagada la Tasa DGT (Tasa 2.1).");
      } else {
        checks.tasaPagada = true;

        const fechaInicioCobertura =
          pagoTasa.fechaPago ||
          pagoTasa.fechaCreacion ||
          pagoTasa.createdAt ||
          new Date();

        convocatoriasIncluidas = Number(pagoTasa.convocatoriasIncluidas || 2);
        convocatoriasConsumidas =
          await this.repository.countNoAptosTeoricoDesdeFecha(
            alumnoId,
            fechaInicioCobertura,
          );

        convocatoriasDisponibles = Math.max(
          convocatoriasIncluidas - convocatoriasConsumidas,
          0,
        );

        if (convocatoriasDisponibles <= 0) {
          bloqueos.push(
            "No tienes convocatorias disponibles. Debes pagar una nueva Tasa DGT (Tasa 2.1).",
          );
        } else {
          checks.convocatoriasDisponibles = true;
        }
      }
    }

    return {
      alumnoId,
      licenciaObjetivo,
      canRequest: bloqueos.length === 0,
      bloqueos,
      checks,
      tasa: {
        convocatoriasIncluidas,
        convocatoriasConsumidas,
        convocatoriasDisponibles,
      },
      solicitudActiva,
    };
  }

  async getTheoreticalCalendarForStudent(alumnoId) {
    const eligibility =
      await this.getTheoreticalEligibilityForStudent(alumnoId);

    if (!eligibility.canRequest) {
      return {
        eligibility,
        fechas: [],
      };
    }

    const fechas = await this.repository.findConvocatoriasTeoricoDisponibles(
      eligibility.licenciaObjetivo,
      inicioDelDia(),
    );

    return {
      eligibility,
      fechas,
    };
  }

  async createTheoreticalRequestForStudent(alumnoId, data = {}) {
    const eligibility =
      await this.getTheoreticalEligibilityForStudent(alumnoId);

    if (!eligibility.canRequest) {
      throw new Error(eligibility.bloqueos[0] || "No cumples requisitos");
    }

    const fechaProgramada = data.fechaProgramada
      ? new Date(data.fechaProgramada)
      : null;

    if (!fechaProgramada || Number.isNaN(fechaProgramada.getTime())) {
      throw new Error("Debes seleccionar una fecha válida de convocatoria.");
    }

    const convocatoria = await this.repository.findConvocatoriaTeoricoByFecha(
      eligibility.licenciaObjetivo,
      fechaProgramada,
    );

    if (!convocatoria) {
      throw new Error(
        "La fecha seleccionada no pertenece al calendario activo de convocatorias DGT.",
      );
    }

    return this.repository.create({
      alumnoId,
      tipo: "TEORICO",
      estado: "SOLICITADO",
      fechaSolicitud: new Date(),
      fechaProgramada,
      erroresExamen: null,
      observaciones: normalizarTexto(data.observaciones) || null,
    });
  }

  async getMine(alumnoId) {
    return this.repository.findMine(alumnoId);
  }

  async processScheduledTheoreticalResults({
    today = new Date(),
    randomFn = Math.random,
  } = {}) {
    const solicitudesPendientes =
      await this.repository.findSolicitudesTeoricoPendientesResultado(
        finDelDia(today),
      );

    let procesadas = 0;
    let aptos = 0;
    let noAptos = 0;

    for (const solicitud of solicitudesPendientes) {
      const erroresExamen = Math.floor(randomFn() * 11);
      const estado = erroresExamen <= 3 ? "APTO" : "NO_APTO";

      await this.repository.updateResultadoSolicitudTeorico(
        solicitud.id,
        estado,
        erroresExamen,
      );

      procesadas += 1;

      if (estado === "APTO") {
        aptos += 1;
      } else {
        noAptos += 1;

        const matriculaPagada = await this.repository.findMatriculaPagada(
          solicitud.alumnoId,
        );

        if (!matriculaPagada) {
          continue;
        }

        const licenciaObjetivo = normalizarLicenciaObjetivo(
          matriculaPagada.licencia,
        );

        const pagoTasa = await this.repository.findUltimoPagoTasaDGT(
          solicitud.alumnoId,
          licenciaObjetivo,
          this.tasaDgtConfig.conceptoPattern,
        );

        if (!pagoTasa) {
          continue;
        }

        const incluidas = Number(pagoTasa.convocatoriasIncluidas || 0);
        const consumidas = Number(pagoTasa.convocatoriasConsumidas || 0);

        if (consumidas < incluidas) {
          await this.repository.incrementarConvocatoriasConsumidas(pagoTasa.id);
        }
      }
    }

    return {
      procesadas,
      aptos,
      noAptos,
      fechaEjecucion: new Date(),
    };
  }

  async create(data) {
    const payload = this.validarPayload(data);
    const licenciaObjetivo = normalizarLicenciaObjetivo(data.licenciaObjetivo);

    await this.validarDerechoExamenPorTasaDGT(
      payload.alumnoId,
      licenciaObjetivo,
    );

    return this.repository.create(payload);
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
    const payload = this.validarPayload(data);
    const licenciaObjetivo = normalizarLicenciaObjetivo(data.licenciaObjetivo);

    await this.validarDerechoExamenPorTasaDGT(
      payload.alumnoId,
      licenciaObjetivo,
    );

    return this.repository.update(id, payload);
  }

  async delete(id) {
    return this.repository.delete(id);
  }
}
