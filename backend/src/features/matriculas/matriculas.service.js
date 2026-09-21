export class MatriculasService {
  constructor(repository, notificacionesRepository = null) {
    this.repository = repository;
    this.notificacionesRepository = notificacionesRepository;
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
    const matricula = await this.repository.pagar(id);

    if (!this.notificacionesRepository) {
      return matricula;
    }

    const detail = await this.repository.findById(matricula.id);

    await this.notificacionesRepository.createForRole("ADMIN", {
      tipo: "MATRICULA_PAGADA",
      titulo: "Matrícula pagada",
      mensaje: `Se ha registrado el pago de matrícula para ${detail?.alumno?.usuario?.nombre || "alumno"}`,
      metadata: {
        matriculaId: matricula.id,
        alumnoId: matricula.alumnoId,
        route: "/matricula",
      },
    });

    if (!detail?.alumno?.profesorAsignadoId) {
      await this.notificacionesRepository.createForRole("ADMIN", {
        tipo: "PROFESOR_PENDIENTE_ASIGNACION",
        titulo: "Profesor pendiente de asignar",
        mensaje: `La matrícula de ${detail?.alumno?.usuario?.nombre || "alumno"} está pagada y no tiene profesor asignado`,
        metadata: {
          alumnoId: matricula.alumnoId,
          matriculaId: matricula.id,
          route: "/alumnos",
        },
      });
    }

    return matricula;
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
