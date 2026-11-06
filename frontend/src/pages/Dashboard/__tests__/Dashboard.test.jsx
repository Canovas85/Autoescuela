import { render, screen, waitFor } from "@testing-library/react";

import Dashboard from "../Dashboard";
import { dashboardService } from "../../../services/dashboardService";
import { jwtDecode } from "jwt-decode";

vi.mock("../../../services/dashboardService", () => ({
  dashboardService: {
    getByRole: vi.fn(),
  },
}));

vi.mock("jwt-decode", () => ({
  jwtDecode: vi.fn(),
}));

vi.mock("../StudentDashboard", () => ({
  default: () => <div>Dashboard alumno</div>,
}));

vi.mock("../ProfessorDashboard", () => ({
  default: () => <div>Dashboard profesor</div>,
}));

describe("Dashboard", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("carga el dashboard de alumno cuando el token indica rol ALUMNO", async () => {
    localStorage.setItem("token", "token-demo");
    jwtDecode.mockReturnValue({ rol: "ALUMNO" });
    dashboardService.getByRole.mockResolvedValue({ resumen: {} });

    render(<Dashboard />);

    await waitFor(() => {
      expect(dashboardService.getByRole).toHaveBeenCalledWith("ALUMNO");
    });

    expect(screen.getByText("Dashboard alumno")).toBeInTheDocument();
  });

  it("muestra el mensaje de error cuando falla la carga", async () => {
    localStorage.setItem("token", "token-demo");
    jwtDecode.mockReturnValue({ rol: "PROFESOR" });
    dashboardService.getByRole.mockRejectedValue({
      response: {
        data: {
          message: "Fallo cargando dashboard",
        },
      },
    });

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText("Fallo cargando dashboard")).toBeInTheDocument();
    });
  });
});
