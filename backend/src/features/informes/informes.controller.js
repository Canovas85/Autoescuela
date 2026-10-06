export class InformesController {
  constructor(service) {
    this.service = service;
  }

  async getAccountingReport(req, res) {
    try {
      const data = await this.service.getAdminAccountingReport(req.query);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}
