export class DashboardController {
  constructor(service) {
    this.service = service;
  }

  async getMetrics(req, res) {
    const metrics = await this.service.getMetrics();

    return res.status(200).json(metrics);
  }
  async getAdvancedMetrics(req, res) {
    const metrics = await this.service.getAdvancedMetrics();

    return res.status(200).json(metrics);
  }
  async getExecutiveDashboard(req, res) {
    const metrics = await this.service.getExecutiveDashboard();

    return res.status(200).json(metrics);
  }

  async getStudentDashboard(req, res) {
    const metrics = await this.service.getStudentDashboard(req.user?.id);

    return res.status(200).json(metrics);
  }

  async getProfessorDashboard(req, res) {
    const metrics = await this.service.getProfessorDashboard(req.user?.id);

    return res.status(200).json(metrics);
  }

  async getProfessorStudents(req, res) {
    const data = await this.service.getProfessorStudents(req.user?.id);

    return res.status(200).json(data);
  }

  async getProfessorStudentDetail(req, res) {
    const data = await this.service.getProfessorStudentDetail(
      req.user?.id,
      req.params.alumnoId,
    );

    return res.status(200).json(data);
  }

  async getProfessorVehicles(req, res) {
    const data = await this.service.getProfessorVehicles(req.user?.id);

    return res.status(200).json(data);
  }

  async getProfessorVehicleSchedule(req, res) {
    const data = await this.service.getProfessorVehicleSchedule(
      req.user?.id,
      req.params.vehiculoId,
    );

    return res.status(200).json(data);
  }
}
