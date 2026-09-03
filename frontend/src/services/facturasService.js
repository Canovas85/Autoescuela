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
};
