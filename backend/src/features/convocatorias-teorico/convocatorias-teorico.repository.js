export class ConvocatoriasTeoricoRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async create(data) {
    return this.prisma.convocatoriaTeorico.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.convocatoriaTeorico.findMany({
      orderBy: {
        fecha: "asc",
      },
    });
  }

  async update(id, data) {
    return this.prisma.convocatoriaTeorico.update({
      where: { id },
      data,
    });
  }

  async softDelete(id) {
    return this.prisma.convocatoriaTeorico.update({
      where: { id },
      data: {
        activo: false,
      },
    });
  }
}
