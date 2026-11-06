import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import Notificaciones from "../Notificaciones";
import { notificacionesService } from "../../../services/notificacionesService";
import { jwtDecode } from "jwt-decode";

vi.mock("../../../services/notificacionesService", () => ({
  notificacionesService: {
    getMine: vi.fn(),
    markAsRead: vi.fn(),
    markAllAsRead: vi.fn(),
    archive: vi.fn(),
    unarchive: vi.fn(),
    createStream: vi.fn(),
  },
}));

vi.mock("jwt-decode", () => ({
  jwtDecode: vi.fn(),
}));

describe("Notificaciones", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    jwtDecode.mockReturnValue({ rol: "ADMIN" });
    notificacionesService.createStream.mockReturnValue(null);
  });

  it("carga y muestra notificaciones del usuario", async () => {
    notificacionesService.getMine.mockResolvedValue([
      {
        id: "n1",
        tipo: "INFO",
        titulo: "Aviso de prueba",
        mensaje: "Contenido",
        leida: false,
        archivada: false,
        createdAt: "2026-11-06T08:00:00.000Z",
        metadata: {},
      },
    ]);

    render(
      <MemoryRouter>
        <Notificaciones />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(notificacionesService.getMine).toHaveBeenCalled();
    });

    expect(screen.getByText("Notificaciones")).toBeInTheDocument();
    expect(screen.getByText("Aviso de prueba")).toBeInTheDocument();
  });
});
