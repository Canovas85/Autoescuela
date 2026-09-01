export class ClasesDirectoController {
  constructor(service) {
    this.service = service;
  }

  async getAll(req, res) {
    const clases = await this.service.getAll();

    return res.status(200).json(clases);
  }

  async getById(req, res) {
    const clase = await this.service.getById(req.params.id);

    return res.status(200).json(clase);
  }
}
