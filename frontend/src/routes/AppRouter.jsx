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
import Examenes from "../pages/Examenes/Examenes";
import Temarios from "../pages/Temarios/Temarios";
import TemarioAlumno from "../pages/Temarios/TemarioAlumno";
import TemarioTemaDetalle from "../pages/Temarios/TemarioTemaDetalle";
import Bonos from "../pages/Bonos/Bonos";
import SolicitudesExamen from "../pages/SolicitudesExamen/SolicitudesExamen";
import Promociones from "../pages/Promociones/Promociones";
import TarifasMatricula from "../pages/TarifasMatricula/TarifasMatricula";
import ClasesDirecto from "../pages/ClasesDirecto/ClasesDirecto";
import ClaseDirectoDetalle from "../pages/ClasesDirecto/ClaseDirectoDetalle";
import ClasesDirectoAdmin from "../pages/ClasesDirectoAdmin/ClasesDirectoAdmin";
import Matriculas from "../pages/Matriculas/Matriculas";
import PagoMatricula from "../pages/Matriculas/PagoMatricula";

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

              <Route path="/profesores" element={<Profesores />} />

              <Route path="/vehiculos" element={<Vehiculos />} />

              <Route path="/temarios" element={<Temarios />} />

              <Route path="/temario" element={<TemarioAlumno />} />
              <Route path="/temario/:id" element={<TemarioTemaDetalle />} />

              <Route path="/clases-directo" element={<ClasesDirecto />} />

              <Route
                path="/clases-directo/:id"
                element={<ClaseDirectoDetalle />}
              />

              <Route path="/bonos" element={<Bonos />} />

              <Route path="/matricula" element={<Matriculas />} />

              <Route path="/pago-matricula" element={<PagoMatricula />} />

              <Route path="/matricula" element={<TarifasMatricula />} />

              <Route
                path="/solicitudes-examen"
                element={<SolicitudesExamen />}
              />

              <Route path="/promociones" element={<Promociones />} />
              <Route
                path="/admin-clases-directo"
                element={<ClasesDirectoAdmin />}
              />

              <Route path="/clases" element={<Clases />} />

              <Route path="/examenes" element={<Examenes />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
