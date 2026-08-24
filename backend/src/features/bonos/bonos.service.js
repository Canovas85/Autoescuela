const normalizarTexto = (valor) =>
  typeof valor === "string" ? valor.trim() : "";

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

    return {
      nombre,
      descripcion: normalizarTexto(data.descripcion) || null,
      clasesIncluidas,
      validezDias,
      activo: data.activo === undefined ? true : Boolean(data.activo),
    };
  }

  async create(data) {
    return this.repository.create(this.validarPayload(data));
  }

  async getAll() {
    return this.repository.findAll();
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
}
