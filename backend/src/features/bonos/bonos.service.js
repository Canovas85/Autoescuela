const normalizarTexto = (valor) =>
  typeof valor === "string" ? valor.trim() : "";

const LICENCIAS_VALIDAS = ["B", "A1", "A2", "A", "C", "D", "E"];

const normalizarLicencia = (valor) =>
  String(valor || "")
    .trim()
    .toUpperCase();

export class BonosService {
  constructor(repository) {
    this.repository = repository;
  }

  validarPayload(data) {
    const nombre = normalizarTexto(data.nombre);

    if (!nombre) {
      throw new Error("El nombre es obligatorio");
    }

    const clasesIncluidas = Number(data.clasesIncluidas);
    if (!Number.isInteger(clasesIncluidas) || clasesIncluidas <= 0) {
      throw new Error(
        "Las clases incluidas deben ser un número entero mayor que 0",
      );
    }

    const validezDias = Number(data.validezDias);
    if (!Number.isInteger(validezDias) || validezDias <= 0) {
      throw new Error("La validez debe ser un número entero mayor que 0");
    }

    const precio = Number(data.precio);
    if (!Number.isFinite(precio) || precio <= 0) {
      throw new Error("El precio debe ser un número mayor que 0");
    }

    const precioNormalizado = Number(precio.toFixed(2));

    let licencia = null;

    if (
      data.licencia !== undefined &&
      data.licencia !== null &&
      String(data.licencia).trim() !== ""
    ) {
      licencia = normalizarLicencia(data.licencia);

      if (!LICENCIAS_VALIDAS.includes(licencia)) {
        throw new Error("La licencia del bono no es válida");
      }
    }

    return {
      nombre,
      descripcion: normalizarTexto(data.descripcion) || null,
      ...(licencia ? { licencia } : {}),
      clasesIncluidas,
      precio: precioNormalizado,
      validezDias,
      activo: data.activo === undefined ? true : Boolean(data.activo),
    };
  }

  async create(data) {
    return this.repository.create(this.validarPayload(data));
  }

  async getAll(filters = {}) {
    const licencia = filters.licencia
      ? normalizarLicencia(filters.licencia)
      : undefined;

    if (licencia && !LICENCIAS_VALIDAS.includes(licencia)) {
      throw new Error("La licencia del filtro no es válida");
    }

    return this.repository.findAll({
      licencia,
    });
  }

  async getActivos(alumnoId) {
    if (typeof this.repository.findAlumnoById !== "function") {
      return this.repository.findActivos();
    }

    const alumno = await this.repository.findAlumnoById(alumnoId);

    if (!alumno) {
      throw new Error("Alumno no encontrado");
    }

    const licenciaNormalizada = normalizarLicencia(alumno.tipoLicenciaObjetivo);

    if (!LICENCIAS_VALIDAS.includes(licenciaNormalizada)) {
      throw new Error("La licencia del alumno no es válida");
    }

    return this.repository.findActivos(licenciaNormalizada);
  }

  async getById(id) {
    const bono = await this.repository.findById(id);

    if (!bono) {
      throw new Error("Bono no encontrado");
    }

    return bono;
  }

  async update(id, data) {
    return this.repository.update(id, this.validarPayload(data));
  }

  async delete(id) {
    return this.repository.delete(id);
  }

  async activate(id) {
    return this.repository.activate(id);
  }

  async deactivate(id) {
    return this.repository.deactivate(id);
  }

  async createCompraPendiente(alumnoId, bonoId) {
    const alumno = await this.repository.findAlumnoById(alumnoId);

    if (!alumno) {
      throw new Error("Alumno no encontrado");
    }

    const bono = await this.repository.findActivoById(bonoId);

    if (!bono) {
      throw new Error("Bono no disponible para compra");
    }

    const licenciaAlumno = normalizarLicencia(alumno.tipoLicenciaObjetivo);
    const licenciaBono = normalizarLicencia(bono.licencia || licenciaAlumno);

    if (licenciaAlumno !== licenciaBono) {
      throw new Error(
        "El bono seleccionado no corresponde a la licencia que está cursando el alumno",
      );
    }

    return this.repository.createCompraPendiente({
      alumno,
      bono,
    });
  }
}
