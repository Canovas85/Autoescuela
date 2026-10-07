import { useEffect, useMemo, useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import SchoolIcon from "@mui/icons-material/School";
import PeopleIcon from "@mui/icons-material/People";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import GroupIcon from "@mui/icons-material/Group";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import DGTChart from "../../components/dashboard/DGTChart";
import DGTSummaryChart from "../../components/dashboard/DGTSummaryChart";

import { jwtDecode } from "jwt-decode";

import SuccessChart from "../../components/dashboard/SuccessChart";
import StudentDashboard from "./StudentDashboard";
import ProfessorDashboard from "./ProfessorDashboard";
import { LicenseChip } from "../../components/common/LicenseChip";

import { api } from "../../services/api";

const normalizeRole = (role) => {
  if (role === "GESTOR") {
    return "ADMINISTRATIVO";
  }

  return role;
};

function AdminDashboardView({ metrics }) {
  const VISIBLE_RANK_ITEMS = 5;
  const topStudents = metrics.topStudents || [];
  const topProfessors = metrics.topProfessors || [];
  const [studentsStart, setStudentsStart] = useState(0);
  const [professorsStart, setProfessorsStart] = useState(0);

  const studentsMaxStart = Math.max(0, topStudents.length - VISIBLE_RANK_ITEMS);
  const professorsMaxStart = Math.max(
    0,
    topProfessors.length - VISIBLE_RANK_ITEMS,
  );

  useEffect(() => {
    setStudentsStart((current) => Math.min(current, studentsMaxStart));
  }, [studentsMaxStart]);

  useEffect(() => {
    setProfessorsStart((current) => Math.min(current, professorsMaxStart));
  }, [professorsMaxStart]);

  const visibleStudents = useMemo(
    () => topStudents.slice(studentsStart, studentsStart + VISIBLE_RANK_ITEMS),
    [topStudents, studentsStart],
  );

  const visibleProfessors = useMemo(
    () =>
      topProfessors.slice(
        professorsStart,
        professorsStart + VISIBLE_RANK_ITEMS,
      ),
    [topProfessors, professorsStart],
  );

  const cards = [
    {
      title: "Usuarios Registrados",
      value: metrics.activeEnrollments ?? 0,
      icon: <AppRegistrationIcon />,
      color: "#7c3aed",
    },
    {
      title: "Alumnos Activos",
      value: metrics.activeStudents ?? 0,
      icon: <PeopleIcon />,
      color: "#2563eb",
    },
    {
      title: "Matrículas Pagadas",
      value: (
        <Typography variant="body2" fontWeight={700} sx={{ fontSize: 12 }}>
          Mes: {metrics.matriculasPagadasMes ?? 0} | Histórico:{" "}
          {metrics.matriculasPagadasHistorico ?? 0}
        </Typography>
      ),
      icon: <AssignmentIcon />,
      color: "#15803d",
      wide: true,
    },
    {
      title: "Matrículas Pendientes",
      value: (
        <Typography variant="body2" fontWeight={700} sx={{ fontSize: 14 }}>
          Mes: {metrics.matriculasPendientesMes ?? 0} | Histórico:{" "}
          {metrics.matriculasPendientesHistorico ?? 0}
        </Typography>
      ),
      icon: <AccessTimeFilledIcon />,
      color: "#ea580c",
      wide: true,
    },

    {
      title: "Tasa de Éxito",
      value: `${Number(metrics.successRate || 0).toFixed(1)}%`,
      icon: <TrendingUpIcon />,
      color: "#16a34a",
    },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold">
        Dashboard Ejecutivo
      </Typography>

      <Box sx={{ height: 20 }} />

      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid
            xs={12}
            sm={6}
            md={card.wide ? 6 : 4}
            lg={card.wide ? 3 : 2.4}
            key={card.title}
          >
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: 190,
                  }}
                >
                  <Box sx={{ maxWidth: 170 }}>
                    <Typography color="text.secondary">{card.title}</Typography>

                    {typeof card.value === "string" ? (
                      <Typography variant="h6" fontWeight="bold">
                        {card.value}
                      </Typography>
                    ) : (
                      card.value
                    )}
                  </Box>

                  <Box
                    sx={{
                      color: card.color,
                      fontSize: 40,
                    }}
                  >
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ height: 40 }} />

      <Typography variant="h5" fontWeight="bold">
        Actividad Académica
      </Typography>

      <Box sx={{ height: 20 }} />

      <Grid container spacing={3}>
        {/* Tarjeta 1: Examenes Teóricos APTO */}
        <Grid xs={12} sm={6} md={4} lg={3} key="profesor-activo">
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  minHeight: 80, // Asegura una altura consistente con tu primer diseño
                  width: 190,
                }}
              >
                <Box>
                  <Typography color="text.secondary">Teórico APTO</Typography>
                  <Typography variant="h6" fontWeight="bold" sx={{ mt: 0.2 }}>
                    <SchoolIcon sx={{ ml: 20, color: "#0369a1" }} />
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Mes: {metrics.aprobadosTeoricoMes ?? 0} | Histórico:{" "}
                    {metrics.aprobadosTeoricoHistorico ?? 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        {/* Tarjeta 2: Examenes Practicos APTO */}
        <Grid xs={12} sm={6} md={4} lg={3} key="profesor-activo">
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  minHeight: 80, // Asegura una altura consistente con tu primer diseño
                  width: 190,
                }}
              >
                <Box>
                  <Typography color="text.secondary">Práctico APTO</Typography>
                  <Typography variant="h6" fontWeight="bold" sx={{ mt: 0.2 }}>
                    <EmojiEventsIcon sx={{ ml: 20, color: "#EFBF04" }} />
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Mes: {metrics.aprobadosPracticoMes ?? 0} | Histórico:{" "}
                    {metrics.aprobadosPracticoHistorico ?? 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} sm={6} md={4} lg={3} key="profesor-activo">
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  minHeight: 80, // Asegura una altura consistente con tu primer diseño
                  width: 190,
                }}
              >
                <Box>
                  <Typography color="text.secondary">
                    Clases sin confirmar
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" sx={{ mt: 0.2 }}>
                    {metrics.pendingClassConfirmations ?? 0}{" "}
                    <DirectionsCarIcon sx={{ ml: 17, color: "#ea580c" }} />
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    solicitudes programadas
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Tarjeta 2: Profesor con más horas */}
        <Grid xs={12} sm={6} md={4} lg={3} key="profesor-horas">
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  minHeight: 80,
                  width: 190,
                }}
              >
                <Box>
                  <Typography color="text.secondary">
                    Horas sin confirmar
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" sx={{ mt: 0.5 }}>
                    {Number(metrics.pendingClassHours || 0).toFixed(1)} h{" "}
                    <AccessTimeFilledIcon sx={{ ml: 12, color: "#ff00ff" }} />
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    total de clases programadas
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Tarjeta 3: Exámenes Programados */}
        <Grid xs={12} sm={6} md={4} lg={3} key="examenes-programados">
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  minHeight: 80,
                  width: 190,
                }}
              >
                <Box>
                  <Typography color="text.secondary">
                    Numero de Alumnos
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {metrics.pendingExams ?? 0}{" "}
                    <DirectionsCarIcon sx={{ ml: 18, color: "#000000" }} />
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    con Exámenes Programados
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Tarjeta 4: Exámenes Este Mes */}
        <Grid xs={12} sm={6} md={4} lg={3} key="examenes-mes">
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  minHeight: 80,
                  width: 190,
                }}
              >
                <Box>
                  <Typography color="text.secondary">
                    Exámenes Este Mes
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {metrics.examsThisMonth ?? 0}{" "}
                    <AssignmentIcon sx={{ ml: 18, color: "#ea580c" }} />
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Programados
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h5" fontWeight="bold" sx={{ mt: 4 }}>
        Analítica DGT
      </Typography>

      <Box sx={{ height: 20 }} />

      <Grid container spacing={3}>
        {/* Tarjeta 1: Tests Hoy */}
        <Grid xs={12} sm={6} md={3} key="tests-hoy">
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  minHeight: 80, // Mantiene la misma altura que los bloques anteriores
                  width: 100,
                }}
              >
                <Box>
                  <Typography color="text.secondary">Tests Hoy</Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {metrics.dgtTestsToday ?? 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Tarjeta 2: Tests Mes */}
        <Grid xs={12} sm={6} md={3} key="tests-mes">
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  minHeight: 80,
                  width: 100,
                }}
              >
                <Box>
                  <Typography color="text.secondary">Tests Mes</Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {metrics.dgtTestsThisMonth ?? 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Tarjeta 3: % Aprobados */}
        <Grid xs={12} sm={6} md={3} key="porcentaje-aprobados">
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  minHeight: 80,
                  width: 100,
                }}
              >
                <Box>
                  <Typography color="text.secondary">% Aprobados</Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {metrics.dgtSuccessRate?.toFixed(1)}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Tarjeta 4: Total Tests */}
        <Grid xs={12} sm={6} md={3} key="total-tests">
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  minHeight: 80,
                  width: 100,
                }}
              >
                <Box>
                  <Typography color="text.secondary">Total Tests</Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {metrics.totalDgtTests ?? 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ height: 40 }} />

      <Typography variant="h5" fontWeight="bold">
        Rankings
      </Typography>

      <Box sx={{ height: 20 }} />

      <Grid container spacing={3}>
        <Grid xs={12}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "1600px",
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  Top 5 Alumnos DGT (tasa de aprobado)
                </Typography>
                <Box>
                  <IconButton
                    size="small"
                    onClick={() =>
                      setStudentsStart((current) => Math.max(0, current - 1))
                    }
                    disabled={studentsStart === 0}
                  >
                    <ArrowBackIosNewIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() =>
                      setStudentsStart((current) =>
                        Math.min(studentsMaxStart, current + 1),
                      )
                    }
                    disabled={studentsStart >= studentsMaxStart}
                  >
                    <ArrowForwardIosIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, minmax(0, 1fr))",
                    md: "repeat(3, minmax(0, 1fr))",
                    lg: "repeat(5, minmax(0, 1fr))",
                  },
                  gap: 2,
                  pb: 1,
                  mt: 1,
                }}
              >
                {visibleStudents.map((student, index) => (
                  <Card key={`${student.nombre}-${index}`} variant="outlined">
                    <CardContent>
                      <Typography
                        fontWeight={800}
                      >{`${studentsStart + index + 1}. ${student.nombre}`}</Typography>
                      <Box sx={{ mt: 1, mb: 1 }}>
                        <LicenseChip value={student.licencia} />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Tasa: {Number(student.porcentaje || 0).toFixed(1)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Aprobados: {student.aprobados ?? 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Presentados: {student.totalTests ?? 0}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "1600px",
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  Top 5 Profesores (tasa de aprobado)
                </Typography>
                <Box>
                  <IconButton
                    size="small"
                    onClick={() =>
                      setProfessorsStart((current) => Math.max(0, current - 1))
                    }
                    disabled={professorsStart === 0}
                  >
                    <ArrowBackIosNewIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() =>
                      setProfessorsStart((current) =>
                        Math.min(professorsMaxStart, current + 1),
                      )
                    }
                    disabled={professorsStart >= professorsMaxStart}
                  >
                    <ArrowForwardIosIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, minmax(0, 1fr))",
                    md: "repeat(3, minmax(0, 1fr))",
                    lg: "repeat(5, minmax(0, 1fr))",
                  },
                  gap: 2,
                  pb: 1,
                  mt: 1,
                }}
              >
                {visibleProfessors.map((profesor, index) => (
                  <Card key={`${profesor.nombre}-${index}`} variant="outlined">
                    <CardContent>
                      <Typography
                        fontWeight={800}
                      >{`${professorsStart + index + 1}. ${profesor.nombre}`}</Typography>
                      <Box sx={{ mt: 1, mb: 1 }}>
                        <LicenseChip value={profesor.licencia} />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Tasa: {Number(profesor.porcentaje || 0).toFixed(1)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Aprobados: {profesor.aprobados ?? 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Presentados: {profesor.totalTests ?? 0}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ height: 40 }} />

      <Grid
        container
        sx={{
          display: "grid",
          gridTemplateColumns: "40% 40%", // 🔥 Ajusta estos valores según tus líneas roja/negra
          gap: 20,
          width: "100%",
          alignItems: "stretch",
          mb: 10,
        }}
      >
        {/* Columna izquierda: Evolución DGT */}
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Evolución DGT
          </Typography>

          <Box sx={{ height: 20 }} />

          <Card sx={{ p: 2, height: "100%", width: "100%" }}>
            <DGTChart data={metrics.dgtEvolution || []} />
          </Card>
        </Box>

        {/* Columna derecha: Distribución DGT */}
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Distribución DGT
          </Typography>

          <Box sx={{ height: 20 }} />

          <Card sx={{ p: 2, height: "100%", width: "100%" }}>
            <DGTSummaryChart
              aprobados={metrics.dgtSummary?.aprobados ?? 0}
              suspendidos={metrics.dgtSummary?.suspendidos ?? 0}
            />
          </Card>
        </Box>
      </Grid>
    </Box>
  );
}

function SupportDashboardView({ metrics }) {
  const cards = [
    {
      title: "Usuarios internos",
      value: metrics.totalUsuariosInternos ?? 0,
      color: "#1d4ed8",
      icon: <PeopleIcon />,
    },
    {
      title: "Usuarios activos",
      value: metrics.usuariosInternosActivos ?? 0,
      color: "#15803d",
      icon: <ToggleOnIcon />,
    },
    {
      title: "Usuarios inactivos",
      value: metrics.usuariosInternosInactivos ?? 0,
      color: "#b91c1c",
      icon: <ToggleOffIcon />,
    },
    {
      title: "Perfiles soporte",
      value: metrics.usuariosSoporte ?? 0,
      color: "#6d28d9",
      icon: <GroupIcon />,
    },
    {
      title: "Perfiles administrativo",
      value: metrics.usuariosAdministrativos ?? 0,
      color: "#0f766e",
      icon: <AppRegistrationIcon />,
    },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold">
        Dashboard Soporte
      </Typography>

      <Box sx={{ height: 20 }} />

      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid xs={12} sm={6} md={4} lg={2.4} key={card.title}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography color="text.secondary">{card.title}</Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {card.value}
                    </Typography>
                  </Box>
                  <Box sx={{ color: card.color }}>{card.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ height: 32 }} />

      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
        Últimos reseteos de contraseña
      </Typography>

      <Paper sx={{ p: 2 }}>
        {(metrics.ultimosReseteos || []).length === 0 ? (
          <Typography color="text.secondary">
            No hay reseteos de contraseña registrados.
          </Typography>
        ) : (
          <Stack spacing={1.25}>
            {metrics.ultimosReseteos.map((item) => (
              <Box
                key={item.id}
                sx={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 2,
                  p: 1.5,
                }}
              >
                <Typography fontWeight={700}>
                  {item.usuarioObjetivo?.nombre || "Usuario"} (
                  {item.usuarioObjetivo?.rol || "-"})
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Reseteado por: {item.soporte?.nombre || "-"} (
                  {item.soporte?.rol || "-"})
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Fecha: {new Date(item.createdAt).toLocaleString("es-ES")}
                </Typography>
                {item.motivo ? (
                  <Typography variant="body2" color="text.secondary">
                    Motivo: {item.motivo}
                  </Typography>
                ) : null}
              </Box>
            ))}
          </Stack>
        )}
      </Paper>
    </Box>
  );
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        let decoded = null;

        if (token) {
          try {
            decoded = jwtDecode(token);
          } catch (error) {
            decoded = null;
          }
        }

        const normalizedRole = normalizeRole(decoded?.rol ?? "ALUMNO");

        setRole(normalizedRole);

        const endpoint =
          normalizedRole === "ALUMNO"
            ? "/dashboard/student"
            : normalizedRole === "PROFESOR"
              ? "/dashboard/professor"
              : normalizedRole === "ADMINISTRATIVO"
                ? "/dashboard/administrativo"
                : normalizedRole === "SOPORTE"
                  ? "/dashboard/soporte"
                  : "/dashboard/executive";

        const response = await api.get(endpoint);

        setMetrics(response.data);
      } catch (error) {
        console.error(error);
        setErrorMessage(
          error?.response?.data?.message ||
            "No se pudo cargar la información del dashboard.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <p>Cargando dashboard...</p>;
  }

  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }

  if (!metrics) {
    return <p>No hay datos de dashboard disponibles.</p>;
  }

  if (role === "PROFESOR") {
    return <ProfessorDashboard data={metrics} />;
  }

  if (role === "ALUMNO") {
    return <StudentDashboard data={metrics} />;
  }

  if (role === "SOPORTE") {
    return <SupportDashboardView metrics={metrics} />;
  }

  return <AdminDashboardView metrics={metrics} />;
}
