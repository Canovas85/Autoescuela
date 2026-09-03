export class TarifasMatriculaController {
  constructor(service) {
    this.service = service;
  }

  async create(req, res) {
    try {
      const tarifa = await this.service.create(req.body);

      return res.status(201).json(tarifa);
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }

  async getAll(req, res) {
    const tarifas = await this.service.getAll();

    return res.status(200).json(tarifas);
  }

  async getById(req, res) {
    try {
      const tarifa = await this.service.getById(req.params.id);

      return res.status(200).json(tarifa);
    } catch (error) {
      return res.status(404).json({
        message: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      const tarifa = await this.service.update(req.params.id, req.body);

      return res.status(200).json(tarifa);
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }

  async delete(req, res) {
    try {
      await this.service.delete(req.params.id);

      return res.status(200).json({
        message: "Tarifa eliminada correctamente",
      });
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }

  async activate(req, res) {
    const tarifa = await this.service.activate(req.params.id);

    return res.status(200).json(tarifa);
  }

  async deactivate(req, res) {
    const tarifa = await this.service.deactivate(req.params.id);

    return res.status(200).json(tarifa);
  }
}
