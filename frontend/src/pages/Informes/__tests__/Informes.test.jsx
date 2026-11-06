import { render, screen, waitFor } from "@testing-library/react";

import Informes from "../Informes";
import { informesService } from "../../../services/informesService";

vi.mock("../../../services/informesService", () => ({
  informesService: {
    getAccountingReport: vi.fn(),
  },
}));

vi.mock("../../../services/facturasService", () => ({
  facturasService: {
    getAll: vi.fn(),
    getMine: vi.fn(),
    getPreview: vi.fn(),
    downloadPdf: vi.fn(),
    sendDuplicate: vi.fn(),
  },
}));

vi.mock("../../../services/nominasService", () => ({
  nominasService: {
    getAll: vi.fn(),
    getMine: vi.fn(),
    generateMonth: vi.fn(),
    getPreview: vi.fn(),
    downloadPdf: vi.fn(),
  },
}));

vi.mock("@mui/x-data-grid", () => ({
  DataGrid: ({ rows }) => (
    <div data-testid="informes-grid">
      {rows.map((row, index) => (
        <div key={row.id || index}>{row.concepto || row.id || index}</div>
      ))}
    </div>
  ),
}));

describe("Informes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("carga reporte contable inicial", async () => {
    informesService.getAccountingReport.mockResolvedValue({
      resumen: {},
      movimientos: [],
      flujoCaja: [],
      distribucionIngresos: [],
    });

    render(<Informes />);

    await waitFor(() => {
      expect(informesService.getAccountingReport).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText("Informes de contabilidad")).toBeInTheDocument();
  });
});
