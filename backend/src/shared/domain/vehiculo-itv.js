export const ITV_BLOCK_MESSAGE =
  "Este vehículo tiene la revisión ITV pendiente. Debes registrar el pago de la revisión ITV antes de poder agendar o ejecutar clases prácticas con este vehículo.";

const ITV_PRICE_BY_LICENSE = {
  A: 30,
  A1: 30,
  A2: 30,
  B: 45,
  C: 75,
  D: 85,
  E: 75,
};

export const getItvPriceByPermiso = (permiso) => {
  const key = String(permiso || "")
    .trim()
    .toUpperCase();

  return ITV_PRICE_BY_LICENSE[key] ?? ITV_PRICE_BY_LICENSE.B;
};

export const isClassCancelled = (estado) =>
  String(estado || "")
    .toUpperCase()
    .startsWith("CANCELADA");

export const isCompletedClass = (clase, now = new Date()) => {
  const estadoClase = String(clase?.estado || "").toUpperCase();
  const estadoHoja = String(clase?.hojaRuta?.estado || "").toUpperCase();
  const fechaClase = new Date(clase?.fecha);

  if (isClassCancelled(estadoClase)) {
    return false;
  }

  if (
    ["REALIZADA", "COMPLETADA", "FINALIZADA", "REGISTRADA"].includes(
      estadoClase,
    ) ||
    estadoHoja === "REGISTRADA"
  ) {
    return true;
  }

  if (Number.isNaN(fechaClase.getTime())) {
    return false;
  }

  return fechaClase < now;
};

const addMonths = (baseDate, months) => {
  const next = new Date(baseDate);
  next.setMonth(next.getMonth() + months);
  return next;
};

export const evaluateVehicleItvStatus = ({
  vehiculo,
  referenceDate,
  kmBase,
  completedClassesSinceReference,
  now = new Date(),
}) => {
  const validReferenceDate =
    referenceDate instanceof Date && !Number.isNaN(referenceDate.getTime())
      ? referenceDate
      : new Date(vehiculo?.createdAt || now);

  const safeKmBase = Number.isFinite(Number(kmBase)) ? Number(kmBase) : 0;
  const currentKm = Number.isFinite(Number(vehiculo?.kmActuales))
    ? Number(vehiculo.kmActuales)
    : 0;
  const kmRecorridos = Math.max(currentKm - safeKmBase, 0);

  const classesDone = Number.isFinite(Number(completedClassesSinceReference))
    ? Number(completedClassesSinceReference)
    : 0;

  const limiteTresMeses = addMonths(validReferenceDate, 3);
  const superaTresMeses = now >= limiteTresMeses;

  const motivos = [];

  if (kmRecorridos >= 1000) {
    motivos.push("KILOMETRAJE");
  }

  if (classesDone > 25) {
    motivos.push("CLASES");
  }

  if (superaTresMeses) {
    motivos.push("TIEMPO");
  }

  return {
    pendiente: motivos.length > 0,
    motivos,
    kmRecorridosDesdeUltimaRevision: kmRecorridos,
    clasesEfectuadasDesdeUltimaRevision: classesDone,
    fechaReferenciaRevision: validReferenceDate,
    fechaLimiteRevision: limiteTresMeses,
  };
};
