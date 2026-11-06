import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SolicitudesExamen from "../SolicitudesExamen";
import { solicitudesExamenService } from "../../../services/solicitudesExamenService";
import { alumnosService } from "../../../services/alumnosService";

vi.mock("../../../services/solicitudesExamenService", () => ({
  solicitudesExamenService: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("../../../services/alumnosService", () => ({
  alumnosService: {
    getAll: vi.fn(),
  },
}));

vi.mock("@mui/x-data-grid", () => ({
  DataGrid: ({ rows }) => (
    <div data-testid="solicitudes-grid">
      {rows.map((row) => (
        <div key={row.id}>{row.alumno?.usuario?.nombre || "Sin alumno"}</div>
      ))}
    </div>
  ),
}));

describe("SolicitudesExamen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("carga y muestra solicitudes existentes", async () => {
    solicitudesExamenService.getAll.mockResolvedValue([
      {
        id: "sol-1",
        tipo: "TEORICO",
        estado: "PENDIENTE",
        alumno: { usuario: { nombre: "Ane Ruiz" } },
      },
    ]);
    alumnosService.getAll.mockResolvedValue([]);

    render(<SolicitudesExamen />);

    await waitFor(() => {
      expect(solicitudesExamenService.getAll).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByTestId("solicitudes-grid")).toBeInTheDocument();
    expect(screen.getByText("Ane Ruiz")).toBeInTheDocument();
  });

  it("crea una solicitud nueva desde el diálogo", async () => {
    solicitudesExamenService.getAll.mockResolvedValue([]);
    solicitudesExamenService.create.mockResolvedValue({ id: "sol-2" });
    alumnosService.getAll.mockResolvedValue([
      {
        id: "alu-1",
        tipoLicenciaObjetivo: "B",
        usuario: { nombre: "Alumno Demo" },
      },
    ]);
    const user = userEvent.setup();

    render(<SolicitudesExamen />);

    await waitFor(() => {
      expect(solicitudesExamenService.getAll).toHaveBeenCalledTimes(1);
    });

    await user.click(screen.getByRole("button", { name: /nueva solicitud/i }));
    await user.click(screen.getByRole("button", { name: /^guardar$/i }));

    await waitFor(() => {
      expect(solicitudesExamenService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          alumnoId: "",
          tipo: "TEORICO",
          estado: "PENDIENTE",
          licenciaObjetivo: "B",
          fechaProgramada: null,
        }),
      );
    });
  });
});
