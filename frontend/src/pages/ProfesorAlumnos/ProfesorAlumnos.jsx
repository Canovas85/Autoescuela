import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { profesorPortalService } from "../../services/profesorPortalService";

const formatDateTime = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function ProfesorAlumnos() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const [openDetail, setOpenDetail] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detail, setDetail] = useState(null);

  const loadStudents = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await profesorPortalService.getStudents();
      setRows(Array.isArray(data) ? data : []);
    } catch (loadError) {
      setError(
        loadError.response?.data?.message ||
          "No se pudieron cargar los alumnos asignados",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const filteredRows = useMemo(() => {
    if (!search.trim()) {
      return rows;
    }

    const q = search.trim().toLowerCase();

    return rows.filter(
      (row) =>
        row.nombre?.toLowerCase().includes(q) ||
        row.email?.toLowerCase().includes(q) ||
        row.tipoLicenciaObjetivo?.toLowerCase().includes(q),
    );
  }, [rows, search]);

  const columns = [
    {
      field: "nombre",
      headerName: "Alumno",
      flex: 1.2,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1.4,
    },
    {
      field: "tipoLicenciaObjetivo",
      headerName: "Licencia",
      width: 110,
    },
    {
      field: "matriculaEstado",
      headerName: "Matrícula",
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value || "PENDIENTE"}
          color={params.value === "PAGADA" ? "success" : "warning"}
          size="small"
        />
      ),
    },
    {
      field: "horasPracticasCompletadas",
      headerName: "Horas prácticas",
      width: 140,
    },
  ];

  const openStudentDetail = async (row) => {
    setOpenDetail(true);
    setLoadingDetail(true);
    setDetail(null);

    try {
      const response = await profesorPortalService.getStudentDetail(row.id);
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

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Mis Alumnos
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Selecciona un alumno para ver su evolución, áreas de refuerzo y estado
        de preparación para examen.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          size="small"
          label="Buscar alumno"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          sx={{ width: { xs: "100%", sm: 340 } }}
        />

        <Button variant="outlined" onClick={loadStudents}>
          Recargar
        </Button>
      </Stack>

      <Paper sx={{ p: 2, height: 560 }}>
        <DataGrid
          loading={loading}
          rows={filteredRows}
          columns={columns}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10, 25]}
          onRowClick={(params) => openStudentDetail(params.row)}
          localeText={{ noRowsLabel: "No hay alumnos asignados" }}
        />
      </Paper>

      <Dialog
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Detalle del alumno</DialogTitle>

        <DialogContent>
          {loadingDetail ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Datos personales
                </Typography>
                <Typography fontWeight={700}>
                  {detail?.perfil?.nombre}
                </Typography>
                <Typography variant="body2">{detail?.perfil?.email}</Typography>
                <Typography variant="body2">
                  Teléfono: {detail?.perfil?.telefono || "-"}
                </Typography>
                <Typography variant="body2">
                  DNI: {detail?.perfil?.dni || "-"}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Chip
                  label={`Matrícula ${detail?.perfil?.matriculaEstado || "PENDIENTE"}`}
                  color={
                    detail?.perfil?.matriculaEstado === "PAGADA"
                      ? "success"
                      : "warning"
                  }
                  size="small"
                />
                <Chip
                  label={`Licencia ${detail?.perfil?.tipoLicenciaObjetivo || "-"}`}
                  color="primary"
                  size="small"
                />
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Tests de práctica
                </Typography>
                <Typography variant="body2">
                  Total: {detail?.tests?.total ?? 0} | Aprobados:{" "}
                  {detail?.tests?.aprobados ?? 0} | Suspendidos:{" "}
                  {detail?.tests?.suspendidos ?? 0} | Éxito:{" "}
                  {Number(detail?.tests?.porcentajeAprobado || 0).toFixed(1)}%
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Áreas de refuerzo
                </Typography>
                {detail?.areasRefuerzo?.length ? (
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {detail.areasRefuerzo.map((area) => (
                      <Chip
                        key={area.tema}
                        label={`${area.tema} (${area.fallos})`}
                        color="warning"
                        size="small"
                      />
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2">
                    Sin áreas críticas actualmente.
                  </Typography>
                )}
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Práctica
                </Typography>
                <Typography variant="body2">
                  Clases realizadas: {detail?.practica?.clasesRealizadas ?? 0} |
                  Horas completadas:{" "}
                  {detail?.perfil?.horasPracticasCompletadas ?? 0}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Próximas clases
                </Typography>
                {detail?.practica?.proximasClases?.length ? (
                  <Stack spacing={1}>
                    {detail.practica.proximasClases.map((clase) => (
                      <Typography key={clase.id} variant="body2">
                        {formatDateTime(clase.fecha)} | {clase.duracion} min |{" "}
                        {clase.vehiculo?.matricula || "Sin vehículo"}
                      </Typography>
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2">
                    No tiene clases programadas.
                  </Typography>
                )}
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Estado general
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip
                    label={detail?.evaluacion?.estadoGeneral || "EN_PROGRESO"}
                    color="info"
                    size="small"
                  />
                  <Chip
                    label={
                      detail?.evaluacion?.preparadoParaTeorico
                        ? "Listo para teórico"
                        : "Aún no listo para teórico"
                    }
                    color={
                      detail?.evaluacion?.preparadoParaTeorico
                        ? "success"
                        : "default"
                    }
                    size="small"
                  />
                  <Chip
                    label={
                      detail?.evaluacion?.preparadoParaPractico
                        ? "Listo para práctico"
                        : "Aún no listo para práctico"
                    }
                    color={
                      detail?.evaluacion?.preparadoParaPractico
                        ? "success"
                        : "default"
                    }
                    size="small"
                  />
                </Stack>
              </Box>
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
