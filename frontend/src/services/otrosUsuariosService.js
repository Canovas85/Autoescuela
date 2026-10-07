import { api } from "./api";

export const otrosUsuariosService = {
  getAll: async (params = {}) => {
    const response = await api.get("/otros-usuarios", { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/otros-usuarios/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post("/otros-usuarios", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/otros-usuarios/${id}`, data);
    return response.data;
  },

  activate: async (id) => {
    const response = await api.patch(`/otros-usuarios/${id}/activar`);
    return response.data;
  },

  deactivate: async (id) => {
    const response = await api.delete(`/otros-usuarios/${id}`);
    return response.data;
  },

  resetPassword: async (id, payload = {}) => {
    const response = await api.patch(
      `/otros-usuarios/${id}/reset-password`,
      payload,
    );
    return response.data;
  },
};
