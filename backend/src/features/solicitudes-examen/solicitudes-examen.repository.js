export class SolicitudesExamenRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async create(data) {
    return this.prisma.solicitudExamen.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.solicitudExamen.findMany({
      include: {
        alumno: {
          include: {
            usuario: true,
          },
        },
      },
      orderBy: [{ fechaSolicitud: "desc" }],
    });
  }

  async findById(id) {
    return this.prisma.solicitudExamen.findUnique({
      where: {
        id,
      },
      include: {
        alumno: {
          include: {
            usuario: true,
          },
        },
      },
    });
  }

  async update(id, data) {
    return this.prisma.solicitudExamen.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id) {
    return this.prisma.solicitudExamen.delete({
      where: {
        id,
      },
    });
  }
}
