import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";

import { useState } from "react";

import TrafficIcon from "@mui/icons-material/Traffic";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import VerifiedIcon from "@mui/icons-material/Verified";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import BookIcon from "@mui/icons-material/Book";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import EventNoteIcon from "@mui/icons-material/EventNote";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { Button } from "@mui/material";

import { useNavigate } from "react-router-dom";
import { pagosService } from "../../services/pagosService";
import { LicenseChip } from "../../components/common/LicenseChip";
import { PracticalClassTypeChip } from "../../components/common/PracticalClassTypeChip";
import { getPracticalExamTypeLabel } from "../../utils/practicalExamType";

const statusStyles = {
  PAGADA: {
    label: "Pagada",
    color: "success",
    background: "#dcfce7",
    foreground: "#166534",
  },
  PENDIENTE: {
    label: "Pendiente",
    color: "warning",
    background: "#fef3c7",
    foreground: "#92400e",
  },
  APLICABLE: {
    label: "Aplicable",
    color: "success",
    background: "#dcfce7",
    foreground: "#166534",
  },
  AGOTADO: {
    label: "Agotado",
    color: "default",
    background: "#FFEBEE",
    foreground: "#C62828",
  },
  CADUCADO: {
    label: "Caducado",
    color: "error",
    background: "#fee2e2",
    foreground: "#991b1b",
  },
  PENDIENTE_PAGO: {
    label: "Pendiente de pago",
    color: "warning",
    background: "#fef3c7",
    foreground: "#92400e",
  },
};

function formatDate(value) {
  if (!value) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatPercentage(value) {
  return `${Number(value ?? 0).toFixed(1)}%`;
}

function DashboardStatCard({ icon, title, value, subtitle, color }) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        border: "1px solid rgba(148, 163, 184, 0.2)",
        boxShadow: "0 12px 26px rgba(15, 23, 42, 0.05)",
        height: "100%",
      }}
    >
      <CardContent sx={{ py: 1.75, "&:last-child": { pb: 1.75 } }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: 12, letterSpacing: 0.2 }}
            >
              {title}
            </Typography>
            <Typography
              variant="h5"
              fontWeight={800}
              sx={{ mt: 0.5, lineHeight: 1.1 }}
            >
              {value}
            </Typography>
            {subtitle ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5, fontSize: 12, lineHeight: 1.4 }}
              >
                {subtitle}
              </Typography>
            ) : null}
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
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

function statusChip(status, fallbackLabel) {
  // 1. Convertimos el status a mayúsculas para evitar problemas de formato (apto, Apto, APTO)
  const normalizedStatus = String(status).toUpperCase();

  // 2. Definimos estilos específicos para los resultados del examen
  let customConfig = null;

  if (normalizedStatus === "APTO") {
    customConfig = {
      label: fallbackLabel ?? "Apto",
      background: "#E8F5E9", // Verde claro
      foreground: "#1B5E20", // Verde oscuro
    };
  } else if (normalizedStatus === "NO APTO" || normalizedStatus === "NO_APTO") {
    // Si viene fallbackLabel, le quitamos el guion bajo. Si no, forzamos "NO APTO"
    customConfig = {
      label: fallbackLabel
        ? String(fallbackLabel).replace("_", " ")
        : "NO APTO",
      background: "#FFEBEE", // Rojo claro
      foreground: "#C62828", // Rojo oscuro
    };
  }

  // 3. Si no es ninguno de los anteriores, busca en statusStyles o usa el fallback por defecto
  const config = customConfig ??
    statusStyles[status] ?? {
      // Limpia también el texto por defecto en caso de que entre cualquier otro estado con guion bajo
      label: fallbackLabel
        ? String(fallbackLabel).replace("_", " ")
        : String(status).replace("_", " "),
      background: "#F1F5F9", // Gris claro neutral
      foreground: "#475569", // Gris oscuro neutral
    };

  return (
    <Chip
      label={config.label}
      size="small"
      sx={{
        backgroundColor: config.background,
        color: config.foreground,
        fontWeight: 700,
        textTransform: "uppercase", // Fuerza a que "No Apto" se dibuje en pantalla como "NO APTO"
      }}
    />
  );
}

function SectionTitle({ icon, title, subtitle }) {
  return (
    <Box sx={{ mb: 1.5 }}>
      {/* 1. Forzamos flex-row y evitamos que los elementos se vayan a otra línea */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          gap: 1,
        }}
      >
        {/* 2. Aseguramos que el contenedor del icono no crezca ni se deforme */}
        {icon && (
          <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            {icon}
          </Box>
        )}

        {/* 3. Evitamos que el título salte de línea prematuramente */}
        <Typography
          variant="h6"
          fontWeight={800}
          sx={{
            lineHeight: 1.2,
            whiteSpace: "nowrap", // 💡 Opcional: evita que el texto se parta en dos líneas si es largo
          }}
        >
          {title}
        </Typography>
      </Box>

      {subtitle && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.5, lineHeight: 1.4 }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}

