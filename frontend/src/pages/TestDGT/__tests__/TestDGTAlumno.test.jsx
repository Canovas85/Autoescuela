import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import TestDGTAlumno from "../TestDGTAlumno";
import { preguntasDGTService } from "../../../services/preguntasDGTService";

vi.mock("../../../services/preguntasDGTService", () => ({
  preguntasDGTService: {
    getAll: vi.fn(),
    getNextId: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    activate: vi.fn(),
    deactivate: vi.fn(),
    importFromExcel: vi.fn(),
    generarExamen: vi.fn(),
    corregirExamen: vi.fn(),
  },
}));

describe("TestDGTAlumno", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("permite generar examen del simulador DGT", async () => {
    preguntasDGTService.generarExamen.mockResolvedValue([]);

    render(<TestDGTAlumno defaultLicencia="B" />);

    expect(screen.getByText("Simulador Test DGT")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Generar examen" }));

    await waitFor(() => {
      expect(preguntasDGTService.generarExamen).toHaveBeenCalledWith("B");
    });
  });
});
