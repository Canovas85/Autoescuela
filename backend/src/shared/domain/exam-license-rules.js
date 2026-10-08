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
};

const DUAL_PRACTICAL_PHASE_LICENSES = new Set(["A1", "A2", "C", "D"]);

const PRACTICAL_CLASS_TYPES_BY_LICENSE = {
  B: ["CIRCULACION"],
  A1: ["PISTA", "CIRCULACION"],
  A2: ["PISTA", "CIRCULACION"],
  C: ["PISTA", "CIRCULACION"],
  D: ["PISTA", "CIRCULACION"],
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
    return "MANIOBRAS_PISTA";
  }

  if (Number(phase) === 2) {
    return "CIRCULACION_VIA_PUBLICA";
  }

  return "CIRCULACION";
};

export const getAllowedPracticalClassTypesByLicense = (license) => {
  const normalized = normalizeLicenseCode(license);
  return PRACTICAL_CLASS_TYPES_BY_LICENSE[normalized] || ["CIRCULACION"];
};
