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

  async getMine() {
    const response = await api.get("/solicitudes-examen/mine");
    return response.data;
  },

  async getTheoreticalEligibility() {
    const response = await api.get(
      "/solicitudes-examen/mine/teorico/eligibilidad",
    );
    return response.data;
  },

  async getTheoreticalCalendar() {
    const response = await api.get(
      "/solicitudes-examen/mine/teorico/calendario",
    );
    return response.data;
  },

  async requestTheoreticalExam(data) {
    const response = await api.post(
      "/solicitudes-examen/mine/teorico/solicitar",
      data,
    );
    return response.data;
  },

  async getPracticalEligibility() {
    const response = await api.get(
      "/solicitudes-examen/mine/practico/eligibilidad",
    );
    return response.data;
  },

  async getPracticalCalendar() {
    const response = await api.get(
      "/solicitudes-examen/mine/practico/calendario",
    );
    return response.data;
  },

  async requestPracticalExam(data) {
    const response = await api.post(
      "/solicitudes-examen/mine/practico/solicitar",
      data,
    );
    return response.data;
  },

  async cancelPracticalRequest(id) {
    const response = await api.patch(
      `/solicitudes-examen/mine/practico/solicitudes/${id}/cancelar`,
    );
    return response.data;
  },
};
