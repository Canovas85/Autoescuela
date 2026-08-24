export class VehiculosRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async create(data) {
    return this.prisma.vehiculo.create({
      data,
    });
  }

  async findByMatricula(matricula) {
    return this.prisma.vehiculo.findFirst({
      where: {
        matricula,
      },
    });
  }

  async findAll() {
    return this.prisma.vehiculo.findMany();
  }

  async findById(id) {
    return this.prisma.vehiculo.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id, data) {
    return this.prisma.vehiculo.update({
      where: {
        id,
      },
      data,
    });
  }

  async deactivate(id) {
    return this.prisma.vehiculo.update({
      where: {
        id,
      },
      data: {
        activo: false,
      },
    });
  }

  async activate(id) {
    return this.prisma.vehiculo.update({
      where: {
        id,
      },
      data: {
        activo: true,
      },
    });
  }
}
