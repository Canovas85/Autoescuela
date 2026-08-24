export class BonosRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async create(data) {
    return this.prisma.bono.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.bono.findMany({
      orderBy: [{ activo: "desc" }, { nombre: "asc" }],
    });
  }

  async findById(id) {
    return this.prisma.bono.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id, data) {
    return this.prisma.bono.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id) {
    return this.prisma.bono.delete({
      where: {
        id,
      },
    });
  }

  async activate(id) {
    return this.prisma.bono.update({
      where: {
        id,
      },
      data: {
        activo: true,
      },
    });
  }

  async deactivate(id) {
    return this.prisma.bono.update({
      where: {
        id,
      },
      data: {
        activo: false,
      },
    });
  }
}
