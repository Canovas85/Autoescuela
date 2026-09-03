export class MatriculasController {
  constructor(service) {
    this.service = service;
  }

  async create(req, res) {
    try {
      const matricula = await this.service.create(req.body);

      return res.status(201).json(matricula);
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }

  async getAll(req, res) {
    const matriculas = await this.service.getAll();

    return res.status(200).json(matriculas);
  }

  async getById(req, res) {
    try {
      const matricula = await this.service.getById(req.params.id);

      return res.status(200).json(matricula);
    } catch (error) {
      return res.status(404).json({
        message: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      const matricula = await this.service.update(req.params.id, req.body);

      return res.status(200).json(matricula);
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }

  async pagar(req, res) {
    const matricula = await this.service.pagar(req.params.id);

    return res.status(200).json(matricula);
  }

  async anular(req, res) {
    const matricula = await this.service.anular(req.params.id);

    return res.status(200).json(matricula);
  }

  async getMine(req, res) {
    try {
      const matricula = await this.service.getMine(req.user.id);

      return res.status(200).json(matricula);
    } catch (error) {
      return res.status(404).json({
        message: error.message,
      });
    }
  }
}
