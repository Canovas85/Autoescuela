export class ClasesDirectoRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findAll() {
    return this.prisma.claseDirecto.findMany({
      include: {
        profesor: {
          include: {
            usuario: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findAllActive() {
    return this.prisma.claseDirecto.findMany({
      where: {
        activa: true,
      },
      include: {
        profesor: {
          include: {
            usuario: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(id) {
    return this.prisma.claseDirecto.findUnique({
      where: {
        id,
      },
      include: {
        profesor: {
          include: {
            usuario: true,
          },
        },
      },
    });
  }
  async create(data) {
    return this.prisma.claseDirecto.create({
      data,
    });
  }

  async update(id, data) {
    return this.prisma.claseDirecto.update({
      where: {
        id,
      },
      data,
    });
  }

  async deactivate(id) {
    return this.prisma.claseDirecto.update({
      where: {
        id,
      },
      data: {
        activa: false,
      },
    });
  }

  async activate(id) {
    return this.prisma.claseDirecto.update({
      where: {
        id,
      },
      data: {
        activa: true,
      },
    });
  }
}
