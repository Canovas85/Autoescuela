export class NominasRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findAll({ profesorNombre = "", mes = null, anio = null } = {}) {
    const where = {
      ...(Number.isInteger(mes) ? { mes } : {}),
      ...(Number.isInteger(anio) ? { anio } : {}),
      ...(profesorNombre
        ? {
            profesor: {
              usuario: {
                nombre: {
                  contains: profesorNombre,
                  mode: "insensitive",
                },
              },
            },
          }
        : {}),
    };

    return this.prisma.nomina.findMany({
      where,
      include: {
        profesor: {
          include: {
            usuario: {
              select: {
                id: true,
                nombre: true,
                dni: true,
              },
            },
          },
        },
      },
      orderBy: [{ anio: "desc" }, { mes: "desc" }, { numero: "desc" }],
    });
  }

  async findMine(profesorId, { mes = null, anio = null } = {}) {
    const where = {
      profesorId,
      ...(Number.isInteger(mes) ? { mes } : {}),
      ...(Number.isInteger(anio) ? { anio } : {}),
    };

    return this.prisma.nomina.findMany({
      where,
      include: {
        profesor: {
          include: {
            usuario: {
              select: {
                id: true,
                nombre: true,
                dni: true,
              },
            },
          },
        },
      },
      orderBy: [{ anio: "desc" }, { mes: "desc" }, { numero: "desc" }],
    });
  }

  async findById(nominaId) {
    return this.prisma.nomina.findUnique({
      where: {
        id: nominaId,
      },
      include: {
        profesor: {
          include: {
            usuario: {
              select: {
                id: true,
                nombre: true,
                dni: true,
                telefono: true,
              },
            },
          },
        },
      },
    });
  }

  async findByIdAndProfesor(nominaId, profesorId) {
    return this.prisma.nomina.findFirst({
      where: {
        id: nominaId,
        profesorId,
      },
      include: {
        profesor: {
          include: {
            usuario: {
              select: {
                id: true,
                nombre: true,
                dni: true,
                telefono: true,
              },
            },
          },
        },
      },
    });
  }

  async findExistingByProfessorAndMonth(profesorId, anio, mes) {
    return this.prisma.nomina.findUnique({
      where: {
        profesorId_anio_mes: {
          profesorId,
          anio,
          mes,
        },
      },
    });
  }

  async findLastNumberForMonth(prefix) {
    return this.prisma.nomina.findFirst({
      where: {
        numero: {
          startsWith: prefix,
        },
      },
      orderBy: {
        numero: "desc",
      },
      select: {
        numero: true,
      },
    });
  }

  async create(data) {
    return this.prisma.nomina.create({
      data,
      include: {
        profesor: {
          include: {
            usuario: {
              select: {
                id: true,
                nombre: true,
                dni: true,
              },
            },
          },
        },
      },
    });
  }

  async findPayrollEligibleProfessors(periodStart, periodEnd) {
    return this.prisma.profesor.findMany({
      where: {
        fechaAlta: {
          lte: periodEnd,
        },
        OR: [
          {
            fechaBaja: null,
          },
          {
            fechaBaja: {
              gte: periodStart,
            },
          },
        ],
      },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            dni: true,
            activo: true,
            fechaCreacion: true,
          },
        },
      },
      orderBy: {
        usuario: {
          nombre: "asc",
        },
      },
    });
  }

  async countResolvedPracticalByProfessor(profesorId, startDate, endDate) {
    const rows = await this.findResolvedPracticalCallsBetween(
      startDate,
      endDate,
    );
    const counters = {
      aptos: 0,
      noAptos: 0,
      total: 0,
    };
    const cache = new Map();

    for (const row of rows) {
      const referenceDate =
        row.fechaProgramada || row.fechaResolucion || row.fechaSolicitud;
      const cacheKey = `${row.alumnoId}|${new Date(referenceDate).toISOString()}`;

      let resolvedProfesorId = null;

      if (cache.has(cacheKey)) {
        resolvedProfesorId = cache.get(cacheKey);
      } else {
        resolvedProfesorId = await this.resolveAssignedProfessorAtDate(
          row.alumnoId,
          referenceDate,
        );
        cache.set(cacheKey, resolvedProfesorId);
      }

      if (resolvedProfesorId !== profesorId) {
        continue;
      }

      const estado = String(row.estado || "").toUpperCase();

      if (estado === "APTO") {
        counters.aptos += 1;
      } else if (estado === "NO_APTO") {
        counters.noAptos += 1;
      }
    }

    counters.total = counters.aptos + counters.noAptos;
    return counters;
  }

  async findResolvedPracticalCallsBetween(startDate, endDate) {
    return this.prisma.solicitudExamen.findMany({
      where: {
        tipo: "PRACTICO",
        estado: {
          in: ["APTO", "NO_APTO"],
        },
        OR: [
          {
            fechaProgramada: {
              gte: startDate,
              lte: endDate,
            },
          },
          {
            fechaProgramada: null,
            fechaResolucion: {
              gte: startDate,
              lte: endDate,
            },
          },
        ],
      },
      select: {
        alumnoId: true,
        estado: true,
        fechaSolicitud: true,
        fechaProgramada: true,
        fechaResolucion: true,
      },
    });
  }

  async resolveAssignedProfessorAtDate(alumnoId, referenceDate) {
    const ref = new Date(referenceDate || Date.now());

    const nextHistory = await this.prisma.alumnoProfesorHistorial.findFirst({
      where: {
        alumnoId,
        changedAt: {
          gte: ref,
        },
      },
      orderBy: {
        changedAt: "asc",
      },
      select: {
        profesorAnteriorId: true,
      },
    });

    if (nextHistory?.profesorAnteriorId) {
      return nextHistory.profesorAnteriorId;
    }

    const previousHistory = await this.prisma.alumnoProfesorHistorial.findFirst(
      {
        where: {
          alumnoId,
          changedAt: {
            lte: ref,
          },
        },
        orderBy: {
          changedAt: "desc",
        },
        select: {
          profesorNuevoId: true,
        },
      },
    );

    if (previousHistory?.profesorNuevoId) {
      return previousHistory.profesorNuevoId;
    }

    const alumno = await this.prisma.alumno.findUnique({
      where: {
        id: alumnoId,
      },
      select: {
        profesorAsignadoId: true,
      },
    });

    return alumno?.profesorAsignadoId || null;
  }
}
