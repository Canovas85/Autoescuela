import { api } from "./api";

export const notificacionesService = {
  async getMine(soloNoLeidas = false, incluirArchivadas = false) {
    const response = await api.get("/notificaciones/mine", {
      params: { soloNoLeidas, incluirArchivadas },
    });
    return response.data;
  },

  async markAsRead(id) {
    const response = await api.patch(`/notificaciones/${id}/read`);
    return response.data;
  },

  async markAllAsRead() {
    const response = await api.patch("/notificaciones/mine/read-all");
    return response.data;
  },

  async archive(id) {
    const response = await api.patch(`/notificaciones/${id}/archive`);
    return response.data;
  },

  async unarchive(id) {
    const response = await api.patch(`/notificaciones/${id}/unarchive`);
    return response.data;
  },

  createStream() {
    const token = localStorage.getItem("token") || "";

    if (!token) {
      return null;
    }

    const basePath = (import.meta.env.VITE_API_BASE_URL || "/api").replace(
      /\/$/,
      "",
    );

    return new EventSource(
      `${basePath}/notificaciones/stream?token=${encodeURIComponent(token)}`,
    );
  },
};
