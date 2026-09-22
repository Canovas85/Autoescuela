import { getCapacidadCombustibleByPermiso } from "../../shared/utils/vehiculo-combustible.js";

export class DashboardService {
  constructor(repository) {
    this.repository = repository;
  }

  calcularRachaExamenesDGT(examenesDGT = []) {
    if (!Array.isArray(examenesDGT) || examenesDGT.length === 0) {
      return {
        tipo: "SIN_DATOS",
        cantidad: 0,
      };
    }

    const primerResultado = Boolean(examenesDGT[0].aprobado);
    let cantidad = 0;

    for (const examen of examenesDGT) {
      if (Boolean(examen.aprobado) !== primerResultado) {
        break;
      }

      cantidad += 1;
    }

    return {
      tipo: primerResultado ? "APROBADOS" : "SUSPENSOS",
      cantidad,
    };
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

    if (!profesores?.length) {
      return null;
    }

    const top = profesores.reduce((max, actual) =>
      actual._count.id > max._count.id ? actual : max,
    );

    const profesor = await this.repository.getProfesorById(top.profesorId);

    return {
      profesorId: top.profesorId,
      nombre: profesor?.usuario?.nombre ?? "Profesor",
      totalClases: top._count.id,
    };
  }
  async getTopProfesorPorHoras() {
    const profesores = await this.repository.getHorasPorProfesor();

    if (!profesores?.length) {
      return null;
    }

    const top = profesores.reduce((max, actual) =>
      actual._sum.duracion > max._sum.duracion ? actual : max,
    );

    const profesor = await this.repository.getProfesorById(top.profesorId);

    return {
      profesorId: top.profesorId,
      nombre: profesor?.usuario?.nombre ?? "Profesor",
      horas: top._sum.duracion ?? 0,
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

    if (!bonoCompra.pagado) {
      return "PENDIENTE_PAGO";
    }

    if (caducado) {
      return "CADUCADO";
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
    const examenesDGT = dashboard.examenesDGT || [];
    const pagosDgt = dashboard.pagosDgt || [];
    const dgtRealizados = examenesDGT.length;
    const dgtAprobados = examenesDGT.filter((examen) => examen.aprobado).length;
    const dgtSuspendidos = dgtRealizados - dgtAprobados;
    const dgtPorcentajeAprobado =
      dgtRealizados === 0 ? 0 : (dgtAprobados / dgtRealizados) * 100;
    const ultimoExamenDGT = examenesDGT[0] ?? null;
    const rachaDGT = this.calcularRachaExamenesDGT(examenesDGT);

    const pagoDgtPendiente =
      pagosDgt.find((pago) => pago.estado === "PENDIENTE") ?? null;

    const ultimoPagoDgtPagado =
      pagosDgt.find((pago) => pago.estado === "PAGADO") ?? null;

    let convocatoriasIncluidas =
      ultimoPagoDgtPagado?.convocatoriasIncluidas ?? 0;
    let convocatoriasConsumidas = 0;
    let convocatoriasDisponibles = 0;

    if (ultimoPagoDgtPagado) {
      convocatoriasConsumidas = Number(
        ultimoPagoDgtPagado.convocatoriasConsumidas || 0,
      );
      convocatoriasConsumidas = Math.min(
        Math.max(convocatoriasConsumidas, 0),
        convocatoriasIncluidas,
      );

      convocatoriasDisponibles = Math.max(
        convocatoriasIncluidas - convocatoriasConsumidas,
        0,
      );
    }

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
      dgt: {
        testsTotales: dgtRealizados,
        testsAprobados: dgtAprobados,
        testsSuspendidos: dgtSuspendidos,
        porcentajeAprobado: dgtPorcentajeAprobado,
        ultimoResultado: ultimoExamenDGT
          ? {
              id: ultimoExamenDGT.id,
              aprobado: ultimoExamenDGT.aprobado,
              aciertos: ultimoExamenDGT.aciertos,
              fallos: ultimoExamenDGT.fallos,
              fecha: ultimoExamenDGT.fecha,
            }
          : null,
        rachaActual: rachaDGT,
        tasa21: {
          pagoPendiente: pagoDgtPendiente
            ? {
                id: pagoDgtPendiente.id,
                estado: pagoDgtPendiente.estado,
                importe: pagoDgtPendiente.importe,
                concepto: pagoDgtPendiente.concepto,
                permiso: pagoDgtPendiente.permiso,
                fechaCreacion: pagoDgtPendiente.fechaCreacion,
              }
            : null,
          ultimoPago: ultimoPagoDgtPagado
            ? {
                id: ultimoPagoDgtPagado.id,
                estado: ultimoPagoDgtPagado.estado,
                importe: ultimoPagoDgtPagado.importe,
                concepto: ultimoPagoDgtPagado.concepto,
                permiso: ultimoPagoDgtPagado.permiso,
                fechaPago: ultimoPagoDgtPagado.fechaPago,
                numeroFacturaPago: ultimoPagoDgtPagado.numeroFacturaPago,
              }
            : null,
          convocatoriasIncluidas,
          convocatoriasConsumidas,
          convocatoriasDisponibles,
          requiereNuevoPago:
            convocatoriasIncluidas > 0 && convocatoriasDisponibles === 0,
        },
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
        pagoTasaPendiente: Boolean(pagoDgtPendiente),
      },
    };
  }
  async getExecutiveDashboard() {
    const totalDgtTests = await this.repository.getTotalDgtTests();

    const approvedDgtTests = await this.repository.getDgtApprovedTests();

    return {
      activeStudents: await this.repository.getTotalAlumnosActivos(),

      activeEnrollments: await this.repository.getTotalMatriculasActivas(),

      scheduledClasses: await this.repository.getTotalClasesProgramadas(),

      pendingClassConfirmations:
        await this.repository.getPendingClassConfirmations(),

      pendingClassHours: await this.repository.getPendingClassHours(),

      pendingExams: await this.repository.getTotalExamenesPendientes(),

      matriculasPagadasMes: await this.repository.getMatriculasPagadasMes(),
      matriculasPagadasHistorico:
        await this.repository.getMatriculasPagadasHistorico(),
      matriculasPendientesMes:
        await this.repository.getMatriculasPendientesMes(),
      matriculasPendientesHistorico:
        await this.repository.getMatriculasPendientesHistorico(),
      aprobadosTeoricoMes: await this.repository.getAprobadosTeoricoMes(),
      aprobadosTeoricoHistorico:
        await this.repository.getAprobadosTeoricoHistorico(),
      aprobadosPracticoMes: await this.repository.getAprobadosPracticoMes(),
      aprobadosPracticoHistorico:
        await this.repository.getAprobadosPracticoHistorico(),

      examsThisMonth: await this.repository.getExamenesEsteMes(),

      successRate: await this.getTasaExito(),

      monthlySuccessRate: await this.getPorcentajeExitoMensual(),

      dgtTestsToday: await this.repository.getDgtTestsToday(),

      dgtTestsThisMonth: await this.repository.getDgtTestsThisMonth(),

      dgtSuccessRate: await this.getDgtSuccessRate(),

      totalDgtTests: await this.repository.getTotalDgtTests(),

      topStudents: await this.getTopStudentsRanking(),

      topProfessors: await this.getProfessorRanking(),

      topProfesorByClasses: await this.getTopProfesorPorClases(),

      topProfesorByHours: await this.getTopProfesorPorHoras(),

      dgtEvolution: await this.getDgtEvolution(),

      dgtSummary: {
        total: totalDgtTests,
        aprobados: approvedDgtTests,
        suspendidos: totalDgtTests - approvedDgtTests,
      },
    };
  }

  formatMinutesAsHours(minutes) {
    const safeMinutes = Number.isFinite(minutes) ? Math.max(minutes, 0) : 0;
    const hours = Math.floor(safeMinutes / 60);
    const remainder = safeMinutes % 60;

    return `${hours}h ${String(remainder).padStart(2, "0")}min`;
  }

  getComparableExamDate(examRequest) {
    const dateValue =
      examRequest?.fechaProgramada || examRequest?.fechaSolicitud;
    const date = new Date(dateValue || 0);

    if (Number.isNaN(date.getTime())) {
      return 0;
    }

    return date.getTime();
  }

  getStudentProgressStatus(solicitudesExamen = [], clases = []) {
    const latestTheoryRequest = [...(solicitudesExamen || [])]
      .filter((request) => request?.tipo === "TEORICO")
      .sort(
        (a, b) => this.getComparableExamDate(b) - this.getComparableExamDate(a),
      )[0];

    const latestPracticalRequest = [...(solicitudesExamen || [])]
      .filter((request) => request?.tipo === "PRACTICO")
      .sort(
        (a, b) => this.getComparableExamDate(b) - this.getComparableExamDate(a),
      )[0];

    const completedRoadmaps = (clases || []).filter((clase) => {
      const estadoClase = String(clase?.estado || "").toUpperCase();
      const estadoHoja = String(clase?.hojaRuta?.estado || "").toUpperCase();

      return (
        ["COMPLETADA", "REALIZADA", "FINALIZADA", "REGISTRADA"].includes(
          estadoClase,
        ) || estadoHoja === "REGISTRADA"
      );
    }).length;

    const practicalStatus = String(
      latestPracticalRequest?.estado || "",
    ).toUpperCase();
    const theoryStatus = String(
      latestTheoryRequest?.estado || "",
    ).toUpperCase();

    const hasPracticalRequest = [
      "SOLICITADO",
      "PROGRAMADO",
      "PENDIENTE",
    ].includes(practicalStatus);

    if (practicalStatus === "APTO") {
      return { label: "Licencia aprobada", ok: true };
    }

    if (["NO_APTO", "SUSPENDIDO"].includes(practicalStatus)) {
      return { label: "Práctico suspenso", ok: false };
    }

    if (hasPracticalRequest) {
      return { label: "Pendiente de examen práctico", ok: false };
    }

    if (theoryStatus === "APTO" && completedRoadmaps > 0) {
      return { label: "Preparándose para el práctico", ok: true };
    }

    if (["NO_APTO", "SUSPENDIDO"].includes(theoryStatus)) {
      return { label: "Teórico suspenso", ok: false };
    }

    if (theoryStatus === "APTO") {
      return { label: "Teórico aprobado", ok: true };
    }

    if (["SOLICITADO", "PROGRAMADO", "PENDIENTE"].includes(theoryStatus)) {
      return { label: "Pendiente de examen teórico", ok: false };
    }

    return { label: "Estudiando teórico", ok: false };
  }

  buildProfessorStudentSummary(alumno) {
    const matriculaActual = alumno.matriculas?.[0] ?? null;
    const clases = Array.isArray(alumno.clases) ? alumno.clases : [];

    const clasesRealizadasRows = clases.filter((clase) => {
      const estadoClase = String(clase?.estado || "").toUpperCase();
      const estadoHoja = String(clase?.hojaRuta?.estado || "").toUpperCase();

      return (
        ["REALIZADA", "COMPLETADA", "FINALIZADA", "REGISTRADA"].includes(
          estadoClase,
        ) || estadoHoja === "REGISTRADA"
      );
    });

    const minutosPracticas = clasesRealizadasRows.reduce(
      (acc, clase) => acc + (Number(clase?.duracion) || 45),
      0,
    );

    const now = new Date();
    const clasesReservadas = clases.filter((clase) => {
      const estadoClase = String(clase?.estado || "").toUpperCase();
      const fechaClase = new Date(clase?.fecha);

      if (Number.isNaN(fechaClase.getTime())) {
        return false;
      }

      return (
        ["PROGRAMADA", "CONFIRMADA"].includes(estadoClase) && fechaClase >= now
      );
    }).length;

    const estadoAlumno = this.getStudentProgressStatus(
      alumno.solicitudesExamen,
      clases,
    );

    return {
      id: alumno.id,
      nombre: alumno.usuario?.nombre ?? "Alumno",
      email: alumno.usuario?.email ?? "",
      telefono: alumno.usuario?.telefono ?? "",
      tipoLicenciaObjetivo: alumno.tipoLicenciaObjetivo,
      matriculaEstado: matriculaActual?.estado ?? "PENDIENTE",
      estadoAlumno,
      clasesRealizadas: clasesRealizadasRows.length,
      clasesReservadas,
      minutosPracticas,
      horasPracticasTexto: this.formatMinutesAsHours(minutosPracticas),
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

    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    const [
      alumnosAsignados,
      vehiculosDisponibles,
      clasesConfirmadasHoy,
      roadmapTrackingRows,
    ] = await Promise.all([
      this.repository.getProfessorAssignedStudents(userId),
      this.repository.getProfessorAvailableVehicles(permisosLicencias),
      this.repository.getProfessorTodayConfirmedClasses(
        userId,
        startOfToday,
        endOfToday,
      ),
      this.repository.getProfessorRoadmapTrackingClasses(userId, now),
    ]);

    const alumnos = (alumnosAsignados || []).map((alumno) =>
      this.buildProfessorStudentSummary(alumno),
    );

    const vehiculos = (vehiculosDisponibles || []).map((vehiculo) => ({
      id: vehiculo.id,
      matricula: vehiculo.matricula,
      marca: vehiculo.marca,
      modelo: vehiculo.modelo,
      tipoPermiso: vehiculo.tipoPermiso,
      kmActuales: vehiculo.kmActuales,
      combustibleActualPct: vehiculo.combustibleActualPct,
      capacidadCombustibleLitros: getCapacidadCombustibleByPermiso(
        vehiculo.tipoPermiso,
      ),
    }));

    const alumnosMatriculaPagada = alumnos.filter(
      (alumno) => alumno.matriculaEstado === "PAGADA",
    ).length;

    const hojasRutaPendientes = (roadmapTrackingRows || []).filter((row) => {
      if (String(row?.hojaRuta?.estado || "").toUpperCase() === "REGISTRADA") {
        return false;
      }

      return !row?.hojaRuta;
    }).length;

    const hojasRutaEnCurso = (roadmapTrackingRows || []).filter((row) => {
      const estadoHoja = String(row?.hojaRuta?.estado || "").toUpperCase();
      return Boolean(row?.hojaRuta?.id) && estadoHoja !== "REGISTRADA";
    }).length;

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
        clasesConfirmadasHoy,
        hojasRutaPendientes,
        hojasRutaEnCurso,
        hojasRutaPendientesEnCurso: hojasRutaPendientes + hojasRutaEnCurso,
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

    return (alumnosAsignados || []).map((alumno) =>
      this.buildProfessorStudentSummary(alumno),
    );
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
    const examenesDGT = Array.isArray(alumno.examenesDGT)
      ? alumno.examenesDGT
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

    const dgtAprobados = examenesDGT.filter((examen) =>
      Boolean(examen.aprobado),
    ).length;
    const dgtSuspendidos = examenesDGT.length - dgtAprobados;
    const dgtPorcentajeAprobado =
      examenesDGT.length === 0 ? 0 : (dgtAprobados / examenesDGT.length) * 100;

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
          ["PROGRAMADA", "CONFIRMADA"].includes(
            String(clase.estado || "").toUpperCase(),
          ) && new Date(clase.fecha) >= new Date(),
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

    const clasesRealizadasRows = clases.filter((clase) => {
      const estadoClase = String(clase?.estado || "").toUpperCase();
      const estadoHoja = String(clase?.hojaRuta?.estado || "").toUpperCase();

      return (
        ["REALIZADA", "COMPLETADA", "FINALIZADA", "REGISTRADA"].includes(
          estadoClase,
        ) || estadoHoja === "REGISTRADA"
      );
    });

    const clasesRealizadas = clasesRealizadasRows.length;
    const minutosPracticas = clasesRealizadasRows.reduce(
      (acc, clase) => acc + (Number(clase?.duracion) || 45),
      0,
    );
    const horasPracticas = minutosPracticas / 60;
    const estadoAlumno = this.getStudentProgressStatus(
      alumno.solicitudesExamen,
      clases,
    );

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

    const solicitudesExamen = Array.isArray(alumno.solicitudesExamen)
      ? alumno.solicitudesExamen
      : [];

    const estadosPresentado = [
      "APTO",
      "NO_APTO",
      "APROBADO",
      "SUSPENDIDO",
      "SUSPENSO",
    ];

    const toUpper = (value) => String(value || "").toUpperCase();
    const isPresentedExam = (solicitud) =>
      estadosPresentado.includes(toUpper(solicitud?.estado));

    const mapExamResult = (solicitud) => {
      const errores =
        solicitud?.erroresExamen === null ||
        solicitud?.erroresExamen === undefined
          ? null
          : Number(solicitud.erroresExamen);
      const aciertosRaw =
        solicitud?.aciertosExamen === null ||
        solicitud?.aciertosExamen === undefined
          ? null
          : Number(solicitud.aciertosExamen);
      const aciertos =
        aciertosRaw !== null
          ? aciertosRaw
          : errores !== null
            ? Math.max(30 - errores, 0)
            : null;

      return {
        id: solicitud?.id,
        estado: toUpper(solicitud?.estado),
        fechaSolicitud: solicitud?.fechaSolicitud,
        fechaProgramada: solicitud?.fechaProgramada,
        aciertosExamen: aciertos,
        fallosExamen: errores,
        faltasLeves:
          solicitud?.faltasLeves === null ||
          solicitud?.faltasLeves === undefined
            ? null
            : Number(solicitud.faltasLeves),
        faltasDeficientes:
          solicitud?.faltasDeficientes === null ||
          solicitud?.faltasDeficientes === undefined
            ? null
            : Number(solicitud.faltasDeficientes),
        faltasEliminatorias:
          solicitud?.faltasEliminatorias === null ||
          solicitud?.faltasEliminatorias === undefined
            ? null
            : Number(solicitud.faltasEliminatorias),
        motivoNoApto: solicitud?.motivoNoApto || null,
      };
    };

    const examenesTeoricos = solicitudesExamen
      .filter(
        (solicitud) =>
          toUpper(solicitud?.tipo) === "TEORICO" && isPresentedExam(solicitud),
      )
      .map(mapExamResult);

    const examenesPracticos = solicitudesExamen
      .filter(
        (solicitud) =>
          toUpper(solicitud?.tipo) === "PRACTICO" && isPresentedExam(solicitud),
      )
      .map(mapExamResult);

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
        minutosPracticasCompletadas: minutosPracticas,
        horasPracticasTexto: this.formatMinutesAsHours(minutosPracticas),
      },
      estadoAlumno,
      tests: {
        total: testsTotales,
        aprobados: testsAprobados,
        suspendidos: testsSuspendidos,
        porcentajeAprobado,
      },
      dgt: {
        total: examenesDGT.length,
        aprobados: dgtAprobados,
        suspendidos: dgtSuspendidos,
        porcentajeAprobado: dgtPorcentajeAprobado,
      },
      areasRefuerzo,
      practica: {
        clasesRealizadas,
        clasesReservadas: proximasClases.length,
        proximasClases,
        minutosCompletados: minutosPracticas,
        horasCompletadasTexto: this.formatMinutesAsHours(minutosPracticas),
      },
      evaluacion: {
        estadoGeneral,
        preparadoParaTeorico,
        preparadoParaPractico,
      },
      examenes: {
        teoricos: examenesTeoricos,
        practicos: examenesPracticos,
        ultimoTeorico: examenesTeoricos[0] || null,
        ultimoPractico: examenesPracticos[0] || null,
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
      kmActuales: vehiculo.kmActuales,
      combustibleActualPct: vehiculo.combustibleActualPct,
      capacidadCombustibleLitros: getCapacidadCombustibleByPermiso(
        vehiculo.tipoPermiso,
      ),
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
        kmActuales: vehiculo.kmActuales,
        combustibleActualPct: vehiculo.combustibleActualPct,
        capacidadCombustibleLitros: getCapacidadCombustibleByPermiso(
          vehiculo.tipoPermiso,
        ),
      },
      reservas,
    };
  }

