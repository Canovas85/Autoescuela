import { api } from "./api";

export const hojasRutaService = {
  async getFaultCatalog() {
    const response = await api.get("/hojas-ruta/catalogo-faltas");
    return response.data;
  },

  async getProfessorDashboard(params = {}) {
    const response = await api.get("/hojas-ruta/mine/profesor", { params });
    return response.data;
  },

  async getProfessorRoadmapDetail(claseId) {
    const response = await api.get(`/hojas-ruta/mine/profesor/${claseId}`);
    return response.data;
  },

  async saveProfessorDraft(claseId, data) {
    const response = await api.put(
      `/hojas-ruta/mine/profesor/${claseId}/borrador`,
      data,
    );
    return response.data;
  },

  async finalizeProfessorRoadmap(claseId, data) {
    const response = await api.put(
      `/hojas-ruta/mine/profesor/${claseId}/finalizar`,
      data,
    );
    return response.data;
  },

  async getAdminProfessorsSummary(params = {}) {
    const response = await api.get("/hojas-ruta/admin/profesores", { params });
    return response.data;
  },

  async getAdminStudentsByProfessor(profesorId, params = {}) {
    const response = await api.get(
      `/hojas-ruta/admin/profesores/${profesorId}/alumnos`,
      {
        params,
      },
    );
    return response.data;
  },

  async getAdminRegisteredRoadmapsByStudent(profesorId, alumnoId, params = {}) {
    const response = await api.get(
      `/hojas-ruta/admin/profesores/${profesorId}/alumnos/${alumnoId}/hojas`,
      {
        params,
      },
    );
    return response.data;
  },

  async getAdminRoadmapDetail(roadmapId) {
    const response = await api.get(`/hojas-ruta/admin/hojas/${roadmapId}`);
    return response.data;
  },

  async getStudentRegisteredRoadmaps(params = {}) {
    const response = await api.get("/hojas-ruta/mine/alumno", { params });
    return response.data;
  },

  async getStudentRoadmapDetail(roadmapId) {
    const response = await api.get(`/hojas-ruta/mine/alumno/${roadmapId}`);
    return response.data;
  },
};
