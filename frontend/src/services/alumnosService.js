import { api } from "./api";

export const alumnosService = {
  async getAll() {
    const token = localStorage.getItem("token");

    const response = await api.get("/alumnos", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  async create(data) {
    const token = localStorage.getItem("token");

    const response = await api.post("/alumnos", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  async update(id, data) {
    const token = localStorage.getItem("token");

    const response = await api.put(`/alumnos/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },
};