  parseWeekOffset(weekOffset) {
    const parsed = Number.parseInt(weekOffset ?? "0", 10);

    if (Number.isNaN(parsed)) {
      return 0;
    }

    return parsed;
  }

  getWeekBounds(weekOffset = 0) {
    const now = new Date();
    const weekStart = new Date(now);

    weekStart.setHours(0, 0, 0, 0);

    const dayIndex = weekStart.getDay();
    const distanceFromMonday = (dayIndex + 6) % 7;

    weekStart.setDate(
      weekStart.getDate() - distanceFromMonday + Number(weekOffset || 0) * 7,
    );

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    return {
      weekStart,
      weekEnd,
    };
  }

  timeToMinutes(time) {
    if (typeof time !== "string") {
      return Number.NaN;
    }

    const match = time.match(/^([01]\d|2[0-3]):([0-5]\d)$/);

    if (!match) {
      return Number.NaN;
    }

    const hours = Number(match[1]);
    const minutes = Number(match[2]);

    return hours * 60 + minutes;
  }

  normalizeProfessorScheduleRows(rows) {
    const grouped = Array.from({ length: 7 }, (_, index) => ({
      diaSemana: index + 1,
      bloques: [],
    }));

    for (const row of rows || []) {
      const day = grouped[row.diaSemana - 1];

      if (!day) {
        continue;
      }

      const inicioMinutos = this.timeToMinutes(row.horaInicio);
      const finMinutos = this.timeToMinutes(row.horaFin);

      day.bloques.push({
        id: row.id,
        horaInicio: row.horaInicio,
        horaFin: row.horaFin,
        duracionMinutos:
          Number.isNaN(inicioMinutos) || Number.isNaN(finMinutos)
            ? 0
            : finMinutos - inicioMinutos,
      });
    }

    return grouped.map((day) => ({
      ...day,
      bloques: day.bloques.sort((a, b) =>
        a.horaInicio.localeCompare(b.horaInicio),
      ),
    }));
  }

