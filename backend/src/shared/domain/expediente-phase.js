const FINAL_PRACTICAL_FAILURE_STATES = ["NO_APTO", "SUSPENDIDO", "SUSPENSO"];
const ACTIVE_REQUEST_STATES = ["SOLICITADO", "PROGRAMADO", "PENDIENTE"];

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

const countCompletedRoadmaps = (clases = []) => {
  return (clases || []).filter((clase) => {
    const estadoClase = String(clase?.estado || "").toUpperCase();
    const estadoHoja = String(clase?.hojaRuta?.estado || "").toUpperCase();

    return (
      ["COMPLETADA", "REALIZADA", "FINALIZADA", "REGISTRADA"].includes(
        estadoClase,
      ) || estadoHoja === "REGISTRADA"
    );
  }).length;
};

export const EXPEDIENTE_PHASES = {
  PENDIENTE_MATRICULA: {
    code: "PENDIENTE_MATRICULA",
    label: "Pendiente matrícula",
  },
  PENDIENTE_EXAMEN_TEORICO: {
    code: "PENDIENTE_EXAMEN_TEORICO",
    label: "Pendiente de examen teórico",
  },
  TEORICO_SUSPENSO: {
    code: "TEORICO_SUSPENSO",
    label: "Teórico suspenso",
  },
  TEORICO_APROBADO: {
    code: "TEORICO_APROBADO",
    label: "Teórico aprobado",
  },
  PREPARANDO_PRACTICO: {
    code: "PREPARANDO_PRACTICO",
    label: "Preparándose para el práctico",
  },
  PENDIENTE_EXAMEN_PRACTICO: {
    code: "PENDIENTE_EXAMEN_PRACTICO",
    label: "Pendiente de examen práctico",
  },
  PRACTICO_SUSPENSO: {
    code: "PRACTICO_SUSPENSO",
    label: "Práctico suspenso",
  },
  LICENCIA_OBTENIDA: {
    code: "LICENCIA_OBTENIDA",
    label: "Licencia obtenida",
  },
};

export const resolveExpedientePhase = ({
  estadoExpediente,
  matriculaEstado,
  solicitudesExamen = [],
  clases = [],
} = {}) => {
  const latestTheoryRequest = getLatestExamRequestByType(
    solicitudesExamen,
    "TEORICO",
  );
  const latestPracticalRequest = getLatestExamRequestByType(
    solicitudesExamen,
    "PRACTICO",
  );

  const practicalStatus = String(
    latestPracticalRequest?.estado || "",
  ).toUpperCase();
  const theoryStatus = String(latestTheoryRequest?.estado || "").toUpperCase();
  const expedienteNormalizado = String(estadoExpediente || "").toUpperCase();
  const matriculaNormalizada = String(matriculaEstado || "").toUpperCase();
  const completedRoadmaps = countCompletedRoadmaps(clases);

  if (matriculaNormalizada !== "PAGADA") {
    return EXPEDIENTE_PHASES.PENDIENTE_MATRICULA;
  }

  if (
    expedienteNormalizado === EXPEDIENTE_PHASES.LICENCIA_OBTENIDA.code ||
    practicalStatus === "APTO"
  ) {
    return EXPEDIENTE_PHASES.LICENCIA_OBTENIDA;
  }

  if (FINAL_PRACTICAL_FAILURE_STATES.includes(practicalStatus)) {
    return EXPEDIENTE_PHASES.PRACTICO_SUSPENSO;
  }

  if (ACTIVE_REQUEST_STATES.includes(practicalStatus)) {
    return EXPEDIENTE_PHASES.PENDIENTE_EXAMEN_PRACTICO;
  }

  if (theoryStatus === "APTO" && completedRoadmaps > 0) {
    return EXPEDIENTE_PHASES.PREPARANDO_PRACTICO;
  }

  if (FINAL_PRACTICAL_FAILURE_STATES.includes(theoryStatus)) {
    return EXPEDIENTE_PHASES.TEORICO_SUSPENSO;
  }

  if (theoryStatus === "APTO") {
    return EXPEDIENTE_PHASES.TEORICO_APROBADO;
  }

  if (ACTIVE_REQUEST_STATES.includes(theoryStatus)) {
    return EXPEDIENTE_PHASES.PENDIENTE_EXAMEN_TEORICO;
  }

  return EXPEDIENTE_PHASES.PENDIENTE_EXAMEN_TEORICO;
};
