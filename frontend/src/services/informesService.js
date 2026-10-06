import { api } from "./api";

export const informesService = {
  async getAccountingReport(params = {}) {
    const response = await api.get("/informes/accounting", { params });
    return response.data;
  },
};
