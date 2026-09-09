import { api } from "./api";

export const profesorPortalService = {
  async getStudents() {
    const response = await api.get("/dashboard/professor/students");
    return response.data;
  },

  async getStudentDetail(alumnoId) {
    const response = await api.get(`/dashboard/professor/students/${alumnoId}`);
    return response.data;
  },

  async getVehicles() {
    const response = await api.get("/dashboard/professor/vehicles");
    return response.data;
  },

  async getVehicleSchedule(vehiculoId) {
    const response = await api.get(
      `/dashboard/professor/vehicles/${vehiculoId}/schedule`,
    );
    return response.data;
  },

  async getAgenda(weekOffset = 0) {
    const response = await api.get("/dashboard/professor/agenda", {
      params: { weekOffset },
    });
    return response.data;
  },

  async updateWorkSchedule(bloques) {
    const response = await api.put("/dashboard/professor/work-schedule", {
      bloques,
    });
    return response.data;
  },

  async updateClassStatus(classId, estado) {
    const response = await api.patch(
      `/dashboard/professor/classes/${classId}/status`,
      { estado },
    );
    return response.data;
  },
};
