const normalizarLicencia = (valor) =>
  String(valor || "")
    .trim()
    .toUpperCase() || "B";

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

export class ConvocatoriasTeoricoService {
  constructor(repository) {
    this.repository = repository;
  }

  validarPayload(data, { partial = false } = {}) {
    const fecha = data.fecha ? parseDateOnly(data.fecha) : null;

    if (!partial && (!fecha || Number.isNaN(fecha.getTime()))) {
      throw new Error("La fecha es obligatoria y debe ser válida");
    }

    if (data.fecha !== undefined && Number.isNaN(fecha?.getTime?.())) {
      throw new Error("La fecha indicada no es válida");
    }

    const payload = {};

    if (data.fecha !== undefined) {
      payload.fecha = fecha;
    }

    if (!partial || data.licencia !== undefined) {
      payload.licencia = normalizarLicencia(data.licencia);
    }

    if (data.activo !== undefined) {
      payload.activo = Boolean(data.activo);
    }

    return payload;
  }

  async create(data) {
    const payload = this.validarPayload(data);
    return this.repository.create(payload);
  }

  async getAll() {
    return this.repository.findAll();
  }

  async update(id, data) {
    const payload = this.validarPayload(data, { partial: true });
    return this.repository.update(id, payload);
  }

  async delete(id) {
    return this.repository.softDelete(id);
  }
}
