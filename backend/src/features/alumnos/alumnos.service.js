import bcrypt from "bcryptjs";

const LICENCIAS_PERMITIDAS = ["B", "A1", "A2", "A", "C", "D", "E"];

const parseBoolean = (valor, defaultValue = false) => {
  if (valor === undefined || valor === null || valor === "") {
    return defaultValue;
  }

  if (typeof valor === "boolean") {
    return valor;
  }

  return ["true", "1", "on", "yes", "si", "sí"].includes(
    String(valor).trim().toLowerCase(),
  );
};

const parseFechaNacimiento = (valor) => {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  const entrada = String(valor).trim();

  if (!entrada) {
    return null;
  }

  const formatoEspanyol = /^\d{2}[/-]\d{2}[/-]\d{4}$/;
  if (formatoEspanyol.test(entrada)) {
    const [dia, mes, anio] = entrada.split(/[/-]/).map(Number);
    const fecha = new Date(anio, mes - 1, dia);

    if (
      fecha.getFullYear() !== anio ||
      fecha.getMonth() !== mes - 1 ||
      fecha.getDate() !== dia
    ) {
      return null;
    }

    return fecha;
  }

  const fechaIso = new Date(entrada);
  if (Number.isNaN(fechaIso.getTime())) {
    return null;
  }

  return fechaIso;
};

const normalizarDni = (valor) => {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  const dni = String(valor).trim();
  if (!dni) {
    return null;
  }

  return /^\d{8}[A-Za-z]$/.test(dni) ? dni.toUpperCase() : null;
};

const normalizarTelefono = (valor) => {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  const telefono = String(valor).trim();
  if (!telefono) {
    return null;
  }

  return /^\d{9}$/.test(telefono) ? telefono : null;
};

const toExamEstadoLabel = (estado) => {
  const normalized = String(estado || "").toUpperCase();

  if (normalized === "APTO") {
    return "Aprobado (apto)";
  }

  if (["NO_APTO", "SUSPENDIDO"].includes(normalized)) {
    return "Suspenso (no apto)";
  }

  return "No presentado";
};

const isFinalExamState = (estado) =>
  [
    "APTO",
    "NO_APTO",
    "APROBADO",
    "SUSPENDIDO",
    "SUSPENSO",
    "NO_PRESENTADO",
  ].includes(String(estado || "").toUpperCase());

const calculatePercentage = (ok, total) => {
  if (!total) {
    return 0;
  }

  return Number(((ok / total) * 100).toFixed(1));
};

const formatMinutesAsHours = (minutes) => {
  const safeMinutes = Number.isFinite(minutes) ? Math.max(minutes, 0) : 0;
  const hours = Math.floor(safeMinutes / 60);
  const remainder = safeMinutes % 60;
  return `${hours}h ${String(remainder).padStart(2, "0")}min`;
};

const getComparableExamDate = (examRequest) => {
  const dateValue = examRequest?.fechaProgramada || examRequest?.fechaSolicitud;
  const date = new Date(dateValue || 0);

  if (Number.isNaN(date.getTime())) {
    return 0;
  }

  return date.getTime();
};

const getAcademicPhaseFromRequests = (solicitudesExamen = [], clases = []) => {
  const latestTheoryRequest = [...(solicitudesExamen || [])]
    .filter((request) => request?.tipo === "TEORICO")
    .sort((a, b) => getComparableExamDate(b) - getComparableExamDate(a))[0];

  const latestPracticalRequest = [...(solicitudesExamen || [])]
    .filter((request) => request?.tipo === "PRACTICO")
    .sort((a, b) => getComparableExamDate(b) - getComparableExamDate(a))[0];

  const completedRoadmaps = (clases || []).filter((clase) => {
    const estadoClase = String(clase?.estado || "").toUpperCase();
    const estadoHoja = String(clase?.hojaRuta?.estado || "").toUpperCase();

    return (
      ["COMPLETADA", "REALIZADA", "FINALIZADA", "REGISTRADA"].includes(
        estadoClase,
      ) || estadoHoja === "REGISTRADA"
    );
  }).length;

  const practicalStatus = String(
    latestPracticalRequest?.estado || "",
  ).toUpperCase();
  const theoryStatus = String(latestTheoryRequest?.estado || "").toUpperCase();

  if (practicalStatus === "APTO") {
    return "Licencia aprobada";
  }

  if (["NO_APTO", "SUSPENDIDO", "SUSPENSO"].includes(practicalStatus)) {
    return "Práctico suspenso";
  }

  if (["SOLICITADO", "PROGRAMADO", "PENDIENTE"].includes(practicalStatus)) {
    return "Pendiente de examen práctico";
  }

  if (theoryStatus === "APTO" && completedRoadmaps > 0) {
    return "Preparándose para el práctico";
  }

  if (["NO_APTO", "SUSPENDIDO", "SUSPENSO"].includes(theoryStatus)) {
    return "Teórico suspenso";
  }

  if (theoryStatus === "APTO") {
    return "Teórico aprobado";
  }

  if (["SOLICITADO", "PROGRAMADO", "PENDIENTE"].includes(theoryStatus)) {
    return "Pendiente de examen teórico";
  }

  return "En formación";
};

