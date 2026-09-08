export class ExamenesRepository {
  constructor(prisma) {
    this.prisma = prisma;
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

  async create(data) {
    return this.prisma.examen.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.examen.findMany({
      include: {
        alumno: {
          include: {
            usuario: true,
          },
        },
      },
      orderBy: [{ fecha: "asc" }],
    });
  }

  async findById(id) {
    return this.prisma.examen.findUnique({
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
    return this.prisma.examen.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id) {
    return this.prisma.examen.delete({
      where: {
        id,
      },
    });
  }
}
