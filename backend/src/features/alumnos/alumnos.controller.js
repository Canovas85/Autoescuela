export class AlumnosController {
  constructor(service) {
    this.service = service;
  }

  async create(req, res) {
    const alumno = await this.service.create(req.body);

    return res.status(201).json(alumno);
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
    const alumno = await this.service.update(req.params.id, req.body);

    return res.status(200).json(alumno);
  }

  async deactivate(req, res) {
    const alumno = await this.service.deactivate(req.params.id);

    return res.status(200).json(alumno);
  }
}
