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
  PREPARANDO_PRACTICO: {
    label: "Preparándose para examen práctico",
    sx: {
      backgroundColor: "#ede9fe",
      color: "#5b21b6",
      border: "1px solid #c4b5fd",
    },
  },
  PENDIENTE_EXAMEN_PRACTICO: {
    label: "Pendiente de examen práctico",
    sx: {
      backgroundColor: "#fef3c7",
      color: "#92400e",
      border: "1px solid #fcd34d",
    },
  },
  PRACTICO_SUSPENSO: {
    label: "Práctico suspenso",
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

const LEGACY_CODE_BY_LABEL = {
  "en formación": "PENDIENTE_MATRICULA",
  "pendiente matrícula": "PENDIENTE_MATRICULA",
  "estudiando teórico": "ESTUDIANDO_TEORICO",
  "estudiando teorico": "ESTUDIANDO_TEORICO",
  "pendiente de examen teórico": "PENDIENTE_EXAMEN_TEORICO",
  "teórico suspenso": "TEORICO_SUSPENSO",
  "teorico suspenso": "TEORICO_SUSPENSO",
  "teórico aprobado": "TEORICO_APROBADO",
  "teorico aprobado": "TEORICO_APROBADO",
  "preparándose para el práctico": "PREPARANDO_PRACTICO",
  "preparandose para el practico": "PREPARANDO_PRACTICO",
  "pendiente de examen práctico": "PENDIENTE_EXAMEN_PRACTICO",
  "pendiente de examen practico": "PENDIENTE_EXAMEN_PRACTICO",
  "práctico suspenso": "PRACTICO_SUSPENSO",
  "practico suspenso": "PRACTICO_SUSPENSO",
  "licencia obtenida": "LICENCIA_OBTENIDA",
  "licencia aprobada": "LICENCIA_OBTENIDA",
  "preparándose para examen práctico": "PREPARANDO_PRACTICO",
  "preparandose para examen practico": "PREPARANDO_PRACTICO",
};

const normalizeCode = (value) =>
  String(value || "")
    .trim()
    .toUpperCase();

export const resolveExpedientePhaseCode = ({ code, label }) => {
  const normalizedCode = normalizeCode(code);

  if (EXPEDIENTE_PHASE_META[normalizedCode]) {
    return normalizedCode;
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
