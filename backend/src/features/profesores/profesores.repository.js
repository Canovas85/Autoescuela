export class ProfesoresRepository {
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
        rol: "PROFESOR",
      },
    });

    console.log("USUARIO CREADO:", usuario);

    return this.prisma.profesor.create({
      data: {
        id: usuario.id,
        licenciaConducir: data.licenciaConducir,
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
    });
  }

  async update(id, data) {
    return this.prisma.profesor.update({
      where: {
        id,
      },
      data,
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
}
