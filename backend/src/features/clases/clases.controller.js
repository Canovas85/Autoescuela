export class ClasesController {
  constructor(service) {
    this.service = service;
  }
  async create(req, res) {
    const clase = await this.service.create(req.body);

    return res.status(201).json(clase);
  }

  async getAll(req, res) {
    const clases = await this.service.getAll();

    return res.status(200).json(clases);
  }
  async getById(req, res) {
    const clase = await this.service.getById(req.params.id);

    return res.status(200).json(clase);
  }

  async update(req, res) {
    const clase = await this.service.update(req.params.id, req.body);

    return res.status(200).json(clase);
  }

  async cancel(req, res) {
    const clase = await this.service.cancel(req.params.id);

    return res.status(200).json(clase);
  }

  async getStudentEligibility(req, res) {
    const data = await this.service.getStudentEligibility(req.user?.id);
    return res.status(200).json(data);
  }

  async getStudentBookingContext(req, res) {
    const data = await this.service.getStudentBookingContext(
      req.user?.id,
      req.query?.weekOffset,
    );
    return res.status(200).json(data);
  }

  async createStudentRequest(req, res) {
    const data = await this.service.createStudentRequest(
      req.user?.id,
      req.body,
    );
    return res.status(201).json(data);
  }

  async cancelStudentRequest(req, res) {
    const data = await this.service.cancelByStudent(
      req.user?.id,
      req.params.id,
    );
    return res.status(200).json(data);
  }

  async getProfessorRequests(req, res) {
    const data = await this.service.getProfessorRequests(req.user?.id);
    return res.status(200).json(data);
  }

  async confirmProfessorRequest(req, res) {
    const data = await this.service.confirmByProfessor(
      req.user?.id,
      req.params.id,
    );
    return res.status(200).json(data);
  }

  async cancelProfessorRequest(req, res) {
    const data = await this.service.cancelByProfessor(
      req.user?.id,
      req.params.id,
    );
    return res.status(200).json(data);
  }
}
