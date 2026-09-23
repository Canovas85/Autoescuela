import { api } from "./api";

export const profesoresService = {
  getAll: async () => {
    const response = await api.get("/profesores");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/profesores/${id}`);
    return response.data;
  },

  getOverview: async (id, params = {}) => {
    const response = await api.get(`/profesores/${id}/overview`, { params });
    return response.data;
  },

  create: async (data) => {
    const response = await api.post("/profesores", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/profesores/${id}`, data);
    return response.data;
  },

  activate: async (id) => {
    const response = await api.patch(`/profesores/${id}/activar`);
    return response.data;
  },

  deactivate: async (id) => {
    const response = await api.delete(`/profesores/${id}`);
    return response.data;
  },

  getDeactivationImpact: async (id) => {
    const response = await api.get(`/profesores/${id}/deactivation-impact`);
    return response.data;
  },

  deactivateWithReassignment: async (id, reasignaciones) => {
    const response = await api.post(
      `/profesores/${id}/deactivate-with-reassignment`,
      {
        reasignaciones,
      },
    );
    return response.data;
  },
};
