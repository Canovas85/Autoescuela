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
    const profesores = (await this.repository.getClasesPorProfesor()) || [];

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
    const profesores = (await this.repository.getHorasPorProfesor()) || [];

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

  formatearMes(fecha) {
    return fecha.toLocaleString("es-ES", {
      month: "short",
      year: "2-digit",
    });
  }

  agruparEvolucion(items, campoFecha) {
    const ahora = new Date();
    const periodos = Array.from({ length: 6 }, (_, indice) => {
      const fecha = new Date(ahora.getFullYear(), ahora.getMonth() - indice, 1);

      return {
        key: `${fecha.getFullYear()}-${fecha.getMonth()}`,
        label: this.formatearMes(fecha),
        tests: 0,
        clases: 0,
      };
    }).reverse();

    for (const item of items) {
      const fecha = new Date(item[campoFecha]);
      const key = `${fecha.getFullYear()}-${fecha.getMonth()}`;
      const periodo = periodos.find((entry) => entry.key === key);

      if (periodo) {
        periodo[item.tipo] += 1;
      }
    }

    return periodos;
  }

  construirEstadoBono(bonoCompra, fechaActual) {
    const disponibles =
      bonoCompra.clasesCompradas - bonoCompra.clasesConsumidas;
    const caducado = new Date(bonoCompra.fechaValidezHasta) < fechaActual;

    if (caducado) {
      return "CADUCADO";
    }

    if (!bonoCompra.pagado) {
      return "PENDIENTE_PAGO";
    }

    if (disponibles > 0) {
      return "APLICABLE";
    }

    return "AGOTADO";
  }

  async getStudentDashboard(userId) {
    const dashboard = await this.repository.getStudentDashboard(userId);

    if (!dashboard.profile || !dashboard.profile.alumno) {
      throw new Error("Alumno no encontrado");
    }

    const fechaActual = new Date();

    const temarios = (dashboard.temarios || [])
      .map((item) => ({
        id: item.temarioId,
        titulo: item.temario?.titulo ?? "Temario sin título",
        descripcion: item.temario?.descripcion ?? null,
        orden: item.temario?.orden ?? 0,
        revisado: Boolean(item.revisado),
        dominio: item.dominio ?? 0,
        ultimaRevision: item.ultimaRevision,
      }))
      .sort((a, b) => a.orden - b.orden);

    const tests = dashboard.tests || [];
    const testsTotales = tests.length;
    const testsAprobados = tests.filter(
      (test) => test.resultado === "APROBADO",
    ).length;
    const testsSuspendidos = tests.filter(
      (test) => test.resultado === "SUSPENDIDO",
    ).length;

    const porcentajeAprobado =
      testsTotales === 0 ? 0 : (testsAprobados / testsTotales) * 100;

    const temariosPendientes = temarios.filter(
      (temario) => !temario.revisado || temario.dominio < 70,
    );

    const preparadoParaTeorico =
      testsTotales >= 10 &&
      porcentajeAprobado >= 80 &&
      temariosPendientes.length === 0;

    const recomendacionTemarios =
      temariosPendientes.length > 0
        ? temariosPendientes.slice(0, 3).map((temario) => temario.titulo)
        : [];

    const bonos = (dashboard.bonos || []).map((bonoCompra) => {
      const disponibles =
        bonoCompra.clasesCompradas - bonoCompra.clasesConsumidas;

      return {
        id: bonoCompra.id,
        nombre: bonoCompra.bono?.nombre ?? "Bono",
        descripcion: bonoCompra.bono?.descripcion ?? null,
        clasesCompradas: bonoCompra.clasesCompradas,
        clasesConsumidas: bonoCompra.clasesConsumidas,
        clasesDisponibles: Math.max(disponibles, 0),
        pagado: Boolean(bonoCompra.pagado),
        fechaCompra: bonoCompra.fechaCompra,
        fechaValidezHasta: bonoCompra.fechaValidezHasta,
        estado: this.construirEstadoBono(bonoCompra, fechaActual),
        aplicable:
          Boolean(bonoCompra.pagado) &&
          disponibles > 0 &&
          new Date(bonoCompra.fechaValidezHasta) >= fechaActual,
      };
    });

    const clases = dashboard.clases || [];
    const clasesReservadas = clases.filter(
      (clase) => clase.estado === "PROGRAMADA",
    );

    const clasesRealizadas = dashboard.profile.alumno.horasPracticasCompletadas;

    const clasesCompradas = bonos.reduce(
      (acumulado, bono) => acumulado + bono.clasesCompradas,
      0,
    );

    const clasesPagadas = bonos.reduce(
      (acumulado, bono) => acumulado + (bono.pagado ? bono.clasesCompradas : 0),
      0,
    );

    const actividadMensual = [
      ...tests.map((test) => ({
        tipo: "tests",
        fecha: test.fecha,
      })),
      ...clases.map((clase) => ({
        tipo: "clases",
        fecha: clase.fecha,
      })),
    ];

    const evolucion = this.agruparEvolucion(actividadMensual, "fecha");

    const examenes = dashboard.examenes || [];

    const matriculaActual = dashboard.profile.alumno.matriculas?.[0] ?? null;

    const matriculaPagada = matriculaActual?.estado === "PAGADA";

    const fechaPago = matriculaActual?.fechaPago ?? null;

    return {
      perfil: {
        id: dashboard.profile.id,
        nombre: dashboard.profile.nombre,
        email: dashboard.profile.email,
        dni: dashboard.profile.dni,
        telefono: dashboard.profile.telefono,
        rol: dashboard.profile.rol,
        activo: dashboard.profile.alumno.activo,
        tipoLicenciaObjetivo: dashboard.profile.alumno.tipoLicenciaObjetivo,
        horasPracticasCompletadas:
          dashboard.profile.alumno.horasPracticasCompletadas,
        matriculaPagada: matriculaPagada,
        fechaMatriculaPago: fechaPago,
        profesorAsignado: dashboard.profile.alumno.profesorAsignado
          ? {
              id: dashboard.profile.alumno.profesorAsignado.id,
              nombre:
                dashboard.profile.alumno.profesorAsignado.usuario?.nombre ??
                "Profesor asignado",
              licenciaConducir:
                dashboard.profile.alumno.profesorAsignado.licenciaConducir,
              permisosLicencias:
                dashboard.profile.alumno.profesorAsignado.permisosLicencias,
            }
          : null,
      },
      teoria: {
        testsTotales,
        testsAprobados,
        testsSuspendidos,
        porcentajeAprobado,
        preparadoParaTeorico,
        recomendacionTemarios,
      },
      temarios,
      practica: {
        clasesCompradas,
        clasesPagadas,
        clasesReservadas: clasesReservadas.length,
        clasesRealizadas,
      },
      bonos,
      examenes: {
        teoricos: examenes.filter((examen) => examen.tipo === "TEORICO"),
        practicos: examenes.filter((examen) => examen.tipo === "PRACTICO"),
      },
      reservas: clasesReservadas,
      evolucion,
      resumen: {
        matricula: matriculaPagada ? "PAGADA" : "PENDIENTE",
        preparadoParaTeorico,
        porcentajeAprobado,
      },
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

  async getProfessorDashboard(userId) {
    const profile = await this.repository.getProfessorProfile(userId);

    if (!profile) {
      throw new Error("Profesor no encontrado");
    }

    const permisosLicencias = Array.isArray(profile.permisosLicencias)
      ? profile.permisosLicencias
      : [];

    const [alumnosAsignados, vehiculosDisponibles] = await Promise.all([
      this.repository.getProfessorAssignedStudents(userId),
      this.repository.getProfessorAvailableVehicles(permisosLicencias),
    ]);

    const alumnos = (alumnosAsignados || []).map((alumno) => {
      const matriculaActual = alumno.matriculas?.[0] ?? null;

      return {
        id: alumno.id,
        nombre: alumno.usuario?.nombre ?? "Alumno",
        email: alumno.usuario?.email ?? "",
        telefono: alumno.usuario?.telefono ?? "",
        tipoLicenciaObjetivo: alumno.tipoLicenciaObjetivo,
        horasPracticasCompletadas: alumno.horasPracticasCompletadas ?? 0,
        matriculaEstado: matriculaActual?.estado ?? "PENDIENTE",
      };
    });

    const vehiculos = (vehiculosDisponibles || []).map((vehiculo) => ({
      id: vehiculo.id,
      matricula: vehiculo.matricula,
      marca: vehiculo.marca,
      modelo: vehiculo.modelo,
      tipoPermiso: vehiculo.tipoPermiso,
    }));

    const alumnosMatriculaPagada = alumnos.filter(
      (alumno) => alumno.matriculaEstado === "PAGADA",
    ).length;

    return {
      perfil: {
        id: profile.id,
        nombre: profile.usuario?.nombre ?? "Profesor",
        email: profile.usuario?.email ?? "",
        permisosLicencias,
      },
      resumen: {
        alumnosAsignados: alumnos.length,
        alumnosMatriculaPagada,
        vehiculosDisponibles: vehiculos.length,
      },
      alumnos,
      vehiculos,
    };
  }

  async getProfessorStudents(userId) {
    const profile = await this.repository.getProfessorProfile(userId);

    if (!profile) {
      throw new Error("Profesor no encontrado");
    }

    const alumnosAsignados =
      await this.repository.getProfessorAssignedStudents(userId);

    return (alumnosAsignados || []).map((alumno) => {
      const matriculaActual = alumno.matriculas?.[0] ?? null;

      return {
        id: alumno.id,
        nombre: alumno.usuario?.nombre ?? "Alumno",
        email: alumno.usuario?.email ?? "",
        telefono: alumno.usuario?.telefono ?? "",
        tipoLicenciaObjetivo: alumno.tipoLicenciaObjetivo,
        horasPracticasCompletadas: alumno.horasPracticasCompletadas ?? 0,
        matriculaEstado: matriculaActual?.estado ?? "PENDIENTE",
      };
    });
  }

  async getProfessorStudentDetail(userId, alumnoId) {
    const alumno = await this.repository.findProfessorAssignedStudentById(
      userId,
      alumnoId,
    );

    if (!alumno) {
      throw new Error("Alumno no encontrado o no asignado a este profesor");
    }

    const matriculaActual = alumno.matriculas?.[0] ?? null;
    const tests = Array.isArray(alumno.testsPractica)
      ? alumno.testsPractica
      : [];
    const clases = Array.isArray(alumno.clases) ? alumno.clases : [];

    const testsAprobados = tests.filter(
      (test) => test.resultado === "APROBADO",
    ).length;
    const testsSuspendidos = tests.filter(
      (test) => test.resultado === "SUSPENDIDO",
    ).length;
    const testsTotales = tests.length;

    const porcentajeAprobado =
      testsTotales === 0 ? 0 : (testsAprobados / testsTotales) * 100;

    const areasRefuerzoMap = new Map();

    for (const test of tests) {
      if (test.resultado !== "SUSPENDIDO") {
        continue;
      }

      const key = test.temario?.titulo || "Temario general";
      areasRefuerzoMap.set(key, (areasRefuerzoMap.get(key) || 0) + 1);
    }

    const areasRefuerzo = [...areasRefuerzoMap.entries()]
      .map(([tema, fallos]) => ({ tema, fallos }))
      .sort((a, b) => b.fallos - a.fallos)
      .slice(0, 5);

    const proximasClases = clases
      .filter(
        (clase) =>
          clase.estado === "PROGRAMADA" && new Date(clase.fecha) >= new Date(),
      )
      .map((clase) => ({
        id: clase.id,
        fecha: clase.fecha,
        duracion: clase.duracion,
        estado: clase.estado,
        vehiculo: clase.vehiculo
          ? {
              matricula: clase.vehiculo.matricula,
              marca: clase.vehiculo.marca,
              modelo: clase.vehiculo.modelo,
            }
          : null,
      }));

    const clasesRealizadas = clases.filter(
      (clase) => clase.estado === "REALIZADA" || clase.estado === "COMPLETADA",
    ).length;

    const horasPracticas = alumno.horasPracticasCompletadas ?? 0;
    const preparadoParaTeorico = testsTotales >= 10 && porcentajeAprobado >= 80;
    const preparadoParaPractico =
      horasPracticas >= 20 &&
      clasesRealizadas >= 15 &&
      proximasClases.length <= 3;

    const estadoGeneral =
      preparadoParaTeorico && preparadoParaPractico
        ? "EXCELENTE"
        : preparadoParaTeorico || preparadoParaPractico
          ? "BUENA_EVOLUCION"
          : porcentajeAprobado >= 60 || horasPracticas >= 10
            ? "EN_PROGRESO"
            : "REQUIERE_REFUERZO";

    return {
      perfil: {
        id: alumno.id,
        nombre: alumno.usuario?.nombre ?? "Alumno",
        email: alumno.usuario?.email ?? "",
        telefono: alumno.usuario?.telefono ?? "",
        dni: alumno.usuario?.dni ?? "",
        tipoLicenciaObjetivo: alumno.tipoLicenciaObjetivo,
        matriculaEstado: matriculaActual?.estado ?? "PENDIENTE",
        horasPracticasCompletadas: horasPracticas,
      },
      tests: {
        total: testsTotales,
        aprobados: testsAprobados,
        suspendidos: testsSuspendidos,
        porcentajeAprobado,
      },
      areasRefuerzo,
      practica: {
        clasesRealizadas,
        proximasClases,
      },
      evaluacion: {
        estadoGeneral,
        preparadoParaTeorico,
        preparadoParaPractico,
      },
    };
  }

  async getProfessorVehicles(userId) {
    const profile = await this.repository.getProfessorProfile(userId);

    if (!profile) {
      throw new Error("Profesor no encontrado");
    }

    const permisosLicencias = Array.isArray(profile.permisosLicencias)
      ? profile.permisosLicencias
      : [];

    const vehiculos =
      await this.repository.getProfessorAvailableVehicles(permisosLicencias);

    return vehiculos.map((vehiculo) => ({
      id: vehiculo.id,
      matricula: vehiculo.matricula,
      marca: vehiculo.marca,
      modelo: vehiculo.modelo,
      tipoPermiso: vehiculo.tipoPermiso,
    }));
  }

  async getProfessorVehicleSchedule(userId, vehiculoId) {
    const profile = await this.repository.getProfessorProfile(userId);

    if (!profile) {
      throw new Error("Profesor no encontrado");
    }

    const permisosLicencias = Array.isArray(profile.permisosLicencias)
      ? profile.permisosLicencias
      : [];

    const vehiculo = await this.repository.findProfessorVehicleById(
      permisosLicencias,
      vehiculoId,
    );

    if (!vehiculo) {
      throw new Error(
        "Vehículo no encontrado o no compatible con los permisos del profesor",
      );
    }

    const clases = await this.repository.getVehicleScheduledClasses(vehiculoId);

    const reservas = clases.map((clase) => ({
      id: clase.id,
      fecha: clase.fecha,
      duracion: clase.duracion,
      estado: clase.estado,
      profesorId: clase.profesorId,
      profesorNombre: clase.profesor?.usuario?.nombre ?? "Profesor",
      esMiClase: clase.profesorId === userId,
      alumno: {
        id: clase.alumnoId,
        nombre: clase.alumno?.usuario?.nombre ?? "Alumno",
      },
    }));

    return {
      vehiculo: {
        id: vehiculo.id,
        matricula: vehiculo.matricula,
        marca: vehiculo.marca,
        modelo: vehiculo.modelo,
        tipoPermiso: vehiculo.tipoPermiso,
      },
      reservas,
    };
  }
}
