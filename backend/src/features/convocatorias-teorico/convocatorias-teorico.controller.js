export class ConvocatoriasTeoricoController {
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
    const convocatorias = await this.service.getAll();
    return res.status(200).json(convocatorias);
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
