import { api } from "./api";

export const preguntasDGTService = {
  async getAll() {
    const response = await api.get("/preguntas-dgt");
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/preguntas-dgt/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await api.post("/preguntas-dgt", data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/preguntas-dgt/${id}`, data);
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
