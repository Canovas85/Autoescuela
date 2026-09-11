import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import GroupIcon from "@mui/icons-material/Group";
import VerifiedIcon from "@mui/icons-material/Verified";
import CommuteIcon from "@mui/icons-material/Commute";

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

export default function ProfessorDashboard({ data }) {
  const navigate = useNavigate();
  const perfil = data?.perfil || {};
  const resumen = data?.resumen || {};
  const alumnos = Array.isArray(data?.alumnos) ? data.alumnos : [];
  const vehiculos = Array.isArray(data?.vehiculos) ? data.vehiculos : [];

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
            title="Matrículas Pagadas"
            value={resumen.alumnosMatriculaPagada ?? 0}
            subtitle="Alumnos asignados con matrícula en estado pagada"
            color="#16a34a"
            icon={<VerifiedIcon />}
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
                        flexDirection: "column",
                        gap: 1,
                        alignItems: "flex-end",
                      }}
                    >
                      <Chip
                        label={`Licencia ${alumno.tipoLicenciaObjetivo || "-"}`}
                        color="primary"
                        size="small"
                      />
                      <Chip
                        label={alumno.matriculaEstado || "PENDIENTE"}
                        color={
                          alumno.matriculaEstado === "PAGADA"
                            ? "success"
                            : "warning"
                        }
                        size="small"
                      />
                    </Box>
                  </CardContent>
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
    </Box>
  );
}
