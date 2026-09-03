export class FacturasService {
  constructor(repository) {
    this.repository = repository;
  }

  async getAll() {
    return this.repository.findAll();
  }

  async getMine(alumnoId) {
    return this.repository.findByAlumnoId(alumnoId);
  }
}
