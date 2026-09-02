import { api } from "./api";

export const clasesDirectoService = {
  getAll: async () => {
    const response = await api.get("/clases-directo");
    return response.data;
  },

  getAllAlumno: async () => {
    const response = await api.get("/clases-directo/alumno");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/clases-directo/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post("/clases-directo", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/clases-directo/${id}`, data);
    return response.data;
  },

  activate: async (id) => {
    const response = await api.patch(`/clases-directo/${id}/activar`);
    return response.data;
  },

  deactivate: async (id) => {
    const response = await api.delete(`/clases-directo/${id}`);
    return response.data;
  },
};
