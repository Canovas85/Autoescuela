import { Box, Chip } from "@mui/material";
import { getLicenseChipPalette } from "../../theme/chipPalette";

export function LicenseChip({ value, size = "small" }) {
  const label = String(value || "-").toUpperCase();
  const style = getLicenseChipPalette(label);

  const isSmall = size === "small";

  // Definimos dimensiones idénticas para garantizar un círculo perfecto
  const circleSize = isSmall ? "20px" : "34px";
  const finalFontSize = isSmall ? "0.65rem" : "0.85rem";

  return (
    <Chip
      label={label}
      sx={{
        fontWeight: 1200,
        backgroundColor: style.bg,
        color: style.text,
        border: `1px solid ${style.border}`,
        fontSize: finalFontSize,

        // Forzar forma de círculo perfecto del tamaño de la letra
        width: circleSize,
        height: circleSize,
        minWidth: circleSize,
        minHeight: circleSize,
        borderRadius: "50%",

        // Limpieza de estilos nativos de Material-UI
        "& .MuiChip-label": {
          paddingLeft: 0,
          paddingRight: 0,
          width: "100%",
          textAlign: "center",
          display: "block",
        },
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
