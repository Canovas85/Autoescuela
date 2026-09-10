const DURACION_CLASE_MINUTOS = 45;
const CONVOCATORIAS_POR_DEFECTO = 2;
const ESTADOS_OCUPADOS = ["PROGRAMADA", "CONFIRMADA"];
const WEEKDAY_MADRID_TO_INDEX = {
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
  sunday: 7,
};

const getMadridDateParts = (dateInput) => {
  const date = new Date(dateInput);

  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Madrid",
    weekday: "long",
  })
    .format(date)
    .toLowerCase();

  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Madrid",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const hour = Number(parts.find((part) => part.type === "hour")?.value || "0");
  const minute = Number(
    parts.find((part) => part.type === "minute")?.value || "0",
  );

  return {
    dayIndex: WEEKDAY_MADRID_TO_INDEX[weekday] || 1,
    minutes: hour * 60 + minute,
  };
};

const toDate = (value) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error("La fecha seleccionada no es válida");
  }

  return date;
};

const timeToMinutes = (value) => {
  if (typeof value !== "string") {
    return Number.NaN;
  }

  const match = value.match(/^([01]\d|2[0-3]):([0-5]\d)$/);

  if (!match) {
    return Number.NaN;
  }

  return Number(match[1]) * 60 + Number(match[2]);
};

const getWeekBounds = (weekOffsetInput) => {
  const weekOffset = Number.parseInt(weekOffsetInput ?? "0", 10);
  const offset = Number.isNaN(weekOffset) ? 0 : weekOffset;

  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setHours(0, 0, 0, 0);

  const dayIndex = weekStart.getDay();
  const distanceFromMonday = (dayIndex + 6) % 7;
  weekStart.setDate(weekStart.getDate() - distanceFromMonday + offset * 7);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  return {
    weekStart,
    weekEnd,
    weekOffset: offset,
  };
};

const getDayIndexMondayBased = (date) => {
  return getMadridDateParts(date).dayIndex;
};

export class ClasesService {
  constructor(repository) {
    this.repository = repository;
  }

  async createNotification(usuarioId, tipo, titulo, mensaje, metadata = null) {
    if (!usuarioId) {
      return;
    }

    await this.repository.createNotification({
      usuarioId,
      tipo,
      titulo,
      mensaje,
      metadata,
    });
  }

  async buildStudentEligibility(alumnoId) {
    const alumno = await this.repository.findStudentBookingProfile(alumnoId);

    if (!alumno) {
      throw new Error("Alumno no encontrado");
    }

    const matricula = alumno.matriculas?.[0] ?? null;
    const matriculaPagada = matricula?.estado === "PAGADA";
    const permiso = String(
      matricula?.licencia || alumno.tipoLicenciaObjetivo || "B",
    )
      .trim()
      .toUpperCase();

    const pagoDgt = matriculaPagada
      ? await this.repository.findLatestDgtPaid(alumnoId, permiso)
      : null;

    const fechaInicioVidas =
      pagoDgt?.fechaPago || pagoDgt?.fechaCreacion || new Date();

    const vidasIncluidas = Number(
      pagoDgt?.convocatoriasIncluidas || CONVOCATORIAS_POR_DEFECTO,
    );
    const vidasGastadas = pagoDgt
      ? await this.repository.countTheoreticalFailsSince(
          alumnoId,
          fechaInicioVidas,
        )
      : 0;
    const vidasDisponibles = pagoDgt
      ? Math.max(vidasIncluidas - vidasGastadas, 0)
      : 0;

    const teoricoApto = await this.repository.hasTheoreticalApto(alumnoId);
    const tieneExamenTeoricoFuturo =
      await this.repository.findFutureTheoreticalRequest(alumnoId);

    const puedeReservar = Boolean(matriculaPagada) && Boolean(teoricoApto);

    const bloqueos = [];

    if (!matriculaPagada) {
      bloqueos.push(
        "Debes tener la matrícula pagada para reservar clases prácticas",
      );
    }

    if (!teoricoApto) {
      bloqueos.push(
        "No puedes reservar todavía: necesitas tener el examen teórico en estado APTO",
      );
    }

    return {
      alumno,
      permiso,
      teoricoApto,
      vidasIncluidas,
      vidasGastadas,
      vidasDisponibles,
      tieneExamenTeoricoFuturo,
      puedeReservar,
      bloqueos,
      matriculaPagada,
    };
  }

