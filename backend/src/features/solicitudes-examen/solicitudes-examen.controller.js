export class SolicitudesExamenController {
  constructor(service) {
    this.service = service;
  }

  async create(req, res) {
    try {
      const solicitud = await this.service.create(req.body);
      return res.status(201).json(solicitud);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getAll(req, res) {
    const solicitudes = await this.service.getAll();
    return res.status(200).json(solicitudes);
  }

  async getAdminEvaluation(req, res) {
    try {
      const rows = await this.service.getAdminEvaluationByTipo(req.query.tipo);
      return res.status(200).json(rows);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getMine(req, res) {
    const solicitudes = await this.service.getMine(req.user.id);
    return res.status(200).json(solicitudes);
  }

  async getTheoreticalEligibility(req, res) {
    const eligibility = await this.service.getTheoreticalEligibilityForStudent(
      req.user.id,
    );

    return res.status(200).json(eligibility);
  }

  async getTheoreticalCalendar(req, res) {
    const calendar = await this.service.getTheoreticalCalendarForStudent(
      req.user.id,
    );

    return res.status(200).json(calendar);
  }

  async createTheoreticalRequest(req, res) {
    try {
      const solicitud = await this.service.createTheoreticalRequestForStudent(
        req.user.id,
        req.body,
      );

      return res.status(201).json(solicitud);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const solicitud = await this.service.getById(req.params.id);
      return res.status(200).json(solicitud);
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      const solicitud = await this.service.update(req.params.id, req.body);
      return res.status(200).json(solicitud);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async delete(req, res) {
    try {
      await this.service.delete(req.params.id);
      return res
        .status(200)
        .json({ message: "Solicitud eliminada correctamente" });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}
