import { tasaDgtConfig } from "../../config/tasa-dgt.config.js";
import { generateFacturaNumber } from "../../shared/utils/factura-number.js";

export class MatriculasRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  generarNumeroFactura(attempt = 0) {
    return generateFacturaNumber(attempt);
  }

  async create(data) {
    return this.prisma.matricula.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.matricula.findMany({
      include: {
        alumno: {
          include: {
            usuario: true,
          },
        },
        promocion: true,
        facturas: true,
      },
      orderBy: {
        fechaCreacion: "desc",
      },
    });
  }

  async findById(id) {
    return this.prisma.matricula.findUnique({
      where: {
        id,
      },
      include: {
        alumno: {
          include: {
            usuario: true,
          },
        },
        promocion: true,
        facturas: true,
      },
    });
  }

  async update(id, data) {
    return this.prisma.matricula.update({
      where: {
        id,
      },
      data,
    });
  }

  async pagar(id) {
    if (typeof this.prisma.$transaction !== "function") {
      const matricula = await this.prisma.matricula.update({
        where: {
          id,
        },
        data: {
          estado: "PAGADA",
          fechaPago: new Date(),
        },
      });

      const matriculaConPromocion =
        typeof this.prisma.matricula.findUnique === "function"
          ? await this.prisma.matricula.findUnique({
              where: {
                id: matricula.id,
              },
              include: {
                promocion: true,
              },
            })
          : null;

      const existente = await this.prisma.pago.findFirst({
        where: {
          matriculaId: id,
          tipo: "TASA_DGT_21",
          estado: {
            in: ["PENDIENTE", "PAGADO"],
          },
        },
      });

      if (!existente) {
        const tarifaTasa = await this.prisma.tarifaConcepto.findFirst({
          where: {
            permiso: matricula.licencia,
            activa: true,
            concepto: {
              contains: tasaDgtConfig.conceptoPattern,
              mode: "insensitive",
            },
          },
          orderBy: {
            updatedAt: "desc",
          },
        });

        await this.prisma.pago.create({
          data: {
            alumnoId: matricula.alumnoId,
            matriculaId: matricula.id,
            tipo: "TASA_DGT_21",
            concepto: tasaDgtConfig.conceptoPattern,
            permiso: matricula.licencia,
            importe: tarifaTasa?.precio ?? tasaDgtConfig.importeDefault,
            estado: "PENDIENTE",
            convocatoriasIncluidas: 2,
            convocatoriasConsumidas: 0,
          },
        });
      }

      if (matriculaConPromocion?.promocion?.incluyePagoExamenGratis) {
        await this.prisma.pago.create({
          data: {
            alumnoId: matricula.alumnoId,
            matriculaId: matricula.id,
            tipo: "PROMOCION_PAGO_EXAMEN_GRATIS",
            concepto: "Pago de examen práctico incluido en promoción",
            permiso: matricula.licencia,
            importe: 0,
            estado: "PAGADO",
            fechaPago: new Date(),
            convocatoriasIncluidas: 0,
            convocatoriasConsumidas: 0,
          },
        });
      }

      if ((matriculaConPromocion?.promocion?.clasesGratisIncluidas || 0) > 0) {
        const licenciaBono =
          matriculaConPromocion.promocion.licenciaClasesGratis ||
          matricula.licencia;

        const bonoPromo = await this.prisma.bono.create({
          data: {
            nombre: `Bono promoción ${matriculaConPromocion.promocion.nombre}`,
            descripcion: "Bono gratuito generado automáticamente por promoción",
            licencia: licenciaBono,
            clasesIncluidas:
              matriculaConPromocion.promocion.clasesGratisIncluidas,
            precio: 0,
            validezDias: 180,
            activo: true,
            esInterno: true,
          },
        });

        await this.prisma.compraBono.create({
          data: {
            alumnoId: matricula.alumnoId,
            bonoId: bonoPromo.id,
            matriculaOrigenId: matricula.id,
            origenPromocionId: matriculaConPromocion.promocion.id,
            clasesCompradas:
              matriculaConPromocion.promocion.clasesGratisIncluidas,
            clasesConsumidas: 0,
            pagado: true,
            fechaCompra: new Date(),
            fechaValidezHasta: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
          },
        });
      }

      return matricula;
    }

    return this.prisma.$transaction(async (tx) => {
      const fechaPago = new Date();

      const matricula = await tx.matricula.update({
        where: {
          id,
        },
        data: {
          estado: "PAGADA",
          fechaPago,
        },
      });

      const matriculaConPromocion =
        typeof tx.matricula.findUnique === "function"
          ? await tx.matricula.findUnique({
              where: {
                id: matricula.id,
              },
              include: {
                promocion: true,
              },
            })
          : null;

      await tx.factura.updateMany({
        where: {
          matriculaId: id,
        },
        data: {
          estado: "PAGADA",
          fechaPago,
        },
      });

      const existente = await tx.pago.findFirst({
        where: {
          matriculaId: id,
          tipo: "TASA_DGT_21",
          estado: {
            in: ["PENDIENTE", "PAGADO"],
          },
        },
      });

      if (!existente) {
        const tarifaTasa = await tx.tarifaConcepto.findFirst({
          where: {
            permiso: matricula.licencia,
            activa: true,
            concepto: {
              contains: tasaDgtConfig.conceptoPattern,
              mode: "insensitive",
            },
          },
          orderBy: {
            updatedAt: "desc",
          },
        });

        await tx.pago.create({
          data: {
            alumnoId: matricula.alumnoId,
            matriculaId: matricula.id,
            tipo: "TASA_DGT_21",
            concepto: tasaDgtConfig.conceptoPattern,
            permiso: matricula.licencia,
            importe: tarifaTasa?.precio ?? tasaDgtConfig.importeDefault,
            estado: "PENDIENTE",
            convocatoriasIncluidas: 2,
            convocatoriasConsumidas: 0,
          },
        });
      }

      const pagoPromocionExamenExistente = await tx.pago.findFirst({
        where: {
          matriculaId: id,
          tipo: "PROMOCION_PAGO_EXAMEN_GRATIS",
        },
      });

      if (
        matriculaConPromocion?.promocion?.incluyePagoExamenGratis &&
        !pagoPromocionExamenExistente
      ) {
        await tx.pago.create({
          data: {
            alumnoId: matricula.alumnoId,
            matriculaId: matricula.id,
            tipo: "PROMOCION_PAGO_EXAMEN_GRATIS",
            concepto: "Pago de examen práctico incluido en promoción",
            permiso: matricula.licencia,
            importe: 0,
            estado: "PAGADO",
            fechaPago,
            convocatoriasIncluidas: 0,
            convocatoriasConsumidas: 0,
          },
        });
      }

      const clasesGratis = Number(
        matriculaConPromocion?.promocion?.clasesGratisIncluidas || 0,
      );

      if (clasesGratis > 0) {
        const compraPromoExistente = await tx.compraBono.findFirst({
          where: {
            alumnoId: matricula.alumnoId,
            matriculaOrigenId: matricula.id,
            origenPromocionId: matriculaConPromocion?.promocion?.id || null,
          },
        });

        if (!compraPromoExistente) {
          const licenciaBono =
            matriculaConPromocion?.promocion?.licenciaClasesGratis ||
            matricula.licencia;

          const bonoPromo = await tx.bono.create({
            data: {
              nombre: `Bono promoción ${matriculaConPromocion?.promocion?.nombre || "alumno"}`,
              descripcion:
                "Bono gratuito generado automáticamente por promoción",
              licencia: licenciaBono,
              clasesIncluidas: clasesGratis,
              precio: 0,
              validezDias: 180,
              activo: true,
              esInterno: true,
            },
          });

          const fechaCompra = new Date();
          const fechaValidezHasta = new Date(
            fechaCompra.getTime() + 180 * 24 * 60 * 60 * 1000,
          );

          await tx.compraBono.create({
            data: {
              alumnoId: matricula.alumnoId,
              bonoId: bonoPromo.id,
              matriculaOrigenId: matricula.id,
              origenPromocionId: matriculaConPromocion?.promocion?.id || null,
              clasesCompradas: clasesGratis,
              clasesConsumidas: 0,
              pagado: true,
              fechaCompra,
              fechaValidezHasta,
            },
          });
        }
      }

      return matricula;
    });
  }

  async anular(id) {
    if (typeof this.prisma.$transaction !== "function") {
      return this.prisma.matricula.update({
        where: {
          id,
        },
        data: {
          estado: "ANULADA",
        },
      });
    }

    return this.prisma.$transaction(async (tx) => {
      const matricula = await tx.matricula.update({
        where: {
          id,
        },
        data: {
          estado: "ANULADA",
        },
      });

      await tx.factura.updateMany({
        where: {
          matriculaId: id,
        },
        data: {
          estado: "ANULADA",
        },
      });

      return matricula;
    });
  }

  async findByAlumnoId(alumnoId) {
    return this.prisma.matricula.findFirst({
      where: {
        alumnoId,
      },

      include: {
        promocion: true,
        facturas: true,
      },

      orderBy: {
        fechaCreacion: "desc",
      },
    });
  }

  async findTarifaByLicencia(licencia) {
    return this.prisma.tarifaMatricula.findUnique({
      where: {
        licencia,
      },
    });
  }
  async findActiveByAlumnoId(alumnoId) {
    return this.prisma.matricula.findFirst({
      where: {
        alumnoId,
      },

      orderBy: {
        fechaCreacion: "desc",
      },
    });
  }

  async updatePendingEnrollmentAndFactura({
    matriculaId,
    licencia,
    precioBase,
    precioFinal,
    promocionId,
    conceptoFactura,
    descuento,
  }) {
    return this.prisma.$transaction(async (tx) => {
      const matricula = await tx.matricula.update({
        where: {
          id: matriculaId,
        },
        data: {
          licencia,
          precioBase,
          precioFinal,
          promocionId: promocionId || null,
        },
      });

      await tx.factura.updateMany({
        where: {
          matriculaId,
          estado: {
            in: ["EMITIDA", "PENDIENTE"],
          },
        },
        data: {
          concepto: conceptoFactura,
          baseImponible: precioBase,
          descuento,
          total: precioFinal,
        },
      });

      return matricula;
    });
  }

  async createWithFactura(data, facturaData) {
    return this.prisma.$transaction(async (tx) => {
      const matricula = await tx.matricula.create({
        data,
      });

      let created = false;
      let attempt = 0;

      while (!created && attempt < 3) {
        try {
          await tx.factura.create({
            data: {
              numero: this.generarNumeroFactura(attempt),
              alumnoId: data.alumnoId,
              matriculaId: matricula.id,
              concepto: facturaData.concepto,
              baseImponible: facturaData.baseImponible,
              descuento: facturaData.descuento,
              total: facturaData.total,
              estado: facturaData.estado || "EMITIDA",
            },
          });

          created = true;
        } catch (error) {
          if (error?.code !== "P2002" || attempt === 2) {
            throw error;
          }

          attempt += 1;
        }
      }

      return matricula;
    });
  }
}
