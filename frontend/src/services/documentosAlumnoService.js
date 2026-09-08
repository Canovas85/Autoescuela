import { api } from "./api";

export const documentosAlumnoService = {
  getMine: async () => {
    const response = await api.get("/documentos-alumno");
    return response.data;
  },

  getAllAdmin: async () => {
    const response = await api.get("/documentos-alumno/admin");
    return response.data;
  },

  create: async (formData) => {
    const response = await api.post("/documentos-alumno", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  update: async (id, formData) => {
    const response = await api.put(`/documentos-alumno/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  remove: async (id) => {
    const response = await api.delete(`/documentos-alumno/${id}`);
    return response.data;
  },

  validate: async (id, estado) => {
    const response = await api.patch(`/documentos-alumno/${id}/validar`, {
      estado,
    });
    return response.data;
  },
};
