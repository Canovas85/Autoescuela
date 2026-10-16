const DUAL_PRACTICAL_PHASE_LICENSES = new Set(["A", "A1", "A2", "C", "D", "E"]);

const normalizeLicense = (value) =>
  String(value || "")
    .trim()
    .toUpperCase();

export const isDualPracticalLicense = (license) =>
  DUAL_PRACTICAL_PHASE_LICENSES.has(normalizeLicense(license));

export const getPracticalExamTypeCode = ({ license, phase }) => {
  if (!isDualPracticalLicense(license)) {
    return "CIRCULACION";
  }

  return Number(phase) === 2 ? "PISTA" : "CIRCULACION";
};

export const getPracticalExamTypeLabel = ({ license, phase }) => {
  const code = getPracticalExamTypeCode({ license, phase });
  return code === "PISTA" ? "Pista (Circuito)" : "Circulacion";
};
