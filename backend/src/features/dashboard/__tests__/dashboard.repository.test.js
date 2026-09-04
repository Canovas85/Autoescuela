import { describe, it, expect, vi } from "vitest";

import { DashboardRepository } from "../dashboard.repository.js";

describe("DashboardRepository", () => {
  it("debe devolver el número total de alumnos", async () => {
    const prismaMock = {
      alumno: {
        count: vi.fn().mockResolvedValue(100),
      },
    };

    const repository = new DashboardRepository(prismaMock);

    const result = await repository.getTotalAlumnos();

    expect(prismaMock.alumno.count).toHaveBeenCalledOnce();

    expect(result).toBe(100);
  });
  it("debe devolver el número total de profesores", async () => {
    const prismaMock = {
      profesor: {
        count: vi.fn().mockResolvedValue(10),
      },
    };

    const repository = new DashboardRepository(prismaMock);

    const result = await repository.getTotalProfesores();

    expect(prismaMock.profesor.count).toHaveBeenCalledOnce();

    expect(result).toBe(10);
  });
  it("debe devolver el número total de vehículos", async () => {
    const prismaMock = {
      vehiculo: {
        count: vi.fn().mockResolvedValue(15),
      },
    };

    const repository = new DashboardRepository(prismaMock);

    const result = await repository.getTotalVehiculos();

    expect(prismaMock.vehiculo.count).toHaveBeenCalledOnce();

    expect(result).toBe(15);
  });
  it("debe devolver el número total de vehículos", async () => {
    const prismaMock = {
      vehiculo: {
        count: vi.fn().mockResolvedValue(15),
      },
    };

    const repository = new DashboardRepository(prismaMock);

    const result = await repository.getTotalVehiculos();

    expect(prismaMock.vehiculo.count).toHaveBeenCalledOnce();

    expect(result).toBe(15);
  });
  it("debe devolver el número total de clases prácticas", async () => {
    const prismaMock = {
      clasePractica: {
        count: vi.fn().mockResolvedValue(300),
      },
    };

    const repository = new DashboardRepository(prismaMock);

    const result = await repository.getTotalClases();

    expect(prismaMock.clasePractica.count).toHaveBeenCalledOnce();

    expect(result).toBe(300);
  });
  it("debe devolver el número total de exámenes", async () => {
    const prismaMock = {
      examen: {
        count: vi.fn().mockResolvedValue(80),
      },
    };

    const repository = new DashboardRepository(prismaMock);

    const result = await repository.getTotalExamenes();

    expect(prismaMock.examen.count).toHaveBeenCalledOnce();

    expect(result).toBe(80);
  });
  it("debe devolver el número total de exámenes aprobados", async () => {
    const prismaMock = {
      examen: {
        count: vi.fn().mockResolvedValue(65),
      },
    };

    const repository = new DashboardRepository(prismaMock);

    const result = await repository.getTotalExamenesAprobados();

    expect(prismaMock.examen.count).toHaveBeenCalledWith({
      where: {
        estado: "APROBADO",
      },
    });

    expect(result).toBe(65);
  });
  it("debe devolver el número total de exámenes suspendidos", async () => {
    const prismaMock = {
      examen: {
        count: vi.fn().mockResolvedValue(15),
      },
    };

    const repository = new DashboardRepository(prismaMock);

    const result = await repository.getTotalExamenesSuspendidos();

    expect(prismaMock.examen.count).toHaveBeenCalledWith({
      where: {
        estado: "SUSPENDIDO",
      },
    });

    expect(result).toBe(15);
  });
  it("debe devolver todas las métricas del dashboard", async () => {
    const prismaMock = {
      alumno: {
        count: vi.fn().mockResolvedValue(100),
      },

      profesor: {
        count: vi.fn().mockResolvedValue(10),
      },

      vehiculo: {
        count: vi.fn().mockResolvedValue(15),
      },

      clasePractica: {
        count: vi.fn().mockResolvedValue(300),
      },

      examen: {
        count: vi
          .fn()
          .mockResolvedValueOnce(80)
          .mockResolvedValueOnce(60)
          .mockResolvedValueOnce(20),
      },
    };

    const repository = new DashboardRepository(prismaMock);

    const result = await repository.getMetrics();

    expect(result).toEqual({
      totalAlumnos: 100,
      totalProfesores: 10,
      totalVehiculos: 15,
      totalClases: 300,
      totalExamenes: 80,
      totalExamenesAprobados: 60,
      totalExamenesSuspendidos: 20,
    });
  });
  it("debe devolver el número de clases agrupadas por profesor", async () => {
    const clasesPorProfesor = [
      {
        profesorId: "profesor-1",
        _count: {
          id: 42,
        },
      },
      {
        profesorId: "profesor-2",
        _count: {
          id: 35,
        },
      },
    ];

    const prismaMock = {
      clasePractica: {
        groupBy: vi.fn().mockResolvedValue(clasesPorProfesor),
      },
    };

    const repository = new DashboardRepository(prismaMock);

    const result = await repository.getClasesPorProfesor();

    expect(prismaMock.clasePractica.groupBy).toHaveBeenCalledWith({
      by: ["profesorId"],
      _count: {
        id: true,
      },
    });

    expect(result).toEqual(clasesPorProfesor);
  });
  it("debe devolver las horas impartidas agrupadas por profesor", async () => {
    const horasPorProfesor = [
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
    ];

    const prismaMock = {
      clasePractica: {
        groupBy: vi.fn().mockResolvedValue(horasPorProfesor),
      },
    };

    const repository = new DashboardRepository(prismaMock);

    const result = await repository.getHorasPorProfesor();

    expect(prismaMock.clasePractica.groupBy).toHaveBeenCalledWith({
      by: ["profesorId"],
      _sum: {
        duracion: true,
      },
    });

    expect(result).toEqual(horasPorProfesor);
  });
  it("debe devolver el número total de exámenes pendientes", async () => {
    const prismaMock = {
      examen: {
        count: vi.fn().mockResolvedValue(12),
      },
    };

    const repository = new DashboardRepository(prismaMock);

    const result = await repository.getTotalExamenesPendientes();

    expect(prismaMock.examen.count).toHaveBeenCalledWith({
      where: {
        estado: "PROGRAMADO",
      },
    });

    expect(result).toBe(12);
  });
  it("debe devolver el número total de clases programadas", async () => {
    const prismaMock = {
      clasePractica: {
        count: vi.fn().mockResolvedValue(45),
      },
    };

    const repository = new DashboardRepository(prismaMock);

    const result = await repository.getTotalClasesProgramadas();

    expect(prismaMock.clasePractica.count).toHaveBeenCalledWith({
      where: {
        estado: "PROGRAMADA",
      },
    });

    expect(result).toBe(45);
  });
  it("debe devolver el número total de clases canceladas", async () => {
    const prismaMock = {
      clasePractica: {
        count: vi.fn().mockResolvedValue(8),
      },
    };

    const repository = new DashboardRepository(prismaMock);

    const result = await repository.getTotalClasesCanceladas();

    expect(prismaMock.clasePractica.count).toHaveBeenCalledWith({
      where: {
        estado: "CANCELADA",
      },
    });

    expect(result).toBe(8);
  });
  it("debe devolver el número de clases realizadas este mes", async () => {
    const prismaMock = {
      clasePractica: {
        count: vi.fn().mockResolvedValue(52),
      },
    };

    const repository = new DashboardRepository(prismaMock);

    const result = await repository.getClasesEsteMes();

    expect(prismaMock.clasePractica.count).toHaveBeenCalledOnce();

    expect(result).toBe(52);
  });
  it("debe devolver el número de exámenes realizados este mes", async () => {
    const prismaMock = {
      examen: {
        count: vi.fn().mockResolvedValue(18),
      },
    };

    const repository = new DashboardRepository(prismaMock);

    const result = await repository.getExamenesEsteMes();

    expect(prismaMock.examen.count).toHaveBeenCalledOnce();

    expect(result).toBe(18);
  });
  it("debe devolver el número de exámenes aprobados este mes", async () => {
    const prismaMock = {
      examen: {
        count: vi.fn().mockResolvedValue(14),
      },
    };

    const repository = new DashboardRepository(prismaMock);

    const result = await repository.getExamenesAprobadosEsteMes();

    expect(prismaMock.examen.count).toHaveBeenCalledWith({
      where: {
        estado: "APROBADO",
        fecha: expect.any(Object),
      },
    });

    expect(result).toBe(14);
  });
  it("debe devolver el número de exámenes suspendidos este mes", async () => {
    const prismaMock = {
      examen: {
        count: vi.fn().mockResolvedValue(6),
      },
    };

    const repository = new DashboardRepository(prismaMock);

    const result = await repository.getExamenesSuspendidosEsteMes();

    expect(prismaMock.examen.count).toHaveBeenCalledWith({
      where: {
        estado: "SUSPENDIDO",
        fecha: expect.any(Object),
      },
    });

    expect(result).toBe(6);
  });

  it("debe devolver el dashboard del alumno con sus bloques de información", async () => {
    const prismaMock = {
      usuario: {
        findUnique: vi.fn().mockResolvedValue({
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
            activo: true,
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
        }),
      },
      temarioProgreso: {
        findMany: vi.fn().mockResolvedValue([
          {
            temarioId: "temario-1",
            revisado: true,
            dominio: 80,
            ultimaRevision: new Date("2026-08-10T10:00:00.000Z"),
            temario: {
              titulo: "Señales",
              descripcion: "Señales básicas",
              orden: 1,
            },
          },
        ]),
      },
      testPractica: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: "test-1",
            fecha: new Date("2026-08-05T10:00:00.000Z"),
            resultado: "APROBADO",
            respuestasCorrectas: 18,
            totalPreguntas: 20,
            temario: null,
          },
          {
            id: "test-2",
            fecha: new Date("2026-08-06T10:00:00.000Z"),
            resultado: "SUSPENDIDO",
            respuestasCorrectas: 12,
            totalPreguntas: 20,
            temario: null,
          },
        ]),
      },
      clasePractica: {
        findMany: vi.fn().mockResolvedValue([
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
        ]),
      },
      compraBono: {
        findMany: vi.fn().mockResolvedValue([
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
        ]),
      },
      solicitudExamen: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: "examen-1",
            tipo: "TEORICO",
            estado: "PENDIENTE",
            fechaSolicitud: new Date("2026-08-03T10:00:00.000Z"),
            fechaProgramada: null,
            observaciones: "Pendiente de revisar",
          },
        ]),
      },
    };

    const repository = new DashboardRepository(prismaMock);

    const result = await repository.getStudentDashboard("alumno-1");

    expect(prismaMock.usuario.findUnique).toHaveBeenCalledOnce();
    expect(prismaMock.temarioProgreso.findMany).toHaveBeenCalledOnce();
    expect(prismaMock.testPractica.findMany).toHaveBeenCalledOnce();
    expect(prismaMock.clasePractica.findMany).toHaveBeenCalledOnce();
    expect(prismaMock.compraBono.findMany).toHaveBeenCalledOnce();
    expect(prismaMock.solicitudExamen.findMany).toHaveBeenCalledOnce();

    expect(result.profile.nombre).toBe("Alumno Demo");
    expect(result.temarios).toHaveLength(1);
    expect(result.tests).toHaveLength(2);
    expect(result.clases).toHaveLength(1);
    expect(result.bonos).toHaveLength(1);
    expect(result.examenes).toHaveLength(1);
  });

  it("debe consultar el perfil del profesor", async () => {
    const prismaMock = {
      profesor: {
        findUnique: vi.fn().mockResolvedValue({ id: "profesor-1" }),
      },
    };

    const repository = new DashboardRepository(prismaMock);

    await repository.getProfessorProfile("profesor-1");

    expect(prismaMock.profesor.findUnique).toHaveBeenCalledWith({
      where: {
        id: "profesor-1",
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
  });

  it("debe consultar vehículos disponibles por permisos", async () => {
    const prismaMock = {
      vehiculo: {
        findMany: vi.fn().mockResolvedValue([]),
      },
    };

    const repository = new DashboardRepository(prismaMock);

    await repository.getProfessorAvailableVehicles(["B", "A2"]);

    expect(prismaMock.vehiculo.findMany).toHaveBeenCalledWith({
      where: {
        activo: true,
        tipoPermiso: {
          in: ["B", "A2"],
        },
      },
      orderBy: [{ tipoPermiso: "asc" }, { matricula: "asc" }],
    });
  });
});
