import { render, screen, waitFor } from "@testing-library/react";

import TestDGT from "../TestDGT";
import { matriculasService } from "../../../services/matriculasService";

vi.mock("../../../services/matriculasService", () => ({
  matriculasService: {
    getMine: vi.fn(),
  },
}));

vi.mock("../TestDGTAdmin", () => ({
  default: () => <div>Panel admin test DGT</div>,
}));

vi.mock("../TestDGTAlumno", () => ({
  default: ({ defaultLicencia }) => (
    <div>Panel alumno test DGT ({defaultLicencia})</div>
  ),
}));

vi.mock("../../../components/matricula/AccesoRestringidoMatricula", () => ({
  default: ({ matricula }) => (
    <div>Acceso restringido ({matricula?.estado || "SIN_ESTADO"})</div>
  ),
}));

const createJwt = (payload) => {
  const encodedPayload = btoa(JSON.stringify(payload));
  return `header.${encodedPayload}.signature`;
};

describe("TestDGT", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("renderiza el panel de administración sin consultar matrícula", async () => {
    localStorage.setItem("token", createJwt({ rol: "ADMIN" }));

    render(<TestDGT />);

    expect(screen.getByText("Panel admin test DGT")).toBeInTheDocument();
    expect(matriculasService.getMine).not.toHaveBeenCalled();
  });

  it("renderiza el panel de alumno cuando la matrícula está pagada", async () => {
    localStorage.setItem(
      "token",
      createJwt({ rol: "ALUMNO", licencia: "A2", id: "alumno-1" }),
    );
    matriculasService.getMine.mockResolvedValue({
      id: "matricula-1",
      estado: "PAGADA",
    });

    render(<TestDGT />);

    await waitFor(() => {
      expect(matriculasService.getMine).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText("Panel alumno test DGT (A2)")).toBeInTheDocument();
  });

  it("muestra acceso restringido cuando la matrícula no está pagada", async () => {
    localStorage.setItem("token", createJwt({ rol: "ALUMNO" }));
    matriculasService.getMine.mockResolvedValue({
      id: "matricula-2",
      estado: "PENDIENTE",
    });

    render(<TestDGT />);

    await waitFor(() => {
      expect(screen.getByText("Acceso restringido (PENDIENTE)")).toBeInTheDocument();
    });
  });
});
