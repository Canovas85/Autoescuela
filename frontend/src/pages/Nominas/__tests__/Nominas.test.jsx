import { render, screen, waitFor } from "@testing-library/react";

import Nominas from "../Nominas";
import { nominasService } from "../../../services/nominasService";
import { jwtDecode } from "jwt-decode";

vi.mock("../../../services/nominasService", () => ({
  nominasService: {
    getAll: vi.fn(),
    getMine: vi.fn(),
    generateMonth: vi.fn(),
    getPreview: vi.fn(),
    downloadPdf: vi.fn(),
  },
}));

vi.mock("jwt-decode", () => ({
  jwtDecode: vi.fn(),
}));

vi.mock("@mui/x-data-grid", () => ({
  DataGrid: ({ rows }) => (
    <div data-testid="nominas-grid">
      {rows.map((row) => (
        <div key={row.id}>{row.id}</div>
      ))}
    </div>
  ),
}));

describe("Nominas", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    jwtDecode.mockReturnValue({ rol: "ADMIN" });
  });

  it("carga y muestra nóminas para rol autorizado", async () => {
    nominasService.getAll.mockResolvedValue([{ id: "nom-1" }]);

    render(<Nominas />);

    await waitFor(() => {
      expect(nominasService.getAll).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText("Nóminas")).toBeInTheDocument();
    expect(screen.getByTestId("nominas-grid")).toBeInTheDocument();
    expect(screen.getByText("nom-1")).toBeInTheDocument();
  });
});
