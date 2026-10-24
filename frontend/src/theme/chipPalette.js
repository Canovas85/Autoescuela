export const LICENSE_CHIP_PALETTE = {
  AM: { bg: "#f1f5f9", text: "#334155", border: "#cbd5e1" },
  A1: { bg: "#dbeafe", text: "#1e3a8a", border: "#93c5fd" },
  A2: { bg: "#cffafe", text: "#155e75", border: "#67e8f9" },
  A: { bg: "#e0e7ff", text: "#3730a3", border: "#a5b4fc" },
  B: { bg: "#dcfce7", text: "#166534", border: "#86efac" },
  C: { bg: "#fef3c7", text: "#92400e", border: "#fcd34d" },
  D: { bg: "#ffedd5", text: "#9a3412", border: "#fdba74" },
  E: { bg: "#ecfccb", text: "#365314", border: "#bef264" },
};

export const DEFAULT_LICENSE_CHIP = {
  bg: "#e2e8f0",
  text: "#334155",
  border: "#cbd5e1",
};

export const EXAM_TYPE_CHIP_PALETTE = {
  PRACTICO: { bg: "#ffedd5", text: "#c2410c", border: "#fed7aa" },
  TEORICO: { bg: "#dbeafe", text: "#1e40af", border: "#93c5fd" },
};

export const STATUS_CHIP_PALETTE = {
  ACTIVO: { bg: "#e8f5e9", text: "#2e7d32", border: "#4caf50" },
  ACTIVA: { bg: "#e8f5e9", text: "#2e7d32", border: "#4caf50" },
  INACTIVO: { bg: "#ffebee", text: "#c62828", border: "#ef5350" },
  INACTIVA: { bg: "#ffebee", text: "#c62828", border: "#ef5350" },
  VIGENTE: { bg: "#fff8e1", text: "#8d6e00", border: "#fdd835" },
  PENDIENTE: { bg: "#fff3e0", text: "#ef6c00", border: "#ffb74d" },
  APTO: { bg: "#ecfdf5", text: "#065f46", border: "#34d399" },
  NO_APTO: { bg: "#fef2f2", text: "#991b1b", border: "#f87171" },
  SOLICITADO: { bg: "#e0f2fe", text: "#0369a1", border: "#0284c7" },
};

export const DEFAULT_STATUS_CHIP = {
  bg: "#eceff1",
  text: "#455a64",
  border: "#b0bec5",
};

export const getLicenseChipPalette = (value) => {
  const key = String(value || "")
    .trim()
    .toUpperCase();
  return LICENSE_CHIP_PALETTE[key] || DEFAULT_LICENSE_CHIP;
};

export const getExamTypeChipPalette = (value) => {
  const key = String(value || "")
    .trim()
    .toUpperCase();
  return EXAM_TYPE_CHIP_PALETTE[key] || EXAM_TYPE_CHIP_PALETTE.TEORICO;
};

export const getStatusChipPalette = (value) => {
  const key = String(value || "")
    .trim()
    .toUpperCase();
  return STATUS_CHIP_PALETTE[key] || DEFAULT_STATUS_CHIP;
};
