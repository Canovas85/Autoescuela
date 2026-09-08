export class PagosController {
  constructor(service) {
    this.service = service;
  }

  async getAll(req, res) {
    const pagos = await this.service.getAll();

    return res.status(200).json(pagos);
  }

  async getMine(req, res) {
    const pagos = await this.service.getMine(req.user.id);

    return res.status(200).json(pagos);
  }

  async getMineById(req, res) {
    try {
      const pago = await this.service.getMineById(req.params.id, req.user.id);

      return res.status(200).json(pago);
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }

  async payMine(req, res) {
    try {
      const pago = await this.service.payMine(req.params.id, req.user.id);

      return res.status(200).json(pago);
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }
}
