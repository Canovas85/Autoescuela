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

  async findVehiculoById(vehiculoId) {
    return this.prisma.vehiculo.findUnique({
      where: {
        id: vehiculoId,
      },
    });
  }

  async findLatestItvExpenseByVehiculoId(vehiculoId) {
    return this.prisma.gastoCombustible.findFirst({
      where: {
        vehiculoId,
        tipoGasto: "REVISION_ITV",
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async countCompletedClassesByVehiculoSince(vehiculoId, fromDate, now) {
    return this.prisma.clasePractica.count({
      where: {
        vehiculoId,
        fecha: {
          gte: fromDate,
        },
        estado: {
          not: {
            startsWith: "CANCELADA",
          },
        },
        OR: [
          {
            estado: {
              in: ["REALIZADA", "COMPLETADA", "FINALIZADA", "REGISTRADA"],
            },
          },
          {
            hojaRuta: {
              is: {
                estado: "REGISTRADA",
              },
            },
          },
          {
            fecha: {
              lt: now,
            },
          },
        ],
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
          tipoGasto: "COMBUSTIBLE",
          concepto: "Repostaje combustible",
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

  async createItvExpenseAndInvoice(payload) {
    const {
      profesorId,
      vehiculoId,
      numeroFactura,
      concepto,
      total,
      kilometrosVehiculo,
      fechaRevision,
    } = payload;

    return this.prisma.$transaction(async (tx) => {
      const gasto = await tx.gastoCombustible.create({
        data: {
          profesorId,
          vehiculoId,
          tipoGasto: "REVISION_ITV",
          concepto,
          numeroFactura,
          titularTarjeta: "Autoescuela Eguzkilore",
          numeroTarjeta: "5102 1234 4321 5015",
          combustibleAntesPct: 0,
          combustibleDespuesPct: 0,
          litrosRepostados: 0,
          precioLitro: 0,
          total,
          kilometrosVehiculo,
          rutaRecibo: null,
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

      const factura = await tx.factura.create({
        data: {
          numero: numeroFactura,
          alumnoId: null,
          concepto,
          baseImponible: total,
          descuento: 0,
          total,
          estado: "PAGADA",
          fechaPago: fechaRevision,
        },
      });

      await tx.vehiculo.update({
        where: {
          id: vehiculoId,
        },
        data: {
          fechaUltimaItv: fechaRevision,
        },
      });

      return {
        gasto,
        factura,
      };
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
