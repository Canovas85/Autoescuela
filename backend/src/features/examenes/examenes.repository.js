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
    return this.prisma.examen.findMany();
  }
  async findById(id) {
    return this.prisma.examen.findUnique({
      where: {
        id,
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
}
