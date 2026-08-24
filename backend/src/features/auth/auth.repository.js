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
