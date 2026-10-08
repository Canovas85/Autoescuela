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

const hasFinalPracticalApto = (solicitudesExamen = []) => {
  return (solicitudesExamen || []).some((request) => {
    if (request?.tipo !== "PRACTICO") {
      return false;
    }

    const estado = String(request?.estado || "").toUpperCase();
    if (!["APTO", "APROBADO"].includes(estado)) {
      return false;
    }

    const fase = request?.fasePractica;
    return fase === null || fase === undefined || Number(fase) === 2;
  });
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

const hasRequestedPracticalClasses = (clases = []) => {
  return (clases || []).some((clase) => {
    const estadoClase = String(clase?.estado || "").toUpperCase();

    return ["PROGRAMADA", "CONFIRMADA"].includes(estadoClase);
  });
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
  PREPARANDO_PRACTICO: {
    code: "PREPARANDO_PRACTICO",
    label: "Preparándose Examen Práctico",
  },
  PENDIENTE_EXAMEN_PRACTICO: {
    code: "PENDIENTE_EXAMEN_PRACTICO",
    label: "Pendiente Examen Práctico",
  },
  PRACTICO_SUSPENSO: {
    code: "PRACTICO_SUSPENSO",
    label: "Práctico Suspenso",
  },
  LICENCIA_OBTENIDA: {
    code: "LICENCIA_OBTENIDA",
    label: "Licencia Obtenida",
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
  const practicalClassesRequested = hasRequestedPracticalClasses(clases);

  if (matriculaNormalizada !== "PAGADA") {
    return EXPEDIENTE_PHASES.PENDIENTE_MATRICULA;
  }

  if (
    expedienteNormalizado === EXPEDIENTE_PHASES.LICENCIA_OBTENIDA.code ||
    hasFinalPracticalApto(solicitudesExamen)
  ) {
    return EXPEDIENTE_PHASES.LICENCIA_OBTENIDA;
  }

  if (FINAL_PRACTICAL_FAILURE_STATES.includes(practicalStatus)) {
    return EXPEDIENTE_PHASES.PRACTICO_SUSPENSO;
  }

  if (ACTIVE_REQUEST_STATES.includes(practicalStatus)) {
    return EXPEDIENTE_PHASES.PENDIENTE_EXAMEN_PRACTICO;
  }

  if (
    theoryStatus === "APTO" &&
    (practicalClassesRequested || completedRoadmaps > 0)
  ) {
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

  return EXPEDIENTE_PHASES.ESTUDIANDO_TEORICO;
};
