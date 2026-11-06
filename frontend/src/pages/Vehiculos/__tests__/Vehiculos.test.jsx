import { render, screen, waitFor } from "@testing-library/react";

import Vehiculos from "../Vehiculos";
import { vehiculosService } from "../../../services/vehiculosService";

vi.mock("../../../services/vehiculosService", () => ({
  vehiculosService: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    deactivate: vi.fn(),
    getDeactivationImpact: vi.fn(),
    deactivateWithReassignment: vi.fn(),
    activate: vi.fn(),
    payItv: vi.fn(),
  },
}));

vi.mock("@mui/x-data-grid", () => ({
  DataGrid: ({ rows }) => (
    <div data-testid="vehiculos-grid">
      {rows.map((row) => (
        <div key={row.id}>{row.matricula}</div>
      ))}
    </div>
  ),
}));

describe("Vehiculos", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("carga y muestra vehículos", async () => {
    vehiculosService.getAll.mockResolvedValue([
      { id: "v1", matricula: "1234ABC", activo: true },
    ]);

    render(<Vehiculos />);

    await waitFor(() => {
      expect(vehiculosService.getAll).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText("Gestión de Vehículos")).toBeInTheDocument();
    expect(screen.getByTestId("vehiculos-grid")).toBeInTheDocument();
    expect(screen.getByText("1234ABC")).toBeInTheDocument();
  });
});
