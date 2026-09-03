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

  async getStudentDashboard(userId) {
    const [profile, temarios, tests, clases, bonos, examenes] =
      await Promise.all([
        this.getStudentProfile(userId),
        this.getStudentTemarios(userId),
        this.getStudentTests(userId),
        this.getStudentClasses(userId),
        this.getStudentBonos(userId),
        this.getStudentExamRequests(userId),
      ]);

    return {
      profile,
      temarios,
      tests,
      clases,
      bonos,
      examenes,
    };
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
}
