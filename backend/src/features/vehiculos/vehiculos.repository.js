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

  async findProfesorById(id) {
    return this.prisma.profesor.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });
  }

  async findAll() {
    return this.prisma.vehiculo.findMany({
      include: {
        clases: {
          select: {
            id: true,
            fecha: true,
            estado: true,
            hojaRuta: {
              select: {
                estado: true,
              },
            },
          },
        },
        gastosCombustible: {
          where: {
            tipoGasto: "REVISION_ITV",
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          select: {
            id: true,
            createdAt: true,
            kilometrosVehiculo: true,
            total: true,
            numeroFactura: true,
          },
        },
      },
      orderBy: {
        matricula: "asc",
      },
    });
  }

  async findById(id) {
    return this.prisma.vehiculo.findUnique({
      where: {
        id,
      },
      include: {
        clases: {
          select: {
            id: true,
            fecha: true,
            estado: true,
            hojaRuta: {
              select: {
                estado: true,
              },
            },
          },
        },
        gastosCombustible: {
          where: {
            tipoGasto: "REVISION_ITV",
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          select: {
            id: true,
            createdAt: true,
            kilometrosVehiculo: true,
            total: true,
            numeroFactura: true,
          },
        },
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

  async createItvExpenseAndInvoice(payload) {
    const {
      vehiculoId,
      profesorId,
      numeroFactura,
      concepto,
      total,
      kilometrosVehiculo,
      fechaRevision,
    } = payload;

    return this.prisma.$transaction(async (tx) => {
      const gasto = await tx.gastoCombustible.create({
        data: {
          numeroFactura,
          profesorId,
          vehiculoId,
          tipoGasto: "REVISION_ITV",
          concepto,
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

      const vehiculo = await tx.vehiculo.update({
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
        vehiculo,
      };
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

  async findActiveCompatibleVehiclesByPermiso(permiso, excludeVehiculoId) {
    return this.prisma.vehiculo.findMany({
      where: {
        id: {
          not: excludeVehiculoId,
        },
        activo: true,
        tipoPermiso: permiso,
      },
      orderBy: {
        matricula: "asc",
      },
    });
  }

  async findFutureOrCurrentClassesByVehiculo(vehiculoId, now) {
    return this.prisma.clasePractica.findMany({
      where: {
        vehiculoId,
        estado: {
          in: ["PROGRAMADA", "CONFIRMADA"],
        },
        OR: [
          {
            fecha: {
              gte: now,
            },
          },
          {
            hojaRuta: {
              is: {
                estado: "EN_CURSO",
              },
            },
          },
        ],
      },
      include: {
        vehiculo: true,
        alumno: {
          include: {
            usuario: {
              select: {
                nombre: true,
              },
            },
          },
        },
        hojaRuta: true,
      },
      orderBy: {
        fecha: "asc",
      },
    });
  }

  async findVehiculosByIds(ids) {
    return this.prisma.vehiculo.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async deactivateWithReassignments({ vehiculoId, assignments }) {
    return this.prisma.$transaction(async (tx) => {
      for (const assignment of assignments) {
        await tx.clasePractica.update({
          where: {
            id: assignment.claseId,
          },
          data: {
            vehiculoId: assignment.nuevoVehiculoId,
          },
        });

        if (
          Number.isInteger(assignment.kmActualesNuevoVehiculo) &&
          Number.isInteger(assignment.combustibleActualPctNuevoVehiculo)
        ) {
          await tx.vehiculo.update({
            where: {
              id: assignment.nuevoVehiculoId,
            },
            data: {
              kmActuales: assignment.kmActualesNuevoVehiculo,
              combustibleActualPct:
                assignment.combustibleActualPctNuevoVehiculo,
            },
          });

          await tx.hojaRuta.updateMany({
            where: {
              clasePracticaId: assignment.claseId,
            },
            data: {
              kilometrosInicio: assignment.kmActualesNuevoVehiculo,
              kilometrosFin: assignment.kmActualesNuevoVehiculo,
              combustibleInicioPct:
                assignment.combustibleActualPctNuevoVehiculo,
              combustibleFinPct: assignment.combustibleActualPctNuevoVehiculo,
            },
          });
        }
      }

      return tx.vehiculo.update({
        where: {
          id: vehiculoId,
        },
        data: {
          activo: false,
        },
      });
    });
  }
}
