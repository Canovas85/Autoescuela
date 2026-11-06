import { render, screen, waitFor } from "@testing-library/react";

import EvaluacionExamenPractico from "../EvaluacionExamenPractico";
import { evaluacionExamenesService } from "../../../services/evaluacionExamenesService";

vi.mock("../../../services/evaluacionExamenesService", () => ({
  evaluacionExamenesService: {
    getTeorico: vi.fn(),
    getPractico: vi.fn(),
  },
}));

vi.mock("@mui/x-data-grid", () => ({
  DataGrid: ({ rows }) => (
    <div data-testid="evaluacion-practico-grid">
      {(rows || []).map((row) => (
        <div key={row.id}>{row.alumnoNombre}</div>
      ))}
    </div>
  ),
}));

describe("EvaluacionExamenPractico", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("carga y muestra evaluaciones prácticas", async () => {
    evaluacionExamenesService.getPractico.mockResolvedValue([
      { id: "pra-1", alumnoNombre: "Alumno Práctico", estado: "APROBADO" },
    ]);

    render(<EvaluacionExamenPractico />);

    await waitFor(() => {
      expect(evaluacionExamenesService.getPractico).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText("Evaluación - Examen Práctico")).toBeInTheDocument();
    expect(screen.getByTestId("evaluacion-practico-grid")).toBeInTheDocument();
    expect(screen.getByText("Alumno Práctico")).toBeInTheDocument();
  });
});
