const TIPOS_EXAMEN_VALIDOS = ["TEORICO", "PRACTICO"];

const normalizarLicencia = (valor) =>
  String(valor || "")
    .trim()
    .toUpperCase() || "B";

const normalizarTipoExamen = (valor) =>
  String(valor || "")
    .trim()
    .toUpperCase();

const parseDateOnly = (value) => {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      return null;
    }

    const year = value.getUTCFullYear();
    const month = value.getUTCMonth();
    const day = value.getUTCDate();

    return new Date(Date.UTC(year, month, day, 12, 0, 0, 0));
  }

  if (typeof value === "string") {
    const [datePart] = value.split("T");
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(datePart || "");

    if (!match) {
      return null;
    }

    const year = Number(match[1]);
    const month = Number(match[2]) - 1;
    const day = Number(match[3]);

    return new Date(Date.UTC(year, month, day, 12, 0, 0, 0));
  }

  return null;
};

const inicioFinDiaUtc = (fecha) => {
  const year = fecha.getUTCFullYear();
  const month = fecha.getUTCMonth();
  const day = fecha.getUTCDate();

  return {
    inicio: new Date(Date.UTC(year, month, day, 0, 0, 0, 0)),
    fin: new Date(Date.UTC(year, month, day, 23, 59, 59, 999)),
  };
};

export class ConvocatoriasExamenService {
  constructor(repository) {
    this.repository = repository;
  }

  validarPayload(data, { partial = false } = {}) {
    const fecha = data.fecha ? parseDateOnly(data.fecha) : null;

    if (!partial && (!fecha || Number.isNaN(fecha.getTime()))) {
      throw new Error("La fecha es obligatoria y debe ser valida");
    }

    if (data.fecha !== undefined && Number.isNaN(fecha?.getTime?.())) {
      throw new Error("La fecha indicada no es valida");
    }

    const payload = {};

    if (data.fecha !== undefined) {
      payload.fecha = fecha;
    }

    if (!partial || data.licencia !== undefined) {
      payload.licencia = normalizarLicencia(data.licencia);
    }

    if (!partial || data.tipoExamen !== undefined) {
      const tipoExamen = normalizarTipoExamen(data.tipoExamen);

      if (!TIPOS_EXAMEN_VALIDOS.includes(tipoExamen)) {
        throw new Error("El tipo de examen debe ser TEORICO o PRACTICO");
      }

      payload.tipoExamen = tipoExamen;
    }

    if (data.activo !== undefined) {
      payload.activo = Boolean(data.activo);
    }

    return payload;
  }

  async validarDuplicado(payload, excludeId = null) {
    if (!payload.fecha || !payload.licencia || !payload.tipoExamen) {
      return;
    }

    const { inicio, fin } = inicioFinDiaUtc(payload.fecha);

    const duplicada = await this.repository.findDuplicate({
      fechaInicio: inicio,
      fechaFin: fin,
      licencia: payload.licencia,
      tipoExamen: payload.tipoExamen,
      excludeId,
    });

    if (duplicada) {
      const iso = duplicada.fecha.toISOString().slice(0, 10);
      throw new Error(
        `Ya existe una convocatoria ${duplicada.tipoExamen} para la licencia ${duplicada.licencia} en la fecha ${iso}. No es posible duplicarla.`,
      );
    }
  }

  async create(data) {
    const payload = this.validarPayload(data);
    await this.validarDuplicado(payload);
    return this.repository.create(payload);
  }

  async getAll(filters = {}) {
    const parsed = {};

    if (filters.tipoExamen) {
      const tipoExamen = normalizarTipoExamen(filters.tipoExamen);

      if (!TIPOS_EXAMEN_VALIDOS.includes(tipoExamen)) {
        throw new Error("El tipo de examen debe ser TEORICO o PRACTICO");
      }

      parsed.tipoExamen = tipoExamen;
    }

    if (filters.licencia) {
      parsed.licencia = normalizarLicencia(filters.licencia);
    }

    if (filters.activo !== undefined) {
      if (typeof filters.activo === "boolean") {
        parsed.activo = filters.activo;
      } else {
        parsed.activo = String(filters.activo).toLowerCase() === "true";
      }
    }

    return this.repository.findAll(parsed);
  }

  async update(id, data) {
    const current = await this.repository.findById(id);

    if (!current) {
      throw new Error("Convocatoria no encontrada");
    }

    const payload = this.validarPayload(data, { partial: true });

    const merged = {
      fecha: payload.fecha ?? current.fecha,
      licencia: payload.licencia ?? current.licencia,
      tipoExamen: payload.tipoExamen ?? current.tipoExamen,
    };

    await this.validarDuplicado(merged, id);

    return this.repository.update(id, payload);
  }

  async delete(id) {
    return this.repository.softDelete(id);
  }

  async getAgenda(filters = {}) {
    const year = Number(filters.year);
    const month = Number(filters.month);

    if (!Number.isInteger(year) || year < 2000 || year > 2100) {
      throw new Error("El year de agenda no es valido");
    }

    if (!Number.isInteger(month) || month < 1 || month > 12) {
      throw new Error("El month de agenda no es valido");
    }

    const monthStart = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
    const monthEnd = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

    const tipoExamen = filters.tipoExamen
      ? normalizarTipoExamen(filters.tipoExamen)
      : undefined;

    if (tipoExamen && !TIPOS_EXAMEN_VALIDOS.includes(tipoExamen)) {
      throw new Error("El tipo de examen debe ser TEORICO o PRACTICO");
    }

    const licencia = filters.licencia
      ? normalizarLicencia(filters.licencia)
      : undefined;

    const convocatorias = await this.repository.findAgendaWithConfirmedStudents(
      {
        tipoExamen,
        licencia,
        monthStart,
        monthEnd,
      },
    );

    return {
      year,
      month,
      convocatorias,
    };
  }
}
