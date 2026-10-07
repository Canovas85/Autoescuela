import { describe, it, expect, vi } from "vitest";

import { ClasesService } from "../clases.service.js";

describe("ClasesService", () => {
  it("debe crear una clase práctica cuando los datos son válidos", async () => {
    const claseCreada = {
      id: "clase-1",
      alumnoId: "alumno-1",
      profesorId: "profesor-1",
      vehiculoId: "vehiculo-1",
      fecha: "2026-09-01T10:00:00Z",
      duracion: 60,
      estado: "PROGRAMADA",
    };

    const repositoryMock = {
      findByProfesorAndFecha: vi.fn().mockResolvedValue(null),
      findByVehiculoAndFecha: vi.fn().mockResolvedValue(null),
      findByAlumnoAndFecha: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue(claseCreada),
    };

    const service = new ClasesService(repositoryMock);

    const result = await service.create({
      alumnoId: "alumno-1",
      profesorId: "profesor-1",
      vehiculoId: "vehiculo-1",
      fecha: "2026-09-01T10:00:00Z",
      duracion: 60,
    });

    expect(repositoryMock.create).toHaveBeenCalledOnce();

    expect(result).toEqual(claseCreada);
  });

  it("debe lanzar un error cuando el alumno es obligatorio", async () => {
    const repositoryMock = {
      create: vi.fn(),
    };

    const service = new ClasesService(repositoryMock);

    await expect(
      service.create({
        profesorId: "profesor-1",
        vehiculoId: "vehiculo-1",
        fecha: "2026-09-01T10:00:00Z",
        duracion: 60,
      }),
    ).rejects.toThrow("El alumno es obligatorio");

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });
  it("debe lanzar un error cuando el profesor es obligatorio", async () => {
    const repositoryMock = {
      create: vi.fn(),
    };

    const service = new ClasesService(repositoryMock);

    await expect(
      service.create({
        alumnoId: "alumno-1",
        vehiculoId: "vehiculo-1",
        fecha: "2026-09-01T10:00:00Z",
        duracion: 60,
      }),
    ).rejects.toThrow("El profesor es obligatorio");

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });
  it("debe lanzar un error cuando el vehículo es obligatorio", async () => {
    const repositoryMock = {
      create: vi.fn(),
    };

    const service = new ClasesService(repositoryMock);

    await expect(
      service.create({
        alumnoId: "alumno-1",
        profesorId: "profesor-1",
        fecha: "2026-09-01T10:00:00Z",
        duracion: 60,
      }),
    ).rejects.toThrow("El vehículo es obligatorio");

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });
  it("debe lanzar un error cuando la fecha es obligatoria", async () => {
    const repositoryMock = {
      create: vi.fn(),
    };

    const service = new ClasesService(repositoryMock);

    await expect(
      service.create({
        alumnoId: "alumno-1",
        profesorId: "profesor-1",
        vehiculoId: "vehiculo-1",
        duracion: 60,
      }),
    ).rejects.toThrow("La fecha es obligatoria");

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });
  it("debe lanzar un error cuando la duración es obligatoria", async () => {
    const repositoryMock = {
      create: vi.fn(),
    };

    const service = new ClasesService(repositoryMock);

    await expect(
      service.create({
        alumnoId: "alumno-1",
        profesorId: "profesor-1",
        vehiculoId: "vehiculo-1",
        fecha: "2026-09-01T10:00:00Z",
      }),
    ).rejects.toThrow("La duración es obligatoria");

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });
  it("debe crear siempre la clase con estado PROGRAMADA", async () => {
    const repositoryMock = {
      findByProfesorAndFecha: vi.fn().mockResolvedValue(null),

      findByVehiculoAndFecha: vi.fn().mockResolvedValue(null),

      findByAlumnoAndFecha: vi.fn().mockResolvedValue(null),

      create: vi.fn().mockImplementation(async (data) => data),
    };

    const service = new ClasesService(repositoryMock);

    const result = await service.create({
      alumnoId: "alumno-1",
      profesorId: "profesor-1",
      vehiculoId: "vehiculo-1",
      fecha: "2026-09-01T10:00:00Z",
      duracion: 60,
      estado: "CANCELADA",
    });

    expect(result.estado).toBe("PROGRAMADA");
  });
  it("debe devolver el listado completo de clases prácticas", async () => {
    const clases = [
      {
        id: "clase-1",
        alumnoId: "alumno-1",
        profesorId: "profesor-1",
        vehiculoId: "vehiculo-1",
        fecha: "2026-09-01T10:00:00Z",
        duracion: 60,
        estado: "PROGRAMADA",
      },
      {
        id: "clase-2",
        alumnoId: "alumno-2",
        profesorId: "profesor-1",
        vehiculoId: "vehiculo-1",
        fecha: "2026-09-01T12:00:00Z",
        duracion: 90,
        estado: "PROGRAMADA",
      },
    ];

    const repositoryMock = {
      findAll: vi.fn().mockResolvedValue(clases),
    };

    const service = new ClasesService(repositoryMock);

    const result = await service.getAll();

    expect(repositoryMock.findAll).toHaveBeenCalledOnce();

    expect(result).toEqual(clases);
  });

  it("debe devolver una clase práctica cuando existe el id", async () => {
    const clase = {
      id: "clase-1",
      alumnoId: "alumno-1",
      profesorId: "profesor-1",
      vehiculoId: "vehiculo-1",
      fecha: "2026-09-01T10:00:00Z",
      duracion: 60,
      estado: "PROGRAMADA",
    };

    const repositoryMock = {
      findById: vi.fn().mockResolvedValue(clase),
    };

    const service = new ClasesService(repositoryMock);

    const result = await service.getById("clase-1");

    expect(repositoryMock.findById).toHaveBeenCalledWith("clase-1");

    expect(result).toEqual(clase);
  });

  it("debe actualizar una clase práctica existente", async () => {
    const claseActualizada = {
      id: "clase-1",
      alumnoId: "alumno-1",
      profesorId: "profesor-1",
      vehiculoId: "vehiculo-1",
      fecha: "2026-09-02T10:00:00Z",
      duracion: 90,
      estado: "PROGRAMADA",
    };

    const repositoryMock = {
      update: vi.fn().mockResolvedValue(claseActualizada),
    };

    const service = new ClasesService(repositoryMock);

    const result = await service.update("clase-1", {
      fecha: "2026-09-02T10:00:00Z",
      duracion: 90,
    });

    expect(repositoryMock.update).toHaveBeenCalledWith("clase-1", {
      fecha: "2026-09-02T10:00:00Z",
      duracion: 90,
    });

    expect(result).toEqual(claseActualizada);
  });

  it("debe cancelar una clase práctica existente", async () => {
    const claseCancelada = {
      id: "clase-1",
      alumnoId: "alumno-1",
      profesorId: "profesor-1",
      vehiculoId: "vehiculo-1",
      fecha: "2026-09-01T10:00:00Z",
      duracion: 60,
      estado: "CANCELADA_ADMIN",
    };

    const repositoryMock = {
      findById: vi.fn().mockResolvedValue({
        id: "clase-1",
        compraBonoId: null,
      }),
      findPaymentByClassId: vi.fn().mockResolvedValue(null),
      updateClassById: vi.fn().mockResolvedValue(claseCancelada),
    };

    const service = new ClasesService(repositoryMock);

    const result = await service.cancel("clase-1");

    expect(repositoryMock.findById).toHaveBeenCalledWith("clase-1");
    expect(repositoryMock.updateClassById).toHaveBeenCalledWith(
      "clase-1",
      expect.objectContaining({ estado: "CANCELADA_ADMIN" }),
    );

    expect(result).toEqual(claseCancelada);
  });
  it("debe lanzar un error cuando el profesor ya tiene una clase a esa hora", async () => {
    const repositoryMock = {
      findByProfesorAndFecha: vi.fn().mockResolvedValue({
        id: "clase-1",
      }),

      create: vi.fn(),
    };

    const service = new ClasesService(repositoryMock);

    await expect(
      service.create({
        alumnoId: "alumno-2",
        profesorId: "profesor-1",
        vehiculoId: "vehiculo-1",
        fecha: "2026-09-01T10:00:00Z",
        duracion: 60,
      }),
    ).rejects.toThrow(
      "El profesor ya tiene una clase programada en esa fecha y hora",
    );

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });

  it("debe lanzar un error cuando el vehículo ya tiene una clase a esa hora", async () => {
    const repositoryMock = {
      findByProfesorAndFecha: vi.fn().mockResolvedValue(null),

      findByVehiculoAndFecha: vi.fn().mockResolvedValue({
        id: "clase-1",
      }),

      create: vi.fn(),
    };

    const service = new ClasesService(repositoryMock);

    await expect(
      service.create({
        alumnoId: "alumno-1",
        profesorId: "profesor-1",
        vehiculoId: "vehiculo-1",
        fecha: "2026-09-01T10:00:00Z",
        duracion: 60,
      }),
    ).rejects.toThrow(
      "El vehículo ya está asignado a otra clase en esa fecha y hora",
    );
  });
  it("debe lanzar un error cuando el alumno ya tiene una clase a esa hora", async () => {
    const repositoryMock = {
      findByProfesorAndFecha: vi.fn().mockResolvedValue(null),

      findByVehiculoAndFecha: vi.fn().mockResolvedValue(null),

      findByAlumnoAndFecha: vi.fn().mockResolvedValue({
        id: "clase-1",
      }),

      create: vi.fn(),
    };

    const service = new ClasesService(repositoryMock);

    await expect(
      service.create({
        alumnoId: "alumno-1",
        profesorId: "profesor-1",
        vehiculoId: "vehiculo-1",
        fecha: "2026-09-01T10:00:00Z",
        duracion: 60,
      }),
    ).rejects.toThrow(
      "El alumno ya tiene una clase programada en esa fecha y hora",
    );
  });

  it("debe bloquear solicitud individual con menos de 24h", async () => {
    const repositoryMock = {
      getStudentUnconfirmedIndividualClassesCloseToStart: vi
        .fn()
        .mockResolvedValue([]),
      getStudentOverdueUnpaidConfirmedClasses: vi.fn().mockResolvedValue([]),
      getStudentPastConfirmedBonusClasses: vi.fn().mockResolvedValue([]),
    };
    const service = new ClasesService(repositoryMock);

    service.buildStudentEligibility = vi.fn().mockResolvedValue({
      puedeReservar: true,
      alumno: {
        profesorAsignadoId: "profesor-1",
      },
    });

    await expect(
      service.createStudentRequest("alumno-1", {
        fecha: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
        metodoPago: "INDIVIDUAL",
      }),
    ).rejects.toThrow(
      "No puedes solicitar una clase individual con menos de 24 horas de antelación.",
    );
  });

  it("debe pedir confirmación de penalización si el alumno cancela pagada con <=24h", async () => {
    const now = Date.now();
    const repositoryMock = {
      findStudentClassById: vi.fn().mockResolvedValue({
        id: "clase-1",
        alumnoId: "alumno-1",
        profesorId: "profesor-1",
        fecha: new Date(now + 12 * 60 * 60 * 1000).toISOString(),
        estado: "CONFIRMADA",
        metodoPago: "INDIVIDUAL",
      }),
      findPaymentByClassId: vi.fn().mockResolvedValue({
        id: "pago-1",
        estado: "PAGADO",
      }),
    };

    const service = new ClasesService(repositoryMock);

    await expect(
      service.cancelByStudent("alumno-1", "clase-1"),
    ).rejects.toThrow(
      "Si cancelas con menos de 24 horas no se devolverá el importe y la factura quedará en penalización. Repite confirmando la penalización.",
    );
  });

  it("debe permitir la cancelación del alumno con más de 24h y cancelar pago pendiente", async () => {
    const now = Date.now();
    const repositoryMock = {
      findStudentClassById: vi.fn().mockResolvedValue({
        id: "clase-1",
        alumnoId: "alumno-1",
        profesorId: "profesor-1",
        fecha: new Date(now + 30 * 60 * 60 * 1000).toISOString(),
        estado: "PROGRAMADA",
        metodoPago: "INDIVIDUAL",
      }),
      findPaymentByClassId: vi.fn().mockResolvedValue({
        id: "pago-1",
        estado: "PENDIENTE",
      }),
      updatePaymentById: vi.fn().mockResolvedValue({}),
      updateClassById: vi.fn().mockResolvedValue({
        id: "clase-1",
        estado: "CANCELADA_ALUMNO",
        canceladaConPenalizacion: false,
      }),
      createNotification: vi.fn().mockResolvedValue({}),
    };

    const service = new ClasesService(repositoryMock);

    await service.cancelByStudent("alumno-1", "clase-1");

    expect(repositoryMock.updatePaymentById).toHaveBeenCalledWith(
      "pago-1",
      expect.objectContaining({ estado: "CANCELADO" }),
    );
    expect(repositoryMock.updateClassById).toHaveBeenCalledWith(
      "clase-1",
      expect.objectContaining({
        estado: "CANCELADA_ALUMNO",
        canceladaConPenalizacion: false,
      }),
    );
  });

  it("debe crear pago pendiente e invoice para clase individual realizada sin pago", async () => {
    const repositoryMock = {
      findPerformedIndividualClassesWithoutInvoice: vi.fn().mockResolvedValue([
        {
          id: "clase-1",
          alumnoId: "alumno-1",
          fecha: "2026-09-01T10:00:00.000Z",
          vehiculo: {
            tipoPermiso: "B",
          },
        },
      ]),
      findFacturaByClassId: vi.fn().mockResolvedValue(null),
      findPaymentByClassId: vi.fn().mockResolvedValue(null),
      getTarifaClasePorPermiso: vi.fn().mockResolvedValue({ precio: 35 }),
      createPendingPaymentForClass: vi.fn().mockResolvedValue({ id: "pago-1" }),
      createClassInvoice: vi.fn().mockResolvedValue({ id: "factura-1" }),
      findPerformedInvoicedIndividualClassesWithoutPayment: vi
        .fn()
        .mockResolvedValue([]),
      findStudentBookingProfile: vi.fn().mockResolvedValue({
        id: "alumno-1",
        tipoLicenciaObjetivo: "B",
        matriculas: [{ estado: "PAGADA", licencia: "B" }],
      }),
      findLatestDgtPaid: vi.fn().mockResolvedValue({
        convocatoriasIncluidas: 2,
        fechaPago: new Date("2026-09-01T10:00:00.000Z"),
      }),
      countExamFailsSince: vi.fn().mockResolvedValue(0),
      hasTheoreticalApto: vi.fn().mockResolvedValue(true),
      findFutureTheoreticalRequest: vi.fn().mockResolvedValue(null),
    };

    const service = new ClasesService(repositoryMock);

    await service.ensureInvoicesForPerformedIndividualClasses("alumno-1");

    expect(repositoryMock.createPendingPaymentForClass).toHaveBeenCalledOnce();
    expect(repositoryMock.createClassInvoice).toHaveBeenCalledOnce();
  });

  it("debe notificar pago pendiente cuando se alcanza el límite de 24h", async () => {
    const now = new Date();
    const repositoryMock = {
      findAll: vi.fn().mockResolvedValue([
        {
          id: "pago-1",
          alumnoId: "alumno-1",
          estado: "PENDIENTE",
          tipo: "CLASE_PRACTICA",
          clasePracticaId: "clase-1",
          observaciones: null,
          clasePractica: {
            pagoLimiteAt: new Date(now.getTime() - 5 * 60 * 1000).toISOString(),
            fecha: new Date(now.getTime() + 23 * 60 * 60 * 1000).toISOString(),
          },
        },
      ]),
      createNotification: vi.fn().mockResolvedValue({ id: "notif-1" }),
      updatePaymentById: vi.fn().mockResolvedValue({ id: "pago-1" }),
    };

    const service = new ClasesService(repositoryMock);

    const result = await service.notifyPendingPaymentsDue24h();

    expect(result).toEqual({ notified: 1 });
    expect(repositoryMock.createNotification).toHaveBeenCalledOnce();
    expect(repositoryMock.updatePaymentById).toHaveBeenCalledWith(
      "pago-1",
      expect.objectContaining({
        observaciones: expect.stringContaining("[NOTIFICADO_PAGO_24H]"),
      }),
    );
  });

  it("debe devolver 0 notificaciones si el repositorio no expone findAll", async () => {
    const service = new ClasesService({});

    const result = await service.notifyPendingPaymentsDue24h();

    expect(result).toEqual({ notified: 0 });
  });

  it("debe crear factura al confirmar una clase individual", async () => {
    const now = Date.now();
    const repositoryMock = {
      getProfessorUnconfirmedIndividualClassesCloseToStart: vi
        .fn()
        .mockResolvedValue([]),
      getProfessorOverdueUnpaidConfirmedClasses: vi.fn().mockResolvedValue([]),
      getProfessorPastConfirmedBonusClasses: vi.fn().mockResolvedValue([]),
      findProfessorClassById: vi.fn().mockResolvedValue({
        id: "clase-1",
        alumnoId: "alumno-1",
        profesorId: "profesor-1",
        fecha: new Date(now + 48 * 60 * 60 * 1000).toISOString(),
        estado: "PROGRAMADA",
        metodoPago: "INDIVIDUAL",
        vehiculo: { tipoPermiso: "B" },
        alumno: { usuario: { nombre: "Alumno Uno" } },
      }),
      getTarifaClasePorPermiso: vi.fn().mockResolvedValue({
        concepto: "Clase práctica B",
        precio: 40,
      }),
      findPaymentByClassId: vi.fn().mockResolvedValue(null),
      createPendingPaymentForClass: vi.fn().mockResolvedValue({
        id: "pago-1",
        numeroFacturaPago: "FAC-1",
      }),
      findFacturaByClassId: vi.fn().mockResolvedValue(null),
      createClassInvoice: vi.fn().mockResolvedValue({ id: "factura-1" }),
      updateClassById: vi.fn().mockResolvedValue({
        id: "clase-1",
        estado: "CONFIRMADA",
      }),
      createNotification: vi.fn().mockResolvedValue({}),
    };

    const service = new ClasesService(repositoryMock);

    await service.confirmByProfessor("profesor-1", "clase-1");

    expect(repositoryMock.createPendingPaymentForClass).toHaveBeenCalledOnce();
    expect(repositoryMock.createClassInvoice).toHaveBeenCalledOnce();
  });

  it("debe cancelar por impago y anular pago al llegar hora de clase", async () => {
    const repositoryMock = {
      getStudentOverdueUnpaidConfirmedClasses: vi.fn().mockResolvedValue([
        {
          id: "clase-1",
          pagos: [{ id: "pago-1", estado: "PENDIENTE" }],
        },
      ]),
      updateClassById: vi.fn().mockResolvedValue({ id: "clase-1" }),
      updatePaymentById: vi.fn().mockResolvedValue({ id: "pago-1" }),
      getStudentPastConfirmedBonusClasses: vi.fn().mockResolvedValue([]),
    };

    const service = new ClasesService(repositoryMock);
    await service.markOverdueUnpaidClassesForStudent("alumno-1");

    expect(repositoryMock.updateClassById).toHaveBeenCalledWith(
      "clase-1",
      expect.objectContaining({
        estado: "CANCELADA_IMPAGO",
        canceladaConPenalizacion: false,
      }),
    );
    expect(repositoryMock.updatePaymentById).toHaveBeenCalledWith(
      "pago-1",
      expect.objectContaining({
        estado: "CANCELADO",
      }),
    );
  });

  it("debe permitir cancelación profesor <=24h devolviendo pago si estaba pagado", async () => {
    const now = Date.now();
    const repositoryMock = {
      findProfessorClassById: vi.fn().mockResolvedValue({
        id: "clase-1",
        alumnoId: "alumno-1",
        profesorId: "profesor-1",
        fecha: new Date(now + 6 * 60 * 60 * 1000).toISOString(),
        estado: "CONFIRMADA",
        metodoPago: "INDIVIDUAL",
        alumno: { usuario: { nombre: "Alumno Uno" } },
      }),
      findPaymentByClassId: vi.fn().mockResolvedValue({
        id: "pago-1",
        estado: "PAGADO",
      }),
      updatePaymentById: vi.fn().mockResolvedValue({}),
      updateFacturasByClassId: vi.fn().mockResolvedValue({ count: 1 }),
      updateClassById: vi.fn().mockResolvedValue({
        id: "clase-1",
        estado: "CANCELADA_PROFESOR",
      }),
      createNotification: vi.fn().mockResolvedValue({}),
    };

    const service = new ClasesService(repositoryMock);

    await service.cancelByProfessor("profesor-1", "clase-1");

    expect(repositoryMock.updatePaymentById).toHaveBeenCalledWith(
      "pago-1",
      expect.objectContaining({ estado: "DEVUELTO" }),
    );
    expect(repositoryMock.updateFacturasByClassId).toHaveBeenCalledWith(
      "clase-1",
      expect.objectContaining({ estado: "DEVUELTA" }),
    );
  });

  it("debe aplicar penalización al cancelar alumno <=24h con pago confirmado", async () => {
    const now = Date.now();
    const repositoryMock = {
      findStudentClassById: vi.fn().mockResolvedValue({
        id: "clase-1",
        alumnoId: "alumno-1",
        profesorId: "profesor-1",
        fecha: new Date(now + 8 * 60 * 60 * 1000).toISOString(),
        estado: "CONFIRMADA",
        metodoPago: "INDIVIDUAL",
      }),
      findPaymentByClassId: vi.fn().mockResolvedValue({
        id: "pago-1",
        estado: "PAGADO",
      }),
      updatePaymentById: vi.fn().mockResolvedValue({}),
      updateFacturasByClassId: vi.fn().mockResolvedValue({ count: 1 }),
      updateClassById: vi.fn().mockResolvedValue({
        id: "clase-1",
        estado: "CANCELADA_ALUMNO",
        canceladaConPenalizacion: true,
      }),
      createNotification: vi.fn().mockResolvedValue({}),
    };

    const service = new ClasesService(repositoryMock);

    await service.cancelByStudent("alumno-1", "clase-1", {
      confirmPenalty: true,
    });

    expect(repositoryMock.updatePaymentById).toHaveBeenCalledWith(
      "pago-1",
      expect.objectContaining({ estado: "PAGADO" }),
    );
    expect(repositoryMock.updateFacturasByClassId).toHaveBeenCalledWith(
      "clase-1",
      expect.objectContaining({ estado: "PENALIZACION" }),
    );
    expect(repositoryMock.updateClassById).toHaveBeenCalledWith(
      "clase-1",
      expect.objectContaining({
        canceladaConPenalizacion: true,
      }),
    );
  });

  it("debe devolver pago e invoice al cancelar con más de 24h una clase pagada", async () => {
    const now = Date.now();
    const repositoryMock = {
      findStudentClassById: vi.fn().mockResolvedValue({
        id: "clase-1",
        alumnoId: "alumno-1",
        profesorId: "profesor-1",
        fecha: new Date(now + 30 * 60 * 60 * 1000).toISOString(),
        estado: "CONFIRMADA",
        metodoPago: "INDIVIDUAL",
      }),
      findPaymentByClassId: vi.fn().mockResolvedValue({
        id: "pago-1",
        estado: "PAGADO",
      }),
      updatePaymentById: vi.fn().mockResolvedValue({}),
      updateFacturasByClassId: vi.fn().mockResolvedValue({ count: 1 }),
      updateClassById: vi.fn().mockResolvedValue({
        id: "clase-1",
        estado: "CANCELADA_ALUMNO",
        canceladaConPenalizacion: false,
      }),
      createNotification: vi.fn().mockResolvedValue({}),
    };

    const service = new ClasesService(repositoryMock);

    await service.cancelByStudent("alumno-1", "clase-1");

    expect(repositoryMock.updatePaymentById).toHaveBeenCalledWith(
      "pago-1",
      expect.objectContaining({
        estado: "DEVUELTO",
      }),
    );
    expect(repositoryMock.updateFacturasByClassId).toHaveBeenCalledWith(
      "clase-1",
      expect.objectContaining({ estado: "DEVUELTA" }),
    );
  });

  it("debe descontar consumidas y solicitadas al informar bonos en reserva", async () => {
    const now = Date.now();
    const repositoryMock = {
      getStudentUnconfirmedIndividualClassesCloseToStart: vi
        .fn()
        .mockResolvedValue([]),
      getStudentOverdueUnpaidConfirmedClasses: vi.fn().mockResolvedValue([]),
      getStudentUpcomingConfirmedClasses: vi.fn().mockResolvedValue([
        {
          id: "clase-consumida",
          compraBonoId: "bono-1",
          fecha: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
          estado: "CONFIRMADA",
          hojaRuta: {
            id: "hr-1",
            estado: "REGISTRADA",
          },
        },
        {
          id: "clase-solicitada",
          compraBonoId: "bono-1",
          fecha: new Date(now + 2 * 24 * 60 * 60 * 1000).toISOString(),
          estado: "PROGRAMADA",
          hojaRuta: null,
        },
      ]),
      getStudentPendingRequests: vi.fn().mockResolvedValue([]),
      getTarifaClasePorPermiso: vi.fn().mockResolvedValue({ precio: 40 }),
      getApplicableBonos: vi.fn().mockResolvedValue([
        {
          id: "bono-1",
          clasesCompradas: 20,
          clasesConsumidas: 0,
          fechaValidezHasta: new Date(now + 20 * 24 * 60 * 60 * 1000),
          bono: {
            nombre: "Pack 20",
          },
        },
      ]),
    };

    const service = new ClasesService(repositoryMock);
    service.buildStudentEligibility = vi.fn().mockResolvedValue({
      puedeReservar: false,
      bloqueos: ["Sin teórico APTO"],
      teoricoApto: false,
      vidasIncluidas: 2,
      vidasGastadas: 0,
      vidasDisponibles: 2,
      tieneExamenTeoricoFuturo: null,
      permiso: "B",
      alumno: {
        profesorAsignadoId: null,
      },
    });

    const result = await service.getStudentBookingContext("alumno-1", 0);
    const bono = result.pago.bonosDisponibles[0];

    expect(bono.clasesConsumidas).toBe(1);
    expect(bono.clasesSolicitadas).toBe(1);
    expect(bono.clasesDisponiblesSinSolicitudes).toBe(19);
    expect(bono.clasesDisponibles).toBe(18);
  });
});
