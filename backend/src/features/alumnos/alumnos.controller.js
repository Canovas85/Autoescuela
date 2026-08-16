export class AlumnosController {
  constructor(service) {
    this.service = service;
  }

  async create(req, res) {
    console.log("CONTROLADOR CREATE NUEVO");
    try {
      const alumno = await this.service.create(req.body);

      return res.status(201).json(alumno);
    } catch (error) {
      console.log("ENTRA EN EL CATCH");

      return res.status(400).json({
        message: error.message,
      });
    }
  }

  async getAll(req, res) {
    const includeInactive = req.query.includeInactive === "true";

    const alumnos = await this.service.getAll(includeInactive);

    return res.status(200).json(alumnos);
  }

  async getById(req, res) {
    const alumno = await this.service.getById(req.params.id);

    return res.status(200).json(alumno);
  }

  async update(req, res) {
    try {
      const alumno = await this.service.update(req.params.id, req.body);

      return res.status(200).json(alumno);
    } catch (error) {
      console.error("ERROR UPDATE:", error.message);

      return res.status(400).json({
        message: error.message,
      });
    }
  }

  async deactivate(req, res) {
    const alumno = await this.service.deactivate(req.params.id);

    return res.status(200).json(alumno);
  }

  async activate(req, res) {
    const alumno = await this.service.activate(req.params.id);

    return res.status(200).json(alumno);
  }
}
