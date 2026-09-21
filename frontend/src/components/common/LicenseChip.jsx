import { Box, Chip } from "@mui/material";

const LICENSE_STYLES = {
  AM: { bg: "#f1f5f9", text: "#334155", border: "#cbd5e1" },
  A1: { bg: "#dbeafe", text: "#1e3a8a", border: "#93c5fd" },
  A2: { bg: "#cffafe", text: "#155e75", border: "#67e8f9" },
  A: { bg: "#e0e7ff", text: "#3730a3", border: "#a5b4fc" },
  B: { bg: "#dcfce7", text: "#166534", border: "#86efac" },
  C: { bg: "#fef3c7", text: "#92400e", border: "#fcd34d" },
  D: { bg: "#ffedd5", text: "#9a3412", border: "#fdba74" },
  E: { bg: "#ecfccb", text: "#365314", border: "#bef264" },
};

const getLicenseStyle = (value) => {
  const key = String(value || "").toUpperCase();
  return (
    LICENSE_STYLES[key] || {
      bg: "#e2e8f0",
      text: "#334155",
      border: "#cbd5e1",
    }
  );
};

export function LicenseChip({ value, size = "small" }) {
  const label = String(value || "-").toUpperCase();
  const style = getLicenseStyle(label);

  return (
    <Chip
      label={label}
      size={size}
      sx={{
        fontWeight: 700,
        backgroundColor: style.bg,
        color: style.text,
        border: `1px solid ${style.border}`,
      }}
    />
  );
}

export function LicenseChipList({ values }) {
  const list = Array.isArray(values)
    ? values.filter(Boolean)
    : values
      ? [values]
      : [];

  if (list.length === 0) {
    return "-";
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 0.5,
        alignItems: "center",
        minHeight: 30,
      }}
    >
      {list.map((item, index) => (
        <LicenseChip key={`${item}-${index}`} value={item} />
      ))}
    </Box>
  );
}
