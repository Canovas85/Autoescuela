import { render, screen, waitFor } from "@testing-library/react";

import EvaluacionExamenTeorico from "../EvaluacionExamenTeorico";
import { evaluacionExamenesService } from "../../../services/evaluacionExamenesService";

vi.mock("../../../services/evaluacionExamenesService", () => ({
  evaluacionExamenesService: {
    getTeorico: vi.fn(),
    getPractico: vi.fn(),
  },
}));

vi.mock("@mui/x-data-grid", () => ({
  DataGrid: ({ rows }) => (
    <div data-testid="evaluacion-teorico-grid">
      {(rows || []).map((row) => (
        <div key={row.id}>{row.alumnoNombre}</div>
      ))}
    </div>
  ),
}));

describe("EvaluacionExamenTeorico", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("carga y muestra evaluaciones teóricas", async () => {
    evaluacionExamenesService.getTeorico.mockResolvedValue([
      { id: "teo-1", alumnoNombre: "Alumno Teórico", estado: "APROBADO" },
    ]);

    render(<EvaluacionExamenTeorico />);

    await waitFor(() => {
      expect(evaluacionExamenesService.getTeorico).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText("Evaluación - Examen Teórico")).toBeInTheDocument();
    expect(screen.getByTestId("evaluacion-teorico-grid")).toBeInTheDocument();
    expect(screen.getByText("Alumno Teórico")).toBeInTheDocument();
  });
});
