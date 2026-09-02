export class ClasesDirectoController {
  constructor(service) {
    this.service = service;
  }

  async getAll(req, res) {
    const clases = await this.service.getAll();

    return res.status(200).json(clases);
  }

  async getAllActive(req, res) {
    const clases = await this.service.getAllActive();

    return res.status(200).json(clases);
  }

  async getById(req, res) {
    const clase = await this.service.getById(req.params.id);

    return res.status(200).json(clase);
  }

  async create(req, res) {
    const clase = await this.service.create(req.body);

    return res.status(201).json(clase);
  }

  async update(req, res) {
    const clase = await this.service.update(req.params.id, req.body);

    return res.status(200).json(clase);
  }

  async deactivate(req, res) {
    const clase = await this.service.deactivate(req.params.id);

    return res.status(200).json(clase);
  }

  async activate(req, res) {
    const clase = await this.service.activate(req.params.id);

    return res.status(200).json(clase);
  }
}
