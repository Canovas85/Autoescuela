import { api } from "./api";

export const temariosService = {
  async getAll() {
    const response = await api.get("/temarios");
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/temarios/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await api.post("/temarios", data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/temarios/${id}`, data);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/temarios/${id}`);
    return response.data;
  },
};
