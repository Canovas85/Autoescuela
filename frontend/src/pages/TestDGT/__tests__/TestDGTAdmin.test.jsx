import { render, screen, waitFor } from "@testing-library/react";

import TestDGTAdmin from "../TestDGTAdmin";
import { preguntasDGTService } from "../../../services/preguntasDGTService";

vi.mock("../../../services/preguntasDGTService", () => ({
  preguntasDGTService: {
    getAll: vi.fn(),
    getNextId: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    activate: vi.fn(),
    deactivate: vi.fn(),
    importFromExcel: vi.fn(),
    generarExamen: vi.fn(),
    corregirExamen: vi.fn(),
  },
}));

vi.mock("@mui/x-data-grid", () => ({
  DataGrid: ({ rows }) => (
    <div data-testid="test-dgt-admin-grid">
      {(rows || []).map((row) => (
        <div key={row.id}>{row.id}</div>
      ))}
    </div>
  ),
}));

describe("TestDGTAdmin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("carga el banco de preguntas DGT", async () => {
    preguntasDGTService.getAll.mockResolvedValue([{ id: "preg-1", respuestas: [] }]);
    preguntasDGTService.getNextId.mockResolvedValue({ id: "PREG-999" });

    render(<TestDGTAdmin />);

    await waitFor(() => {
      expect(preguntasDGTService.getAll).toHaveBeenCalledTimes(1);
      expect(preguntasDGTService.getNextId).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText("Banco de preguntas DGT")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Nueva pregunta" })).toBeInTheDocument();
    expect(screen.getByTestId("test-dgt-admin-grid")).toBeInTheDocument();
  });
});
