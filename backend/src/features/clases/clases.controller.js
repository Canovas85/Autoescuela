export class ClasesController {
  constructor(service) {
    this.service = service;
  }
  async create(req, res) {
    const clase = await this.service.create(req.body);

    return res.status(201).json(clase);
  }

  async getAll(req, res) {
    const clases = await this.service.getAll();

    return res.status(200).json(clases);
  }
  async getById(req, res) {
    const clase = await this.service.getById(req.params.id);

    return res.status(200).json(clase);
  }

  async update(req, res) {
    const clase = await this.service.update(req.params.id, req.body);

    return res.status(200).json(clase);
  }

  async cancel(req, res) {
    const clase = await this.service.cancel(req.params.id);

    return res.status(200).json(clase);
  }
}