const calcularEdad = (fechaNacimiento) => {
  if (
    !(fechaNacimiento instanceof Date) ||
    Number.isNaN(fechaNacimiento.getTime())
  ) {
    return null;
  }

  const hoy = new Date();
  let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
  const mesDiff = hoy.getMonth() - fechaNacimiento.getMonth();

  if (
    mesDiff < 0 ||
    (mesDiff === 0 && hoy.getDate() < fechaNacimiento.getDate())
  ) {
    edad -= 1;
  }

  return edad;
};

export class AlumnosService {
  constructor(
    repository,
    accountActivationService = null,
    matriculasRepository = null,
    promocionesRepository = null,
    notificacionesRepository = null,
  ) {
    this.repository = repository;
    this.accountActivationService = accountActivationService;
    this.matriculasRepository = matriculasRepository;
    this.promocionesRepository = promocionesRepository;
    this.notificacionesRepository = notificacionesRepository;
  }

  async create(data, context = {}) {
    const nombre = typeof data.nombre === "string" ? data.nombre.trim() : "";

    if (!nombre) {
      throw new Error("El nombre es obligatorio");
    }

    if (!data.email) {
      throw new Error("El email es obligatorio");
    }

    if (!data.password) {
      throw new Error("La contraseña es obligatoria");
    }

    if (data.password.length < 8) {
      throw new Error("La contraseña debe tener al menos 8 caracteres");
    }

    const tipoLicenciaObjetivo =
      data.tipoLicenciaObjetivo ?? data.tipoLicencia ?? "";
    const licenciaNormalizada = String(tipoLicenciaObjetivo)
      .trim()
      .toUpperCase();

    if (!licenciaNormalizada) {
      throw new Error("La licencia objetivo es obligatoria");
    }

    if (!LICENCIAS_PERMITIDAS.includes(licenciaNormalizada)) {
      throw new Error(
        "La licencia objetivo debe ser una de las permitidas: B, A1, A2, A, C, D, E",
      );
    }

    if (!data.telefono) {
      throw new Error("El teléfono es obligatorio");
    }

    const telefono = normalizarTelefono(data.telefono);
    if (!telefono) {
      throw new Error("El teléfono debe contener exactamente 9 dígitos");
    }

    const existingUser = await this.repository.findByEmail(data.email);

    if (existingUser) {
      throw new Error("El email ya existe");
    }

    if (
      data.dni === undefined ||
      data.dni === null ||
      String(data.dni).trim() === ""
    ) {
      throw new Error("El DNI es obligatorio");
    }

    const dni = normalizarDni(data.dni);
    if (!dni) {
      throw new Error("El DNI debe tener un formato válido");
    }

    if (
      data.fechaNacimiento === undefined ||
      data.fechaNacimiento === null ||
      String(data.fechaNacimiento).trim() === ""
    ) {
      throw new Error("La fecha de nacimiento es obligatoria");
    }

    const fechaNacimiento = parseFechaNacimiento(data.fechaNacimiento);
    if (!fechaNacimiento) {
      throw new Error("La fecha de nacimiento debe ser una fecha válida");
    }

    const esEstudiante = parseBoolean(data.esEstudiante, false);

    const promocionesElegibles = await this.getEligiblePromotionsForEnrollment({
      tipoLicenciaObjetivo: licenciaNormalizada,
      fechaNacimiento,
      dni,
      esEstudiante,
    });

    const promocionSeleccionada = this.resolveSelectedPromotion({
      promocionesElegibles,
      promocionId: data.promocionId,
    });

    const passwordHash = await bcrypt.hash(data.password, 10);

    const alumno = await this.repository.create({
      ...data,
      nombre,
      dni,
      fechaNacimiento,
      telefono,
      tipoLicenciaObjetivo: licenciaNormalizada,
      passwordHash,
      rol: "ALUMNO",
      activo: true,
    });

    if (this.matriculasRepository) {
      const tarifa =
        await this.matriculasRepository.findTarifaByLicencia(
          licenciaNormalizada,
        );

      if (!tarifa) {
        throw new Error(
          `No existe tarifa configurada para la licencia ${licenciaNormalizada}`,
        );
      }

      const precioBase = promocionSeleccionada?.precioOriginal ?? tarifa.precio;

      const precioFinal =
        promocionSeleccionada?.precioPromocional ?? tarifa.precio;

      const matriculaPayload = {
        alumnoId: alumno.id,
        licencia: licenciaNormalizada,
        precioBase,
        precioFinal,
        promocionId: promocionSeleccionada?.id ?? null,
        estado: "PENDIENTE",
      };

      const baseNumerica = Number(precioBase);
      const finalNumerico = Number(precioFinal);

      const facturaPayload = {
        concepto: promocionSeleccionada
          ? `Matricula licencia ${licenciaNormalizada} - ${promocionSeleccionada.nombre}`
          : `Matricula licencia ${licenciaNormalizada}`,
        baseImponible: precioBase,
        descuento:
          baseNumerica > finalNumerico
            ? Number((baseNumerica - finalNumerico).toFixed(2))
            : 0,
        total: precioFinal,
        estado: "EMITIDA",
      };

      if (typeof this.matriculasRepository.createWithFactura === "function") {
        await this.matriculasRepository.createWithFactura(
          matriculaPayload,
          facturaPayload,
        );
      } else {
        await this.matriculasRepository.create(matriculaPayload);
      }
    }

    if (this.accountActivationService) {
      try {
        await this.accountActivationService.issueActivationForUser({
          usuarioId: alumno.id,
          createdById: context.createdById || null,
        });
      } catch (error) {
        console.error(
          "No se pudo enviar el enlace de activación al alumno:",
          error.message,
        );
      }
    }

    return alumno;
  }

