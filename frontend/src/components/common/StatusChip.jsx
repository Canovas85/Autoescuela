import { Chip } from "@mui/material";

import { getStatusChipPalette } from "../../theme/chipPalette";

export function StatusChip({ label, size = "small" }) {
  const finalLabel = String(label || "-");
  const palette = getStatusChipPalette(finalLabel);

  return (
    <Chip
      size={size}
      label={finalLabel}
      sx={{
        backgroundColor: palette.bg,
        color: palette.text,
        border: `1px solid ${palette.border}`,
        "& .MuiChip-label": {
          fontWeight: "medium",
        },
      }}
    />
  );
}
