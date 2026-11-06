import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import MisPagos from "../MisPagos";
import { pagosService } from "../../../services/pagosService";

vi.mock("../../../services/pagosService", () => ({
  pagosService: {
    getAll: vi.fn(),
    getMine: vi.fn(),
    getMineById: vi.fn(),
    payMine: vi.fn(),
  },
}));

vi.mock("@mui/x-data-grid", () => ({
  DataGrid: ({ rows }) => (
    <div data-testid="mis-pagos-grid">
      {(rows || []).map((row) => (
        <div key={row.id}>{row.id}</div>
      ))}
    </div>
  ),
}));

describe("MisPagos", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("carga los pagos del alumno", async () => {
    pagosService.getMine.mockResolvedValue([{ id: "pago-1", estado: "PENDIENTE" }]);

    render(
      <MemoryRouter>
        <MisPagos />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(pagosService.getMine).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText("Mis Pagos")).toBeInTheDocument();
    expect(screen.getByTestId("mis-pagos-grid")).toBeInTheDocument();
    expect(screen.getByText("pago-1")).toBeInTheDocument();
  });
});