  mapClaseBasica(clase) {
    return {
      id: clase.id,
      fecha: clase.fecha,
      duracion: clase.duracion,
      estado: clase.estado,
      metodoPago: clase.metodoPago,
      canceladaConPenalizacion: Boolean(clase.canceladaConPenalizacion),
      profesor: clase.profesor
        ? {
            id: clase.profesor.id,
            nombre: clase.profesor.usuario?.nombre || "Profesor",
          }
        : null,
      alumno: clase.alumno
        ? {
            id: clase.alumno.id,
            nombre: clase.alumno.usuario?.nombre || "Alumno",
          }
        : null,
      vehiculo: clase.vehiculo
        ? {
            id: clase.vehiculo.id,
            matricula: clase.vehiculo.matricula,
            marca: clase.vehiculo.marca,
            modelo: clase.vehiculo.modelo,
            tipoPermiso: clase.vehiculo.tipoPermiso,
          }
        : null,
    };
  }

  async markOverdueUnpaidClassesForStudent(alumnoId) {
    const now = new Date();
    const overdue =
      await this.repository.getStudentOverdueUnpaidConfirmedClasses(
        alumnoId,
        now,
      );

    for (const clase of overdue) {
      await this.repository.updateClassById(clase.id, {
        estado: "CANCELADA_IMPAGO",
        canceladaPor: "SISTEMA",
        canceladaConPenalizacion: false,
      });

      for (const pago of clase.pagos || []) {
        await this.repository.updatePaymentById(pago.id, {
          estado: "CANCELADO",
          observaciones: "Clase cancelada por impago fuera de plazo",
        });
      }
    }
  }

  async markOverdueUnpaidClassesForProfessor(profesorId) {
    const now = new Date();
    const overdue =
      await this.repository.getProfessorOverdueUnpaidConfirmedClasses(
        profesorId,
        now,
      );

    for (const clase of overdue) {
      await this.repository.updateClassById(clase.id, {
        estado: "CANCELADA_IMPAGO",
        canceladaPor: "SISTEMA",
        canceladaConPenalizacion: false,
      });

      for (const pago of clase.pagos || []) {
        await this.repository.updatePaymentById(pago.id, {
          estado: "CANCELADO",
          observaciones: "Clase cancelada por impago fuera de plazo",
        });
      }

      await this.createNotification(
        clase.alumnoId,
        "CLASE_CANCELADA",
        "Clase cancelada por impago",
        "La clase confirmada se ha cancelado al no recibir el pago 24 horas antes del inicio",
        {
          claseId: clase.id,
          motivo: "IMPAGO",
        },
      );
    }
  }

  buildWeekAvailability(horarioRows, clasesSemana) {
    const classesByDay = new Map();

    for (let day = 1; day <= 7; day += 1) {
      classesByDay.set(day, []);
    }

    for (const clase of clasesSemana || []) {
      const day = getDayIndexMondayBased(new Date(clase.fecha));
      const list = classesByDay.get(day) || [];
      list.push(clase);
      classesByDay.set(day, list);
    }

    const days = [];

    for (let day = 1; day <= 7; day += 1) {
      const bloques = (horarioRows || []).filter(
        (row) => row.diaSemana === day,
      );
      const slots = [];
      const ocupadas = classesByDay.get(day) || [];

      for (const bloque of bloques) {
        const inicio = timeToMinutes(bloque.horaInicio);
        const fin = timeToMinutes(bloque.horaFin);

        if (Number.isNaN(inicio) || Number.isNaN(fin) || fin <= inicio) {
          continue;
        }

        for (
          let minute = inicio;
          minute + DURACION_CLASE_MINUTOS <= fin;
          minute += DURACION_CLASE_MINUTOS
        ) {
          const hh = String(Math.floor(minute / 60)).padStart(2, "0");
          const mm = String(minute % 60).padStart(2, "0");
          const timeLabel = `${hh}:${mm}`;

          const occupied = ocupadas.some((clase) => {
            const { minutes: start } = getMadridDateParts(clase.fecha);
            const duration = Number(clase.duracion) || DURACION_CLASE_MINUTOS;
            const end = start + duration;
            const slotEnd = minute + DURACION_CLASE_MINUTOS;

            return (
              ESTADOS_OCUPADOS.includes(clase.estado) &&
              minute < end &&
              slotEnd > start
            );
          });

          slots.push({
            hora: timeLabel,
            disponible: !occupied,
          });
        }
      }

      const totalSlots = slots.length;
      const disponibles = slots.filter((slot) => slot.disponible).length;

      days.push({
        diaSemana: day,
        totalSlots,
        disponibles,
        estado:
          totalSlots === 0
            ? "SIN_HORARIO"
            : disponibles === 0
              ? "SIN_DISPONIBILIDAD"
              : disponibles === totalSlots
                ? "DISPONIBLE"
                : "PARCIAL",
        slots,
      });
    }

    return days;
  }

