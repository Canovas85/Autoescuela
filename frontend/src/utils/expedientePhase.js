const EXPEDIENTE_PHASE_META = {
  PENDIENTE_MATRICULA: {
    label: "Pendiente matrícula",
    sx: {
      backgroundColor: "#FFDF20",
      color: "#991b1b",
      border: "1px solid #fca5a5",
    },
  },
  ESTUDIANDO_TEORICO: {
    label: "Estudiando teórico",
    sx: {
      backgroundColor: "#fef9c3",
      color: "#854d0e",
      border: "1px solid #facc15",
    },
  },
  PENDIENTE_EXAMEN_TEORICO: {
    label: "Pendiente de examen teórico",
    sx: {
      backgroundColor: "#ffedd5",
      color: "#9a3412",
      border: "1px solid #fdba74",
    },
  },
  TEORICO_SUSPENSO: {
    label: "Teórico suspenso",
    sx: {
      backgroundColor: "#fef2f2",
      color: "#b91c1c",
      border: "1px solid #fca5a5",
    },
  },
  TEORICO_APROBADO: {
    label: "Teórico aprobado",
    sx: {
      backgroundColor: "#e0f2fe",
      color: "#0c4a6e",
      border: "1px solid #7dd3fc",
    },
  },
  REALIZANDO_CLASES_PRACTICAS_CIRCULACION: {
    label: "Realizando clases prácticas circulación",
    sx: {
      backgroundColor: "#ede9fe",
      color: "#5b21b6",
      border: "1px solid #c4b5fd",
    },
  },
  PENDIENTE_EXAMEN_PRACTICO_CIRCULACION: {
    label: "Pendiente examen práctico circulación",
    sx: {
      backgroundColor: "#fef3c7",
      color: "#92400e",
      border: "1px solid #fcd34d",
    },
  },
  PRACTICO_CIRCULACION_SUSPENSO: {
    label: "Práctico circulación suspenso",
    sx: {
      backgroundColor: "#fee2e2",
      color: "#991b1b",
      border: "1px solid #fca5a5",
    },
  },
  PRACTICO_CIRCULACION_APROBADO: {
    label: "Práctico circulación aprobado",
    sx: {
      backgroundColor: "#dbeafe",
      color: "#1e3a8a",
      border: "1px solid #93c5fd",
    },
  },
  REALIZANDO_CLASES_PRACTICAS_PISTA: {
    label: "Realizando clases prácticas en pista",
    sx: {
      backgroundColor: "#ede9fe",
      color: "#5b21b6",
      border: "1px solid #c4b5fd",
    },
  },
  PENDIENTE_EXAMEN_PRACTICO_PISTA: {
    label: "Pendiente examen práctico en pista",
    sx: {
      backgroundColor: "#fef3c7",
      color: "#92400e",
      border: "1px solid #fcd34d",
    },
  },
  PRACTICO_PISTA_SUSPENSO: {
    label: "Práctico pista suspenso",
    sx: {
      backgroundColor: "#fee2e2",
      color: "#991b1b",
      border: "1px solid #fca5a5",
    },
  },
  LICENCIA_OBTENIDA: {
    label: "Licencia obtenida",
    sx: {
      backgroundColor: "#dcfce7",
      color: "#166534",
      border: "1px solid #86efac",
    },
  },
};

const LEGACY_CODE_ALIASES = {
  PREPARANDO_PRACTICO: "REALIZANDO_CLASES_PRACTICAS_CIRCULACION",
  PENDIENTE_EXAMEN_PRACTICO: "PENDIENTE_EXAMEN_PRACTICO_CIRCULACION",
  PRACTICO_SUSPENSO: "PRACTICO_CIRCULACION_SUSPENSO",
  PRACTICO_CIRCUITO_SUSPENSO: "PRACTICO_PISTA_SUSPENSO",
};

