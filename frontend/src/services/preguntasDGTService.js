import { api } from "./api";

const buildFormData = (pregunta, imagenFile = null, eliminarImagen = false) => {
  const data = new FormData();

  data.append("enunciado", pregunta.enunciado || "");
  data.append("explicacion", pregunta.explicacion || "");
  data.append("activa", String(pregunta.activa ?? true));
  data.append("licencia", JSON.stringify(pregunta.licencia || []));
  data.append("respuestas", JSON.stringify(pregunta.respuestas || []));

  if (imagenFile) {
    data.append("imagen", imagenFile);
  }

  if (eliminarImagen) {
    data.append("eliminarImagen", "true");
  }

  return data;
};

export const preguntasDGTService = {
  async getAll() {
    const response = await api.get("/preguntas-dgt");
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/preguntas-dgt/${id}`);
    return response.data;
  },

  async create(data, imagenFile = null) {
    const body = buildFormData(data, imagenFile, false);
    const response = await api.post("/preguntas-dgt", body);
    return response.data;
  },

  async update(id, data, imagenFile = null, eliminarImagen = false) {
    const body = buildFormData(data, imagenFile, eliminarImagen);
    const response = await api.put(`/preguntas-dgt/${id}`, body);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/preguntas-dgt/${id}`);
    return response.data;
  },

  async activate(id) {
    const response = await api.patch(`/preguntas-dgt/${id}/activar`);
    return response.data;
  },

  async deactivate(id) {
    const response = await api.patch(`/preguntas-dgt/${id}/desactivar`);
    return response.data;
  },

  async generarExamen(licencia) {
    const response = await api.post("/preguntas-dgt/generar-examen", {
      licencia,
    });
    return response.data;
  },

  async corregirExamen(data) {
    const response = await api.post("/preguntas-dgt/corregir-examen", data);
    return response.data;
  },
};
