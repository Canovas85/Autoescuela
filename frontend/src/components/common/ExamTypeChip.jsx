import { Chip } from "@mui/material";
import { getExamTypeChipPalette } from "../../theme/chipPalette";

const EXAM_TYPE_LABELS = {
  TEORICO: "Teórico",
  PRACTICO: "Práctico",
};

export function ExamTypeChip({ value, size = "small" }) {
  const key = String(value || "").toUpperCase();
  const label = EXAM_TYPE_LABELS[key] || key || "-";
  const palette = getExamTypeChipPalette(key);

  return (
    <Chip
      size={size}
      label={label}
      sx={{
        fontWeight: 700,
        backgroundColor: palette.bg,
        color: palette.text,
        border: `2px solid ${palette.border}`,
      }}
    />
  );
}
