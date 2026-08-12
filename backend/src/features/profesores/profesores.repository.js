export class ProfesoresRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async create(data) {
    return this.prisma.profesor.create({
      data,
    });
  }
  async findByEmail(email) {
    return this.prisma.profesor.findFirst({
      where: {
        email,
      },
    });
  }
  async findAll() {
    return this.prisma.profesor.findMany();
  }

  async findById(id) {
    return this.prisma.profesor.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id, data) {
    return this.prisma.profesor.update({
      where: {
        id,
      },
      data,
    });
  }

  async deactivate(id) {
    return this.prisma.profesor.update({
      where: {
        id,
      },
      data: {
        activo: false,
      },
    });
  }

  async deactivateById(id) {
    return this.prisma.profesor.update({
      where: {
        id,
      },
      data: {
        activo: false,
      },
    });
  }
}
