import { Chip } from "@mui/material";
import { getExpedientePhaseMeta } from "../../utils/expedientePhase";

export function ExpedientePhaseChip({ code, label, size = "small" }) {
  const meta = getExpedientePhaseMeta({ code, label });

  return <Chip size={size} label={meta.label} sx={meta.sx} />;
}
