import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import ClasesPracticasProfesor from "../ClasesPracticasProfesor";
import { clasesPracticasPortalService } from "../../../services/clasesPracticasPortalService";

vi.mock("../../../services/clasesPracticasPortalService", () => ({
  clasesPracticasPortalService: {
    getStudentEligibility: vi.fn(),
    getStudentBookingContext: vi.fn(),
    createStudentRequest: vi.fn(),
    cancelStudentRequest: vi.fn(),
    getProfessorRequests: vi.fn(),
    confirmProfessorRequest: vi.fn(),
    cancelProfessorRequest: vi.fn(),
  },
}));

describe("ClasesPracticasProfesor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("carga solicitudes de clases prácticas", async () => {
    clasesPracticasPortalService.getProfessorRequests.mockResolvedValue([]);

    render(
      <MemoryRouter>
        <ClasesPracticasProfesor />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        clasesPracticasPortalService.getProfessorRequests,
      ).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText("Clases prácticas")).toBeInTheDocument();
  });
});