  async getStudentEligibility(alumnoId) {
    const eligibility = await this.buildStudentEligibility(alumnoId);

    return {
      permitido: eligibility.puedeReservar,
      bloqueos: eligibility.bloqueos,
      teoricoApto: eligibility.teoricoApto,
      vidas: {
        incluidas: eligibility.vidasIncluidas,
        gastadas: eligibility.vidasGastadas,
        disponibles: eligibility.vidasDisponibles,
      },
      examenTeoricoProgramado: eligibility.tieneExamenTeoricoFuturo
        ? {
            id: eligibility.tieneExamenTeoricoFuturo.id,
            fecha: eligibility.tieneExamenTeoricoFuturo.fechaProgramada,
            estado: eligibility.tieneExamenTeoricoFuturo.estado,
          }
        : null,
      profesorAsignado: eligibility.alumno.profesorAsignado
        ? {
            id: eligibility.alumno.profesorAsignado.id,
            nombre:
              eligibility.alumno.profesorAsignado.usuario?.nombre ||
              "Profesor asignado",
          }
        : null,
    };
  }

  async getStudentBookingContext(alumnoId, weekOffset) {
    await this.markOverdueUnpaidClassesForStudent(alumnoId);

    const eligibility = await this.buildStudentEligibility(alumnoId);

    const base = {
      elegibilidad: {
        permitido: eligibility.puedeReservar,
        bloqueos: eligibility.bloqueos,
        teoricoApto: eligibility.teoricoApto,
        vidas: {
          incluidas: eligibility.vidasIncluidas,
          gastadas: eligibility.vidasGastadas,
          disponibles: eligibility.vidasDisponibles,
        },
        examenTeoricoProgramado: eligibility.tieneExamenTeoricoFuturo
          ? {
              id: eligibility.tieneExamenTeoricoFuturo.id,
              fecha: eligibility.tieneExamenTeoricoFuturo.fechaProgramada,
              estado: eligibility.tieneExamenTeoricoFuturo.estado,
            }
          : null,
      },
      proximasClases: [],
      solicitudesPendientes: [],
      calendarioSemana: null,
      pago: {
        precioClase: 35,
        bonosDisponibles: [],
      },
    };

    const [proximasClases, solicitudesPendientes] = await Promise.all([
      this.repository.getStudentUpcomingConfirmedClasses(alumnoId),
      this.repository.getStudentPendingRequests(alumnoId),
    ]);

    base.proximasClases = (proximasClases || []).map((clase) =>
      this.mapClaseBasica(clase),
    );
    base.solicitudesPendientes = (solicitudesPendientes || []).map((clase) =>
      this.mapClaseBasica(clase),
    );

    const tarifa = await this.repository.getTarifaClasePorPermiso(
      eligibility.permiso,
    );
    if (tarifa?.precio !== undefined && tarifa?.precio !== null) {
      base.pago.precioClase = Number(tarifa.precio);
    }

    const now = new Date();
    const bonos = await this.repository.getApplicableBonos(alumnoId, now);
    base.pago.bonosDisponibles = (bonos || [])
      .filter((bono) => bono.clasesConsumidas < bono.clasesCompradas)
      .map((bono) => ({
        id: bono.id,
        nombre: bono.bono?.nombre || "Bono",
        fechaValidezHasta: bono.fechaValidezHasta,
        clasesDisponibles: Math.max(
          bono.clasesCompradas - bono.clasesConsumidas,
          0,
        ),
      }));

    if (!eligibility.puedeReservar) {
      return base;
    }

    const profesorId = eligibility.alumno.profesorAsignadoId;

    if (!profesorId) {
      return {
        ...base,
        elegibilidad: {
          ...base.elegibilidad,
          permitido: false,
          bloqueos: [
            ...base.elegibilidad.bloqueos,
            "No tienes profesor asignado todavía",
          ],
        },
      };
    }

    const {
      weekStart,
      weekEnd,
      weekOffset: offset,
    } = getWeekBounds(weekOffset);
    const [horarioRows, clasesSemana] = await Promise.all([
      this.repository.getProfessorWorkSchedule(profesorId),
      this.repository.getProfessorClassesBetween(
        profesorId,
        weekStart,
        weekEnd,
      ),
    ]);

    base.calendarioSemana = {
      offset,
      inicio: weekStart,
      fin: weekEnd,
      dias: this.buildWeekAvailability(horarioRows, clasesSemana),
      profesor: {
        id: eligibility.alumno.profesorAsignado.id,
        nombre:
          eligibility.alumno.profesorAsignado.usuario?.nombre ||
          "Profesor asignado",
      },
    };

    return base;
  }

