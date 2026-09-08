import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import TemarioAlumno from "../TemarioAlumno";
import { temariosService } from "../../../services/temariosService";
import { matriculasService } from "../../../services/matriculasService";

vi.mock("../../../services/temariosService", () => ({
  temariosService: {
    getMine: vi.fn(),
  },
}));

vi.mock("../../../services/matriculasService", () => ({
  matriculasService: {
    getMine: vi.fn(),
  },
}));

describe("TemarioAlumno navigation", () => {
  it("navega a detalle al pulsar Entrar al tema", async () => {
    matriculasService.getMine.mockResolvedValue({
      id: "matricula-1",
      estado: "PAGADA",
    });

    temariosService.getMine.mockResolvedValue([
      {
        id: "temario-001",
        titulo: "Señales de circulación",
        descripcion: "Tema base",
        tipoLicenciaObjetivo: "B",
        orden: 1,
        revisado: false,
      },
    ]);

    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/temario"]}>
        <Routes>
          <Route path="/temario" element={<TemarioAlumno />} />
          <Route path="/temario/:id" element={<div>Detalle del tema</div>} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Señales de circulación")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /entrar al tema/i }));

    expect(screen.getByText("Detalle del tema")).toBeInTheDocument();
  });
});
