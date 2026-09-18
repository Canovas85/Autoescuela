export const PRECIO_LITRO_COMBUSTIBLE = 1.83;
export const TITULAR_TARJETA_AUTOESCUELA = "Autoescuela Eguzkilore";
export const NUMERO_TARJETA_AUTOESCUELA = "5102 1234 4321 5015";

const CAPACIDAD_LITROS_BY_PERMISO = {
  A: 25,
  A1: 25,
  A2: 25,
  B: 60,
  C: 200,
  D: 200,
};

const round2 = (value) =>
  Math.round((Number(value) + Number.EPSILON) * 100) / 100;

export const getCapacidadCombustibleByPermiso = (permiso) => {
  const key = String(permiso || "")
    .trim()
    .toUpperCase();

  return CAPACIDAD_LITROS_BY_PERMISO[key] ?? null;
};

export const calculateRepostajeToFull = ({
  combustibleActualPct,
  tipoPermiso,
}) => {
  const pct = Number(combustibleActualPct);
  const capacidadLitros = getCapacidadCombustibleByPermiso(tipoPermiso);

  if (!Number.isFinite(pct) || pct < 0 || pct > 100) {
    throw new Error("El combustible actual del vehículo no es válido");
  }

  if (!capacidadLitros) {
    throw new Error(
      "El permiso del vehículo no tiene capacidad de combustible configurada",
    );
  }

  const litrosActuales = (capacidadLitros * pct) / 100;
  const litrosARepostar = Math.max(0, capacidadLitros - litrosActuales);
  const total = litrosARepostar * PRECIO_LITRO_COMBUSTIBLE;

  return {
    capacidadLitros,
    litrosActuales: round2(litrosActuales),
    litrosARepostar: round2(litrosARepostar),
    precioLitro: round2(PRECIO_LITRO_COMBUSTIBLE),
    total: round2(total),
  };
};
