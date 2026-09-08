export class DocumentosAlumnoController {
  constructor(service) {
    this.service = service;
  }

  async getMine(req, res) {
    try {
      const documentos = await this.service.getMine(req.user.id);
      return res.status(200).json(documentos);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getAllAdmin(req, res) {
    try {
      const documentos = await this.service.getAllAdmin();
      return res.status(200).json(documentos);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async create(req, res) {
    try {
      const documento = await this.service.create(
        req.user.id,
        req.body,
        req.files || [],
      );

      return res.status(201).json(documento);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      const documento = await this.service.update(
        req.params.id,
        req.user.id,
        req.body,
        req.files || [],
      );

      return res.status(200).json(documento);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async remove(req, res) {
    try {
      const documento = await this.service.remove(req.params.id, req.user.id);
      return res.status(200).json(documento);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async validate(req, res) {
    try {
      const documento = await this.service.validate(
        req.params.id,
        req.body?.estado,
      );
      return res.status(200).json(documento);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}
