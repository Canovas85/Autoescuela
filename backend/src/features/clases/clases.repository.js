export class ClasesRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async create(data) {
    return this.prisma.clasePractica.create({
      data,
    });
  }
  async findAll() {
    return this.prisma.clasePractica.findMany({
      include: {
        alumno: {
          include: {
            usuario: true,
          },
        },

        profesor: {
          include: {
            usuario: true,
          },
        },

        vehiculo: true,
      },
    });
  }

  async findById(id) {
    return this.prisma.clasePractica.findUnique({
      where: {
        id,
      },

      include: {
        alumno: {
          include: {
            usuario: true,
          },
        },

        profesor: {
          include: {
            usuario: true,
          },
        },

        vehiculo: true,
      },
    });
  }

  async update(id, data) {
    return this.prisma.clasePractica.update({
      where: {
        id,
      },
      data,
    });
  }

  async cancel(id) {
    return this.prisma.clasePractica.update({
      where: {
        id,
      },
      data: {
        estado: "CANCELADA",
      },
    });
  }

  async findByProfesorAndFecha(profesorId, fecha) {
    return this.prisma.clasePractica.findFirst({
      where: {
        profesorId,
        fecha,
      },
    });
  }

  async findByVehiculoAndFecha(vehiculoId, fecha) {
    return this.prisma.clasePractica.findFirst({
      where: {
        vehiculoId,
        fecha,
      },
    });
  }

  async findByAlumnoAndFecha(alumnoId, fecha) {
    return this.prisma.clasePractica.findFirst({
      where: {
        alumnoId,
        fecha,
      },
    });
  }
}