  async getEligiblePromotionsForEnrollment(data) {
    if (!this.promocionesRepository) {
      return [];
    }

    const tipoLicenciaObjetivo =
      data.tipoLicenciaObjetivo ?? data.tipoLicencia ?? "";

    const licenciaNormalizada = String(tipoLicenciaObjetivo)
      .trim()
      .toUpperCase();

    if (
      !licenciaNormalizada ||
      !LICENCIAS_PERMITIDAS.includes(licenciaNormalizada)
    ) {
      throw new Error(
        "La licencia objetivo debe ser una de las permitidas: B, A1, A2, A, C, D, E",
      );
    }

    const fechaNacimiento =
      data.fechaNacimiento instanceof Date
        ? data.fechaNacimiento
        : parseFechaNacimiento(data.fechaNacimiento);

    if (!fechaNacimiento) {
      throw new Error("La fecha de nacimiento debe ser una fecha válida");
    }

    const dni = normalizarDni(data.dni);
    const esEstudiante = parseBoolean(data.esEstudiante, false);

    const promocionesBase =
      await this.promocionesRepository.findActiveByLicense(
        licenciaNormalizada,
        new Date(),
      );

    const edad = calcularEdad(fechaNacimiento);

    const requiereFidelidad = promocionesBase.some(
      (promocion) => promocion.requiereFidelidad,
    );

    const cumpleFidelidad = requiereFidelidad
      ? await this.repository.hasApprovedHistoryByDni(dni)
      : false;

    return promocionesBase.filter((promocion) => {
      if (promocion.requiereCarnetEstudiante && !esEstudiante) {
        return false;
      }

      if (
        promocion.edadMinima !== null &&
        promocion.edadMinima !== undefined &&
        (edad === null || edad < promocion.edadMinima)
      ) {
        return false;
      }

      if (
        promocion.edadMaxima !== null &&
        promocion.edadMaxima !== undefined &&
        (edad === null || edad > promocion.edadMaxima)
      ) {
        return false;
      }

      if (promocion.requiereFidelidad && !cumpleFidelidad) {
        return false;
      }

      return true;
    });
  }

