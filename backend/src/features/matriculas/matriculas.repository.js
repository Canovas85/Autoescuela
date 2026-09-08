import { tasaDgtConfig } from "../../config/tasa-dgt.config.js";

export class MatriculasRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  generarNumeroFactura(attempt = 0) {
    const timestamp = Date.now();
    const suffixBase = Math.floor(Math.random() * 10000) + attempt;
    const suffix = suffixBase.toString().padStart(4, "0");

    return `FAC-${timestamp}-${suffix}`;
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
