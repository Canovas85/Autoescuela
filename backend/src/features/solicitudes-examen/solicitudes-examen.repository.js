import { generateFacturaNumber } from "../../shared/utils/factura-number.js";

export class SolicitudesExamenRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  generarNumeroFacturaPago(attempt = 0) {
    return generateFacturaNumber(attempt);
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

  async findPagoTasaDGTPendiente(alumnoId, licenciaObjetivo, conceptoPattern) {
    return this.prisma.pago.findFirst({
      where: {
        alumnoId,
        tipo: "TASA_DGT_21",
        permiso: licenciaObjetivo,
        estado: "PENDIENTE",
        concepto: {
          contains: conceptoPattern,
          mode: "insensitive",
        },
      },
      orderBy: [{ fechaCreacion: "desc" }],
    });
  }

  async findTarifaTasaDgtByPermiso(permiso, conceptoPattern) {
    return this.prisma.tarifaConcepto.findFirst({
      where: {
        permiso,
        activa: true,
        concepto: {
          contains: conceptoPattern,
          mode: "insensitive",
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  async countSuspensosDesdeFecha(alumnoId, fechaDesde) {
    return this.prisma.solicitudExamen.count({
      where: {
        alumnoId,
        estado: {
          in: ["NO_APTO", "SUSPENDIDO", "NO_PRESENTADO"],
        },
        OR: [
          {
            fechaProgramada: {
              gte: fechaDesde,
            },
          },
          {
            fechaProgramada: null,
            fechaSolicitud: {
              gte: fechaDesde,
            },
          },
        ],
      },
    });
  }

  async findSuspensosDesdeFecha(alumnoId, fechaDesde) {
    const rows = await this.prisma.solicitudExamen.findMany({
      where: {
        alumnoId,
        estado: {
          in: ["NO_APTO", "SUSPENDIDO", "NO_PRESENTADO"],
        },
        OR: [
          {
            fechaProgramada: {
              gte: fechaDesde,
            },
          },
          {
            fechaProgramada: null,
            fechaSolicitud: {
              gte: fechaDesde,
            },
          },
        ],
      },
      orderBy: {
        fechaProgramada: "asc",
      },
      select: {
        id: true,
        fechaProgramada: true,
        fechaSolicitud: true,
      },
    });

    return rows.map((item) => ({
      id: item.id,
      fecha: item.fechaProgramada || item.fechaSolicitud,
    }));
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

  async findUltimoNoAptoPractico(alumnoId) {
    return this.prisma.solicitudExamen.findFirst({
      where: {
        alumnoId,
        tipo: "PRACTICO",
        estado: "NO_APTO",
      },
      orderBy: {
        fechaProgramada: "desc",
      },
    });
  }

  async hasTheoreticalApto(alumnoId) {
    const total = await this.prisma.solicitudExamen.count({
      where: {
        alumnoId,
        tipo: "TEORICO",
        estado: {
          in: ["APTO", "APROBADO"],
        },
      },
    });

    return total > 0;
  }

  async countHojasRutaRegistradas(alumnoId) {
    return this.prisma.hojaRuta.count({
      where: {
        alumnoId,
        estado: "REGISTRADA",
      },
    });
  }

  async countHojasRutaRegistradasConClase(alumnoId) {
    return this.prisma.hojaRuta.count({
      where: {
        alumnoId,
        estado: "REGISTRADA",
        clasePractica: {
          is: {},
        },
      },
    });
  }

  async countHojasRutaRegistradasConClaseDesdeFecha(alumnoId, fechaDesde) {
    return this.prisma.hojaRuta.count({
      where: {
        alumnoId,
        estado: "REGISTRADA",
        createdAt: {
          gte: fechaDesde,
        },
        clasePractica: {
          is: {},
        },
      },
    });
  }

  async findSolicitudPracticoActiva(alumnoId) {
    return this.prisma.solicitudExamen.findFirst({
      where: {
        alumnoId,
        tipo: "PRACTICO",
        estado: {
          in: ["PENDIENTE", "PROGRAMADO", "SOLICITADO"],
        },
      },
      orderBy: {
        fechaSolicitud: "desc",
      },
    });
  }

  async findConvocatoriasPracticoDisponibles(licencia, desdeFecha) {
    return this.prisma.convocatoriaExamen.findMany({
      where: {
        licencia,
        tipoExamen: "PRACTICO",
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

  async findConvocatoriaPracticoByFecha(licencia, fecha) {
    const inicio = new Date(fecha);
    inicio.setHours(0, 0, 0, 0);

    const fin = new Date(fecha);
    fin.setHours(23, 59, 59, 999);

    return this.prisma.convocatoriaExamen.findFirst({
      where: {
        licencia,
        tipoExamen: "PRACTICO",
        activo: true,
        fecha: {
          gte: inicio,
          lte: fin,
        },
      },
    });
  }

  async findTarifaGastoExamenPracticoByPermiso(permiso) {
    return this.prisma.tarifaConcepto.findFirst({
      where: {
        permiso,
        activa: true,
        tipo: "POR_EXAMEN",
        OR: [
          {
            concepto: {
              contains: "practico",
              mode: "insensitive",
            },
          },
          {
            concepto: {
              contains: "práctico",
              mode: "insensitive",
            },
          },
        ],
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  async findPagoGastoPracticoPendiente(alumnoId, permiso) {
    return this.prisma.pago.findFirst({
      where: {
        alumnoId,
        permiso,
        tipo: "EXAMEN_PRACTICO_GASTOS",
        estado: "PENDIENTE",
      },
      orderBy: [{ fechaCreacion: "desc" }],
    });
  }

  async findPagosGastoPracticoActivos(alumnoId, permiso) {
    return this.prisma.pago.findMany({
      where: {
        alumnoId,
        permiso,
        tipo: "EXAMEN_PRACTICO_GASTOS",
        estado: {
          in: ["PENDIENTE", "PAGADO"],
        },
      },
      include: {
        solicitudesExamenPractico: {
          select: {
            id: true,
            estado: true,
          },
        },
      },
      orderBy: [{ fechaCreacion: "desc" }],
    });
  }

  async cancelPagoAndFacturaIfPending(pagoId, motivo) {
    const pago = await this.prisma.pago.findUnique({
      where: {
        id: pagoId,
      },
      select: {
        id: true,
        estado: true,
        numeroFacturaPago: true,
      },
    });

    if (!pago || pago.estado !== "PENDIENTE") {
      return null;
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.pago.update({
        where: {
          id: pagoId,
        },
        data: {
          estado: "CANCELADO",
          observaciones: motivo,
        },
      });

      if (pago.numeroFacturaPago) {
        await tx.factura.updateMany({
          where: {
            numero: pago.numeroFacturaPago,
            estado: {
              in: ["EMITIDA", "PENDIENTE"],
            },
          },
          data: {
            estado: "ANULADA",
          },
        });
      }

      return true;
    });
  }

  async findPagoGastoPracticoPagadoReutilizable(alumnoId, permiso) {
    return this.prisma.pago.findFirst({
      where: {
        alumnoId,
        permiso,
        tipo: {
          in: ["EXAMEN_PRACTICO_GASTOS", "PROMOCION_PAGO_EXAMEN_GRATIS"],
        },
        estado: "PAGADO",
        solicitudesExamenPractico: {
          none: {},
        },
      },
      orderBy: [{ fechaPago: "desc" }, { fechaCreacion: "desc" }],
    });
  }

  async createPagoGastoPracticoPendiente({
    alumnoId,
    matriculaId,
    permiso,
    importe,
    concepto,
  }) {
    if (typeof this.prisma.$transaction !== "function") {
      const existente = await this.prisma.pago.findFirst({
        where: {
          alumnoId,
          permiso,
          tipo: "EXAMEN_PRACTICO_GASTOS",
          estado: "PENDIENTE",
        },
        orderBy: [{ fechaCreacion: "desc" }],
      });

      if (existente) {
        return existente;
      }

      const numeroFactura = this.generarNumeroFacturaPago();

      const pago = await this.prisma.pago.create({
        data: {
          alumnoId,
          matriculaId,
          tipo: "EXAMEN_PRACTICO_GASTOS",
          concepto,
          permiso,
          importe,
          estado: "PENDIENTE",
          convocatoriasIncluidas: 0,
          convocatoriasConsumidas: 0,
          numeroFacturaPago: numeroFactura,
        },
      });

      await this.prisma.factura.create({
        data: {
          numero: numeroFactura,
          alumnoId,
          matriculaId,
          concepto,
          baseImponible: importe,
          descuento: 0,
          total: importe,
          estado: "EMITIDA",
        },
      });

      return pago;
    }

    return this.prisma.$transaction(async (tx) => {
      const existente = await tx.pago.findFirst({
        where: {
          alumnoId,
          permiso,
          tipo: "EXAMEN_PRACTICO_GASTOS",
          estado: "PENDIENTE",
        },
        orderBy: [{ fechaCreacion: "desc" }],
      });

      if (existente) {
        return existente;
      }

      let attempt = 0;

      while (attempt < 3) {
        const numeroFactura = this.generarNumeroFacturaPago(attempt);

        try {
          const pago = await tx.pago.create({
            data: {
              alumnoId,
              matriculaId,
              tipo: "EXAMEN_PRACTICO_GASTOS",
              concepto,
              permiso,
              importe,
              estado: "PENDIENTE",
              convocatoriasIncluidas: 0,
              convocatoriasConsumidas: 0,
              numeroFacturaPago: numeroFactura,
            },
          });

          await tx.factura.create({
            data: {
              numero: numeroFactura,
              alumnoId,
              matriculaId,
              concepto,
              baseImponible: importe,
              descuento: 0,
              total: importe,
              estado: "EMITIDA",
            },
          });

          return pago;
        } catch (error) {
          if (error?.code !== "P2002" || attempt === 2) {
            throw error;
          }

          attempt += 1;
        }
      }

      return null;
    });
  }

  async createPagoTasaDgtPendiente({
    alumnoId,
    matriculaId,
    permiso,
    importe,
    concepto,
    convocatoriasIncluidas,
    observaciones,
  }) {
    if (typeof this.prisma.$transaction !== "function") {
      const existente = await this.prisma.pago.findFirst({
        where: {
          alumnoId,
          permiso,
          tipo: "TASA_DGT_21",
          estado: "PENDIENTE",
        },
        orderBy: [{ fechaCreacion: "desc" }],
      });

      if (existente) {
        return existente;
      }

      const numeroFactura = this.generarNumeroFacturaPago();

      const pago = await this.prisma.pago.create({
        data: {
          alumnoId,
          matriculaId,
          tipo: "TASA_DGT_21",
          concepto,
          permiso,
          importe,
          estado: "PENDIENTE",
          convocatoriasIncluidas,
          convocatoriasConsumidas: 0,
          numeroFacturaPago: numeroFactura,
          observaciones: observaciones || null,
        },
      });

      await this.prisma.factura.create({
        data: {
          numero: numeroFactura,
          alumnoId,
          matriculaId,
          concepto,
          baseImponible: importe,
          descuento: 0,
          total: importe,
          estado: "EMITIDA",
        },
      });

      return pago;
    }

    return this.prisma.$transaction(async (tx) => {
      const existente = await tx.pago.findFirst({
        where: {
          alumnoId,
          permiso,
          tipo: "TASA_DGT_21",
          estado: "PENDIENTE",
        },
        orderBy: [{ fechaCreacion: "desc" }],
      });

      if (existente) {
        return existente;
      }

      let attempt = 0;

      while (attempt < 3) {
        const numeroFactura = this.generarNumeroFacturaPago(attempt);

        try {
          const pago = await tx.pago.create({
            data: {
              alumnoId,
              matriculaId,
              tipo: "TASA_DGT_21",
              concepto,
              permiso,
              importe,
              estado: "PENDIENTE",
              convocatoriasIncluidas,
              convocatoriasConsumidas: 0,
              numeroFacturaPago: numeroFactura,
              observaciones: observaciones || null,
            },
          });

          await tx.factura.create({
            data: {
              numero: numeroFactura,
              alumnoId,
              matriculaId,
              concepto,
              baseImponible: importe,
              descuento: 0,
              total: importe,
              estado: "EMITIDA",
            },
          });

          return pago;
        } catch (error) {
          if (error?.code !== "P2002" || attempt === 2) {
            throw error;
          }

          attempt += 1;
        }
      }

      return null;
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
    return this.prisma.convocatoriaExamen.findMany({
      where: {
        licencia,
        tipoExamen: "TEORICO",
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

    return this.prisma.convocatoriaExamen.findFirst({
      where: {
        licencia,
        tipoExamen: "TEORICO",
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

  async findSolicitudesPracticoPendientesResultado(fechaLimite) {
    return this.prisma.solicitudExamen.findMany({
      where: {
        tipo: "PRACTICO",
        estado: {
          in: ["SOLICITADO", "PROGRAMADO", "PENDIENTE"],
        },
        fechaProgramada: {
          lte: fechaLimite,
        },
      },
      orderBy: [
        {
          fechaProgramada: "asc",
        },
        {
          fechaSolicitud: "asc",
        },
        {
          id: "asc",
        },
      ],
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

  async updateResultadoSolicitudPractico(id, data) {
    return this.prisma.solicitudExamen.update({
      where: { id },
      data,
    });
  }

  async updateResultadoSolicitudPracticoIfPending(id, data) {
    const updated = await this.prisma.solicitudExamen.updateMany({
      where: {
        id,
        tipo: "PRACTICO",
        estado: {
          in: ["SOLICITADO", "PROGRAMADO", "PENDIENTE"],
        },
      },
      data,
    });

    return updated.count > 0;
  }

  async createExamenResultadoPractico({ alumnoId, fecha, estado }) {
    return this.prisma.examen.create({
      data: {
        alumnoId,
        tipo: "PRACTICO",
        fecha,
        estado: estado === "APTO" ? "APROBADO" : "SUSPENDIDO",
      },
    });
  }

  async findSolicitudByIdForStudent(id, alumnoId) {
    return this.prisma.solicitudExamen.findFirst({
      where: {
        id,
        alumnoId,
      },
    });
  }

  async findSolicitudById(id) {
    return this.prisma.solicitudExamen.findUnique({
      where: {
        id,
      },
    });
  }

  async updateAlumnoEstadoExpediente(alumnoId, data) {
    return this.prisma.alumno.update({
      where: {
        id: alumnoId,
      },
      data,
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
