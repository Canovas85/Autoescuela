export class BonosRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  addDays(baseDate, days) {
    const fecha = new Date(baseDate);
    fecha.setDate(fecha.getDate() + Number(days));
    return fecha;
  }

  async create(data) {
    return this.prisma.bono.create({
      data,
    });
  }

  async findAll(filters = {}) {
    const where = {
      esInterno: false,
    };

    if (filters.licencia) {
      where.licencia = filters.licencia;
    }

    return this.prisma.bono.findMany({
      where,
      orderBy: [{ activo: "desc" }, { nombre: "asc" }],
    });
  }

  async findById(id) {
    return this.prisma.bono.findUnique({
      where: {
        id,
      },
    });
  }

  async findActivos(licencia = null) {
    return this.prisma.bono.findMany({
      where: {
        activo: true,
        esInterno: false,
        ...(licencia
          ? {
              licencia,
            }
          : {}),
      },
      orderBy: {
        nombre: "asc",
      },
    });
  }

  async findActivoById(id) {
    return this.prisma.bono.findFirst({
      where: {
        id,
        activo: true,
        esInterno: false,
      },
    });
  }

  async findAlumnoById(alumnoId) {
    return this.prisma.alumno.findUnique({
      where: {
        id: alumnoId,
      },
      select: {
        id: true,
        tipoLicenciaObjetivo: true,
      },
    });
  }

  async createCompraPendiente({ alumno, bono }) {
    const fechaCompra = new Date();
    const fechaValidezHasta = this.addDays(fechaCompra, bono.validezDias);

    return this.prisma.$transaction(async (tx) => {
      const compra = await tx.compraBono.create({
        data: {
          alumnoId: alumno.id,
          bonoId: bono.id,
          clasesCompradas: bono.clasesIncluidas,
          clasesConsumidas: 0,
          pagado: false,
          fechaCompra,
          fechaValidezHasta,
        },
        include: {
          bono: true,
        },
      });

      const pago = await tx.pago.create({
        data: {
          alumnoId: alumno.id,
          compraBonoId: compra.id,
          tipo: "BONO_CLASES",
          concepto: `Compra bono: ${bono.nombre}`,
          permiso: alumno.tipoLicenciaObjetivo,
          importe: bono.precio,
          estado: "PENDIENTE",
          convocatoriasIncluidas: 0,
          convocatoriasConsumidas: 0,
        },
      });

      return {
        compra,
        pago,
      };
    });
  }

  async update(id, data) {
    return this.prisma.bono.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id) {
    return this.prisma.bono.delete({
      where: {
        id,
      },
    });
  }

  async activate(id) {
    return this.prisma.bono.update({
      where: {
        id,
      },
      data: {
        activo: true,
      },
    });
  }

  async deactivate(id) {
    return this.prisma.bono.update({
      where: {
        id,
      },
      data: {
        activo: false,
      },
    });
  }
}
