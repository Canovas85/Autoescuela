//  CÓDIGO CORREGIDO (Una única clase con todo dentro)
//  import prisma from "/src/config/prisma.js";

export class AlumnosRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async create(data) {
    return this.prisma.alumno.create({
      data,
    });
  }

  async findByEmail(email) {
    return this.prisma.alumno.findFirst({
      where: {
        email,
      },
    });
  }

  async findAll() {
    return this.prisma.alumno.findMany();
  }

  async findById(id) {
    return this.prisma.alumno.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id, data) {
    return this.prisma.alumno.update({
      where: {
        id,
      },
      data,
    });
  }

  async deactivate(id) {
    return this.prisma.alumno.update({
      where: {
        id,
      },
      data: {
        activo: false,
      },
    });
  }
}
