export class DashboardRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async getTotalAlumnos() {
    return this.prisma.alumno.count();
  }
  async getTotalProfesores() {
    return this.prisma.profesor.count();
  }
  async getTotalVehiculos() {
    return this.prisma.vehiculo.count();
  }

  async getTotalClases() {
    return this.prisma.clasePractica.count();
  }
  async getTotalExamenes() {
    return this.prisma.examen.count();
  }
  async getTotalExamenesAprobados() {
    return this.prisma.examen.count({
      where: {
        estado: "APROBADO",
      },
    });
  }
  async getTotalExamenesSuspendidos() {
    return this.prisma.examen.count({
      where: {
        estado: "SUSPENDIDO",
      },
    });
  }
  async getMetrics() {
    const totalAlumnos = await this.getTotalAlumnos();

    const totalProfesores = await this.getTotalProfesores();

    const totalVehiculos = await this.getTotalVehiculos();

    const totalClases = await this.getTotalClases();

    const totalExamenes = await this.getTotalExamenes();

    const totalExamenesAprobados = await this.getTotalExamenesAprobados();

    const totalExamenesSuspendidos = await this.getTotalExamenesSuspendidos();

    return {
      totalAlumnos,
      totalProfesores,
      totalVehiculos,
      totalClases,
      totalExamenes,
      totalExamenesAprobados,
      totalExamenesSuspendidos,
    };
  }
  async getClasesPorProfesor() {
    return this.prisma.clasePractica.groupBy({
      by: ["profesorId"],
      _count: {
        id: true,
      },
    });
  }
  async getHorasPorProfesor() {
    return this.prisma.clasePractica.groupBy({
      by: ["profesorId"],
      _sum: {
        duracion: true,
      },
    });
  }

  async getStudentProfile(userId) {
    return this.prisma.usuario.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        dni: true,
        telefono: true,
        rol: true,
        alumno: {
          select: {
            tipoLicenciaObjetivo: true,
            horasPracticasCompletadas: true,
            matriculas: {
              orderBy: {
                fechaCreacion: "desc",
              },
              take: 1,
            },
            activo: true,

            profesorAsignado: {
              select: {
                id: true,
                licenciaConducir: true,
                permisosLicencias: true,
                usuario: {
                  select: {
                    nombre: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async getStudentTemarios(userId) {
    return this.prisma.temarioProgreso.findMany({
      where: {
        alumnoId: userId,
      },
      include: {
        temario: true,
      },
    });
  }

  async getStudentTests(userId) {
    return this.prisma.testPractica.findMany({
      where: {
        alumnoId: userId,
      },
      include: {
        temario: true,
      },
      orderBy: {
        fecha: "desc",
      },
    });
  }

  async getStudentClasses(userId) {
    return this.prisma.clasePractica.findMany({
      where: {
        alumnoId: userId,
      },
      include: {
        vehiculo: true,
        profesor: {
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
        fecha: "asc",
      },
    });
  }

  async getStudentBonos(userId) {
    return this.prisma.compraBono.findMany({
      where: {
        alumnoId: userId,
      },
      include: {
        bono: true,
      },
      orderBy: {
        fechaCompra: "desc",
      },
    });
  }

  async getStudentExamRequests(userId) {
    return this.prisma.solicitudExamen.findMany({
      where: {
        alumnoId: userId,
      },
      orderBy: {
        fechaSolicitud: "desc",
      },
    });
  }

  async getStudentDGTExams(userId) {
    return this.prisma.examenDGTAlumno.findMany({
      where: {
        alumnoId: userId,
      },
      orderBy: {
        fecha: "desc",
      },
    });
  }

  async getStudentPagosDgt(userId) {
    return this.prisma.pago.findMany({
      where: {
        alumnoId: userId,
        tipo: "TASA_DGT_21",
      },
      orderBy: [{ fechaCreacion: "desc" }],
    });
  }

  async countStudentExamSuspensosFromDate(userId, fechaDesde) {
    return this.prisma.examen.count({
      where: {
        alumnoId: userId,
        estado: "SUSPENDIDO",
        fecha: {
          gte: fechaDesde,
        },
      },
    });
  }

  async getStudentDashboard(userId) {
    const [
      profile,
      temarios,
      tests,
      clases,
      bonos,
      examenes,
      examenesDGT,
      pagosDgt,
    ] = await Promise.all([
      this.getStudentProfile(userId),
      this.getStudentTemarios(userId),
      this.getStudentTests(userId),
      this.getStudentClasses(userId),
      this.getStudentBonos(userId),
      this.getStudentExamRequests(userId),
      this.getStudentDGTExams(userId),
      this.getStudentPagosDgt(userId),
    ]);

    return {
      profile,
      temarios,
      tests,
      clases,
      bonos,
      examenes,
      examenesDGT,
      pagosDgt,
    };
  }

  async getProfessorProfile(userId) {
    return this.prisma.profesor.findUnique({
      where: {
        id: userId,
      },
      include: {
        usuario: {
          select: {
            nombre: true,
            email: true,
          },
        },
      },
    });
  }

  async getProfessorWorkSchedule(userId) {
    return this.prisma.profesorHorarioBloque.findMany({
      where: {
        profesorId: userId,
      },
      orderBy: [{ diaSemana: "asc" }, { horaInicio: "asc" }],
    });
  }

  async replaceProfessorWorkSchedule(userId, bloques) {
    return this.prisma.$transaction(async (tx) => {
      await tx.profesorHorarioBloque.deleteMany({
        where: {
          profesorId: userId,
        },
      });

      if (Array.isArray(bloques) && bloques.length > 0) {
        await tx.profesorHorarioBloque.createMany({
          data: bloques.map((bloque) => ({
            profesorId: userId,
            diaSemana: bloque.diaSemana,
            horaInicio: bloque.horaInicio,
            horaFin: bloque.horaFin,
          })),
        });
      }
    });

    return this.getProfessorWorkSchedule(userId);
  }

  async getProfessorScheduledClassesBetween(userId, startDate, endDate) {
    return this.prisma.clasePractica.findMany({
      where: {
        profesorId: userId,
        estado: {
          in: ["PROGRAMADA", "CONFIRMADA"],
        },
        fecha: {
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
        vehiculo: {
          select: {
            matricula: true,
            marca: true,
            modelo: true,
            tipoPermiso: true,
          },
        },
      },
      orderBy: {
        fecha: "asc",
      },
    });
  }

  async findProfessorClassById(userId, classId) {
    return this.prisma.clasePractica.findFirst({
      where: {
        id: classId,
        profesorId: userId,
      },
    });
  }

  async updateProfessorClassStatus(classId, estado) {
    return this.prisma.clasePractica.update({
      where: {
        id: classId,
      },
      data: {
        estado,
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
        vehiculo: {
          select: {
            matricula: true,
            marca: true,
            modelo: true,
            tipoPermiso: true,
          },
        },
      },
    });
  }

  async getProfessorAssignedStudents(userId) {
    return this.prisma.alumno.findMany({
      where: {
        profesorAsignadoId: userId,
        activo: true,
      },
      include: {
        usuario: {
          select: {
            nombre: true,
            email: true,
            telefono: true,
          },
        },
        matriculas: {
          orderBy: {
            fechaCreacion: "desc",
          },
          take: 1,
        },
      },
      orderBy: {
        usuario: {
          nombre: "asc",
        },
      },
    });
  }

  async findProfessorAssignedStudentById(profesorId, alumnoId) {
    return this.prisma.alumno.findFirst({
      where: {
        id: alumnoId,
        profesorAsignadoId: profesorId,
      },
      include: {
        usuario: {
          select: {
            nombre: true,
            email: true,
            telefono: true,
            dni: true,
          },
        },
        matriculas: {
          orderBy: {
            fechaCreacion: "desc",
          },
          take: 1,
        },
        testsPractica: {
          include: {
            temario: {
              select: {
                titulo: true,
              },
            },
          },
          orderBy: {
            fecha: "desc",
          },
        },
        clases: {
          include: {
            vehiculo: {
              select: {
                matricula: true,
                marca: true,
                modelo: true,
              },
            },
            profesor: {
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
            fecha: "asc",
          },
        },
      },
    });
  }

  async getProfessorAvailableVehicles(permisosLicencias) {
    if (!Array.isArray(permisosLicencias) || permisosLicencias.length === 0) {
      return [];
    }

    return this.prisma.vehiculo.findMany({
      where: {
        activo: true,
        tipoPermiso: {
          in: permisosLicencias,
        },
      },
      orderBy: [{ tipoPermiso: "asc" }, { matricula: "asc" }],
    });
  }

  async findProfessorVehicleById(permisosLicencias, vehiculoId) {
    if (!Array.isArray(permisosLicencias) || permisosLicencias.length === 0) {
      return null;
    }

    return this.prisma.vehiculo.findFirst({
      where: {
        id: vehiculoId,
        activo: true,
        tipoPermiso: {
          in: permisosLicencias,
        },
      },
    });
  }

  async getVehicleScheduledClasses(vehiculoId) {
    return this.prisma.clasePractica.findMany({
      where: {
        vehiculoId,
        estado: "PROGRAMADA",
        fecha: {
          gte: new Date(),
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
        profesor: {
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
        fecha: "asc",
      },
    });
  }
  async getTotalExamenesPendientes() {
    return this.prisma.examen.count({
      where: {
        estado: "PROGRAMADO",
      },
    });
  }
  async getTotalClasesProgramadas() {
    return this.prisma.clasePractica.count({
      where: {
        estado: "PROGRAMADA",
      },
    });
  }
  async getTotalClasesCanceladas() {
    return this.prisma.clasePractica.count({
      where: {
        estado: "CANCELADA",
      },
    });
  }
  async getClasesEsteMes() {
    const ahora = new Date();

    const primerDiaMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);

    const ultimoDiaMes = new Date(
      ahora.getFullYear(),
      ahora.getMonth() + 1,
      0,
      23,
      59,
      59,
    );

    return this.prisma.clasePractica.count({
      where: {
        fecha: {
          gte: primerDiaMes,
          lte: ultimoDiaMes,
        },
      },
    });
  }
  async getExamenesEsteMes() {
    const ahora = new Date();

    const primerDiaMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);

    const ultimoDiaMes = new Date(
      ahora.getFullYear(),
      ahora.getMonth() + 1,
      0,
      23,
      59,
      59,
    );

    return this.prisma.examen.count({
      where: {
        fecha: {
          gte: primerDiaMes,
          lte: ultimoDiaMes,
        },
      },
    });
  }
  async getExamenesAprobadosEsteMes() {
    const ahora = new Date();

    const primerDiaMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);

    const ultimoDiaMes = new Date(
      ahora.getFullYear(),
      ahora.getMonth() + 1,
      0,
      23,
      59,
      59,
    );

    return this.prisma.examen.count({
      where: {
        estado: "APROBADO",
        fecha: {
          gte: primerDiaMes,
          lte: ultimoDiaMes,
        },
      },
    });
  }
  async getExamenesSuspendidosEsteMes() {
    const ahora = new Date();

    const primerDiaMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);

    const ultimoDiaMes = new Date(
      ahora.getFullYear(),
      ahora.getMonth() + 1,
      0,
      23,
      59,
      59,
    );

    return this.prisma.examen.count({
      where: {
        estado: "SUSPENDIDO",
        fecha: {
          gte: primerDiaMes,
          lte: ultimoDiaMes,
        },
      },
    });
  }

  async getTotalAlumnosActivos() {
    return this.prisma.alumno.count({
      where: {
        activo: true,
      },
    });
  }

  async getTotalMatriculasActivas() {
    return this.prisma.matricula.count({
      where: {
        estado: {
          in: ["PENDIENTE", "PAGADA"],
        },
      },
    });
  }

  async getProfesorById(profesorId) {
    return this.prisma.profesor.findUnique({
      where: {
        id: profesorId,
      },
      include: {
        usuario: {
          select: {
            nombre: true,
            email: true,
          },
        },
      },
    });
  }

  async getDgtTestsToday() {
    const inicio = new Date();
    inicio.setHours(0, 0, 0, 0);

    const fin = new Date();
    fin.setHours(23, 59, 59, 999);

    return this.prisma.examenDGTAlumno.count({
      where: {
        fecha: {
          gte: inicio,
          lte: fin,
        },
      },
    });
  }

  async getDgtTestsThisMonth() {
    const ahora = new Date();

    const inicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1);

    const fin = new Date(
      ahora.getFullYear(),
      ahora.getMonth() + 1,
      0,
      23,
      59,
      59,
    );

    return this.prisma.examenDGTAlumno.count({
      where: {
        fecha: {
          gte: inicio,
          lte: fin,
        },
      },
    });
  }

  async getDgtApprovedTests() {
    return this.prisma.examenDGTAlumno.count({
      where: {
        aprobado: true,
      },
    });
  }

  async getTotalDgtTests() {
    return this.prisma.examenDGTAlumno.count();
  }

  async getTopStudentsDGT() {
    return this.prisma.alumno.findMany({
      include: {
        usuario: {
          select: {
            nombre: true,
          },
        },
        examenesDGT: true,
      },
    });
  }

  async getProfessorRanking() {
    const profesores = await this.prisma.profesor.findMany({
      include: {
        usuario: {
          select: {
            nombre: true,
          },
        },
        clases: {
          select: {
            id: true,
          },
        },
      },
    });

    return profesores;
  }
  async getDgtTestsEvolution() {
    return this.prisma.examenDGTAlumno.findMany({
      select: {
        fecha: true,
        aprobado: true,
      },
      orderBy: {
        fecha: "asc",
      },
    });
  }
}
