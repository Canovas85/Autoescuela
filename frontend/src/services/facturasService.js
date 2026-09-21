import { api } from "./api";

export const facturasService = {
  async getAll() {
    const response = await api.get("/facturas");
    return response.data;
  },

  async getMine() {
    const response = await api.get("/facturas/mine");
    return response.data;
  },

  async getPreview(id) {
    const response = await api.get(`/facturas/${id}/preview`);
    return response.data;
  },

  async downloadPdf(id) {
    const response = await api.get(`/facturas/${id}/pdf`, {
      responseType: "blob",
    });

    const disposition = response.headers["content-disposition"] || "";
    const match = disposition.match(/filename="?([^";]+)"?/i);

    return {
      blob: response.data,
      fileName: match?.[1] || `factura-${id}.pdf`,
    };
  },

  async sendDuplicate(id, email) {
    const response = await api.post(`/facturas/${id}/send-duplicate`, {
      email,
    });
    return response.data;
  },
};
