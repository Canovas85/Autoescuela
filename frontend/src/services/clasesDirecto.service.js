import { api } from "./api";

export const clasesDirectoService = {
  getAll: async () => {
    const response = await api.get("/clases-directo");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/clases-directo/${id}`);
    return response.data;
  },
};
