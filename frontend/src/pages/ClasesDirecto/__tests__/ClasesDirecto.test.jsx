import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import ClasesDirecto from "../ClasesDirecto";
import { clasesDirectoService } from "../../../services/clasesDirecto.service";
import { matriculasService } from "../../../services/matriculasService";

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

vi.mock("../../../services/matriculasService", () => ({
  matriculasService: {
    getAll: vi.fn(),
    getMine: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    pagar: vi.fn(),
  },
}));

describe("ClasesDirecto", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("carga matrícula y clases en directo del alumno", async () => {
    matriculasService.getMine.mockResolvedValue({ estado: "PAGADA" });
    clasesDirectoService.getAllAlumno.mockResolvedValue([]);

    render(
      <MemoryRouter>
        <ClasesDirecto />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(matriculasService.getMine).toHaveBeenCalledTimes(1);
      expect(clasesDirectoService.getAllAlumno).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText("Clases en Directo")).toBeInTheDocument();
  });
});
