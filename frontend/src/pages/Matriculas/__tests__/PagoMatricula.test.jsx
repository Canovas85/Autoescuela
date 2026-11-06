import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import PagoMatricula from "../PagoMatricula";
import { pagosService } from "../../../services/pagosService";
import { matriculasService } from "../../../services/matriculasService";

vi.mock("../../../services/pagosService", () => ({
  pagosService: {
    getMineById: vi.fn(),
    payMine: vi.fn(),
  },
}));

vi.mock("../../../services/matriculasService", () => ({
  matriculasService: {
    getMine: vi.fn(),
    pagar: vi.fn(),
  },
}));

describe("PagoMatricula", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it(
    "realiza el pago de un pago pendiente y redirige a mis pagos",
    async () => {
    pagosService.getMineById.mockResolvedValue({
      id: "pago-1",
      concepto: "Tasa examen",
      permiso: "B",
      estado: "PENDIENTE",
      importe: 130,
      alumno: {
        usuario: {
          nombre: "Ane Ruiz",
        },
      },
    });
    pagosService.payMine.mockResolvedValue({ ok: true });
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/pago-matricula?pagoId=pago-1"]}>
        <Routes>
          <Route path="/pago-matricula" element={<PagoMatricula />} />
          <Route path="/mis-pagos" element={<div>Mis pagos destino</div>} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Pago pendiente")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/titular de la tarjeta/i), {
      target: { value: "Ane Ruiz" },
    });
    fireEvent.change(screen.getByLabelText(/número de tarjeta/i), {
      target: { value: "4242424242424242" },
    });
    fireEvent.change(screen.getByLabelText(/^Caducidad$/i), {
      target: { value: "12/99" },
    });
    fireEvent.change(screen.getByLabelText(/^CVV$/i), {
      target: { value: "123" },
    });
    await user.click(screen.getByRole("button", { name: /pagar ahora/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /confirmar pago/i }),
      ).toBeInTheDocument();
    });

    await user.click(
      screen.getByRole("button", { name: /^confirmar pago$/i }),
    );

    await waitFor(() => {
      expect(pagosService.payMine).toHaveBeenCalledWith("pago-1");
    });

    expect(screen.getByText("Mis pagos destino")).toBeInTheDocument();
    },
    10000,
  );

  it("muestra validaciones y no continúa cuando el formulario es inválido", async () => {
    pagosService.getMineById.mockResolvedValue({
      id: "pago-2",
      concepto: "Tasa DGT",
      permiso: "B",
      estado: "PENDIENTE",
      importe: 90,
      alumno: {
        usuario: {
          nombre: "Alumno Test",
        },
      },
    });
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/pago-matricula?pagoId=pago-2"]}>
        <Routes>
          <Route path="/pago-matricula" element={<PagoMatricula />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Pago pendiente")).toBeInTheDocument();
    });

    await user.clear(screen.getByLabelText(/número de tarjeta/i));
    await user.clear(screen.getByLabelText(/^Caducidad$/i));
    await user.clear(screen.getByLabelText(/^CVV$/i));
    await user.click(screen.getByRole("button", { name: /pagar ahora/i }));

    expect(screen.getByText("La tarjeta debe tener 16 dígitos")).toBeInTheDocument();
    expect(screen.getByText("Formato MM/AA")).toBeInTheDocument();
    expect(pagosService.payMine).not.toHaveBeenCalled();
  });
});
