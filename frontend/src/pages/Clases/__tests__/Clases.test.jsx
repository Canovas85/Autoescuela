import { render, screen, waitFor } from "@testing-library/react";

import Clases from "../Clases";
import { clasesService } from "../../../services/clasesService";
import { alumnosService } from "../../../services/alumnosService";
import { profesoresService } from "../../../services/profesoresService";
import { vehiculosService } from "../../../services/vehiculosService";

vi.mock("../../../services/clasesService", () => ({
  clasesService: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    cancel: vi.fn(),
  },
}));

vi.mock("../../../services/alumnosService", () => ({
  alumnosService: {
    getAll: vi.fn(),
  },
}));

vi.mock("../../../services/profesoresService", () => ({
  profesoresService: {
    getAll: vi.fn(),
  },
}));

vi.mock("../../../services/vehiculosService", () => ({
  vehiculosService: {
    getAll: vi.fn(),
  },
}));

vi.mock("@mui/x-data-grid", () => ({
  DataGrid: ({ rows }) => (
    <div data-testid="clases-grid">
      {rows.map((row) => (
        <div key={row.id}>{row.id}</div>
      ))}
    </div>
  ),
}));

describe("Clases", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("carga clases y renderiza el listado", async () => {
    clasesService.getAll.mockResolvedValue([{ id: "clase-1" }]);
    alumnosService.getAll.mockResolvedValue([]);
    profesoresService.getAll.mockResolvedValue([]);
    vehiculosService.getAll.mockResolvedValue([]);

    render(<Clases />);

    await waitFor(() => {
      expect(clasesService.getAll).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText("Clases")).toBeInTheDocument();
    expect(screen.getByTestId("clases-grid")).toBeInTheDocument();
    expect(screen.getByText("clase-1")).toBeInTheDocument();
  });

  it("muestra error cuando falla la carga inicial", async () => {
    clasesService.getAll.mockRejectedValue(new Error("fallo"));
    alumnosService.getAll.mockResolvedValue([]);
    profesoresService.getAll.mockResolvedValue([]);
    vehiculosService.getAll.mockResolvedValue([]);

    render(<Clases />);

    await waitFor(() => {
      expect(
        screen.getByText("No se pudieron cargar las clases"),
      ).toBeInTheDocument();
    });
  });
});
