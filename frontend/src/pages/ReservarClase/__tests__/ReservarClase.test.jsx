import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import ReservarClase from "../ReservarClase";
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

describe("ReservarClase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("carga el contexto de reserva de clases prácticas", async () => {
    clasesPracticasPortalService.getStudentBookingContext.mockResolvedValue({
      elegibilidad: {
        permitido: false,
        bloqueos: [],
        vidas: { disponibles: 0 },
        tiposClaseDisponibles: ["CIRCULACION"],
      },
      calendarioSemana: {
        inicio: "2026-11-02",
        fin: "2026-11-08",
        profesor: { nombre: "Profesor Demo" },
        dias: [],
      },
      pago: {
        precioClase: 35,
        bonosDisponibles: [],
      },
      solicitudesPendientes: [],
      proximasClases: [],
    });

    render(
      <MemoryRouter>
        <ReservarClase />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        clasesPracticasPortalService.getStudentBookingContext,
      ).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText("Solicitud de clase práctica")).toBeInTheDocument();
  });
});
