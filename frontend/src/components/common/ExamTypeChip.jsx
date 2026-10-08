import { Chip } from "@mui/material";

const EXAM_TYPE_LABELS = {
  TEORICO: "Teórico",
  PRACTICO: "Práctico",
};

export function ExamTypeChip({ value, size = "small" }) {
  const key = String(value || "").toUpperCase();
  const label = EXAM_TYPE_LABELS[key] || key || "-";

  return (
    <Chip
      size={size}
      label={label}
      sx={{
        fontWeight: 700,
        backgroundColor: key === "PRACTICO" ? "#ffedd5" : "#dbeafe", // Fondo: Naranja claro / Azul claro
        color: key === "PRACTICO" ? "#c2410c" : "#1e40af", // Texto: Naranja oscuro / Azul oscuro
        border: key === "PRACTICO" ? "2px solid #fed7aa" : "2px solid #93c5fd", // Borde: Naranja / Azul
      }}
    />
  );
}
