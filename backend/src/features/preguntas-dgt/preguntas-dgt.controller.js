export class PreguntasDGTController {
  constructor(service) {
    this.service = service;
  }

  async create(req, res) {
    try {
      const pregunta = await this.service.create(req.body);

      return res.status(201).json(pregunta);
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }

  async getAll(req, res) {
    const preguntas = await this.service.getAll();

    return res.status(200).json(preguntas);
  }

  async getById(req, res) {
    try {
      const pregunta = await this.service.getById(req.params.id);

      return res.status(200).json(pregunta);
    } catch (error) {
      return res.status(404).json({
        message: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      const pregunta = await this.service.update(req.params.id, req.body);

      return res.status(200).json(pregunta);
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }

  async delete(req, res) {
    try {
      await this.service.delete(req.params.id);

      return res.status(200).json({
        message: "Pregunta eliminada correctamente",
      });
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }

  async activate(req, res) {
    const pregunta = await this.service.activate(req.params.id);

    return res.status(200).json(pregunta);
  }

  async deactivate(req, res) {
    const pregunta = await this.service.deactivate(req.params.id);

    return res.status(200).json(pregunta);
  }

  async generarExamen(req, res) {
    try {
      const preguntas = await this.service.generateExam(
        req.user.id,
        req.user.licencia || req.body.licencia,
      );

      return res.status(200).json(preguntas);
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }

  async corregirExamen(req, res) {
    try {
      const resultado = await this.service.corregirExamen({
        alumnoId: req.user.id,

        licencia: req.body.licencia,

        preguntas: req.body.preguntas,

        respuestasAlumno: req.body.respuestasAlumno,

        duracionSegundos: req.body.duracionSegundos,
      });

      return res.status(200).json(resultado);
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }
}
