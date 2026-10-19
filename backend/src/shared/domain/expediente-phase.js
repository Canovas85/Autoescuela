import {
  normalizeLicenseCode,
  usesDualPracticalPhaseByLicense,
} from "./exam-license-rules.js";

const FINAL_FAILURE_STATES = [
  "NO_APTO",
  "SUSPENDIDO",
  "SUSPENSO",
  "NO_PRESENTADO",
];
const ACTIVE_REQUEST_STATES = ["SOLICITADO", "PROGRAMADO", "PENDIENTE"];
const EXAM_SUCCESS_STATES = ["APTO", "APROBADO"];

const LEGACY_PERSISTED_CODE_ALIASES = {
  PREPARANDO_PRACTICO: "REALIZANDO_CLASES_PRACTICAS_CIRCULACION",
  PENDIENTE_EXAMEN_PRACTICO: "PENDIENTE_EXAMEN_PRACTICO_CIRCULACION",
  PRACTICO_SUSPENSO: "PRACTICO_CIRCULACION_SUSPENSO",
  PRACTICO_CIRCUITO_SUSPENSO: "PRACTICO_PISTA_SUSPENSO",
};

const getComparableExamDate = (examRequest) => {
  const dateValue = examRequest?.fechaProgramada || examRequest?.fechaSolicitud;
  const date = new Date(dateValue || 0);

  if (Number.isNaN(date.getTime())) {
    return 0;
  }

  return date.getTime();
};

const getLatestExamRequestByType = (solicitudesExamen = [], tipo) => {
  return [...(solicitudesExamen || [])]
    .filter((request) => request?.tipo === tipo)
    .sort((a, b) => getComparableExamDate(b) - getComparableExamDate(a))[0];
};

const getPracticalRequests = (solicitudesExamen = []) =>
  (solicitudesExamen || []).filter((request) => request?.tipo === "PRACTICO");

const getLatestPracticalRequestByPhase = (practicalRequests = [], phase) => {
  return [...(practicalRequests || [])]
    .filter((request) => Number(request?.fasePractica || 1) === Number(phase))
    .sort((a, b) => getComparableExamDate(b) - getComparableExamDate(a))[0];
};

const toUpper = (value) => String(value || "").toUpperCase();

const hasNonCancelledPracticalClass = (clases = [], typeCode) => {
  return (clases || []).some((clase) => {
    const estadoClase = toUpper(clase?.estado);

    if (!estadoClase || estadoClase.startsWith("CANCELADA")) {
      return false;
    }

    const tipoClase = toUpper(clase?.tipoClasePractica || "CIRCULACION");

    if (typeCode === "PISTA") {
      return tipoClase === "PISTA";
    }

    return tipoClase !== "PISTA";
  });
};

const resolveLegacyPersistedCode = (code) => {
  const normalized = toUpper(code);
  return LEGACY_PERSISTED_CODE_ALIASES[normalized] || normalized;
};

export const EXPEDIENTE_PHASES = {
  PENDIENTE_MATRICULA: {
    code: "PENDIENTE_MATRICULA",
    label: "Pendiente Matrícula",
  },
  ESTUDIANDO_TEORICO: {
    code: "ESTUDIANDO_TEORICO",
    label: "Estudiando Teórico",
  },
  PENDIENTE_EXAMEN_TEORICO: {
    code: "PENDIENTE_EXAMEN_TEORICO",
    label: "Pendiente Examen Teórico",
  },
  TEORICO_SUSPENSO: {
    code: "TEORICO_SUSPENSO",
    label: "Teórico Suspenso",
  },
  TEORICO_APROBADO: {
    code: "TEORICO_APROBADO",
    label: "Teórico Aprobado",
  },
  REALIZANDO_CLASES_PRACTICAS_CIRCULACION: {
    code: "REALIZANDO_CLASES_PRACTICAS_CIRCULACION",
    label: "Realizando clases prácticas circulación",
  },
  PENDIENTE_EXAMEN_PRACTICO_CIRCULACION: {
    code: "PENDIENTE_EXAMEN_PRACTICO_CIRCULACION",
    label: "Pendiente examen práctico circulación",
  },
  PRACTICO_CIRCULACION_SUSPENSO: {
    code: "PRACTICO_CIRCULACION_SUSPENSO",
    label: "Práctico circulación suspenso",
  },
  PRACTICO_CIRCULACION_APROBADO: {
    code: "PRACTICO_CIRCULACION_APROBADO",
    label: "Práctico circulación aprobado",
  },
  REALIZANDO_CLASES_PRACTICAS_PISTA: {
    code: "REALIZANDO_CLASES_PRACTICAS_PISTA",
    label: "Realizando clases prácticas en pista",
  },
  PENDIENTE_EXAMEN_PRACTICO_PISTA: {
    code: "PENDIENTE_EXAMEN_PRACTICO_PISTA",
    label: "Pendiente examen práctico en pista",
  },
  PRACTICO_PISTA_SUSPENSO: {
    code: "PRACTICO_PISTA_SUSPENSO",
    label: "Práctico pista suspenso",
  },
  LICENCIA_OBTENIDA: {
    code: "LICENCIA_OBTENIDA",
    label: "Licencia Obtenida",
  },
};

