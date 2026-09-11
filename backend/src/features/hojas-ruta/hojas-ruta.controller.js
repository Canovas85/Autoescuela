export class HojasRutaController {
  constructor(service) {
    this.service = service;
  }

  async getFaultCatalog(req, res) {
    const data = await this.service.getFaultCatalog();
    return res.status(200).json(data);
  }

  async getProfessorDashboard(req, res) {
    const data = await this.service.getProfessorDashboard(
      req.user?.id,
      req.query,
    );
    return res.status(200).json(data);
  }

  async getProfessorRoadmapDetail(req, res) {
    const data = await this.service.getProfessorRoadmapDetail(
      req.user?.id,
      req.params.claseId,
    );

    return res.status(200).json(data);
  }

  async saveProfessorDraft(req, res) {
    const data = await this.service.saveProfessorDraft(
      req.user?.id,
      req.params.claseId,
      req.body,
    );

    return res.status(200).json(data);
  }

  async finalizeProfessorRoadmap(req, res) {
    const data = await this.service.finalizeProfessorRoadmap(
      req.user?.id,
      req.params.claseId,
      req.body,
    );

    return res.status(200).json(data);
  }

  async getAdminProfessorsSummary(req, res) {
    const data = await this.service.getAdminProfessorsSummary(req.query);
    return res.status(200).json(data);
  }

  async getAdminStudentsByProfessor(req, res) {
    const data = await this.service.getAdminStudentsByProfessor(
      req.params.profesorId,
      req.query,
    );

    return res.status(200).json(data);
  }

  async getAdminRegisteredRoadmapsByStudent(req, res) {
    const data = await this.service.getAdminRegisteredRoadmapsByStudent(
      req.params.profesorId,
      req.params.alumnoId,
      req.query,
    );

    return res.status(200).json(data);
  }

  async getAdminRoadmapDetail(req, res) {
    const data = await this.service.getAdminRoadmapDetail(req.params.roadmapId);
    return res.status(200).json(data);
  }

  async getStudentRegisteredRoadmaps(req, res) {
    const data = await this.service.getStudentRegisteredRoadmaps(
      req.user?.id,
      req.query,
    );

    return res.status(200).json(data);
  }

  async getStudentRoadmapDetail(req, res) {
    const data = await this.service.getStudentRoadmapDetail(
      req.user?.id,
      req.params.roadmapId,
    );

    return res.status(200).json(data);
  }
}
