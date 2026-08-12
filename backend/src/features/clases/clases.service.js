export class ClasesService {
  constructor(repository) {
    this.repository = repository;
  }

  async create(data) {
    if (!data.alumnoId) {
      throw new Error("El alumno es obligatorio");
    }

    if (!data.profesorId) {
      throw new Error("El profesor es obligatorio");
    }

    if (!data.vehiculoId) {
      throw new Error("El vehículo es obligatorio");
    }

    if (!data.fecha) {
      throw new Error("La fecha es obligatoria");
    }

    if (!data.duracion) {
      throw new Error("La duración es obligatoria");
    }

    const existingClass = await this.repository.findByProfesorAndFecha(
      data.profesorId,
      data.fecha,
    );

    if (existingClass) {
      throw new Error(
        "El profesor ya tiene una clase programada en esa fecha y hora",
      );
    }

    const existingVehicleClass = await this.repository.findByVehiculoAndFecha(
      data.vehiculoId,
      data.fecha,
    );

    if (existingVehicleClass) {
      throw new Error(
        "El vehículo ya está asignado a otra clase en esa fecha y hora",
      );
    }

    const existingStudentClass = await this.repository.findByAlumnoAndFecha(
      data.alumnoId,
      data.fecha,
    );

    if (existingStudentClass) {
      throw new Error(
        "El alumno ya tiene una clase programada en esa fecha y hora",
      );
    }

    return this.repository.create({
      ...data,
      estado: "PROGRAMADA",
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

  async cancel(id) {
    return this.repository.cancel(id);
  }
}
