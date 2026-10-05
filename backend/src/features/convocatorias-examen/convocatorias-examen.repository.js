export class ConvocatoriasExamenRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  buildConvocatoriaKey({ fecha, licencia, tipoExamen }) {
    const year = fecha.getUTCFullYear();
    const month = String(fecha.getUTCMonth() + 1).padStart(2, "0");
    const day = String(fecha.getUTCDate()).padStart(2, "0");
    return `${tipoExamen}|${licencia}|${year}-${month}-${day}`;
  }

  async create(data) {
    return this.prisma.convocatoriaExamen.create({ data });
  }

  async findAll(filters = {}) {
    const where = {
      ...(filters.tipoExamen ? { tipoExamen: filters.tipoExamen } : {}),
      ...(filters.licencia ? { licencia: filters.licencia } : {}),
      ...(filters.activo !== undefined ? { activo: filters.activo } : {}),
    };

    const convocatorias = await this.prisma.convocatoriaExamen.findMany({
      where,
      orderBy: [{ fecha: "asc" }, { licencia: "asc" }, { tipoExamen: "asc" }],
    });

    if (!filters.estadoAlumno || convocatorias.length === 0) {
      return convocatorias;
    }

    const minRaw = convocatorias[0].fecha;
    const maxRaw = convocatorias[convocatorias.length - 1].fecha;
    const minFecha = new Date(
      Date.UTC(
        minRaw.getUTCFullYear(),
        minRaw.getUTCMonth(),
        minRaw.getUTCDate(),
        0,
        0,
        0,
        0,
      ),
    );
    const maxFecha = new Date(
      Date.UTC(
        maxRaw.getUTCFullYear(),
        maxRaw.getUTCMonth(),
        maxRaw.getUTCDate(),
        23,
        59,
        59,
        999,
      ),
    );

    const solicitudes = await this.prisma.solicitudExamen.findMany({
      where: {
        estado: filters.estadoAlumno,
        fechaProgramada: {
          gte: minFecha,
          lte: maxFecha,
        },
        ...(filters.tipoExamen ? { tipo: filters.tipoExamen } : {}),
        ...(filters.licencia
          ? {
              alumno: {
                tipoLicenciaObjetivo: filters.licencia,
              },
            }
          : {}),
      },
      select: {
        tipo: true,
        fechaProgramada: true,
        alumno: {
          select: {
            tipoLicenciaObjetivo: true,
          },
        },
      },
    });

    const convocatoriaKeysConEstado = new Set(
      solicitudes
        .filter((solicitud) => solicitud.fechaProgramada && solicitud.alumno)
        .map((solicitud) =>
          this.buildConvocatoriaKey({
            fecha: solicitud.fechaProgramada,
            licencia: solicitud.alumno.tipoLicenciaObjetivo,
            tipoExamen: solicitud.tipo,
          }),
        ),
    );

    return convocatorias.filter((convocatoria) =>
      convocatoriaKeysConEstado.has(
        this.buildConvocatoriaKey({
          fecha: convocatoria.fecha,
          licencia: convocatoria.licencia,
          tipoExamen: convocatoria.tipoExamen,
        }),
      ),
    );
  }

  async findDuplicate({
    fechaInicio,
    fechaFin,
    licencia,
    tipoExamen,
    excludeId,
  }) {
    return this.prisma.convocatoriaExamen.findFirst({
      where: {
        id: excludeId ? { not: excludeId } : undefined,
        licencia,
        tipoExamen,
        fecha: {
          gte: fechaInicio,
          lte: fechaFin,
        },
      },
    });
  }

  async update(id, data) {
    return this.prisma.convocatoriaExamen.update({
      where: { id },
      data,
    });
  }

  async softDelete(id) {
    return this.prisma.convocatoriaExamen.update({
      where: { id },
      data: { activo: false },
    });
  }

  async findById(id) {
    return this.prisma.convocatoriaExamen.findUnique({
      where: { id },
    });
  }

  async findDeleteImpactByConvocatoria(id) {
    const convocatoria = await this.prisma.convocatoriaExamen.findUnique({
      where: { id },
    });

    if (!convocatoria) {
      return null;
    }

    const inicio = new Date(convocatoria.fecha);
    inicio.setHours(0, 0, 0, 0);

    const fin = new Date(convocatoria.fecha);
    fin.setHours(23, 59, 59, 999);

    const solicitudes = await this.prisma.solicitudExamen.findMany({
      where: {
        tipo: convocatoria.tipoExamen,
        estado: {
          in: ["SOLICITADO", "PROGRAMADO"],
        },
        fechaProgramada: {
          gte: inicio,
          lte: fin,
        },
        alumno: {
          tipoLicenciaObjetivo: convocatoria.licencia,
        },
      },
      include: {
        alumno: {
          include: {
            usuario: {
              select: {
                id: true,
                nombre: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: [{ fechaProgramada: "asc" }, { fechaSolicitud: "asc" }],
    });

    return {
      convocatoria,
      solicitudes,
    };
  }

  async cancelSolicitudesByIds(ids = [], observaciones = null) {
    if (!Array.isArray(ids) || ids.length === 0) {
      return { count: 0 };
    }

    return this.prisma.solicitudExamen.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        estado: "CANCELADO",
        observaciones,
      },
    });
  }

  async findAgendaWithConfirmedStudents({
    tipoExamen,
    licencia,
    activo,
    estadoAlumno,
    monthStart,
    monthEnd,
  }) {
    const where = {
      ...(activo !== undefined ? { activo } : {}),
      fecha: {
        gte: monthStart,
        lte: monthEnd,
      },
      ...(tipoExamen ? { tipoExamen } : {}),
      ...(licencia ? { licencia } : {}),
    };

    const convocatorias = await this.prisma.convocatoriaExamen.findMany({
      where,
      orderBy: [{ fecha: "asc" }, { licencia: "asc" }, { tipoExamen: "asc" }],
    });

    const items = await Promise.all(
      convocatorias.map(async (convocatoria) => {
        const inicio = new Date(convocatoria.fecha);
        inicio.setHours(0, 0, 0, 0);

        const fin = new Date(convocatoria.fecha);
        fin.setHours(23, 59, 59, 999);

        const estadosConvocatoria = estadoAlumno
          ? [estadoAlumno]
          : ["SOLICITADO", "PROGRAMADO", "APTO", "NO_APTO", "NO_PRESENTADO"];

        const solicitudes = await this.prisma.solicitudExamen.findMany({
          where: {
            tipo: convocatoria.tipoExamen,
            estado: {
              in: estadosConvocatoria,
            },
            fechaProgramada: {
              gte: inicio,
              lte: fin,
            },
            alumno: {
              tipoLicenciaObjetivo: convocatoria.licencia,
            },
          },
          include: {
            alumno: {
              include: {
                usuario: true,
              },
            },
          },
          orderBy: [{ fechaSolicitud: "asc" }],
        });

        return {
          ...convocatoria,
          estadosMostrados: estadosConvocatoria,
          totalAlumnos: solicitudes.length,
          alumnos: solicitudes.map((solicitud) => ({
            solicitudId: solicitud.id,
            alumnoId: solicitud.alumnoId,
            nombre: solicitud.alumno?.usuario?.nombre || "Sin nombre",
            email: solicitud.alumno?.usuario?.email || "",
            estado: solicitud.estado,
            licencia: convocatoria.licencia,
            tipoExamen: convocatoria.tipoExamen,
            fechaProgramada: solicitud.fechaProgramada,
            fechaSolicitud: solicitud.fechaSolicitud,
            erroresExamen: solicitud.erroresExamen,
            aciertosExamen: solicitud.aciertosExamen,
            faltasLeves: solicitud.faltasLeves,
            faltasDeficientes: solicitud.faltasDeficientes,
            faltasEliminatorias: solicitud.faltasEliminatorias,
            faltasLevesDetalle: solicitud.faltasLevesDetalle || [],
            faltasDeficientesDetalle: solicitud.faltasDeficientesDetalle || [],
            faltasEliminatoriasDetalle:
              solicitud.faltasEliminatoriasDetalle || [],
            motivoNoApto: solicitud.motivoNoApto || null,
            observaciones: solicitud.observaciones || null,
          })),
        };
      }),
    );

    return items;
  }
}