  async createStudentRequest(alumnoId, payload) {
    const eligibility = await this.buildStudentEligibility(alumnoId);

    if (!eligibility.puedeReservar) {
      throw new Error(
        "No puedes reservar clases: necesitas tener el examen teórico en estado APTO",
      );
    }

    const profesorId = eligibility.alumno.profesorAsignadoId;

    if (!profesorId) {
      throw new Error("No tienes profesor asignado");
    }

    const fecha = toDate(payload.fecha);
    const metodoPago = String(payload.metodoPago || "INDIVIDUAL")
      .trim()
      .toUpperCase();

    if (!["BONO", "INDIVIDUAL"].includes(metodoPago)) {
      throw new Error("El método de pago debe ser BONO o INDIVIDUAL");
    }

    const dayId = getDayIndexMondayBased(fecha);
    const { minutes } = getMadridDateParts(fecha);
    const schedule = await this.repository.getProfessorWorkSchedule(profesorId);

    const validInSchedule = (schedule || [])
      .filter((item) => item.diaSemana === dayId)
      .some((item) => {
        const start = timeToMinutes(item.horaInicio);
        const end = timeToMinutes(item.horaFin);
        return minutes >= start && minutes + DURACION_CLASE_MINUTOS <= end;
      });

    if (!validInSchedule) {
      throw new Error(
        "La hora seleccionada está fuera del horario del profesor",
      );
    }

    const confirmedStudent = await this.repository.findStudentConfirmedBySlot(
      alumnoId,
      fecha,
    );

    if (confirmedStudent) {
      throw new Error("Ya tienes una clase confirmada en esa franja");
    }

    const professorBusy = await this.repository.findProfessorOccupiedBySlot(
      profesorId,
      fecha,
    );

    if (professorBusy) {
      throw new Error("El profesor no tiene disponibilidad en esa franja");
    }

    const vehicles = await this.repository.getAvailableVehiclesByPermiso(
      eligibility.permiso,
      fecha,
    );

    if (!vehicles.length) {
      throw new Error(
        "No hay vehículos disponibles para esta licencia en la franja seleccionada",
      );
    }

    const randomIndex = Math.floor(Math.random() * vehicles.length);
    const selectedVehicle = vehicles[randomIndex];

    let compraBonoId = null;

    if (metodoPago === "BONO") {
      const bonos = await this.repository.getApplicableBonos(
        alumnoId,
        new Date(),
      );
      const candidatos = bonos.filter(
        (bono) => bono.clasesConsumidas < bono.clasesCompradas,
      );

      if (!candidatos.length) {
        throw new Error("No tienes un bono activo con clases disponibles");
      }

      if (payload.compraBonoId) {
        const requested = candidatos.find(
          (item) => item.id === payload.compraBonoId,
        );

        if (!requested) {
          throw new Error(
            "El bono seleccionado no es válido para esta reserva",
          );
        }

        compraBonoId = requested.id;
      } else {
        compraBonoId = candidatos[0].id;
      }
    }

    const created = await this.repository.createStudentRequest({
      alumnoId,
      profesorId,
      vehiculoId: selectedVehicle.id,
      compraBonoId,
      fecha,
      duracion: DURACION_CLASE_MINUTOS,
      estado: "PROGRAMADA",
      metodoPago,
      pagoLimiteAt:
        metodoPago === "INDIVIDUAL"
          ? new Date(fecha.getTime() - 24 * 60 * 60 * 1000)
          : null,
      canceladaPor: null,
      canceladaConPenalizacion: false,
    });

    await Promise.all([
      this.createNotification(
        profesorId,
        "CLASE_SOLICITADA",
        "Nueva solicitud de clase práctica",
        `Tienes una nueva solicitud de ${eligibility.alumno.usuario?.nombre || "un alumno"} para ${fecha.toLocaleString("es-ES")}`,
        {
          claseId: created.id,
          alumnoId,
        },
      ),
      this.createNotification(
        alumnoId,
        "CLASE_SOLICITADA",
        "Solicitud enviada al profesor",
        "Tu solicitud de clase práctica está pendiente de confirmación por el profesor",
        {
          claseId: created.id,
        },
      ),
    ]);

    return this.mapClaseBasica(created);
  }

