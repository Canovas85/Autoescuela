import { render, screen, waitFor } from "@testing-library/react";

import Matriculas from "../Matriculas";
import { matriculasService } from "../../../services/matriculasService";

vi.mock("../../../services/matriculasService", () => ({
  matriculasService: {
    getAll: vi.fn(),
    getById: vi.fn(),
    update: vi.fn(),
    pagar: vi.fn(),
    anular: vi.fn(),
  },
}));

vi.mock("@mui/x-data-grid", () => ({
  DataGrid: ({ rows }) => (
    <div data-testid="matriculas-grid">
      {rows.map((row) => (
        <div key={row.id}>{row.alumno?.usuario?.nombre}</div>
      ))}
    </div>
  ),
}));

describe("Matriculas", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("carga y muestra matrículas", async () => {
    matriculasService.getAll.mockResolvedValue([
      {
        id: "m1",
        alumno: { usuario: { nombre: "Alumno Demo" } },
        estado: "PENDIENTE",
      },
    ]);

    render(<Matriculas />);

    await waitFor(() => {
      expect(matriculasService.getAll).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText("Matrículas")).toBeInTheDocument();
    expect(screen.getByTestId("matriculas-grid")).toBeInTheDocument();
    expect(screen.getByText("Alumno Demo")).toBeInTheDocument();
  });
});
