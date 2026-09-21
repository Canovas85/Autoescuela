import { api } from "./api";

export const bonosService = {
  async getAll(filters = {}) {
    const params = new URLSearchParams();

    if (filters.licencia) {
      params.append("licencia", filters.licencia);
    }

    const query = params.toString();
    const response = await api.get(`/bonos${query ? `?${query}` : ""}`);
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/bonos/${id}`);
    return response.data;
  },

  async getAvailable() {
    const response = await api.get("/bonos/disponibles");
    return response.data;
  },

  async buy(id) {
    const response = await api.post(`/bonos/${id}/comprar`);
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