  async confirmByProfessor(profesorId, classId) {
    await this.markOverdueUnpaidClassesForProfessor(profesorId);

    const clase = await this.repository.findProfessorClassById(
      profesorId,
      classId,
    );

    if (!clase) {
      throw new Error("Clase no encontrada o no asignada al profesor");
    }

    if (clase.estado !== "PROGRAMADA") {
      throw new Error(
        "Solo se pueden confirmar solicitudes en estado PROGRAMADA",
      );
    }

    let compraBonoUsada = clase.compraBonoId;

    if (clase.metodoPago === "BONO") {
      const bonos = await this.repository.getApplicableBonos(
        clase.alumnoId,
        new Date(),
      );
      const disponibles = bonos.filter(
        (bono) => bono.clasesConsumidas < bono.clasesCompradas,
      );

      if (!disponibles.length) {
        throw new Error(
          "El alumno no tiene bonos disponibles para confirmar la clase",
        );
      }

      if (compraBonoUsada) {
        const existe = disponibles.find((item) => item.id === compraBonoUsada);

        if (!existe) {
          compraBonoUsada = disponibles[0].id;
        }
      } else {
        compraBonoUsada = disponibles[0].id;
      }

      await this.repository.decrementBonoClass(compraBonoUsada);
    }

    if (clase.metodoPago === "INDIVIDUAL") {
      const pagoActual = await this.repository.findPaymentByClassId(clase.id);

      if (!pagoActual) {
        const pagoLimiteAt = new Date(
          new Date(clase.fecha).getTime() - 24 * 60 * 60 * 1000,
        );
        const concepto = `Clase práctica ${new Date(clase.fecha).toLocaleDateString("es-ES")} ${new Date(clase.fecha).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}`;

        const tarifa = await this.repository.getTarifaClasePorPermiso(
          clase.vehiculo?.tipoPermiso || "B",
        );

        const importe = Number(tarifa?.precio ?? 35);

        await this.repository.createPendingPaymentForClass({
          alumnoId: clase.alumnoId,
          clasePracticaId: clase.id,
          tipo: "CLASE_PRACTICA",
          concepto,
          permiso: clase.vehiculo?.tipoPermiso || "B",
          importe,
          estado: "PENDIENTE",
          convocatoriasIncluidas: 0,
          convocatoriasConsumidas: 0,
          observaciones: "Debe abonarse al menos 24h antes de la clase",
        });

        await this.repository.updateClassById(clase.id, {
          pagoLimiteAt,
        });
      }
    }

    const updated = await this.repository.updateClassById(clase.id, {
      estado: "CONFIRMADA",
      compraBonoId: compraBonoUsada,
      canceladaPor: null,
      canceladaConPenalizacion: false,
    });

    await Promise.all([
      this.createNotification(
        clase.alumnoId,
        "CLASE_CONFIRMADA",
        "Clase práctica confirmada",
        `Tu profesor ha confirmado la clase del ${new Date(clase.fecha).toLocaleString("es-ES")}`,
        {
          claseId: clase.id,
        },
      ),
      this.createNotification(
        profesorId,
        "CLASE_CONFIRMADA",
        "Solicitud confirmada",
        `Has confirmado la clase de ${clase.alumno?.usuario?.nombre || "alumno"}`,
        {
          claseId: clase.id,
        },
      ),
      clase.metodoPago === "INDIVIDUAL"
        ? this.createNotification(
            clase.alumnoId,
            "PAGO_PENDIENTE",
            "Pago pendiente de clase práctica",
            "Debes pagar la clase al menos 24 horas antes del inicio",
            {
              claseId: clase.id,
            },
          )
        : Promise.resolve(),
    ]);

    return this.mapClaseBasica(updated);
  }

