export class NominasController {
  constructor(service) {
    this.service = service;
  }

  async getAll(req, res) {
    try {
      const rows = await this.service.getAll(req.query);
      return res.status(200).json(rows);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getMine(req, res) {
    try {
      const rows = await this.service.getMine(req.user.id, req.query);
      return res.status(200).json(rows);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async generateMonth(req, res) {
    try {
      const result = await this.service.generateMonthlyPayrolls(req.body || {});
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getPreview(req, res) {
    try {
      const nomina = await this.service.getPreview(req.params.id, req.user);
      return res.status(200).json(nomina);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getPdf(req, res) {
    try {
      const { buffer, fileName } = await this.service.getPdf(
        req.params.id,
        req.user,
      );

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=\"${fileName}\"`,
      );

      return res.status(200).send(buffer);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}
