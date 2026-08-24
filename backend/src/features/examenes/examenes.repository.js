export class ExamenesRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async create(data) {
    return this.prisma.examen.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.examen.findMany({
      include: {
        alumno: {
          include: {
            usuario: true,
          },
        },
      },
      orderBy: [{ fecha: "asc" }],
    });
  }

  async findById(id) {
    return this.prisma.examen.findUnique({
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
    return this.prisma.examen.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id) {
    return this.prisma.examen.delete({
      where: {
        id,
      },
    });
  }
}