export const resolveExpedientePhase = ({
  estadoExpediente,
  matriculaEstado,
  licenciaObjetivo,
  solicitudesExamen = [],
  clases = [],
} = {}) => {
  const license = normalizeLicenseCode(licenciaObjetivo);
  const isDualPractical = usesDualPracticalPhaseByLicense(license);

  const latestTheoryRequest = getLatestExamRequestByType(
    solicitudesExamen,
    "TEORICO",
  );
  const practicalRequests = getPracticalRequests(solicitudesExamen);
  const latestPracticalRequest = [...practicalRequests].sort(
    (a, b) => getComparableExamDate(b) - getComparableExamDate(a),
  )[0];
  const latestPracticalPhase1 = getLatestPracticalRequestByPhase(
    practicalRequests,
    1,
  );
  const latestPracticalPhase2 = getLatestPracticalRequestByPhase(
    practicalRequests,
    2,
  );

  const practicalStatus = toUpper(latestPracticalRequest?.estado);
  const theoryStatus = toUpper(latestTheoryRequest?.estado);
  const expedienteNormalizado = resolveLegacyPersistedCode(estadoExpediente);
  const matriculaNormalizada = toUpper(matriculaEstado);
  const practicalPhase = Number(latestPracticalRequest?.fasePractica || 1);
  const hasCirculationClass = hasNonCancelledPracticalClass(
    clases,
    "CIRCULACION",
  );
  const hasPistaClass = hasNonCancelledPracticalClass(clases, "PISTA");

  if (matriculaNormalizada !== "PAGADA") {
    return EXPEDIENTE_PHASES.PENDIENTE_MATRICULA;
  }

  if (expedienteNormalizado === EXPEDIENTE_PHASES.LICENCIA_OBTENIDA.code) {
    return EXPEDIENTE_PHASES.LICENCIA_OBTENIDA;
  }

  if (!isDualPractical && EXAM_SUCCESS_STATES.includes(practicalStatus)) {
    return EXPEDIENTE_PHASES.LICENCIA_OBTENIDA;
  }

  if (
    isDualPractical &&
    EXAM_SUCCESS_STATES.includes(toUpper(latestPracticalPhase2?.estado))
  ) {
    return EXPEDIENTE_PHASES.LICENCIA_OBTENIDA;
  }

  if (ACTIVE_REQUEST_STATES.includes(toUpper(latestPracticalPhase2?.estado))) {
    return EXPEDIENTE_PHASES.PENDIENTE_EXAMEN_PRACTICO_PISTA;
  }

  if (FINAL_FAILURE_STATES.includes(toUpper(latestPracticalPhase2?.estado))) {
    return EXPEDIENTE_PHASES.PRACTICO_PISTA_SUSPENSO;
  }

  if (
    isDualPractical &&
    EXAM_SUCCESS_STATES.includes(toUpper(latestPracticalPhase1?.estado))
  ) {
    if (hasPistaClass) {
      return EXPEDIENTE_PHASES.REALIZANDO_CLASES_PRACTICAS_PISTA;
    }

    return EXPEDIENTE_PHASES.PRACTICO_CIRCULACION_APROBADO;
  }

  if (FINAL_FAILURE_STATES.includes(practicalStatus)) {
    if (isDualPractical) {
      return practicalPhase === 2
        ? EXPEDIENTE_PHASES.PRACTICO_PISTA_SUSPENSO
        : EXPEDIENTE_PHASES.PRACTICO_CIRCULACION_SUSPENSO;
    }

    return EXPEDIENTE_PHASES.PRACTICO_CIRCULACION_SUSPENSO;
  }

  if (ACTIVE_REQUEST_STATES.includes(practicalStatus)) {
    if (isDualPractical && practicalPhase === 2) {
      return EXPEDIENTE_PHASES.PENDIENTE_EXAMEN_PRACTICO_PISTA;
    }

    return EXPEDIENTE_PHASES.PENDIENTE_EXAMEN_PRACTICO_CIRCULACION;
  }

  if (FINAL_FAILURE_STATES.includes(theoryStatus)) {
    return EXPEDIENTE_PHASES.TEORICO_SUSPENSO;
  }

  if (ACTIVE_REQUEST_STATES.includes(theoryStatus)) {
    return EXPEDIENTE_PHASES.PENDIENTE_EXAMEN_TEORICO;
  }

  if (EXAM_SUCCESS_STATES.includes(theoryStatus)) {
    if (hasCirculationClass) {
      return EXPEDIENTE_PHASES.REALIZANDO_CLASES_PRACTICAS_CIRCULACION;
    }

    return EXPEDIENTE_PHASES.TEORICO_APROBADO;
  }

  return EXPEDIENTE_PHASES.ESTUDIANDO_TEORICO;
};
