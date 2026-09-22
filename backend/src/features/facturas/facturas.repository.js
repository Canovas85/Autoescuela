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
        compraBono: {
          include: {
            bono: true,
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
        compraBono: {
          include: {
            bono: true,
          },
        },
      },
      orderBy: {
        fechaEmision: "desc",
      },
    });
  }

  async findById(id) {
    return this.prisma.factura.findUnique({
      where: { id },
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
        compraBono: {
          include: {
            bono: true,
          },
        },
        clasePractica: {
          include: {
            vehiculo: true,
          },
        },
      },
    });
  }

  async findByIdAndAlumnoId(id, alumnoId) {
    return this.prisma.factura.findFirst({
      where: {
        id,
        alumnoId,
      },
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
        compraBono: {
          include: {
            bono: true,
          },
        },
        clasePractica: {
          include: {
            vehiculo: true,
          },
        },
      },
    });
  }
}
