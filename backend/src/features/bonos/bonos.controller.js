export class BonosController {
  constructor(service) {
    this.service = service;
  }

  async create(req, res) {
    try {
      const bono = await this.service.create(req.body);
      return res.status(201).json(bono);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getAll(req, res) {
    const bonos = await this.service.getAll();
    return res.status(200).json(bonos);
  }

  async getById(req, res) {
    try {
      const bono = await this.service.getById(req.params.id);
      return res.status(200).json(bono);
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      const bono = await this.service.update(req.params.id, req.body);
      return res.status(200).json(bono);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async delete(req, res) {
    try {
      await this.service.delete(req.params.id);
      return res.status(200).json({ message: "Bono eliminado correctamente" });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async activate(req, res) {
    const bono = await this.service.activate(req.params.id);
    return res.status(200).json(bono);
  }

  async deactivate(req, res) {
    const bono = await this.service.deactivate(req.params.id);
    return res.status(200).json(bono);
  }
}