const LEGACY_CODE_BY_LABEL = {
  "en formación": "PENDIENTE_MATRICULA",
  "en formacion": "PENDIENTE_MATRICULA",
  "pendiente matrícula": "PENDIENTE_MATRICULA",
  "pendiente matricula": "PENDIENTE_MATRICULA",
  "estudiando teórico": "ESTUDIANDO_TEORICO",
  "estudiando teorico": "ESTUDIANDO_TEORICO",
  "pendiente examen teórico": "PENDIENTE_EXAMEN_TEORICO",
  "pendiente examen teorico": "PENDIENTE_EXAMEN_TEORICO",
  "pendiente de examen teórico": "PENDIENTE_EXAMEN_TEORICO",
  "pendiente de examen teorico": "PENDIENTE_EXAMEN_TEORICO",
  "teórico suspenso": "TEORICO_SUSPENSO",
  "teorico suspenso": "TEORICO_SUSPENSO",
  "teórico aprobado": "TEORICO_APROBADO",
  "teorico aprobado": "TEORICO_APROBADO",
  "preparándose para el práctico": "REALIZANDO_CLASES_PRACTICAS_CIRCULACION",
  "preparandose para el practico": "REALIZANDO_CLASES_PRACTICAS_CIRCULACION",
  "realizando clases prácticas": "REALIZANDO_CLASES_PRACTICAS_CIRCULACION",
  "realizando clases practicas": "REALIZANDO_CLASES_PRACTICAS_CIRCULACION",
  "realizando clases prácticas circulación":
    "REALIZANDO_CLASES_PRACTICAS_CIRCULACION",
  "realizando clases practicas circulacion":
    "REALIZANDO_CLASES_PRACTICAS_CIRCULACION",
  "pendiente examen práctico": "PENDIENTE_EXAMEN_PRACTICO_CIRCULACION",
  "pendiente examen practico": "PENDIENTE_EXAMEN_PRACTICO_CIRCULACION",
  "pendiente de examen práctico": "PENDIENTE_EXAMEN_PRACTICO_CIRCULACION",
  "pendiente de examen practico": "PENDIENTE_EXAMEN_PRACTICO_CIRCULACION",
  "pendiente examen práctico circulación":
    "PENDIENTE_EXAMEN_PRACTICO_CIRCULACION",
  "pendiente examen practico circulacion":
    "PENDIENTE_EXAMEN_PRACTICO_CIRCULACION",
  "práctico suspenso": "PRACTICO_CIRCULACION_SUSPENSO",
  "practico suspenso": "PRACTICO_CIRCULACION_SUSPENSO",
  "práctico circulación aprobado": "PRACTICO_CIRCULACION_APROBADO",
  "practico circulacion aprobado": "PRACTICO_CIRCULACION_APROBADO",
  "práctico circulación suspenso": "PRACTICO_CIRCULACION_SUSPENSO",
  "practico circulacion suspenso": "PRACTICO_CIRCULACION_SUSPENSO",
  "realizando clases prácticas en pista": "REALIZANDO_CLASES_PRACTICAS_PISTA",
  "realizando clases practicas en pista": "REALIZANDO_CLASES_PRACTICAS_PISTA",
  "pendiente examen práctico en pista": "PENDIENTE_EXAMEN_PRACTICO_PISTA",
  "pendiente examen practico en pista": "PENDIENTE_EXAMEN_PRACTICO_PISTA",
  "práctico pista suspenso": "PRACTICO_PISTA_SUSPENSO",
  "practico pista suspenso": "PRACTICO_PISTA_SUSPENSO",
  "práctico circuito suspenso": "PRACTICO_PISTA_SUSPENSO",
  "practico circuito suspenso": "PRACTICO_PISTA_SUSPENSO",
  "licencia obtenida": "LICENCIA_OBTENIDA",
  "licencia aprobada": "LICENCIA_OBTENIDA",
  "preparándose para examen práctico":
    "REALIZANDO_CLASES_PRACTICAS_CIRCULACION",
  "preparandose para examen practico":
    "REALIZANDO_CLASES_PRACTICAS_CIRCULACION",
};

const normalizeCode = (value) =>
  String(value || "")
    .trim()
    .toUpperCase();

export const resolveExpedientePhaseCode = ({ code, label }) => {
  const normalizedCode = normalizeCode(code);
  const mappedLegacyCode =
    LEGACY_CODE_ALIASES[normalizedCode] || normalizedCode;

  if (EXPEDIENTE_PHASE_META[mappedLegacyCode]) {
    return mappedLegacyCode;
  }

  const normalizedLabel = String(label || "")
    .trim()
    .toLowerCase();

  if (LEGACY_CODE_BY_LABEL[normalizedLabel]) {
    return LEGACY_CODE_BY_LABEL[normalizedLabel];
  }

  return "ESTUDIANDO_TEORICO";
};

export const getExpedientePhaseMeta = ({ code, label } = {}) => {
  const resolvedCode = resolveExpedientePhaseCode({ code, label });
  const fallback = EXPEDIENTE_PHASE_META.ESTUDIANDO_TEORICO;
  const meta = EXPEDIENTE_PHASE_META[resolvedCode] || fallback;

  return {
    code: resolvedCode,
    label: meta.label,
    sx: meta.sx,
  };
};

export const EXPEDIENTE_PHASE_OPTIONS = Object.keys(EXPEDIENTE_PHASE_META).map(
  (code) => ({
    code,
    label: EXPEDIENTE_PHASE_META[code].label,
  }),
);
