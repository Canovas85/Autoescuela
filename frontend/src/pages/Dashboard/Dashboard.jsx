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
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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

import { jwtDecode } from "jwt-decode";

import StudentDashboard from "./StudentDashboard";
import ProfessorDashboard from "./ProfessorDashboard";
import { LicenseChip } from "../../components/common/LicenseChip";

import { dashboardService } from "../../services/dashboardService";

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
  const adminOverview = metrics.adminOverview || {};
  const matriculasAlumnos = adminOverview.matriculasAlumnos || {};
  const usuarios = adminOverview.usuarios || {};
  const promociones = adminOverview.promociones || {};
  const bonos = adminOverview.bonos || {};
  const clasesPracticas = adminOverview.clasesPracticas || {};
  const evaluaciones = adminOverview.evaluaciones || {};
  const evaluacionTeorico = evaluaciones.teorico || {};
  const evaluacionPractico = evaluaciones.practico || {};

  const donutColors = [
    "#ea580c",
    "#2563eb",
    "#16a34a",
    "#eab308",
    "#9333ea",
    "#0891b2",
    "#be123c",
  ];

  const currentPromotions = promociones.items || [];
  const currentBonos = bonos.items || [];
  const promoPurchases = promociones.comprasMesPorPromocion || [];
  const bonoPurchases = bonos.comprasMesPorBono || [];

  const [studentsStart, setStudentsStart] = useState(0);
  const [professorsStart, setProfessorsStart] = useState(0);
  const [promotionsStart, setPromotionsStart] = useState(0);
  const [bonosStart, setBonosStart] = useState(0);

  const studentsMaxStart = Math.max(0, topStudents.length - VISIBLE_RANK_ITEMS);
  const professorsMaxStart = Math.max(
    0,
    topProfessors.length - VISIBLE_RANK_ITEMS,
  );
  const promotionsMaxStart = Math.max(
    0,
    currentPromotions.length - VISIBLE_RANK_ITEMS,
  );
  const bonosMaxStart = Math.max(0, currentBonos.length - VISIBLE_RANK_ITEMS);

  useEffect(() => {
    setStudentsStart((current) => Math.min(current, studentsMaxStart));
  }, [studentsMaxStart]);

  useEffect(() => {
    setProfessorsStart((current) => Math.min(current, professorsMaxStart));
  }, [professorsMaxStart]);

  useEffect(() => {
    setPromotionsStart((current) => Math.min(current, promotionsMaxStart));
  }, [promotionsMaxStart]);

  useEffect(() => {
    setBonosStart((current) => Math.min(current, bonosMaxStart));
  }, [bonosMaxStart]);

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

  const visiblePromotions = useMemo(
    () =>
      currentPromotions.slice(
        promotionsStart,
        promotionsStart + VISIBLE_RANK_ITEMS,
      ),
    [currentPromotions, promotionsStart],
  );

  const visibleBonos = useMemo(
    () => currentBonos.slice(bonosStart, bonosStart + VISIBLE_RANK_ITEMS),
    [currentBonos, bonosStart],
  );

  const cardsMatriculas = [
    {
      title: "Alumnos Registrados",
      value: matriculasAlumnos.alumnosRegistrados ?? 0,
      subtitle: "Solo alumnos activos",
      icon: <PeopleIcon />,
      color: "#2563eb",
    },
    {
      title: "Alumnos Licenciados",
      value: matriculasAlumnos.alumnosLicenciados ?? 0,
      subtitle: "Estado expediente LICENCIA_OBTENIDA",
      icon: <EmojiEventsIcon />,
      color: "#16a34a",
    },
    {
      title: "Alumnos Matriculados",
      value: matriculasAlumnos.alumnosMatriculados ?? 0,
      subtitle: "Matrícula pagada sin licencia obtenida",
      icon: <AssignmentIcon />,
      color: "#7c3aed",
    },
    {
      title: "Matrícula Pendiente de Pago",
      value: matriculasAlumnos.alumnosMatriculaPendientePago ?? 0,
      subtitle: "Alumnos activos con matrícula pendiente",
      icon: <AccessTimeFilledIcon />,
      color: "#ea580c",
    },
  ];

  const cardsUsuarios = [
    {
      title: "Profesores Registrados",
      value: usuarios.profesoresRegistrados ?? 0,
      icon: <SchoolIcon />,
      color: "#0369a1",
    },
    {
      title: "Administrativos Registrados",
      value: usuarios.administrativosRegistrados ?? 0,
      icon: <AppRegistrationIcon />,
      color: "#475569",
    },
    {
      title: "Soportes Registrados",
      value: usuarios.soportesRegistrados ?? 0,
      icon: <GroupIcon />,
      color: "#0f766e",
    },
  ];

  const cardsClases = [
    {
      title: "Clases Totales",
      value: clasesPracticas.clasesTotales ?? 0,
      subtitle: "Completadas + solicitadas",
      icon: <DirectionsCarIcon />,
      color: "#1d4ed8",
    },
    {
      title: "Clases Completadas este Mes",
      value: clasesPracticas.clasesCompletadasMes ?? 0,
      subtitle: "Clases prácticas completadas",
      icon: <EmojiEventsIcon />,
      color: "#15803d",
    },
    {
      title: "Clases Solicitadas este Mes",
      value: clasesPracticas.clasesSolicitadasMes ?? 0,
      subtitle: "Solicitudes programadas y confirmadas",
      icon: <CalendarMonthIcon />,
      color: "#7c3aed",
    },
    {
      title: "Pagadas fuera de Bono",
      value: clasesPracticas.clasesPagadasFueraBono ?? 0,
      subtitle: "Clases individuales pagadas",
      icon: <DirectionsCarIcon />,
      color: "#b45309",
    },
  ];

  const cardsEvaluaciones = [
    {
      title: "Teórico APTO",
      value: `Mes: ${evaluacionTeorico.aptoMes ?? 0}`,
      subtitle: `Histórico: ${evaluacionTeorico.aptoHistorico ?? 0}`,
      color: "#15803d",
    },
    {
      title: "Teórico NO APTO",
      value: `Mes: ${evaluacionTeorico.noAptoMes ?? 0}`,
      subtitle: `Histórico: ${evaluacionTeorico.noAptoHistorico ?? 0}`,
      color: "#dc2626",
    },
    {
      title: "Tasa Éxito Teórico (Mes)",
      value: `${Number(evaluacionTeorico.tasaExitoMes || 0).toFixed(1)}%`,
      subtitle: `Presentados: ${evaluacionTeorico.presentadosMes ?? 0}`,
      color: "#2563eb",
    },
    {
      title: "Tasa Éxito Teórico (Histórico)",
      value: `${Number(evaluacionTeorico.tasaExitoHistorico || 0).toFixed(1)}%`,
      subtitle: `Presentados: ${evaluacionTeorico.presentadosHistorico ?? 0}`,
      color: "#1e3a8a",
    },
    {
      title: "Práctico APTO",
      value: `Mes: ${evaluacionPractico.aptoMes ?? 0}`,
      subtitle: `Histórico: ${evaluacionPractico.aptoHistorico ?? 0}`,
      color: "#166534",
    },
    {
      title: "Práctico NO APTO",
      value: `Mes: ${evaluacionPractico.noAptoMes ?? 0}`,
      subtitle: `Histórico: ${evaluacionPractico.noAptoHistorico ?? 0}`,
      color: "#be123c",
    },
    {
      title: "Tasa Éxito Práctico (Mes)",
      value: `${Number(evaluacionPractico.tasaExitoMes || 0).toFixed(1)}%`,
      subtitle: `Presentados: ${evaluacionPractico.presentadosMes ?? 0}`,
      color: "#0f766e",
    },
    {
      title: "Tasa Éxito Práctico (Histórico)",
      value: `${Number(evaluacionPractico.tasaExitoHistorico || 0).toFixed(1)}%`,
      subtitle: `Presentados: ${evaluacionPractico.presentadosHistorico ?? 0}`,
      color: "#0f172a",
    },
    {
      title: "Evaluaciones Pendientes Teórico",
      value: evaluacionTeorico.pendientes ?? 0,
      subtitle: "Convocatorias futuras con alumnos inscritos",
      color: "#7c2d12",
    },
    {
      title: "Evaluaciones Pendientes Práctico",
      value: evaluacionPractico.pendientes ?? 0,
      subtitle: "Convocatorias futuras con alumnos inscritos",
      color: "#7f1d1d",
    },
  ];

  const StatCard = ({ title, value, subtitle, icon, color }) => (
    <Card sx={{ borderRadius: 2, height: "100%" }}>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box sx={{ pr: 1 }}>
            <Typography color="text.secondary" variant="body2">
              {title}
            </Typography>
            <Typography variant="h6" fontWeight={800} sx={{ mt: 0.5 }}>
              {value}
            </Typography>
            {subtitle ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                {subtitle}
              </Typography>
            ) : null}
          </Box>

          {icon ? (
            <Box sx={{ color, fontSize: 30, mt: 0.5 }}>{icon}</Box>
          ) : (
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: 999,
                mt: 1,
                background: color,
              }}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold">
        Dashboard Ejecutivo
      </Typography>

      <Box sx={{ height: 24 }} />

      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
        Matrículas y Alumnos
      </Typography>

      <Grid container spacing={2} alignItems="stretch">
        {cardsMatriculas.map((card) => (
          <Grid key={card.title} item xs={12} sm={6} lg={2}>
            <StatCard {...card} />
          </Grid>
        ))}

        <Grid item xs={12} lg={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1 }}>
                Alumnos matriculados por mes
              </Typography>
              <Box sx={{ width: "100%", height: 190 }}>
                <ResponsiveContainer>
                  <BarChart data={matriculasAlumnos.matriculadosPorMes || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="total" name="Matriculados" fill="#2563eb" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h5" fontWeight="bold" sx={{ mt: 4, mb: 2 }}>
        Profesores y Otros Usuarios
      </Typography>

      <Grid container spacing={2}>
        {cardsUsuarios.map((card) => (
          <Grid key={card.title} item xs={12} md={4}>
            <StatCard {...card} />
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" fontWeight="bold" sx={{ mt: 4 }}>
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

      <Typography variant="h5" fontWeight="bold" sx={{ mt: 4, mb: 2 }}>
        Promociones Actuales
      </Typography>

      <Card>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography variant="subtitle1" fontWeight={800}>
              Promociones activas y vigentes
            </Typography>
            <Box>
              <IconButton
                size="small"
                onClick={() =>
                  setPromotionsStart((current) => Math.max(0, current - 1))
                }
                disabled={promotionsStart === 0}
              >
                <ArrowBackIosNewIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() =>
                  setPromotionsStart((current) =>
                    Math.min(promotionsMaxStart, current + 1),
                  )
                }
                disabled={promotionsStart >= promotionsMaxStart}
              >
                <ArrowForwardIosIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {visiblePromotions.length === 0 ? (
            <Typography color="text.secondary">
              No hay promociones vigentes actualmente.
            </Typography>
          ) : (
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
              }}
            >
              {visiblePromotions.map((promo) => (
                <Card key={promo.id} variant="outlined">
                  <CardContent>
                    <Typography fontWeight={800}>{promo.nombre}</Typography>
                    <Box sx={{ mt: 1, mb: 1 }}>
                      {(promo.licenciasAplicables || []).map((licencia) => (
                        <LicenseChip
                          key={`${promo.id}-${licencia}`}
                          value={licencia}
                        />
                      ))}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Original: {Number(promo.precioOriginal || 0).toFixed(2)}{" "}
                      EUR
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Oferta: {Number(promo.precioPromocional || 0).toFixed(2)}{" "}
                      EUR
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Vigencia:{" "}
                      {promo.fechaInicio
                        ? new Date(promo.fechaInicio).toLocaleDateString(
                            "es-ES",
                          )
                        : "Sin inicio"}{" "}
                      -{" "}
                      {promo.fechaFin
                        ? new Date(promo.fechaFin).toLocaleDateString("es-ES")
                        : "Sin fin"}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      <Typography variant="h5" fontWeight="bold" sx={{ mt: 4, mb: 2 }}>
        Bonos Actuales
      </Typography>

      <Card>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography variant="subtitle1" fontWeight={800}>
              Bonos activos
            </Typography>
            <Box>
              <IconButton
                size="small"
                onClick={() =>
                  setBonosStart((current) => Math.max(0, current - 1))
                }
                disabled={bonosStart === 0}
              >
                <ArrowBackIosNewIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() =>
                  setBonosStart((current) =>
                    Math.min(bonosMaxStart, current + 1),
                  )
                }
                disabled={bonosStart >= bonosMaxStart}
              >
                <ArrowForwardIosIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {visibleBonos.length === 0 ? (
            <Typography color="text.secondary">
              No hay bonos activos actualmente.
            </Typography>
          ) : (
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
              }}
            >
              {visibleBonos.map((bono) => (
                <Card key={bono.id} variant="outlined">
                  <CardContent>
                    <Typography fontWeight={800}>{bono.nombre}</Typography>
                    <Box sx={{ mt: 1, mb: 1 }}>
                      <LicenseChip value={bono.licencia} />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Precio: {Number(bono.precio || 0).toFixed(2)} EUR
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Clases: {bono.clasesIncluidas ?? 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Validez: {bono.validezDias ?? 0} días
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      <Grid container spacing={2} sx={{ mt: 0.5 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1 }}>
                Compras de promociones pagadas este mes
              </Typography>
              <Box sx={{ width: "100%", height: 280 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={promoPurchases}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={95}
                      label
                    >
                      {promoPurchases.map((entry, index) => (
                        <Cell
                          key={`${entry.name}-${index}`}
                          fill={donutColors[index % donutColors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1 }}>
                Compras de bonos pagadas este mes
              </Typography>
              <Box sx={{ width: "100%", height: 280 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={bonoPurchases}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={95}
                      label
                    >
                      {bonoPurchases.map((entry, index) => (
                        <Cell
                          key={`${entry.name}-${index}`}
                          fill={donutColors[index % donutColors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h5" fontWeight="bold" sx={{ mt: 4, mb: 2 }}>
        Clases Prácticas
      </Typography>

      <Grid container spacing={2}>
        {cardsClases.map((card) => (
          <Grid key={card.title} item xs={12} sm={6} lg={3}>
            <StatCard {...card} />
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" fontWeight="bold" sx={{ mt: 4, mb: 2 }}>
        Evaluaciones
      </Typography>

      <Grid container spacing={2}>
        {cardsEvaluaciones.map((card) => (
          <Grid key={card.title} item xs={12} sm={6} md={4} lg={3}>
            <StatCard {...card} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2} sx={{ mt: 0.5 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1 }}>
                Evolución Teórico (Apto / No Apto / Tasa)
              </Typography>
              <Box sx={{ width: "100%", height: 380 }}>
                <ResponsiveContainer>
                  <ComposedChart data={evaluacionTeorico.evolucion || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis yAxisId="left" allowDecimals={false} />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      domain={[0, 100]}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="apto"
                      fill="#16a34a"
                      name="Apto"
                    />
                    <Bar
                      yAxisId="left"
                      dataKey="noApto"
                      fill="#dc2626"
                      name="No apto"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="tasaExito"
                      stroke="#1d4ed8"
                      name="Tasa %"
                      strokeWidth={2}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1 }}>
                Evolución Práctico (Apto / No Apto / Tasa)
              </Typography>
              <Box sx={{ width: "100%", height: 380 }}>
                <ResponsiveContainer>
                  <ComposedChart data={evaluacionPractico.evolucion || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis yAxisId="left" allowDecimals={false} />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      domain={[0, 100]}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="apto"
                      fill="#15803d"
                      name="Apto"
                    />
                    <Bar
                      yAxisId="left"
                      dataKey="noApto"
                      fill="#be123c"
                      name="No apto"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="tasaExito"
                      stroke="#0f766e"
                      name="Tasa %"
                      strokeWidth={2}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ height: 40 }} />
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

        const data = await dashboardService.getByRole(normalizedRole);

        setMetrics(data);
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
