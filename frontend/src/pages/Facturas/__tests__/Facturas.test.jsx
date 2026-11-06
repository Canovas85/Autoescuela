import { render, screen, waitFor } from "@testing-library/react";

import Facturas from "../Facturas";
import { facturasService } from "../../../services/facturasService";

vi.mock("../../../services/facturasService", () => ({
  facturasService: {
    getAll: vi.fn(),
    getMine: vi.fn(),
    getPreview: vi.fn(),
    downloadPdf: vi.fn(),
    sendDuplicate: vi.fn(),
  },
}));

vi.mock("@mui/x-data-grid", () => ({
  DataGrid: ({ rows }) => (
    <div data-testid="facturas-grid">
      {(rows || []).map((row) => (
        <div key={row.id}>{row.id}</div>
      ))}
    </div>
  ),
}));

describe("Facturas", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("carga las facturas administrativas", async () => {
    facturasService.getAll.mockResolvedValue([
      { id: "fac-1", estado: "EMITIDA", total: 100, alumno: { usuario: {} } },
    ]);

    render(<Facturas />);

    await waitFor(() => {
      expect(facturasService.getAll).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText("Facturas")).toBeInTheDocument();
    expect(screen.getByTestId("facturas-grid")).toBeInTheDocument();
    expect(screen.getByText("fac-1")).toBeInTheDocument();
  });
});
