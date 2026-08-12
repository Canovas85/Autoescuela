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
