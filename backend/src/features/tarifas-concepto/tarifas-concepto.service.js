const PERMISOS_VALIDOS = ["A", "A1", "A2", "B", "C", "D", "E"];
const TIPOS_VALIDOS = ["FIJO", "VARIABLE", "POR_CLASE", "POR_EXAMEN"];

const normalizarTexto = (valor) =>
  typeof valor === "string" ? valor.trim() : "";

const parseBoolean = (valor, defaultValue = false) => {
  if (valor === undefined || valor === null || valor === "") {
    return defaultValue;
  }

  if (typeof valor === "boolean") {
    return valor;
  }

  const normalizado = String(valor).trim().toLowerCase();
  return ["true", "1", "on", "yes", "si", "sí"].includes(normalizado);
};

export class TarifasConceptoService {
  constructor(repository) {
    this.repository = repository;
  }

  validarPayload(data) {
    const permiso = String(data.permiso ?? "")
      .trim()
      .toUpperCase();

    if (!PERMISOS_VALIDOS.includes(permiso)) {
      throw new Error("Permiso no válido");
    }

    const concepto = normalizarTexto(data.concepto);

    if (!concepto) {
      throw new Error("El concepto es obligatorio");
    }

    const precio = Number(data.precio);

    if (Number.isNaN(precio) || precio <= 0) {
      throw new Error("El precio debe ser mayor que 0");
    }

    const tipo = String(data.tipo ?? "")
      .trim()
      .toUpperCase();

    if (!TIPOS_VALIDOS.includes(tipo)) {
      throw new Error("El tipo de precio no es válido");
    }

    return {
      permiso,
      concepto,
      precio,
      tipo,
      descripcion: normalizarTexto(data.descripcion) || null,
      activa: parseBoolean(data.activa, true),
    };
  }

  async create(data) {
    const payload = this.validarPayload(data);

    const existe = await this.repository.findByPermisoYConcepto(
      payload.permiso,
      payload.concepto,
    );

    if (existe) {
      throw new Error("Ya existe un concepto para ese permiso");
    }

    return this.repository.create(payload);
  }

  async getAll(filters = {}) {
    const permiso = filters.permiso
      ? String(filters.permiso).trim().toUpperCase()
      : undefined;

    const where = {};

    if (permiso) {
      where.permiso = permiso;
    }

    if (filters.activa !== undefined) {
      where.activa = parseBoolean(filters.activa, true);
    }

    return this.repository.findAll(where);
  }

  async getById(id) {
    const tarifa = await this.repository.findById(id);

    if (!tarifa) {
      throw new Error("Tarifa no encontrada");
    }

    return tarifa;
  }

  async update(id, data) {
    const tarifaActual = await this.repository.findById(id);

    if (!tarifaActual) {
      throw new Error("Tarifa no encontrada");
    }

    const payload = this.validarPayload({
      ...tarifaActual,
      ...data,
    });

    const existe = await this.repository.findByPermisoYConcepto(
      payload.permiso,
      payload.concepto,
    );

    if (existe && existe.id !== id) {
      throw new Error("Ya existe un concepto para ese permiso");
    }

    return this.repository.update(id, payload);
  }

  async delete(id) {
    const tarifa = await this.repository.findById(id);

    if (!tarifa) {
      throw new Error("Tarifa no encontrada");
    }

    return this.repository.delete(id);
  }

  async activate(id) {
    const tarifa = await this.repository.findById(id);

    if (!tarifa) {
      throw new Error("Tarifa no encontrada");
    }

    return this.repository.activate(id);
  }

  async deactivate(id) {
    const tarifa = await this.repository.findById(id);

    if (!tarifa) {
      throw new Error("Tarifa no encontrada");
    }

    return this.repository.deactivate(id);
  }
}
