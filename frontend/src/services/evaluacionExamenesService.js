import { api } from "./api";

export const evaluacionExamenesService = {
  async getTeorico() {
    const response = await api.get("/solicitudes-examen/evaluacion", {
      params: { tipo: "TEORICO" },
    });
    return response.data;
  },

  async getPractico() {
    const response = await api.get("/solicitudes-examen/evaluacion", {
      params: { tipo: "PRACTICO" },
    });
    return response.data;
  },
};
