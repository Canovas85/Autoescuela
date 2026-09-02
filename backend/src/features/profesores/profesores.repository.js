export class ProfesoresRepository {
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
        requiereCambioPassword: true,
        rol: "PROFESOR",
      },
    });

    console.log("USUARIO CREADO:", usuario);

    return this.prisma.profesor.create({
      data: {
        id: usuario.id,
        licenciaConducir: data.licenciaConducir,
        permisosLicencias: data.permisosLicencias ?? [data.licenciaConducir],
        telefono: data.telefono,
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

  async findUserByDni(dni) {
    return this.prisma.usuario.findUnique({
      where: {
        dni,
      },
    });
  }

  async findAll() {
    return this.prisma.profesor.findMany({
      include: {
        usuario: true,
      },
    });
  }

  async findById(id) {
    return this.prisma.profesor.findUnique({
      where: {
        id,
      },
      include: {
        usuario: true,
      },
    });
  }

  async update(id, data) {
    const usuarioData = {};
    const profesorData = {};

    if (data.nombre !== undefined) {
      usuarioData.nombre = data.nombre;
    }
    if (data.email !== undefined) {
      usuarioData.email = data.email;
    }
    if (data.dni !== undefined) {
      usuarioData.dni = data.dni;
    }
    if (data.telefono !== undefined) {
      usuarioData.telefono = data.telefono;
      profesorData.telefono = data.telefono;
    }

    if (data.passwordHash !== undefined) {
      usuarioData.passwordHash = data.passwordHash;
    }
    if (data.licenciaConducir !== undefined) {
      profesorData.licenciaConducir = data.licenciaConducir;
    }
    if (data.permisosLicencias !== undefined) {
      profesorData.permisosLicencias = data.permisosLicencias;
    }

    return this.prisma.$transaction(async (tx) => {
      if (Object.keys(usuarioData).length > 0) {
        await tx.usuario.update({
          where: {
            id,
          },
          data: usuarioData,
        });
      }

      if (Object.keys(profesorData).length > 0) {
        return tx.profesor.update({
          where: {
            id,
          },
          data: profesorData,
          include: {
            usuario: true,
          },
        });
      }

      return tx.profesor.findUnique({
        where: {
          id,
        },
        include: {
          usuario: true,
        },
      });
    });
  }

  async deactivate(id) {
    return this.prisma.profesor.update({
      where: {
        id,
      },
      data: {
        activo: false,
      },
    });
  }

  async deactivateById(id) {
    return this.prisma.profesor.update({
      where: {
        id,
      },
      data: {
        activo: false,
      },
    });
  }

  async activate(id) {
    return this.prisma.profesor.update({
      where: {
        id,
      },
      data: {
        activo: true,
      },
    });
  }
}
