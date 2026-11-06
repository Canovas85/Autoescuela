import { render, screen, waitFor } from "@testing-library/react";

import ProfesorAgenda from "../ProfesorAgenda";
import { profesorPortalService } from "../../../services/profesorPortalService";
import { clasesPracticasPortalService } from "../../../services/clasesPracticasPortalService";

vi.mock("../../../services/profesorPortalService", () => ({
  profesorPortalService: {
    getStudents: vi.fn(),
    getStudentDetail: vi.fn(),
    getVehicles: vi.fn(),
    getVehicleSchedule: vi.fn(),
    getAgenda: vi.fn(),
    updateWorkSchedule: vi.fn(),
    updateClassStatus: vi.fn(),
  },
}));

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

describe("ProfesorAgenda", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("carga agenda semanal y clases del profesor", async () => {
    profesorPortalService.getAgenda.mockResolvedValue({
      semana: { inicio: "2026-11-02", fin: "2026-11-08" },
      horario: [],
      clases: [],
    });
    clasesPracticasPortalService.getProfessorRequests.mockResolvedValue([]);

    render(<ProfesorAgenda />);

    await waitFor(() => {
      expect(profesorPortalService.getAgenda).toHaveBeenCalledTimes(1);
      expect(
        clasesPracticasPortalService.getProfessorRequests,
      ).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText("Mi agenda")).toBeInTheDocument();
  });
});
