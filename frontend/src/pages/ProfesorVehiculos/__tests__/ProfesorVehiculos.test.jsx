import { render, screen, waitFor } from "@testing-library/react";

import ProfesorVehiculos from "../ProfesorVehiculos";
import { profesorPortalService } from "../../../services/profesorPortalService";
import { gastosCombustibleService } from "../../../services/gastosCombustibleService";

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

vi.mock("../../../services/gastosCombustibleService", () => ({
  gastosCombustibleService: {
    getAll: vi.fn(),
    getMine: vi.fn(),
    repostar: vi.fn(),
    pagarRevisionItv: vi.fn(),
  },
}));

vi.mock("@mui/x-data-grid", () => ({
  DataGrid: ({ rows }) => (
    <div data-testid="profesor-vehiculos-grid">
      {rows.map((row) => (
        <div key={row.id}>{row.matricula}</div>
      ))}
    </div>
  ),
}));

describe("ProfesorVehiculos", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("carga y muestra vehículos del profesor", async () => {
    profesorPortalService.getVehicles.mockResolvedValue([
      { id: "pv-1", matricula: "5555BBB", activo: true },
    ]);

    render(<ProfesorVehiculos />);

    await waitFor(() => {
      expect(profesorPortalService.getVehicles).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText("Vehículos Disponibles")).toBeInTheDocument();
    expect(screen.getByTestId("profesor-vehiculos-grid")).toBeInTheDocument();
    expect(screen.getByText("5555BBB")).toBeInTheDocument();
  });
});
