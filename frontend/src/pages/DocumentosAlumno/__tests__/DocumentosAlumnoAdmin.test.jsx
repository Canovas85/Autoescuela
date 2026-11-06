import { render, screen, waitFor } from "@testing-library/react";

import DocumentosAlumnoAdmin from "../DocumentosAlumnoAdmin";
import { documentosAlumnoService } from "../../../services/documentosAlumnoService";

vi.mock("../../../services/documentosAlumnoService", () => ({
  documentosAlumnoService: {
    getMine: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    getAllAdmin: vi.fn(),
    validate: vi.fn(),
  },
}));

vi.mock("@mui/x-data-grid", () => ({
  DataGrid: ({ rows }) => (
    <div data-testid="documentos-admin-grid">
      {(rows || []).map((row) => (
        <div key={row.id}>{row.id}</div>
      ))}
    </div>
  ),
}));

describe("DocumentosAlumnoAdmin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("carga documentos para validación administrativa", async () => {
    documentosAlumnoService.getAllAdmin.mockResolvedValue([
      {
        id: "doc-admin-1",
        estado: "PENDIENTE_VALIDACION",
        tipo: "DNI",
        createdAt: "2026-01-01T00:00:00.000Z",
        alumno: { usuario: { nombre: "Alumno 1" } },
        archivos: [],
      },
    ]);

    render(<DocumentosAlumnoAdmin />);

    await waitFor(() => {
      expect(documentosAlumnoService.getAllAdmin).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText("Documentos de alumnos")).toBeInTheDocument();
    expect(screen.getByTestId("documentos-admin-grid")).toBeInTheDocument();
    expect(screen.getByText("doc-admin-1")).toBeInTheDocument();
  });
});