  validateWorkScheduleBlocks(blocks) {
    if (!Array.isArray(blocks)) {
      throw new Error("El horario debe enviarse como una lista de bloques");
    }

    const normalized = blocks.map((block, index) => {
      const diaSemana = Number(block?.diaSemana);
      const horaInicio = String(block?.horaInicio || "").trim();
      const horaFin = String(block?.horaFin || "").trim();

      if (!Number.isInteger(diaSemana) || diaSemana < 1 || diaSemana > 7) {
        throw new Error(
          `El bloque ${index + 1} tiene un día inválido. Usa valores entre 1 y 7`,
        );
      }

      const inicioMinutos = this.timeToMinutes(horaInicio);
      const finMinutos = this.timeToMinutes(horaFin);

      if (Number.isNaN(inicioMinutos) || Number.isNaN(finMinutos)) {
        throw new Error(
          `El bloque ${index + 1} debe usar el formato de hora HH:mm`,
        );
      }

      if (inicioMinutos >= finMinutos) {
        throw new Error(
          `El bloque ${index + 1} debe tener una hora de fin posterior a la de inicio`,
        );
      }

      return {
        diaSemana,
        horaInicio,
        horaFin,
        inicioMinutos,
        finMinutos,
      };
    });

    const byDay = new Map();

    for (const block of normalized) {
      const list = byDay.get(block.diaSemana) || [];
      list.push(block);
      byDay.set(block.diaSemana, list);
    }

    for (const [diaSemana, dayBlocks] of byDay.entries()) {
      const sorted = [...dayBlocks].sort(
        (a, b) => a.inicioMinutos - b.inicioMinutos,
      );

      let totalMinutes = 0;

      for (let index = 0; index < sorted.length; index += 1) {
        const block = sorted[index];

        totalMinutes += block.finMinutos - block.inicioMinutos;

        const next = sorted[index + 1];
        if (next && block.finMinutos > next.inicioMinutos) {
          throw new Error(
            `Los bloques del día ${diaSemana} se solapan. Revísalos antes de guardar`,
          );
        }
      }

      if (totalMinutes > 480) {
        throw new Error(
          `El día ${diaSemana} supera las 8 horas máximas de trabajo`,
        );
      }
    }

    return normalized.map((block) => ({
      diaSemana: block.diaSemana,
      horaInicio: block.horaInicio,
      horaFin: block.horaFin,
    }));
  }