  resolveSelectedPromotion({ promocionesElegibles, promocionId }) {
    if (
      !Array.isArray(promocionesElegibles) ||
      promocionesElegibles.length === 0
    ) {
      return null;
    }

    if (!promocionId) {
      if (promocionesElegibles.length > 1) {
        throw new Error(
          "Existen varias promociones aplicables. Debe seleccionar una promoción antes de confirmar el alta.",
        );
      }

      return promocionesElegibles[0];
    }

    const promocionSeleccionada = promocionesElegibles.find(
      (promocion) => promocion.id === promocionId,
    );

    if (!promocionSeleccionada) {
      throw new Error(
        "La promoción seleccionada no es válida para el alumno o no está vigente.",
      );
    }

    return promocionSeleccionada;
  }

  async getAll() {
    const rows = await this.repository.findAll();

    return (rows || []).map((alumno) => {
      const clases = Array.isArray(alumno?.clases) ? alumno.clases : [];

      const clasesRealizadasRows = clases.filter((clase) => {
        const estadoClase = String(clase?.estado || "").toUpperCase();
        const estadoHoja = String(clase?.hojaRuta?.estado || "").toUpperCase();

        return (
          ["REALIZADA", "COMPLETADA", "FINALIZADA", "REGISTRADA"].includes(
            estadoClase,
          ) || estadoHoja === "REGISTRADA"
        );
      });

      const minutosPracticas = clasesRealizadasRows.reduce(
        (acc, clase) => acc + (Number(clase?.duracion) || 45),
        0,
      );

      return {
        ...alumno,
        horasPracticasCompletadas: Number((minutosPracticas / 60).toFixed(2)),
        horasPracticasCompletadasTexto: formatMinutesAsHours(minutosPracticas),
        faseActual: getAcademicPhaseFromRequests(
          alumno?.solicitudesExamen || [],
          clases,
        ),
      };
    });
  }

  async getById(id) {
    const alumno = await this.repository.findById(id);

    if (!alumno) {
      throw new Error("Alumno no encontrado");
    }

    return alumno;
  }

