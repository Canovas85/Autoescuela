import { api } from "./api";

const normalizeRole = (role) => {
  if (role === "GESTOR") {
    return "ADMINISTRATIVO";
  }

  return role;
};

const endpointByRole = {
  ALUMNO: "/dashboard/student",
  PROFESOR: "/dashboard/professor",
  ADMINISTRATIVO: "/dashboard/administrativo",
  SOPORTE: "/dashboard/soporte",
  ADMIN: "/dashboard/executive",
};

export const dashboardService = {
  normalizeRole,

  resolveEndpoint(role) {
    return endpointByRole[normalizeRole(role)] || "/dashboard/executive";
  },

  async getByRole(role) {
    const response = await api.get(this.resolveEndpoint(role));
    return response.data;
  },

  async getStudentDashboard() {
    const response = await api.get("/dashboard/student");
    return response.data;
  },
};
