export class ClasesRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async create(data) {
    return this.prisma.clasePractica.create({
      data,
    });
  }
  async findAll() {
    return this.prisma.clasePractica.findMany({
      include: {
        alumno: {
          include: {
            usuario: true,
          },
        },

        profesor: {
          include: {
            usuario: true,
          },
        },

        vehiculo: true,
      },
    });
  }

  async findById(id) {
    return this.prisma.clasePractica.findUnique({
      where: {
        id,
      },

      include: {
        alumno: {
          include: {
            usuario: true,
          },
        },

        profesor: {
          include: {
            usuario: true,
          },
        },

        vehiculo: true,
      },
    });
  }

  async update(id, data) {
    return this.prisma.clasePractica.update({
      where: {
        id,
      },
      data,
    });
  }

  async cancel(id) {
    return this.prisma.clasePractica.update({
      where: {
        id,
      },
      data: {
        estado: "CANCELADA",
      },
    });
  }

  async findByProfesorAndFecha(profesorId, fecha) {
    return this.prisma.clasePractica.findFirst({
      where: {
        profesorId,
        fecha,
      },
    });
  }

  async findByVehiculoAndFecha(vehiculoId, fecha) {
    return this.prisma.clasePractica.findFirst({
      where: {
        vehiculoId,
        fecha,
      },
    });
  }

  async findByAlumnoAndFecha(alumnoId, fecha) {
    return this.prisma.clasePractica.findFirst({
      where: {
        alumnoId,
        fecha,
      },
    });
  }

  async findStudentBookingProfile(alumnoId) {
    return this.prisma.alumno.findUnique({
      where: {
        id: alumnoId,
      },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
          },
        },
        profesorAsignado: {
          include: {
            usuario: {
              select: {
                id: true,
                nombre: true,
              },
            },
          },
        },
        matriculas: {
          orderBy: {
            fechaCreacion: "desc",
          },
          take: 1,
        },
      },
    });
  }

  async findLatestDgtPaid(alumnoId, permiso) {
    return this.prisma.pago.findFirst({
      where: {
        alumnoId,
        tipo: "TASA_DGT_21",
        permiso,
        estado: "PAGADO",
      },
      orderBy: [{ fechaPago: "desc" }, { fechaCreacion: "desc" }],
    });
  }

  async countTheoreticalFailsSince(alumnoId, fechaDesde) {
    return this.prisma.solicitudExamen.count({
      where: {
        alumnoId,
        tipo: "TEORICO",
        estado: {
          in: ["NO_APTO", "SUSPENDIDO", "SUSPENSO"],
        },
        fechaProgramada: {
          gte: fechaDesde,
        },
      },
    });
  }

  async findFutureTheoreticalRequest(alumnoId) {
    return this.prisma.solicitudExamen.findFirst({
      where: {
        alumnoId,
        tipo: "TEORICO",
        estado: {
          in: ["PENDIENTE", "PROGRAMADO", "SOLICITADO"],
        },
        fechaProgramada: {
          gte: new Date(),
        },
      },
      orderBy: {
        fechaProgramada: "asc",
      },
    });
  }

  async hasTheoreticalApto(alumnoId) {
    const [solicitudApta, examenApto] = await Promise.all([
      this.prisma.solicitudExamen.count({
        where: {
          alumnoId,
          tipo: "TEORICO",
          estado: {
            in: ["APTO", "APROBADO"],
          },
        },
      }),
      this.prisma.examen.count({
        where: {
          alumnoId,
          tipo: "TEORICO",
          estado: {
            in: ["APTO", "APROBADO"],
          },
        },
      }),
    ]);

    return solicitudApta > 0 || examenApto > 0;
  }

  async getProfessorWorkSchedule(profesorId) {
    return this.prisma.profesorHorarioBloque.findMany({
      where: {
        profesorId,
      },
      orderBy: [{ diaSemana: "asc" }, { horaInicio: "asc" }],
    });
  }

  async getProfessorClassesBetween(profesorId, weekStart, weekEnd) {
    return this.prisma.clasePractica.findMany({
      where: {
        profesorId,
        estado: {
          in: ["PROGRAMADA", "CONFIRMADA"],
        },
        fecha: {
          gte: weekStart,
          lte: weekEnd,
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
        vehiculo: true,
      },
      orderBy: {
        fecha: "asc",
      },
    });
  }

  async getStudentUpcomingConfirmedClasses(alumnoId) {
    return this.prisma.clasePractica.findMany({
      where: {
        alumnoId,
        estado: "CONFIRMADA",
        fecha: {
          gte: new Date(),
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
        vehiculo: true,
      },
      orderBy: {
        fecha: "asc",
      },
    });
  }

  async getStudentPendingRequests(alumnoId) {
    return this.prisma.clasePractica.findMany({
      where: {
        alumnoId,
        estado: "PROGRAMADA",
        fecha: {
          gte: new Date(),
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
        vehiculo: true,
      },
      orderBy: {
        fecha: "asc",
      },
    });
  }

  async findStudentConfirmedBySlot(alumnoId, fecha) {
    return this.prisma.clasePractica.findFirst({
      where: {
        alumnoId,
        estado: "CONFIRMADA",
        fecha,
      },
    });
  }

  async findProfessorOccupiedBySlot(profesorId, fecha) {
    return this.prisma.clasePractica.findFirst({
      where: {
        profesorId,
        estado: {
          in: ["PROGRAMADA", "CONFIRMADA"],
        },
        fecha,
      },
    });
  }

  async getAvailableVehiclesByPermiso(permiso, fecha) {
    return this.prisma.vehiculo.findMany({
      where: {
        activo: true,
        tipoPermiso: permiso,
        clases: {
          none: {
            fecha,
            estado: {
              in: ["PROGRAMADA", "CONFIRMADA"],
            },
          },
        },
      },
      orderBy: {
        matricula: "asc",
      },
    });
  }

  async createStudentRequest(data) {
    return this.prisma.clasePractica.create({
      data,
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
        vehiculo: true,
      },
    });
  }

  async getApplicableBonos(alumnoId, now) {
    return this.prisma.compraBono.findMany({
      where: {
        alumnoId,
        pagado: true,
        fechaValidezHasta: {
          gte: now,
        },
      },
      include: {
        bono: true,
      },
      orderBy: [{ fechaValidezHasta: "asc" }, { fechaCompra: "asc" }],
    });
  }

  async findCompraBonoByIdForAlumno(compraBonoId, alumnoId) {
    return this.prisma.compraBono.findFirst({
      where: {
        id: compraBonoId,
        alumnoId,
      },
      include: {
        bono: true,
      },
    });
  }

  async getTarifaClasePorPermiso(permiso) {
    return this.prisma.tarifaConcepto.findFirst({
      where: {
        permiso,
        activa: true,
        tipo: "POR_CLASE",
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  async findProfessorClassById(profesorId, classId) {
    return this.prisma.clasePractica.findFirst({
      where: {
        id: classId,
        profesorId,
      },
      include: {
        alumno: {
          include: {
            usuario: {
              select: {
                id: true,
                nombre: true,
              },
            },
          },
        },
        vehiculo: true,
        compraBono: {
          include: {
            bono: true,
          },
        },
        pagos: true,
      },
    });
  }

  async findStudentClassById(alumnoId, classId) {
    return this.prisma.clasePractica.findFirst({
      where: {
        id: classId,
        alumnoId,
      },
      include: {
        profesor: {
          include: {
            usuario: {
              select: {
                id: true,
                nombre: true,
              },
            },
          },
        },
        compraBono: {
          include: {
            bono: true,
          },
        },
        pagos: true,
      },
    });
  }

  async updateClassById(classId, data) {
    return this.prisma.clasePractica.update({
      where: {
        id: classId,
      },
      data,
      include: {
        alumno: {
          include: {
            usuario: {
              select: {
                id: true,
                nombre: true,
              },
            },
          },
        },
        profesor: {
          include: {
            usuario: {
              select: {
                id: true,
                nombre: true,
              },
            },
          },
        },
        vehiculo: true,
      },
    });
  }

  async decrementBonoClass(compraBonoId) {
    return this.prisma.compraBono.update({
      where: {
        id: compraBonoId,
      },
      data: {
        clasesConsumidas: {
          increment: 1,
        },
      },
    });
  }

  async incrementBonoClass(compraBonoId) {
    return this.prisma.compraBono.update({
      where: {
        id: compraBonoId,
      },
      data: {
        clasesConsumidas: {
          decrement: 1,
        },
      },
    });
  }

  async findPaymentByClassId(classId) {
    return this.prisma.pago.findFirst({
      where: {
        clasePracticaId: classId,
      },
      orderBy: {
        fechaCreacion: "desc",
      },
    });
  }

  async createPendingPaymentForClass(data) {
    return this.prisma.pago.create({
      data,
    });
  }

  async updatePaymentById(id, data) {
    return this.prisma.pago.update({
      where: {
        id,
      },
      data,
    });
  }

  async createNotification(data) {
    return this.prisma.notificacion.create({
      data,
    });
  }

  async getProfessorClassRequests(profesorId) {
    return this.prisma.clasePractica.findMany({
      where: {
        profesorId,
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
        vehiculo: true,
      },
      orderBy: [{ fecha: "asc" }],
    });
  }

  async getStudentOverdueUnpaidConfirmedClasses(alumnoId, now) {
    return this.prisma.clasePractica.findMany({
      where: {
        alumnoId,
        estado: "CONFIRMADA",
        metodoPago: "INDIVIDUAL",
        pagoLimiteAt: {
          lt: now,
        },
        pagos: {
          some: {
            estado: "PENDIENTE",
          },
        },
      },
      include: {
        pagos: {
          where: {
            estado: "PENDIENTE",
          },
        },
      },
    });
  }

  async getProfessorOverdueUnpaidConfirmedClasses(profesorId, now) {
    return this.prisma.clasePractica.findMany({
      where: {
        profesorId,
        estado: "CONFIRMADA",
        metodoPago: "INDIVIDUAL",
        pagoLimiteAt: {
          lt: now,
        },
        pagos: {
          some: {
            estado: "PENDIENTE",
          },
        },
      },
      include: {
        pagos: {
          where: {
            estado: "PENDIENTE",
          },
        },
        alumno: {
          include: {
            usuario: {
              select: {
                id: true,
                nombre: true,
              },
            },
          },
        },
      },
    });
  }

  async runTransaction(operation) {
    return this.prisma.$transaction(operation);
  }
}