  async getExtendedSummary(id) {
    const alumno = await this.repository.findExtendedSummaryById(id);

    if (!alumno) {
      throw new Error("Alumno no encontrado");
    }

    const matriculaActual = alumno.matriculas?.[0] || null;
    const pagos = Array.isArray(alumno.pagos) ? alumno.pagos : [];
    const solicitudes = Array.isArray(alumno.solicitudesExamen)
      ? alumno.solicitudesExamen
      : [];
    const bonos = Array.isArray(alumno.bonos) ? alumno.bonos : [];
    const testsTemario = Array.isArray(alumno.testsTemario)
      ? alumno.testsTemario
      : [];
    const examenesDgt = Array.isArray(alumno.examenesDgt)
      ? alumno.examenesDgt
      : [];

    const pagoTasaDgt = pagos.find((pago) => pago.tipo === "TASA_DGT_21");
    const pagoPractico = pagos.find(
      (pago) => pago.tipo === "EXAMEN_PRACTICO_GASTOS",
    );
    const pagoPracticoPromo = pagos.find(
      (pago) => pago.tipo === "PROMOCION_PAGO_EXAMEN_GRATIS",
    );

    const teoricos = solicitudes.filter(
      (solicitud) => solicitud.tipo === "TEORICO",
    );
    const practicos = solicitudes.filter(
      (solicitud) => solicitud.tipo === "PRACTICO",
    );
    const teoricoMasReciente = teoricos[0] || null;
    const practicoMasReciente = practicos[0] || null;

    const mapExamHistory = (solicitud) => ({
      id: solicitud.id,
      estado: toExamEstadoLabel(solicitud?.estado),
      estadoRaw: String(solicitud?.estado || "").toUpperCase(),
      fecha: solicitud?.fechaProgramada || solicitud?.fechaSolicitud || null,
      aciertos: solicitud?.aciertosExamen ?? null,
      fallos: solicitud?.erroresExamen ?? null,
      leves: solicitud?.faltasLeves ?? null,
      deficientes: solicitud?.faltasDeficientes ?? null,
      eliminatorias: solicitud?.faltasEliminatorias ?? null,
    });

    const teoricoHistorial = teoricos
      .filter((solicitud) => isFinalExamState(solicitud?.estado))
      .map(mapExamHistory)
      .sort((a, b) => new Date(b.fecha || 0) - new Date(a.fecha || 0));

    const practicoHistorial = practicos
      .filter((solicitud) => isFinalExamState(solicitud?.estado))
      .map(mapExamHistory)
      .sort((a, b) => new Date(b.fecha || 0) - new Date(a.fecha || 0));

    const tienePromo = Boolean(matriculaActual?.promocion);
    const bonosDetallados = bonos.map((bono) => {
      const clasesCompradas = Number(bono.clasesCompradas || 0);
      const clasesConsumidas = Number(bono.clasesConsumidas || 0);
      const clasesDisponibles = Math.max(clasesCompradas - clasesConsumidas, 0);

      return {
        id: bono.id,
        nombre: bono.bono?.nombre || "Bono",
        fechaCaducidad: bono.fechaValidezHasta || null,
        pagado: Boolean(bono.pagado),
        clasesCompradas,
        clasesConsumidas,
        clasesDisponibles,
      };
    });

    const bonoPrincipal =
      bonosDetallados.find(
        (bono) => bono.pagado && bono.clasesDisponibles > 0,
      ) ||
      bonosDetallados[0] ||
      null;

    const testsTemarioAprobados = testsTemario.filter(
      (test) => test.resultado === "APROBADO",
    ).length;
    const testsTemarioSuspendidos = testsTemario.filter(
      (test) => test.resultado === "SUSPENDIDO",
    ).length;
    const testsTemarioTotales = testsTemario.length;

    const dgtAprobados = examenesDgt.filter(
      (test) => test.aprobado === true,
    ).length;
    const dgtSuspendidos = examenesDgt.filter(
      (test) => test.aprobado === false,
    ).length;
    const dgtTotales = examenesDgt.length;

    let estadoAcademico = {
      codigo: "EN_FORMACION",
      label: "En formación",
    };

    const estadoExpediente = String(
      alumno.estadoExpediente || "",
    ).toUpperCase();

    if (
      estadoExpediente === "LICENCIA_OBTENIDA" ||
      practicoMasReciente?.estado === "APTO"
    ) {
      estadoAcademico = {
        codigo: "LICENCIA_OBTENIDA",
        label: "Licencia obtenida",
      };
    } else if (
      ["NO_APTO", "SUSPENDIDO", "NO_PRESENTADO"].includes(
        practicoMasReciente?.estado,
      )
    ) {
      estadoAcademico = {
        codigo: "PRACTICO_SUSPENSO",
        label: "Práctico suspenso",
      };
    } else if (teoricoMasReciente?.estado === "APTO") {
      estadoAcademico = {
        codigo: "TEORICO_APROBADO",
        label: "Teórico aprobado",
      };
    } else if (
      ["NO_APTO", "SUSPENDIDO", "NO_PRESENTADO"].includes(
        teoricoMasReciente?.estado,
      )
    ) {
      estadoAcademico = {
        codigo: "TEORICO_SUSPENSO",
        label: "Teórico suspenso",
      };
    }

    const fechaInicioCobertura =
      pagoTasaDgt?.fechaPago || pagoTasaDgt?.fechaCreacion || null;

    const consumidasReales = fechaInicioCobertura
      ? teoricoHistorial.filter((item) => {
          const fecha = new Date(item.fecha || 0);
          return (
            ["NO_APTO", "SUSPENDIDO", "NO_PRESENTADO"].includes(
              item.estadoRaw,
            ) && fecha >= new Date(fechaInicioCobertura)
          );
        }).length +
        practicoHistorial.filter((item) => {
          const fecha = new Date(item.fecha || 0);
          return (
            ["NO_APTO", "SUSPENDIDO", "NO_PRESENTADO"].includes(
              item.estadoRaw,
            ) && fecha >= new Date(fechaInicioCobertura)
          );
        }).length
      : 0;

    const convocatoriasIncluidas = Number(
      pagoTasaDgt?.convocatoriasIncluidas || 0,
    );
    const consumidasPago = Number(pagoTasaDgt?.convocatoriasConsumidas || 0);
    const convocatoriasConsumidas = Math.min(
      Math.max(Math.max(consumidasPago, consumidasReales), 0),
      convocatoriasIncluidas,
    );

    const vidasRestantes = pagoTasaDgt
      ? Math.max(convocatoriasIncluidas - convocatoriasConsumidas, 0)
      : 0;

    const tasaDgtEstado = !pagoTasaDgt
      ? "NO_PAGADA"
      : vidasRestantes <= 0
        ? "PENDIENTE_RENOVACION"
        : "PAGADA";

    return {
      id: alumno.id,
      nombreCompleto: alumno.usuario?.nombre || "",
      estadoAcademico,
      matricula: {
        estado: matriculaActual?.estado || "PENDIENTE",
        pagada: matriculaActual?.estado === "PAGADA",
      },
      testsTemario: {
        realizados: testsTemarioTotales,
        aprobados: testsTemarioAprobados,
        suspendidos: testsTemarioSuspendidos,
        porcentajeAprobados: calculatePercentage(
          testsTemarioAprobados,
          testsTemarioTotales,
        ),
      },
      testsDgt: {
        realizados: dgtTotales,
        aprobados: dgtAprobados,
        suspendidos: dgtSuspendidos,
        porcentajeAprobados: calculatePercentage(dgtAprobados, dgtTotales),
      },
      pagos: {
        tasaDgtPagada: pagoTasaDgt?.estado === "PAGADO",
        tasaDgtEstado,
        pagoExamenPracticoPagado:
          pagoPractico?.estado === "PAGADO" ||
          pagoPracticoPromo?.estado === "PAGADO",
        matriculaPagada: matriculaActual?.estado === "PAGADA",
        promocionMatricula: {
          tiene: Boolean(matriculaActual?.promocion),
          nombre: matriculaActual?.promocion?.nombre || null,
          precioOriginal: matriculaActual?.promocion?.precioOriginal || null,
          precioPromocional:
            matriculaActual?.promocion?.precioPromocional || null,
        },
      },
      documentacion: {
        psicotecnicoEntregado: (alumno.documentos || []).length > 0,
      },
      vidas: {
        restantes: vidasRestantes,
        requiereNuevoPago: Boolean(pagoTasaDgt) && vidasRestantes <= 0,
      },
      examenTeorico: {
        estado: toExamEstadoLabel(teoricoMasReciente?.estado),
        presentado: Boolean(teoricoMasReciente),
        aciertos: teoricoMasReciente?.aciertosExamen ?? null,
        fallos: teoricoMasReciente?.erroresExamen ?? null,
      },
      examenTeoricoHistorial: teoricoHistorial,
      examenPractico: {
        estado: toExamEstadoLabel(practicoMasReciente?.estado),
        presentado: Boolean(practicoMasReciente),
        leves: practicoMasReciente?.faltasLeves ?? null,
        deficientes: practicoMasReciente?.faltasDeficientes ?? null,
        eliminatorias: practicoMasReciente?.faltasEliminatorias ?? null,
      },
      examenPracticoHistorial: practicoHistorial,
      promocionesMatricula: {
        tiene: tienePromo,
        nombre: matriculaActual?.promocion?.nombre || null,
      },
      bonoClases: {
        tiene: bonosDetallados.length > 0,
        detalle: bonoPrincipal,
        historial: bonosDetallados,
      },
      resumenActividad: {
        pagosRegistrados: pagos.length,
        solicitudesExamen: solicitudes.length,
        clasesReservadas: Array.isArray(alumno.clases)
          ? alumno.clases.length
          : 0,
      },
    };
  }

