import { Chip } from "@mui/material";

const TYPE_STYLES = {
  CIRCULACION: {
    label: "Circulacion",
    bg: "#dbeafe",
    text: "#1e3a8a",
    border: "#93c5fd",
  },
  PISTA: {
    label: "Pista (Circuito)",
    bg: "#ffedd5",
    text: "#9a3412",
    border: "#fdba74",
  },
};

const getTypeStyle = (value) => {
  const key = String(value || "")
    .trim()
    .toUpperCase();

  return (
    TYPE_STYLES[key] || {
      label: key || "-",
      bg: "#f1f5f9",
      text: "#334155",
      border: "#cbd5e1",
    }
  );
};

export function PracticalClassTypeChip({ value, size = "small", sx = {} }) {
  const style = getTypeStyle(value);

  return (
    <Chip
      label={style.label}
      size={size}
      sx={{
        fontWeight: 700,
        backgroundColor: style.bg,
        color: style.text,
        border: `1px solid ${style.border}`,
        ...sx,
      }}
    />
  );
}
