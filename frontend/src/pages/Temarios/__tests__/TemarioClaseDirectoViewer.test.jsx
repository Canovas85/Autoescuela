import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import TemarioClaseDirectoViewer from "../TemarioClaseDirectoViewer";
import { temariosService } from "../../../services/temariosService";
import { jwtDecode } from "jwt-decode";

vi.mock("jwt-decode", () => ({
  jwtDecode: vi.fn(),
}));

vi.mock("../../../services/temariosService", () => ({
  temariosService: {
    getAll: vi.fn(),
    getMineById: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("TemarioClaseDirectoViewer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    localStorage.setItem("token", "token-demo");
  });

  it("carga clase en directo para alumno", async () => {
    jwtDecode.mockReturnValue({ rol: "ALUMNO" });
    temariosService.getMineById.mockResolvedValue({
      id: "tema-1",
      titulo: "Tema 1",
      descripcion: "Descripción",
      claseDirectoVideoUrl: "https://www.youtube.com/watch?v=abc123",
    });

    render(
      <MemoryRouter initialEntries={["/temario-clase/tema-1"]}>
        <Routes>
          <Route path="/temario-clase/:id" element={<TemarioClaseDirectoViewer />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(temariosService.getMineById).toHaveBeenCalledWith("tema-1");
    });

    expect(screen.getByText("Volver al tema")).toBeInTheDocument();
    expect(screen.getByText("Tema 1")).toBeInTheDocument();
  });
});
