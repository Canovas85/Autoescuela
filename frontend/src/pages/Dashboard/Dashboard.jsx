import { useEffect, useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SchoolIcon from "@mui/icons-material/School";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PeopleIcon from "@mui/icons-material/People";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";

import DGTChart from "../../components/dashboard/DGTChart";
import DGTSummaryChart from "../../components/dashboard/DGTSummaryChart";

import { jwtDecode } from "jwt-decode";

import SuccessChart from "../../components/dashboard/SuccessChart";
import StudentDashboard from "./StudentDashboard";
import ProfessorDashboard from "./ProfessorDashboard";

import { api } from "../../services/api";

function AdminDashboardView({ metrics }) {
  const cards = [
    {
      title: "Alumnos Activos",
      value: metrics.activeStudents ?? 0,
      icon: <PeopleIcon />,
      color: "#2563eb",
    },
    {
      title: "Matrículas Activas",
      value: metrics.activeEnrollments ?? 0,
      icon: <AppRegistrationIcon />,
      color: "#7c3aed",
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
      value: `${metrics.successRate.toFixed(1)}%`,
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

                    <Typography variant="h4" fontWeight="bold">
                      {card.value}
                    </Typography>
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
        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">
                Profesor más activo
              </Typography>

              <Typography variant="h5" fontWeight="bold" sx={{ mt: 1 }}>
                {metrics.topProfesorByClasses?.nombre ?? "Sin datos"}
              </Typography>

              <Typography variant="body1">
                {metrics.topProfesorByClasses?.totalClases ?? 0} clases
                impartidas
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">
                Profesor con más horas
              </Typography>

              <Typography variant="h5" fontWeight="bold" sx={{ mt: 1 }}>
                {metrics.topProfesorByHours?.nombre ?? "Sin datos"}
              </Typography>

              <Typography variant="body1">
                {metrics.topProfesorByHours?.horas ?? 0} horas impartidas
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">
                Exámenes Programados
              </Typography>

              <Typography variant="h4" fontWeight="bold">
                {metrics.pendingExams ?? 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">Exámenes Este Mes</Typography>

              <Typography variant="h4" fontWeight="bold">
                {metrics.examsThisMonth ?? 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h5" fontWeight="bold" sx={{ mt: 4 }}>
        Analítica DGT
      </Typography>

      <Box sx={{ height: 20 }} />

      <Grid container spacing={3}>
        <Grid xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">Tests Hoy</Typography>

              <Typography variant="h4">{metrics.dgtTestsToday ?? 0}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">Tests Mes</Typography>

              <Typography variant="h4">
                {metrics.dgtTestsThisMonth ?? 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">% Aprobados</Typography>

              <Typography variant="h4">
                {metrics.dgtSuccessRate?.toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">Total Tests</Typography>

              <Typography variant="h4">{metrics.totalDgtTests ?? 0}</Typography>
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
        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold">
                Top 5 Alumnos DGT
              </Typography>

              <List>
                {metrics.topStudents?.map((student, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`${index + 1}. ${student.nombre}`}
                      secondary={`${student.porcentaje.toFixed(
                        1,
                      )}% aprobados · ${student.totalTests} tests`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold">
                Top Profesores
              </Typography>

              <List>
                {metrics.topProfessors?.map((profesor, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`${index + 1}. ${profesor.nombre}`}
                      secondary={`${profesor.totalClases} clases impartidas`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ height: 40 }} />

      <Typography variant="h5" fontWeight="bold">
        Evolución de aprobados
      </Typography>

      <Box sx={{ height: 20 }} />

      <Card
        sx={{
          width: 900,
          maxWidth: "100%",
          p: 2,
        }}
      >
        <SuccessChart />
      </Card>

      <Box sx={{ height: 40 }} />

      <Typography variant="h5" fontWeight="bold">
        Evolución DGT
      </Typography>

      <Box sx={{ height: 20 }} />

      <Card sx={{ p: 2 }}>
        <DGTChart data={metrics.dgtEvolution || []} />
      </Card>

      <Box sx={{ height: 40 }} />

      <Typography variant="h5" fontWeight="bold">
        Distribución DGT
      </Typography>

      <Box sx={{ height: 20 }} />

      <Card sx={{ p: 2 }}>
        <DGTSummaryChart
          aprobados={metrics.dgtSummary?.aprobados ?? 0}
          suspendidos={metrics.dgtSummary?.suspendidos ?? 0}
        />
      </Card>

      <Box sx={{ height: 40 }} />
      <Typography variant="h5" fontWeight="bold">
        Actividad reciente
      </Typography>

      <Box sx={{ height: 20 }} />

      <Card>
        <List sx={{ py: 2 }}>
          <ListItem sx={{ py: 1.5 }}>
            <ListItemIcon>
              <PersonAddIcon
                sx={{
                  color: "#16a34a",
                }}
              />
            </ListItemIcon>

            <ListItemText
              primary="Nuevo alumno registrado"
              secondary="Hace 2 horas"
            />
          </ListItem>

          <ListItem sx={{ py: 1.5 }}>
            <ListItemIcon>
              <SchoolIcon
                sx={{
                  color: "#2563eb",
                }}
              />
            </ListItemIcon>

            <ListItemText
              primary="Clase práctica creada"
              secondary="Hace 4 horas"
            />
          </ListItem>

          <ListItem sx={{ py: 1.5 }}>
            <ListItemIcon>
              <EventNoteIcon
                sx={{
                  color: "#f97316",
                }}
              />
            </ListItemIcon>

            <ListItemText primary="Examen programado" secondary="Hace 1 día" />
          </ListItem>
        </List>
      </Card>
    </Box>
  );
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        if (token) {
          try {
            const decodedToken = jwtDecode(token);
            setRole(decodedToken?.rol ?? "ALUMNO");
          } catch (error) {
            setRole("ALUMNO");
          }
        }

        const decoded = token ? jwtDecode(token) : null;

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
      }
    };

    loadDashboard();
  }, []);

  if (!metrics) {
    return <p>Cargando dashboard...</p>;
  }

  if (role === "PROFESOR") {
    return <ProfessorDashboard data={metrics} />;
  }

  if (role === "ALUMNO") {
    return <StudentDashboard data={metrics} />;
  }

  return <AdminDashboardView metrics={metrics} />;
}
