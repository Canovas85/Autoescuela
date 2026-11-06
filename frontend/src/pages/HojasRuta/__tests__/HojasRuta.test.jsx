import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import HojasRuta from "../HojasRuta";
import { hojasRutaService } from "../../../services/hojasRutaService";
import { jwtDecode } from "jwt-decode";

vi.mock("jwt-decode", () => ({
  jwtDecode: vi.fn(),
}));

vi.mock("../../../services/hojasRutaService", () => ({
  hojasRutaService: {
    getFaultCatalog: vi.fn(),
    getProfessorDashboard: vi.fn(),
    getProfessorRoadmapDetail: vi.fn(),
    saveProfessorDraft: vi.fn(),
    finalizeProfessorRoadmap: vi.fn(),
    getAdminProfessorsSummary: vi.fn(),
    getAdminStudentsByProfessor: vi.fn(),
    getAdminRegisteredRoadmapsByStudent: vi.fn(),
    getAdminRoadmapDetail: vi.fn(),
    getStudentRegisteredRoadmaps: vi.fn(),
    getStudentRoadmapDetail: vi.fn(),
  },
}));

vi.mock("@mui/x-data-grid", () => ({
  DataGrid: ({ rows }) => (
    <div data-testid="hojas-ruta-grid">
      {(rows || []).map((row, index) => (
        <div key={row.id || index}>{row.id || index}</div>
      ))}
    </div>
  ),
}));

vi.mock("../../../utils/exportHojasRutaProfesoresExcel", () => ({
  exportHojasRutaProfesoresExcel: vi.fn(),
}));
vi.mock("../../../utils/exportHojasRutaProfesoresPdf", () => ({
  exportHojasRutaProfesoresPdf: vi.fn(),
}));
vi.mock("../../../utils/exportHojasRutaAlumnosProfesorExcel", () => ({
  exportHojasRutaAlumnosProfesorExcel: vi.fn(),
}));
vi.mock("../../../utils/exportHojasRutaAlumnosProfesorPdf", () => ({
  exportHojasRutaAlumnosProfesorPdf: vi.fn(),
}));
vi.mock("../../../utils/exportHojasRutaAlumnoDetalleExcel", () => ({
  exportHojasRutaAlumnoDetalleExcel: vi.fn(),
}));
vi.mock("../../../utils/exportHojasRutaAlumnoDetallePdf", () => ({
  exportHojasRutaAlumnoDetallePdf: vi.fn(),
}));

const PAGINATION = { page: 1, totalPages: 1, total: 0 };

const ROADMAP_DETAIL = {
  id: "hr-1",
  estado: "PENDIENTE",
  faltas: [],
  ejerciciosRealizados: [],
  profesor: { nombre: "Profesor Demo" },
  alumno: { nombre: "Alumno Demo" },
  vehiculo: { matricula: "1111AAA" },
};

const renderPage = (query = "") =>
  render(
    <MemoryRouter initialEntries={[`/hojas-ruta${query}`]}>
      <HojasRuta />
    </MemoryRouter>,
  );

