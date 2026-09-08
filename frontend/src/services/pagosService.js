import { api } from "./api";

export const pagosService = {
  async getAll() {
    const response = await api.get("/pagos");
    return response.data;
  },

  async getMine() {
    const response = await api.get("/pagos/mine");
    return response.data;
  },

  async getMineById(id) {
    const response = await api.get(`/pagos/${id}`);
    return response.data;
  },

  async payMine(id) {
    const response = await api.patch(`/pagos/${id}/pagar`);
    return response.data;
  },
};
