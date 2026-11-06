import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import AccountActivation from "../AccountActivation";
import { api } from "../../../services/api";

vi.mock("../../../services/api", () => ({
  api: {
    post: vi.fn(),
  },
}));

describe("AccountActivation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("muestra error cuando no llega token en la URL", async () => {
    render(
      <MemoryRouter initialEntries={["/activar-cuenta"]}>
        <Routes>
          <Route path="/activar-cuenta" element={<AccountActivation />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByText("El enlace de activación no contiene token."),
      ).toBeInTheDocument();
    });

    expect(api.post).not.toHaveBeenCalled();
  });

  it("valida token y completa activación con nueva contraseña", async () => {
    api.post
      .mockResolvedValueOnce({ data: { ok: true } })
      .mockResolvedValueOnce({ data: { ok: true } });
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/activar-cuenta?token=token-demo"]}>
        <Routes>
          <Route path="/activar-cuenta" element={<AccountActivation />} />
          <Route path="/" element={<div>Pantalla login</div>} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/auth/activacion/validar", {
        token: "token-demo",
      });
    });

    await user.type(
      screen.getByLabelText(/^nueva contraseña$/i),
      "Password123",
    );
    await user.type(
      screen.getByLabelText(/^confirmar nueva contraseña$/i),
      "Password123",
    );
    await user.click(screen.getByRole("button", { name: /activar cuenta/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/auth/activacion/completar", {
        token: "token-demo",
        newPassword: "Password123",
        confirmPassword: "Password123",
      });
    });

    expect(
      screen.getByText(
        "Cuenta activada correctamente. Ya puedes iniciar sesión con tu nueva contraseña.",
      ),
    ).toBeInTheDocument();
  });
});
