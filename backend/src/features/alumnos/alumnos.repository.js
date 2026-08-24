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
        dni: data.dni || null,
        email: data.email,
        telefono: data.telefono,
        passwordHash: data.passwordHash,
        rol: data.rol || "ALUMNO",
      },
    });

    return this.prisma.alumno.create({
      data: {
        id: usuario.id,
        tipoLicenciaObjetivo: data.tipoLicenciaObjetivo ?? data.tipoLicencia,
        fechaNacimiento: data.fechaNacimiento ?? null,
        activo: data.activo ?? true,
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

  async findAll() {
    return this.prisma.alumno.findMany({
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
        dni: data.dni ?? undefined,
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
        tipoLicenciaObjetivo: data.tipoLicenciaObjetivo ?? data.tipoLicencia,
        fechaNacimiento: data.fechaNacimiento ?? undefined,
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
