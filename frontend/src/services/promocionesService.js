import { api } from "./api";

const buildFormData = (promocion, imagenFile, eliminarImagen) => {
  const data = new FormData();

  Object.entries(promocion).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          data.append(key, item);
        });
      } else {
        data.append(key, value);
      }
    }
  });

  if (imagenFile) {
    data.append("imagen", imagenFile);
  }

  if (eliminarImagen) {
    data.append("eliminarImagen", "true");
  }

  return data;
};

export const promocionesService = {
  async getAll() {
    const response = await api.get("/promociones");
    return response.data;
  },

  async getPublic() {
    const response = await api.get("/promociones/public");
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/promociones/${id}`);
    return response.data;
  },

  async create(promocion, imagenFile = null) {
    const data = buildFormData(promocion, imagenFile, false);

    const response = await api.post("/promociones", data);

    return response.data;
  },

  async update(id, promocion, imagenFile = null, eliminarImagen = false) {
    const data = buildFormData(promocion, imagenFile, eliminarImagen);

    const response = await api.put(`/promociones/${id}`, data);

    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/promociones/${id}`);
    return response.data;
  },

  async activate(id) {
    const response = await api.patch(`/promociones/${id}/activar`);
    return response.data;
  },

  async deactivate(id) {
    const response = await api.patch(`/promociones/${id}/desactivar`);
    return response.data;
  },
};
