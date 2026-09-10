export class NotificacionesRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findMine(usuarioId, soloNoLeidas) {
    return this.prisma.notificacion.findMany({
      where: {
        usuarioId,
        ...(soloNoLeidas ? { leida: false } : {}),
      },
      orderBy: [{ leida: "asc" }, { createdAt: "desc" }],
    });
  }

  async findMineById(id, usuarioId) {
    return this.prisma.notificacion.findFirst({
      where: {
        id,
        usuarioId,
      },
    });
  }

  async markAsRead(id) {
    return this.prisma.notificacion.update({
      where: {
        id,
      },
      data: {
        leida: true,
        readAt: new Date(),
      },
    });
  }

  async markAllAsRead(usuarioId) {
    return this.prisma.notificacion.updateMany({
      where: {
        usuarioId,
        leida: false,
      },
      data: {
        leida: true,
        readAt: new Date(),
      },
    });
  }
}
