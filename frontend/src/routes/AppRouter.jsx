import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";

import AdminLayout from "../layouts/AdminLayout";

import Alumnos from "../pages/Alumnos/Alumnos";
import Profesores from "../pages/Profesores/Profesores";
import Vehiculos from "../pages/Vehiculos/Vehiculos";
import Clases from "../pages/Clases/Clases";
import Examenes from "../pages/Examenes/Examenes";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/alumnos" element={<Alumnos />} />

          <Route path="/profesores" element={<Profesores />} />

          <Route path="/vehiculos" element={<Vehiculos />} />

          <Route path="/clases" element={<Clases />} />

          <Route path="/examenes" element={<Examenes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
