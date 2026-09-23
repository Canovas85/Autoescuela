import bcrypt from "bcryptjs";

const LICENCIAS_VALIDAS = new Set(["B", "A1", "A2", "A", "C", "D", "E"]);

const normalizarDni = (valor) => {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  const dni = String(valor).trim();
  if (!dni) {
    return null;
  }

  return /^\d{8}[A-Za-z]$/.test(dni) ? dni.toUpperCase() : null;
};

const normalizarPermisosLicencias = (valor, fallbackLicencia = undefined) => {
  const origen =
    valor !== undefined
      ? valor
      : fallbackLicencia !== undefined
        ? [fallbackLicencia]
        : [];

  const lista = Array.isArray(origen) ? origen : [origen];
  const normalizadas = [
    ...new Set(
      lista
        .map((item) =>
          String(item || "")
            .trim()
            .toUpperCase(),
        )
        .filter(Boolean),
    ),
  ];

  if (normalizadas.length === 0) {
    throw new Error("Debes seleccionar al menos un permiso");
  }

  const invalidas = normalizadas.filter(
    (licencia) => !LICENCIAS_VALIDAS.has(licencia),
  );
  if (invalidas.length > 0) {
    throw new Error("Hay permisos de licencia no válidos");
  }

  return normalizadas;
};

export class ProfesoresService {
  constructor(repository, accountActivationService = null) {
    this.repository = repository;
    this.accountActivationService = accountActivationService;
  }

