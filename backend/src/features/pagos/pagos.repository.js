export class PagosRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  addDays(baseDate, days) {
    const fecha = new Date(baseDate);
    fecha.setDate(fecha.getDate() + Number(days));
    return fecha;
  }

  generarNumeroFacturaPago(attempt = 0) {
    const timestamp = Date.now();
    const suffixBase = Math.floor(Math.random() * 10000) + attempt;
    const suffix = suffixBase.toString().padStart(4, "0");

    return `FAC-PAGO-${timestamp}-${suffix}`;
  }

  async findAll() {
    return this.prisma.pago.findMany({
      include: {
        alumno: {
          include: {
            usuario: true,
          },
        },
        matricula: true,
        clasePractica: true,
        compraBono: {
          include: {
            bono: true,
          },
        },
      },
      orderBy: [{ estado: "asc" }, { fechaCreacion: "desc" }],
    });
  }

  async findByAlumnoId(alumnoId) {
    return this.prisma.pago.findMany({
      where: {
        alumnoId,
      },
      include: {
        matricula: true,
        clasePractica: true,
        compraBono: {
          include: {
            bono: true,
          },
        },
      },
      orderBy: [{ estado: "asc" }, { fechaCreacion: "desc" }],
    });
  }

  async findById(id) {
    return this.prisma.pago.findUnique({
      where: {
        id,
      },
      include: {
        matricula: true,
        clasePractica: true,
        compraBono: {
          include: {
            bono: true,
          },
        },
      },
    });
  }

  async pay(id) {
    if (typeof this.prisma.$transaction !== "function") {
      const fechaPago = new Date();
      const pago = await this.prisma.pago.update({
        where: {
          id,
        },
        data: {
          estado: "PAGADO",
          fechaPago,
          numeroFacturaPago: this.generarNumeroFacturaPago(),
        },
        include: {
          clasePractica: true,
          compraBono: {
            include: {
              bono: true,
            },
          },
        },
      });

      if (pago.compraBonoId && pago.compraBono?.bono) {
        const fechaValidezHasta = this.addDays(
          fechaPago,
          pago.compraBono.bono.validezDias,
        );

        await this.prisma.compraBono.update({
          where: {
            id: pago.compraBonoId,
          },
          data: {
            pagado: true,
            fechaCompra: fechaPago,
            fechaValidezHasta,
          },
        });

        await this.prisma.factura.create({
          data: {
            numero: pago.numeroFacturaPago,
            alumnoId: pago.alumnoId,
            compraBonoId: pago.compraBonoId,
            concepto: pago.concepto,
            baseImponible: pago.importe,
            descuento: 0,
            total: pago.importe,
            estado: "PAGADA",
            fechaPago,
          },
        });
      }

      if (pago.matriculaId) {
        await this.prisma.factura.create({
          data: {
            numero: pago.numeroFacturaPago,
            alumnoId: pago.alumnoId,
            matriculaId: pago.matriculaId,
            clasePracticaId: pago.clasePracticaId,
            concepto: pago.concepto,
            baseImponible: pago.importe,
            descuento: 0,
            total: pago.importe,
            estado: "PAGADA",
            fechaPago,
          },
        });
      }

      if (pago.clasePracticaId && !pago.matriculaId && !pago.compraBonoId) {
        await this.prisma.factura.create({
          data: {
            numero: pago.numeroFacturaPago,
            alumnoId: pago.alumnoId,
            clasePracticaId: pago.clasePracticaId,
            concepto: pago.concepto,
            baseImponible: pago.importe,
            descuento: 0,
            total: pago.importe,
            estado: "PAGADA",
            fechaPago,
          },
        });
      }

      return pago;
    }

    return this.prisma.$transaction(async (tx) => {
      const fechaPago = new Date();
      let pagoActualizado = null;
      let attempt = 0;

      while (attempt < 3) {
        const numeroFacturaPago = this.generarNumeroFacturaPago(attempt);

        try {
          pagoActualizado = await tx.pago.update({
            where: {
              id,
            },
            data: {
              estado: "PAGADO",
              fechaPago,
              numeroFacturaPago,
            },
            include: {
              compraBono: {
                include: {
                  bono: true,
                },
              },
            },
          });

          if (pagoActualizado.matriculaId) {
            await tx.factura.create({
              data: {
                numero: numeroFacturaPago,
                alumnoId: pagoActualizado.alumnoId,
                matriculaId: pagoActualizado.matriculaId,
                clasePracticaId: pagoActualizado.clasePracticaId,
                concepto: pagoActualizado.concepto,
                baseImponible: pagoActualizado.importe,
                descuento: 0,
                total: pagoActualizado.importe,
                estado: "PAGADA",
                fechaPago,
              },
            });
          }

          if (
            pagoActualizado.clasePracticaId &&
            !pagoActualizado.matriculaId &&
            !pagoActualizado.compraBonoId
          ) {
            await tx.factura.create({
              data: {
                numero: numeroFacturaPago,
                alumnoId: pagoActualizado.alumnoId,
                clasePracticaId: pagoActualizado.clasePracticaId,
                concepto: pagoActualizado.concepto,
                baseImponible: pagoActualizado.importe,
                descuento: 0,
                total: pagoActualizado.importe,
                estado: "PAGADA",
                fechaPago,
              },
            });
          }

          if (
            pagoActualizado.compraBonoId &&
            pagoActualizado.compraBono?.bono
          ) {
            const fechaValidezHasta = this.addDays(
              fechaPago,
              pagoActualizado.compraBono.bono.validezDias,
            );

            await tx.compraBono.update({
              where: {
                id: pagoActualizado.compraBonoId,
              },
              data: {
                pagado: true,
                fechaCompra: fechaPago,
                fechaValidezHasta,
              },
            });

            await tx.factura.create({
              data: {
                numero: numeroFacturaPago,
                alumnoId: pagoActualizado.alumnoId,
                compraBonoId: pagoActualizado.compraBonoId,
                concepto: pagoActualizado.concepto,
                baseImponible: pagoActualizado.importe,
                descuento: 0,
                total: pagoActualizado.importe,
                estado: "PAGADA",
                fechaPago,
              },
            });
          }

          return pagoActualizado;
        } catch (error) {
          if (error?.code !== "P2002" || attempt === 2) {
            throw error;
          }

          attempt += 1;
        }
      }

      return pagoActualizado;
    });
  }

  async createNotification(data) {
    return this.prisma.notificacion.create({
      data,
    });
  }
}