  deriveProfessorAgendaStatus(clase, now = new Date()) {
    const roadmapStatus = String(clase?.hojaRuta?.estado || "").toUpperCase();

    if (roadmapStatus === "REGISTRADA") {
      return "REGISTRADA";
    }

    if (clase?.hojaRuta?.id) {
      return "EN_CURSO";
    }

    const classDate = new Date(clase?.fecha);
    if (!Number.isNaN(classDate.getTime()) && classDate <= now) {
      return "PENDIENTE_REGISTRO";
    }

    return clase?.estado || "PROGRAMADA";
  }

  mapProfessorAgendaClass(clase, now = new Date()) {
    return {
      id: clase.id,
      fecha: clase.fecha,
      duracion: clase.duracion,
      estado: clase.estado,
      estadoAgenda: this.deriveProfessorAgendaStatus(clase, now),
      alumno: {
        id: clase.alumnoId,
        nombre: clase.alumno?.usuario?.nombre ?? "Alumno",
      },
      vehiculo: clase.vehiculo
        ? {
            matricula: clase.vehiculo.matricula,
            marca: clase.vehiculo.marca,
            modelo: clase.vehiculo.modelo,
            tipoPermiso: clase.vehiculo.tipoPermiso,
          }
        : null,
    };
  }

  async getProfessorAgenda(userId, weekOffsetInput) {
    const profile = await this.repository.getProfessorProfile(userId);

    if (!profile) {
      throw new Error("Profesor no encontrado");
    }

    const weekOffset = this.parseWeekOffset(weekOffsetInput);
    const { weekStart, weekEnd } = this.getWeekBounds(weekOffset);

    const [scheduleRows, clases] = await Promise.all([
      this.repository.getProfessorWorkSchedule(userId),
      this.repository.getProfessorScheduledClassesBetween(
        userId,
        weekStart,
        weekEnd,
      ),
    ]);

    const now = new Date();

    return {
      semana: {
        offset: weekOffset,
        inicio: weekStart,
        fin: weekEnd,
      },
      horario: this.normalizeProfessorScheduleRows(scheduleRows),
      clases: (clases || []).map((clase) =>
        this.mapProfessorAgendaClass(clase, now),
      ),
    };
  }

