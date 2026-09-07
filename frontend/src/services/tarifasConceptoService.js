import { api } from "./api";

export const tarifasConceptoService = {
  async getAll(filters = {}) {
    const params = new URLSearchParams();

    if (filters.permiso) {
      params.append("permiso", filters.permiso);
    }

    if (filters.activa !== undefined) {
      params.append("activa", String(filters.activa));
    }

    const query = params.toString();
    const response = await api.get(
      `/tarifas-concepto${query ? `?${query}` : ""}`,
    );
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/tarifas-concepto/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await api.post("/tarifas-concepto", data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/tarifas-concepto/${id}`, data);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/tarifas-concepto/${id}`);
    return response.data;
  },

  async activate(id) {
    const response = await api.patch(`/tarifas-concepto/${id}/activar`);
    return response.data;
  },

  async deactivate(id) {
    const response = await api.patch(`/tarifas-concepto/${id}/desactivar`);
    return response.data;
  },
};
