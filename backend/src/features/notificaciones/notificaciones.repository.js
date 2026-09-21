import {
  pushNotificationCreated,
  pushNotificationsBulkUpdated,
  pushNotificationUpdated,
} from "../../shared/realtime/notificaciones.realtime.js";

export class NotificacionesRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  getDateLimit(days) {
    const base = new Date();
    base.setDate(base.getDate() - days);
    base.setHours(0, 0, 0, 0);
    return base;
  }

  async findMine(usuarioId, soloNoLeidas, incluirArchivadas) {
    const dateLimit = this.getDateLimit(30);

    return this.prisma.notificacion.findMany({
      where: {
        usuarioId,
        createdAt: {
          gte: dateLimit,
        },
        ...(soloNoLeidas ? { leida: false } : {}),
        ...(incluirArchivadas ? {} : { archivada: false }),
      },
      orderBy: [{ archivada: "asc" }, { leida: "asc" }, { createdAt: "desc" }],
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
    const updated = await this.prisma.notificacion.update({
      where: {
        id,
      },
      data: {
        leida: true,
        readAt: new Date(),
      },
    });

    pushNotificationUpdated(updated);

    return updated;
  }

  async markAllAsRead(usuarioId) {
    const result = await this.prisma.notificacion.updateMany({
      where: {
        usuarioId,
        leida: false,
      },
      data: {
        leida: true,
        readAt: new Date(),
      },
    });

    pushNotificationsBulkUpdated(usuarioId, {
      updated: result.count || 0,
      type: "read-all",
    });

    return result;
  }

  async archive(id) {
    const updated = await this.prisma.notificacion.update({
      where: {
        id,
      },
      data: {
        archivada: true,
        archivedAt: new Date(),
      },
    });

    pushNotificationUpdated(updated);

    return updated;
  }

  async unarchive(id) {
    const updated = await this.prisma.notificacion.update({
      where: {
        id,
      },
      data: {
        archivada: false,
        archivedAt: null,
      },
    });

    pushNotificationUpdated(updated);

    return updated;
  }

  async create(data) {
    const created = await this.prisma.notificacion.create({
      data,
    });

    pushNotificationCreated(created);

    return created;
  }

  async createMany(dataList = []) {
    const validRows = (dataList || []).filter((item) =>
      Boolean(item?.usuarioId),
    );

    if (validRows.length === 0) {
      return [];
    }

    const created = await this.prisma.$transaction(
      validRows.map((row) => this.prisma.notificacion.create({ data: row })),
    );

    created.forEach((row) => {
      pushNotificationCreated(row);
    });

    return created;
  }

  async findUsersByRole(rol) {
    return this.prisma.usuario.findMany({
      where: {
        rol,
      },
      select: {
        id: true,
      },
    });
  }

  async createForRole(rol, payload) {
    const users = await this.findUsersByRole(rol);

    if (!users.length) {
      return [];
    }

    return this.createMany(
      users.map((user) => ({
        usuarioId: user.id,
        ...payload,
      })),
    );
  }
}