  async updateProfessorWorkSchedule(userId, bloques) {
    const profile = await this.repository.getProfessorProfile(userId);

    if (!profile) {
      throw new Error("Profesor no encontrado");
    }

    const normalizedBlocks = this.validateWorkScheduleBlocks(bloques);

    const saved = await this.repository.replaceProfessorWorkSchedule(
      userId,
      normalizedBlocks,
    );

    return {
      horario: this.normalizeProfessorScheduleRows(saved),
    };
  }

  async updateProfessorClassStatus(userId, classId, estado) {
    const profile = await this.repository.getProfessorProfile(userId);

    if (!profile) {
      throw new Error("Profesor no encontrado");
    }

    if (!["CONFIRMADA", "CANCELADA"].includes(estado)) {
      throw new Error(
        "Estado inválido. Solo se permite CONFIRMADA o CANCELADA",
      );
    }

    const clase = await this.repository.findProfessorClassById(userId, classId);

    if (!clase) {
      throw new Error("Clase no encontrada o no asignada a este profesor");
    }

    if (clase.estado !== "PROGRAMADA") {
      throw new Error(
        "Solo se pueden confirmar o cancelar clases en estado PROGRAMADA",
      );
    }

    const updated = await this.repository.updateProfessorClassStatus(
      classId,
      estado,
    );

    return this.mapProfessorAgendaClass(updated);
  }

