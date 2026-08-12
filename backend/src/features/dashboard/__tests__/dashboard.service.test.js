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
});
