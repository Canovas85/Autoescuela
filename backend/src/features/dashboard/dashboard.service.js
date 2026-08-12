export class DashboardService {
  constructor(repository) {
    this.repository = repository;
  }

  async getMetrics() {
    return this.repository.getMetrics();
  }
  async getPorcentajeAprobados() {
    const totalExamenes = await this.repository.getTotalExamenes();

    const totalAprobados = await this.repository.getTotalExamenesAprobados();

    if (totalExamenes === 0) {
      return 0;
    }

    return (totalAprobados / totalExamenes) * 100;
  }
  async getPorcentajeSuspendidos() {
    const totalExamenes = await this.repository.getTotalExamenes();

    const totalSuspendidos =
      await this.repository.getTotalExamenesSuspendidos();

    if (totalExamenes === 0) {
      return 0;
    }

    return (totalSuspendidos / totalExamenes) * 100;
  }
  async getMetrics() {
    const metrics = await this.repository.getMetrics();

    const porcentajeAprobados =
      metrics.totalExamenes === 0
        ? 0
        : (metrics.totalExamenesAprobados / metrics.totalExamenes) * 100;

    const porcentajeSuspendidos =
      metrics.totalExamenes === 0
        ? 0
        : (metrics.totalExamenesSuspendidos / metrics.totalExamenes) * 100;

    return {
      ...metrics,
      porcentajeAprobados,
      porcentajeSuspendidos,
    };
  }
  async getTasaExito() {
    const totalExamenes = await this.repository.getTotalExamenes();

    const totalAprobados = await this.repository.getTotalExamenesAprobados();

    if (totalExamenes === 0) {
      return 0;
    }

    return (totalAprobados / totalExamenes) * 100;
  }
  async getRatioAlumnosPorProfesor() {
    const totalAlumnos = await this.repository.getTotalAlumnos();

    const totalProfesores = await this.repository.getTotalProfesores();

    if (totalProfesores === 0) {
      return 0;
    }

    return totalAlumnos / totalProfesores;
  }
  async getRatioVehiculosPorProfesor() {
    const totalVehiculos = await this.repository.getTotalVehiculos();

    const totalProfesores = await this.repository.getTotalProfesores();

    if (totalProfesores === 0) {
      return 0;
    }

    return totalVehiculos / totalProfesores;
  }
  async getAdvancedMetrics() {
    return {
      totalExamenesPendientes:
        await this.repository.getTotalExamenesPendientes(),

      totalClasesProgramadas: await this.repository.getTotalClasesProgramadas(),

      totalClasesCanceladas: await this.repository.getTotalClasesCanceladas(),

      tasaExito: await this.getTasaExito(),

      ratioAlumnosPorProfesor: await this.getRatioAlumnosPorProfesor(),

      ratioVehiculosPorProfesor: await this.getRatioVehiculosPorProfesor(),

      clasesEsteMes: await this.repository.getClasesEsteMes(),

      examenesEsteMes: await this.repository.getExamenesEsteMes(),

      examenesAprobadosEsteMes:
        await this.repository.getExamenesAprobadosEsteMes(),

      examenesSuspendidosEsteMes:
        await this.repository.getExamenesSuspendidosEsteMes(),
    };
  }
  async getPorcentajeExitoMensual() {
    const examenesMes = await this.repository.getExamenesEsteMes();

    const aprobadosMes = await this.repository.getExamenesAprobadosEsteMes();

    if (examenesMes === 0) {
      return 0;
    }

    return (aprobadosMes / examenesMes) * 100;
  }
  async getTopProfesorPorClases() {
    const profesores = await this.repository.getClasesPorProfesor();

    if (profesores.length === 0) {
      return null;
    }

    const top = profesores.reduce((max, actual) =>
      actual._count.id > max._count.id ? actual : max,
    );

    return {
      profesorId: top.profesorId,
      totalClases: top._count.id,
    };
  }
  async getTopProfesorPorHoras() {
    const profesores = await this.repository.getHorasPorProfesor();

    if (profesores.length === 0) {
      return null;
    }

    const top = profesores.reduce((max, actual) =>
      actual._sum.duracion > max._sum.duracion ? actual : max,
    );

    return {
      profesorId: top.profesorId,
      horas: top._sum.duracion,
    };
  }
  async getExecutiveDashboard() {
    return {
      successRate: await this.getTasaExito(),

      monthlySuccessRate: await this.getPorcentajeExitoMensual(),

      pendingExams: await this.repository.getTotalExamenesPendientes(),

      scheduledClasses: await this.repository.getTotalClasesProgramadas(),

      topProfesorByClasses: await this.getTopProfesorPorClases(),

      topProfesorByHours: await this.getTopProfesorPorHoras(),
    };
  }
}
