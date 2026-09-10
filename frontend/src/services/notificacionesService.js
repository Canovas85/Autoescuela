import { api } from "./api";

export const notificacionesService = {
  async getMine(soloNoLeidas = false) {
    const response = await api.get("/notificaciones/mine", {
      params: { soloNoLeidas },
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
};
