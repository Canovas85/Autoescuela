import {
  Alert,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import GroupIcon from "@mui/icons-material/Group";
import CommuteIcon from "@mui/icons-material/Commute";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import { LicenseChip } from "../../components/common/LicenseChip";
import { profesorPortalService } from "../../services/profesorPortalService";

function StatCard({ title, value, subtitle, color, icon }) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        border: "1px solid #e2e8f0",
        boxShadow: "0 10px 24px rgba(15,23,42,0.06)",
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={800} sx={{ mt: 0.5 }}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 46,
              height: 46,
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

const getExamResultMeta = (estado) => {
  const normalized = String(estado || "").toUpperCase();

  if (["APTO", "APROBADO"].includes(normalized)) {
    return {
      label: "APTO",
      color: "success",
      icon: <CheckCircleIcon fontSize="small" />,
    };
  }

  return {
    label: "NO APTO",
    color: "error",
    icon: <CancelIcon fontSize="small" />,
  };
};

export default function ProfessorDashboard({ data }) {
  const navigate = useNavigate();
  const perfil = data?.perfil || {};
  const resumen = data?.resumen || {};
  const alumnos = Array.isArray(data?.alumnos) ? data.alumnos : [];
  const vehiculos = Array.isArray(data?.vehiculos) ? data.vehiculos : [];

  const [openDetail, setOpenDetail] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState("");

  const openStudentDetail = async (alumnoId) => {
    setOpenDetail(true);
    setLoadingDetail(true);
    setDetail(null);
    setError("");

    try {
      const response = await profesorPortalService.getStudentDetail(alumnoId);
      setDetail(response);
    } catch (loadError) {
      setError(
        loadError.response?.data?.message || "No se pudo cargar el detalle",
      );
      setOpenDetail(false);
    } finally {
      setLoadingDetail(false);
    }
  };

  const getProgressChipSx = (ok) => ({
    backgroundColor: ok ? "#dcfce7" : "#fef3c7",
    color: ok ? "#166534" : "#92400e",
    border: `1px solid ${ok ? "#86efac" : "#fcd34d"}`,
    fontWeight: 700,
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
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
        <Typography sx={{ mt: 1, color: "rgba(255,255,255,0.88)" }}>
          Profesor: {perfil.nombre || "Profesor"} | Permisos:{" "}
          {(perfil.permisosLicencias || []).join(", ") || "Sin permisos"}
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{ mt: 2 }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/profesor-alumnos")}
            sx={{ backgroundColor: "#0f172a" }}
          >
            Ver alumnos asignados
          </Button>

          <Button
            variant="outlined"
            onClick={() => navigate("/profesor-vehiculos")}
            sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.6)" }}
          >
            Ver vehículos compatibles
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} lg={4} sx={{ width: 365 }}>
          <StatCard
            title="Alumnos Asignados"
            value={resumen.alumnosAsignados ?? 0}
            subtitle="Total de alumnos bajo seguimiento"
            color="#2563eb"
            icon={<GroupIcon />}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={4} sx={{ width: 365 }}>
          <StatCard
            title="Vehículos Disponibles"
            value={resumen.vehiculosDisponibles ?? 0}
            subtitle="Vehículos compatibles con tus permisos"
            color="#0f172a"
            icon={<CommuteIcon />}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={4} sx={{ width: 365 }}>
          <StatCard
            title="Clases Confirmadas para hoy"
            value={resumen.clasesConfirmadasHoy ?? 0}
            subtitle="Clases de hoy en estado confirmada"
            color="#166534"
            icon={<FactCheckIcon />}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={4} sx={{ width: 365 }}>
          <StatCard
            title="Hojas de Ruta pendientes y en curso"
            value={resumen.hojasRutaPendientesEnCurso ?? 0}
            subtitle={`Pendientes: ${resumen.hojasRutaPendientes ?? 0} | En curso: ${resumen.hojasRutaEnCurso ?? 0}`}
            color="#b45309"
            icon={<PendingActionsIcon />}
          />
        </Grid>
      </Grid>

      {/* Seccion alumnos asignados */}

      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>
            Alumnos Asignados
          </Typography>

          <Grid container spacing={2}>
            {alumnos.length === 0 && (
              <Grid item xs={12}>
                <Typography color="text.secondary">
                  No tienes alumnos asignados actualmente.
                </Typography>
              </Grid>
            )}

            {alumnos.map((alumno) => (
              <Grid item xs={12} sm={6} md={4} lg={2} key={alumno.id}>
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                    borderRadius: 2,
                    width: 365,
                  }}
                >
                  <CardActionArea
                    sx={{ height: "100%" }}
                    onClick={() => openStudentDetail(alumno.id)}
                  >
                    <CardContent>
                      <Typography fontWeight={700}>{alumno.nombre}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {alumno.email || "Sin email"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Tel: {alumno.telefono || "Sin teléfono"}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mt: 1,
                        }}
                      >
                        <LicenseChip value={alumno.tipoLicenciaObjetivo} />
                        <Chip
                          size="small"
                          label={
                            alumno.estadoAlumno?.label || "Estudiando teórico"
                          }
                          sx={getProgressChipSx(
                            Boolean(alumno.estadoAlumno?.ok),
                          )}
                        />
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Seccion vehiculos asignados */}

      <Card sx={{ borderRadius: 3, mt: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>
            Vehículos Compatibles
          </Typography>

          <Grid container spacing={2}>
            {vehiculos.length === 0 && (
              <Grid item xs={12}>
                <Typography color="text.secondary">
                  No hay vehículos activos para tus permisos.
                </Typography>
              </Grid>
            )}

            {vehiculos.map((vehiculo) => (
              <Grid item xs={12} sm={6} md={4} lg={2} key={vehiculo.id}>
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                    borderRadius: 2,
                    width: 365,
                  }}
                >
                  <CardContent>
                    <Typography fontWeight={700}>
                      {vehiculo.matricula}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      {vehiculo.marca} {vehiculo.modelo}
                    </Typography>

                    <Chip
                      sx={{ mt: 1 }}
                      label={`Permiso ${vehiculo.tipoPermiso || "-"}`}
                      color={
                        vehiculo.tipoPermiso === "A" ||
                        vehiculo.tipoPermiso === "A1" ||
                        vehiculo.tipoPermiso === "A2"
                          ? "primary"
                          : vehiculo.tipoPermiso === "B"
                            ? "success"
                            : vehiculo.tipoPermiso === "C"
                              ? "warning"
                              : vehiculo.tipoPermiso === "D"
                                ? "default"
                                : vehiculo.tipoPermiso === "E"
                                  ? "secondary"
                                  : "error"
                      }
                      size="small"
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      <Dialog
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>Detalle del alumno</DialogTitle>

        <DialogContent>
          {loadingDetail ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Stack spacing={2}>
              {error ? <Alert severity="error">{error}</Alert> : null}

              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <Typography variant="h6" fontWeight={800}>
                      Datos personales
                    </Typography>
                    <LicenseChip value={detail?.perfil?.tipoLicenciaObjetivo} />
                  </Box>

                  <Grid container spacing={1.25} sx={{ mt: 0.5 }}>
                    <Grid item xs={12} md={3}>
                      <Chip
                        color="primary"
                        label={`Nombre: ${detail?.perfil?.nombre || "-"}`}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Chip
                        color="info"
                        label={`Email: ${detail?.perfil?.email || "-"}`}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Chip
                        color="warning"
                        label={`Teléfono: ${detail?.perfil?.telefono || "-"}`}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Chip
                        color="secondary"
                        label={`DNI: ${detail?.perfil?.dni || "-"}`}
                      />
                    </Grid>
                  </Grid>

                  <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                    <Chip
                      size="small"
                      label={
                        detail?.estadoAlumno?.label || "Estudiando teórico"
                      }
                      sx={getProgressChipSx(Boolean(detail?.estadoAlumno?.ok))}
                    />
                  </Stack>
                </CardContent>
              </Card>

              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
                    Test práctica
                  </Typography>

                  <Typography
                    variant="subtitle2"
                    fontWeight={700}
                    sx={{ mb: 1 }}
                  >
                    Convocatorias examen teórico
                  </Typography>
                  {detail?.examenes?.teoricos?.length ? (
                    <Stack spacing={1} sx={{ mb: 1.5 }}>
                      {detail.examenes.teoricos.map((examen) => (
                        <Box
                          key={`teo-${examen.id}`}
                          sx={{
                            p: 1.25,
                            borderRadius: 2,
                            border: "1px solid #e2e8f0",
                            backgroundColor: "#ffffff",
                          }}
                        >
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography variant="subtitle2" fontWeight={700}>
                              {new Date(
                                examen.fechaProgramada || examen.fechaSolicitud,
                              ).toLocaleDateString("es-ES")}
                            </Typography>
                            <Chip
                              size="small"
                              color={getExamResultMeta(examen.estado).color}
                              icon={getExamResultMeta(examen.estado).icon}
                              label={getExamResultMeta(examen.estado).label}
                            />
                          </Stack>
                          <Typography variant="body2" color="text.secondary">
                            Aciertos: {examen.aciertosExamen ?? "-"} | Fallos:{" "}
                            {examen.fallosExamen ?? "-"}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  ) : (
                    <Alert severity="info" sx={{ mb: 1.5 }}>
                      El alumno no tiene convocatorias teóricas presentadas.
                    </Alert>
                  )}

                  <Typography
                    variant="subtitle2"
                    fontWeight={700}
                    sx={{ mb: 1 }}
                  >
                    Convocatorias examen práctico
                  </Typography>
                  {detail?.examenes?.practicos?.length ? (
                    <Stack spacing={1} sx={{ mb: 1.5 }}>
                      {detail.examenes.practicos.map((examen) => (
                        <Box
                          key={`pra-${examen.id}`}
                          sx={{
                            p: 1.25,
                            borderRadius: 2,
                            border: "1px solid #e2e8f0",
                            backgroundColor: "#ffffff",
                          }}
                        >
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography variant="subtitle2" fontWeight={700}>
                              {new Date(
                                examen.fechaProgramada || examen.fechaSolicitud,
                              ).toLocaleDateString("es-ES")}
                            </Typography>
                            <Chip
                              size="small"
                              color={getExamResultMeta(examen.estado).color}
                              icon={getExamResultMeta(examen.estado).icon}
                              label={getExamResultMeta(examen.estado).label}
                            />
                          </Stack>
                          <Typography variant="body2" color="text.secondary">
                            Leves: {examen.faltasLeves ?? "-"} | Deficientes:{" "}
                            {examen.faltasDeficientes ?? "-"} | Eliminatorias:{" "}
                            {examen.faltasEliminatorias ?? "-"}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  ) : (
                    <Alert severity="info" sx={{ mb: 1.5 }}>
                      El alumno no tiene convocatorias prácticas presentadas.
                    </Alert>
                  )}

                  <Grid container spacing={1.5}>
                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          backgroundColor: "#f8fafc",
                        }}
                      >
                        <Typography variant="subtitle2" fontWeight={700}>
                          Tests internos
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          Total: {detail?.tests?.total ?? 0} | Aprobados:{" "}
                          {detail?.tests?.aprobados ?? 0} | Suspendidos:{" "}
                          {detail?.tests?.suspendidos ?? 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Éxito:{" "}
                          {Number(
                            detail?.tests?.porcentajeAprobado || 0,
                          ).toFixed(1)}
                          %
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          backgroundColor: "#f0f9ff",
                        }}
                      >
                        <Typography variant="subtitle2" fontWeight={700}>
                          Exámenes DGT
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          Total: {detail?.dgt?.total ?? 0} | Aprobados:{" "}
                          {detail?.dgt?.aprobados ?? 0} | Suspendidos:{" "}
                          {detail?.dgt?.suspendidos ?? 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Éxito:{" "}
                          {Number(detail?.dgt?.porcentajeAprobado || 0).toFixed(
                            1,
                          )}
                          %
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
                    Práctica
                  </Typography>

                  <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                    <Chip
                      color="success"
                      label={`Clases realizadas: ${detail?.practica?.clasesRealizadas ?? 0}`}
                    />
                    <Chip
                      color="primary"
                      label={`Clases reservadas: ${detail?.practica?.clasesReservadas ?? 0}`}
                    />
                    <Chip
                      color="default"
                      label={`Horas de práctica: ${detail?.practica?.horasCompletadasTexto || "0h 00min"}`}
                    />
                  </Stack>

                  <Typography fontWeight={700} sx={{ mt: 2, mb: 1 }}>
                    Próximas clases
                  </Typography>

                  {detail?.practica?.proximasClases?.length ? (
                    <Stack spacing={1}>
                      {detail.practica.proximasClases.map((clase) => (
                        <Box
                          key={clase.id}
                          sx={{
                            p: 1.25,
                            borderRadius: 2,
                            border: "1px solid #e2e8f0",
                          }}
                        >
                          <Typography variant="body2">
                            Fecha:{" "}
                            {new Date(clase.fecha).toLocaleString("es-ES")}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Duración: {clase.duracion} min | Vehículo:{" "}
                            {clase.vehiculo?.marca || "Sin vehículo"}{" "}
                            {clase.vehiculo?.modelo || ""}{" "}
                            {clase.vehiculo?.matricula || ""}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No tiene clases programadas.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Stack>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDetail(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