export default function StudentDashboard({ data }) {
  const navigate = useNavigate();
  const [temarioIndex, setTemarioIndex] = useState(0);
  const [selectedExam, setSelectedExam] = useState(null);
  const [openExamModal, setOpenExamModal] = useState(false);
  const [showLicenseDetailView, setShowLicenseDetailView] = useState(false);

  if (!data) {
    return <p>Cargando dashboard...</p>;
  }

  const {
    perfil,
    teoria,
    dgt,
    temarios,
    practica,
    bonos,
    examenes,
    reservas,
    evolucion,
    resumen,
  } = data;
  const practicalLicense = perfil?.tipoLicenciaObjetivo || "B";

  const dgtMetrics = dgt || {
    testsTotales: 0,
    testsAprobados: 0,
    testsSuspendidos: 0,
    porcentajeAprobado: 0,
    ultimoResultado: null,
    rachaActual: { tipo: "SIN_DATOS", cantidad: 0 },
    tasa21: {
      pagoPendiente: null,
      ultimoPago: null,
      convocatoriasIncluidas: 0,
      convocatoriasConsumidas: 0,
      convocatoriasDisponibles: 0,
      requiereNuevoPago: false,
    },
  };

  const dgtUltimoResultado = dgtMetrics.ultimoResultado;
  const progressChip = data?.estadoAlumno || {
    label: "Estudiando teórico",
    ok: false,
  };
  const dgtRachaTexto =
    dgtMetrics.rachaActual?.tipo === "APROBADOS"
      ? `${dgtMetrics.rachaActual.cantidad} aprobados seguidos`
      : dgtMetrics.rachaActual?.tipo === "SUSPENSOS"
        ? `${dgtMetrics.rachaActual.cantidad} suspensos seguidos`
        : "Sin racha todavía";
  const isLicenseObtained = progressChip?.codigo === "LICENCIA_OBTENIDA";
  const obtainedLicenseCode =
    perfil?.licenciaObtenidaPrincipal || perfil?.licenciasObtenidas?.[0] || "B";
  const studentName = perfil?.nombre || "Alumno";

  const matriculaPendiente = resumen?.matricula === "PENDIENTE";
  const pagoTasaPendiente = Boolean(dgtMetrics.tasa21?.pagoPendiente);

  const clasesSolicitadasTotales =
    practica.clasesSolicitadasTotales ?? practica.clasesReservadas ?? 0;
  const clasesConfirmadasProfesor = practica.clasesConfirmadasProfesor ?? 0;
  const clasesPendientesConfirmacion =
    practica.clasesPendientesConfirmacion ?? 0;

  const totalBonoDisponible = bonos.reduce(
    (acumulado, bono) => acumulado + bono.clasesDisponibles,
    0,
  );
  const totalBonoDisponibleContandoSolicitadas = bonos.reduce(
    (acumulado, bono) =>
      acumulado +
      (bono.clasesDisponiblesContandoSolicitadas ?? bono.clasesDisponibles),
    0,
  );

  const temariosRevisados = temarios.filter((temario) => temario.revisado);
  const temarioMaxIndex = Math.max(0, temariosRevisados.length - 1);
  const temarioCurrentIndex = Math.min(temarioIndex, temarioMaxIndex);
  const temarioVisible = temariosRevisados[temarioCurrentIndex] || null;

  const periodoMaximo = Math.max(
    1,
    ...evolucion.map((periodo) => Math.max(periodo.tests, periodo.clases)),
  );

  const handleOpenExamModal = (examen) => {
    setSelectedExam(examen);
    setOpenExamModal(true);
  };

  const handleCloseExamModal = () => {
    setOpenExamModal(false);
    setSelectedExam(null);
  };

  const handlePayPendingDgt = async () => {
    const pagoId = dgtMetrics.tasa21?.pagoPendiente?.id;

    if (pagoId) {
      navigate(`/pago-matricula?pagoId=${pagoId}`);
      return;
    }

    try {
      const pagos = await pagosService.getMine();
      const pendienteTasa = (pagos || []).find(
        (pago) =>
          String(pago?.estado || "").toUpperCase() === "PENDIENTE" &&
          String(pago?.tipo || "").toUpperCase() === "TASA_DGT_21",
      );

      if (pendienteTasa?.id) {
        navigate(`/pago-matricula?pagoId=${pendienteTasa.id}`);
        return;
      }
    } catch (error) {
      console.error(error);
    }

    navigate("/mis-pagos");
  };

  if (isLicenseObtained && !showLicenseDetailView) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Box
          sx={{
            p: 3,
            borderRadius: 1.5,
            background:
              "linear-gradient(135deg, rgba(15,23,42,1) 0%, rgba(30,64,175,1) 100%)",
            color: "#fff",
            boxShadow: "0 18px 40px rgba(15, 23, 42, 0.18)",
          }}
        >
          <Box
            display="flex"
            flexWrap="wrap"
            justifyContent="space-between"
            alignItems="flex-start"
            gap={2}
          >
            <Box>
              <Typography variant="h4" fontWeight={900}>
                Mi panel
              </Typography>
              <Typography
                sx={{ mt: 1, maxWidth: 720, color: "rgba(255,255,255,0.88)" }}
              >
                Tu licencia ya fue obtenida. Pulsa sobre la tarjeta para ver el
                detalle completo de tu historial.
              </Typography>
            </Box>

            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              <Chip
                label={progressChip.label}
                size="small"
                onClick={() => setShowLicenseDetailView(true)}
                sx={{
                  backgroundColor: "#dcfce7",
                  color: "#166534",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              />
            </Stack>
          </Box>
        </Box>

        <Box sx={{ maxWidth: 700, width: "100%" }}>
          <Card
            sx={{
              borderRadius: 3,
              border: "1px solid rgba(148, 163, 184, 0.18)",
              boxShadow: "0 16px 34px rgba(15, 23, 42, 0.08)",
              cursor: "pointer",
              width: "100%",
              margin: "0 auto 0 0", // Garantiza que se posicione a la izquierda en su contenedor padre externo
            }}
            onClick={() => setShowLicenseDetailView(true)}
          >
            <CardContent sx={{ p: 2 }}>
              <Box
                sx={{
                  position: "relative",
                  borderRadius: 2,
                  overflow: "hidden",
                  border: "1px solid #e2e8f0",
                  width: "100%",
                  maxWidth: "100%",
                  aspectRatio: "4 / 3",
                  backgroundColor: "#f8fafc",
                }}
              >
                <Box
                  component="img"
                  src="/assets/branding/IMAGEN1.jpeg"
                  alt="Certificado licencia obtenida"
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "block",
                    objectFit: "contain",
                  }}
                />
                <Typography
                  sx={{
                    position: "absolute",
                    left: "50%",
                    top: "44%",
                    transform: "translate(-50%, -50%)",
                    fontFamily:
                      '"Brush Script MT", "Lucida Handwriting", cursive',
                    fontSize: { xs: 24, md: 36 },
                    fontWeight: 700,
                    color: "#0f172a",
                    textShadow: "0 1px 2px rgba(255,255,255,0.75)",
                    whiteSpace: "nowrap",
                    maxWidth: "85%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {studentName}
                </Typography>
                <Typography
                  sx={{
                    position: "absolute",
                    left: "50%",
                    top: "57.5%",
                    transform: "translate(-50%, -50%)",
                    color: "#ffffff",
                    fontWeight: 900,
                    fontSize: { xs: 26, md: 40 },
                    letterSpacing: 0.5,
                    textShadow: "0 5px 4px rgba(0,0,0,0.35)",
                  }}
                >
                  {obtainedLicenseCode}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Texto informativo centrado debajo de la tarjeta */}
          <Typography
            variant="body2"
            sx={{
              textAlign: "center",
              mt: 1.5, // Margen superior para separarlo de la tarjeta
              fontWeight: 500,
              color: "text.secondary", // Color sutil (puedes cambiarlo por el que prefieras)
            }}
          >
            Certificado Licencia Obtenida
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {isLicenseObtained ? (
        <Stack direction="row" justifyContent="flex-end">
          <Button
            variant="outlined"
            onClick={() => setShowLicenseDetailView(false)}
          >
            Cerrar
          </Button>
        </Stack>
      ) : null}
      {matriculaPendiente && (
        <Card
          sx={{
            borderRadius: 2,
            border: "2px solid #2563eb",
            backgroundColor: "#eff6ff",
            borderLeft: "6px solid #2563eb",
            boxShadow: "none",
          }}
        >
          <CardContent>
            {/* Contenedor Flex para alinear Título y Botón */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 2, // Evita que se peguen en pantallas pequeñas
              }}
            >
              <Typography variant="h5" fontWeight={800} color="warning.main">
                Matrícula pendiente de pago
              </Typography>

              <Button
                variant="contained"
                color="success"
                startIcon={<CreditCardIcon />}
                onClick={() => navigate("/pago-matricula")}
                sx={{ whiteSpace: "nowrap" }} // Evita que el texto del botón se rompa en dos líneas
              >
                Pagar matrícula
              </Button>
            </Box>

            {/* El texto descriptivo queda abajo de ambos */}
            <Typography
              sx={{
                mt: -1, // Ajustado el margen superior para separar del bloque del título
              }}
            >
              Debes completar el pago de tu matrícula para acceder a todos los
              contenidos formativos de la plataforma.
            </Typography>
          </CardContent>
        </Card>
      )}

      {!matriculaPendiente && pagoTasaPendiente && (
        <Card
          sx={{
            borderRadius: 2,
            border: "2px solid #2563eb",
            backgroundColor: "#eff6ff",
            borderLeft: "6px solid #2563eb",
            boxShadow: "none",
          }}
        >
          <CardContent>
            {/* Contenedor Flex para alinear el título y el botón en la misma línea */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 2,
              }}
            >
              <Typography variant="h5" fontWeight={800} color="primary.main">
                Tasa DGT pendiente de pago
              </Typography>

              <Button
                variant="contained"
                color="primary"
                startIcon={<CreditCardIcon />}
                onClick={handlePayPendingDgt}
                sx={{ whiteSpace: "nowrap" }} // Evita que el texto del botón se divida en dos líneas
              >
                Pagar tasa DGT
              </Button>
            </Box>

            {/* El texto descriptivo se mantiene abajo */}
            <Typography sx={{ mt: -1 }}>
              Para activar tus convocatorias de examen debes abonar la tasa DGT
              pendiente ({dgtMetrics.tasa21.pagoPendiente?.importe} EUR).
            </Typography>
          </CardContent>
        </Card>
      )}

      <Box
        sx={{
          p: 3,
          borderRadius: 1.5,
          background:
            "linear-gradient(135deg, rgba(15,23,42,1) 0%, rgba(30,64,175,1) 100%)",
          color: "#fff",
          boxShadow: "0 18px 40px rgba(15, 23, 42, 0.18)",
        }}
      >
        <Box
          display="flex"
          flexWrap="wrap"
          justifyContent="space-between"
          alignItems="flex-start"
          gap={2}
        >
          <Box>
            <Typography variant="h4" fontWeight={900}>
              Mi panel
            </Typography>
            <Typography
              sx={{ mt: 1, maxWidth: 720, color: "rgba(255,255,255,0.88)" }}
            >
              Resumen personal de tu progreso, tu matrícula y tu gestión de
              teoría y prácticas.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            <Chip
              label={progressChip.label}
              size="small"
              onClick={
                isLicenseObtained
                  ? () => setShowLicenseDetailView(true)
                  : undefined
              }
              sx={{
                backgroundColor: progressChip.ok ? "#dcfce7" : "#fef3c7",
                color: progressChip.ok ? "#166534" : "#92400e",
                fontWeight: 700,
                cursor: isLicenseObtained ? "pointer" : "default",
              }}
            />
            <Chip
              label={`${teoria.testsTotales} tests de práctica`}
              size="small"
              sx={{
                backgroundColor: "rgba(255,255,255,0.16)",
                color: "#fff",
                fontWeight: 700,
              }}
            />
            <Chip
              label={`${dgtMetrics.testsTotales} tests DGT realizados`}
              size="small"
              sx={{
                backgroundColor: "rgba(255,255,255,0.16)",
                color: "#fff",
                fontWeight: 700,
              }}
            />
          </Stack>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              borderRadius: 1.5,
              height: "100%",
              border: "1px solid rgba(148, 163, 184, 0.18)",
              boxShadow: "0 14px 32px rgba(15, 23, 42, 0.04)",
            }}
          >
            <CardContent
              sx={{
                py: 2,
                "&:last-child": { pb: 2 },
                // TRUCO: Buscamos el contenedor del título e icono dentro de SectionTitle
                "& .MuiBox-root": {
                  // O el contenedor principal de tu SectionTitle
                  "& div:first-of-type": {
                    // Selecciona el bloque del icono y texto
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  },
                },
              }}
            >
              <SectionTitle
                icon={<PersonIcon sx={{ color: "#1d4ed8" }} />}
                title="Datos personales"
                subtitle="Información principal asociada a tu cuenta y a tu expediente en la autoescuela."
              />

              <Grid container spacing={2.5}>
                {[
                  ["Nombre", perfil.nombre],
                  ["DNI", perfil.dni || "No informado"],
                  ["Email", perfil.email],
                  ["Teléfono", perfil.telefono || "No informado"],
                  ["Permiso objetivo", perfil.tipoLicenciaObjetivo],
                  [
                    "Profesor asignado",
                    perfil.profesorAsignado?.nombre || "Sin asignar",
                  ],
                ].map(([label, value]) => (
                  <Grid item xs={12} sm={6} key={label}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 1,
                        backgroundColor: "#f8fafc",
                        border: "1px solid rgba(148, 163, 184, 0.18)",
                        width: "238px",
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {label}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        fontWeight={700}
                        sx={{ mt: 0.5, lineHeight: 1.3 }}
                      >
                        {value}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              {/* 
              <Divider sx={{ my: 2 }} />

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip
                  label={perfil.activo ? "Alumno activo" : "Alumno inactivo"}
                  color={perfil.activo ? "success" : "default"}
                />

                <Chip
                  label={`${perfil.horasPracticasCompletadas} horas prácticas completadas`}
                  color="primary"
                  variant="outlined"
                />
              </Stack>
              */}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Grid container spacing={3.2}>
            <Grid item xs={12} sm={6} sx={{ width: 230, height: 110 }}>
              <DashboardStatCard
                title={
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: "6px" }}
                  >
                    <CreditCardIcon
                      sx={{ fontSize: "1.1rem", color: "#16a34a" }}
                    />
                    <span>Matrícula</span>
                  </Box>
                }
                value={resumen.matricula === "PAGADA" ? "Pagada" : "Pendiente"}
                subtitle={
                  resumen.matricula === "PAGADA"
                    ? `Pagada el ${formatDate(perfil.fechaMatriculaPago)}`
                    : "Falta completar el pago de matrícula"
                }
              />
            </Grid>

            <Grid item xs={12} sm={6} sx={{ width: 230, height: 110 }}>
              <DashboardStatCard
                title={
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: "6px" }}
                  >
                    <AssignmentIcon
                      sx={{ fontSize: "1.1rem", color: "#2563eb" }}
                    />
                    <span>Tests de práctica</span>
                  </Box>
                }
                value={`${teoria.testsTotales} Tests totales`}
                subtitle={`${teoria.testsAprobados} aprobados y ${teoria.testsSuspendidos} suspendidos`}
              />
            </Grid>

            <Grid item xs={12} sm={6} sx={{ width: 260, height: 110 }}>
              <DashboardStatCard
                title={
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: "6px" }}
                  >
                    <WorkspacePremiumIcon
                      sx={{ fontSize: "1.1rem", color: "#FF8C00" }}
                    />
                    <span>Test DGT</span>
                  </Box>
                }
                value={`${dgtMetrics.testsTotales} Test Completados`}
                subtitle={`${dgtMetrics.testsAprobados} aprobados y ${dgtMetrics.testsSuspendidos} suspendidos`}
              />
            </Grid>

            <Grid item xs={12} sm={6} sx={{ width: 230, height: 110 }}>
              <DashboardStatCard
                title={
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: "6px" }}
                  >
                    <VerifiedIcon
                      sx={{ fontSize: "1.1rem", color: "#0284c7" }}
                    />
                    <span>Convocatorias Examen DGT</span>
                  </Box>
                }
                value={`${dgtMetrics.tasa21?.convocatoriasDisponibles ?? 0} Convocatorias`}
                subtitle={`${dgtMetrics.tasa21?.convocatoriasConsumidas ?? 0} consumidas de ${dgtMetrics.tasa21?.convocatoriasIncluidas ?? 0}`}
              />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ width: 230, height: 110 }}>
              <DashboardStatCard
                title={
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: "6px" }}
                  >
                    <DirectionsCarIcon
                      sx={{ fontSize: "1.1rem", color: "#0f172a" }}
                    />
                    <span>Clases compradas</span>
                  </Box>
                }
                value={`${practica.clasesCompradas} Clases`}
                subtitle={`${clasesSolicitadasTotales} solicitadas · ${clasesConfirmadasProfesor} confirmadas`}
              />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ width: 230, height: 110 }}>
              <DashboardStatCard
                title={
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: "6px" }}
                  >
                    <EventAvailableIcon
                      sx={{ fontSize: "1.1rem", color: "#7c3aed" }}
                    />
                    <span>Reservas activas</span>
                  </Box>
                }
                value={`${clasesSolicitadasTotales} Solicitudes`}
                subtitle={`${clasesPendientesConfirmacion} pendientes de confirmación`}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={7}>
          <Card
            sx={{
              borderRadius: 2,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              border: "1px solid rgba(148, 163, 184, 0.18)",
              boxShadow: "0 14px 32px rgba(15, 23, 42, 0.04)",
            }}
          >
            <CardContent
              sx={{
                py: 2,
                "&:last-child": { pb: 2 },
                // TRUCO: Buscamos el contenedor del título e icono dentro de SectionTitle
                "& .MuiBox-root": {
                  // O el contenedor principal de tu SectionTitle
                  "& div:first-of-type": {
                    // Selecciona el bloque del icono y texto
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  },
                },
              }}
            >
              <SectionTitle
                icon={<SchoolIcon sx={{ color: "#2563eb" }} />}
                title="Teoría y examen"
                subtitle="Este bloque resume tu progreso en tests, el porcentaje de acierto y la recomendación de revisión."
              />

              <Grid container spacing={1.25}>
                <Grid item xs={12} sm={4}>
                  <Box
                    sx={{
                      p: 1.25,
                      borderRadius: 1,
                      backgroundColor: "#eff6ff",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Tests realizados
                    </Typography>
                    <Typography variant="h5" fontWeight={800}>
                      {teoria.testsTotales}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box
                    sx={{
                      p: 1.25,
                      borderRadius: 1,
                      backgroundColor: "#ecfdf5",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Aprobados / suspendidos
                    </Typography>
                    <Typography variant="h5" fontWeight={800}>
                      {teoria.testsAprobados} / {teoria.testsSuspendidos}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box
                    sx={{
                      p: 1.25,
                      borderRadius: 1,
                      backgroundColor: "#fff7ed",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Porcentaje aprobado
                    </Typography>
                    <Typography variant="h5" fontWeight={800}>
                      {formatPercentage(teoria.porcentajeAprobado)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ mt: 2 }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 1 }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Índice de preparación teórica
                  </Typography>
                  {teoria.preparadoParaTeorico ? (
                    <Chip label="Preparado" color="success" size="small" />
                  ) : (
                    <Chip
                      label="Necesita repaso"
                      color="warning"
                      size="small"
                    />
                  )}
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(teoria.porcentajeAprobado, 100)}
                  sx={{ height: 10, borderRadius: 999 }}
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box>
                <SectionTitle
                  icon={<TrafficIcon sx={{ color: "#2563eb" }} />}
                  title="Simulacros DGT"
                />

                <Grid container spacing={1.25}>
                  <Grid item xs={12} sm={4}>
                    <Box
                      sx={{
                        p: 1.25,
                        borderRadius: 1,
                        backgroundColor: "#ecfeff",
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Total realizados
                      </Typography>
                      <Typography variant="h5" fontWeight={800}>
                        {dgtMetrics.testsTotales}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box
                      sx={{
                        p: 1.25,
                        borderRadius: 1,
                        backgroundColor: "#f0fdf4",
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Aprobados / suspendidos
                      </Typography>
                      <Typography variant="h5" fontWeight={800}>
                        {dgtMetrics.testsAprobados} /{" "}
                        {dgtMetrics.testsSuspendidos}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box
                      sx={{
                        p: 1.25,
                        borderRadius: 1,
                        backgroundColor: "#f0f9ff",
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Porcentaje aprobado
                      </Typography>
                      <Typography variant="h5" fontWeight={800}>
                        {formatPercentage(dgtMetrics.porcentajeAprobado)}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1}
                  sx={{ mt: 1.5 }}
                >
                  <Chip
                    label={
                      dgtUltimoResultado
                        ? "Último resultado"
                        : "Sin intentos DGT"
                    }
                    color={dgtUltimoResultado?.aprobado ? "success" : "default"}
                    variant={dgtUltimoResultado ? "filled" : "outlined"}
                  />
                  {dgtUltimoResultado ? (
                    <Chip
                      label={`${dgtUltimoResultado.aprobado ? "APROBADO" : "SUSPENDIDO"} · ${dgtUltimoResultado.aciertos} aciertos y ${dgtUltimoResultado.fallos} fallos`}
                      /*color={dgtUltimoResultado.aprobado ? "success" : "error"}*/
                      variant="outlined"
                    />
                  ) : null}
                  {/* 
                  <Chip
                    label={`Racha actual: ${dgtRachaTexto}`}
                    variant="outlined"
                  />
                  */}
                </Stack>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box>
                <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1 }}>
                  Recomendación de temarios
                </Typography>
                {teoria.recomendacionTemarios.length > 0 ? (
                  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                    {teoria.recomendacionTemarios.map((temario) => (
                      <Chip key={temario} label={temario} variant="outlined" />
                    ))}
                  </Stack>
                ) : (
                  <Typography color="text.secondary">
                    No hay temarios críticos pendientes. Puedes seguir con
                    simulacros y reforzar test.
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Card
            sx={{
              borderRadius: 2,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              border: "1px solid rgba(148, 163, 184, 0.18)",
              boxShadow: "0 14px 32px rgba(15, 23, 42, 0.04)",
              width: "900px",
            }}
          >
            <CardContent
              sx={{
                py: 2,
                "&:last-child": { pb: 2 },
              }}
            >
              <SectionTitle
                icon={<BookIcon sx={{ color: "#7c3aed" }} />}
                title="Temarios revisados"
                subtitle="Relación de temarios asociados al permiso objetivo y su nivel de avance."
              />

              {temariosRevisados.length > 0 ? (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1.5,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {temarioCurrentIndex + 1} de {temariosRevisados.length}
                    </Typography>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() =>
                          setTemarioIndex(Math.max(0, temarioCurrentIndex - 1))
                        }
                        disabled={temarioCurrentIndex === 0}
                      >
                        <ArrowBackIosNewIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() =>
                          setTemarioIndex(
                            Math.min(temarioMaxIndex, temarioCurrentIndex + 1),
                          )
                        }
                        disabled={temarioCurrentIndex >= temarioMaxIndex}
                      >
                        <ArrowForwardIosIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      border: "1px solid rgba(148, 163, 184, 0.18)",
                      borderRadius: 1,
                      backgroundColor: "#fff",
                      padding: 1.5,
                      boxShadow: "0 10px 20px rgba(15, 23, 42, 0.03)",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Typography fontWeight={800} sx={{ fontWeight: "bold" }}>
                        {temarioVisible?.titulo}
                      </Typography>
                      <Chip label="Revisado" color="success" size="small" />
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1, fontSize: "0.875rem" }}
                    >
                      {temarioVisible?.descripcion}
                    </Typography>

                    <Box sx={{ width: "100%" }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 0.5,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Dominio del tema
                        </Typography>
                        <Typography variant="body2" fontWeight={700}>
                          {temarioVisible?.dominio ?? 0}%
                        </Typography>
                      </Box>

                      <LinearProgress
                        variant="determinate"
                        value={Math.min(temarioVisible?.dominio ?? 0, 100)}
                        sx={{ height: 8, borderRadius: 999 }}
                      />

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 1, display: "block" }}
                      >
                        Última revisión:{" "}
                        {formatDate(temarioVisible?.ultimaRevision)}
                      </Typography>
                    </Box>
                  </Box>
                </>
              ) : (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <WarningAmberIcon color="warning" fontSize="small" />
                  <Typography variant="body2">
                    Aún no has empezado a estudiar ningún tema. Ve a la sección
                    de contenidos para revisar tu primer temario.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={7}>
          <Card
            sx={{
              borderRadius: 2,
              height: "100%",
              border: "1px solid rgba(148, 163, 184, 0.18)",
              boxShadow: "0 14px 32px rgba(15, 23, 42, 0.04)",
              width: "670px",
            }}
          >
            <CardContent sx={{ py: 2, "&:last-child": { pb: 2 } }}>
              <SectionTitle
                icon={<DirectionsCarIcon sx={{ color: "#0f172a" }} />}
                title="Tu formación práctica"
                subtitle="Resumen de clases compradas, pagadas, reservas actuales y evolución reciente."
              />

              <Grid container spacing={1.5}>
                <Grid item xs={12} sm={3}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 1,
                      backgroundColor: "#f8fafc",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Compradas
                    </Typography>
                    <Typography variant="h5" fontWeight={800}>
                      {practica.clasesCompradas}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 1,
                      backgroundColor: "#f8fafc",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Pagadas
                    </Typography>
                    <Typography variant="h5" fontWeight={800}>
                      {practica.clasesPagadas}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 1,
                      backgroundColor: "#f8fafc",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Solicitadas
                    </Typography>
                    <Typography variant="h5" fontWeight={800}>
                      {clasesSolicitadasTotales}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 1,
                      backgroundColor: "#f8fafc",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Realizadas
                    </Typography>
                    <Typography variant="h5" fontWeight={800}>
                      {practica.clasesRealizadas}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {clasesConfirmadasProfesor} confirmadas por profesor y{" "}
                {clasesPendientesConfirmacion} pendientes de confirmación.
              </Typography>

              <Divider sx={{ my: 2.5 }} />

              <Box>
                <Typography variant="title" fontWeight={800} sx={{ mb: 1.5 }}>
                  Evolución breve
                </Typography>
                <Grid container spacing={1} alignItems="end">
                  {evolucion.map((periodo) => (
                    <Grid item xs key={periodo.key}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Box
                          sx={{
                            width: "100%",
                            minHeight: 140,
                            display: "flex",
                            alignItems: "end",
                            justifyContent: "center",
                            gap: 0.5,
                            px: 1,
                          }}
                        >
                          <Box
                            sx={{
                              width: 18,
                              height: `${Math.max((periodo.tests / periodoMaximo) * 120, 8)}px`,
                              borderRadius: 999,
                              backgroundColor: "#2563eb",
                            }}
                            title={`Tests: ${periodo.tests}`}
                          />
                          <Box
                            sx={{
                              width: 18,
                              height: `${Math.max((periodo.clases / periodoMaximo) * 120, 8)}px`,
                              borderRadius: 999,
                              backgroundColor: "#16a34a",
                            }}
                            title={`Clases: ${periodo.clases}`}
                          />
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {periodo.label}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <Divider sx={{ my: 2.5 }} />

              <Box>
                <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1 }}>
                  Reservas de clases
                </Typography>
                {reservas.length > 0 ? (
                  <List dense disablePadding>
                    {reservas.map((reserva) => (
                      <ListItem
                        key={reserva.id}
                        sx={{
                          px: 0,
                          py: 1,
                          borderBottom: "1px solid #e2e8f0",
                        }}
                        secondaryAction={statusChip(
                          reserva.estado,
                          reserva.estado,
                        )}
                      >
                        <ListItemText
                          primary={`${formatDate(reserva.fecha)} · ${reserva.vehiculo?.matricula ?? "Sin matrícula"} · ${reserva.vehiculo?.marca ?? "Sin marca"} ${reserva.vehiculo?.modelo ?? ""}`}
                          secondary={
                            <Stack
                              direction="row"
                              spacing={0.75}
                              alignItems="center"
                              useFlexGap
                              flexWrap="wrap"
                              sx={{ mt: 0.4 }}
                            >
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {reserva.profesor?.usuario?.nombre
                                  ? `Profesor: ${reserva.profesor.usuario.nombre}`
                                  : "Profesor no asignado"}
                              </Typography>
                              <LicenseChip
                                value={reserva.vehiculo?.tipoPermiso || "-"}
                              />
                              <PracticalClassTypeChip
                                value={
                                  reserva.tipoClasePractica || "CIRCULACION"
                                }
                              />
                            </Stack>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography color="text.secondary">
                    No tienes reservas programadas en este momento.
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Stack spacing={3}>
            <Card
              sx={{
                borderRadius: 2,
                height: "100%",
                border: "1px solid rgba(148, 163, 184, 0.18)",
                boxShadow: "0 14px 32px rgba(15, 23, 42, 0.04)",
                width: "900px",
              }}
            >
              <CardContent
                sx={{
                  py: 2,
                  "&:last-child": { pb: 2 },
                  // TRUCO: Buscamos el contenedor del título e icono dentro de SectionTitle
                  "& .MuiBox-root": {
                    // O el contenedor principal de tu SectionTitle
                    "& div:first-of-type": {
                      // Selecciona el bloque del icono y texto
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    },
                  },
                }}
              >
                <SectionTitle
                  icon={<WorkspacePremiumIcon sx={{ color: "#d97706" }} />}
                  title="Bonos disponibles"
                  subtitle={`Tienes ${bonos.length} bono(s), ${totalBonoDisponible} clase(s) disponibles y ${totalBonoDisponibleContandoSolicitadas} tras descontar solicitadas.`}
                />

                <Stack spacing={1.25}>
                  {bonos.length > 0 ? (
                    bonos.map((bono) => (
                      <Box
                        key={bono.id}
                        sx={{
                          p: 1.5,
                          borderRadius: 1,
                          border: "1px solid rgba(148, 163, 184, 0.18)",
                          backgroundColor: "#fff",
                          boxShadow: "0 10px 20px rgba(15, 23, 42, 0.02)",
                        }}
                      >
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          gap={1}
                        >
                          <Box>
                            <Typography fontWeight={800}>
                              {bono.nombre}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {bono.descripcion || "Paquete de clases"}
                            </Typography>
                          </Box>

                          {statusChip(bono.estado, bono.estado)}
                        </Box>

                        <Box sx={{ mt: 1.5 }}>
                          <Typography variant="body2" color="text.secondary">
                            {bono.clasesCompradas} compradas ·{" "}
                            {bono.clasesConsumidas} consumidas ·{" "}
                            {bono.clasesSolicitadas ?? 0} solicitadas ·{" "}
                            {bono.clasesDisponibles} disponibles ·{" "}
                            {bono.clasesDisponiblesContandoSolicitadas ??
                              bono.clasesDisponibles}{" "}
                            disponibles contando solicitadas
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Válido hasta: {formatDate(bono.fechaValidezHasta)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {bono.aplicable
                              ? "Puedes aplicarlo ahora"
                              : "No aplicable en este momento"}
                          </Typography>
                        </Box>
                      </Box>
                    ))
                  ) : (
                    <Typography color="text.secondary">
                      Todavía no tienes bonos comprados.
                    </Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>

            <Card
              sx={{
                borderRadius: 2,
                width: "900px",
                border: "1px solid rgba(148, 163, 184, 0.18)",
                boxShadow: "0 14px 32px rgba(15, 23, 42, 0.04)",
              }}
            >
              <CardContent
                sx={{
                  py: 2,
                  "&:last-child": { pb: 2 },
                  // TRUCO: Buscamos el contenedor del título e icono dentro de SectionTitle
                  "& .MuiBox-root": {
                    // O el contenedor principal de tu SectionTitle
                    "& div:first-of-type": {
                      // Selecciona el bloque del icono y texto
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    },
                  },
                }}
              >
                <SectionTitle
                  icon={<EventNoteIcon sx={{ color: "#7c3aed" }} />}
                  title="Solicitudes de examen"
                  subtitle="Estado de tus solicitudes para examen teórico y práctico."
                />

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        p: 1.75,
                        borderRadius: 1,
                        border: "1px solid rgba(148, 163, 184, 0.18)",
                        backgroundColor: "#fff",
                        width: "850px",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        fontWeight={800}
                        sx={{ mb: 2 }}
                      >
                        Examen teórico
                      </Typography>

                      {examenes.teoricos.length > 0 ? (
                        <Stack spacing={2} sx={{ width: "100%" }}>
                          {examenes.teoricos.map((examen, index) => (
                            <Box
                              key={examen.id}
                              onClick={() => handleOpenExamModal(examen)}
                              sx={{
                                cursor: "pointer",
                                borderRadius: 2,
                                p: 1.5,
                                width: "100%",
                                boxSizing: "border-box",
                                transition: "background-color 0.2s ease",
                                "&:hover": {
                                  backgroundColor: "#f8fafc",
                                },
                              }}
                            >
                              {/* Fila Principal Unificada Completa */}
                              <Stack
                                direction="row"
                                spacing={2}
                                alignItems="center"
                                justifyContent="flex-start" // Alineación lineal consecutiva hacia la izquierda
                                sx={{
                                  width: "100%",
                                  flexWrap: "nowrap !important", // Prohíbe terminantemente dividirse en dos líneas
                                  overflowX: "auto", // Previene deformaciones en layouts estrechos
                                }}
                              >
                                {/* 1. Elemento Fecha (Sin Stacks contenedores intermedios) */}
                                <Typography
                                  variant="body1"
                                  fontWeight={700}
                                  sx={{ whiteSpace: "nowrap", flexShrink: 0 }}
                                >
                                  Fecha del Examen:{" "}
                                  {formatDate(examen.fechaProgramada)}
                                </Typography>

                                {/* 2. Elemento Estado */}
                                <Box
                                  sx={{
                                    flexShrink: 0,
                                    display: "inline-flex",
                                    alignItems: "center",
                                  }}
                                >
                                  {statusChip(examen.estado, examen.estado)}
                                </Box>

                                {/* 3. Elemento Botón Detalle */}
                                <Typography
                                  variant="caption"
                                  sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    whiteSpace: "nowrap",
                                    flexShrink: 0,
                                    backgroundColor: "#fffbeb",
                                    borderColor: "#facc15",
                                    borderRadius: "15px",
                                    borderWidth: "1px",
                                    borderStyle: "solid",
                                    px: 1.5,
                                    py: 0.5,
                                    fontWeight: 500,
                                    color: "#b45309",
                                    lineHeight: 1,
                                  }}
                                >
                                  Pulsa para ver detalle de examen
                                </Typography>
                              </Stack>

                              {/* Separador entre elementos (evita duplicar al final de la lista) */}
                              {index < examenes.teoricos.length - 1 && (
                                <Divider sx={{ mt: 2 }} />
                              )}
                            </Box>
                          ))}
                        </Stack>
                      ) : (
                        <Typography color="text.secondary">
                          Todavía no has solicitado examen teórico.
                        </Typography>
                      )}
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: "1px solid rgba(148, 163, 184, 0.18)",
                        backgroundColor: "#fff",
                        height: "100%", // Asegura que ambos contenedores midan lo mismo de alto
                        width: "850px",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        fontWeight={800}
                        sx={{ mb: 2 }}
                      >
                        Examen práctico
                      </Typography>

                      {examenes.practicos.length > 0 ? (
                        <Stack spacing={2} sx={{ width: "100%" }}>
                          {examenes.practicos.map((examen) => (
                            <Box
                              key={examen.id}
                              onClick={() => handleOpenExamModal(examen)}
                              sx={{
                                cursor: "pointer",
                                borderRadius: 1,
                                p: 1.5,
                                width: "100%",
                                boxSizing: "border-box",
                                transition: "background-color 0.2s ease",
                                "&:hover": {
                                  backgroundColor: "#f8fafc",
                                },
                              }}
                            >
                              {/* Única Fila Principal Plana Corregida */}
                              <Stack
                                direction="row"
                                spacing={2}
                                alignItems="center"
                                justifyContent="flex-start" // Alineación lineal consecutiva sin saltos
                                sx={{
                                  width: "100%",
                                  flexWrap: "nowrap !important", // Bloquea estrictamente cualquier división de línea
                                  overflowX: "auto",
                                }}
                              >
                                {/* 1. Elemento Texto (Fecha y Subtipo en una sola línea horizontal) */}
                                <Typography
                                  fontWeight={700}
                                  variant="body1"
                                  sx={{ whiteSpace: "nowrap", flexShrink: 0 }}
                                >
                                  Fecha del Examen:{" "}
                                  {formatDate(examen.fechaProgramada)} (Subtipo:{" "}
                                  {getPracticalExamTypeLabel({
                                    license: practicalLicense,
                                    phase: examen?.fasePractica,
                                  })}
                                  )
                                </Typography>

                                {/* 2. Elemento Estado (Chip) */}
                                <Box
                                  sx={{
                                    flexShrink: 0,
                                    display: "inline-flex",
                                    alignItems: "center",
                                  }}
                                >
                                  {statusChip(examen.estado, examen.estado)}
                                </Box>

                                {/* 3. Elemento Botón Detalle */}
                                <Typography
                                  variant="caption"
                                  sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    whiteSpace: "nowrap",
                                    flexShrink: 0,
                                    backgroundColor: "#fffbeb",
                                    borderColor: "#facc15",
                                    borderRadius: "15px",
                                    borderWidth: "1px",
                                    borderStyle: "solid",
                                    px: 1.5,
                                    py: 0.5,
                                    fontWeight: 500,
                                    color: "#b45309",
                                    lineHeight: 1,
                                  }}
                                >
                                  Pulsa para ver detalle de faltas
                                </Typography>
                              </Stack>

                              <Divider sx={{ mt: 2 }} />
                            </Box>
                          ))}
                        </Stack>
                      ) : (
                        <Typography color="text.secondary">
                          Todavía no has solicitado examen práctico.
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                </Grid>
                {/*
                <Box
                  sx={{
                    mt: 2.5,
                    p: 1.75,
                    borderRadius: 2.5,
                    backgroundColor: "#f8fafc",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight={800}
                    sx={{ mb: 0.5 }}
                  >
                    Estado general
                  </Typography>
                  <Typography color="text.secondary">
                    {resumen.preparadoParaTeorico
                      ? "Según tu progreso actual, ya estás preparado para el examen teórico."
                      : "Aún no estás listo para examinarte del teórico; revisa los temarios recomendados y mejora el porcentaje de acierto."}
                  </Typography>
                </Box>
                */}
                <Dialog
                  open={openExamModal}
                  onClose={handleCloseExamModal}
                  fullWidth
                  maxWidth="sm"
                >
                  <DialogTitle
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center", // Keeps them perfectly aligned vertically
                      width: "100%",
                    }}
                  >
                    <span>Detalle de evaluación</span>
                    <Chip
                      // Reemplaza el guion bajo por un espacio en blanco en la visualización
                      label={
                        selectedExam?.estado
                          ? selectedExam.estado.replace("_", " ")
                          : "-"
                      }
                      variant="outlined"
                      sx={{
                        borderRadius: "15px",
                        borderWidth: "1px",
                        "& .MuiChip-label": {
                          fontWeight: "bold",
                        },
                        // Modifica el FONDO según el estado
                        backgroundColor:
                          {
                            SOLICITADO: "#e0f2fe",
                            APTO: "#ecfdf5",
                            NO_APTO: "#fef2f2",
                            PENDIENTE: "#fffbeb",
                            CANCELADO: "#eae9e9",
                          }[selectedExam?.estado] || "#f3f4f6",

                        // Modifica el BORDE según el estado
                        borderColor:
                          {
                            SOLICITADO: "#0284c7",
                            APTO: "#34d399",
                            NO_APTO: "#f87171",
                            PENDIENTE: "#facc15",
                            CANCELADO: "#000000",
                          }[selectedExam?.estado] || "#d1d5db",

                        // Modifica la LETRA según el estado
                        color:
                          {
                            SOLICITADO: "#0369a1",
                            APTO: "#065f46",
                            NO_APTO: "#991b1b",
                            PENDIENTE: "#854d0e",
                            CANCELADO: "#000000",
                          }[selectedExam?.estado] || "#374151",
                      }}
                    />
                  </DialogTitle>

                  <DialogContent sx={{ display: "grid", gap: 1, pt: 1 }}>
                    <Typography>
                      <strong>Tipo:</strong>{" "}
                      <Box
                        component="span"
                        sx={{ textTransform: "capitalize" }}
                      >
                        {(selectedExam?.tipo || "-").toLowerCase()}
                      </Box>
                    </Typography>

                    {selectedExam?.tipo === "PRACTICO" ? (
                      <Typography>
                        <strong>Subtipo:</strong>{" "}
                        {getPracticalExamTypeLabel({
                          license: practicalLicense,
                          phase: selectedExam?.fasePractica,
                        })}
                      </Typography>
                    ) : null}
                    <Typography>
                      <strong>Fecha:</strong>{" "}
                      {formatDate(selectedExam?.fechaProgramada)}
                    </Typography>

                    {selectedExam?.tipo === "PRACTICO" ? (
                      <>
                        <Typography>
                          <strong>Motivo no apto:</strong>{" "}
                          {selectedExam?.motivoNoApto || "-"}
                        </Typography>

                        <Divider sx={{ my: 0.5 }} />

                        <Typography>
                          <strong>Faltas leves:</strong>{" "}
                          {selectedExam?.faltasLeves ?? 0}
                        </Typography>
                        {(selectedExam?.faltasLevesDetalle || []).length > 0 ? (
                          <List dense disablePadding>
                            {selectedExam.faltasLevesDetalle.map(
                              (falta, index) => (
                                <ListItem
                                  key={`leve-${index}`}
                                  sx={{ px: 0, py: 0.25 }}
                                >
                                  <ListItemText
                                    primaryTypographyProps={{
                                      variant: "body2",
                                    }}
                                    primary={`- ${falta}`}
                                  />
                                </ListItem>
                              ),
                            )}
                          </List>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Sin faltas leves registradas.
                          </Typography>
                        )}

                        <Typography>
                          <strong>Faltas deficientes:</strong>{" "}
                          {selectedExam?.faltasDeficientes ?? 0}
                        </Typography>
                        {(selectedExam?.faltasDeficientesDetalle || []).length >
                        0 ? (
                          <List dense disablePadding>
                            {selectedExam.faltasDeficientesDetalle.map(
                              (falta, index) => (
                                <ListItem
                                  key={`def-${index}`}
                                  sx={{ px: 0, py: 0.25 }}
                                >
                                  <ListItemText
                                    primaryTypographyProps={{
                                      variant: "body2",
                                    }}
                                    primary={`- ${falta}`}
                                  />
                                </ListItem>
                              ),
                            )}
                          </List>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Sin faltas deficientes registradas.
                          </Typography>
                        )}

                        <Typography>
                          <strong>Faltas eliminatorias:</strong>{" "}
                          {selectedExam?.faltasEliminatorias ?? 0}
                        </Typography>
                        {(selectedExam?.faltasEliminatoriasDetalle || [])
                          .length > 0 ? (
                          <List dense disablePadding>
                            {selectedExam.faltasEliminatoriasDetalle.map(
                              (falta, index) => (
                                <ListItem
                                  key={`eli-${index}`}
                                  sx={{ px: 0, py: 0.25 }}
                                >
                                  <ListItemText
                                    primaryTypographyProps={{
                                      variant: "body2",
                                    }}
                                    primary={`- ${falta}`}
                                  />
                                </ListItem>
                              ),
                            )}
                          </List>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Sin faltas eliminatorias registradas.
                          </Typography>
                        )}
                      </>
                    ) : (
                      <>
                        <Typography>
                          <strong>Errores:</strong>{" "}
                          {selectedExam?.erroresExamen ?? "-"}
                        </Typography>
                        <Typography>
                          <strong>Aciertos:</strong>{" "}
                          {selectedExam?.aciertosExamen ?? "-"}
                        </Typography>
                      </>
                    )}
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseExamModal}>Cerrar</Button>
                  </DialogActions>
                </Dialog>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
