export class MatriculasService {
  constructor(repository) {
    this.repository = repository;
  }

  async create(data) {
    return this.repository.create(data);
  }

  async getAll() {
    return this.repository.findAll();
  }

  async getById(id) {
    const matricula = await this.repository.findById(id);

    if (!matricula) {
      throw new Error("Matrícula no encontrada");
    }

    return matricula;
  }

  async update(id, data) {
    return this.repository.update(id, data);
  }

  async pagar(id) {
    return this.repository.pagar(id);
  }

  async anular(id) {
    return this.repository.anular(id);
  }

  async getMine(userId) {
    const matricula = await this.repository.findByAlumnoId(userId);

    if (!matricula) {
      throw new Error("No existe una matrícula asociada al alumno");
    }

    return matricula;
  }
}
