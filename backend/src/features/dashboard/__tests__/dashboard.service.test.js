import { describe, it, expect, vi } from "vitest";

import { DashboardService } from "../dashboard.service.js";

describe("DashboardService", () => {
  it("debe devolver las métricas generales del dashboard", async () => {
    const metrics = {
      totalAlumnos: 100,
      totalProfesores: 10,
      totalVehiculos: 15,
      totalClases: 300,
      totalExamenes: 80,
      totalExamenesAprobados: 60,
      totalExamenesSuspendidos: 20,
    };

    const repositoryMock = {
      getMetrics: vi.fn().mockResolvedValue(metrics),
    };

    const service = new DashboardService(repositoryMock);

    const result = await service.getMetrics();

    expect(repositoryMock.getMetrics).toHaveBeenCalledOnce();

    expect(result).toEqual({
      ...metrics,
      porcentajeAprobados: 75,
      porcentajeSuspendidos: 25,
    });
  });
  it("debe calcular el porcentaje de exámenes aprobados", async () => {
    const repositoryMock = {
      getTotalExamenes: vi.fn().mockResolvedValue(80),

      getTotalExamenesAprobados: vi.fn().mockResolvedValue(60),
    };

    const service = new DashboardService(repositoryMock);

    const result = await service.getPorcentajeAprobados();

    expect(result).toBe(75);
  });
  it("debe calcular el porcentaje de exámenes suspendidos", async () => {
    const repositoryMock = {
      getTotalExamenes: vi.fn().mockResolvedValue(80),

      getTotalExamenesSuspendidos: vi.fn().mockResolvedValue(20),
    };

    const service = new DashboardService(repositoryMock);

    const result = await service.getPorcentajeSuspendidos();

    expect(result).toBe(25);
  });
  it("debe devolver todas las métricas enriquecidas del dashboard", async () => {
    const repositoryMock = {
      getMetrics: vi.fn().mockResolvedValue({
        totalAlumnos: 100,
        totalProfesores: 10,
        totalVehiculos: 15,
        totalClases: 300,
        totalExamenes: 80,
        totalExamenesAprobados: 60,
        totalExamenesSuspendidos: 20,
      }),
    };

    const service = new DashboardService(repositoryMock);

    const result = await service.getMetrics();

    expect(result).toEqual({
      totalAlumnos: 100,
      totalProfesores: 10,
      totalVehiculos: 15,
      totalClases: 300,
      totalExamenes: 80,
      totalExamenesAprobados: 60,
      totalExamenesSuspendidos: 20,
      porcentajeAprobados: 75,
      porcentajeSuspendidos: 25,
    });
  });
  it("debe devolver la tasa de éxito", async () => {
    const repositoryMock = {
      getTotalExamenes: vi.fn().mockResolvedValue(100),

      getTotalExamenesAprobados: vi.fn().mockResolvedValue(82),
    };

    const service = new DashboardService(repositoryMock);

    const result = await service.getTasaExito();

    expect(result).toBe(82);
  });
  it("debe calcular el ratio alumnos por profesor", async () => {
    const repositoryMock = {
      getTotalAlumnos: vi.fn().mockResolvedValue(120),

      getTotalProfesores: vi.fn().mockResolvedValue(10),
    };

    const service = new DashboardService(repositoryMock);

    const result = await service.getRatioAlumnosPorProfesor();

    expect(result).toBe(12);
  });
  it("debe calcular el ratio vehículos por profesor", async () => {
    const repositoryMock = {
      getTotalVehiculos: vi.fn().mockResolvedValue(15),

      getTotalProfesores: vi.fn().mockResolvedValue(10),
    };

    const service = new DashboardService(repositoryMock);

    const result = await service.getRatioVehiculosPorProfesor();

    expect(result).toBe(1.5);
  });
  it("debe devolver las métricas avanzadas del dashboard", async () => {
    const repositoryMock = {
      getTotalExamenesPendientes: vi.fn().mockResolvedValue(12),

      getTotalClasesProgramadas: vi.fn().mockResolvedValue(45),

      getTotalClasesCanceladas: vi.fn().mockResolvedValue(8),

      getClasesEsteMes: vi.fn().mockResolvedValue(52),

      getExamenesEsteMes: vi.fn().mockResolvedValue(18),

      getExamenesAprobadosEsteMes: vi.fn().mockResolvedValue(14),

      getExamenesSuspendidosEsteMes: vi.fn().mockResolvedValue(6),

      getTotalExamenes: vi.fn().mockResolvedValue(100),

      getTotalExamenesAprobados: vi.fn().mockResolvedValue(82),

      getTotalAlumnos: vi.fn().mockResolvedValue(120),

      getTotalProfesores: vi.fn().mockResolvedValue(10),

      getTotalVehiculos: vi.fn().mockResolvedValue(15),
    };

    const service = new DashboardService(repositoryMock);

    const result = await service.getAdvancedMetrics();

    expect(result).toEqual({
      totalExamenesPendientes: 12,
      totalClasesProgramadas: 45,
      totalClasesCanceladas: 8,
      tasaExito: 82,
      ratioAlumnosPorProfesor: 12,
      ratioVehiculosPorProfesor: 1.5,
      clasesEsteMes: 52,
      examenesEsteMes: 18,
      examenesAprobadosEsteMes: 14,
      examenesSuspendidosEsteMes: 6,
    });
  });

  it("debe calcular el porcentaje de éxito mensual", async () => {
    const repositoryMock = {
      getExamenesEsteMes: vi.fn().mockResolvedValue(20),

      getExamenesAprobadosEsteMes: vi.fn().mockResolvedValue(15),
    };

    const service = new DashboardService(repositoryMock);

    const result = await service.getPorcentajeExitoMensual();

    expect(result).toBe(75);
  });
  it("debe devolver el profesor con más clases", async () => {
    const repositoryMock = {
      getClasesPorProfesor: vi.fn().mockResolvedValue([
        {
          profesorId: "profesor-1",
          _count: { id: 42 },
        },
        {
          profesorId: "profesor-2",
          _count: { id: 35 },
        },
      ]),
    };

    const service = new DashboardService(repositoryMock);

    const result = await service.getTopProfesorPorClases();

    expect(result).toEqual({
      profesorId: "profesor-1",
      totalClases: 42,
    });
  });
  it("debe devolver el profesor con más horas impartidas", async () => {
    const repositoryMock = {
      getHorasPorProfesor: vi.fn().mockResolvedValue([
        {
          profesorId: "profesor-1",
          _sum: {
            duracion: 120,
          },
        },
        {
          profesorId: "profesor-2",
          _sum: {
            duracion: 90,
          },
        },
      ]),
    };

    const service = new DashboardService(repositoryMock);

    const result = await service.getTopProfesorPorHoras();

    expect(result).toEqual({
      profesorId: "profesor-1",
      horas: 120,
    });
  });
  it("debe devolver el dashboard ejecutivo", async () => {
    const repositoryMock = {
      getTotalExamenesPendientes: vi.fn().mockResolvedValue(12),

      getTotalClasesProgramadas: vi.fn().mockResolvedValue(45),

      getExamenesEsteMes: vi.fn().mockResolvedValue(20),

      getExamenesAprobadosEsteMes: vi.fn().mockResolvedValue(15),

      getTotalExamenes: vi.fn().mockResolvedValue(100),

      getTotalExamenesAprobados: vi.fn().mockResolvedValue(82),

      getClasesPorProfesor: vi.fn().mockResolvedValue([
        {
          profesorId: "profesor-1",
          _count: { id: 42 },
        },
      ]),

      getHorasPorProfesor: vi.fn().mockResolvedValue([
        {
          profesorId: "profesor-1",
          _sum: { duracion: 120 },
        },
      ]),
    };

    const service = new DashboardService(repositoryMock);

    const result = await service.getExecutiveDashboard();

    expect(result).toEqual({
      successRate: 82,
      monthlySuccessRate: 75,
      pendingExams: 12,
      scheduledClasses: 45,

      topProfesorByClasses: {
        profesorId: "profesor-1",
        totalClases: 42,
      },

      topProfesorByHours: {
        profesorId: "profesor-1",
        horas: 120,
      },
    });
  });

  it("debe devolver el dashboard del alumno con métricas calculadas", async () => {
    const repositoryMock = {
      getStudentDashboard: vi.fn().mockResolvedValue({
        profile: {
          id: "alumno-1",
          nombre: "Alumno Demo",
          email: "alumno@demo.com",
          dni: "12345678A",
          telefono: "600000000",
          rol: "ALUMNO",
          alumno: {
            tipoLicenciaObjetivo: "B",
            horasPracticasCompletadas: 6,
            matriculaPagada: true,
            fechaMatriculaPago: new Date("2026-08-01T10:00:00.000Z"),
            profesorAsignado: {
              id: "profesor-1",
              licenciaConducir: "B",
              permisosLicencias: ["B"],
              usuario: {
                nombre: "Profesor Demo",
                email: "profesor@demo.com",
              },
            },
          },
        },
        temarios: [
          {
            temarioId: "temario-1",
            revisado: true,
            dominio: 90,
            ultimaRevision: new Date("2026-08-10T10:00:00.000Z"),
            temario: {
              titulo: "Señales",
              descripcion: "Señales básicas",
              orden: 1,
            },
          },
          {
            temarioId: "temario-2",
            revisado: false,
            dominio: 40,
            ultimaRevision: new Date("2026-08-09T10:00:00.000Z"),
            temario: {
              titulo: "Prioridad",
              descripcion: "Prioridad de paso",
              orden: 2,
            },
          },
        ],
        tests: [
          {
            id: "test-1",
            fecha: new Date("2026-08-05T10:00:00.000Z"),
            resultado: "APROBADO",
            respuestasCorrectas: 18,
            totalPreguntas: 20,
          },
          {
            id: "test-2",
            fecha: new Date("2026-08-06T10:00:00.000Z"),
            resultado: "SUSPENDIDO",
            respuestasCorrectas: 12,
            totalPreguntas: 20,
          },
        ],
        clases: [
          {
            id: "clase-1",
            fecha: new Date("2026-08-12T10:00:00.000Z"),
            estado: "PROGRAMADA",
            vehiculo: {
              matricula: "1234-ABC",
            },
            profesor: {
              usuario: {
                nombre: "Profesor Demo",
              },
            },
          },
        ],
        bonos: [
          {
            id: "bono-1",
            clasesCompradas: 10,
            clasesConsumidas: 2,
            pagado: true,
            fechaCompra: new Date("2026-08-01T10:00:00.000Z"),
            fechaValidezHasta: new Date("2026-12-31T10:00:00.000Z"),
            bono: {
              nombre: "Pack 10",
              descripcion: "Pack de 10 clases",
            },
          },
        ],
        examenes: [
          {
            id: "examen-1",
            tipo: "TEORICO",
            estado: "PENDIENTE",
            fechaSolicitud: new Date("2026-08-03T10:00:00.000Z"),
            fechaProgramada: null,
            observaciones: "Pendiente de revisar",
          },
          {
            id: "examen-2",
            tipo: "PRACTICO",
            estado: "PROGRAMADO",
            fechaSolicitud: new Date("2026-08-04T10:00:00.000Z"),
            fechaProgramada: new Date("2026-08-20T10:00:00.000Z"),
            observaciones: null,
          },
        ],
      }),
    };

    const service = new DashboardService(repositoryMock);

    const result = await service.getStudentDashboard("alumno-1");

    expect(repositoryMock.getStudentDashboard).toHaveBeenCalledWith("alumno-1");
    expect(result.perfil.nombre).toBe("Alumno Demo");
    expect(result.teoria.testsTotales).toBe(2);
    expect(result.teoria.testsAprobados).toBe(1);
    expect(result.teoria.testsSuspendidos).toBe(1);
    expect(result.teoria.porcentajeAprobado).toBe(50);
    expect(result.teoria.preparadoParaTeorico).toBe(false);
    expect(result.teoria.recomendacionTemarios).toEqual(["Prioridad"]);
    expect(result.practica.clasesCompradas).toBe(10);
    expect(result.practica.clasesPagadas).toBe(10);
    expect(result.practica.clasesReservadas).toBe(1);
    expect(result.bonos[0].estado).toBe("APLICABLE");
    expect(result.examenes.teoricos).toHaveLength(1);
    expect(result.examenes.practicos).toHaveLength(1);
  });

  it("debe devolver el dashboard del profesor con alumnos y vehículos", async () => {
    const repositoryMock = {
      getProfessorProfile: vi.fn().mockResolvedValue({
        id: "profesor-1",
        permisosLicencias: ["B", "A2"],
        usuario: {
          nombre: "Profesor Demo",
          email: "profesor@demo.com",
        },
      }),
      getProfessorAssignedStudents: vi.fn().mockResolvedValue([
        {
          id: "alumno-1",
          tipoLicenciaObjetivo: "B",
          horasPracticasCompletadas: 8,
          usuario: {
            nombre: "Alumno Uno",
            email: "alumno1@demo.com",
            telefono: "600000001",
          },
          matriculas: [{ estado: "PAGADA" }],
        },
      ]),
      getProfessorAvailableVehicles: vi.fn().mockResolvedValue([
        {
          id: "vehiculo-1",
          matricula: "1234ABC",
          marca: "Seat",
          modelo: "Ibiza",
          tipoPermiso: "B",
        },
      ]),
    };

    const service = new DashboardService(repositoryMock);

    const result = await service.getProfessorDashboard("profesor-1");

    expect(repositoryMock.getProfessorProfile).toHaveBeenCalledWith(
      "profesor-1",
    );
    expect(repositoryMock.getProfessorAssignedStudents).toHaveBeenCalledWith(
      "profesor-1",
    );
    expect(repositoryMock.getProfessorAvailableVehicles).toHaveBeenCalledWith([
      "B",
      "A2",
    ]);
    expect(result.resumen.alumnosAsignados).toBe(1);
    expect(result.resumen.alumnosMatriculaPagada).toBe(1);
    expect(result.resumen.vehiculosDisponibles).toBe(1);
  });

  it("debe devolver el detalle de un alumno asignado a profesor", async () => {
    const repositoryMock = {
      findProfessorAssignedStudentById: vi.fn().mockResolvedValue({
        id: "alumno-1",
        tipoLicenciaObjetivo: "B",
        horasPracticasCompletadas: 22,
        usuario: {
          nombre: "Alumno Uno",
          email: "alumno1@demo.com",
          telefono: "600000001",
          dni: "12345678A",
        },
        matriculas: [{ estado: "PAGADA" }],
        testsPractica: [
          { resultado: "APROBADO", temario: { titulo: "Señales" } },
          { resultado: "SUSPENDIDO", temario: { titulo: "Prioridad" } },
        ],
        clases: [
          {
            id: "clase-1",
            fecha: new Date(Date.now() + 3600 * 1000),
            duracion: 60,
            estado: "PROGRAMADA",
            vehiculo: {
              matricula: "1234ABC",
              marca: "Seat",
              modelo: "Ibiza",
            },
          },
          {
            id: "clase-2",
            fecha: new Date(Date.now() - 3600 * 1000),
            duracion: 45,
            estado: "REALIZADA",
            vehiculo: null,
          },
        ],
      }),
    };

    const service = new DashboardService(repositoryMock);

    const result = await service.getProfessorStudentDetail(
      "profesor-1",
      "alumno-1",
    );

    expect(
      repositoryMock.findProfessorAssignedStudentById,
    ).toHaveBeenCalledWith("profesor-1", "alumno-1");
    expect(result.tests.aprobados).toBe(1);
    expect(result.tests.suspendidos).toBe(1);
    expect(result.practica.clasesRealizadas).toBe(1);
    expect(result.practica.proximasClases).toHaveLength(1);
  });

  it("debe devolver reservas de un vehículo compatible del profesor", async () => {
    const repositoryMock = {
      getProfessorProfile: vi.fn().mockResolvedValue({
        id: "profesor-1",
        permisosLicencias: ["B"],
      }),
      findProfessorVehicleById: vi.fn().mockResolvedValue({
        id: "vehiculo-1",
        matricula: "1234ABC",
        marca: "Seat",
        modelo: "Ibiza",
        tipoPermiso: "B",
      }),
      getVehicleScheduledClasses: vi.fn().mockResolvedValue([
        {
          id: "clase-1",
          fecha: new Date(Date.now() + 3600 * 1000),
          duracion: 60,
          estado: "PROGRAMADA",
          profesorId: "profesor-1",
          profesor: { usuario: { nombre: "Profesor Demo" } },
          alumnoId: "alumno-1",
          alumno: { usuario: { nombre: "Alumno Uno" } },
        },
      ]),
    };

    const service = new DashboardService(repositoryMock);

    const result = await service.getProfessorVehicleSchedule(
      "profesor-1",
      "vehiculo-1",
    );

    expect(repositoryMock.findProfessorVehicleById).toHaveBeenCalledWith(
      ["B"],
      "vehiculo-1",
    );
    expect(result.vehiculo.id).toBe("vehiculo-1");
    expect(result.reservas).toHaveLength(1);
    expect(result.reservas[0].esMiClase).toBe(true);
  });
});
