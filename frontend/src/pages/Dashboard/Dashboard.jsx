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
import { jwtDecode } from "jwt-decode";

import SuccessChart from "../../components/dashboard/SuccessChart";
import StudentDashboard from "./StudentDashboard";

import { api } from "../../services/api";

function AdminDashboardView({ metrics }) {
  const cards = [
    {
      title: "Tasa de Éxito",
      value: `${metrics.successRate.toFixed(1)}%`,
      icon: <TrendingUpIcon />,
      color: "#16a34a",
    },
    {
      title: "Éxito Mensual",
      value: `${metrics.monthlySuccessRate.toFixed(1)}%`,
      icon: <CalendarMonthIcon />,
      color: "#2563eb",
    },
    {
      title: "Exámenes Pendientes",
      value: metrics.pendingExams,
      icon: <AssignmentIcon />,
      color: "#ea580c",
    },
    {
      title: "Clases Programadas",
      value: metrics.scheduledClasses,
      icon: <DirectionsCarIcon />,
      color: "#0f172a",
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
          <Grid item xs={12} md={6} lg={3} key={card.title}>
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
        Profesores destacados
      </Typography>

      <Box sx={{ height: 20 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography color="text.secondary">
                    Profesor más activo
                  </Typography>

                  <Typography variant="h4" fontWeight="bold">
                    {metrics.topProfesorByClasses?.totalClases ?? 0}
                  </Typography>

                  <Typography variant="body2">clases impartidas</Typography>
                </Box>

                <EmojiEventsIcon
                  sx={{
                    fontSize: 50,
                    color: "#f59e0b",
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography color="text.secondary">
                    Profesor con más horas
                  </Typography>

                  <Typography variant="h4" fontWeight="bold">
                    {metrics.topProfesorByHours?.horas ?? 0}
                  </Typography>

                  <Typography variant="body2">horas impartidas</Typography>
                </Box>

                <AccessTimeFilledIcon
                  sx={{
                    fontSize: 50,
                    color: "#2563eb",
                  }}
                />
              </Box>
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

  if (role === "ALUMNO") {
    return <StudentDashboard data={metrics} />;
  }

  return <AdminDashboardView metrics={metrics} />;
}
