import { useEffect, useRef, useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Grid,
  IconButton,
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

function AdminDashboardView({ metrics }) {
  const studentsRef = useRef(null);
  const professorsRef = useRef(null);

  const scrollRanking = (ref, direction) => {
    if (!ref.current) {
      return;
    }

    ref.current.scrollBy({
      left: direction === "left" ? -360 : 360,
      behavior: "smooth",
    });
  };

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
      title: "Clases Programadas",
      value: metrics.scheduledClasses ?? 0,
      icon: <DirectionsCarIcon />,
      color: "#0f172a",
    },
    {
      title: "Exámenes Pendientes",
      value: metrics.pendingExams ?? 0,
      icon: <AssignmentIcon />,
      color: "#ea580c",
    },
    {
      title: "Tasa de Éxito",
      value: `${Number(metrics.successRate || 0).toFixed(1)}%`,
      icon: <TrendingUpIcon />,
      color: "#16a34a",
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
        <Typography variant="body2" fontWeight={700} sx={{ fontSize: 12 }}>
          Mes: {metrics.matriculasPendientesMes ?? 0} | Histórico:{" "}
          {metrics.matriculasPendientesHistorico ?? 0}
        </Typography>
      ),
      icon: <AccessTimeFilledIcon />,
      color: "#b45309",
      wide: true,
    },
    {
      title: "Teórico APTO",
      value: (
        <Typography variant="body2" fontWeight={700} sx={{ fontSize: 12 }}>
          Mes: {metrics.aprobadosTeoricoMes ?? 0} | Histórico:{" "}
          {metrics.aprobadosTeoricoHistorico ?? 0}
        </Typography>
      ),
      icon: <SchoolIcon />,
      color: "#0369a1",
      wide: true,
    },
    {
      title: "Práctico APTO",
      value: (
        <Typography variant="body2" fontWeight={700} sx={{ fontSize: 12 }}>
          Mes: {metrics.aprobadosPracticoMes ?? 0} | Histórico:{" "}
          {metrics.aprobadosPracticoHistorico ?? 0}
        </Typography>
      ),
      icon: <EmojiEventsIcon />,
      color: "#7c2d12",
      wide: true,
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
        {/* Tarjeta 1: Profesor más activo */}
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
                  <Typography variant="h6" fontWeight="bold" sx={{ mt: 0.5 }}>
                    {metrics.pendingClassConfirmations ?? 0}
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
                    {Number(metrics.pendingClassHours || 0).toFixed(1)} h
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
                  <Typography variant="h4" fontWeight="bold">
                    {metrics.pendingExams ?? 0}
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
                  <Typography variant="h4" fontWeight="bold">
                    {metrics.examsThisMonth ?? 0}
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
                  <Typography variant="h4" fontWeight="bold">
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
                  <Typography variant="h4" fontWeight="bold">
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
                  <Typography variant="h4" fontWeight="bold">
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
                  <Typography variant="h4" fontWeight="bold">
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
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  Top 5 Alumnos DGT (tasa de aprobado)
                </Typography>
                <Box>
                  <IconButton
                    size="small"
                    onClick={() => scrollRanking(studentsRef, "left")}
                  >
                    <ArrowBackIosNewIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => scrollRanking(studentsRef, "right")}
                  >
                    <ArrowForwardIosIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              <Box
                ref={studentsRef}
                sx={{
                  display: "flex",
                  gap: 2,
                  overflowX: "auto",
                  pb: 1,
                  mt: 1,
                }}
              >
                {(metrics.topStudents || []).map((student, index) => (
                  <Card key={`${student.nombre}-${index}`} variant="outlined">
                    <CardContent sx={{ minWidth: 240 }}>
                      <Typography
                        fontWeight={800}
                      >{`${index + 1}. ${student.nombre}`}</Typography>
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
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  Top 5 Profesores (tasa de aprobado)
                </Typography>
                <Box>
                  <IconButton
                    size="small"
                    onClick={() => scrollRanking(professorsRef, "left")}
                  >
                    <ArrowBackIosNewIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => scrollRanking(professorsRef, "right")}
                  >
                    <ArrowForwardIosIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              <Box
                ref={professorsRef}
                sx={{
                  display: "flex",
                  gap: 2,
                  overflowX: "auto",
                  pb: 1,
                  mt: 1,
                }}
              >
                {(metrics.topProfessors || []).map((profesor, index) => (
                  <Card key={`${profesor.nombre}-${index}`} variant="outlined">
                    <CardContent sx={{ minWidth: 240 }}>
                      <Typography
                        fontWeight={800}
                      >{`${index + 1}. ${profesor.nombre}`}</Typography>
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

        setRole(decoded?.rol ?? "ALUMNO");

        const endpoint =
          decoded?.rol === "ALUMNO"
            ? "/dashboard/student"
            : decoded?.rol === "PROFESOR"
              ? "/dashboard/professor"
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

  return <AdminDashboardView metrics={metrics} />;
}
