export class VehiculosController {
  constructor(service) {
    this.service = service;
  }

  async create(req, res) {
    const vehiculo = await this.service.create(req.body);

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
    const vehiculo = await this.service.update(req.params.id, req.body);

    return res.status(200).json(vehiculo);
  }

  async deactivate(req, res) {
    const vehiculo = await this.service.deactivate(req.params.id);

    return res.status(200).json(vehiculo);
  }
}
