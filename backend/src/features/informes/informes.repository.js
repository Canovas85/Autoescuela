export class InformesRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findFacturasBetween(startDate, endDate) {
    return this.prisma.factura.findMany({
      where: {
        fechaEmision: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        alumno: {
          include: {
            usuario: {
              select: {
                nombre: true,
              },
            },
          },
        },
        matricula: true,
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

  async findPagosBetween(startDate, endDate) {
    return this.prisma.pago.findMany({
      where: {
        fechaCreacion: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        alumno: {
          include: {
            usuario: {
              select: {
                nombre: true,
              },
            },
          },
        },
      },
      orderBy: {
        fechaCreacion: "desc",
      },
    });
  }

  async findGastosCombustibleBetween(startDate, endDate) {
    return this.prisma.gastoCombustible.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        profesor: {
          include: {
            usuario: {
              select: {
                nombre: true,
              },
            },
          },
        },
        vehiculo: {
          select: {
            matricula: true,
            marca: true,
            modelo: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
