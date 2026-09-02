export class ClasesDirectoService {
  constructor(repository) {
    this.repository = repository;
  }

  async getAll() {
    return this.repository.findAll();
  }

  async getAllActive() {
    return this.repository.findAllActive();
  }

  async getById(id) {
    return this.repository.findById(id);
  }

  async create(data) {
    if (!data.titulo?.trim()) {
      throw new Error("El título es obligatorio");
    }

    if (!data.videoUrl?.trim()) {
      throw new Error("La URL del vídeo es obligatoria");
    }

    return this.repository.create({
      titulo: data.titulo.trim(),
      descripcion: data.descripcion || null,
      videoUrl: data.videoUrl.trim(),
      duracionSegundos: Number(data.duracionSegundos) || 0,
      permiso: data.permiso || "B",
      profesorId: data.profesorId || null,
      activa: true,
    });
  }

  async update(id, data) {
    return this.repository.update(id, data);
  }

  async activate(id) {
    return this.repository.activate(id);
  }

  async deactivate(id) {
    return this.repository.deactivate(id);
  }
}
