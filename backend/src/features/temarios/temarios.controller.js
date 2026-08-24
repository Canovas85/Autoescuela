export class TemariosController {
  constructor(service) {
    this.service = service;
  }

  async create(req, res) {
    try {
      const temario = await this.service.create(req.body);
      return res.status(201).json(temario);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getAll(req, res) {
    const temarios = await this.service.getAll();
    return res.status(200).json(temarios);
  }

  async getForAlumno(req, res) {
    try {
      const temarios = await this.service.getForAlumno(req.user.id);
      return res.status(200).json(temarios);
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  }

  async getTemaForAlumno(req, res) {
    try {
      const temario = await this.service.getTemaForAlumno(
        req.user.id,
        req.params.id,
      );
      return res.status(200).json(temario);
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  }

  async saveMiniTestResultado(req, res) {
    try {
      const result = await this.service.saveMiniTestResultado(
        req.user.id,
        req.params.id,
        req.body,
      );
      return res.status(200).json(result);
    } catch (error) {
      const status =
        error.message === "Alumno no encontrado" ||
        error.message === "Tema no encontrado para tu permiso"
          ? 404
          : 400;

      return res.status(status).json({ message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const temario = await this.service.getById(req.params.id);
      return res.status(200).json(temario);
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      const temario = await this.service.update(req.params.id, req.body);
      return res.status(200).json(temario);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async delete(req, res) {
    try {
      await this.service.delete(req.params.id);
      return res
        .status(200)
        .json({ message: "Temario eliminado correctamente" });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}
