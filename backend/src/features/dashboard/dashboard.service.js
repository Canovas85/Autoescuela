import { getCapacidadCombustibleByPermiso } from "../../shared/utils/vehiculo-combustible.js";
import { resolveExpedientePhase } from "../../shared/domain/expediente-phase.js";
import {
  evaluateVehicleItvStatus,
  getItvPriceByPermiso,
} from "../../shared/domain/vehiculo-itv.js";

export class DashboardService {
  constructor(repository) {
    this.repository = repository;
  }

  async buildVehicleItvStatus(vehiculo) {
    const now = new Date();
    const latestItvExpense =
      await this.repository.findLatestItvExpenseByVehiculoId(vehiculo.id);
    const referenceDate =
      latestItvExpense?.createdAt || vehiculo?.createdAt || now;
    const kmBase = Number(latestItvExpense?.kilometrosVehiculo || 0);
    const completedClassesSinceReference =
      await this.repository.countCompletedClassesByVehiculoSince(
        vehiculo.id,
        referenceDate,
        now,
      );

    const status = evaluateVehicleItvStatus({
      vehiculo,
      referenceDate,
      kmBase,
      completedClassesSinceReference,
      now,
    });

    return {
      pendiente: status.pendiente,
      motivos: status.motivos,
      precioRevision: getItvPriceByPermiso(vehiculo.tipoPermiso),
      fechaLimiteRevision: status.fechaLimiteRevision,
    };
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
    try {
      await this.repository.syncPastConfirmedBonusClassesForUser?.(
        userId,
        new Date(),
      );
    } catch (error) {
      if (!(error instanceof TypeError)) {
        throw error;
      }
    }

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

    const clases = dashboard.clases || [];
    const clasesRealizadasRows = clases.filter((clase) =>
      this.isCompletedPracticalClass(clase),
    );
    const clasesRealizadas = clasesRealizadasRows.length;

    const clasesConsumidasRows = clases.filter((clase) => {
      if (this.isCompletedPracticalClass(clase)) {
        return true;
      }

      return this.isPastRequestedPracticalClass(clase, fechaActual);
    });

    const clasesPendientesConfirmacion = clases.filter((clase) => {
      const estadoClase = String(clase?.estado || "").toUpperCase();
      const fechaClase = new Date(clase?.fecha);

      if (Number.isNaN(fechaClase.getTime())) {
        return false;
      }

      return estadoClase === "PROGRAMADA" && fechaClase >= fechaActual;
    });

    const clasesConfirmadasProfesor = clases.filter((clase) => {
      const estadoClase = String(clase?.estado || "").toUpperCase();
      const fechaClase = new Date(clase?.fecha);

      if (Number.isNaN(fechaClase.getTime())) {
        return false;
      }

      return estadoClase === "CONFIRMADA" && fechaClase >= fechaActual;
    });

    const clasesSolicitadasTotales =
      clasesPendientesConfirmacion.length + clasesConfirmadasProfesor.length;

    const bonos = (dashboard.bonos || []).map((bonoCompra) => {
      const clasesBono = clases.filter(
        (clase) => clase.compraBonoId === bonoCompra.id,
      );
      const clasesBonoConsumidas = clasesBono.filter((clase) => {
        if (this.isCompletedPracticalClass(clase)) {
          return true;
        }

        return this.isPastRequestedPracticalClass(clase, fechaActual);
      }).length;
      const clasesBonoSolicitadas = clasesBono.filter((clase) => {
        const estadoClase = String(clase?.estado || "").toUpperCase();
        const fechaClase = new Date(clase?.fecha);

        if (Number.isNaN(fechaClase.getTime())) {
          return false;
        }

        return (
          ["PROGRAMADA", "CONFIRMADA"].includes(estadoClase) &&
          fechaClase >= fechaActual
        );
      }).length;

      const clasesDisponibles = Math.max(
        bonoCompra.clasesCompradas - clasesBonoConsumidas,
        0,
      );
      const clasesDisponiblesContandoSolicitadas = Math.max(
        clasesDisponibles - clasesBonoSolicitadas,
        0,
      );

      return {
        id: bonoCompra.id,
        nombre: bonoCompra.bono?.nombre ?? "Bono",
        descripcion: bonoCompra.bono?.descripcion ?? null,
        clasesCompradas: bonoCompra.clasesCompradas,
        clasesConsumidas: clasesBonoConsumidas,
        clasesSolicitadas: clasesBonoSolicitadas,
        clasesDisponibles,
        clasesDisponiblesContandoSolicitadas,
        pagado: Boolean(bonoCompra.pagado),
        fechaCompra: bonoCompra.fechaCompra,
        fechaValidezHasta: bonoCompra.fechaValidezHasta,
        estado: this.construirEstadoBono(
          {
            ...bonoCompra,
            clasesConsumidas: clasesBonoConsumidas,
          },
          fechaActual,
        ),
        aplicable:
          Boolean(bonoCompra.pagado) &&
          clasesDisponiblesContandoSolicitadas > 0 &&
          new Date(bonoCompra.fechaValidezHasta) >= fechaActual,
      };
    });

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
      const fechaInicioCobertura =
        ultimoPagoDgtPagado.fechaPago ||
        ultimoPagoDgtPagado.fechaCreacion ||
        new Date();

      const consumidasPago = Number(
        ultimoPagoDgtPagado.convocatoriasConsumidas || 0,
      );
      const consumidasReales =
        typeof this.repository.countStudentExamSuspensosFromDate === "function"
          ? await this.repository.countStudentExamSuspensosFromDate(
              userId,
              fechaInicioCobertura,
            )
          : 0;

      convocatoriasConsumidas = Math.max(consumidasPago, consumidasReales);
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

    const estadoAlumno = this.getStudentProgressStatus(
      examenes,
      clases,
      dashboard.profile.alumno.estadoExpediente,
      matriculaActual?.estado,
    );

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
        clasesReservadas: clasesSolicitadasTotales,
        clasesSolicitadasTotales,
        clasesConfirmadasProfesor: clasesConfirmadasProfesor.length,
        clasesPendientesConfirmacion: clasesPendientesConfirmacion.length,
        clasesRealizadas,
        clasesConsumidas: clasesConsumidasRows.length,
      },
      bonos,
      examenes: {
        teoricos: examenes.filter((examen) => examen.tipo === "TEORICO"),
        practicos: examenes.filter((examen) => examen.tipo === "PRACTICO"),
      },
      reservas: [...clasesConfirmadasProfesor, ...clasesPendientesConfirmacion],
      estadoAlumno,
      evolucion,
      resumen: {
        matricula: matriculaPagada ? "PAGADA" : "PENDIENTE",
        preparadoParaTeorico,
        porcentajeAprobado,
        pagoTasaPendiente: Boolean(pagoDgtPendiente),
      },
    };
  }

  getMonthKey(dateValue) {
    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return `${date.getFullYear()}-${date.getMonth()}`;
  }

  buildLastMonthsPeriods(months = 6, now = new Date()) {
    return Array.from({ length: months }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
      return {
        key: `${date.getFullYear()}-${date.getMonth()}`,
        mes: this.formatearMes(date),
      };
    }).reverse();
  }

  buildMonthlyEnrollmentSeries(rows = [], months = 6) {
    const periods = this.buildLastMonthsPeriods(months);
    const totalsByKey = new Map(periods.map((period) => [period.key, 0]));

    for (const row of rows) {
      const key = this.getMonthKey(row?.fechaPago);

      if (!key || !totalsByKey.has(key)) {
        continue;
      }

      totalsByKey.set(key, (totalsByKey.get(key) || 0) + 1);
    }

    return periods.map((period) => ({
      mes: period.mes,
      total: totalsByKey.get(period.key) || 0,
    }));
  }

  buildMonthlyExamEvolution(rows = [], months = 6) {
    const periods = this.buildLastMonthsPeriods(months);
    const totalsByKey = new Map(
      periods.map((period) => [period.key, { apto: 0, noApto: 0 }]),
    );

    for (const row of rows) {
      const date = row?.fechaProgramada || row?.fechaSolicitud;
      const key = this.getMonthKey(date);

      if (!key || !totalsByKey.has(key)) {
        continue;
      }

      const bucket = totalsByKey.get(key);
      const estado = String(row?.estado || "").toUpperCase();

      if (estado === "APTO") {
        bucket.apto += 1;
      } else if (estado === "NO_APTO") {
        bucket.noApto += 1;
      }
    }

    return periods.map((period) => {
      const bucket = totalsByKey.get(period.key) || { apto: 0, noApto: 0 };
      const total = bucket.apto + bucket.noApto;

      return {
        mes: period.mes,
        apto: bucket.apto,
        noApto: bucket.noApto,
        total,
        tasaExito: total === 0 ? 0 : (bucket.apto / total) * 100,
      };
    });
  }

  buildDonutRowsByName(rows = [], getName, getOwnerId = null) {
    const counts = new Map();
    const uniqueByTypeAndOwner = new Set();

    for (const row of rows) {
      const name = String(getName(row) || "").trim() || "Sin nombre";

      if (typeof getOwnerId === "function") {
        const ownerId = String(getOwnerId(row) || "").trim();

        if (ownerId) {
          const ownerKey = `${name}::${ownerId}`;

          if (uniqueByTypeAndOwner.has(ownerKey)) {
            continue;
          }

          uniqueByTypeAndOwner.add(ownerKey);
        }
      }

      counts.set(name, (counts.get(name) || 0) + 1);
    }

    return Array.from(counts.entries()).map(([name, value]) => ({
      name,
      value,
    }));
  }

  calcSuccessRate(apto, noApto) {
    const total = apto + noApto;

    if (total === 0) {
      return 0;
    }

    return (apto / total) * 100;
  }

  async getExecutiveDashboard() {
    const now = new Date();
    const { start: startMonth, end: endMonth } =
      this.repository.getCurrentMonthRange();
    const startSixMonths = new Date(
      now.getFullYear(),
      now.getMonth() - 5,
      1,
      0,
      0,
      0,
      0,
    );

    const [
      activeStudents,
      activeEnrollments,
      scheduledClasses,
      pendingClassConfirmations,
      pendingClassHours,
      pendingExams,
      matriculasPagadasMes,
      matriculasPagadasHistorico,
      matriculasPendientesMes,
      matriculasPendientesHistorico,
      aprobadosTeoricoMes,
      aprobadosTeoricoHistorico,
      aprobadosPracticoMes,
      aprobadosPracticoHistorico,
      examsThisMonth,
      successRate,
      monthlySuccessRate,
      dgtTestsToday,
      dgtTestsThisMonth,
      dgtSuccessRate,
      totalDgtTests,
      topStudents,
      topProfessors,
      topProfesorByClasses,
      topProfesorByHours,
      dgtEvolution,
      totalAlumnosActivos,
      totalAlumnosLicenciados,
      totalAlumnosMatriculaPendientePago,
      matriculasPagadasUltimosMeses,
      totalProfesoresActivos,
      totalAdministrativosActivos,
      totalSoportesActivos,
      promocionesActivasVigentes,
      comprasPromocionMes,
      bonosActivos,
      comprasBonoMes,
      clasesCompletadasTotal,
      clasesSolicitadasTotal,
      clasesCompletadasMes,
      clasesSolicitadasMes,
      clasesPagadasFueraBono,
      teoricoNoAptoMes,
      teoricoAptoHistorico,
      teoricoNoAptoHistorico,
      practicoNoAptoMes,
      practicoAptoHistorico,
      practicoNoAptoHistorico,
      evaluacionesPendientesTeorico,
      evaluacionesPendientesPractico,
      examenesTeoricoUltimosMeses,
      examenesPracticoUltimosMeses,
      approvedDgtTests,
    ] = await Promise.all([
      this.repository.getTotalAlumnosActivos(),
      this.repository.getTotalMatriculasActivas(),
      this.repository.getTotalClasesProgramadas(),
      this.repository.getPendingClassConfirmations(),
      this.repository.getPendingClassHours(),
      this.repository.getTotalExamenesPendientes(),
      this.repository.getMatriculasPagadasMes(),
      this.repository.getMatriculasPagadasHistorico(),
      this.repository.getMatriculasPendientesMes(),
      this.repository.getMatriculasPendientesHistorico(),
      this.repository.getAprobadosTeoricoMes(),
      this.repository.getAprobadosTeoricoHistorico(),
      this.repository.getAprobadosPracticoMes(),
      this.repository.getAprobadosPracticoHistorico(),
      this.repository.getExamenesEsteMes(),
      this.getTasaExito(),
      this.getPorcentajeExitoMensual(),
      this.repository.getDgtTestsToday(),
      this.repository.getDgtTestsThisMonth(),
      this.getDgtSuccessRate(),
      this.repository.getTotalDgtTests(),
      this.getTopStudentsRanking(),
      this.getProfessorRanking(),
      this.getTopProfesorPorClases(),
      this.getTopProfesorPorHoras(),
      this.getDgtEvolution(),
      this.repository.getTotalAlumnosActivos(),
      this.repository.getTotalAlumnosLicenciadosActivos(),
      this.repository.getTotalAlumnosConMatriculaPendientePago(),
      this.repository.getMatriculasPagadasSince(startSixMonths),
      this.repository.getTotalProfesoresActivos(),
      this.repository.getTotalAdministrativosActivos(),
      this.repository.getTotalSoportesActivos(),
      this.repository.getPromocionesActivasVigentes(now),
      this.repository.getComprasPromocionPagadasMesActual(),
      this.repository.getBonosActivos(),
      this.repository.getComprasBonoPagadasMesActual(),
      this.repository.countClasesPracticasCompletadas(),
      this.repository.countClasesPracticasSolicitadas(),
      this.repository.countClasesPracticasCompletadas({
        start: startMonth,
        end: endMonth,
      }),
      this.repository.countClasesPracticasSolicitadas({
        start: startMonth,
        end: endMonth,
      }),
      this.repository.countClasesPagadasFueraBono(),
      this.repository.countSolicitudesExamenByResultado("TEORICO", "NO_APTO", {
        start: startMonth,
        end: endMonth,
      }),
      this.repository.countSolicitudesExamenByResultado("TEORICO", "APTO"),
      this.repository.countSolicitudesExamenByResultado("TEORICO", "NO_APTO"),
      this.repository.countSolicitudesExamenByResultado("PRACTICO", "NO_APTO", {
        start: startMonth,
        end: endMonth,
      }),
      this.repository.countSolicitudesExamenByResultado("PRACTICO", "APTO"),
      this.repository.countSolicitudesExamenByResultado("PRACTICO", "NO_APTO"),
      this.repository.countSolicitudesExamenPendientesFuturas("TEORICO", now),
      this.repository.countSolicitudesExamenPendientesFuturas("PRACTICO", now),
      this.repository.getSolicitudesExamenConResultadoDesde(
        "TEORICO",
        startSixMonths,
      ),
      this.repository.getSolicitudesExamenConResultadoDesde(
        "PRACTICO",
        startSixMonths,
      ),
      this.repository.getDgtApprovedTests(),
    ]);

    const promoDonutRaw = this.buildDonutRowsByName(
      comprasPromocionMes,
      (row) => row?.promocion?.nombre,
      (row) => row?.alumnoId,
    );
    const bonoDonutRaw = this.buildDonutRowsByName(
      comprasBonoMes,
      (row) => row?.compraBono?.bono?.nombre,
      (row) => row?.alumnoId,
    );

    const promoDonut = promoDonutRaw.length > 0 ? promoDonutRaw : [];
    const bonoDonut = bonoDonutRaw.length > 0 ? bonoDonutRaw : [];

    const teoricoPresentadosMes = aprobadosTeoricoMes + teoricoNoAptoMes;
    const practicoPresentadosMes = aprobadosPracticoMes + practicoNoAptoMes;
    const teoricoPresentadosHistorico =
      teoricoAptoHistorico + teoricoNoAptoHistorico;
    const practicoPresentadosHistorico =
      practicoAptoHistorico + practicoNoAptoHistorico;
    const alumnosMatriculadosExclusivos = Math.max(
      Number(totalAlumnosActivos || 0) -
        Number(totalAlumnosLicenciados || 0) -
        Number(totalAlumnosMatriculaPendientePago || 0),
      0,
    );

    return {
      activeStudents,
      activeEnrollments,
      scheduledClasses,
      pendingClassConfirmations,
      pendingClassHours,
      pendingExams,
      matriculasPagadasMes,
      matriculasPagadasHistorico,
      matriculasPendientesMes,
      matriculasPendientesHistorico,
      aprobadosTeoricoMes,
      aprobadosTeoricoHistorico,
      aprobadosPracticoMes,
      aprobadosPracticoHistorico,
      examsThisMonth,
      successRate,
      monthlySuccessRate,
      dgtTestsToday,
      dgtTestsThisMonth,
      dgtSuccessRate,
      totalDgtTests,
      topStudents,
      topProfessors,
      topProfesorByClasses,
      topProfesorByHours,
      dgtEvolution,

      adminOverview: {
        matriculasAlumnos: {
          alumnosRegistrados: totalAlumnosActivos,
          alumnosLicenciados: totalAlumnosLicenciados,
          alumnosMatriculados: alumnosMatriculadosExclusivos,
          alumnosMatriculaPendientePago: totalAlumnosMatriculaPendientePago,
          matriculadosPorMes: this.buildMonthlyEnrollmentSeries(
            matriculasPagadasUltimosMeses,
          ),
        },
        usuarios: {
          profesoresRegistrados: totalProfesoresActivos,
          administrativosRegistrados: totalAdministrativosActivos,
          soportesRegistrados: totalSoportesActivos,
        },
        promociones: {
          items: promocionesActivasVigentes,
          comprasMesPorPromocion: promoDonut,
        },
        bonos: {
          items: bonosActivos,
          comprasMesPorBono: bonoDonut,
        },
        clasesPracticas: {
          clasesTotales: clasesCompletadasTotal + clasesSolicitadasTotal,
          clasesCompletadasMes,
          clasesSolicitadasMes,
          clasesPagadasFueraBono,
        },
        evaluaciones: {
          teorico: {
            aptoMes: aprobadosTeoricoMes,
            aptoHistorico: teoricoAptoHistorico,
            noAptoMes: teoricoNoAptoMes,
            noAptoHistorico: teoricoNoAptoHistorico,
            presentadosMes: teoricoPresentadosMes,
            presentadosHistorico: teoricoPresentadosHistorico,
            tasaExitoMes: this.calcSuccessRate(
              aprobadosTeoricoMes,
              teoricoNoAptoMes,
            ),
            tasaExitoHistorico: this.calcSuccessRate(
              teoricoAptoHistorico,
              teoricoNoAptoHistorico,
            ),
            pendientes: evaluacionesPendientesTeorico,
            evolucion: this.buildMonthlyExamEvolution(
              examenesTeoricoUltimosMeses,
            ),
          },
          practico: {
            aptoMes: aprobadosPracticoMes,
            aptoHistorico: practicoAptoHistorico,
            noAptoMes: practicoNoAptoMes,
            noAptoHistorico: practicoNoAptoHistorico,
            presentadosMes: practicoPresentadosMes,
            presentadosHistorico: practicoPresentadosHistorico,
            tasaExitoMes: this.calcSuccessRate(
              aprobadosPracticoMes,
              practicoNoAptoMes,
            ),
            tasaExitoHistorico: this.calcSuccessRate(
              practicoAptoHistorico,
              practicoNoAptoHistorico,
            ),
            pendientes: evaluacionesPendientesPractico,
            evolucion: this.buildMonthlyExamEvolution(
              examenesPracticoUltimosMeses,
            ),
          },
        },
      },

      dgtSummary: {
        total: totalDgtTests,
        aprobados: approvedDgtTests,
        suspendidos: totalDgtTests - approvedDgtTests,
      },
    };
  }

  async getAdministrativeDashboard() {
    return this.getExecutiveDashboard();
  }

  async getSupportDashboard() {
    const rolesGestionables = ["ADMIN", "ADMINISTRATIVO", "SOPORTE"];

    const [
      totalUsuariosInternos,
      usuariosInternosActivos,
      usuariosInternosInactivos,
      usuariosSoporte,
      usuariosAdministrativos,
      ultimosReseteos,
    ] = await Promise.all([
      this.repository.countUsuariosByRoles(rolesGestionables),
      this.repository.countUsuariosByRolesAndActive(rolesGestionables, true),
      this.repository.countUsuariosByRolesAndActive(rolesGestionables, false),
      this.repository.countUsuariosByRoles(["SOPORTE"]),
      this.repository.countUsuariosByRoles(["ADMINISTRATIVO"]),
      this.repository.getRecentPasswordResetAudits(10),
    ]);

    return {
      totalUsuariosInternos,
      usuariosInternosActivos,
      usuariosInternosInactivos,
      usuariosSoporte,
      usuariosAdministrativos,
      ultimosReseteos,
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

  getStudentProgressStatus(
    solicitudesExamen = [],
    clases = [],
    estadoExpediente = null,
    matriculaEstado = null,
  ) {
    const phase = resolveExpedientePhase({
      estadoExpediente,
      matriculaEstado,
      solicitudesExamen,
      clases,
    });

    return {
      label: phase.label,
      codigo: phase.code,
      ok: [
        "TEORICO_APROBADO",
        "PREPARANDO_PRACTICO",
        "LICENCIA_OBTENIDA",
      ].includes(phase.code),
    };
  }

  isCompletedPracticalClass(clase) {
    const estadoClase = String(clase?.estado || "").toUpperCase();
    const estadoHoja = String(clase?.hojaRuta?.estado || "").toUpperCase();

    return (
      ["REALIZADA", "COMPLETADA", "FINALIZADA", "REGISTRADA"].includes(
        estadoClase,
      ) || estadoHoja === "REGISTRADA"
    );
  }

  isRequestedPracticalClass(clase) {
    const estadoClase = String(clase?.estado || "").toUpperCase();
    return ["PROGRAMADA", "CONFIRMADA"].includes(estadoClase);
  }

  isPastRequestedPracticalClass(clase, now) {
    if (!this.isRequestedPracticalClass(clase)) {
      return false;
    }

    const fechaClase = new Date(clase?.fecha);

    if (Number.isNaN(fechaClase.getTime())) {
      return false;
    }

    return fechaClase < now;
  }

  buildProfessorStudentHistory(actividad = null) {
    if (!actividad) {
      return [];
    }

    const rows = [];

    const pushEvent = ({
      id,
      fecha,
      accion,
      categoria,
      resumen,
      detalle,
      detalleHabilitado = false,
    }) => {
      const parsedDate = new Date(fecha || 0);

      if (Number.isNaN(parsedDate.getTime())) {
        return;
      }

      rows.push({
        id,
        fecha: parsedDate.toISOString(),
        accion,
        categoria,
        resumen,
        detalle: detalle || null,
        detalleHabilitado: Boolean(detalleHabilitado),
      });
    };

    pushEvent({
      id: `registro-${actividad.id}`,
      fecha: actividad.usuario?.fechaCreacion,
      accion: "Registro en la autoescuela",
      categoria: "ALTA",
      resumen: "Alta inicial del alumno en el sistema",
      detalle: {
        alumno: actividad.usuario?.nombre || "Alumno",
      },
    });

    for (const matricula of actividad.matriculas || []) {
      pushEvent({
        id: `matricula-creada-${matricula.id}`,
        fecha: matricula.fechaCreacion,
        accion: "Matrícula creada",
        categoria: "MATRICULA",
        resumen: `Licencia ${matricula.licencia || "-"}`,
        detalle: {
          estado: matricula.estado,
          licencia: matricula.licencia,
        },
      });

      if (
        matricula.fechaPago ||
        String(matricula.estado || "").toUpperCase() === "PAGADA"
      ) {
        pushEvent({
          id: `matricula-pagada-${matricula.id}`,
          fecha: matricula.fechaPago || matricula.fechaCreacion,
          accion: "Pago de matrícula",
          categoria: "MATRICULA",
          resumen: `Matrícula pagada (${matricula.licencia || "-"})`,
          detalle: {
            estado: matricula.estado,
            licencia: matricula.licencia,
          },
        });
      }
    }

    for (const pago of actividad.pagos || []) {
      if (String(pago?.estado || "").toUpperCase() !== "PAGADO") {
        continue;
      }

      const pagoTipo = String(pago?.tipo || "").toUpperCase();
      const accion =
        pagoTipo === "TASA_DGT_21"
          ? "Pago de tasa DGT"
          : pagoTipo === "MATRICULA"
            ? "Pago de matrícula"
            : "Pago registrado";

      pushEvent({
        id: `pago-${pago.id}`,
        fecha: pago.fechaPago || pago.fechaCreacion,
        accion,
        categoria: "PAGO",
        resumen: `${pago.concepto || "Sin concepto"} (${Number(pago.importe || 0).toFixed(2)} EUR)`,
        detalleHabilitado: true,
        detalle: {
          tipo: pago.tipo,
          concepto: pago.concepto,
          permiso: pago.permiso,
          importe: Number(pago.importe || 0),
          convocatoriasIncluidas: pago.convocatoriasIncluidas,
          convocatoriasConsumidas: pago.convocatoriasConsumidas,
        },
      });
    }

    for (const compra of actividad.bonosComprados || []) {
      const clasesRestantes = Math.max(
        Number(compra?.clasesCompradas || 0) -
          Number(compra?.clasesConsumidas || 0),
        0,
      );

      pushEvent({
        id: `bono-${compra.id}`,
        fecha: compra.fechaCompra,
        accion: "Compra de bono",
        categoria: "BONO",
        resumen: `${compra.bono?.nombre || "Bono"} | Restantes: ${clasesRestantes}`,
        detalle: {
          nombreBono: compra.bono?.nombre || "Bono",
          licencia: compra.bono?.licencia || "-",
          pagado: Boolean(compra.pagado),
          clasesCompradas: Number(compra.clasesCompradas || 0),
          clasesConsumidas: Number(compra.clasesConsumidas || 0),
          clasesRestantes,
          fechaValidezHasta: compra.fechaValidezHasta,
        },
      });
    }

    for (const clase of actividad.clases || []) {
      if (!this.isCompletedPracticalClass(clase)) {
        continue;
      }

      pushEvent({
        id: `clase-${clase.id}`,
        fecha: clase.fecha,
        accion: "Clase práctica realizada",
        categoria: "PRACTICA",
        resumen: `${Number(clase.duracion || 0)} min | Vehículo ${clase.vehiculo?.matricula || "-"}`,
        detalleHabilitado:
          String(clase?.hojaRuta?.estado || "").toUpperCase() === "REGISTRADA",
        detalle: {
          duracion: Number(clase.duracion || 0),
          estado: clase.estado,
          matriculaVehiculo: clase.vehiculo?.matricula || "-",
          licenciaVehiculo: clase.vehiculo?.tipoPermiso || "-",
        },
      });
    }

    for (const test of actividad.testsPractica || []) {
      if (String(test?.resultado || "").toUpperCase() !== "APROBADO") {
        continue;
      }

      pushEvent({
        id: `test-aprobado-${test.id}`,
        fecha: test.fecha,
        accion: "Test teórico aprobado",
        categoria: "TEORIA",
        resumen: test.temario?.titulo || "Test de teoría",
        detalle: {
          resultado: test.resultado,
          temario: test.temario?.titulo || null,
        },
      });
    }

    for (const solicitud of actividad.solicitudesExamen || []) {
      const estado = String(solicitud?.estado || "").toUpperCase();
      const tipo = String(solicitud?.tipo || "").toUpperCase();

      if (
        !["APTO", "NO_APTO", "SUSPENDIDO", "SUSPENSO", "APROBADO"].includes(
          estado,
        )
      ) {
        continue;
      }

      const esAprobado = ["APTO", "APROBADO"].includes(estado);
      const tipoLabel = tipo === "PRACTICO" ? "práctico" : "teórico";

      pushEvent({
        id: `solicitud-${solicitud.id}`,
        fecha: solicitud.fechaProgramada || solicitud.fechaSolicitud,
        accion: `Examen ${tipoLabel} ${esAprobado ? "aprobado" : "no apto"}`,
        categoria: "EXAMEN",
        resumen: `Resultado ${estado}`,
        detalleHabilitado: true,
        detalle: {
          tipo,
          estado,
          erroresExamen:
            solicitud?.erroresExamen === null ||
            solicitud?.erroresExamen === undefined
              ? null
              : Number(solicitud.erroresExamen),
          aciertosExamen:
            solicitud?.aciertosExamen === null ||
            solicitud?.aciertosExamen === undefined
              ? null
              : Number(solicitud.aciertosExamen),
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
          fechaSolicitud: solicitud.fechaSolicitud,
          fechaProgramada: solicitud.fechaProgramada,
        },
      });
    }

    for (const examenDgt of actividad.examenesDGT || []) {
      if (!examenDgt.aprobado) {
        continue;
      }

      pushEvent({
        id: `dgt-aprobado-${examenDgt.id}`,
        fecha: examenDgt.fecha,
        accion: "Test DGT aprobado",
        categoria: "DGT",
        resumen: `Licencia ${examenDgt.licencia || "-"} | Aciertos ${examenDgt.aciertos}/${Number(examenDgt.aciertos || 0) + Number(examenDgt.fallos || 0)}`,
        detalle: {
          licencia: examenDgt.licencia,
          aciertos: examenDgt.aciertos,
          fallos: examenDgt.fallos,
          aprobado: Boolean(examenDgt.aprobado),
        },
      });
    }

    return rows.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
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
      alumno.estadoExpediente,
      matriculaActual?.estado,
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
    if (
      typeof this.repository.detachLicensedAssignedStudentsForProfessor ===
      "function"
    ) {
      await this.repository.detachLicensedAssignedStudentsForProfessor(userId);
    }

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
      alumnosHistoricosLicenciados,
      vehiculosDisponibles,
      clasesConfirmadasHoy,
      roadmapTrackingRows,
    ] = await Promise.all([
      this.repository.getProfessorAssignedStudents(userId),
      this.repository.getProfessorHistoricalLicensedStudents(userId),
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

    const historicos = (alumnosHistoricosLicenciados || []).map((alumno) => ({
      ...this.buildProfessorStudentSummary(alumno),
      esHistorico: true,
      fechaLicenciaObtenida:
        alumno.historialProfesores?.[0]?.changedAt || alumno.licenciaObtenidaAt,
      licenciaObtenida:
        alumno.historialProfesores?.[0]?.licenciaObtenida ||
        alumno.matriculas?.[0]?.licencia ||
        alumno.tipoLicenciaObjetivo ||
        null,
    }));

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
        alumnosHistoricosLicenciados: historicos.length,
        alumnosMatriculaPagada,
        vehiculosDisponibles: vehiculos.length,
        clasesConfirmadasHoy,
        hojasRutaPendientes,
        hojasRutaEnCurso,
        hojasRutaPendientesEnCurso: hojasRutaPendientes + hojasRutaEnCurso,
      },
      alumnos,
      alumnosHistoricos: historicos,
      vehiculos,
    };
  }

  async getProfessorStudents(userId) {
    if (
      typeof this.repository.detachLicensedAssignedStudentsForProfessor ===
      "function"
    ) {
      await this.repository.detachLicensedAssignedStudentsForProfessor(userId);
    }

    const profile = await this.repository.getProfessorProfile(userId);

    if (!profile) {
      throw new Error("Profesor no encontrado");
    }

    const [alumnosAsignados, alumnosHistoricosLicenciados] = await Promise.all([
      this.repository.getProfessorAssignedStudents(userId),
      this.repository.getProfessorHistoricalLicensedStudents(userId),
    ]);

    const byId = new Map();

    for (const alumno of alumnosAsignados || []) {
      byId.set(alumno.id, this.buildProfessorStudentSummary(alumno));
    }

    for (const alumno of alumnosHistoricosLicenciados || []) {
      if (byId.has(alumno.id)) {
        continue;
      }

      byId.set(alumno.id, {
        ...this.buildProfessorStudentSummary(alumno),
        esHistorico: true,
      });
    }

    return Array.from(byId.values()).sort((a, b) =>
      String(a.nombre || "").localeCompare(String(b.nombre || ""), "es"),
    );
  }

  async getProfessorStudentDetail(userId, alumnoId) {
    try {
      await this.repository.syncPastConfirmedBonusClassesForAlumno?.(
        alumnoId,
        new Date(),
      );
    } catch (error) {
      if (!(error instanceof TypeError)) {
        throw error;
      }
    }

    const [alumno, actividad] = await Promise.all([
      this.repository.findProfessorAssignedStudentById(userId, alumnoId),
      this.repository.findProfessorAssignedStudentActivityById(
        userId,
        alumnoId,
      ),
    ]);

    if (!alumno || !actividad) {
      throw new Error("Alumno no encontrado o sin relación con este profesor");
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
      alumno.estadoExpediente,
      matriculaActual?.estado,
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

    const sameLocalDay = (a, b) => {
      const da = new Date(a || 0);
      const db = new Date(b || 0);

      if (Number.isNaN(da.getTime()) || Number.isNaN(db.getTime())) {
        return false;
      }

      return (
        da.getFullYear() === db.getFullYear() &&
        da.getMonth() === db.getMonth() &&
        da.getDate() === db.getDate()
      );
    };

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

      const fechaReferencia =
        solicitud?.fechaProgramada || solicitud?.fechaSolicitud || null;

      const dgtMatch = examenesDGT.find((item) =>
        sameLocalDay(item?.fecha, fechaReferencia),
      );

      const aciertosDgt =
        dgtMatch?.aciertos === null || dgtMatch?.aciertos === undefined
          ? null
          : Number(dgtMatch.aciertos);
      const fallosDgt =
        dgtMatch?.fallos === null || dgtMatch?.fallos === undefined
          ? null
          : Number(dgtMatch.fallos);

      const aciertosFinal = aciertos !== null ? aciertos : aciertosDgt;
      const fallosFinal = errores !== null ? errores : fallosDgt;

      return {
        id: solicitud?.id,
        estado: toUpper(solicitud?.estado),
        fechaSolicitud: solicitud?.fechaSolicitud,
        fechaProgramada: solicitud?.fechaProgramada,
        aciertosExamen: aciertosFinal,
        fallosExamen: fallosFinal,
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

    const proximoTeoricoPendiente = solicitudesExamen
      .filter(
        (solicitud) =>
          toUpper(solicitud?.tipo) === "TEORICO" &&
          ["SOLICITADO", "PROGRAMADO", "PENDIENTE"].includes(
            toUpper(solicitud?.estado),
          ) &&
          solicitud?.fechaProgramada,
      )
      .sort(
        (a, b) =>
          new Date(a.fechaProgramada || 0).getTime() -
          new Date(b.fechaProgramada || 0).getTime(),
      )[0];

    const now = new Date();
    const bonosActivos = (actividad.bonosComprados || []).filter((compra) => {
      if (!compra?.pagado) {
        return false;
      }

      const fechaValidezHasta = new Date(compra?.fechaValidezHasta || 0);

      if (
        Number.isNaN(fechaValidezHasta.getTime()) ||
        fechaValidezHasta < now
      ) {
        return false;
      }

      const clasesRestantes =
        Number(compra?.clasesCompradas || 0) -
        Number(compra?.clasesConsumidas || 0);

      return clasesRestantes > 0;
    });

    const bonoActivoCompra = bonosActivos.sort(
      (a, b) => new Date(a.fechaValidezHasta) - new Date(b.fechaValidezHasta),
    )[0];

    const historialEstado = this.buildProfessorStudentHistory(actividad);

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
        bonoActivo: bonoActivoCompra
          ? {
              id: bonoActivoCompra.id,
              nombre: bonoActivoCompra.bono?.nombre || "Bono",
              licencia: bonoActivoCompra.bono?.licencia || "-",
              clasesBono: Number(bonoActivoCompra.clasesCompradas || 0),
              clasesRestantes: Math.max(
                Number(bonoActivoCompra.clasesCompradas || 0) -
                  Number(bonoActivoCompra.clasesConsumidas || 0),
                0,
              ),
              fechaValidezHasta: bonoActivoCompra.fechaValidezHasta,
            }
          : null,
      },
      evaluacion: {
        estadoGeneral,
        preparadoParaTeorico,
        preparadoParaPractico,
      },
      historialEstado,
      examenes: {
        teoricos: examenesTeoricos,
        practicos: examenesPracticos,
        ultimoTeorico: examenesTeoricos[0] || null,
        ultimoPractico: examenesPracticos[0] || null,
        proximoTeoricoPendiente: proximoTeoricoPendiente
          ? {
              id: proximoTeoricoPendiente.id,
              estado: toUpper(proximoTeoricoPendiente.estado),
              fechaProgramada: proximoTeoricoPendiente.fechaProgramada,
            }
          : null,
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

    return Promise.all(
      vehiculos.map(async (vehiculo) => {
        const itv = await this.buildVehicleItvStatus(vehiculo);

        return {
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
          itvPendiente: itv.pendiente,
          itvMotivos: itv.motivos,
          itvPrecioRevision: itv.precioRevision,
          itvFechaLimiteRevision: itv.fechaLimiteRevision,
        };
      }),
    );
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
    const itv = await this.buildVehicleItvStatus(vehiculo);

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
        itvPendiente: itv.pendiente,
        itvMotivos: itv.motivos,
        itvPrecioRevision: itv.precioRevision,
        itvFechaLimiteRevision: itv.fechaLimiteRevision,
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
