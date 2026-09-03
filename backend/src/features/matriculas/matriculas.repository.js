export class MatriculasRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async create(data) {
    return this.prisma.matricula.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.matricula.findMany({
      include: {
        alumno: {
          include: {
            usuario: true,
          },
        },
        promocion: true,
      },
      orderBy: {
        fechaCreacion: "desc",
      },
    });
  }

  async findById(id) {
    return this.prisma.matricula.findUnique({
      where: {
        id,
      },
      include: {
        alumno: {
          include: {
            usuario: true,
          },
        },
        promocion: true,
      },
    });
  }

  async update(id, data) {
    return this.prisma.matricula.update({
      where: {
        id,
      },
      data,
    });
  }

  async pagar(id) {
    return this.prisma.matricula.update({
      where: {
        id,
      },
      data: {
        estado: "PAGADA",
        fechaPago: new Date(),
      },
    });
  }

  async anular(id) {
    return this.prisma.matricula.update({
      where: {
        id,
      },
      data: {
        estado: "ANULADA",
      },
    });
  }

  async findByAlumnoId(alumnoId) {
    return this.prisma.matricula.findFirst({
      where: {
        alumnoId,
      },
      orderBy: {
        fechaCreacion: "desc",
      },
    });
  }

  async findTarifaByLicencia(licencia) {
    return this.prisma.tarifaMatricula.findUnique({
      where: {
        licencia,
      },
    });
  }
}
