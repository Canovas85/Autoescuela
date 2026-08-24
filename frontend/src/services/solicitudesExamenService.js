import { api } from "./api";

export const solicitudesExamenService = {
  async getAll() {
    const response = await api.get("/solicitudes-examen");
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/solicitudes-examen/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await api.post("/solicitudes-examen", data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/solicitudes-examen/${id}`, data);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/solicitudes-examen/${id}`);
    return response.data;
  },
};
