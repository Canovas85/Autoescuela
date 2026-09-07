import { useEffect, useMemo, useState } from "react";

import { Alert, Box, CircularProgress, Typography } from "@mui/material";

import TestDGTAdmin from "./TestDGTAdmin";
import TestDGTAlumno from "./TestDGTAlumno";

import { matriculasService } from "../../services/matriculasService";
import AccesoRestringidoMatricula from "../../components/matricula/AccesoRestringidoMatricula";

const decodeTokenPayload = (token) => {
  try {
    const payloadBase64 = token.split(".")[1] || "";
    const normalized = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "=",
    );

    const parsed = JSON.parse(atob(padded));

    return parsed;
  } catch {
    return null;
  }
};

export default function TestDGT() {
  const [loadingMatricula, setLoadingMatricula] = useState(true);
  const [matricula, setMatricula] = useState(null);
  const [matriculaError, setMatriculaError] = useState("");

  const token = localStorage.getItem("token") || "";
  const payload = useMemo(() => decodeTokenPayload(token), [token]);
  const role = payload?.rol || "ALUMNO";
  const licenciaPreferida =
    payload?.licencia || payload?.tipoLicenciaObjetivo || "B";

  useEffect(() => {
    const loadMatricula = async () => {
      if (role !== "ALUMNO") {
        setLoadingMatricula(false);
        return;
      }

      try {
        const data = await matriculasService.getMine();
        setMatricula(data);
        setMatriculaError("");
      } catch (error) {
        console.error(error);
        setMatriculaError(
          error.response?.data?.message ||
            "No se pudo validar el estado de tu matrícula.",
        );
      } finally {
        setLoadingMatricula(false);
      }
    };

    loadMatricula();
  }, [role]);

  if (role === "ADMIN") {
    return <TestDGTAdmin />;
  }

  if (role !== "ALUMNO") {
    return (
      <Box>
        <Alert severity="info">
          Esta sección está disponible para perfiles de alumno y administración.
        </Alert>
      </Box>
    );
  }

  if (loadingMatricula) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (matriculaError) {
    return <Alert severity="error">{matriculaError}</Alert>;
  }

  if (matricula && matricula.estado !== "PAGADA") {
    return <AccesoRestringidoMatricula matricula={matricula} />;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box>
        <Typography variant="h4" fontWeight={800}>
          Test DGT
        </Typography>
        <Typography color="text.secondary">
          Practica exámenes oficiales para tu permiso objetivo y guarda tu
          resultado.
        </Typography>
      </Box>

      <TestDGTAlumno defaultLicencia={licenciaPreferida} />
    </Box>
  );
}
