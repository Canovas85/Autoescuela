const TIPOS_VALIDOS = ["TEORICO", "PRACTICO"];
const ESTADOS_VALIDOS = [
  "PENDIENTE",
  "SOLICITADO",
  "PROGRAMADO",
  "APROBADO",
  "SUSPENDIDO",
  "APTO",
  "NO_APTO",
  "NO_PRESENTADO",
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

const TIPOS_EVALUACION_VALIDOS = ["TEORICO", "PRACTICO"];
const ESTADOS_FINALES_EVALUACION = ["APROBADO", "SUSPENSO"];
const TOTAL_PREGUNTAS_EXAMEN_TEORICO = 30;
const MAX_HORAS_CANCELACION = 24;
const HOJAS_RUTA_REQUERIDAS_PRACTICO = 5;
const ESTADOS_CONSUMEN_CONVOCATORIA = [
  "NO_APTO",
  "SUSPENDIDO",
  "NO_PRESENTADO",
];

const CLASES_POST_NO_APTO_PRACTICO = {
  A: 3,
  A1: 3,
  A2: 3,
  A3: 3,
  B: 5,
  C: 2,
  D: 2,
};

const FALTAS_CATALOGO_PRACTICO = {
  leves: [
    "Uso tardío del intermitente",
    "Posicionamiento mejorable en carril",
    "Distancia de seguridad ajustada",
    "Reducción de velocidad mejorable",
    "Observación lateral incompleta",
    "Anticipación mejorable en cruce",
    "Control de embrague mejorable",
    "Corrección leve de trayectoria",
    "Señalización tardía en maniobra",
    "Entrada amplia en giro",
    "Alineación mejorable al estacionar",
    "Control de velocidad irregular",
  ],
  deficientes: [
    "Incorporación con observación insuficiente",
    "Prioridad no respetada sin riesgo extremo",
    "Velocidad inadecuada en tramo crítico",
    "Maniobra con control insuficiente",
    "Distancia de seguridad claramente insuficiente",
    "Frenada tardía ante señalización",
  ],
  eliminatorias: [
    "No respetar semáforo en rojo",
    "No ceder el paso con riesgo",
    "Invadir carril contrario con peligro",
    "No detenerse en stop obligatorio",
    "Intervención del examinador por seguridad",
  ],
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

const toNumberOrNull = (value) => {
  if (value === null || value === undefined) {
    return null;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const normalizarConvocatorias = ({ incluidas, consumidas }) => {
  const convocatoriasIncluidas = Number(incluidas || 2);
  const convocatoriasConsumidasRaw = Number(consumidas || 0);
  const convocatoriasConsumidas = Math.min(
    Math.max(convocatoriasConsumidasRaw, 0),
    convocatoriasIncluidas,
  );

  return {
    convocatoriasIncluidas,
    convocatoriasConsumidas,
    convocatoriasDisponibles: Math.max(
      convocatoriasIncluidas - convocatoriasConsumidas,
      0,
    ),
  };
};

const normalizarEstadoEvaluacion = (estado) => {
  const value = String(estado || "")
    .trim()
    .toUpperCase();

  if (["APROBADO", "APTO"].includes(value)) {
    return "APROBADO";
  }

  if (["SUSPENSO", "SUSPENDIDO", "NO_APTO", "NO_PRESENTADO"].includes(value)) {
    return "SUSPENSO";
  }

  return "PROGRAMADO";
};

const calcularAciertosTeorico = (erroresExamen) => {
  const errores = toNumberOrNull(erroresExamen);

  if (errores === null) {
    return null;
  }

  return Math.max(TOTAL_PREGUNTAS_EXAMEN_TEORICO - errores, 0);
};

const horasHasta = (fecha) => {
  if (!fecha) {
    return 0;
  }

  const diffMs = new Date(fecha).getTime() - Date.now();
  return diffMs / (1000 * 60 * 60);
};

const getClasesPostNoAptoRequeridas = (licencia) =>
  CLASES_POST_NO_APTO_PRACTICO[normalizarLicenciaObjetivo(licencia)] ||
  CLASES_POST_NO_APTO_PRACTICO.B;

const shouldBeNoAptoPractico = ({
  faltasLeves,
  faltasDeficientes,
  faltasEliminatorias,
}) =>
  faltasEliminatorias >= 1 ||
  faltasDeficientes >= 2 ||
  (faltasDeficientes === 1 && faltasLeves >= 5) ||
  faltasLeves >= 10;

const getMotivoNoAptoPractico = ({
  faltasLeves,
  faltasDeficientes,
  faltasEliminatorias,
}) => {
  if (faltasEliminatorias >= 1) {
    return "ELIMINATORIA";
  }

  if (faltasDeficientes >= 2) {
    return "DOBLE_DEFICIENTE";
  }

  if (faltasDeficientes === 1 && faltasLeves >= 5) {
    return "DEFICIENTE_MAS_LEVES";
  }

  if (faltasLeves >= 10) {
    return "LEVES";
  }

  return null;
};

const randomIntBetween = (randomFn, min, max) =>
  Math.floor(randomFn() * (max - min + 1)) + min;

const getDateKey = (value) => {
  const date = new Date(value || Date.now());
  return date.toISOString().slice(0, 10);
};

const pickFaultDetails = (randomFn, catalog, count, prefix) => {
  if (!Number.isInteger(count) || count <= 0) {
    return [];
  }

  const pool = [...catalog];
  const picked = [];

  for (let index = 0; index < count; index += 1) {
    if (pool.length > 0) {
      const pickIndex = randomIntBetween(randomFn, 0, pool.length - 1);
      picked.push(pool.splice(pickIndex, 1)[0]);
    } else {
      picked.push(`${prefix} ${index + 1}`);
    }
  }

  return picked;
};

const enrichFaltasWithDetail = (randomFn, faltas) => ({
  ...faltas,
  faltasLevesDetalle: pickFaultDetails(
    randomFn,
    FALTAS_CATALOGO_PRACTICO.leves,
    faltas.faltasLeves,
    "Falta leve",
  ),
  faltasDeficientesDetalle: pickFaultDetails(
    randomFn,
    FALTAS_CATALOGO_PRACTICO.deficientes,
    faltas.faltasDeficientes,
    "Falta deficiente",
  ),
  faltasEliminatoriasDetalle: pickFaultDetails(
    randomFn,
    FALTAS_CATALOGO_PRACTICO.eliminatorias,
    faltas.faltasEliminatorias,
    "Falta eliminatoria",
  ),
});

const generarFaltasApto = (randomFn) => {
  const templates = [
    {
      faltasLeves: randomIntBetween(randomFn, 0, 4),
      faltasDeficientes: 0,
      faltasEliminatorias: 0,
    },
    {
      faltasLeves: randomIntBetween(randomFn, 0, 3),
      faltasDeficientes: 1,
      faltasEliminatorias: 0,
    },
    {
      faltasLeves: randomIntBetween(randomFn, 0, 8),
      faltasDeficientes: 0,
      faltasEliminatorias: 0,
    },
  ];

  return templates[randomIntBetween(randomFn, 0, templates.length - 1)];
};

const generarFaltasNoApto = (randomFn) => {
  const scenario = randomIntBetween(randomFn, 1, 4);

  if (scenario === 1) {
    return {
      faltasLeves: randomIntBetween(randomFn, 0, 4),
      faltasDeficientes: 0,
      faltasEliminatorias: 1,
    };
  }

  if (scenario === 2) {
    return {
      faltasLeves: randomIntBetween(randomFn, 0, 3),
      faltasDeficientes: 2,
      faltasEliminatorias: 0,
    };
  }

  if (scenario === 3) {
    return {
      faltasLeves: randomIntBetween(randomFn, 5, 8),
      faltasDeficientes: 1,
      faltasEliminatorias: 0,
    };
  }

  return {
    faltasLeves: randomIntBetween(randomFn, 10, 12),
    faltasDeficientes: 0,
    faltasEliminatorias: 0,
  };
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

  isEstadoConsumoConvocatoria(estado) {
    return ESTADOS_CONSUMEN_CONVOCATORIA.includes(
      String(estado || "")
        .trim()
        .toUpperCase(),
    );
  }

  async consumeConvocatoriaPorResultado(alumnoId, licenciaObjetivo) {
    const pagoTasa = await this.repository.findUltimoPagoTasaDGT(
      alumnoId,
      licenciaObjetivo,
      this.tasaDgtConfig.conceptoPattern,
    );

    if (!pagoTasa) {
      return;
    }

    const incluidas = Number(pagoTasa.convocatoriasIncluidas || 0);
    const consumidas = Number(pagoTasa.convocatoriasConsumidas || 0);

    if (consumidas < incluidas) {
      await this.repository.incrementarConvocatoriasConsumidas(pagoTasa.id);
    }
  }

  async markLicenseObtainedIfPracticalApto({ alumnoId, tipo, estado }) {
    const isPracticalApto =
      String(tipo || "").toUpperCase() === "PRACTICO" &&
      String(estado || "").toUpperCase() === "APTO" &&
      Boolean(alumnoId);

    if (!isPracticalApto) {
      return false;
    }

    if (typeof this.repository.updateAlumnoEstadoExpediente === "function") {
      await this.repository.updateAlumnoEstadoExpediente(alumnoId, {
        estadoExpediente: "LICENCIA_OBTENIDA",
        licenciaObtenidaAt: new Date(),
      });
    }

    return true;
  }

  async resolveConvocatoriasFromPago({ alumnoId, pagoTasa, fechaInicio }) {
    const incluidas = Number(pagoTasa?.convocatoriasIncluidas || 2);
    const consumidasPago = toNumberOrNull(pagoTasa?.convocatoriasConsumidas);

    if (consumidasPago !== null) {
      return normalizarConvocatorias({
        incluidas,
        consumidas: consumidasPago,
      });
    }

    if (typeof this.repository.countSuspensosDesdeFecha !== "function") {
      return normalizarConvocatorias({
        incluidas,
        consumidas: 0,
      });
    }

    const consumidas = await this.repository.countSuspensosDesdeFecha(
      alumnoId,
      fechaInicio,
    );

    return normalizarConvocatorias({
      incluidas,
      consumidas,
    });
  }

  async ensurePendingTasaDgtRenewalPayment({
    alumnoId,
    matriculaPagada,
    licenciaObjetivo,
    convocatoriasDisponibles,
  }) {
    if (!matriculaPagada || convocatoriasDisponibles > 0) {
      return null;
    }

    if (
      typeof this.repository.findPagoTasaDGTPendiente !== "function" ||
      typeof this.repository.createPagoTasaDgtPendiente !== "function"
    ) {
      return null;
    }

    const pagoPendienteExistente =
      await this.repository.findPagoTasaDGTPendiente(
        alumnoId,
        licenciaObjetivo,
        this.tasaDgtConfig.conceptoPattern,
      );

    if (pagoPendienteExistente) {
      return pagoPendienteExistente;
    }

    const tarifa =
      typeof this.repository.findTarifaTasaDgtByPermiso === "function"
        ? await this.repository.findTarifaTasaDgtByPermiso(
            licenciaObjetivo,
            this.tasaDgtConfig.conceptoPattern,
          )
        : null;

    const importe = Number(
      tarifa?.precio ?? this.tasaDgtConfig.importeDefault ?? 0,
    );

    return this.repository.createPagoTasaDgtPendiente({
      alumnoId,
      matriculaId: matriculaPagada.id,
      permiso: licenciaObjetivo,
      importe,
      concepto: tarifa?.concepto || this.tasaDgtConfig.conceptoPattern,
      convocatoriasIncluidas: this.tasaDgtConfig.maxSuspensosIncluidos,
      observaciones:
        "Renovación automática por agotamiento de convocatorias de Tasa DGT",
    });
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

    if (data.aciertosExamen !== undefined && data.aciertosExamen !== null) {
      const aciertos = Number(data.aciertosExamen);

      if (!Number.isInteger(aciertos) || aciertos < 0) {
        throw new Error("El número de aciertos del examen no es válido");
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
      aciertosExamen:
        data.aciertosExamen === undefined || data.aciertosExamen === null
          ? null
          : Number(data.aciertosExamen),
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
    let pagoTasaPendiente = null;

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

        const convocatorias = await this.resolveConvocatoriasFromPago({
          alumnoId,
          pagoTasa,
          fechaInicio: fechaInicioCobertura,
        });

        convocatoriasIncluidas = convocatorias.convocatoriasIncluidas;
        convocatoriasConsumidas = convocatorias.convocatoriasConsumidas;
        convocatoriasDisponibles = convocatorias.convocatoriasDisponibles;

        pagoTasaPendiente = await this.ensurePendingTasaDgtRenewalPayment({
          alumnoId,
          matriculaPagada,
          licenciaObjetivo,
          convocatoriasDisponibles,
        });

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
      pagoTasaPendiente,
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

  async ensurePracticalExamExpensePayment(matriculaPagada) {
    if (!matriculaPagada) {
      return null;
    }

    const alumnoId = matriculaPagada.alumnoId;
    const licenciaObjetivo = normalizarLicenciaObjetivo(
      matriculaPagada.licencia,
    );

    await this.cleanupDuplicatePendingPracticalExpensePayments(
      alumnoId,
      licenciaObjetivo,
    );

    const existingPending =
      await this.repository.findPagoGastoPracticoPendiente(
        alumnoId,
        licenciaObjetivo,
      );

    if (existingPending) {
      return existingPending;
    }

    const reusablePaid =
      await this.repository.findPagoGastoPracticoPagadoReutilizable(
        alumnoId,
        licenciaObjetivo,
      );

    if (reusablePaid) {
      return reusablePaid;
    }

    const tarifa =
      await this.repository.findTarifaGastoExamenPracticoByPermiso(
        licenciaObjetivo,
      );

    if (!tarifa) {
      throw new Error(
        "No existe tarifa activa de gasto de examen práctico para tu licencia.",
      );
    }

    return this.repository.createPagoGastoPracticoPendiente({
      alumnoId,
      matriculaId: matriculaPagada.id,
      permiso: licenciaObjetivo,
      importe: tarifa.precio,
      concepto: tarifa.concepto,
    });
  }

  async cleanupDuplicatePendingPracticalExpensePayments(alumnoId, permiso) {
    if (typeof this.repository.findPagosGastoPracticoActivos !== "function") {
      return;
    }

    const pagosActivos = await this.repository.findPagosGastoPracticoActivos(
      alumnoId,
      permiso,
    );

    const pendientes = (pagosActivos || []).filter(
      (item) => String(item?.estado || "").toUpperCase() === "PENDIENTE",
    );

    if (pendientes.length <= 1) {
      return;
    }

    const keep = pendientes[0];

    for (const pago of pendientes.slice(1)) {
      const vinculado = Array.isArray(pago?.solicitudesExamenPractico)
        ? pago.solicitudesExamenPractico.length > 0
        : false;

      if (vinculado) {
        continue;
      }

      await this.repository.cancelPagoAndFacturaIfPending?.(
        pago.id,
        "Pago duplicado limpiado automáticamente",
      );
    }

    if (!keep) {
      return;
    }
  }

  async cleanupPracticalExpensePaymentDuplicatesForStudent(alumnoId) {
    const matriculaPagada = await this.repository.findMatriculaPagada(alumnoId);

    if (!matriculaPagada) {
      return;
    }

    const permiso = normalizarLicenciaObjetivo(matriculaPagada.licencia);
    await this.cleanupDuplicatePendingPracticalExpensePayments(
      alumnoId,
      permiso,
    );
  }

  async getPracticalEligibilityForStudent(alumnoId) {
    const bloqueos = [];
    const checks = {
      matriculaPagada: false,
      teoricoAprobado: false,
      psicotecnicoValidado: false,
      tasaPagada: false,
      convocatoriasDisponibles: false,
      hojasRutaMinimas: false,
      hojasRutaPostNoAptoMinimas: true,
      hojasRutaConsistentes: false,
      pagoGastoPracticoGenerado: false,
      pagoGastoPracticoPagado: false,
      clasesPostNoAptoCompletadas: true,
      solicitudActiva: false,
      cancelacion24hValida: true,
    };

    const matriculaPagada = await this.repository.findMatriculaPagada(alumnoId);

    if (!matriculaPagada) {
      bloqueos.push(
        "Debes tener la matricula en estado PAGADA antes de solicitar convocatoria de examen práctico.",
      );
    } else {
      checks.matriculaPagada = true;
    }

    const teoricoAprobado =
      typeof this.repository.hasTheoreticalApto === "function"
        ? await this.repository.hasTheoreticalApto(alumnoId)
        : true;

    if (!teoricoAprobado) {
      bloqueos.push(
        "Debes tener el examen teórico en estado APTO antes de solicitar convocatoria práctica.",
      );
    } else {
      checks.teoricoAprobado = true;
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

    const [hojasRegistradas, hojasConClase] = await Promise.all([
      this.repository.countHojasRutaRegistradas(alumnoId),
      this.repository.countHojasRutaRegistradasConClase(alumnoId),
    ]);

    if (hojasRegistradas >= HOJAS_RUTA_REQUERIDAS_PRACTICO) {
      checks.hojasRutaMinimas = true;
    } else {
      bloqueos.push(
        `Debes tener al menos ${HOJAS_RUTA_REQUERIDAS_PRACTICO} hojas de ruta en estado REGISTRADA para solicitar examen práctico.`,
      );
    }

    if (hojasConClase === hojasRegistradas) {
      checks.hojasRutaConsistentes = true;
    } else {
      bloqueos.push(
        "Se detectó una incidencia entre hojas de ruta y clases prácticas. Contacta con administración.",
      );
    }

    const solicitudActiva =
      await this.repository.findSolicitudPracticoActiva(alumnoId);
    const horasRestantesSolicitudActiva = solicitudActiva?.fechaProgramada
      ? horasHasta(solicitudActiva.fechaProgramada)
      : null;

    if (solicitudActiva) {
      checks.solicitudActiva = true;
    }

    let convocatoriasIncluidas = 0;
    let convocatoriasConsumidas = 0;
    let convocatoriasDisponibles = 0;
    let pagoTasaPendiente = null;

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

        const convocatorias = await this.resolveConvocatoriasFromPago({
          alumnoId,
          pagoTasa,
          fechaInicio: fechaInicioCobertura,
        });

        convocatoriasIncluidas = convocatorias.convocatoriasIncluidas;
        convocatoriasConsumidas = convocatorias.convocatoriasConsumidas;
        convocatoriasDisponibles = convocatorias.convocatoriasDisponibles;

        pagoTasaPendiente = await this.ensurePendingTasaDgtRenewalPayment({
          alumnoId,
          matriculaPagada,
          licenciaObjetivo,
          convocatoriasDisponibles,
        });

        if (convocatoriasDisponibles <= 0) {
          bloqueos.push(
            "No tienes convocatorias disponibles. Debes pagar una nueva Tasa DGT (Tasa 2.1).",
          );
        } else {
          checks.convocatoriasDisponibles = true;
        }
      }
    }

    const ultimoNoApto =
      await this.repository.findUltimoNoAptoPractico(alumnoId);
    let clasesPostNoAptoRequeridas = 0;
    let clasesPostNoAptoCompletadas = 0;
    let hojasPostNoAptoRequeridas = 0;
    let hojasPostNoAptoRegistradas = 0;

    if (ultimoNoApto?.fechaProgramada) {
      clasesPostNoAptoRequeridas =
        getClasesPostNoAptoRequeridas(licenciaObjetivo);
      clasesPostNoAptoCompletadas =
        await this.repository.countClasesCompletadasDesdeFecha(
          alumnoId,
          ultimoNoApto.fechaProgramada,
        );

      if (clasesPostNoAptoCompletadas < clasesPostNoAptoRequeridas) {
        checks.clasesPostNoAptoCompletadas = false;
        bloqueos.push(
          `Tras un NO_APTO práctico debes completar ${clasesPostNoAptoRequeridas} clases prácticas antes de pedir nueva fecha.`,
        );
      }

      hojasPostNoAptoRequeridas = HOJAS_RUTA_REQUERIDAS_PRACTICO;

      if (
        typeof this.repository.countHojasRutaRegistradasConClaseDesdeFecha ===
        "function"
      ) {
        hojasPostNoAptoRegistradas =
          await this.repository.countHojasRutaRegistradasConClaseDesdeFecha(
            alumnoId,
            ultimoNoApto.fechaProgramada,
          );
      } else {
        hojasPostNoAptoRegistradas = hojasPostNoAptoRequeridas;
      }

      if (hojasPostNoAptoRegistradas < hojasPostNoAptoRequeridas) {
        checks.hojasRutaPostNoAptoMinimas = false;
        bloqueos.push(
          `Tras un NO_APTO práctico debes registrar al menos ${hojasPostNoAptoRequeridas} hojas de ruta antes de solicitar nueva convocatoria.`,
        );
      }
    }

    let pagoGastoPractico = null;
    let canPickDate = false;

    if (
      checks.matriculaPagada &&
      checks.teoricoAprobado &&
      checks.psicotecnicoValidado &&
      checks.hojasRutaMinimas &&
      checks.hojasRutaConsistentes
    ) {
      pagoGastoPractico =
        await this.ensurePracticalExamExpensePayment(matriculaPagada);

      if (pagoGastoPractico) {
        checks.pagoGastoPracticoGenerado = true;
      }

      if (pagoGastoPractico?.estado === "PAGADO") {
        checks.pagoGastoPracticoPagado = true;
      }
    }

    const puedeMoverFechaSinCancelar =
      solicitudActiva &&
      (pagoGastoPractico?.estado !== "PAGADO" ||
        Number(horasRestantesSolicitudActiva || 0) > MAX_HORAS_CANCELACION);

    if (
      solicitudActiva &&
      !puedeMoverFechaSinCancelar &&
      pagoGastoPractico?.estado === "PAGADO"
    ) {
      checks.cancelacion24hValida = false;
      bloqueos.push(
        "Ya tienes una solicitud práctica activa y estás dentro de las 24 horas previas. No puedes cambiar la fecha.",
      );
    }

    if (!checks.pagoGastoPracticoPagado) {
      bloqueos.push(
        "Debes abonar el pago de gastos de examen práctico para poder confirmar la fecha.",
      );
    }

    canPickDate =
      checks.matriculaPagada &&
      checks.teoricoAprobado &&
      checks.psicotecnicoValidado &&
      checks.hojasRutaMinimas &&
      checks.hojasRutaPostNoAptoMinimas &&
      checks.hojasRutaConsistentes &&
      checks.tasaPagada &&
      checks.convocatoriasDisponibles &&
      checks.clasesPostNoAptoCompletadas &&
      (!solicitudActiva || puedeMoverFechaSinCancelar);

    const canRequest = canPickDate && checks.pagoGastoPracticoPagado;

    return {
      alumnoId,
      licenciaObjetivo,
      canPickDate,
      canRequest,
      bloqueos,
      checks,
      solicitudActiva,
      horasRestantesSolicitudActiva,
      puedeMoverFechaSinCancelar,
      pagoGastoPractico,
      hojasRuta: {
        requeridas: HOJAS_RUTA_REQUERIDAS_PRACTICO,
        registradas: hojasRegistradas,
        registradasConClase: hojasConClase,
      },
      postNoApto: {
        clasesRequeridas: clasesPostNoAptoRequeridas,
        clasesCompletadas: clasesPostNoAptoCompletadas,
        hojasRequeridas: hojasPostNoAptoRequeridas,
        hojasRegistradas: hojasPostNoAptoRegistradas,
      },
      tasa: {
        convocatoriasIncluidas,
        convocatoriasConsumidas,
        convocatoriasDisponibles,
      },
      pagoTasaPendiente,
    };
  }

  async getPracticalCalendarForStudent(alumnoId) {
    const eligibility = await this.getPracticalEligibilityForStudent(alumnoId);

    if (!eligibility.canPickDate) {
      return {
        eligibility,
        fechas: [],
      };
    }

    const fechas = await this.repository.findConvocatoriasPracticoDisponibles(
      eligibility.licenciaObjetivo,
      inicioDelDia(),
    );

    return {
      eligibility,
      fechas,
    };
  }

  async createPracticalRequestForStudent(alumnoId, data = {}) {
    const eligibility = await this.getPracticalEligibilityForStudent(alumnoId);

    if (!eligibility.canPickDate) {
      throw new Error(eligibility.bloqueos[0] || "No cumples requisitos");
    }

    if (!eligibility.checks.pagoGastoPracticoPagado) {
      throw new Error(
        "Debes pagar los gastos de examen práctico antes de confirmar la solicitud.",
      );
    }

    const fechaProgramada = data.fechaProgramada
      ? new Date(data.fechaProgramada)
      : null;

    if (!fechaProgramada || Number.isNaN(fechaProgramada.getTime())) {
      throw new Error("Debes seleccionar una fecha válida de convocatoria.");
    }

    const convocatoria = await this.repository.findConvocatoriaPracticoByFecha(
      eligibility.licenciaObjetivo,
      fechaProgramada,
    );

    if (!convocatoria) {
      throw new Error(
        "La fecha seleccionada no pertenece al calendario activo de convocatorias DGT.",
      );
    }

    if (eligibility.solicitudActiva) {
      if (!eligibility.puedeMoverFechaSinCancelar) {
        throw new Error(
          "Debes cancelar la solicitud actual con más de 24h de antelación para cambiar de fecha.",
        );
      }

      return this.repository.update(eligibility.solicitudActiva.id, {
        fechaProgramada,
        estado: "SOLICITADO",
        observaciones: normalizarTexto(data.observaciones) || null,
      });
    }

    return this.repository.create({
      alumnoId,
      tipo: "PRACTICO",
      estado: "SOLICITADO",
      fechaSolicitud: new Date(),
      fechaProgramada,
      erroresExamen: null,
      aciertosExamen: null,
      faltasLeves: null,
      faltasDeficientes: null,
      faltasEliminatorias: null,
      motivoNoApto: null,
      pagoGastoPracticoId: eligibility.pagoGastoPractico?.id || null,
      observaciones: normalizarTexto(data.observaciones) || null,
    });
  }

  async cancelPracticalRequestForStudent(alumnoId, solicitudId) {
    const solicitud = await this.repository.findSolicitudByIdForStudent(
      solicitudId,
      alumnoId,
    );

    if (!solicitud || solicitud.tipo !== "PRACTICO") {
      throw new Error("Solicitud práctica no encontrada");
    }

    if (!["SOLICITADO", "PROGRAMADO", "PENDIENTE"].includes(solicitud.estado)) {
      throw new Error("Solo puedes cancelar solicitudes prácticas activas.");
    }

    const horasRestantes = horasHasta(solicitud.fechaProgramada);

    if (horasRestantes <= MAX_HORAS_CANCELACION) {
      throw new Error(
        "No puedes cancelar la convocatoria práctica dentro de las 24 horas previas.",
      );
    }

    return this.repository.update(solicitud.id, {
      estado: "CANCELADO",
      observaciones: "Cancelado por alumno con más de 24h de antelación",
    });
  }

  async cancelTheoreticalRequestForStudent(alumnoId, solicitudId) {
    const solicitud = await this.repository.findSolicitudByIdForStudent(
      solicitudId,
      alumnoId,
    );

    if (!solicitud || solicitud.tipo !== "TEORICO") {
      throw new Error("Solicitud teórica no encontrada");
    }

    if (!["SOLICITADO", "PROGRAMADO", "PENDIENTE"].includes(solicitud.estado)) {
      throw new Error("Solo puedes cancelar solicitudes teóricas activas.");
    }

    const horasRestantes = horasHasta(solicitud.fechaProgramada);

    if (horasRestantes <= MAX_HORAS_CANCELACION) {
      throw new Error(
        "No puedes cancelar la convocatoria teórica dentro de las 24 horas previas.",
      );
    }

    return this.repository.update(solicitud.id, {
      estado: "CANCELADO",
      observaciones: "Cancelado por alumno con más de 24h de antelación",
    });
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
      aciertosExamen: null,
      observaciones: normalizarTexto(data.observaciones) || null,
    });
  }

  async getAdminEvaluationByTipo(tipo) {
    const tipoNormalizado = normalizarTexto(tipo).toUpperCase();

    if (!TIPOS_EVALUACION_VALIDOS.includes(tipoNormalizado)) {
      throw new Error("El tipo debe ser TEORICO o PRACTICO");
    }

    const [solicitudes, examenes] = await Promise.all([
      this.repository.findEvaluacionSolicitudesByTipo(tipoNormalizado),
      this.repository.findEvaluacionExamenesByTipo(tipoNormalizado),
    ]);

    const mergedAll = [
      ...solicitudes.map((solicitud) => {
        const estadoEvaluacion = normalizarEstadoEvaluacion(solicitud.estado);
        const licencia = solicitud.alumno?.tipoLicenciaObjetivo || "-";

        return {
          id: `SOL-${solicitud.id}`,
          source: "SOLICITUD",
          sourceId: solicitud.id,
          tipo: tipoNormalizado,
          fechaSolicitud: solicitud.fechaSolicitud || null,
          fechaConvocatoria: solicitud.fechaProgramada || null,
          alumnoId: solicitud.alumnoId,
          alumnoNombre: solicitud.alumno?.usuario?.nombre || "Sin alumno",
          permisoLicencia: licencia,
          estado: estadoEvaluacion,
          resultado: estadoEvaluacion,
          erroresExamen: toNumberOrNull(solicitud.erroresExamen),
          aciertosExamen:
            tipoNormalizado === "TEORICO"
              ? (toNumberOrNull(solicitud.aciertosExamen) ??
                calcularAciertosTeorico(solicitud.erroresExamen))
              : null,
          faltasLeves:
            tipoNormalizado === "PRACTICO"
              ? toNumberOrNull(solicitud.faltasLeves)
              : null,
          faltasDeficientes:
            tipoNormalizado === "PRACTICO"
              ? toNumberOrNull(solicitud.faltasDeficientes)
              : null,
          faltasEliminatorias:
            tipoNormalizado === "PRACTICO"
              ? toNumberOrNull(solicitud.faltasEliminatorias)
              : null,
          faltasLevesDetalle:
            tipoNormalizado === "PRACTICO"
              ? solicitud.faltasLevesDetalle || []
              : [],
          faltasDeficientesDetalle:
            tipoNormalizado === "PRACTICO"
              ? solicitud.faltasDeficientesDetalle || []
              : [],
          faltasEliminatoriasDetalle:
            tipoNormalizado === "PRACTICO"
              ? solicitud.faltasEliminatoriasDetalle || []
              : [],
          motivoNoApto:
            tipoNormalizado === "PRACTICO"
              ? solicitud.motivoNoApto || null
              : null,
          observaciones: solicitud.observaciones || null,
          profesorAsignado:
            solicitud.alumno?.profesorAsignado?.usuario?.nombre ||
            "Sin asignar",
        };
      }),
      ...examenes.map((examen) => {
        const estadoEvaluacion = normalizarEstadoEvaluacion(examen.estado);
        const licencia = examen.alumno?.tipoLicenciaObjetivo || "-";

        return {
          id: `EX-${examen.id}`,
          source: "EXAMEN",
          sourceId: examen.id,
          tipo: tipoNormalizado,
          fechaSolicitud: null,
          fechaConvocatoria: examen.fecha || null,
          alumnoId: examen.alumnoId,
          alumnoNombre: examen.alumno?.usuario?.nombre || "Sin alumno",
          permisoLicencia: licencia,
          estado: estadoEvaluacion,
          resultado: estadoEvaluacion,
          erroresExamen: null,
          aciertosExamen: null,
          faltasLeves: null,
          faltasDeficientes: null,
          faltasEliminatorias: null,
          faltasLevesDetalle: [],
          faltasDeficientesDetalle: [],
          faltasEliminatoriasDetalle: [],
          motivoNoApto: null,
          observaciones: null,
          profesorAsignado:
            examen.alumno?.profesorAsignado?.usuario?.nombre || "Sin asignar",
        };
      }),
    ];

    const merged =
      tipoNormalizado === "PRACTICO"
        ? mergedAll.filter((item) => item.source === "SOLICITUD")
        : mergedAll;

    merged.sort((a, b) => {
      const dateA =
        new Date(a.fechaConvocatoria || a.fechaSolicitud || 0).getTime() || 0;
      const dateB =
        new Date(b.fechaConvocatoria || b.fechaSolicitud || 0).getTime() || 0;

      return dateB - dateA;
    });

    const convocatoriaCache = new Map();

    const getConvocatoriasRestantes = async (item) => {
      const cacheKey = `${item.alumnoId}|${item.permisoLicencia}`;

      if (convocatoriaCache.has(cacheKey)) {
        return convocatoriaCache.get(cacheKey);
      }

      const pagoTasa = await this.repository.findUltimoPagoTasaDGT(
        item.alumnoId,
        item.permisoLicencia,
        this.tasaDgtConfig.conceptoPattern,
      );

      if (!pagoTasa) {
        convocatoriaCache.set(cacheKey, 0);
        return 0;
      }

      const incluidas = Number(pagoTasa.convocatoriasIncluidas || 0);
      const consumidas = Number(pagoTasa.convocatoriasConsumidas || 0);
      const restantes = Math.max(incluidas - consumidas, 0);

      convocatoriaCache.set(cacheKey, restantes);
      return restantes;
    };

    const intentosPorAlumno = new Map();
    const numeroIntentoById = new Map();

    const mergedChronological = [...merged].sort((a, b) => {
      const dateA =
        new Date(a.fechaConvocatoria || a.fechaSolicitud || 0).getTime() || 0;
      const dateB =
        new Date(b.fechaConvocatoria || b.fechaSolicitud || 0).getTime() || 0;

      return dateA - dateB;
    });

    for (const item of mergedChronological) {
      const estadoFinal = ESTADOS_FINALES_EVALUACION.includes(item.estado);
      const key = `${item.alumnoId}|${item.tipo}`;
      const finalizadosPrevios = intentosPorAlumno.get(key) || 0;
      const numeroIntento = estadoFinal
        ? finalizadosPrevios + 1
        : finalizadosPrevios + 1;

      numeroIntentoById.set(item.id, numeroIntento);

      if (estadoFinal) {
        intentosPorAlumno.set(key, finalizadosPrevios + 1);
      }
    }

    const rows = [];
    for (const item of merged) {
      const convocatoriasRestantes = await getConvocatoriasRestantes(item);

      rows.push({
        ...item,
        numeroIntento: numeroIntentoById.get(item.id) || 1,
        convocatoriasRestantes,
      });
    }

    return rows;
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
    let aciertosTotales = 0;
    let erroresTotales = 0;

    for (const solicitud of solicitudesPendientes) {
      const erroresExamen = Math.floor(randomFn() * 11);
      const aciertosExamen = calcularAciertosTeorico(erroresExamen);
      const estado = erroresExamen <= 3 ? "APTO" : "NO_APTO";

      await this.repository.updateResultadoSolicitudTeorico(
        solicitud.id,
        estado,
        erroresExamen,
        aciertosExamen,
      );

      aciertosTotales += aciertosExamen || 0;
      erroresTotales += erroresExamen;

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

        await this.consumeConvocatoriaPorResultado(
          solicitud.alumnoId,
          licenciaObjetivo,
        );
      }
    }

    return {
      procesadas,
      aptos,
      noAptos,
      aciertosTotales,
      erroresTotales,
      fechaEjecucion: new Date(),
    };
  }

  async processScheduledPracticalResults({
    today = new Date(),
    randomFn = Math.random,
  } = {}) {
    const solicitudesPendientesRaw =
      await this.repository.findSolicitudesPracticoPendientesResultado(
        finDelDia(today),
      );

    const seenPerDay = new Set();
    const solicitudesPendientes = [];
    const solicitudesDuplicadas = [];

    for (const solicitud of solicitudesPendientesRaw) {
      const key = `${solicitud.alumnoId}|${getDateKey(
        solicitud.fechaProgramada || solicitud.fechaSolicitud,
      )}`;

      if (seenPerDay.has(key)) {
        solicitudesDuplicadas.push(solicitud);
        continue;
      }

      seenPerDay.add(key);
      solicitudesPendientes.push(solicitud);
    }

    for (const duplicada of solicitudesDuplicadas) {
      await this.repository.updateResultadoSolicitudPracticoIfPending(
        duplicada.id,
        {
          estado: "CANCELADO",
          observaciones:
            "Cancelada automáticamente por duplicidad de solicitud práctica en la misma fecha.",
        },
      );
    }

    let procesadas = 0;
    let aptos = 0;
    let noAptos = 0;
    let faltasLevesTotales = 0;
    let faltasDeficientesTotales = 0;
    let faltasEliminatoriasTotales = 0;

    for (const solicitud of solicitudesPendientes) {
      const isAptoTarget = randomFn() < 0.6;
      const faltasBase = isAptoTarget
        ? generarFaltasApto(randomFn)
        : generarFaltasNoApto(randomFn);
      const faltas = enrichFaltasWithDetail(randomFn, faltasBase);
      const noApto = shouldBeNoAptoPractico(faltas);
      const estado = noApto ? "NO_APTO" : "APTO";
      const motivoNoApto = noApto ? getMotivoNoAptoPractico(faltas) : null;

      const updated =
        await this.repository.updateResultadoSolicitudPracticoIfPending(
          solicitud.id,
          {
            estado,
            faltasLeves: faltas.faltasLeves,
            faltasDeficientes: faltas.faltasDeficientes,
            faltasEliminatorias: faltas.faltasEliminatorias,
            faltasLevesDetalle: faltas.faltasLevesDetalle,
            faltasDeficientesDetalle: faltas.faltasDeficientesDetalle,
            faltasEliminatoriasDetalle: faltas.faltasEliminatoriasDetalle,
            motivoNoApto,
            erroresExamen: null,
            aciertosExamen: null,
          },
        );

      if (!updated) {
        continue;
      }

      await this.repository.createExamenResultadoPractico({
        alumnoId: solicitud.alumnoId,
        fecha: solicitud.fechaProgramada || new Date(),
        estado,
      });

      faltasLevesTotales += faltas.faltasLeves;
      faltasDeficientesTotales += faltas.faltasDeficientes;
      faltasEliminatoriasTotales += faltas.faltasEliminatorias;

      procesadas += 1;

      if (estado === "APTO") {
        await this.markLicenseObtainedIfPracticalApto({
          alumnoId: solicitud.alumnoId,
          tipo: "PRACTICO",
          estado,
        });
        aptos += 1;
        continue;
      }

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

      await this.consumeConvocatoriaPorResultado(
        solicitud.alumnoId,
        licenciaObjetivo,
      );
    }

    return {
      procesadas,
      aptos,
      noAptos,
      faltasLevesTotales,
      faltasDeficientesTotales,
      faltasEliminatoriasTotales,
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
    const current = await this.repository.findSolicitudById(id);

    if (!current) {
      throw new Error("Solicitud no encontrada");
    }

    const payload = this.validarPayload(data);
    const licenciaObjetivo = normalizarLicenciaObjetivo(data.licenciaObjetivo);

    await this.validarDerechoExamenPorTasaDGT(
      payload.alumnoId,
      licenciaObjetivo,
    );

    const updated = await this.repository.update(id, payload);

    const previousEstado = String(current?.estado || "").toUpperCase();
    const nextEstado = String(updated?.estado || "").toUpperCase();
    const shouldConsume =
      this.isEstadoConsumoConvocatoria(nextEstado) &&
      !this.isEstadoConsumoConvocatoria(previousEstado);

    if (shouldConsume) {
      const matriculaPagada = await this.repository.findMatriculaPagada(
        updated.alumnoId,
      );

      if (matriculaPagada) {
        const licencia = normalizarLicenciaObjetivo(matriculaPagada.licencia);
        await this.consumeConvocatoriaPorResultado(updated.alumnoId, licencia);
      }
    }

    await this.markLicenseObtainedIfPracticalApto({
      alumnoId: updated.alumnoId,
      tipo: updated.tipo,
      estado: updated.estado,
    });

    return updated;
  }

  async delete(id) {
    return this.repository.delete(id);
  }
}
