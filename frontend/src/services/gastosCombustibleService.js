import { api } from "./api";

export const gastosCombustibleService = {
  async getAll() {
    const response = await api.get("/gastos-combustible");
    return response.data;
  },

  async getMine() {
    const response = await api.get("/gastos-combustible/mine");
    return response.data;
  },

  async repostar(vehiculoId, reciboFile = null) {
    const data = new FormData();

    if (reciboFile) {
      data.append("recibo", reciboFile);
    }

    const response = await api.post(
      `/gastos-combustible/repostar/${vehiculoId}`,
      data,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );

    return response.data;
  },
};
