const LICENCIAS_PERMITIDAS = ["B", "A1", "A2", "A", "C", "D", "E"];

const normalizarTexto = (valor) =>
  typeof valor === "string" ? valor.trim() : "";

export class TemariosService {
  constructor(repository) {
    this.repository = repository;
  }

  validarPayload(data) {
    const titulo = normalizarTexto(data.titulo);

    if (!titulo) {
      throw new Error("El título es obligatorio");
    }

    const tipoLicenciaObjetivo = normalizarTexto(
      data.tipoLicenciaObjetivo,
    ).toUpperCase();

    if (!tipoLicenciaObjetivo) {
      throw new Error("El tipo de licencia objetivo es obligatorio");
    }

    if (!LICENCIAS_PERMITIDAS.includes(tipoLicenciaObjetivo)) {
      throw new Error("El tipo de licencia objetivo no es válido");
    }

    const orden = Number(data.orden);
    if (!Number.isInteger(orden) || orden < 0) {
      throw new Error("El orden debe ser un número entero igual o mayor que 0");
    }

    return {
      titulo,
      descripcion: normalizarTexto(data.descripcion) || null,
      tipoLicenciaObjetivo,
      orden,
    };
  }

  async create(data) {
    return this.repository.create(this.validarPayload(data));
  }

  async getAll() {
    return this.repository.findAll();
  }

  async getById(id) {
    const temario = await this.repository.findById(id);

    if (!temario) {
      throw new Error("Temario no encontrado");
    }

    return temario;
  }

  async update(id, data) {
    return this.repository.update(id, this.validarPayload(data));
  }

  async delete(id) {
    return this.repository.delete(id);
  }
}
