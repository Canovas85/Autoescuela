const ROADMAP_STATUS = {
  PENDIENTE: "PENDIENTE",
  EN_CURSO: "EN_CURSO",
  REGISTRADA: "REGISTRADA",
  CANCELADA: "CANCELADA",
};

const FAULT_TYPES = ["LEVE", "DEFICIENTE", "ELIMINATORIA"];

const STATUS_FILTERS = [
  "TODAS",
  ROADMAP_STATUS.EN_CURSO,
  ROADMAP_STATUS.PENDIENTE,
  ROADMAP_STATUS.REGISTRADA,
  ROADMAP_STATUS.CANCELADA,
];

const toStartOfDay = (value) => {
  if (!value) {
    return null;
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
};

const toEndOfDay = (value) => {
  if (!value) {
    return null;
  }

  const date = new Date(`${value}T23:59:59.999`);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
};

const normalizePage = (value, fallback = 1) => {
  const parsed = Number.parseInt(String(value || fallback), 10);
  if (Number.isNaN(parsed) || parsed < 1) {
    return fallback;
  }
  return parsed;
};

const normalizePageSize = (value, fallback = 10) => {
  const parsed = Number.parseInt(String(value || fallback), 10);
  if (Number.isNaN(parsed) || parsed < 1) {
    return fallback;
  }
  return Math.min(parsed, 50);
};

const normalizeFaultType = (value) => {
  return String(value || "")
    .trim()
    .toUpperCase();
};

const normalizeFault = (fault, index) => {
  const tipo = normalizeFaultType(fault?.tipo);

  if (!FAULT_TYPES.includes(tipo)) {
    throw new Error(
      "El tipo de falta debe ser LEVE, DEFICIENTE o ELIMINATORIA",
    );
  }

  const hora = String(fault?.hora || "").trim();

  if (!hora.match(/^([01]\d|2[0-3]):([0-5]\d)$/)) {
    throw new Error("La hora de la falta debe tener formato HH:mm");
  }

  const categoria = String(fault?.categoria || "").trim();
  const descripcion = String(fault?.descripcion || "").trim();

  if (!categoria) {
    throw new Error("La categoría de la falta es obligatoria");
  }

  if (!descripcion) {
    throw new Error("La descripción de la falta es obligatoria");
  }

  return {
    hora,
    tipo,
    categoria,
    descripcion,
    orden: index,
    catalogoId: fault?.catalogoId || null,
  };
};

const normalizeEditablePayload = (payload) => {
  const faltas = Array.isArray(payload?.faltas) ? payload.faltas : [];

  const kilometrosInicio =
    payload?.kilometrosInicio === undefined ||
    payload?.kilometrosInicio === null
      ? null
      : Number(payload.kilometrosInicio);
  const kilometrosFin =
    payload?.kilometrosFin === undefined || payload?.kilometrosFin === null
      ? null
      : Number(payload.kilometrosFin);
  const combustibleInicioPct =
    payload?.combustibleInicioPct === undefined ||
    payload?.combustibleInicioPct === null
      ? null
      : Number(payload.combustibleInicioPct);
  const combustibleFinPct =
    payload?.combustibleFinPct === undefined ||
    payload?.combustibleFinPct === null
      ? null
      : Number(payload.combustibleFinPct);

  const numericValues = [
    [kilometrosInicio, "kilómetros iniciales"],
    [kilometrosFin, "kilómetros actuales"],
    [combustibleInicioPct, "combustible inicial"],
    [combustibleFinPct, "combustible actual"],
  ];

  numericValues.forEach(([value, label]) => {
    if (value !== null && (!Number.isFinite(value) || value < 0)) {
      throw new Error(`El campo ${label} debe ser un número válido`);
    }
  });

  if (combustibleInicioPct !== null && combustibleInicioPct > 100) {
    throw new Error("El combustible inicial debe estar entre 0 y 100");
  }

  if (combustibleFinPct !== null && combustibleFinPct > 100) {
    throw new Error("El combustible actual debe estar entre 0 y 100");
  }

  if (
    kilometrosInicio !== null &&
    kilometrosFin !== null &&
    kilometrosFin < kilometrosInicio
  ) {
    throw new Error(
      "Los kilómetros actuales no pueden ser menores a los iniciales",
    );
  }

  return {
    observacionesProfesor: String(payload?.observacionesProfesor || "").trim(),
    kilometrosInicio:
      kilometrosInicio === null ? null : Math.round(kilometrosInicio),
    kilometrosFin: kilometrosFin === null ? null : Math.round(kilometrosFin),
    combustibleInicioPct:
      combustibleInicioPct === null ? null : Math.round(combustibleInicioPct),
    combustibleFinPct:
      combustibleFinPct === null ? null : Math.round(combustibleFinPct),
    faltasNormalizadas: faltas.map(normalizeFault),
  };
};

const isClassCancelled = (clase) => {
  return String(clase?.estado || "")
    .toUpperCase()
    .startsWith("CANCELADA");
};

const deriveRoadmapStatus = (clase, now) => {
  if (isClassCancelled(clase)) {
    return ROADMAP_STATUS.CANCELADA;
  }

  if (clase?.hojaRuta?.estado === ROADMAP_STATUS.REGISTRADA) {
    return ROADMAP_STATUS.REGISTRADA;
  }

  if (clase?.hojaRuta) {
    return ROADMAP_STATUS.EN_CURSO;
  }

  if (new Date(clase.fecha) <= now) {
    return ROADMAP_STATUS.PENDIENTE;
  }

  return "PROGRAMADA";
};

const mapFault = (falta) => ({
  id: falta.id,
  hora: falta.hora,
  tipo: falta.tipo,
  categoria: falta.categoria,
  descripcion: falta.descripcion,
  catalogoId: falta.catalogoId || null,
});

const mapClassRoadmap = (clase, now) => {
  const status = deriveRoadmapStatus(clase, now);
  const hoja = clase.hojaRuta;

  return {
    id: hoja?.id || null,
    claseId: clase.id,
    estado: status,
    fecha: clase.fecha,
    duracion: clase.duracion,
    canceladaConPenalizacion: Boolean(clase.canceladaConPenalizacion),
    alumno: {
      id: clase.alumno?.id,
      nombre: clase.alumno?.usuario?.nombre || "Alumno",
    },
    profesor: {
      id: clase.profesor?.id,
      nombre: clase.profesor?.usuario?.nombre || "Profesor",
    },
    vehiculo: {
      id: clase.vehiculo?.id,
      marca: clase.vehiculo?.marca || "",
      modelo: clase.vehiculo?.modelo || "",
      matricula: clase.vehiculo?.matricula || "",
    },
    observacionesProfesor: hoja?.observacionesProfesor || "",
    kilometrosInicio: hoja?.kilometrosInicio ?? null,
    kilometrosFin: hoja?.kilometrosFin ?? null,
    combustibleInicioPct: hoja?.combustibleInicioPct ?? null,
    combustibleFinPct: hoja?.combustibleFinPct ?? null,
    faltas: (hoja?.faltas || []).map(mapFault),
    resumenFaltas: {
      leves: (hoja?.faltas || []).filter((item) => item.tipo === "LEVE").length,
      deficientes: (hoja?.faltas || []).filter(
        (item) => item.tipo === "DEFICIENTE",
      ).length,
      eliminatorias: (hoja?.faltas || []).filter(
        (item) => item.tipo === "ELIMINATORIA",
      ).length,
    },
    consumoEstimado:
      hoja?.kilometrosInicio !== null &&
      hoja?.kilometrosInicio !== undefined &&
      hoja?.kilometrosFin !== null &&
      hoja?.kilometrosFin !== undefined
        ? Math.max(hoja.kilometrosFin - hoja.kilometrosInicio, 0)
        : null,
  };
};

const buildProfessorClassFilters = ({ vehiculoId, dateFrom, dateTo }) => {
  const where = {};
  const dateStart = toStartOfDay(dateFrom);
  const dateEnd = toEndOfDay(dateTo);

  if (dateStart || dateEnd) {
    where.fecha = {};

    if (dateStart) {
      where.fecha.gte = dateStart;
    }

    if (dateEnd) {
      where.fecha.lte = dateEnd;
    }
  }

  if (vehiculoId) {
    where.vehiculoId = String(vehiculoId);
  }

  return where;
};

const buildPagination = (total, page, pageSize) => {
  const totalPages = total > 0 ? Math.ceil(total / pageSize) : 1;

  return {
    total,
    page,
    pageSize,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};

export class HojasRutaService {
  constructor(repository) {
    this.repository = repository;
  }

  async getFaultCatalog() {
    const rows = await this.repository.findFaultCatalog();

    return {
      LEVE: rows
        .filter((item) => item.tipo === "LEVE")
        .map((item) => ({
          id: item.id,
          categoria: item.categoria,
          descripcion: item.descripcion,
        })),
      DEFICIENTE: rows
        .filter((item) => item.tipo === "DEFICIENTE")
        .map((item) => ({
          id: item.id,
          categoria: item.categoria,
          descripcion: item.descripcion,
        })),
      ELIMINATORIA: rows
        .filter((item) => item.tipo === "ELIMINATORIA")
        .map((item) => ({
          id: item.id,
          categoria: item.categoria,
          descripcion: item.descripcion,
        })),
    };
  }

  async getProfessorDashboard(profesorId, query) {
    const now = new Date();
    const statusFilterRaw = String(query?.estado || "TODAS")
      .trim()
      .toUpperCase();

    const statusFilter = STATUS_FILTERS.includes(statusFilterRaw)
      ? statusFilterRaw
      : "TODAS";

    const page = normalizePage(query?.page, 1);
    const pageSize = normalizePageSize(query?.pageSize, 10);

    const classes = await this.repository.findProfessorClasses(
      profesorId,
      buildProfessorClassFilters({
        vehiculoId: query?.vehiculoId,
        dateFrom: query?.dateFrom,
        dateTo: query?.dateTo,
      }),
    );

    const search = String(query?.search || "")
      .trim()
      .toLowerCase();

    const mapped = classes
      .map((clase) => mapClassRoadmap(clase, now))
      .filter((item) => {
        if (!search) {
          return true;
        }

        const alumnoNombre = item.alumno?.nombre?.toLowerCase() || "";
        return alumnoNombre.includes(search);
      })
      .filter((item) => item.estado !== "PROGRAMADA");

    const pending = mapped.filter(
      (item) => item.estado === ROADMAP_STATUS.PENDIENTE,
    );

    const historyBase = mapped.filter(
      (item) => item.estado !== ROADMAP_STATUS.PENDIENTE,
    );

    const historyFiltered =
      statusFilter === "TODAS" || statusFilter === ROADMAP_STATUS.PENDIENTE
        ? historyBase
        : historyBase.filter((item) => item.estado === statusFilter);

    const start = (page - 1) * pageSize;
    const pagedHistory = historyFiltered.slice(start, start + pageSize);

    return {
      statusFilter,
      resumen: {
        total: mapped.length,
        pendientes: pending.length,
        enCurso: mapped.filter(
          (item) => item.estado === ROADMAP_STATUS.EN_CURSO,
        ).length,
        registradas: mapped.filter(
          (item) => item.estado === ROADMAP_STATUS.REGISTRADA,
        ).length,
        canceladas: mapped.filter(
          (item) => item.estado === ROADMAP_STATUS.CANCELADA,
        ).length,
      },
      pendientes: pending,
      historial: pagedHistory,
      pagination: buildPagination(historyFiltered.length, page, pageSize),
    };
  }

  async getProfessorRoadmapDetail(profesorId, claseId) {
    const clase = await this.repository.findClassById(claseId);

    if (!clase || clase.profesorId !== profesorId) {
      throw new Error("Clase práctica no encontrada");
    }

    const mapped = mapClassRoadmap(clase, new Date());

    return {
      ...mapped,
      editable: !isClassCancelled(clase),
    };
  }

  async saveProfessorDraft(profesorId, claseId, payload) {
    const clase = await this.repository.findClassById(claseId);

    if (!clase || clase.profesorId !== profesorId) {
      throw new Error("Clase práctica no encontrada");
    }

    if (isClassCancelled(clase)) {
      throw new Error(
        "No se puede editar una hoja de ruta de una clase cancelada",
      );
    }

    if (new Date(clase.fecha) > new Date()) {
      throw new Error(
        "La hoja de ruta solo puede iniciarse cuando la clase ha comenzado",
      );
    }

    const normalized = normalizeEditablePayload(payload);

    const roadmap = await this.repository.upsertRoadmapByClass(clase, {
      estado: ROADMAP_STATUS.EN_CURSO,
      observacionesProfesor: normalized.observacionesProfesor || null,
      kilometrosInicio: normalized.kilometrosInicio,
      kilometrosFin: normalized.kilometrosFin,
      combustibleInicioPct: normalized.combustibleInicioPct,
      combustibleFinPct: normalized.combustibleFinPct,
      finalizedAt: null,
    });

    await this.repository.replaceRoadmapFaults(
      roadmap.id,
      normalized.faltasNormalizadas,
    );

    const refreshed = await this.repository.findClassById(claseId);

    return {
      message: "Borrador guardado correctamente",
      hojaRuta: mapClassRoadmap(refreshed, new Date()),
    };
  }

  async finalizeProfessorRoadmap(profesorId, claseId, payload) {
    const clase = await this.repository.findClassById(claseId);

    if (!clase || clase.profesorId !== profesorId) {
      throw new Error("Clase práctica no encontrada");
    }

    if (isClassCancelled(clase)) {
      throw new Error(
        "No se puede finalizar una hoja de ruta de una clase cancelada",
      );
    }

    if (new Date(clase.fecha) > new Date()) {
      throw new Error(
        "La hoja de ruta solo puede finalizarse tras la fecha de clase",
      );
    }

    const normalized = normalizeEditablePayload(payload);

    const roadmap = await this.repository.upsertRoadmapByClass(clase, {
      estado: ROADMAP_STATUS.REGISTRADA,
      observacionesProfesor: normalized.observacionesProfesor || null,
      kilometrosInicio: normalized.kilometrosInicio,
      kilometrosFin: normalized.kilometrosFin,
      combustibleInicioPct: normalized.combustibleInicioPct,
      combustibleFinPct: normalized.combustibleFinPct,
      finalizedAt: new Date(),
    });

    await this.repository.replaceRoadmapFaults(
      roadmap.id,
      normalized.faltasNormalizadas,
    );

    const refreshed = await this.repository.findClassById(claseId);

    return {
      message: "Clase finalizada y hoja registrada",
      hojaRuta: mapClassRoadmap(refreshed, new Date()),
    };
  }

  async getAdminProfessorsSummary(query) {
    const search = String(query?.search || "").trim();
    const where = buildProfessorClassFilters({
      search: "",
      vehiculoId: query?.vehiculoId,
      dateFrom: query?.dateFrom,
      dateTo: query?.dateTo,
    });

    const classes = await this.repository.findAdminClasses(where);
    const now = new Date();
    const byProfessor = new Map();

    classes.forEach((clase) => {
      const profesorId = clase.profesorId;
      const status = deriveRoadmapStatus(clase, now);

      if (status === "PROGRAMADA") {
        return;
      }

      const nombreProfesor = clase.profesor?.usuario?.nombre || "Profesor";

      if (
        search &&
        !nombreProfesor.toLowerCase().includes(search.toLowerCase())
      ) {
        return;
      }

      if (!byProfessor.has(profesorId)) {
        byProfessor.set(profesorId, {
          profesorId,
          profesorNombre: nombreProfesor,
          total: 0,
          registradas: 0,
          pendientes: 0,
          enCurso: 0,
          canceladas: 0,
        });
      }

      const entry = byProfessor.get(profesorId);
      entry.total += 1;

      if (status === ROADMAP_STATUS.REGISTRADA) entry.registradas += 1;
      if (status === ROADMAP_STATUS.PENDIENTE) entry.pendientes += 1;
      if (status === ROADMAP_STATUS.EN_CURSO) entry.enCurso += 1;
      if (status === ROADMAP_STATUS.CANCELADA) entry.canceladas += 1;
    });

    return Array.from(byProfessor.values()).sort((a, b) =>
      a.profesorNombre.localeCompare(b.profesorNombre, "es"),
    );
  }

  async getAdminStudentsByProfessor(profesorId, query) {
    const classes = await this.repository.findAdminClasses({ profesorId });
    const now = new Date();
    const byStudent = new Map();
    const search = String(query?.search || "")
      .trim()
      .toLowerCase();

    classes.forEach((clase) => {
      const status = deriveRoadmapStatus(clase, now);

      if (status === "PROGRAMADA") {
        return;
      }

      const alumnoNombre = clase.alumno?.usuario?.nombre || "Alumno";

      if (search && !alumnoNombre.toLowerCase().includes(search)) {
        return;
      }

      if (!byStudent.has(clase.alumnoId)) {
        byStudent.set(clase.alumnoId, {
          alumnoId: clase.alumnoId,
          alumnoNombre,
          total: 0,
          registradas: 0,
          pendientes: 0,
          enCurso: 0,
          canceladas: 0,
        });
      }

      const entry = byStudent.get(clase.alumnoId);
      entry.total += 1;

      if (status === ROADMAP_STATUS.REGISTRADA) entry.registradas += 1;
      if (status === ROADMAP_STATUS.PENDIENTE) entry.pendientes += 1;
      if (status === ROADMAP_STATUS.EN_CURSO) entry.enCurso += 1;
      if (status === ROADMAP_STATUS.CANCELADA) entry.canceladas += 1;
    });

    return Array.from(byStudent.values()).sort((a, b) =>
      a.alumnoNombre.localeCompare(b.alumnoNombre, "es"),
    );
  }

  async getAdminRegisteredRoadmapsByStudent(profesorId, alumnoId, query) {
    const page = normalizePage(query?.page, 1);
    const pageSize = normalizePageSize(query?.pageSize, 10);

    const rows =
      await this.repository.findRegisteredRoadmapsByProfessorAndStudent(
        profesorId,
        alumnoId,
      );

    const mapped = rows.map((row) => ({
      id: row.id,
      claseId: row.clasePracticaId,
      fecha: row.clasePractica?.fecha,
      duracion: row.clasePractica?.duracion,
      vehiculo: row.clasePractica?.vehiculo
        ? {
            marca: row.clasePractica.vehiculo.marca,
            modelo: row.clasePractica.vehiculo.modelo,
            matricula: row.clasePractica.vehiculo.matricula,
          }
        : null,
      faltasResumen: {
        leves: row.faltas.filter((item) => item.tipo === "LEVE").length,
        deficientes: row.faltas.filter((item) => item.tipo === "DEFICIENTE")
          .length,
        eliminatorias: row.faltas.filter((item) => item.tipo === "ELIMINATORIA")
          .length,
      },
      updatedAt: row.updatedAt,
    }));

    const start = (page - 1) * pageSize;

    return {
      rows: mapped.slice(start, start + pageSize),
      pagination: buildPagination(mapped.length, page, pageSize),
    };
  }

  async getAdminRoadmapDetail(roadmapId) {
    const row = await this.repository.findRoadmapById(roadmapId);

    if (!row) {
      throw new Error("Hoja de ruta no encontrada");
    }

    return {
      id: row.id,
      claseId: row.clasePracticaId,
      estado: row.estado,
      fecha: row.clasePractica?.fecha,
      duracion: row.clasePractica?.duracion,
      alumno: {
        id: row.alumnoId,
        nombre: row.clasePractica?.alumno?.usuario?.nombre || "Alumno",
      },
      profesor: {
        id: row.profesorId,
        nombre: row.clasePractica?.profesor?.usuario?.nombre || "Profesor",
      },
      vehiculo: row.clasePractica?.vehiculo
        ? {
            id: row.clasePractica.vehiculo.id,
            marca: row.clasePractica.vehiculo.marca,
            modelo: row.clasePractica.vehiculo.modelo,
            matricula: row.clasePractica.vehiculo.matricula,
          }
        : null,
      observacionesProfesor: row.observacionesProfesor || "",
      kilometrosInicio: row.kilometrosInicio,
      kilometrosFin: row.kilometrosFin,
      combustibleInicioPct: row.combustibleInicioPct,
      combustibleFinPct: row.combustibleFinPct,
      faltas: row.faltas.map(mapFault),
      readonly: true,
    };
  }

  async getStudentRegisteredRoadmaps(alumnoId, query) {
    const page = normalizePage(query?.page, 1);
    const pageSize = normalizePageSize(query?.pageSize, 10);

    const search = String(query?.search || "")
      .trim()
      .toLowerCase();

    const rows = await this.repository.findStudentRegisteredRoadmaps(alumnoId);

    const dateFrom = toStartOfDay(query?.dateFrom);
    const dateTo = toEndOfDay(query?.dateTo);

    const filtered = rows.filter((row) => {
      const classDate = row.clasePractica?.fecha
        ? new Date(row.clasePractica.fecha)
        : null;

      if (dateFrom && classDate && classDate < dateFrom) {
        return false;
      }

      if (dateTo && classDate && classDate > dateTo) {
        return false;
      }

      if (!search) {
        return true;
      }

      const profesorNombre =
        row.clasePractica?.profesor?.usuario?.nombre?.toLowerCase() || "";
      const vehiculoMatricula =
        row.clasePractica?.vehiculo?.matricula?.toLowerCase() || "";

      return (
        profesorNombre.includes(search) || vehiculoMatricula.includes(search)
      );
    });

    const mapped = filtered.map((row) => ({
      id: row.id,
      claseId: row.clasePracticaId,
      fecha: row.clasePractica?.fecha,
      duracion: row.clasePractica?.duracion,
      profesorNombre:
        row.clasePractica?.profesor?.usuario?.nombre || "Profesor",
      vehiculo: row.clasePractica?.vehiculo
        ? `${row.clasePractica.vehiculo.marca || ""} ${row.clasePractica.vehiculo.modelo || ""} ${row.clasePractica.vehiculo.matricula || ""}`.trim()
        : "-",
      faltasResumen: {
        leves: row.faltas.filter((item) => item.tipo === "LEVE").length,
        deficientes: row.faltas.filter((item) => item.tipo === "DEFICIENTE")
          .length,
        eliminatorias: row.faltas.filter((item) => item.tipo === "ELIMINATORIA")
          .length,
      },
      updatedAt: row.updatedAt,
    }));

    const start = (page - 1) * pageSize;

    return {
      rows: mapped.slice(start, start + pageSize),
      pagination: buildPagination(mapped.length, page, pageSize),
    };
  }

  async getStudentRoadmapDetail(alumnoId, roadmapId) {
    const row = await this.repository.findRoadmapById(roadmapId);

    if (
      !row ||
      row.alumnoId !== alumnoId ||
      row.estado !== ROADMAP_STATUS.REGISTRADA
    ) {
      throw new Error("Hoja de ruta no encontrada");
    }

    return {
      id: row.id,
      claseId: row.clasePracticaId,
      estado: row.estado,
      fecha: row.clasePractica?.fecha,
      duracion: row.clasePractica?.duracion,
      alumno: {
        id: row.alumnoId,
        nombre: row.clasePractica?.alumno?.usuario?.nombre || "Alumno",
      },
      profesor: {
        id: row.profesorId,
        nombre: row.clasePractica?.profesor?.usuario?.nombre || "Profesor",
      },
      vehiculo: row.clasePractica?.vehiculo
        ? {
            id: row.clasePractica.vehiculo.id,
            marca: row.clasePractica.vehiculo.marca,
            modelo: row.clasePractica.vehiculo.modelo,
            matricula: row.clasePractica.vehiculo.matricula,
          }
        : null,
      observacionesProfesor: row.observacionesProfesor || "",
      kilometrosInicio: row.kilometrosInicio,
      kilometrosFin: row.kilometrosFin,
      combustibleInicioPct: row.combustibleInicioPct,
      combustibleFinPct: row.combustibleFinPct,
      faltas: row.faltas.map(mapFault),
      readonly: true,
    };
  }
}
