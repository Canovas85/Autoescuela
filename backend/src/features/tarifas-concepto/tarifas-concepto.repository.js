export class TarifasConceptoRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async create(data) {
    return this.prisma.tarifaConcepto.create({
      data,
    });
  }

  async findAll(filters = {}) {
    return this.prisma.tarifaConcepto.findMany({
      where: filters,
      orderBy: [{ activa: "desc" }, { permiso: "asc" }, { concepto: "asc" }],
    });
  }

  async findById(id) {
    return this.prisma.tarifaConcepto.findUnique({
      where: { id },
    });
  }

  async findByPermisoYConcepto(permiso, concepto) {
    return this.prisma.tarifaConcepto.findUnique({
      where: {
        permiso_concepto: {
          permiso,
          concepto,
        },
      },
    });
  }

  async update(id, data) {
    return this.prisma.tarifaConcepto.update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    return this.prisma.tarifaConcepto.update({
      where: { id },
      data: {
        activa: false,
      },
    });
  }

  async activate(id) {
    return this.prisma.tarifaConcepto.update({
      where: { id },
      data: {
        activa: true,
      },
    });
  }

  async deactivate(id) {
    return this.prisma.tarifaConcepto.update({
      where: { id },
      data: {
        activa: false,
      },
    });
  }
}
