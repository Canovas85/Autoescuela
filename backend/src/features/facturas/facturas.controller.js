export class FacturasController {
  constructor(service) {
    this.service = service;
  }

  async getAll(req, res) {
    const facturas = await this.service.getAll();

    return res.status(200).json(facturas);
  }

  async getMine(req, res) {
    const facturas = await this.service.getMine(req.user.id);

    return res.status(200).json(facturas);
  }

  async getPreview(req, res) {
    const preview =
      req.user?.rol === "ALUMNO"
        ? await this.service.getPreviewMine(req.params.id, req.user.id)
        : await this.service.getPreview(req.params.id);
    return res.status(200).json(preview);
  }

  async getPdf(req, res) {
    const { buffer, fileName } =
      req.user?.rol === "ALUMNO"
        ? await this.service.getPdfMine(req.params.id, req.user.id)
        : await this.service.getPdf(req.params.id);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    return res.status(200).send(buffer);
  }

  async sendDuplicate(req, res) {
    const result = await this.service.sendDuplicate(
      req.params.id,
      req.body?.email,
    );
    return res.status(200).json(result);
  }
}
