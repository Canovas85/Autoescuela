export class PromocionesRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async create(data) {
    return this.prisma.promocion.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.promocion.findMany({
      orderBy: [{ activa: "desc" }, { nombre: "asc" }],
    });
  }

  async findById(id) {
    return this.prisma.promocion.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id, data) {
    return this.prisma.promocion.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id) {
    return this.prisma.promocion.delete({
      where: {
        id,
      },
    });
  }

  async activate(id) {
    return this.prisma.promocion.update({
      where: {
        id,
      },
      data: {
        activa: true,
      },
    });
  }

  async deactivate(id) {
    return this.prisma.promocion.update({
      where: {
        id,
      },
      data: {
        activa: false,
      },
    });
  }

  async findPublic() {
    return this.prisma.promocion.findMany({
      where: {
        activa: true,
      },
      orderBy: [{ createdAt: "desc" }],
    });
  }
}
