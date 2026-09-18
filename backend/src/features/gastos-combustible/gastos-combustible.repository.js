export class GastosCombustibleRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findProfesorById(profesorId) {
    return this.prisma.profesor.findUnique({
      where: {
        id: profesorId,
      },
      select: {
        id: true,
        permisosLicencias: true,
        usuario: {
          select: {
            nombre: true,
            email: true,
          },
        },
      },
    });
  }

  async findVehiculoCompatible(profesorLicencias, vehiculoId) {
    if (!Array.isArray(profesorLicencias) || profesorLicencias.length === 0) {
      return null;
    }

    return this.prisma.vehiculo.findFirst({
      where: {
        id: vehiculoId,
        activo: true,
        tipoPermiso: {
          in: profesorLicencias,
        },
      },
    });
  }

  async createGastoAndRefuelVehiculo(payload) {
    const {
      profesorId,
      vehiculoId,
      numeroFactura,
      titularTarjeta,
      numeroTarjeta,
      combustibleAntesPct,
      litrosRepostados,
      precioLitro,
      total,
      kilometrosVehiculo,
      rutaRecibo,
    } = payload;

    return this.prisma.$transaction(async (tx) => {
      const gasto = await tx.gastoCombustible.create({
        data: {
          profesorId,
          vehiculoId,
          numeroFactura,
          titularTarjeta,
          numeroTarjeta,
          combustibleAntesPct,
          combustibleDespuesPct: 100,
          litrosRepostados,
          precioLitro,
          total,
          kilometrosVehiculo,
          rutaRecibo,
        },
        include: {
          profesor: {
            include: {
              usuario: {
                select: {
                  nombre: true,
                  email: true,
                },
              },
            },
          },
          vehiculo: true,
        },
      });

      await tx.vehiculo.update({
        where: {
          id: vehiculoId,
        },
        data: {
          combustibleActualPct: 100,
        },
      });

      return gasto;
    });
  }

  async findAll() {
    return this.prisma.gastoCombustible.findMany({
      include: {
        profesor: {
          include: {
            usuario: {
              select: {
                nombre: true,
                email: true,
              },
            },
          },
        },
        vehiculo: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findMine(profesorId) {
    return this.prisma.gastoCombustible.findMany({
      where: {
        profesorId,
      },
      include: {
        profesor: {
          include: {
            usuario: {
              select: {
                nombre: true,
                email: true,
              },
            },
          },
        },
        vehiculo: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
