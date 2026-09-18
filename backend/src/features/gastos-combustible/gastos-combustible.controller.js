export class GastosCombustibleController {
  constructor(service) {
    this.service = service;
  }

  async getAll(req, res) {
    const rows = await this.service.getAll();
    return res.status(200).json(rows);
  }

  async getMine(req, res) {
    const rows = await this.service.getMine(req.user.id);
    return res.status(200).json(rows);
  }

  async createRefuelExpense(req, res) {
    const result = await this.service.createRefuelExpense(
      req.user.id,
      req.params.vehiculoId,
      req.file,
    );

    return res.status(201).json(result);
  }
}
