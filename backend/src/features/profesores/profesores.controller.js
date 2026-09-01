export class ProfesoresController {
  constructor(service) {
    this.service = service;
  }

  async create(req, res) {
    const profesor = req.user?.id
      ? await this.service.create(req.body, {
          createdById: req.user.id,
        })
      : await this.service.create(req.body);

    return res.status(201).json(profesor);
  }

  async getAll(req, res) {
    const profesores = await this.service.getAll();

    return res.status(200).json(profesores);
  }

  async getById(req, res) {
    const profesor = await this.service.getById(req.params.id);

    return res.status(200).json(profesor);
  }

  async update(req, res) {
    const profesor = await this.service.update(req.params.id, req.body);

    return res.status(200).json(profesor);
  }

  async deactivate(req, res) {
    const profesor = await this.service.deactivate(req.params.id);

    return res.status(200).json(profesor);
  }

  async activate(req, res) {
    const profesor = await this.service.activate(req.params.id);

    return res.status(200).json(profesor);
  }
}
