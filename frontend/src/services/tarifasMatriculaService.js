import { api } from "./api";

export const tarifasMatriculaService = {
  async getAll() {
    const response = await api.get("/tarifas-matricula");
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/tarifas-matricula/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await api.post("/tarifas-matricula", data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/tarifas-matricula/${id}`, data);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/tarifas-matricula/${id}`);
    return response.data;
  },

  async activate(id) {
    const response = await api.patch(`/tarifas-matricula/${id}/activar`);

    return response.data;
  },

  async deactivate(id) {
    const response = await api.patch(`/tarifas-matricula/${id}/desactivar`);

    return response.data;
  },
};
