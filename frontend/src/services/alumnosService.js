import { api } from "./api";

export const alumnosService = {
  async getAll(includeInactive = false) {
    const token = localStorage.getItem("token");

    const response = await api.get(
      `/alumnos?includeInactive=${includeInactive}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

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

  async deactivate(id) {
    const token = localStorage.getItem("token");

    const response = await api.delete(`/alumnos/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  async activate(id) {
    const token = localStorage.getItem("token");

    const response = await api.patch(`/alumnos/${id}/activar`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },
};
