export class TemariosRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findAlumnoById(alumnoId) {
    return this.prisma.alumno.findUnique({
      where: {
        id: alumnoId,
      },
      select: {
        id: true,
        tipoLicenciaObjetivo: true,
      },
    });
  }

  async create(data) {
    return this.prisma.temario.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.temario.findMany({
      orderBy: [{ tipoLicenciaObjetivo: "asc" }, { orden: "asc" }],
    });
  }

  async findById(id) {
    return this.prisma.temario.findUnique({
      where: {
        id,
      },
    });
  }

  async findForAlumnoByLicencia(alumnoId, tipoLicenciaObjetivo) {
    return this.prisma.temario.findMany({
      where: {
        tipoLicenciaObjetivo,
      },
      orderBy: [{ orden: "asc" }],
      include: {
        progreso: {
          where: {
            alumnoId,
          },
          select: {
            revisado: true,
            dominio: true,
            ultimaRevision: true,
          },
        },
      },
    });
  }

  async findTemaForAlumno(alumnoId, temarioId, tipoLicenciaObjetivo) {
    return this.prisma.temario.findFirst({
      where: {
        id: temarioId,
        tipoLicenciaObjetivo,
      },
      include: {
        progreso: {
          where: {
            alumnoId,
          },
          select: {
            revisado: true,
            dominio: true,
            ultimaRevision: true,
          },
        },
      },
    });
  }

  async saveMiniTestResultado({ alumnoId, temarioId, dominio }) {
    const progresoExistente = await this.prisma.temarioProgreso.findFirst({
      where: {
        alumnoId,
        temarioId,
      },
      orderBy: {
        ultimaRevision: "desc",
      },
    });

    const data = {
      revisado: true,
      dominio,
      ultimaRevision: new Date(),
    };

    if (progresoExistente) {
      return this.prisma.temarioProgreso.update({
        where: {
          id: progresoExistente.id,
        },
        data,
      });
    }

    return this.prisma.temarioProgreso.create({
      data: {
        alumnoId,
        temarioId,
        ...data,
      },
    });
  }

  async createMiniTestIntento({
    alumnoId,
    temarioId,
    aciertos,
    totalPreguntas,
    porcentaje,
  }) {
    const resultado = porcentaje >= 80 ? "APROBADO" : "SUSPENDIDO";

    return this.prisma.testPractica.create({
      data: {
        alumnoId,
        temarioId,
        resultado,
        respuestasCorrectas: aciertos,
        totalPreguntas,
      },
    });
  }

  async getMiniTestHistorial(alumnoId, temarioId, limit = 10) {
    return this.prisma.testPractica.findMany({
      where: {
        alumnoId,
        temarioId,
      },
      orderBy: {
        fecha: "desc",
      },
      take: limit,
      select: {
        id: true,
        fecha: true,
        resultado: true,
        respuestasCorrectas: true,
        totalPreguntas: true,
      },
    });
  }

  async update(id, data) {
    return this.prisma.temario.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id) {
    return this.prisma.temario.delete({
      where: {
        id,
      },
    });
  }
}
