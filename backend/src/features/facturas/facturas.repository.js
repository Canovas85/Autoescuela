export class FacturasRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findAll() {
    return this.prisma.factura.findMany({
      include: {
        alumno: {
          include: {
            usuario: true,
          },
        },
        matricula: {
          include: {
            promocion: true,
          },
        },
      },
      orderBy: {
        fechaEmision: "desc",
      },
    });
  }

  async findByAlumnoId(alumnoId) {
    return this.prisma.factura.findMany({
      where: {
        alumnoId,
      },
      include: {
        matricula: {
          include: {
            promocion: true,
          },
        },
      },
      orderBy: {
        fechaEmision: "desc",
      },
    });
  }
}