  async update(id, data) {
    const alumnoActual = await this.repository.findById(id);

    if (!alumnoActual) {
      throw new Error("Alumno no encontrado");
    }

    const matricula = this.matriculasRepository
      ? await this.matriculasRepository.findActiveByAlumnoId(id)
      : null;

    const payload = {
      ...data,
    };

    if (Object.prototype.hasOwnProperty.call(data, "telefono")) {
      const telefono = normalizarTelefono(data.telefono);

      if (!telefono) {
        throw new Error("El teléfono debe contener exactamente 9 dígitos");
      }

      payload.telefono = telefono;
    }

    const profesorAnterior = alumnoActual.profesorAsignadoId || null;

    const licenciaNuevaRaw = data.tipoLicenciaObjetivo ?? data.tipoLicencia;
    const licenciaNuevaNormalizada = licenciaNuevaRaw
      ? String(licenciaNuevaRaw).trim().toUpperCase()
      : null;

    if (
      licenciaNuevaNormalizada &&
      !LICENCIAS_PERMITIDAS.includes(licenciaNuevaNormalizada)
    ) {
      throw new Error(
        "La licencia objetivo debe ser una de las permitidas: B, A1, A2, A, C, D, E",
      );
    }

    if (matricula && matricula.estado === "PAGADA") {
      const licenciaNueva = licenciaNuevaNormalizada;

      if (licenciaNueva && licenciaNueva !== matricula.licencia) {
        throw new Error(
          "No se puede modificar la licencia porque la matrícula ya ha sido abonada.",
        );
      }
    }

    if (licenciaNuevaNormalizada) {
      payload.tipoLicenciaObjetivo = licenciaNuevaNormalizada;
      delete payload.tipoLicencia;
    }

    if (Object.prototype.hasOwnProperty.call(data, "profesorAsignadoId")) {
      const profesorAsignadoId = data.profesorAsignadoId || null;

      if (profesorAsignadoId) {
        if (!this.matriculasRepository) {
          throw new Error("No se puede validar la matrícula del alumno");
        }

        if (!matricula || matricula.estado !== "PAGADA") {
          throw new Error(
            "Solo se puede asignar profesor cuando la matrícula está pagada.",
          );
        }

        const profesor =
          await this.repository.findProfesorById(profesorAsignadoId);

        if (!profesor || profesor.activo === false) {
          throw new Error("El profesor seleccionado no existe o está inactivo");
        }

        const licenciaObjetivo = String(
          data.tipoLicenciaObjetivo ??
            data.tipoLicencia ??
            alumnoActual.tipoLicenciaObjetivo ??
            "",
        )
          .trim()
          .toUpperCase();

        const permisos = Array.isArray(profesor.permisosLicencias)
          ? profesor.permisosLicencias.map((permiso) =>
              String(permiso || "")
                .trim()
                .toUpperCase(),
            )
          : [];

        if (!permisos.includes(licenciaObjetivo)) {
          throw new Error(
            "El profesor seleccionado no tiene permiso para la licencia del alumno.",
          );
        }
      }

      payload.profesorAsignadoId = profesorAsignadoId;
    }

    if (data.password?.trim()) {
      if (data.password.length < 8) {
        throw new Error("La contraseña debe tener al menos 8 caracteres");
      }

      payload.passwordHash = await bcrypt.hash(data.password, 10);

      delete payload.password;
    } else {
      delete payload.password;
    }

    if (
      this.matriculasRepository &&
      matricula &&
      matricula.estado === "PENDIENTE" &&
      licenciaNuevaNormalizada &&
      licenciaNuevaNormalizada !== matricula.licencia
    ) {
      const dniActual = alumnoActual.usuario?.dni || data.dni;
      const fechaNacimientoActual =
        data.fechaNacimiento ?? alumnoActual.fechaNacimiento;
      const promociones = await this.getEligiblePromotionsForEnrollment({
        tipoLicenciaObjetivo: licenciaNuevaNormalizada,
        fechaNacimiento: fechaNacimientoActual,
        dni: dniActual,
        esEstudiante: parseBoolean(data.esEstudiante, false),
      });

      let promocionSeleccionada = null;

      if (data.promocionId) {
        promocionSeleccionada = promociones.find(
          (promocion) => promocion.id === data.promocionId,
        );

        if (!promocionSeleccionada) {
          throw new Error(
            "La promoción seleccionada no es válida para la nueva licencia.",
          );
        }
      } else if (promociones.length === 1) {
        promocionSeleccionada = promociones[0];
      }

      const tarifa = await this.matriculasRepository.findTarifaByLicencia(
        licenciaNuevaNormalizada,
      );

      if (!tarifa) {
        throw new Error(
          `No existe tarifa configurada para la licencia ${licenciaNuevaNormalizada}`,
        );
      }

      const precioBase = promocionSeleccionada?.precioOriginal ?? tarifa.precio;
      const precioFinal =
        promocionSeleccionada?.precioPromocional ?? tarifa.precio;

      const baseNumerica = Number(precioBase);
      const finalNumerico = Number(precioFinal);

      await this.matriculasRepository.updatePendingEnrollmentAndFactura({
        matriculaId: matricula.id,
        licencia: licenciaNuevaNormalizada,
        precioBase,
        precioFinal,
        promocionId: promocionSeleccionada?.id || null,
        conceptoFactura: promocionSeleccionada
          ? `Matricula licencia ${licenciaNuevaNormalizada} - ${promocionSeleccionada.nombre}`
          : `Matricula licencia ${licenciaNuevaNormalizada}`,
        descuento:
          baseNumerica > finalNumerico
            ? Number((baseNumerica - finalNumerico).toFixed(2))
            : 0,
      });
    }

    const updatedAlumno = await this.repository.update(id, payload);

    const profesorNuevo = updatedAlumno.profesorAsignadoId || null;

    if (
      profesorNuevo &&
      profesorAnterior &&
      profesorNuevo !== profesorAnterior &&
      typeof this.repository.findFutureScheduledClassesByAlumno === "function"
    ) {
      updatedAlumno.reasignacionClases =
        await this.reassignOrCancelFutureClassesByProfessorChange(
          updatedAlumno,
          profesorNuevo,
        );
    }

    const matriculaActualizada = this.matriculasRepository
      ? await this.matriculasRepository.findActiveByAlumnoId(id)
      : null;

    if (
      this.notificacionesRepository &&
      profesorAnterior &&
      !profesorNuevo &&
      matriculaActualizada?.estado === "PAGADA"
    ) {
      await this.notificacionesRepository.createForRole("ADMIN", {
        tipo: "PROFESOR_PENDIENTE_ASIGNACION",
        titulo: "Profesor pendiente de asignar",
        mensaje: `El alumno ${updatedAlumno?.usuario?.nombre || "alumno"} tiene matrícula pagada y actualmente no tiene profesor asignado`,
        metadata: {
          alumnoId: updatedAlumno.id,
          route: "/alumnos",
        },
      });
    }

    return updatedAlumno;
  }

