import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import Temarios from "../Temarios";
import { temariosService } from "../../../services/temariosService";

vi.mock("../../../services/temariosService", () => ({
  temariosService: {
    getAll: vi.fn(),
    getMineById: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("@mui/x-data-grid", () => ({
  DataGrid: ({ rows }) => (
    <div data-testid="temarios-grid">
      {(rows || []).map((row) => (
        <div key={row.id}>{row.titulo}</div>
      ))}
    </div>
  ),
}));

describe("Temarios", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("carga el listado de temarios", async () => {
    temariosService.getAll.mockResolvedValue([
      { id: "tema-1", titulo: "Tema 1", tipoLicenciaObjetivo: ["B"], orden: 1 },
    ]);

    render(
      <MemoryRouter>
        <Temarios />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(temariosService.getAll).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText("Temarios")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Nuevo temario" })).toBeInTheDocument();
    expect(screen.getByTestId("temarios-grid")).toBeInTheDocument();
    expect(screen.getByText("Tema 1")).toBeInTheDocument();
  });
});
