import jwt from "jsonwebtoken";
import { openNotificationStream } from "../../shared/realtime/notificaciones.realtime.js";

export class NotificacionesController {
  constructor(service) {
    this.service = service;
  }

  async stream(req, res) {
    const token = String(req.query?.token || "").trim();

    if (!token) {
      return res.status(401).json({ message: "Token no enviado" });
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);

      openNotificationStream(payload.id, req, res);
      return;
    } catch {
      return res.status(401).json({ message: "Token inválido" });
    }
  }

  async getMine(req, res) {
    const data = await this.service.getMine(
      req.user?.id,
      req.query?.soloNoLeidas,
      req.query?.incluirArchivadas,
    );
    return res.status(200).json(data);
  }

  async markMineAsRead(req, res) {
    const data = await this.service.markMineAsRead(req.params.id, req.user?.id);
    return res.status(200).json(data);
  }

  async markAllMineAsRead(req, res) {
    const data = await this.service.markAllMineAsRead(req.user?.id);
    return res.status(200).json(data);
  }

  async archiveMine(req, res) {
    const data = await this.service.archiveMine(req.params.id, req.user?.id);
    return res.status(200).json(data);
  }

  async unarchiveMine(req, res) {
    const data = await this.service.unarchiveMine(req.params.id, req.user?.id);
    return res.status(200).json(data);
  }
}
