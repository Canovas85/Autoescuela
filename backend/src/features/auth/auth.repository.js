export class AuthRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findUserByEmail(email) {
    return this.prisma.usuario.findUnique({
      where: {
        email,
      },
    });
  }

  async findUserById(id) {
    return this.prisma.usuario.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
      },
    });
  }

  async updatePasswordAndClearFirstLogin(id, passwordHash) {
    return this.prisma.usuario.update({
      where: {
        id,
      },
      data: {
        passwordHash,
        requiereCambioPassword: false,
      },
    });
  }
}
