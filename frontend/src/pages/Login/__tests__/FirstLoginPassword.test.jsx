import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import FirstLoginPassword from "../FirstLoginPassword";

describe("FirstLoginPassword", () => {
  it("renderiza el formulario de primer cambio de contraseña", () => {
    render(
      <MemoryRouter>
        <FirstLoginPassword />
      </MemoryRouter>,
    );

    expect(screen.getByText("Actualización de credenciales")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Actualizar contraseña" }),
    ).toBeInTheDocument();
  });
});