  async reassignOrCancelFutureClassesByProfessorChange(
    alumno,
    profesorNuevoId,
  ) {
    const now = new Date();
    const futuras = await this.repository.findFutureScheduledClassesByAlumno(
      alumno.id,
      now,
    );

    const resumen = {
      totalFuturas: (futuras || []).length,
      reasignadas: 0,
      canceladas: 0,
    };

    for (const clase of futuras || []) {
      const ocupado = await this.repository.findProfessorOccupiedAtDate(
        profesorNuevoId,
        clase.fecha,
        clase.id,
      );

      if (!ocupado) {
        await this.repository.reassignClassProfessor(clase.id, profesorNuevoId);
        resumen.reasignadas += 1;
        continue;
      }

      const motivo =
        "Clase cancelada por cambio de profesor: conflicto de disponibilidad del nuevo profesor";

      await this.repository.cancelClassByAdmin(clase.id, motivo);
      await this.repository.cancelPendingClassPayment(clase.id, motivo);
      await this.repository.revertConsumedBonusClass(clase.compraBonoId);

      if (this.notificacionesRepository?.create) {
        await this.notificacionesRepository.create({
          usuarioId: alumno.id,
          tipo: "CLASE_CANCELADA",
          titulo: "Clase cancelada por reasignación de profesor",
          mensaje:
            "Se canceló una clase futura por conflicto horario tras cambiar tu profesor. Reserva una nueva clase desde tu área personal.",
          metadata: {
            alumnoId: alumno.id,
            claseId: clase.id,
            route: "/clases-practicas-alumno",
          },
        });
      }

      resumen.canceladas += 1;
    }

    return resumen;
  }

  async getEligibleProfesoresForAlumno(alumnoId) {
    const alumno = await this.repository.findById(alumnoId);

    if (!alumno) {
      throw new Error("Alumno no encontrado");
    }

    if (!this.matriculasRepository) {
      return [];
    }

    const matricula =
      await this.matriculasRepository.findActiveByAlumnoId(alumnoId);

    if (!matricula || matricula.estado !== "PAGADA") {
      return [];
    }

    const licenciaObjetivo = String(alumno.tipoLicenciaObjetivo || "")
      .trim()
      .toUpperCase();

    if (!licenciaObjetivo) {
      return [];
    }

    return this.repository.findActiveProfesoresByLicencia(licenciaObjetivo);
  }

  async deactivate(id) {
    return this.repository.deactivate(id);
  }

  async activate(id) {
    return this.repository.activate(id);
  }

  // async getById(id) {
  //   const alumno = await this.repository.findById(id);

  //   if (!alumno) {
  //     throw new Error("Alumno no encontrado");
  //   }

  //   return alumno;
  // }
}
