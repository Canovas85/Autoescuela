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

  async findPagosByInvoiceNumbers(numeros) {
    const values = (numeros || []).filter(Boolean);

    if (values.length === 0) {
      return [];
    }

    return this.prisma.pago.findMany({
      where: {
        numeroFacturaPago: {
          in: values,
        },
      },
      select: {
        numeroFacturaPago: true,
        permiso: true,
        estado: true,
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
