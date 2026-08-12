export class ExamenesController {
  constructor(service) {
    this.service = service;
  }

  async create(req, res) {
    const examen = await this.service.create(req.body);

    return res.status(201).json(examen);
  }
  async getAll(req, res) {
    const examenes = await this.service.getAll();

    return res.status(200).json(examenes);
  }
  async getById(req, res) {
    const examen = await this.service.getById(req.params.id);

    return res.status(200).json(examen);
  }
  async update(req, res) {
    const examen = await this.service.update(req.params.id, req.body);

    return res.status(200).json(examen);
  }
  async registerResult(req, res) {
    const examen = await this.service.registerResult(
      req.params.id,
      req.body.estado,
    );

    return res.status(200).json(examen);
  }
}
