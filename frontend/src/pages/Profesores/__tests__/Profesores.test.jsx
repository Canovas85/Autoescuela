import { render, screen, waitFor } from "@testing-library/react";

import Profesores from "../Profesores";
import { profesoresService } from "../../../services/profesoresService";

vi.mock("../../../services/profesoresService", () => ({
  profesoresService: {
    getAll: vi.fn(),
    getById: vi.fn(),
    getOverview: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    deactivate: vi.fn(),
    activate: vi.fn(),
    getDeactivationImpact: vi.fn(),
    deactivateWithReassignment: vi.fn(),
  },
}));

vi.mock("@mui/x-data-grid", () => ({
  DataGrid: ({ rows }) => (
    <div data-testid="profesores-grid">
      {rows.map((row) => (
        <div key={row.id}>{row.usuario?.nombre || "Sin nombre"}</div>
      ))}
    </div>
  ),
}));

describe("Profesores", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("muestra por defecto solo profesores activos", async () => {
    profesoresService.getAll.mockResolvedValue([
      { id: "p1", activo: true, usuario: { nombre: "Profesor Activo" } },
      { id: "p2", activo: false, usuario: { nombre: "Profesor Inactivo" } },
    ]);

    render(<Profesores />);

    await waitFor(() => {
      expect(profesoresService.getAll).toHaveBeenCalled();
    });

    expect(screen.getByText("Gestión de Profesores")).toBeInTheDocument();
    expect(screen.getByTestId("profesores-grid")).toBeInTheDocument();
    expect(screen.getByText("Profesor Activo")).toBeInTheDocument();
    expect(screen.queryByText("Profesor Inactivo")).not.toBeInTheDocument();
  });
});
