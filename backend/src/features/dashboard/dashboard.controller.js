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
}
