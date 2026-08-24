import {
  BrowserRouter,
  Navigate,
  Outlet,
  Routes,
  Route,
} from "react-router-dom";

import Login from "../pages/Login/Login";
import FirstLoginPassword from "../pages/Login/FirstLoginPassword";
import Dashboard from "../pages/Dashboard/Dashboard";

import AdminLayout from "../layouts/AdminLayout";

import Alumnos from "../pages/Alumnos/Alumnos";
import Profesores from "../pages/Profesores/Profesores";
import Vehiculos from "../pages/Vehiculos/Vehiculos";
import Clases from "../pages/Clases/Clases";
import Examenes from "../pages/Examenes/Examenes";
import Temarios from "../pages/Temarios/Temarios";
import Bonos from "../pages/Bonos/Bonos";
import SolicitudesExamen from "../pages/SolicitudesExamen/SolicitudesExamen";

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

        <Route element={<RequireAuth />}>
          <Route path="/primer-login" element={<FirstLoginPassword />} />

          <Route element={<RequirePasswordUpdated />}>
            <Route element={<AdminLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />

              <Route path="/alumnos" element={<Alumnos />} />

              <Route path="/profesores" element={<Profesores />} />

              <Route path="/vehiculos" element={<Vehiculos />} />

              <Route path="/temarios" element={<Temarios />} />

              <Route path="/bonos" element={<Bonos />} />

              <Route
                path="/solicitudes-examen"
                element={<SolicitudesExamen />}
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
