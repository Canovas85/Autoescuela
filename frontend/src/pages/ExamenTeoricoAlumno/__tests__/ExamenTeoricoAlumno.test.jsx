import { render, screen, waitFor } from "@testing-library/react";

import ExamenTeoricoAlumno from "../ExamenTeoricoAlumno";
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
    <div data-testid="examen-teorico-grid">
      {(rows || []).map((row) => (
        <div key={row.id}>{row.id}</div>
      ))}
    </div>
  ),
}));

describe("ExamenTeoricoAlumno", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("carga elegibilidad, calendario y solicitudes teóricas", async () => {
    solicitudesExamenService.getTheoreticalEligibility.mockResolvedValue({
      canRequest: false,
      licenciaObjetivo: "B",
    });
    solicitudesExamenService.getTheoreticalCalendar.mockResolvedValue({
      fechas: [],
    });
    solicitudesExamenService.getMine.mockResolvedValue([
      { id: "sol-teo-1", tipo: "TEORICO", estado: "SOLICITADO", licencia: "B" },
    ]);

    render(<ExamenTeoricoAlumno />);

    await waitFor(() => {
      expect(solicitudesExamenService.getTheoreticalEligibility).toHaveBeenCalledTimes(1);
      expect(solicitudesExamenService.getTheoreticalCalendar).toHaveBeenCalledTimes(1);
      expect(solicitudesExamenService.getMine).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText("Convocatoria examen teórico")).toBeInTheDocument();
    expect(screen.getByTestId("examen-teorico-grid")).toBeInTheDocument();
    expect(screen.getByText("sol-teo-1")).toBeInTheDocument();
  });
});
