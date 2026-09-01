import {
  Box,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Typography,
  Button,
  Chip,
  Stack,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import VerifiedIcon from "@mui/icons-material/Verified";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";

import SchoolIcon from "@mui/icons-material/School";
import BookIcon from "@mui/icons-material/Book";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import EventAvailableIcon from "@mui/icons-material/EventAvailable";

function DashboardStatCard({ icon, title, value, subtitle, color }) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        border: "1px solid #e2e8f0",
        boxShadow: "0 12px 30px rgba(15,23,42,0.06)",
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>

            <Typography variant="h5" fontWeight={800} sx={{ mt: 0.5 }}>
              {value}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 999,
              display: "grid",
              placeItems: "center",
              backgroundColor: color,
              color: "#fff",
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

function SectionTitle({ icon, title, subtitle }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Box display="flex" alignItems="center" gap={1}>
        <Typography variant="h5" fontWeight={1000}>
          {icon} {title}
        </Typography>
      </Box>

      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}

export default function ProfessorDashboard() {
  const data = {
    assignedStudents: 18,
    readyStudents: 5,
    averageTests: 6.4,
    weeklyClasses: 12,
  };

  const evolutionData = [
    { month: "Mar", successRate: 68 },
    { month: "Abr", successRate: 72 },
    { month: "May", successRate: 75 },
    { month: "Jun", successRate: 79 },
    { month: "Jul", successRate: 84 },
    { month: "Ago", successRate: 87 },
  ];

  const difficultTopics = [
    {
      topic: "Prioridad de paso",
      errorRate: 42,
    },
    {
      topic: "Señalización vertical",
      errorRate: 35,
    },
    {
      topic: "Velocidad y distancia",
      errorRate: 29,
    },
  ];

  const upcomingClasses = [
    {
      id: 1,
      student: "Pedro López",
      date: "28 Ago 2026 - 16:00",
      vehicle: "1234ABC",
      duration: "60 min",
    },
    {
      id: 2,
      student: "Ana Ruiz",
      date: "28 Ago 2026 - 18:00",
      vehicle: "5678DEF",
      duration: "45 min",
    },
    {
      id: 3,
      student: "Laura Gómez",
      date: "29 Ago 2026 - 10:00",
      vehicle: "7890XYZ",
      duration: "60 min",
    },
  ];

  const readyForExamStudents = [
    {
      id: 1,
      name: "Pedro López",
      successRate: 91,
      testsCompleted: 22,
      practicalHours: 18,
      licence: "B",
    },
    {
      id: 2,
      name: "Ana Ruiz",
      successRate: 88,
      testsCompleted: 27,
      practicalHours: 21,
      licence: "B",
    },
    {
      id: 3,
      name: "Laura Gómez",
      successRate: 85,
      testsCompleted: 19,
      practicalHours: 16,
      licence: "B",
    },
  ];

  const recommendations = [
    "5 alumnos muestran nivel suficiente para presentarse al examen teórico.",
    "Prioridad de paso continúa siendo el tema con más errores.",
    "Hay 12 clases prácticas programadas esta semana.",
    "El porcentaje medio de aciertos ha aumentado durante los últimos 6 meses.",
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Box
        sx={{
          p: 3,
          borderRadius: 4,
          background:
            "linear-gradient(135deg, rgba(15,23,42,1) 0%, rgba(30,64,175,1) 100%)",
          color: "#fff",
          boxShadow: "0 18px 40px rgba(15,23,42,0.18)",
        }}
      >
        <Typography variant="h4" fontWeight={900}>
          Panel del Profesor
        </Typography>

        <Typography
          sx={{
            mt: 1,
            color: "rgba(255,255,255,0.88)",
          }}
        >
          Resumen de actividad de tus alumnos, seguimiento teórico y
          planificación de clases prácticas.
        </Typography>
      </Box>

      <Grid container spacing={5}>
        <Grid item xs={12} sm={6} lg={3}>
          <DashboardStatCard
            icon={<PersonIcon />}
            title="Alumnos Asignados"
            value={data.assignedStudents}
            subtitle="Bajo tu seguimiento"
            color="#2563eb"
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <DashboardStatCard
            icon={<VerifiedIcon />}
            title="Preparados"
            value={data.readyStudents}
            subtitle="Listos para examen"
            color="#16a34a"
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <DashboardStatCard
            icon={<AssignmentIcon />}
            title="Tests / Alumno"
            value={data.averageTests}
            subtitle="Media del grupo"
            color="#0f172a"
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <DashboardStatCard
            icon={<DirectionsCarIcon />}
            title="Clases Semana"
            value={data.weeklyClasses}
            subtitle="Programadas"
            color="#7c3aed"
          />
        </Grid>
      </Grid>
      <Grid container spacing={5}>
        <Grid item xs={12} lg={3}>
          <Card
            sx={{
              borderRadius: 3,
              height: 440,
              height: "100%",
            }}
          >
            <CardContent>
              <SectionTitle
                icon={<SchoolIcon sx={{ color: "#2563eb" }} />}
                title="Evolución del Aprendizaje"
                subtitle="Media de porcentaje de aciertos del grupo durante los últimos meses."
              />

              {/* 🌟 AQUÍ SE AÑADE EL CENTRADO HORIZONTAL (justifyContent="center") 🌟 */}
              <Grid
                container
                spacing={1}
                alignItems="end"
                justifyContent="center"
              >
                {evolutionData.map((item) => (
                  /* 🌟 Cambiamos 'xs' por 'xs="auto"' para que cada barra ocupe solo su ancho real y se puedan centrar en bloque */
                  <Grid item xs="auto" key={item.month}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 1,
                        width: 70, // 💡 Opcional: Le da un ancho fijo a cada columna de mes para que no se peguen si hay pocos datos
                      }}
                    >
                      <Box
                        sx={{
                          width: "100%",
                          minHeight: 120,
                          display: "flex",
                          alignItems: "end",
                          justifyContent: "center",
                        }}
                      >
                        <Box
                          sx={{
                            width: 35,
                            height: `${item.successRate * 1.2}px`,
                            borderRadius: 999,
                            background:
                              "linear-gradient(180deg, #2563eb 0%, #60a5fa 100%)",
                          }}
                        />
                      </Box>

                      <Typography variant="caption">{item.month}</Typography>

                      <Typography variant="body2" fontWeight={700}>
                        {item.successRate}%
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={3}>
          <Card
            sx={{
              borderRadius: 3,
              height: 440,
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <SectionTitle
                icon={
                  <BookIcon
                    sx={{
                      color: "#7c3aed",
                    }}
                  />
                }
                title="Temas con Mayor Dificultad"
                subtitle="Bloques donde los alumnos presentan más errores."
              />

              {difficultTopics.map((topic) => (
                <Box key={topic.topic} sx={{ mb: 3 }}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    sx={{ mb: 1 }}
                  >
                    <Typography variant="body2" fontWeight={600}>
                      {topic.topic}
                    </Typography>

                    <Typography variant="body2" fontWeight={700}>
                      {topic.errorRate}%
                    </Typography>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={topic.errorRate}
                    sx={{
                      height: 10,
                      borderRadius: 999,
                    }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={3}>
          <Card
            sx={{
              borderRadius: 3,
              height: 440,
              overflowY: "auto",
            }}
          >
            <CardContent>
              <SectionTitle
                icon={
                  <EventAvailableIcon
                    sx={{
                      color: "#7c3aed",
                    }}
                  />
                }
                title="Próximas Clases Prácticas"
                subtitle="Agenda de clases reservadas por los alumnos asignados."
              />

              <Box
                sx={{
                  maxHeight: 320,
                  overflowY: "auto",
                  pr: 4,
                }}
              >
                <List disablePadding>
                  {upcomingClasses.map((clase) => (
                    <ListItem
                      key={clase.id}
                      sx={{
                        px: 0,
                        py: 2,
                        borderBottom: "1px solid #e2e8f0",
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography fontWeight={700}>
                            {clase.student}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" color="text.secondary">
                              {clase.date}
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                              Vehículo: {clase.vehicle}
                            </Typography>
                          </>
                        }
                      />

                      <Typography fontWeight={700} color="primary">
                        {clase.duration}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={3}>
          <Card
            sx={{
              borderRadius: 3,
              height: 440,
            }}
          >
            <CardContent>
              <SectionTitle
                icon={
                  <VerifiedIcon
                    sx={{
                      color: "#16a34a",
                    }}
                  />
                }
                title="Alumnos Preparados para Examen"
                subtitle="Alumnos que presentan mejores indicadores de preparación."
              />

              <Stack
                spacing={2}
                sx={{
                  maxHeight: 320,
                  overflowY: "auto",
                  pr: 2,
                }}
              >
                {readyForExamStudents.map((student) => (
                  <Box
                    key={student.id}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      border: "1px solid #e2e8f0",
                      backgroundColor: "#fff",
                    }}
                  >
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      flexWrap="wrap"
                      gap={2}
                    >
                      <Box>
                        <Typography variant="subtitle1" fontWeight={800}>
                          {student.name}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                          Permiso {student.licence}
                        </Typography>
                      </Box>

                      <Chip
                        label={`${student.successRate}% éxito`}
                        color="success"
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        gap: 4,
                        mt: 2,
                        flexWrap: "wrap",
                      }}
                    >
                      <Typography variant="body2">
                        <strong>Tests:</strong> {student.testsCompleted}
                      </Typography>

                      <Typography variant="body2">
                        <strong>Horas:</strong> {student.practicalHours}
                      </Typography>
                    </Box>

                    <Box sx={{ mt: 2 }}>
                      <Button variant="contained" color="success">
                        Proponer examen
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card
        sx={{
          borderRadius: 3,
          backgroundColor:
            "linear-gradient(100deg, #ffffff, 0%, #f8fafc, 100%)",
        }}
      >
        <CardContent>
          <SectionTitle
            icon={
              <TipsAndUpdatesIcon
                sx={{
                  color: "#f59e0b",
                }}
              />
            }
            title="Recomendaciones del Profesor"
            subtitle="Resumen automático de la situación actual del grupo."
          />

          <Stack spacing={2}>
            {recommendations.map((recommendation, index) => (
              <Box
                key={index}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  backgroundColor: "#f8fafc",
                  border: "1px solid #e2e8f0",
                }}
              >
                <Typography>• {recommendation}</Typography>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
