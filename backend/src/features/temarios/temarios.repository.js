export class TemariosRepository {
  constructor(prisma) {
    this.prisma = prisma;
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
