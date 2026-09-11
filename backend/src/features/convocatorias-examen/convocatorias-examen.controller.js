export class ConvocatoriasExamenController {
  constructor(service) {
    this.service = service;
  }

  async create(req, res) {
    try {
      const convocatoria = await this.service.create(req.body);
      return res.status(201).json(convocatoria);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const convocatorias = await this.service.getAll(req.query);
      return res.status(200).json(convocatorias);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getAgenda(req, res) {
    try {
      const agenda = await this.service.getAgenda(req.query);
      return res.status(200).json(agenda);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      const convocatoria = await this.service.update(req.params.id, req.body);
      return res.status(200).json(convocatoria);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async delete(req, res) {
    try {
      await this.service.delete(req.params.id);
      return res.status(200).json({
        message: "Convocatoria desactivada correctamente",
      });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}
