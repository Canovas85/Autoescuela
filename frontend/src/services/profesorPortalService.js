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
};
