import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import Bonos from "../Bonos";
import { bonosService } from "../../../services/bonosService";
import { jwtDecode } from "jwt-decode";

vi.mock("../../../services/bonosService", () => ({
  bonosService: {
    getAll: vi.fn(),
    getById: vi.fn(),
    getAvailable: vi.fn(),
    buy: vi.fn(),
    getMine: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    activate: vi.fn(),
    deactivate: vi.fn(),
  },
}));

vi.mock("jwt-decode", () => ({
  jwtDecode: vi.fn(),
}));

vi.mock("@mui/x-data-grid", () => ({
  DataGrid: ({ rows }) => (
    <div data-testid="bonos-grid">
      {rows.map((row) => (
        <div key={row.id}>{row.nombre}</div>
      ))}
    </div>
  ),
}));

describe("Bonos", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    jwtDecode.mockReturnValue({ rol: "ADMIN" });
  });

  it("carga bonos para rol administrativo", async () => {
    bonosService.getAll.mockResolvedValue([{ id: "b1", nombre: "Bono 10" }]);

    render(
      <MemoryRouter>
        <Bonos />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(bonosService.getAll).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText("Bonos")).toBeInTheDocument();
    expect(screen.getByTestId("bonos-grid")).toBeInTheDocument();
    expect(screen.getByText("Bono 10")).toBeInTheDocument();
  });
});
