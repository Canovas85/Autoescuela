import { api } from "./api";

export const bonosService = {
  async getAll() {
    const response = await api.get("/bonos");
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/bonos/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await api.post("/bonos", data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/bonos/${id}`, data);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/bonos/${id}`);
    return response.data;
  },

  async activate(id) {
    const response = await api.patch(`/bonos/${id}/activar`);
    return response.data;
  },

  async deactivate(id) {
    const response = await api.patch(`/bonos/${id}/desactivar`);
    return response.data;
  },
};
