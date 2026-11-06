import { render, screen, waitFor } from "@testing-library/react";

import OtrosUsuarios from "../OtrosUsuarios";
import { otrosUsuariosService } from "../../../services/otrosUsuariosService";
import { jwtDecode } from "jwt-decode";

vi.mock("../../../services/otrosUsuariosService", () => ({
  otrosUsuariosService: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    activate: vi.fn(),
    deactivate: vi.fn(),
    hardDelete: vi.fn(),
    resetPassword: vi.fn(),
  },
}));

vi.mock("jwt-decode", () => ({
  jwtDecode: vi.fn(),
}));

vi.mock("@mui/x-data-grid", () => ({
  DataGrid: ({ rows }) => (
    <div data-testid="otros-usuarios-grid">
      {rows.map((row) => (
        <div key={row.id}>{row.nombre}</div>
      ))}
    </div>
  ),
}));

describe("OtrosUsuarios", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    jwtDecode.mockReturnValue({ rol: "ADMIN" });
  });

  it("carga y muestra otros usuarios", async () => {
    otrosUsuariosService.getAll.mockResolvedValue([
      { id: "u1", nombre: "Soporte Uno", rol: "SOPORTE", activo: true },
    ]);

    render(<OtrosUsuarios />);

    await waitFor(() => {
      expect(otrosUsuariosService.getAll).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText("Otros Usuarios")).toBeInTheDocument();
    expect(screen.getByTestId("otros-usuarios-grid")).toBeInTheDocument();
    expect(screen.getByText("Soporte Uno")).toBeInTheDocument();
  });
});
