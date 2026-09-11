import { api } from "./api";

export const convocatoriasTeoricoService = {
  async getAll(params = {}) {
    const response = await api.get("/convocatorias-examen", { params });
    return response.data;
  },

  async create(data) {
    const response = await api.post("/convocatorias-examen", data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/convocatorias-examen/${id}`, data);
    return response.data;
  },

  async remove(id) {
    const response = await api.delete(`/convocatorias-examen/${id}`);
    return response.data;
  },

  async getAgenda(params) {
    const response = await api.get("/convocatorias-examen/agenda", { params });
    return response.data;
  },
};
