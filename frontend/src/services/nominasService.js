import { api } from "./api";

export const nominasService = {
  async getAll(params = {}) {
    const response = await api.get("/nominas", { params });
    return response.data;
  },

  async getMine(params = {}) {
    const response = await api.get("/nominas/mine", { params });
    return response.data;
  },

  async generateMonth(payload) {
    const response = await api.post("/nominas/generar", payload);
    return response.data;
  },

  async getPreview(id) {
    const response = await api.get(`/nominas/${id}/preview`);
    return response.data;
  },

  async downloadPdf(id) {
    const response = await api.get(`/nominas/${id}/pdf`, {
      responseType: "blob",
    });

    const disposition = response.headers["content-disposition"] || "";
    const match = disposition.match(/filename="?([^";]+)"?/i);

    return {
      blob: response.data,
      fileName: match?.[1] || `nomina-${id}.pdf`,
    };
  },
};
