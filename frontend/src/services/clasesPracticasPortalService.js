import { api } from "./api";

export const clasesPracticasPortalService = {
  async getStudentEligibility() {
    const response = await api.get("/clases/mine/student/eligibility");
    return response.data;
  },

  async getStudentBookingContext(weekOffset = 0) {
    const response = await api.get("/clases/mine/student/booking-context", {
      params: { weekOffset },
    });
    return response.data;
  },

  async createStudentRequest(data) {
    const response = await api.post("/clases/mine/student/request", data);
    return response.data;
  },

  async cancelStudentRequest(classId) {
    const response = await api.patch(`/clases/mine/student/${classId}/cancel`);
    return response.data;
  },

  async getProfessorRequests() {
    const response = await api.get("/clases/mine/professor/requests");
    return response.data;
  },

  async confirmProfessorRequest(classId) {
    const response = await api.patch(
      `/clases/mine/professor/${classId}/confirm`,
    );
    return response.data;
  },

  async cancelProfessorRequest(classId) {
    const response = await api.patch(
      `/clases/mine/professor/${classId}/cancel`,
    );
    return response.data;
  },
};
