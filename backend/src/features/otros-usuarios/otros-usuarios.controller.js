export class OtrosUsuariosController {
  constructor(service) {
    this.service = service;
  }

  async getAll(req, res) {
    try {
      const usuarios = await this.service.getAll(req.query);
      return res.status(200).json(usuarios);
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }

  async getById(req, res) {
    try {
      const usuario = await this.service.getById(req.params.id);
      return res.status(200).json(usuario);
    } catch (error) {
      return res.status(404).json({
        message: error.message,
      });
    }
  }

  async create(req, res) {
    try {
      const usuario = await this.service.create(req.body);
      return res.status(201).json(usuario);
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      const usuario = await this.service.update(req.params.id, req.body);
      return res.status(200).json(usuario);
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }

  async deactivate(req, res) {
    try {
      const usuario = await this.service.deactivate(req.params.id);
      return res.status(200).json(usuario);
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }

  async activate(req, res) {
    try {
      const usuario = await this.service.activate(req.params.id);
      return res.status(200).json(usuario);
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }

  async resetPassword(req, res) {
    try {
      const result = await this.service.resetPassword(
        req.params.id,
        req.user?.id,
        req.body?.motivo,
        req.body?.newPassword,
      );

      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }
}
