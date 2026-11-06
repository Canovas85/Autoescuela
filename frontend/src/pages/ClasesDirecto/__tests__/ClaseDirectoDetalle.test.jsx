import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import ClaseDirectoDetalle from "../ClaseDirectoDetalle";
import { clasesDirectoService } from "../../../services/clasesDirecto.service";

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

describe("ClaseDirectoDetalle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("carga el detalle de una clase en directo", async () => {
    clasesDirectoService.getById.mockResolvedValue({
      id: "cd-1",
      titulo: "Tema 1: Señales",
      duracionSegundos: 1800,
      videoUrl: "https://www.youtube.com/watch?v=abc123",
      profesor: { usuario: { nombre: "Profesor Demo" } },
    });

    render(
      <MemoryRouter initialEntries={["/clases-directo/cd-1"]}>
        <Routes>
          <Route path="/clases-directo/:id" element={<ClaseDirectoDetalle />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(clasesDirectoService.getById).toHaveBeenCalledWith("cd-1");
    });

    expect(screen.getByText("Tema 1: Señales")).toBeInTheDocument();
  });
});
