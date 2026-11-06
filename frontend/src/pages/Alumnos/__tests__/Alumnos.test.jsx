import { render, screen, waitFor } from "@testing-library/react";

import Alumnos from "../Alumnos";
import { alumnosService } from "../../../services/alumnosService";
import { profesoresService } from "../../../services/profesoresService";

vi.mock("../../../services/alumnosService", () => ({
  alumnosService: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    deactivate: vi.fn(),
    activate: vi.fn(),
    getEligiblePromotions: vi.fn(),
    getEligibleProfesores: vi.fn(),
    getById: vi.fn(),
    getExtendedSummary: vi.fn(),
  },
}));

vi.mock("../../../services/profesoresService", () => ({
  profesoresService: {
    getAll: vi.fn(),
  },
}));

vi.mock("@mui/x-data-grid", () => ({
  DataGrid: ({ rows }) => (
    <div data-testid="alumnos-grid">
      {rows.map((row) => (
        <div key={row.id}>{row.usuario?.nombre || "Sin nombre"}</div>
      ))}
    </div>
  ),
}));

describe("Alumnos", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("muestra por defecto solo alumnos activos", async () => {
    alumnosService.getAll.mockResolvedValue([
      { id: "a1", activo: true, usuario: { nombre: "Alumno Activo" } },
      { id: "a2", activo: false, usuario: { nombre: "Alumno Inactivo" } },
    ]);
    profesoresService.getAll.mockResolvedValue([]);

    render(<Alumnos />);

    await waitFor(() => {
      expect(alumnosService.getAll).toHaveBeenCalled();
    });

    expect(screen.getByText("Gestión de Alumnos")).toBeInTheDocument();
    expect(screen.getByTestId("alumnos-grid")).toBeInTheDocument();
    expect(screen.getByText("Alumno Activo")).toBeInTheDocument();
    expect(screen.queryByText("Alumno Inactivo")).not.toBeInTheDocument();
  });
});
