export class NotificacionesController {
  constructor(service) {
    this.service = service;
  }

  async getMine(req, res) {
    const data = await this.service.getMine(
      req.user?.id,
      req.query?.soloNoLeidas,
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
}
