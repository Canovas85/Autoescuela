import { api } from "./api";

export const clasesService = {
  async getAll() {
    const response = await api.get("/clases");
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/clases/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await api.post("/clases", data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/clases/${id}`, data);
    return response.data;
  },

  async cancel(id) {
    const response = await api.delete(`/clases/${id}`);
    return response.data;
  },
};
