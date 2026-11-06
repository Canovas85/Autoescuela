import { render, screen, waitFor } from "@testing-library/react";

import DocumentosAlumno from "../DocumentosAlumno";
import { documentosAlumnoService } from "../../../services/documentosAlumnoService";

vi.mock("../../../services/documentosAlumnoService", () => ({
  documentosAlumnoService: {
    getMine: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}));

vi.mock("@mui/x-data-grid", () => ({
  DataGrid: ({ rows }) => (
    <div data-testid="documentos-grid">
      {rows.map((row) => (
        <div key={row.id}>{row.nombreArchivo}</div>
      ))}
    </div>
  ),
}));

describe("DocumentosAlumno", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("carga documentación del alumno", async () => {
    documentosAlumnoService.getMine.mockResolvedValue([
      {
        id: "doc-1",
        tipo: "DNI",
        estado: "PENDIENTE_VALIDACION",
        createdAt: "2026-01-01T00:00:00.000Z",
        archivos: [{ ruta: "/uploads/dni.pdf" }],
      },
    ]);

    render(<DocumentosAlumno />);

    await waitFor(() => {
      expect(documentosAlumnoService.getMine).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText("Mis documentos")).toBeInTheDocument();
    expect(screen.getByTestId("documentos-grid")).toBeInTheDocument();
  });
});
