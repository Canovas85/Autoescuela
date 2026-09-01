export class ClasesDirectoRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findAll() {
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
}
