export class ExamenesController {
  constructor(service) {
    this.service = service;
  }

  async create(req, res) {
    try {
      const examen = await this.service.create(req.body);
      return res.status(201).json(examen);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getAll(req, res) {
    const examenes = await this.service.getAll();
    return res.status(200).json(examenes);
  }

  async getById(req, res) {
    try {
      const examen = await this.service.getById(req.params.id);
      return res.status(200).json(examen);
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      const examen = await this.service.update(req.params.id, req.body);
      return res.status(200).json(examen);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async delete(req, res) {
    try {
      await this.service.delete(req.params.id);
      return res
        .status(200)
        .json({ message: "Examen eliminado correctamente" });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async registerResult(req, res) {
    try {
      const examen = await this.service.registerResult(
        req.params.id,
        req.body.estado,
      );
      return res.status(200).json(examen);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}
