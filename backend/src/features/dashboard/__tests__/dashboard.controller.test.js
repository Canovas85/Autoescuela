import { describe, it, expect, vi } from "vitest";

import { DashboardController } from "../dashboard.controller.js";

describe("DashboardController", () => {
  it("debe devolver las métricas del dashboard", async () => {
    const metrics = {
      totalAlumnos: 100,
      totalProfesores: 10,
      totalVehiculos: 15,
      totalClases: 300,
      totalExamenes: 80,
      totalExamenesAprobados: 60,
      totalExamenesSuspendidos: 20,
      porcentajeAprobados: 75,
      porcentajeSuspendidos: 25,
    };

    const serviceMock = {
      getMetrics: vi.fn().mockResolvedValue(metrics),
    };

    const controller = new DashboardController(serviceMock);

    const req = {};

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.getMetrics(req, res);

    expect(serviceMock.getMetrics).toHaveBeenCalledOnce();

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith(metrics);
  });
  it("debe devolver las métricas avanzadas del dashboard", async () => {
    const advancedMetrics = {
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
    };

    const serviceMock = {
      getAdvancedMetrics: vi.fn().mockResolvedValue(advancedMetrics),
    };

    const controller = new DashboardController(serviceMock);

    const req = {};

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.getAdvancedMetrics(req, res);

    expect(serviceMock.getAdvancedMetrics).toHaveBeenCalledOnce();

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith(advancedMetrics);
  });
  it("debe devolver el dashboard ejecutivo", async () => {
    const executiveMetrics = {
      successRate: 82,
      monthlySuccessRate: 75,
      pendingExams: 12,
      scheduledClasses: 45,
    };

    const serviceMock = {
      getExecutiveDashboard: vi.fn().mockResolvedValue(executiveMetrics),
    };

    const controller = new DashboardController(serviceMock);

    const req = {};

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.getExecutiveDashboard(req, res);

    expect(serviceMock.getExecutiveDashboard).toHaveBeenCalledOnce();

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith(executiveMetrics);
  });

  it("debe devolver el dashboard del alumno", async () => {
    const studentMetrics = {
      perfil: {
        nombre: "Alumno Demo",
      },
      teoria: {
        testsTotales: 2,
      },
    };

    const serviceMock = {
      getStudentDashboard: vi.fn().mockResolvedValue(studentMetrics),
    };

    const controller = new DashboardController(serviceMock);

    const req = {
      user: {
        id: "alumno-1",
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await controller.getStudentDashboard(req, res);

    expect(serviceMock.getStudentDashboard).toHaveBeenCalledWith("alumno-1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(studentMetrics);
  });
});
