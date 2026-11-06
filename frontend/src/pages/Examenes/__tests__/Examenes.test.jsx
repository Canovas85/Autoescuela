import { render, screen, waitFor } from "@testing-library/react";

import Examenes from "../Examenes";
import { evaluacionExamenesService } from "../../../services/evaluacionExamenesService";

vi.mock("../../../services/evaluacionExamenesService", () => ({
  evaluacionExamenesService: {
    getTeorico: vi.fn(),
    getPractico: vi.fn(),
  },
}));

vi.mock("@mui/x-data-grid", () => ({
  DataGrid: ({ rows }) => (
    <div data-testid="examenes-grid">
      {rows.map((row, index) => (
        <div key={row.id || index}>{row.alumnoNombre || row.id || index}</div>
      ))}
    </div>
  ),
}));

describe("Examenes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("carga exámenes teóricos y prácticos", async () => {
    evaluacionExamenesService.getTeorico.mockResolvedValue([
      { id: "e-teo-1", alumnoNombre: "Alumno Teórico" },
    ]);
    evaluacionExamenesService.getPractico.mockResolvedValue([
      { id: "e-pra-1", alumnoNombre: "Alumno Práctico" },
    ]);

    render(<Examenes />);

    await waitFor(() => {
      expect(evaluacionExamenesService.getTeorico).toHaveBeenCalledTimes(1);
      expect(evaluacionExamenesService.getPractico).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText("Exámenes")).toBeInTheDocument();
    expect(screen.getByTestId("examenes-grid")).toBeInTheDocument();
    expect(screen.getByText("Alumno Teórico")).toBeInTheDocument();
    expect(screen.getByText("Alumno Práctico")).toBeInTheDocument();
  });
});
