import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import ConvocatoriaExamen from "../ConvocatoriaExamen";
import { convocatoriasTeoricoService } from "../../../services/convocatoriasTeoricoService";

vi.mock("../../../services/convocatoriasTeoricoService", () => ({
  convocatoriasTeoricoService: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    getDeleteImpact: vi.fn(),
    getAgenda: vi.fn(),
  },
}));

vi.mock("@mui/x-data-grid", () => ({
  DataGrid: ({ rows }) => (
    <div data-testid="convocatorias-grid">
      {rows.map((row, index) => (
        <div key={row.id || index}>{row.id || `row-${index}`}</div>
      ))}
    </div>
  ),
}));

describe("ConvocatoriaExamen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("carga convocatorias y agenda mensual", async () => {
    convocatoriasTeoricoService.getAll.mockResolvedValue([{ id: "conv-1" }]);
    convocatoriasTeoricoService.getAgenda.mockResolvedValue({ convocatorias: [] });

    render(<ConvocatoriaExamen />);

    await waitFor(() => {
      expect(convocatoriasTeoricoService.getAll).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText("Convocatorias DGT de examen")).toBeInTheDocument();
    expect(screen.getByTestId("convocatorias-grid")).toBeInTheDocument();
    expect(screen.getByText("conv-1")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Agenda" }));

    await waitFor(() => {
      expect(convocatoriasTeoricoService.getAgenda).toHaveBeenCalledTimes(1);
    });
  });
});
