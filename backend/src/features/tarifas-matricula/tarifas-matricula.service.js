const LICENCIAS_VALIDAS = ["B", "A1", "A2", "A", "C", "D", "E"];

export class TarifasMatriculaService {
  constructor(repository) {
    this.repository = repository;
  }

  validarPayload(data) {
    const licencia = String(data.licencia || "")
      .trim()
      .toUpperCase();

    if (!LICENCIAS_VALIDAS.includes(licencia)) {
      throw new Error("Licencia no válida");
    }

    const precio = Number(data.precio);

    if (Number.isNaN(precio) || precio <= 0) {
      throw new Error("El precio debe ser mayor que 0");
    }

    return {
      licencia,
      precio,
      activa: data.activa === undefined ? true : Boolean(data.activa),
    };
  }

  async create(data) {
    const existing = await this.repository.findByLicencia(data.licencia);

    if (existing) {
      throw new Error("Ya existe una tarifa para esa licencia");
    }

    return this.repository.create(this.validarPayload(data));
  }

  async getAll() {
    return this.repository.findAll();
  }

  async getById(id) {
    const tarifa = await this.repository.findById(id);

    if (!tarifa) {
      throw new Error("Tarifa no encontrada");
    }

    return tarifa;
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
