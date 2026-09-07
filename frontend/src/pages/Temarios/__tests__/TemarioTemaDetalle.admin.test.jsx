import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import TemarioTemaDetalle from "../TemarioTemaDetalle";
import { temariosService } from "../../../services/temariosService";

vi.mock("../../../services/temariosService", () => ({
  temariosService: {
    getById: vi.fn(),
    getMineById: vi.fn(),
    saveMiniTestResult: vi.fn(),
  },
}));

const createJwt = (payload) => {
  const encodedPayload = btoa(JSON.stringify(payload));
  return `header.${encodedPayload}.signature`;
};

describe("TemarioTemaDetalle admin access", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("usa el endpoint de administrador cuando el usuario tiene rol ADMIN", async () => {
    localStorage.setItem(
      "token",
      createJwt({ rol: "ADMIN", id: "admin-1", email: "admin@test.com" }),
    );

    temariosService.getById.mockResolvedValue({
      id: "temario-001",
      titulo: "Reglas de prioridad",
      descripcion: "Tema de prueba",
      tipoLicenciaObjetivo: "B",
      orden: 1,
      revisado: true,
      documentacionRuta: "",
      claseDirectoVideoUrl: "",
    });

    render(
      <MemoryRouter initialEntries={["/temarios/temario-001"]}>
        <Routes>
          <Route path="/temarios/:id" element={<TemarioTemaDetalle />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(temariosService.getById).toHaveBeenCalledWith("temario-001");
    });

    expect(temariosService.getMineById).not.toHaveBeenCalled();
    expect(screen.getByText("Reglas de prioridad")).toBeInTheDocument();
  });
});
