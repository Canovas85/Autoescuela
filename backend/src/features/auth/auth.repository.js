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
}
