import {
  BrowserRouter,
  Navigate,
  Outlet,
  Routes,
  Route,
} from "react-router-dom";

import Login from "../pages/Login/Login";
import FirstLoginPassword from "../pages/Login/FirstLoginPassword";
import AccountActivation from "../pages/Login/AccountActivation";
import Dashboard from "../pages/Dashboard/Dashboard";

import AdminLayout from "../layouts/AdminLayout";

import Alumnos from "../pages/Alumnos/Alumnos";
import Profesores from "../pages/Profesores/Profesores";
import Vehiculos from "../pages/Vehiculos/Vehiculos";
import Clases from "../pages/Clases/Clases";
import EvaluacionExamenTeorico from "../pages/Examenes/EvaluacionExamenTeorico";
import EvaluacionExamenPractico from "../pages/Examenes/EvaluacionExamenPractico";
import Temarios from "../pages/Temarios/Temarios";
import TemarioAlumno from "../pages/Temarios/TemarioAlumno";
import TemarioTemaDetalle from "../pages/Temarios/TemarioTemaDetalle";
import Bonos from "../pages/Bonos/Bonos";
import SolicitudesExamen from "../pages/SolicitudesExamen/SolicitudesExamen";
import Promociones from "../pages/Promociones/Promociones";
import TarifasMatricula from "../pages/TarifasMatricula/TarifasMatricula";
import TarifasConcepto from "../pages/TarifasConcepto/TarifasConcepto";
import ClasesDirecto from "../pages/ClasesDirecto/ClasesDirecto";
import ClaseDirectoDetalle from "../pages/ClasesDirecto/ClaseDirectoDetalle";
import ClasesDirectoAdmin from "../pages/ClasesDirectoAdmin/ClasesDirectoAdmin";
import Matriculas from "../pages/Matriculas/Matriculas";
import PagoMatricula from "../pages/Matriculas/PagoMatricula";
import Facturas from "../pages/Facturas/Facturas";
import MisFacturas from "../pages/Facturas/MisFacturas";
import Pagos from "../pages/Pagos/Pagos";
import MisPagos from "../pages/Pagos/MisPagos";
import ProfesorAlumnos from "../pages/ProfesorAlumnos/ProfesorAlumnos";
import ProfesorVehiculos from "../pages/ProfesorVehiculos/ProfesorVehiculos";
import ProfesorAgenda from "../pages/ProfesorAgenda/ProfesorAgenda";
import TestDGT from "../pages/TestDGT/TestDGT";
import DocumentosAlumno from "../pages/DocumentosAlumno/DocumentosAlumno";
import DocumentosAlumnoAdmin from "../pages/DocumentosAlumno/DocumentosAlumnoAdmin";
import ExamenTeoricoAlumno from "../pages/ExamenTeoricoAlumno/ExamenTeoricoAlumno";
import ConvocatoriasTeoricoAdmin from "../pages/ConvocatoriasTeoricoAdmin/ConvocatoriasTeoricoAdmin";
import ReservarClase from "../pages/ReservarClase/ReservarClase";
import ClasesPracticasProfesor from "../pages/ClasesPracticasProfesor/ClasesPracticasProfesor";
import Notificaciones from "../pages/Notificaciones/Notificaciones";

function RequireAuth() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

function RequirePasswordUpdated() {
  const requiresPasswordChange =
    localStorage.getItem("requiresPasswordChange") === "true";

  if (requiresPasswordChange) {
    return <Navigate to="/primer-login" replace />;
  }

  return <Outlet />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/activar-cuenta" element={<AccountActivation />} />

        <Route element={<RequireAuth />}>
          <Route path="/primer-login" element={<FirstLoginPassword />} />

          <Route element={<RequirePasswordUpdated />}>
            <Route element={<AdminLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />

              <Route path="/alumnos" element={<Alumnos />} />
              <Route path="/profesor-alumnos" element={<ProfesorAlumnos />} />
              <Route path="/agenda" element={<ProfesorAgenda />} />
              <Route
                path="/clases-practicas"
                element={<ClasesPracticasProfesor />}
              />

              <Route path="/profesores" element={<Profesores />} />

              <Route path="/vehiculos" element={<Vehiculos />} />
              <Route
                path="/profesor-vehiculos"
                element={<ProfesorVehiculos />}
              />

              <Route path="/temarios" element={<Temarios />} />
              <Route path="/temarios/:id" element={<TemarioTemaDetalle />} />

              <Route path="/temario" element={<TemarioAlumno />} />
              <Route path="/temario/:id" element={<TemarioTemaDetalle />} />
              <Route path="/test-dgt" element={<TestDGT />} />
              <Route path="/examen-teorico" element={<ExamenTeoricoAlumno />} />

              <Route path="/clases-directo" element={<ClasesDirecto />} />

              <Route
                path="/clases-directo/:id"
                element={<ClaseDirectoDetalle />}
              />

              <Route path="/bonos" element={<Bonos />} />

              <Route path="/matricula" element={<Matriculas />} />

              <Route path="/pago-matricula" element={<PagoMatricula />} />

              <Route path="/tarifas-matricula" element={<TarifasMatricula />} />
              <Route path="/tarifas-concepto" element={<TarifasConcepto />} />

              <Route
                path="/solicitudes-examen"
                element={<SolicitudesExamen />}
              />
              <Route
                path="/convocatorias-teorico"
                element={<ConvocatoriasTeoricoAdmin />}
              />

              <Route path="/promociones" element={<Promociones />} />
              <Route
                path="/admin-clases-directo"
                element={<ClasesDirectoAdmin />}
              />

              <Route path="/clases" element={<Clases />} />

              <Route
                path="/examenes-teoricos"
                element={<EvaluacionExamenTeorico />}
              />

              <Route path="/examenes" element={<EvaluacionExamenPractico />} />
              <Route
                path="/examenes-practicos"
                element={<EvaluacionExamenPractico />}
              />

              <Route path="/facturas" element={<Facturas />} />
              <Route path="/pagos" element={<Pagos />} />
              <Route path="/mis-facturas" element={<MisFacturas />} />
              <Route path="/mis-pagos" element={<MisPagos />} />
              <Route path="/mis-documentos" element={<DocumentosAlumno />} />
              <Route path="/reservar-clase" element={<ReservarClase />} />
              <Route path="/notificaciones" element={<Notificaciones />} />
              <Route
                path="/documentos-alumno-admin"
                element={<DocumentosAlumnoAdmin />}
              />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
