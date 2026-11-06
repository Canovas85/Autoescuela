import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import StudentDashboard from "../StudentDashboard";

vi.mock("../../../services/dashboardService", () => ({
  dashboardService: {
    getStudentDashboard: vi.fn(),
  },
}));

vi.mock("../../../services/pagosService", () => ({
  pagosService: {
    getMineById: vi.fn(),
    payMine: vi.fn(),
  },
}));

describe("StudentDashboard", () => {
  it("renderiza el panel del alumno con estructura base", () => {
    render(
      <MemoryRouter>
        <StudentDashboard
          data={{
            perfil: {
              nombre: "Alumno Demo",
              tipoLicenciaObjetivo: "B",
              licenciasObtenidasDetalle: [],
            },
            estadoAlumno: { label: "En progreso", codigo: "EN_PROGRESO" },
            teoria: {
              testsTotales: 0,
              testsAprobados: 0,
              testsSuspendidos: 0,
              porcentajeAprobado: 0,
              preparadoParaTeorico: false,
              recomendacionTemarios: [],
            },
            dgt: {
              testsTotales: 0,
              testsAprobados: 0,
              testsSuspendidos: 0,
              porcentajeAprobado: 0,
              ultimoResultado: null,
              rachaActual: { tipo: "SIN_DATOS", cantidad: 0 },
              tasa21: {
                pagoPendiente: null,
                ultimoPago: null,
                convocatoriasIncluidas: 0,
                convocatoriasConsumidas: 0,
                convocatoriasDisponibles: 0,
                requiereNuevoPago: false,
              },
            },
            temarios: [],
            practica: {
              clasesCompradas: 0,
              clasesPagadas: 0,
              clasesRealizadas: 0,
              clasesReservadas: 0,
              clasesSolicitadasTotales: 0,
              clasesConfirmadasProfesor: 0,
              clasesPendientesConfirmacion: 0,
            },
            bonos: [],
            examenes: {
              teoricos: [],
              practicos: [],
            },
            reservas: [],
            evolucion: [],
            resumen: {
              matricula: "PENDIENTE",
              preparadoParaTeorico: false,
            },
          }}
        />
      </MemoryRouter>,
    );

    expect(screen.getAllByText("Mi panel").length).toBeGreaterThan(0);
    expect(screen.getByText("Datos personales")).toBeInTheDocument();
  });
});
