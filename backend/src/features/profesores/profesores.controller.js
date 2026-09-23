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

  async getOverview(req, res) {
    try {
      const data = await this.service.getOverview(req.params.id, req.query);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async update(req, res) {
    const profesor = await this.service.update(req.params.id, req.body);

    return res.status(200).json(profesor);
  }

  async deactivate(req, res) {
    try {
      const profesor = await this.service.deactivate(req.params.id);
      return res.status(200).json(profesor);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getDeactivationImpact(req, res) {
    try {
      const result = await this.service.getDeactivationImpact(req.params.id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async deactivateWithReassignment(req, res) {
    try {
      const profesor = await this.service.deactivateWithReassignment(
        req.params.id,
        req.body?.reasignaciones || [],
        req.user?.id || null,
      );

      return res.status(200).json(profesor);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async activate(req, res) {
    const profesor = await this.service.activate(req.params.id);

    return res.status(200).json(profesor);
  }
}