  async getDgtSuccessRate() {
    const total = await this.repository.getTotalDgtTests();

    const aprobados = await this.repository.getDgtApprovedTests();

    if (total === 0) {
      return 0;
    }

    return (aprobados / total) * 100;
  }

  async getTopStudentsRanking() {
    const alumnos = await this.repository.getTopStudentsDGT();

    const ranked = alumnos
      .map((alumno) => {
        const examenes = alumno.examenesDGT || [];

        const aprobados = examenes.filter((e) => e.aprobado).length;

        const porcentaje =
          examenes.length === 0 ? 0 : (aprobados / examenes.length) * 100;

        return {
          nombre: alumno.usuario?.nombre,
          licencia: alumno.tipoLicenciaObjetivo || "-",
          totalTests: examenes.length,
          aprobados,
          porcentaje,
        };
      })
      .filter((a) => a.totalTests > 0)
      .sort((a, b) => {
        if (b.porcentaje !== a.porcentaje) {
          return b.porcentaje - a.porcentaje;
        }

        return b.totalTests - a.totalTests;
      });

    if (ranked.length <= 5) {
      return ranked;
    }

    const fifth = ranked[4];

    const extended = ranked.slice(0, 5);

    for (let index = 5; index < ranked.length; index += 1) {
      const current = ranked[index];

      if (current.porcentaje !== fifth.porcentaje) {
        break;
      }

      extended.push(current);
    }

    return extended;
  }