  async create(data, context = {}) {
    const nombre = typeof data.nombre === "string" ? data.nombre.trim() : "";

    if (!nombre) {
      throw new Error("El nombre es obligatorio");
    }

    if (!data.email) {
      throw new Error("El email es obligatorio");
    }

    const permisosLicencias = normalizarPermisosLicencias(
      data.permisosLicencias,
      data.licenciaConducir ?? data.tipoLicencia ?? data.especialidad,
    );

    if (!data.telefono) {
      throw new Error("El teléfono es obligatorio");
    }

    if (!data.password) {
      throw new Error("La contraseña es obligatoria");
    }

    if (data.password.length < 8) {
      throw new Error("La contraseña debe tener al menos 8 caracteres");
    }

    const existingUser = await this.repository.findByEmail(data.email);

    if (existingUser) {
      throw new Error("El email ya existe");
    }

    if (
      data.dni === undefined ||
      data.dni === null ||
      String(data.dni).trim() === ""
    ) {
      throw new Error("El DNI es obligatorio");
    }

    const dni = normalizarDni(data.dni);
    if (!dni) {
      throw new Error("El DNI debe tener un formato válido");
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const profesor = await this.repository.create({
      ...data,
      nombre,
      dni,
      permisosLicencias,
      licenciaConducir: permisosLicencias[0],
      passwordHash,
      rol: "PROFESOR",
      activo: true,
    });

    if (this.accountActivationService) {
      try {
        await this.accountActivationService.issueActivationForUser({
          usuarioId: profesor.id,
          createdById: context.createdById || null,
        });
      } catch (error) {
        console.error(
          "No se pudo enviar el enlace de activación al profesor:",
          error.message,
        );
      }
    }

    return profesor;
  }

  async getAll() {
    return this.repository.findAll();
  }

  async getById(id) {
    return this.repository.findById(id);
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

  getMonthBounds() {
    const now = new Date();
    const monthStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
      0,
      0,
      0,
      0,
    );
    const monthEnd = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    return {
      monthStart,
      monthEnd,
    };
  }

  isClassDone(clase) {
    const classStatus = String(clase?.estado || "").toUpperCase();
    const roadmapStatus = String(clase?.hojaRuta?.estado || "").toUpperCase();

    return (
      ["REALIZADA", "COMPLETADA", "FINALIZADA", "REGISTRADA"].includes(
        classStatus,
      ) || roadmapStatus === "REGISTRADA"
    );
  }

  deriveAgendaStatus(clase, now = new Date()) {
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

  mapAgendaClass(clase, now = new Date()) {
    return {
      id: clase.id,
      fecha: clase.fecha,
      duracion: clase.duracion,
      estado: clase.estado,
      estadoAgenda: this.deriveAgendaStatus(clase, now),
      alumno: {
        id: clase.alumnoId,
        nombre: clase.alumno?.usuario?.nombre || "Alumno",
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

  async getOverview(id, options = {}) {
    const profesor = await this.repository.findById(id);

    if (!profesor) {
      throw new Error("Profesor no encontrado");
    }

    const weekOffset = this.parseWeekOffset(options.weekOffset);
    const { weekStart, weekEnd } = this.getWeekBounds(weekOffset);
    const { monthStart, monthEnd } = this.getMonthBounds();

    const [assignedStudents, monthClasses] = await Promise.all([
      this.repository.findAssignedAlumnosLite(id),
      this.repository.findProfesorClassesBetween(id, monthStart, monthEnd),
    ]);

    const alumnos = (assignedStudents || []).map((alumno) => ({
      id: alumno.id,
      nombre: alumno.usuario?.nombre || "Alumno",
      licencia: alumno.tipoLicenciaObjetivo || "-",
    }));

    const selectedAlumnoIdRaw = options.alumnoId || alumnos[0]?.id || null;
    const selectedAlumnoId = selectedAlumnoIdRaw
      ? String(selectedAlumnoIdRaw)
      : null;

    const selectedAlumno = selectedAlumnoId
      ? alumnos.find((alumno) => alumno.id === selectedAlumnoId)
      : null;

    if (selectedAlumnoId && !selectedAlumno) {
      throw new Error(
        "El alumno seleccionado no está asignado a este profesor",
      );
    }

    const studentWeekClasses = selectedAlumno
      ? await this.repository.findProfesorStudentClassesBetween(
          id,
          selectedAlumno.id,
          weekStart,
          weekEnd,
        )
      : [];

    const now = new Date();

    const programadasMes = (monthClasses || []).filter((clase) => {
      const status = String(clase?.estado || "").toUpperCase();
      return status !== "CANCELADA";
    }).length;

    const realizadasMes = (monthClasses || []).filter((clase) =>
      this.isClassDone(clase),
    ).length;

    return {
      profesor: {
        id: profesor.id,
        nombre: profesor.usuario?.nombre || "Profesor",
      },
      alumnos,
      resumenMes: {
        programadas: programadasMes,
        realizadas: realizadasMes,
      },
      agendaAlumno: {
        alumnoSeleccionadoId: selectedAlumno?.id || null,
        semana: {
          offset: weekOffset,
          inicio: weekStart,
          fin: weekEnd,
        },
        clases: (studentWeekClasses || []).map((clase) =>
          this.mapAgendaClass(clase, now),
        ),
      },
    };
  }

  async update(id, data) {
    const payload = {};

    if (Object.prototype.hasOwnProperty.call(data, "nombre")) {
      const nombre = typeof data.nombre === "string" ? data.nombre.trim() : "";
      if (!nombre) {
        throw new Error("El nombre es obligatorio");
      }
      payload.nombre = nombre;
    }

    if (Object.prototype.hasOwnProperty.call(data, "email")) {
      const email = typeof data.email === "string" ? data.email.trim() : "";
      if (!email) {
        throw new Error("El email es obligatorio");
      }

      const existingUser = await this.repository.findByEmail(email);
      if (existingUser && existingUser.id !== id) {
        throw new Error("El email ya existe");
      }

      payload.email = email;
    }

    if (Object.prototype.hasOwnProperty.call(data, "dni")) {
      if (
        data.dni === undefined ||
        data.dni === null ||
        String(data.dni).trim() === ""
      ) {
        throw new Error("El DNI es obligatorio");
      }

      const dni = normalizarDni(data.dni);
      if (!dni) {
        throw new Error("El DNI debe tener un formato válido");
      }

      const existingDniUser = await this.repository.findUserByDni(dni);
      if (existingDniUser && existingDniUser.id !== id) {
        throw new Error("El DNI ya existe");
      }

      payload.dni = dni;
    }

    if (Object.prototype.hasOwnProperty.call(data, "telefono")) {
      const telefono =
        typeof data.telefono === "string" ? data.telefono.trim() : "";
      if (!telefono) {
        throw new Error("El teléfono es obligatorio");
      }
      payload.telefono = telefono;
    }

    const hayPermisos = Object.prototype.hasOwnProperty.call(
      data,
      "permisosLicencias",
    );
    const licenciaLegacy =
      data.licenciaConducir ?? data.tipoLicencia ?? data.especialidad;

    if (hayPermisos || licenciaLegacy !== undefined) {
      const permisosLicencias = normalizarPermisosLicencias(
        hayPermisos ? data.permisosLicencias : undefined,
        licenciaLegacy,
      );

      payload.permisosLicencias = permisosLicencias;
      payload.licenciaConducir = permisosLicencias[0];
    }

    if (data.password?.trim()) {
      if (data.password.length < 8) {
        throw new Error("La contraseña debe tener al menos 8 caracteres");
      }

      payload.passwordHash = await bcrypt.hash(data.password, 10);
    }

    return this.repository.update(id, payload);
  }

  async deactivate(id) {
    if (
      typeof this.repository.findById !== "function" ||
      typeof this.repository.findAssignedAlumnos !== "function"
    ) {
      return this.repository.deactivate(id);
    }

    const impacto = await this.getDeactivationImpact(id);

    if ((impacto.alumnos || []).length > 0) {
      throw new Error(
        "No se puede desactivar el profesor sin reasignar previamente todos sus alumnos",
      );
    }

    return this.repository.deactivate(id);
  }

  async getDeactivationImpact(id) {
    const profesor = await this.repository.findById(id);

    if (!profesor) {
      throw new Error("Profesor no encontrado");
    }

    const alumnosAsignados = await this.repository.findAssignedAlumnos(id);

    const impacto = await Promise.all(
      alumnosAsignados.map(async (alumno) => {
        const licencia = String(alumno.tipoLicenciaObjetivo || "")
          .trim()
          .toUpperCase();
        const opciones = licencia
          ? await this.repository.findActiveProfesoresByLicenciaExcluding(
              licencia,
              id,
            )
          : [];

        return {
          alumnoId: alumno.id,
          alumnoNombre: alumno.usuario?.nombre || "Alumno",
          licencia,
          opciones: opciones.map((item) => ({
            id: item.id,
            nombre: item.usuario?.nombre || "Profesor",
            permisosLicencias: item.permisosLicencias || [],
          })),
        };
      }),
    );

    const now = new Date();
    const clasesAfectadas = alumnosAsignados.length
      ? await this.repository.findFutureOrCurrentClassesForProfesor(
          id,
          alumnosAsignados.map((item) => item.id),
          now,
        )
      : [];

    return {
      profesor: {
        id: profesor.id,
        nombre: profesor.usuario?.nombre || "Profesor",
      },
      alumnos: impacto,
      clasesFuturas: clasesAfectadas.map((clase) => ({
        id: clase.id,
        fecha: clase.fecha,
        estado: clase.estado,
        alumnoId: clase.alumnoId,
        alumnoNombre: clase.alumno?.usuario?.nombre || "Alumno",
      })),
    };
  }

  async deactivateWithReassignment(id, reassignmentRows, changedById = null) {
    const profesor = await this.repository.findById(id);

    if (!profesor) {
      throw new Error("Profesor no encontrado");
    }

    if (profesor.activo === false) {
      throw new Error("El profesor ya está desactivado");
    }

    const alumnosAsignados = await this.repository.findAssignedAlumnos(id);

    if (!alumnosAsignados.length) {
      return this.repository.deactivate(id);
    }

    if (!Array.isArray(reassignmentRows) || reassignmentRows.length === 0) {
      throw new Error(
        "Debes reasignar todos los alumnos antes de desactivar al profesor",
      );
    }

    const assignmentMap = new Map(
      reassignmentRows.map((row) => [
        String(row.alumnoId),
        String(row.nuevoProfesorId),
      ]),
    );

    for (const alumno of alumnosAsignados) {
      const nuevoProfesorId = assignmentMap.get(String(alumno.id));

      if (!nuevoProfesorId) {
        throw new Error(
          `Falta reasignar el alumno ${alumno.usuario?.nombre || alumno.id}`,
        );
      }

      const licenciaAlumno = String(alumno.tipoLicenciaObjetivo || "")
        .trim()
        .toUpperCase();
      const candidatos =
        await this.repository.findActiveProfesoresByLicenciaExcluding(
          licenciaAlumno,
          id,
        );

      const candidato = candidatos.find((item) => item.id === nuevoProfesorId);

      if (!candidato) {
        throw new Error(
          `El nuevo profesor del alumno ${alumno.usuario?.nombre || alumno.id} no está activo o no es compatible con su licencia`,
        );
      }
    }

    const normalizedAssignments = alumnosAsignados.map((alumno) => ({
      alumnoId: alumno.id,
      nuevoProfesorId: assignmentMap.get(String(alumno.id)),
    }));

    return this.repository.deactivateWithReassignments({
      profesorId: id,
      assignments: normalizedAssignments,
      changedById,
      changedAt: new Date(),
    });
  }

  async activate(id) {
    return this.repository.activate(id);
  }
}
