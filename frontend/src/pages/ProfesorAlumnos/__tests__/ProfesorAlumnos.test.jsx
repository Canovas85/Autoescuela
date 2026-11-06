import { render, screen, waitFor } from "@testing-library/react";

import ProfesorAlumnos from "../ProfesorAlumnos";
import { profesorPortalService } from "../../../services/profesorPortalService";

vi.mock("../../../services/profesorPortalService", () => ({
  profesorPortalService: {
    getStudents: vi.fn(),
    getStudentDetail: vi.fn(),
    getVehicles: vi.fn(),
    getVehicleSchedule: vi.fn(),
    getAgenda: vi.fn(),
    updateWorkSchedule: vi.fn(),
    updateClassStatus: vi.fn(),
  },
}));

vi.mock("@mui/x-data-grid", () => ({
  DataGrid: ({ rows }) => (
    <div data-testid="profesor-alumnos-grid">
      {rows.map((row) => (
        <div key={row.id}>{row.nombre}</div>
      ))}
    </div>
  ),
}));

describe("ProfesorAlumnos", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("carga y muestra alumnos asignados", async () => {
    profesorPortalService.getStudents.mockResolvedValue([
      { id: "pa-1", nombre: "Alumno Profesor 1", email: "alumno1@test.com" },
    ]);

    render(<ProfesorAlumnos />);

    await waitFor(() => {
      expect(profesorPortalService.getStudents).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText("Mis Alumnos")).toBeInTheDocument();
    expect(screen.getByTestId("profesor-alumnos-grid")).toBeInTheDocument();
    expect(screen.getByText("Alumno Profesor 1")).toBeInTheDocument();
  });
});
