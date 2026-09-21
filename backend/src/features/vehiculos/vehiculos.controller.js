export class VehiculosController {
  constructor(service) {
    this.service = service;
  }

  async create(req, res) {
    const vehiculo = await this.service.create(req.body, req.file);

    return res.status(201).json(vehiculo);
  }

  async getAll(req, res) {
    const vehiculos = await this.service.getAll();

    return res.status(200).json(vehiculos);
  }

  async getById(req, res) {
    const vehiculo = await this.service.getById(req.params.id);

    return res.status(200).json(vehiculo);
  }

  async update(req, res) {
    const vehiculo = await this.service.update(
      req.params.id,
      req.body,
      req.file,
    );

    return res.status(200).json(vehiculo);
  }

  async deactivate(req, res) {
    try {
      const vehiculo = await this.service.deactivate(req.params.id);
      return res.status(200).json(vehiculo);
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
      const vehiculo = await this.service.deactivateWithReassignment(
        req.params.id,
        req.body?.reasignaciones || [],
      );

      return res.status(200).json(vehiculo);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async activate(req, res) {
    const vehiculo = await this.service.activate(req.params.id);

    return res.status(200).json(vehiculo);
  }
}
