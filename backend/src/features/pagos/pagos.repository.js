import { pushNotificationCreated } from "../../shared/realtime/notificaciones.realtime.js";

export class PagosRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async createOrUpdateFacturaPagada(tx, pago, numeroFacturaPago, fechaPago) {
    const facturaExistente = await tx.factura.findUnique({
      where: {
        numero: numeroFacturaPago,
      },
    });

    if (facturaExistente) {
      return tx.factura.update({
        where: {
          numero: numeroFacturaPago,
        },
        data: {
          estado: "PAGADA",
          fechaPago,
        },
      });
    }

    return tx.factura.create({
      data: {
        numero: numeroFacturaPago,
        alumnoId: pago.alumnoId,
        matriculaId: pago.matriculaId,
        compraBonoId: pago.compraBonoId,
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
    const runPay = async (tx) => {
      const fechaPago = new Date();
      let pagoActualizado = null;
      let attempt = 0;

      const pagoActual = await tx.pago.findUnique({
        where: {
          id,
        },
      });

      if (!pagoActual) {
        throw new Error("Pago no encontrado");
      }

      while (attempt < 3) {
        const numeroFacturaPago =
          pagoActual.numeroFacturaPago ||
          this.generarNumeroFacturaPago(attempt);

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

          await this.createOrUpdateFacturaPagada(
            tx,
            pagoActualizado,
            numeroFacturaPago,
            fechaPago,
          );

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
    };

    if (typeof this.prisma.$transaction !== "function") {
      return runPay(this.prisma);
    }

    return this.prisma.$transaction((tx) => runPay(tx));
  }

  async createNotification(data) {
    const created = await this.prisma.notificacion.create({
      data,
    });

    pushNotificationCreated(created);

    return created;
  }
}
