import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import IngresosFacturas from "../IngresosFacturas";
import { facturasService } from "../../../services/facturasService";
import { jwtDecode } from "jwt-decode";

vi.mock("../../../services/facturasService", () => ({
  facturasService: {
    getAll: vi.fn(),
    getPreview: vi.fn(),
    downloadPdf: vi.fn(),
    sendDuplicate: vi.fn(),
  },
}));

vi.mock("../../../services/matriculasService", () => ({
  matriculasService: {
    pagar: vi.fn(),
    anular: vi.fn(),
  },
}));

vi.mock("jwt-decode", () => ({
  jwtDecode: vi.fn(),
}));

vi.mock("@mui/x-data-grid", () => ({
  DataGrid: ({ rows }) => (
    <div data-testid="facturas-grid">
      {rows.map((row) => (
        <div key={row.id}>{row.id}</div>
      ))}
    </div>
  ),
}));

describe("IngresosFacturas", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    jwtDecode.mockReturnValue({ rol: "ADMIN" });
  });

  it("carga y muestra ingresos en el listado", async () => {
    facturasService.getAll.mockResolvedValue([{ id: "fact-1", estado: "EMITIDA" }]);

    render(
      <MemoryRouter>
        <IngresosFacturas />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(facturasService.getAll).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText("Ingresos y Facturas")).toBeInTheDocument();
    expect(screen.getByTestId("facturas-grid")).toBeInTheDocument();
    expect(screen.getByText("fact-1")).toBeInTheDocument();
  });

  it("muestra error cuando falla la carga de ingresos", async () => {
    facturasService.getAll.mockRejectedValue(new Error("fallo"));

    render(
      <MemoryRouter>
        <IngresosFacturas />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByText("No se pudieron cargar los ingresos"),
      ).toBeInTheDocument();
    });
  });
});
