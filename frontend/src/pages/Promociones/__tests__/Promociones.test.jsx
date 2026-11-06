import { render, screen, waitFor } from "@testing-library/react";

import Promociones from "../Promociones";
import { promocionesService } from "../../../services/promocionesService";
import { tarifasMatriculaService } from "../../../services/tarifasMatriculaService";

vi.mock("../../../services/promocionesService", () => ({
  promocionesService: {
    getAll: vi.fn(),
    getPublic: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    activate: vi.fn(),
    deactivate: vi.fn(),
  },
}));

vi.mock("../../../services/tarifasMatriculaService", () => ({
  tarifasMatriculaService: {
    getAll: vi.fn(),
  },
}));

vi.mock("@mui/x-data-grid", () => ({
  DataGrid: ({ rows }) => (
    <div data-testid="promociones-grid">
      {rows.map((row) => (
        <div key={row.id}>{row.nombre}</div>
      ))}
    </div>
  ),
}));

describe("Promociones", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("carga promociones y tarifas auxiliares", async () => {
    promocionesService.getAll.mockResolvedValue([{ id: "p1", nombre: "Promo A" }]);
    tarifasMatriculaService.getAll.mockResolvedValue([]);

    render(<Promociones />);

    await waitFor(() => {
      expect(promocionesService.getAll).toHaveBeenCalledTimes(1);
      expect(tarifasMatriculaService.getAll).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText("Promociones")).toBeInTheDocument();
    expect(screen.getByTestId("promociones-grid")).toBeInTheDocument();
    expect(screen.getByText("Promo A")).toBeInTheDocument();
  });
});
