export class PromocionesRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async create(data) {
    return this.prisma.promocion.create({
      data,
    });
  }

  async findAll(filters = {}) {
    const licencia = String(filters.licencia || "")
      .trim()
      .toUpperCase();

    return this.prisma.promocion.findMany({
      where:
        licencia && licencia !== "ALL"
          ? {
              licenciasAplicables: {
                has: licencia,
              },
            }
          : undefined,
      orderBy: [{ activa: "desc" }, { nombre: "asc" }],
    });
  }

  async findById(id) {
    return this.prisma.promocion.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id, data) {
    return this.prisma.promocion.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id) {
    return this.prisma.promocion.delete({
      where: {
        id,
      },
    });
  }

  async activate(id) {
    return this.prisma.promocion.update({
      where: {
        id,
      },
      data: {
        activa: true,
      },
    });
  }

  async deactivate(id) {
    return this.prisma.promocion.update({
      where: {
        id,
      },
      data: {
        activa: false,
      },
    });
  }

  async findPublic() {
    return this.prisma.promocion.findMany({
      where: {
        activa: true,
      },
      orderBy: [{ createdAt: "desc" }],
    });
  }

  async findBestPromotionForLicense(licencia) {
    const hoy = new Date();

    return this.prisma.promocion.findFirst({
      where: {
        activa: true,

        licenciasAplicables: {
          has: licencia,
        },

        OR: [
          {
            fechaInicio: null,
          },
          {
            fechaInicio: {
              lte: hoy,
            },
          },
        ],

        AND: [
          {
            OR: [
              {
                fechaFin: null,
              },
              {
                fechaFin: {
                  gte: hoy,
                },
              },
            ],
          },
        ],
      },

      orderBy: {
        precioPromocional: "asc",
      },
    });
  }

  async findActiveByLicense(licencia, referenceDate = new Date()) {
    return this.prisma.promocion.findMany({
      where: {
        activa: true,
        licenciasAplicables: {
          has: licencia,
        },
        OR: [
          {
            fechaInicio: null,
          },
          {
            fechaInicio: {
              lte: referenceDate,
            },
          },
        ],
        AND: [
          {
            OR: [
              {
                fechaFin: null,
              },
              {
                fechaFin: {
                  gte: referenceDate,
                },
              },
            ],
          },
        ],
      },
      orderBy: [{ precioPromocional: "asc" }, { nombre: "asc" }],
    });
  }

  async findByIds(ids) {
    if (!Array.isArray(ids) || ids.length === 0) {
      return [];
    }

    return this.prisma.promocion.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
}
