import { render, screen } from "@testing-library/react";

import NuevaLicencia from "../NuevaLicencia";
import { dashboardService } from "../../../services/dashboardService";

vi.mock("../../../services/dashboardService", () => ({
  dashboardService: {
    getStudentNewLicenseContext: vi.fn(),
    getStudentNewLicensePromotions: vi.fn(),
    createStudentNewLicenseEnrollment: vi.fn(),
  },
}));

describe("NuevaLicencia", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dashboardService.getStudentNewLicenseContext.mockResolvedValue({
      licenciasDisponibles: ["B"],
      licenciasObtenidas: [],
    });
    dashboardService.getStudentNewLicensePromotions.mockResolvedValue([]);
  });

  it("renderiza el formulario de solicitud de licencia", () => {
    render(<NuevaLicencia />);

    expect(screen.getByText("Nueva licencia")).toBeInTheDocument();
  });
});
