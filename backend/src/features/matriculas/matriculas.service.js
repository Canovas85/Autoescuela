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

  async pagar(user, id) {
    const actorRole = String(user?.rol || "").toUpperCase();
    const actorId = user?.id;

    if (!actorId) {
      throw new Error("Usuario no autenticado");
    }

    const matriculaExistente = await this.repository.findById(id);

    if (!matriculaExistente) {
      throw new Error("Matrícula no encontrada");
    }

    const isAdmin = actorRole === "ADMIN";
    const isOwnerStudent =
      actorRole === "ALUMNO" && matriculaExistente.alumnoId === actorId;

    if (!isAdmin && !isOwnerStudent) {
      throw new Error("No tienes permisos para pagar esta matrícula");
    }

    const matricula = await this.repository.pagar(id);

    if (!this.notificacionesRepository) {
      return matricula;
    }

    const detail = await this.repository.findById(matricula.id);
    const facturaMatricula = (detail?.facturas || []).find(
      (factura) => String(factura?.estado || "").toUpperCase() === "PAGADA",
    );

    if (actorRole === "ALUMNO") {
      await this.notificacionesRepository.create({
        usuarioId: actorId,
        tipo: "FACTURA_GENERADA",
        titulo: "Factura generada",
        mensaje: `Factura ${facturaMatricula?.numero || "de matrícula"} disponible en Mis Facturas`,
        metadata: {
          matriculaId: matricula.id,
          alumnoId: matricula.alumnoId,
          facturaId: facturaMatricula?.id || null,
          numeroFactura: facturaMatricula?.numero || null,
          route: "/facturas",
        },
      });
    }

    await this.notificacionesRepository.createForRole("ADMIN", {
      tipo: "MATRICULA_PAGADA",
      titulo: "Matrícula pagada",
      mensaje: `Se ha registrado el pago de matrícula para ${detail?.alumno?.usuario?.nombre || "alumno"}`,
      metadata: {
        matriculaId: matricula.id,
        alumnoId: matricula.alumnoId,
        facturaId: facturaMatricula?.id || null,
        numeroFactura: facturaMatricula?.numero || null,
        route: "/facturas",
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
