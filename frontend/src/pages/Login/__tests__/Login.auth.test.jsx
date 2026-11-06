import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import Login from "../Login";
import { api } from "../../../services/api";

vi.mock("../../../services/api", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe("Login auth flow", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    api.get.mockResolvedValue({ data: [] });
  });

  it("inicia sesión y navega a dashboard cuando no requiere cambio de contraseña", async () => {
    api.post.mockResolvedValue({
      data: {
        token: "token-ok",
        requiereCambioPassword: false,
      },
    });
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<div>Dashboard destino</div>} />
          <Route path="/primer-login" element={<div>Primer login destino</div>} />
        </Routes>
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/^Email$/i), "alumno@test.com");
    await user.type(screen.getByLabelText(/^Contraseña$/i), "Password123");
    await user.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/auth/login", {
        email: "alumno@test.com",
        password: "Password123",
      });
    });

    expect(localStorage.getItem("token")).toBe("token-ok");
    expect(localStorage.getItem("requiresPasswordChange")).toBe("false");
    expect(screen.getByText("Dashboard destino")).toBeInTheDocument();
  });

  it("redirige a primer-login cuando el backend indica cambio obligatorio", async () => {
    api.post.mockResolvedValue({
      data: {
        token: "token-primer-acceso",
        requiereCambioPassword: true,
      },
    });
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<div>Dashboard destino</div>} />
          <Route path="/primer-login" element={<div>Primer login destino</div>} />
        </Routes>
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/^Email$/i), "admin@test.com");
    await user.type(screen.getByLabelText(/^Contraseña$/i), "Admin12345");
    await user.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(screen.getByText("Primer login destino")).toBeInTheDocument();
    });

    expect(localStorage.getItem("token")).toBe("token-primer-acceso");
    expect(localStorage.getItem("requiresPasswordChange")).toBe("true");
  });
});
