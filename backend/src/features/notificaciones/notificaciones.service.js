export class NotificacionesService {
  constructor(repository) {
    this.repository = repository;
  }

  parseSoloNoLeidas(value) {
    if (value === undefined || value === null) {
      return false;
    }

    return String(value).trim().toLowerCase() === "true";
  }

  parseIncluirArchivadas(value) {
    if (value === undefined || value === null) {
      return false;
    }

    return String(value).trim().toLowerCase() === "true";
  }

  async getMine(usuarioId, soloNoLeidasRaw, incluirArchivadasRaw) {
    const soloNoLeidas = this.parseSoloNoLeidas(soloNoLeidasRaw);
    const incluirArchivadas = this.parseIncluirArchivadas(incluirArchivadasRaw);
    return this.repository.findMine(usuarioId, soloNoLeidas, incluirArchivadas);
  }

  async markMineAsRead(notificacionId, usuarioId) {
    const existing = await this.repository.findMineById(
      notificacionId,
      usuarioId,
    );

    if (!existing) {
      throw new Error("Notificación no encontrada");
    }

    if (existing.leida) {
      return existing;
    }

    return this.repository.markAsRead(notificacionId);
  }

  async markAllMineAsRead(usuarioId) {
    const result = await this.repository.markAllAsRead(usuarioId);

    return {
      updated: result.count || 0,
    };
  }

  async archiveMine(notificacionId, usuarioId) {
    const existing = await this.repository.findMineById(
      notificacionId,
      usuarioId,
    );

    if (!existing) {
      throw new Error("Notificación no encontrada");
    }

    if (existing.archivada) {
      return existing;
    }

    return this.repository.archive(notificacionId);
  }

  async unarchiveMine(notificacionId, usuarioId) {
    const existing = await this.repository.findMineById(
      notificacionId,
      usuarioId,
    );

    if (!existing) {
      throw new Error("Notificación no encontrada");
    }

    if (!existing.archivada) {
      return existing;
    }

    return this.repository.unarchive(notificacionId);
  }
}