  async getProfessorRanking() {
    const profesores = await this.repository.getProfessorRanking();

    const ranked = profesores
      .map((profesor) => {
        const resultados = (profesor.alumnosAsignados || []).flatMap(
          (alumno) => alumno.solicitudesExamen || [],
        );

        const presentados = resultados.length;
        const aprobados = resultados.filter(
          (resultado) => resultado.estado === "APTO",
        ).length;
        const porcentaje =
          presentados === 0 ? 0 : (aprobados / presentados) * 100;

        return {
          nombre: profesor.usuario?.nombre ?? "Profesor",
          licencia: profesor.permisosLicencias?.[0] || "-",
          totalTests: presentados,
          aprobados,
          porcentaje,
        };
      })
      .filter((profesor) => profesor.totalTests > 0)
      .sort((a, b) => {
        if (b.porcentaje !== a.porcentaje) {
          return b.porcentaje - a.porcentaje;
        }

        return b.totalTests - a.totalTests;
      });

    if (ranked.length <= 5) {
      return ranked;
    }

    const fifth = ranked[4];

    const extended = ranked.slice(0, 5);

    for (let index = 5; index < ranked.length; index += 1) {
      const current = ranked[index];

      if (current.porcentaje !== fifth.porcentaje) {
        break;
      }

      extended.push(current);
    }

    return extended;
  }

  async getDgtEvolution() {
    const exams = await this.repository.getDgtTestsEvolution();

    const meses = {};

    exams.forEach((exam) => {
      const fecha = new Date(exam.fecha);

      const key = `${fecha.getFullYear()}-${String(
        fecha.getMonth() + 1,
      ).padStart(2, "0")}`;

      if (!meses[key]) {
        meses[key] = {
          mes: key,
          realizados: 0,
          aprobados: 0,
        };
      }

      meses[key].realizados++;

      if (exam.aprobado) {
        meses[key].aprobados++;
      }
    });

    return Object.values(meses);
  }
}
