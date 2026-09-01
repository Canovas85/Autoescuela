export class PromocionesController {
  constructor(service) {
    this.service = service;
  }

  async create(req, res) {
    try {
      console.log("ENTRA CONTROLLER");
      console.log("BODY:", req.body);
      console.log("FILE:", req.file);

      const promocion = await this.service.create(req.body, req.file);

      return res.status(201).json(promocion);
    } catch (error) {
      console.error("ERROR CREATE:", error);
      console.error("STACK:", error.stack);

      return res.status(500).json({
        message: error.message,
      });
    }
  }

  async getAll(req, res) {
    const promociones = await this.service.getAll();

    return res.status(200).json(promociones);
  }

  async getPublic(req, res) {
    const promociones = await this.service.getPublic();

    return res.status(200).json(promociones);
  }

  async getById(req, res) {
    try {
      const promocion = await this.service.getById(req.params.id);

      return res.status(200).json(promocion);
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  }

  async update(req, res) {
    const promocion = await this.service.update(
      req.params.id,
      req.body,
      req.file,
    );

    return res.status(200).json(promocion);
  }

  async delete(req, res) {
    try {
      await this.service.delete(req.params.id);

      return res.status(200).json({
        message: "Promoción eliminada correctamente",
      });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async activate(req, res) {
    const promocion = await this.service.activate(req.params.id);

    return res.status(200).json(promocion);
  }

  async deactivate(req, res) {
    const promocion = await this.service.deactivate(req.params.id);

    return res.status(200).json(promocion);
  }
}
