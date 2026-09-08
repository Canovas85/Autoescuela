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

const normalizarPermisos = (valor) => {
  const permisos = Array.isArray(valor)
    ? valor
    : valor === undefined || valor === null || valor === ""
      ? []
      : [valor];

  return [
    ...new Set(
      permisos
        .map((permiso) =>
          String(permiso || "")
            .trim()
            .toUpperCase(),
        )
        .filter(Boolean),
    ),
  ];
};

export class TarifasConceptoService {
  constructor(repository) {
    this.repository = repository;
  }

  validarPayload(data) {
    const permisos = normalizarPermisos(data.permiso);

    if (permisos.length === 0) {
      throw new Error("Debes seleccionar al menos un permiso");
    }

    const permisosInvalidos = permisos.filter(
      (permiso) => !PERMISOS_VALIDOS.includes(permiso),
    );

    if (permisosInvalidos.length > 0) {
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
      permisos,
      concepto,
      precio,
      tipo,
      descripcion: normalizarTexto(data.descripcion) || null,
      activa: parseBoolean(data.activa, true),
    };
  }

  async create(data) {
    const payload = this.validarPayload(data);

    for (const permiso of payload.permisos) {
      const existe = await this.repository.findByPermisoYConcepto(
        permiso,
        payload.concepto,
      );

      if (existe) {
        throw new Error(`Ya existe un concepto para el permiso ${permiso}`);
      }
    }

    const rows = payload.permisos.map((permiso) => ({
      permiso,
      concepto: payload.concepto,
      precio: payload.precio,
      tipo: payload.tipo,
      descripcion: payload.descripcion,
      activa: payload.activa,
    }));

    const creadas = await this.repository.createMany(rows);

    return creadas.length === 1 ? creadas[0] : creadas;
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
      permiso: data.permiso ?? tarifaActual.permiso,
    });

    if (payload.permisos.length !== 1) {
      throw new Error("La edición solo permite un permiso");
    }

    const permiso = payload.permisos[0];

    const existe = await this.repository.findByPermisoYConcepto(
      permiso,
      payload.concepto,
    );

    if (existe && existe.id !== id) {
      throw new Error(`Ya existe un concepto para el permiso ${permiso}`);
    }

    return this.repository.update(id, {
      permiso,
      concepto: payload.concepto,
      precio: payload.precio,
      tipo: payload.tipo,
      descripcion: payload.descripcion,
      activa: payload.activa,
    });
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
