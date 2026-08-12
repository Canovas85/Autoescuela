export class ExamenesService {
  constructor(repository) {
    this.repository = repository;
  }

  async create(data) {
    if (!data.alumnoId) {
      throw new Error("El alumno es obligatorio");
    }

    if (!data.tipo) {
      throw new Error("El tipo de examen es obligatorio");
    }

    if (!data.fecha) {
      throw new Error("La fecha del examen es obligatoria");
    }

    return this.repository.create({
      ...data,
      estado: "PROGRAMADO",
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

  async registerResult(id, estado) {
    const validResults = ["APROBADO", "SUSPENDIDO"];

    if (!validResults.includes(estado)) {
      throw new Error("El resultado debe ser APROBADO o SUSPENDIDO");
    }

    return this.repository.update(id, {
      estado,
    });
  }
}
