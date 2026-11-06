import { render, screen, waitFor } from "@testing-library/react";

import Gastos from "../Gastos";
import { gastosCombustibleService } from "../../../services/gastosCombustibleService";
import { jwtDecode } from "jwt-decode";

vi.mock("../../../services/gastosCombustibleService", () => ({
  gastosCombustibleService: {
    getAll: vi.fn(),
    getMine: vi.fn(),
    repostar: vi.fn(),
    pagarRevisionItv: vi.fn(),
  },
}));

vi.mock("jwt-decode", () => ({
  jwtDecode: vi.fn(),
}));

vi.mock("@mui/x-data-grid", () => ({
  DataGrid: ({ rows }) => (
    <div data-testid="gastos-grid">
      {rows.map((row) => (
        <div key={row.id}>{row.numeroFactura}</div>
      ))}
    </div>
  ),
}));

describe("Gastos", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("token", "token-demo");
    vi.clearAllMocks();
    jwtDecode.mockReturnValue({ rol: "ADMIN" });
  });

  it("carga gastos globales para perfil administrativo", async () => {
    gastosCombustibleService.getAll.mockResolvedValue([
      { id: "g1", numeroFactura: "FAC-001" },
    ]);

    render(<Gastos />);

    await waitFor(() => {
      expect(gastosCombustibleService.getAll).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText("Gastos")).toBeInTheDocument();
    expect(screen.getByTestId("gastos-grid")).toBeInTheDocument();
    expect(screen.getByText("FAC-001")).toBeInTheDocument();
  });
});
