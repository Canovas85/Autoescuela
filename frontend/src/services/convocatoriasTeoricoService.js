import { api } from "./api";

export const convocatoriasTeoricoService = {
  async getAll() {
    const response = await api.get("/convocatorias-teorico");
    return response.data;
  },

  async create(data) {
    const response = await api.post("/convocatorias-teorico", data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/convocatorias-teorico/${id}`, data);
    return response.data;
  },

  async remove(id) {
    const response = await api.delete(`/convocatorias-teorico/${id}`);
    return response.data;
  },
};
