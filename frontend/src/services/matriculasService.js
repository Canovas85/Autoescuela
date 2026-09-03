import { api } from "./api";

export const matriculasService = {
  async getMine() {
    const response = await api.get("/matriculas/mine");
    return response.data;
  },
  async getAll() {
    const response = await api.get("/matriculas");
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/matriculas/${id}`);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/matriculas/${id}`, data);

    return response.data;
  },

  async pagar(id) {
    const response = await api.patch(`/matriculas/${id}/pagar`);

    return response.data;
  },

  async anular(id) {
    const response = await api.patch(`/matriculas/${id}/anular`);

    return response.data;
  },
};
