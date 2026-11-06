import { render, screen, waitFor } from "@testing-library/react";

import TarifasConcepto from "../TarifasConcepto";
import { tarifasConceptoService } from "../../../services/tarifasConceptoService";

vi.mock("../../../services/tarifasConceptoService", () => ({
  tarifasConceptoService: {
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
    <div data-testid="tarifas-concepto-grid">
      {rows.map((row) => (
        <div key={row.id}>{row.concepto}</div>
      ))}
    </div>
  ),
}));

describe("TarifasConcepto", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("carga y muestra tarifas de concepto", async () => {
    tarifasConceptoService.getAll.mockResolvedValue([
      { id: "tc1", concepto: "Tasa examen", permiso: "B", activa: true },
    ]);

    render(<TarifasConcepto />);

    await waitFor(() => {
      expect(tarifasConceptoService.getAll).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText("Tarifas Concepto")).toBeInTheDocument();
    expect(screen.getByTestId("tarifas-concepto-grid")).toBeInTheDocument();
    expect(screen.getByText("Tasa examen")).toBeInTheDocument();
  });
});