  async cancelByProfessor(profesorId, classId) {
    const clase = await this.repository.findProfessorClassById(
      profesorId,
      classId,
    );

    if (!clase) {
      throw new Error("Clase no encontrada o no asignada al profesor");
    }

    if (!["PROGRAMADA", "CONFIRMADA"].includes(clase.estado)) {
      throw new Error(
        "Solo se pueden cancelar clases en estado PROGRAMADA o CONFIRMADA",
      );
    }

    if (
      clase.estado === "CONFIRMADA" &&
      clase.metodoPago === "BONO" &&
      clase.compraBonoId
    ) {
      const compra = await this.repository.findCompraBonoByIdForAlumno(
        clase.compraBonoId,
        clase.alumnoId,
      );

      if (compra && compra.clasesConsumidas > 0) {
        await this.repository.incrementBonoClass(clase.compraBonoId);
      }
    }

    const pago = await this.repository.findPaymentByClassId(clase.id);
    if (pago && pago.estado === "PENDIENTE") {
      await this.repository.updatePaymentById(pago.id, {
        estado: "CANCELADO",
        observaciones: "Clase cancelada por el profesor",
      });
    }

    const updated = await this.repository.updateClassById(clase.id, {
      estado: "CANCELADA_PROFESOR",
      canceladaPor: "PROFESOR",
      canceladaConPenalizacion: false,
    });

    await Promise.all([
      this.createNotification(
        clase.alumnoId,
        "CLASE_CANCELADA",
        "Clase cancelada por el profesor",
        "La solicitud ha sido cancelada por tu profesor y no se aplicará cobro",
        {
          claseId: clase.id,
          motivo: "PROFESOR",
        },
      ),
      this.createNotification(
        profesorId,
        "CLASE_CANCELADA",
        "Solicitud cancelada",
        `Has cancelado la clase de ${clase.alumno?.usuario?.nombre || "alumno"}`,
        {
          claseId: clase.id,
        },
      ),
    ]);

    return this.mapClaseBasica(updated);
  }

