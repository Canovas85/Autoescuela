import { render, screen, waitFor } from "@testing-library/react";

import Pagos from "../Pagos";
import { pagosService } from "../../../services/pagosService";

vi.mock("../../../services/pagosService", () => ({
  pagosService: {
    getAll: vi.fn(),
  },
}));

vi.mock("@mui/x-data-grid", () => ({
  DataGrid: ({ rows }) => (
    <div data-testid="pagos-grid">
      {rows.map((row) => (
        <div key={row.id}>{row.concepto}</div>
      ))}
    </div>
  ),
}));

describe("Pagos", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("carga y muestra los pagos recibidos desde el servicio", async () => {
    pagosService.getAll.mockResolvedValue([
      {
        id: "pago-1",
        concepto: "Tasa examen teórico",
        estado: "PAGADO",
        convocatoriasConsumidas: 0,
        convocatoriasIncluidas: 2,
        fechaPago: "2026-01-20",
      },
    ]);

    render(<Pagos />);

    await waitFor(() => {
      expect(pagosService.getAll).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByTestId("pagos-grid")).toBeInTheDocument();
    expect(screen.getByText("Tasa examen teórico")).toBeInTheDocument();
  });

  it("muestra un error cuando falla la carga de pagos", async () => {
    pagosService.getAll.mockRejectedValue(new Error("Network error"));

    render(<Pagos />);

    await waitFor(() => {
      expect(
        screen.getByText("No se pudieron cargar los pagos"),
      ).toBeInTheDocument();
    });
  });
});
