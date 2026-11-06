import { render, screen, waitFor } from "@testing-library/react";

import ClasesDirectoAdmin from "../ClasesDirectoAdmin";
import { clasesDirectoService } from "../../../services/clasesDirecto.service";
import { profesoresService } from "../../../services/profesoresService";

vi.mock("../../../services/clasesDirecto.service", () => ({
  clasesDirectoService: {
    getAll: vi.fn(),
    getAllAlumno: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    deactivate: vi.fn(),
    activate: vi.fn(),
  },
}));

vi.mock("../../../services/profesoresService", () => ({
  profesoresService: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}));

describe("ClasesDirectoAdmin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("carga clases en directo y profesores", async () => {
    clasesDirectoService.getAll.mockResolvedValue([]);
    profesoresService.getAll.mockResolvedValue([]);

    render(<ClasesDirectoAdmin />);

    await waitFor(() => {
      expect(clasesDirectoService.getAll).toHaveBeenCalledTimes(1);
      expect(profesoresService.getAll).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText("Gestión Clases en Directo")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Nueva Clase" })).toBeInTheDocument();
  });
});