  async cancelByStudent(alumnoId, classId) {
    const clase = await this.repository.findStudentClassById(alumnoId, classId);

    if (!clase) {
      throw new Error("Clase no encontrada");
    }

    if (!["PROGRAMADA", "CONFIRMADA"].includes(clase.estado)) {
      throw new Error(
        "Solo puedes cancelar clases en estado PROGRAMADA o CONFIRMADA",
      );
    }

    const now = new Date();
    const classDate = new Date(clase.fecha);
    const diffHours = (classDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    const conPenalizacion = clase.estado === "CONFIRMADA" && diffHours <= 24;

    const pago = await this.repository.findPaymentByClassId(clase.id);

    if (clase.metodoPago === "BONO" && clase.compraBonoId) {
      const compra = await this.repository.findCompraBonoByIdForAlumno(
        clase.compraBonoId,
        alumnoId,
      );

      if (!conPenalizacion && compra && compra.clasesConsumidas > 0) {
        await this.repository.incrementBonoClass(clase.compraBonoId);
      }

      if (conPenalizacion && (!compra || compra.clasesConsumidas <= 0)) {
        await this.repository.decrementBonoClass(clase.compraBonoId);
      }
    }

    if (clase.metodoPago === "INDIVIDUAL") {
      if (!conPenalizacion && pago?.estado === "PENDIENTE") {
        await this.repository.updatePaymentById(pago.id, {
          estado: "CANCELADO",
          observaciones: "Cancelación sin penalización por el alumno",
        });
      }

      if (conPenalizacion && !pago) {
        const tarifa = await this.repository.getTarifaClasePorPermiso("B");
        await this.repository.createPendingPaymentForClass({
          alumnoId,
          clasePracticaId: clase.id,
          tipo: "CLASE_PRACTICA",
          concepto: `Penalización cancelación tardía clase ${classDate.toLocaleDateString("es-ES")}`,
          permiso: "B",
          importe: Number(tarifa?.precio ?? 35),
          estado: "PENDIENTE",
          convocatoriasIncluidas: 0,
          convocatoriasConsumidas: 0,
          observaciones: "Cobro por cancelación tardía (menos de 24h)",
        });
      }
    }

    const updated = await this.repository.updateClassById(clase.id, {
      estado: conPenalizacion
        ? "CANCELADA_CON_PENALIZACION"
        : "CANCELADA_ALUMNO",
      canceladaPor: "ALUMNO",
      canceladaConPenalizacion: conPenalizacion,
    });

    await Promise.all([
      this.createNotification(
        alumnoId,
        "CLASE_CANCELADA",
        conPenalizacion
          ? "Clase cancelada con penalización"
          : "Clase cancelada sin penalización",
        conPenalizacion
          ? "Has cancelado con menos de 24h y se aplica penalización"
          : "Has cancelado la clase con más de 24h sin penalización",
        {
          claseId: clase.id,
          penalizacion: conPenalizacion,
        },
      ),
      this.createNotification(
        clase.profesorId,
        "CLASE_CANCELADA",
        "Clase cancelada por el alumno",
        `El alumno ha cancelado la clase ${conPenalizacion ? "con" : "sin"} penalización`,
        {
          claseId: clase.id,
          penalizacion: conPenalizacion,
        },
      ),
    ]);

    return this.mapClaseBasica(updated);
  }

  async getProfessorRequests(profesorId) {
    await this.markOverdueUnpaidClassesForProfessor(profesorId);

    const rows = await this.repository.getProfessorClassRequests(profesorId);

    return rows.map((row) => this.mapClaseBasica(row));
  }

  async create(data) {
    if (!data.alumnoId) {
      throw new Error("El alumno es obligatorio");
    }

    if (!data.profesorId) {
      throw new Error("El profesor es obligatorio");
    }

    if (!data.vehiculoId) {
      throw new Error("El vehículo es obligatorio");
    }

    if (!data.fecha) {
      throw new Error("La fecha es obligatoria");
    }

    if (!data.duracion) {
      throw new Error("La duración es obligatoria");
    }

    const existingClass = await this.repository.findByProfesorAndFecha(
      data.profesorId,
      data.fecha,
    );

    if (existingClass) {
      throw new Error(
        "El profesor ya tiene una clase programada en esa fecha y hora",
      );
    }

    const existingVehicleClass = await this.repository.findByVehiculoAndFecha(
      data.vehiculoId,
      data.fecha,
    );

    if (existingVehicleClass) {
      throw new Error(
        "El vehículo ya está asignado a otra clase en esa fecha y hora",
      );
    }

    const existingStudentClass = await this.repository.findByAlumnoAndFecha(
      data.alumnoId,
      data.fecha,
    );

    if (existingStudentClass) {
      throw new Error(
        "El alumno ya tiene una clase programada en esa fecha y hora",
      );
    }

    return this.repository.create({
      ...data,
      estado: "PROGRAMADA",
    });
  }

  async getAll() {
    return this.repository.findAll();
  }

  async getById(id) {
    return this.repository.findById(id);
  }

  async update(id, data) {
    return this.repository.update(id, data);
  }

  async cancel(id) {
    return this.repository.cancel(id);
  }
}