describe("HojasRuta", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    localStorage.setItem("token", "token-demo");

    jwtDecode.mockReturnValue({ rol: "ALUMNO" });
    hojasRutaService.getStudentRegisteredRoadmaps.mockResolvedValue({
      rows: [],
      pagination: PAGINATION,
    });
    hojasRutaService.getStudentRoadmapDetail.mockResolvedValue(ROADMAP_DETAIL);
    hojasRutaService.getProfessorDashboard.mockResolvedValue({
      rows: [],
      pagination: PAGINATION,
      alertasRepostaje: [],
      vehiculos: [],
    });
    hojasRutaService.getProfessorRoadmapDetail.mockResolvedValue(ROADMAP_DETAIL);
    hojasRutaService.getFaultCatalog.mockResolvedValue({
      LEVE: [],
      DEFICIENTE: [],
      ELIMINATORIA: [],
    });
    hojasRutaService.getAdminProfessorsSummary.mockResolvedValue([]);
    hojasRutaService.getAdminStudentsByProfessor.mockResolvedValue([]);
    hojasRutaService.getAdminRegisteredRoadmapsByStudent.mockResolvedValue({
      rows: [],
      pagination: PAGINATION,
    });
    hojasRutaService.getAdminRoadmapDetail.mockResolvedValue(ROADMAP_DETAIL);
  });

  it("escenario 1: alumno carga listado de hojas registradas", async () => {
    jwtDecode.mockReturnValue({ rol: "ALUMNO" });
    renderPage();

    await waitFor(() => {
      expect(hojasRutaService.getStudentRegisteredRoadmaps).toHaveBeenCalledTimes(1);
    });
    expect(screen.getByText("Mis Hojas de Ruta")).toBeInTheDocument();
    expect(screen.getByTestId("hojas-ruta-grid")).toBeInTheDocument();
  });

  it("escenario 2: alumno abre detalle de hoja por roadmapId", async () => {
    jwtDecode.mockReturnValue({ rol: "ALUMNO" });
    renderPage("?roadmapId=hr-1");

    await waitFor(() => {
      expect(hojasRutaService.getStudentRoadmapDetail).toHaveBeenCalledWith("hr-1");
    });
    expect(screen.getByText("Detalle hoja de ruta")).toBeInTheDocument();
  });

  it("escenario 3: profesor carga dashboard de hojas", async () => {
    jwtDecode.mockReturnValue({ rol: "PROFESOR" });
    renderPage();

    await waitFor(() => {
      expect(hojasRutaService.getProfessorDashboard).toHaveBeenCalledTimes(1);
    });
    expect(screen.getByText("Hojas de Ruta")).toBeInTheDocument();
  });

  it("escenario 4: profesor abre detalle por claseId y catálogo de faltas", async () => {
    jwtDecode.mockReturnValue({ rol: "PROFESOR" });
    renderPage("?claseId=cl-1");

    await waitFor(() => {
      expect(hojasRutaService.getProfessorRoadmapDetail).toHaveBeenCalledWith("cl-1");
      expect(hojasRutaService.getFaultCatalog).toHaveBeenCalledTimes(1);
    });
    expect(screen.getByText("Hoja de Ruta")).toBeInTheDocument();
  });

  it("escenario 5: admin carga resumen por profesor", async () => {
    jwtDecode.mockReturnValue({ rol: "ADMIN" });
    renderPage();

    await waitFor(() => {
      expect(hojasRutaService.getAdminProfessorsSummary).toHaveBeenCalledTimes(1);
    });
    expect(screen.getByText("Hojas de Ruta por Profesor")).toBeInTheDocument();
  });

  it("escenario 6: admin carga alumnos de un profesor", async () => {
    jwtDecode.mockReturnValue({ rol: "ADMIN" });
    renderPage("?profesorId=pro-1");

    await waitFor(() => {
      expect(hojasRutaService.getAdminStudentsByProfessor).toHaveBeenCalledWith(
        "pro-1",
        expect.any(Object),
      );
    });
    expect(screen.getByText("Alumnos del profesor")).toBeInTheDocument();
  });

  it("escenario 7: admin carga hojas de un alumno por profesor", async () => {
    jwtDecode.mockReturnValue({ rol: "ADMIN" });
    renderPage("?profesorId=pro-1&alumnoId=alu-1");

    await waitFor(() => {
      expect(
        hojasRutaService.getAdminRegisteredRoadmapsByStudent,
      ).toHaveBeenCalledWith("pro-1", "alu-1", expect.any(Object));
    });
    expect(screen.getByText("Hojas de ruta del alumno")).toBeInTheDocument();
  });

  it("escenario 8: admin abre detalle por roadmapId", async () => {
    jwtDecode.mockReturnValue({ rol: "ADMIN" });
    renderPage("?roadmapId=hr-1");

    await waitFor(() => {
      expect(hojasRutaService.getAdminRoadmapDetail).toHaveBeenCalledWith("hr-1");
    });
    expect(screen.getByText("Detalle hoja de ruta")).toBeInTheDocument();
  });

  it("escenario 9: administrativo usa la vista resumen de profesores", async () => {
    jwtDecode.mockReturnValue({ rol: "ADMINISTRATIVO" });
    renderPage();

    await waitFor(() => {
      expect(hojasRutaService.getAdminProfessorsSummary).toHaveBeenCalledTimes(1);
    });
    expect(screen.getByText("Hojas de Ruta por Profesor")).toBeInTheDocument();
  });

  it("escenario 10: rol no permitido muestra alerta informativa", async () => {
    jwtDecode.mockReturnValue({ rol: "INVITADO" });
    renderPage();

    await waitFor(() => {
      expect(
        screen.getByText("No se pudo validar el rol actual."),
      ).toBeInTheDocument();
    });
  });
});
