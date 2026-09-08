export class PagosRepository {
  constructor(prisma) {
    this.prisma = prisma;
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
      },
    });
  }

  async pay(id) {
    if (typeof this.prisma.$transaction !== "function") {
      return this.prisma.pago.update({
        where: {
          id,
        },
        data: {
          estado: "PAGADO",
          fechaPago: new Date(),
          numeroFacturaPago: this.generarNumeroFacturaPago(),
        },
      });
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
          });

          if (pagoActualizado.matriculaId) {
            await tx.factura.create({
              data: {
                numero: numeroFacturaPago,
                alumnoId: pagoActualizado.alumnoId,
                matriculaId: pagoActualizado.matriculaId,
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
}
