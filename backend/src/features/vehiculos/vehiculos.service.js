export class VehiculosService {
  constructor(repository) {
    this.repository = repository;
  }

  async create(data) {
    if (!data.matricula) {
      throw new Error("La matrícula es obligatoria");
    }

    const existingVehicle = await this.repository.findByMatricula(
      data.matricula,
    );

    if (existingVehicle) {
      throw new Error("La matrícula ya existe");
    }

    if (!data.tipoPermiso) {
      throw new Error("El tipo de permiso es obligatorio");
    }

    return this.repository.create({
      ...data,
      activo: true,
    });
  }
  async getAll() {
    return this.repository.findAll();
  }

  async getById(id) {
    return this.repository.findById(id);
  }

  async update(id, data) {
    return this.repository.update(id, data);
  }

  async deactivate(id) {
    return this.repository.deactivate(id);
  }
}
