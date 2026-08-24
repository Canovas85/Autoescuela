import { api } from "./api";

export const examenesService = {
  async getAll() {
    const response = await api.get("/examenes");
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/examenes/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await api.post("/examenes", data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/examenes/${id}`, data);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/examenes/${id}`);
    return response.data;
  },

  async registerResult(id, estado) {
    const response = await api.patch(`/examenes/${id}/resultado`, { estado });
    return response.data;
  },
};
