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

  async getMine(usuarioId, soloNoLeidasRaw) {
    const soloNoLeidas = this.parseSoloNoLeidas(soloNoLeidasRaw);
    return this.repository.findMine(usuarioId, soloNoLeidas);
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
}
