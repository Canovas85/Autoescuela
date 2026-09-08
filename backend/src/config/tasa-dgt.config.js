const LICENCIAS = ["A", "A1", "A2", "B", "C", "D", "E"];

const toNumberOrDefault = (value, fallback) => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const buildReglasRenovacion = () => {
  const defaultDias = toNumberOrDefault(
    process.env.RENOVACION_DIAS_ESPERA_DEFAULT,
    0,
  );
  const defaultClases = toNumberOrDefault(
    process.env.RENOVACION_CLASES_OBLIGATORIAS_DEFAULT,
    0,
  );

  const reglas = {
    default: {
      diasEspera: defaultDias,
      clasesPracticasObligatorias: defaultClases,
    },
  };

  for (const licencia of LICENCIAS) {
    const envKeyDias = `RENOVACION_DIAS_ESPERA_${licencia}`;
    const envKeyClases = `RENOVACION_CLASES_OBLIGATORIAS_${licencia}`;

    reglas[licencia] = {
      diasEspera: toNumberOrDefault(process.env[envKeyDias], defaultDias),
      clasesPracticasObligatorias: toNumberOrDefault(
        process.env[envKeyClases],
        defaultClases,
      ),
    };
  }

  return reglas;
};

export const tasaDgtConfig = {
  conceptoPattern:
    process.env.TASA_DGT_CONCEPTO_PATTERN || "Tasa DGT (Tasa 2.1)",
  maxSuspensosIncluidos: toNumberOrDefault(
    process.env.TASA_DGT_MAX_SUSPENSOS,
    2,
  ),
  importeDefault: toNumberOrDefault(
    process.env.TASA_DGT_IMPORTE_DEFAULT,
    94.05,
  ),
  reglasRenovacion: buildReglasRenovacion(),
};
