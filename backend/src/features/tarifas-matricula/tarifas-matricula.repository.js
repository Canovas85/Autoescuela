export class TarifasMatriculaRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async create(data) {
    return this.prisma.tarifaMatricula.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.tarifaMatricula.findMany({
      orderBy: [{ activa: "desc" }, { licencia: "asc" }],
    });
  }

  async findById(id) {
    return this.prisma.tarifaMatricula.findUnique({
      where: {
        id,
      },
    });
  }

  async findByLicencia(licencia) {
    return this.prisma.tarifaMatricula.findUnique({
      where: {
        licencia,
      },
    });
  }

  async update(id, data) {
    return this.prisma.tarifaMatricula.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id) {
    return this.prisma.tarifaMatricula.delete({
      where: {
        id,
      },
    });
  }

  async activate(id) {
    return this.prisma.tarifaMatricula.update({
      where: {
        id,
      },
      data: {
        activa: true,
      },
    });
  }

  async deactivate(id) {
    return this.prisma.tarifaMatricula.update({
      where: {
        id,
      },
      data: {
        activa: false,
      },
    });
  }
}
