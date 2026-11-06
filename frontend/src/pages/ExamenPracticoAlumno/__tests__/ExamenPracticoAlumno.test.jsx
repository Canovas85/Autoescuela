import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import ExamenPracticoAlumno from "../ExamenPracticoAlumno";
import { solicitudesExamenService } from "../../../services/solicitudesExamenService";

vi.mock("../../../services/solicitudesExamenService", () => ({
  solicitudesExamenService: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    resolve: vi.fn(),
    remove: vi.fn(),
    getTheoreticalEligibility: vi.fn(),
    getTheoreticalCalendar: vi.fn(),
    getPracticalEligibility: vi.fn(),
    getPracticalCalendar: vi.fn(),
    requestTheoreticalExam: vi.fn(),
    requestPracticalExam: vi.fn(),
    getMine: vi.fn(),
    cancelMine: vi.fn(),
  },
}));

vi.mock("@mui/x-data-grid", () => ({
  DataGrid: ({ rows }) => (
    <div data-testid="examen-practico-grid">
      {(rows || []).map((row) => (
        <div key={row.id}>{row.id}</div>
      ))}
    </div>
  ),
}));

describe("ExamenPracticoAlumno", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("carga elegibilidad, calendario y solicitudes prácticas", async () => {
    solicitudesExamenService.getPracticalEligibility.mockResolvedValue({
      canRequest: false,
      canPickDate: true,
      licenciaObjetivo: "B",
      usesDualPracticalPhase: false,
    });
    solicitudesExamenService.getPracticalCalendar.mockResolvedValue({
      fechas: [],
    });
    solicitudesExamenService.getMine.mockResolvedValue([
      { id: "sol-pra-1", tipo: "PRACTICO", estado: "SOLICITADO", licencia: "B" },
    ]);

    render(
      <MemoryRouter>
        <ExamenPracticoAlumno />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(solicitudesExamenService.getPracticalEligibility).toHaveBeenCalledTimes(1);
      expect(solicitudesExamenService.getPracticalCalendar).toHaveBeenCalledTimes(1);
      expect(solicitudesExamenService.getMine).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText("Convocatoria examen práctico")).toBeInTheDocument();
    expect(screen.getByTestId("examen-practico-grid")).toBeInTheDocument();
    expect(screen.getByText("sol-pra-1")).toBeInTheDocument();
  });
});
