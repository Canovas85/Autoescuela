export class AlumnosController {
  constructor(service) {
    this.service = service;
  }

  async create(req, res) {
    try {
      const alumno = req.user?.id
        ? await this.service.create(req.body, {
            createdById: req.user.id,
          })
        : await this.service.create(req.body);

      return res.status(201).json(alumno);
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }

  async getAll(req, res) {
    const alumnos = await this.service.getAll();

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

  async getEligiblePromotions(req, res) {
    try {
      const promociones = await this.service.getEligiblePromotionsForEnrollment(
        req.body,
      );

      return res.status(200).json(promociones);
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }

  async getEligibleProfesores(req, res) {
    try {
      const profesores = await this.service.getEligibleProfesoresForAlumno(
        req.params.id,
      );

      return res.status(200).json(profesores);
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }
}
