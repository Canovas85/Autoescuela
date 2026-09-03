export class FacturasController {
  constructor(service) {
    this.service = service;
  }

  async getAll(req, res) {
    const facturas = await this.service.getAll();

    return res.status(200).json(facturas);
  }

  async getMine(req, res) {
    const facturas = await this.service.getMine(req.user.id);

    return res.status(200).json(facturas);
  }
}
