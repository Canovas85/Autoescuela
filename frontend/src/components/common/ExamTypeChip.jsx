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
      color={key === "PRACTICO" ? "secondary" : "primary"}
      sx={{ fontWeight: 700 }}
    />
  );
}
