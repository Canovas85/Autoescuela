import { render, screen, waitFor } from "@testing-library/react";

import TarifasMatricula from "../TarifasMatricula";
import { tarifasMatriculaService } from "../../../services/tarifasMatriculaService";

vi.mock("../../../services/tarifasMatriculaService", () => ({
  tarifasMatriculaService: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    activate: vi.fn(),
    deactivate: vi.fn(),
  },
}));

vi.mock("@mui/x-data-grid", () => ({
  DataGrid: ({ rows }) => (
    <div data-testid="tarifas-matricula-grid">
      {rows.map((row) => (
        <div key={row.id}>{row.licencia}</div>
      ))}
    </div>
  ),
}));

describe("TarifasMatricula", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("carga y muestra tarifas de matrícula", async () => {
    tarifasMatriculaService.getAll.mockResolvedValue([
      { id: "tm1", licencia: "B", activa: true },
    ]);

    render(<TarifasMatricula />);

    await waitFor(() => {
      expect(tarifasMatriculaService.getAll).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText("Tarifas de Matrícula")).toBeInTheDocument();
    expect(screen.getByTestId("tarifas-matricula-grid")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
  });
});
