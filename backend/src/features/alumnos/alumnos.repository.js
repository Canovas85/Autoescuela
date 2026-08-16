//  CÓDIGO CORREGIDO (Una única clase con todo dentro)
//  import prisma from "/src/config/prisma.js";

export class AlumnosRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async create(data) {
    const usuario = await this.prisma.usuario.create({
      data: {
        nombre: data.nombre,
        email: data.email,
        telefono: data.telefono,
        passwordHash: data.passwordHash,
        rol: "ALUMNO",
      },
    });

    return this.prisma.alumno.create({
      data: {
        id: usuario.id,
        tipoLicenciaObjetivo: data.tipoLicencia,

        horasPracticasCompletadas: 0,

        profesorAsignadoId: data.profesorAsignadoId || null,
      },

      include: {
        usuario: true,
      },
    });
  }

  async findByEmail(email) {
    return this.prisma.usuario.findUnique({
      where: {
        email,
      },
    });
  }

  async findAll(includeInactive = false) {
    return this.prisma.alumno.findMany({
      where: includeInactive
        ? {}
        : {
            activo: true,
          },

      include: {
        usuario: true,

        profesorAsignado: {
          include: {
            usuario: true,
          },
        },
      },
    });
  }

  async findById(id) {
    return this.prisma.alumno.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id, data) {
    await this.prisma.usuario.update({
      where: {
        id,
      },

      data: {
        nombre: data.nombre,
        email: data.email,
        telefono: data.telefono,

        ...(data.passwordHash && {
          passwordHash: data.passwordHash,
        }),
      },
    });

    return this.prisma.alumno.update({
      where: {
        id,
      },

      data: {
        tipoLicenciaObjetivo: data.tipoLicencia,
      },

      include: {
        usuario: true,
      },
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

  async activate(id) {
    return this.prisma.alumno.update({
      where: {
        id,
      },
      data: {
        activo: true,
      },
    });
  }
}
