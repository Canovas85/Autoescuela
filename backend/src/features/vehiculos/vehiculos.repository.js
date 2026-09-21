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
