const DEFAULT_THEORETICAL_RULE = {
  totalPreguntas: 30,
  maxFallos: 3,
  duracionMinutos: 30,
};

const THEORETICAL_RULES_BY_LICENSE = {
  B: DEFAULT_THEORETICAL_RULE,
  A1: {
    totalPreguntas: 20,
    maxFallos: 2,
    duracionMinutos: 20,
  },
  A2: {
    totalPreguntas: 20,
    maxFallos: 2,
    duracionMinutos: 20,
  },
  A: {
    totalPreguntas: 20,
    maxFallos: 2,
    duracionMinutos: 20,
  },
  C: {
    totalPreguntas: 20,
    maxFallos: 2,
    duracionMinutos: 20,
  },
  D: {
    totalPreguntas: 20,
    maxFallos: 2,
    duracionMinutos: 20,
  },
  E: {
    totalPreguntas: 20,
    maxFallos: 2,
    duracionMinutos: 20,
  },
};

const DUAL_PRACTICAL_PHASE_LICENSES = new Set(["A", "A1", "A2", "C", "D", "E"]);

const PRACTICAL_CLASS_TYPES_BY_LICENSE = {
  B: ["CIRCULACION"],
  A1: ["CIRCULACION", "PISTA"],
  A2: ["CIRCULACION", "PISTA"],
  A: ["CIRCULACION", "PISTA"],
  C: ["CIRCULACION", "PISTA"],
  D: ["CIRCULACION", "PISTA"],
  E: ["CIRCULACION", "PISTA"],
};

export const normalizeLicenseCode = (value) =>
  String(value || "")
    .trim()
    .toUpperCase() || "B";

export const getTheoreticalRuleByLicense = (license) => {
  const normalized = normalizeLicenseCode(license);
  return THEORETICAL_RULES_BY_LICENSE[normalized] || DEFAULT_THEORETICAL_RULE;
};

export const usesDualPracticalPhaseByLicense = (license) => {
  const normalized = normalizeLicenseCode(license);
  return DUAL_PRACTICAL_PHASE_LICENSES.has(normalized);
};

export const getPracticalPhaseLabel = (phase) => {
  if (Number(phase) === 1) {
    return "CIRCULACION_VIA_PUBLICA";
  }

  if (Number(phase) === 2) {
    return "MANIOBRAS_CIRCUITO";
  }

  return "CIRCULACION";
};

export const getAllowedPracticalClassTypesByLicense = (license) => {
  const normalized = normalizeLicenseCode(license);
  return PRACTICAL_CLASS_TYPES_BY_LICENSE[normalized] || ["CIRCULACION"];
};

export const getRequiredPracticalClassTypeForPhase = ({
  license,
  practicalPhase,
}) => {
  const normalized = normalizeLicenseCode(license);

  if (!usesDualPracticalPhaseByLicense(normalized)) {
    return "CIRCULACION";
  }

  return Number(practicalPhase) === 2 ? "PISTA" : "CIRCULACION";
};
