import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import MisFacturas from "../MisFacturas";
import { facturasService } from "../../../services/facturasService";
import { pagosService } from "../../../services/pagosService";

vi.mock("../../../services/facturasService", () => ({
  facturasService: {
    getAll: vi.fn(),
    getMine: vi.fn(),
    getPreview: vi.fn(),
    downloadPdf: vi.fn(),
    sendDuplicate: vi.fn(),
  },
}));

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
    <div data-testid="mis-facturas-grid">
      {rows.map((row) => (
        <div key={row.id}>{row.id}</div>
      ))}
    </div>
  ),
}));

describe("MisFacturas", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("carga y muestra facturas del alumno", async () => {
    facturasService.getMine.mockResolvedValue([{ id: "mf-1", estado: "EMITIDA" }]);

    render(
      <MemoryRouter>
        <MisFacturas />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(facturasService.getMine).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText("Mis Facturas")).toBeInTheDocument();
    expect(screen.getByTestId("mis-facturas-grid")).toBeInTheDocument();
    expect(screen.getByText("mf-1")).toBeInTheDocument();
  });
});
