import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import ProfessorDashboard from "../ProfessorDashboard";

describe("ProfessorDashboard", () => {
  it("renderiza el panel del profesor con métricas principales", () => {
    render(
      <MemoryRouter>
        <ProfessorDashboard
          data={{
            perfil: {
              nombre: "Profesor Demo",
              permisosLicencias: ["B"],
            },
            resumen: {
              alumnosAsignados: 2,
              vehiculosDisponibles: 1,
              clasesConfirmadasHoy: 1,
              hojasRutaPendientesEnCurso: 0,
              hojasRutaPendientes: 0,
              hojasRutaEnCurso: 0,
              alumnosHistoricosLicenciados: 0,
            },
            alumnos: [],
            alumnosHistoricos: [],
            vehiculos: [],
          }}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText("Panel del Profesor")).toBeInTheDocument();
    expect(screen.getAllByText("Alumnos Asignados").length).toBeGreaterThan(0);
  });
});
