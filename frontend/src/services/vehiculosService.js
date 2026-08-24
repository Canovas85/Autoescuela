import { api } from "./api";

export const vehiculosService = {
  getAll: async () => {
    const response = await api.get("/vehiculos");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/vehiculos/${id}`);
    return response.data;
  },

  create: async (formData) => {
    const response = await api.post("/vehiculos", formData);
    return response.data;
  },

  update: async (id, formData) => {
    const response = await api.put(`/vehiculos/${id}`, formData);
    return response.data;
  },

  deactivate: async (id) => {
    const response = await api.delete(`/vehiculos/${id}`);
    return response.data;
  },

  activate: async (id) => {
    const response = await api.patch(`/vehiculos/${id}/activar`);
    return response.data;
  },
};
