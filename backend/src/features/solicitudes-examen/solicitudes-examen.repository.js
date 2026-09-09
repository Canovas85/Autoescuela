export class SolicitudesExamenRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findMatriculaPagada(alumnoId) {
    return this.prisma.matricula.findFirst({
      where: {
        alumnoId,
        estado: "PAGADA",
      },
      orderBy: {
        fechaPago: "desc",
      },
    });
  }

  async hasPsicotecnicoValidado(alumnoId) {
    const total = await this.prisma.documentoAlumno.count({
      where: {
        alumnoId,
        tipo: "CERTIFICADO_PSICOTECNICO",
        estado: "VALIDADO",
        activo: true,
      },
    });

    return total > 0;
  }

  async findUltimoPagoTasaDGT(alumnoId, licenciaObjetivo, conceptoPattern) {
    return this.prisma.pago.findFirst({
      where: {
        alumnoId,
        tipo: "TASA_DGT_21",
        permiso: licenciaObjetivo,
        estado: "PAGADO",
        concepto: {
          contains: conceptoPattern,
          mode: "insensitive",
        },
      },
      orderBy: [{ fechaPago: "desc" }, { fechaCreacion: "desc" }],
    });
  }

  async countSuspensosDesdeFecha(alumnoId, fechaDesde) {
    return this.prisma.examen.count({
      where: {
        alumnoId,
        estado: "SUSPENDIDO",
        fecha: {
          gte: fechaDesde,
        },
      },
    });
  }

  async findSuspensosDesdeFecha(alumnoId, fechaDesde) {
    return this.prisma.examen.findMany({
      where: {
        alumnoId,
        estado: "SUSPENDIDO",
        fecha: {
          gte: fechaDesde,
        },
      },
      orderBy: {
        fecha: "asc",
      },
      select: {
        id: true,
        fecha: true,
      },
    });
  }

  async countClasesCompletadasDesdeFecha(alumnoId, fechaDesde) {
    return this.prisma.clasePractica.count({
      where: {
        alumnoId,
        fecha: {
          gte: fechaDesde,
        },
        estado: {
          in: ["COMPLETADA", "REALIZADA", "FINALIZADA"],
        },
      },
    });
  }

  async countNoAptosTeoricoDesdeFecha(alumnoId, fechaDesde) {
    return this.prisma.solicitudExamen.count({
      where: {
        alumnoId,
        tipo: "TEORICO",
        estado: {
          in: ["NO_APTO", "SUSPENDIDO"],
        },
        fechaProgramada: {
          gte: fechaDesde,
        },
      },
    });
  }

  async findSolicitudTeoricoActiva(alumnoId) {
    return this.prisma.solicitudExamen.findFirst({
      where: {
        alumnoId,
        tipo: "TEORICO",
        estado: {
          in: ["PENDIENTE", "PROGRAMADO", "SOLICITADO"],
        },
      },
      orderBy: {
        fechaSolicitud: "desc",
      },
    });
  }

  async findConvocatoriasTeoricoDisponibles(licencia, desdeFecha) {
    return this.prisma.convocatoriaTeorico.findMany({
      where: {
        licencia,
        activo: true,
        fecha: {
          gte: desdeFecha,
        },
      },
      orderBy: {
        fecha: "asc",
      },
    });
  }

  async findConvocatoriaTeoricoByFecha(licencia, fecha) {
    const inicio = new Date(fecha);
    inicio.setHours(0, 0, 0, 0);

    const fin = new Date(fecha);
    fin.setHours(23, 59, 59, 999);

    return this.prisma.convocatoriaTeorico.findFirst({
      where: {
        licencia,
        activo: true,
        fecha: {
          gte: inicio,
          lte: fin,
        },
      },
    });
  }

  async findMine(alumnoId) {
    return this.prisma.solicitudExamen.findMany({
      where: {
        alumnoId,
      },
      orderBy: [{ fechaSolicitud: "desc" }],
    });
  }

  async findSolicitudesTeoricoPendientesResultado(fechaLimite) {
    return this.prisma.solicitudExamen.findMany({
      where: {
        tipo: "TEORICO",
        estado: {
          in: ["SOLICITADO", "PROGRAMADO", "PENDIENTE"],
        },
        fechaProgramada: {
          lte: fechaLimite,
        },
      },
      orderBy: {
        fechaProgramada: "asc",
      },
    });
  }

  async updateResultadoSolicitudTeorico(
    id,
    estado,
    erroresExamen,
    aciertosExamen,
  ) {
    return this.prisma.solicitudExamen.update({
      where: { id },
      data: {
        estado,
        erroresExamen,
        aciertosExamen,
      },
    });
  }

  async incrementarConvocatoriasConsumidas(pagoId) {
    return this.prisma.pago.update({
      where: {
        id: pagoId,
      },
      data: {
        convocatoriasConsumidas: {
          increment: 1,
        },
      },
    });
  }

  async create(data) {
    return this.prisma.solicitudExamen.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.solicitudExamen.findMany({
      include: {
        alumno: {
          include: {
            profesorAsignado: {
              include: {
                usuario: true,
              },
            },
            usuario: true,
          },
        },
      },
      orderBy: [{ fechaSolicitud: "desc" }],
    });
  }

  async findEvaluacionSolicitudesByTipo(tipo) {
    return this.prisma.solicitudExamen.findMany({
      where: {
        tipo,
      },
      include: {
        alumno: {
          include: {
            profesorAsignado: {
              include: {
                usuario: true,
              },
            },
            usuario: true,
          },
        },
      },
      orderBy: [{ fechaProgramada: "desc" }, { fechaSolicitud: "desc" }],
    });
  }

  async findEvaluacionExamenesByTipo(tipo) {
    return this.prisma.examen.findMany({
      where: {
        tipo,
      },
      include: {
        alumno: {
          include: {
            profesorAsignado: {
              include: {
                usuario: true,
              },
            },
            usuario: true,
          },
        },
      },
      orderBy: [{ fecha: "desc" }],
    });
  }

  async findById(id) {
    return this.prisma.solicitudExamen.findUnique({
      where: {
        id,
      },
      include: {
        alumno: {
          include: {
            usuario: true,
          },
        },
      },
    });
  }

  async update(id, data) {
    return this.prisma.solicitudExamen.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id) {
    return this.prisma.solicitudExamen.delete({
      where: {
        id,
      },
    });
  }
}
