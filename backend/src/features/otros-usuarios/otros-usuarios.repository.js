export class OtrosUsuariosRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  buildWhere(filters = {}) {
    const where = {
      rol: {
        in: ["ADMINISTRATIVO", "SOPORTE"],
      },
    };

    if (filters.rol) {
      where.rol = filters.rol;
    }

    if (filters.activo !== undefined) {
      where.activo = filters.activo;
    }

    if (filters.search) {
      where.OR = [
        {
          nombre: {
            contains: filters.search,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: filters.search,
            mode: "insensitive",
          },
        },
        {
          dni: {
            contains: filters.search,
            mode: "insensitive",
          },
        },
        {
          telefono: {
            contains: filters.search,
            mode: "insensitive",
          },
        },
      ];
    }

    return where;
  }

  async findAll(filters = {}) {
    return this.prisma.usuario.findMany({
      where: this.buildWhere(filters),
      select: {
        id: true,
        nombre: true,
        email: true,
        dni: true,
        telefono: true,
        rol: true,
        activo: true,
        requiereCambioPassword: true,
        fechaCreacion: true,
      },
      orderBy: {
        fechaCreacion: "desc",
      },
    });
  }

  async findById(id) {
    return this.prisma.usuario.findFirst({
      where: {
        id,
        rol: {
          in: ["ADMINISTRATIVO", "SOPORTE"],
        },
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        dni: true,
        telefono: true,
        rol: true,
        activo: true,
        requiereCambioPassword: true,
        fechaCreacion: true,
      },
    });
  }

  async findUserByEmail(email) {
    return this.prisma.usuario.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });
  }

  async findUserByDni(dni) {
    return this.prisma.usuario.findUnique({
      where: {
        dni,
      },
      select: {
        id: true,
      },
    });
  }

  async create(data) {
    return this.prisma.usuario.create({
      data,
      select: {
        id: true,
        nombre: true,
        email: true,
        dni: true,
        telefono: true,
        rol: true,
        activo: true,
        requiereCambioPassword: true,
        fechaCreacion: true,
      },
    });
  }

  async update(id, data) {
    return this.prisma.usuario.update({
      where: {
        id,
      },
      data,
      select: {
        id: true,
        nombre: true,
        email: true,
        dni: true,
        telefono: true,
        rol: true,
        activo: true,
        requiereCambioPassword: true,
        fechaCreacion: true,
      },
    });
  }

  async setActive(id, activo) {
    return this.prisma.usuario.update({
      where: {
        id,
      },
      data: {
        activo,
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        dni: true,
        telefono: true,
        rol: true,
        activo: true,
        requiereCambioPassword: true,
        fechaCreacion: true,
      },
    });
  }

  async createPasswordResetAudit(data) {
    return this.prisma.passwordResetAudit.create({
      data,
    });
  }
}
