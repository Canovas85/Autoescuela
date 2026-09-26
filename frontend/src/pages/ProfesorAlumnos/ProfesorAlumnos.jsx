import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import DownloadIcon from "@mui/icons-material/Download";
import HistoryIcon from "@mui/icons-material/History";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

import { profesorPortalService } from "../../services/profesorPortalService";
import { LicenseChip } from "../../components/common/LicenseChip";
import { exportProfesorAlumnosExcel } from "../../utils/exportProfesorAlumnosExcel";
import { exportProfesorAlumnosPdf } from "../../utils/exportProfesorAlumnosPdf";

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

const getProgressChipSx = (ok) => ({
  backgroundColor: ok ? "#dcfce7" : "#fef3c7",
  color: ok ? "#166534" : "#92400e",
  border: `1px solid ${ok ? "#86efac" : "#fcd34d"}`,
  fontWeight: 700,
});

const formatExamDate = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("es-ES");
};

const examStateMeta = (estado) => {
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

const isLicenseObtainedLabel = (estadoAlumno) =>
  String(estadoAlumno?.codigo || "").toUpperCase() === "LICENCIA_OBTENIDA" ||
  String(estadoAlumno?.label || "")
    .toLowerCase()
    .includes("licencia obtenida");

const formatHistoryFieldValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  if (typeof value === "boolean") {
    return value ? "Sí" : "No";
  }

  if (value instanceof Date) {
    return formatDateTime(value.toISOString());
  }

  if (typeof value === "string") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime()) && value.includes("-")) {
      return formatDateTime(value);
    }
    return value;
  }

  if (typeof value === "number") {
    return String(value);
  }

  return JSON.stringify(value);
};

const HISTORY_DETAIL_LABELS = {
  tipo: "Tipo",
  concepto: "Concepto",
  permiso: "Permiso",
  importe: "Importe",
  convocatoriasIncluidas: "Convocatorias incluidas",
  convocatoriasConsumidas: "Convocatorias consumidas",
  estado: "Estado",
  fechaSolicitud: "Fecha solicitud",
  fechaProgramada: "Fecha programada",
  erroresExamen: "Errores",
  aciertosExamen: "Aciertos",
  faltasLeves: "Faltas leves",
  faltasDeficientes: "Faltas deficientes",
  faltasEliminatorias: "Faltas eliminatorias",
  motivoNoApto: "Motivo no apto",
  duracion: "Duración (min)",
  matriculaVehiculo: "Matrícula vehículo",
  licenciaVehiculo: "Licencia vehículo",
};

export default function ProfesorAlumnos() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const [openDetail, setOpenDetail] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detail, setDetail] = useState(null);
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const [openHistory, setOpenHistory] = useState(false);
  const [selectedHistoryEvent, setSelectedHistoryEvent] = useState(null);

  const exportMenuOpen = Boolean(exportAnchorEl);

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
      renderCell: (params) => <LicenseChip value={params.value} />,
    },
    {
      field: "estadoAlumno",
      headerName: "Estado",
      width: 240,
      renderCell: (params) => (
        <Chip
          label={params.value?.label || "Estudiando teórico"}
          sx={getProgressChipSx(Boolean(params.value?.ok))}
          size="small"
        />
      ),
    },
    {
      field: "clasesRealizadas",
      headerName: "Clases realizadas",
      width: 150,
      valueGetter: (_, row) => row.clasesRealizadas ?? 0,
    },
    {
      field: "horasPracticasTexto",
      headerName: "Horas práctica",
      width: 150,
      valueGetter: (_, row) => row.horasPracticasTexto || "0h 00min",
    },
  ];

  const openStudentDetail = async (row) => {
    setOpenDetail(true);
    setLoadingDetail(true);
    setDetail(null);
    setError("");

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

  const handleExportExcel = () => {
    exportProfesorAlumnosExcel(filteredRows);
    setExportAnchorEl(null);
  };

  const handleExportPdf = () => {
    exportProfesorAlumnosPdf(filteredRows);
    setExportAnchorEl(null);
  };

  const historyRows = useMemo(
    () =>
      Array.isArray(detail?.historialEstado) ? detail.historialEstado : [],
    [detail],
  );

  const historyColumns = useMemo(
    () => [
      {
        field: "fecha",
        headerName: "Fecha",
        flex: 1.1,
        valueGetter: (_, row) => formatDateTime(row.fecha),
      },
      {
        field: "accion",
        headerName: "Acción",
        flex: 1.6,
      },
      {
        field: "categoria",
        headerName: "Categoría",
        flex: 0.9,
        renderCell: (params) => (
          <Chip size="small" label={params.value || "-"} />
        ),
      },
      {
        field: "resumen",
        headerName: "Resumen",
        flex: 1.8,
      },
      {
        field: "detalle",
        headerName: "Detalle",
        width: 90,
        sortable: false,
        renderCell: (params) => (
          <Tooltip
            title={
              params.row?.detalleHabilitado
                ? "Ver detalle"
                : "Detalle disponible solo para pagos, convocatoria DGT y clases con hoja de ruta registrada"
            }
            arrow
          >
            <IconButton
              size="small"
              color="primary"
              disabled={!params.row?.detalleHabilitado}
              onClick={(event) => {
                event.stopPropagation();
                setSelectedHistoryEvent(params.row);
              }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ),
      },
    ],
    [],
  );

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Mis Alumnos
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Selecciona un alumno para ver su evolución teórica y práctica.
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

        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={(event) => setExportAnchorEl(event.currentTarget)}
        >
          Exportar
        </Button>

        <Menu
          anchorEl={exportAnchorEl}
          open={exportMenuOpen}
          onClose={() => setExportAnchorEl(null)}
        >
          <MenuItem onClick={handleExportExcel}>Exportar a Excel</MenuItem>
          <MenuItem onClick={handleExportPdf}>Exportar a PDF</MenuItem>
        </Menu>
      </Stack>

      <Paper sx={{ p: 2, height: 700 }}>
        <DataGrid
          loading={loading}
          rows={filteredRows}
          columns={columns}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
            sorting: { sortModel: [{ field: "nombre", sort: "asc" }] },
          }}
          onRowClick={(params) => openStudentDetail(params.row)}
          localeText={{ noRowsLabel: "No hay alumnos asignados" }}
        />
      </Paper>

      <Dialog
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Typography variant="h6" fontWeight={700}>
              Detalle del alumno
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                size="small"
                label={detail?.estadoAlumno?.label || "Estudiando teórico"}
                sx={getProgressChipSx(Boolean(detail?.estadoAlumno?.ok))}
              />

              {isLicenseObtainedLabel(detail?.estadoAlumno) && (
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.75,
                    px: 1,
                    py: 0.25,
                    borderRadius: 999,
                    bgcolor: "#fffbeb",
                    border: "1px solid #facc15",
                  }}
                >
                  <EmojiEventsIcon sx={{ color: "#ca8a04", fontSize: 16 }} />
                  <Typography
                    variant="caption"
                    sx={{ color: "#854d0e", fontWeight: 800 }}
                  >
                    Medalla de oro
                  </Typography>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      display: "grid",
                      placeItems: "center",
                      color: "#064e3b",
                      bgcolor: "#d1fae5",
                      border: "1px solid #34d399",
                      fontWeight: 900,
                    }}
                  >
                    L
                  </Box>
                </Box>
              )}

              <LicenseChip value={detail?.perfil?.tipoLicenciaObjetivo} />
            </Stack>
          </Box>
        </DialogTitle>

        <DialogContent>
          {loadingDetail ? (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                py: 5,
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Stack spacing={2}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography fontWeight={800}>Datos personales</Typography>
                </Box>

                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip
                    sx={{ mt: 1 }}
                    color="success"
                    label={`Nombre: ${detail?.perfil?.nombre || "-"}`}
                  />
                  <Chip
                    sx={{ mt: 1 }}
                    color="info"
                    label={`Email: ${detail?.perfil?.email || "-"}`}
                  />
                  <Chip
                    sx={{ mt: 1 }}
                    color="warning"
                    label={`Teléfono: ${detail?.perfil?.telefono || "-"}`}
                  />
                  <Chip
                    sx={{ mt: 1 }}
                    color="inherit"
                    label={`DNI: ${detail?.perfil?.dni || "-"}`}
                  />
                  <Box sx={{ flex: 1, textAlign: "right" }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<HistoryIcon fontSize="small" />}
                      onClick={() => setOpenHistory(true)}
                      disabled={loadingDetail}
                    >
                      Historial de estado
                    </Button>
                  </Box>
                </Stack>
              </Paper>

              <Grid container spacing={2}>
                {/* PRIMERA COLUMNA: Test práctica (Ocupa 6 de 12 columnas) */}
                <Grid item xs={6}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      width: "550px",
                      height: "300px",
                    }} // width: "100%" asegura que llene la columna
                  >
                    <Typography fontWeight={800} sx={{ mb: 1 }}>
                      Test práctica
                    </Typography>

                    <Stack spacing={1.5}>
                      <Box
                        sx={{
                          p: 1.25,
                          borderRadius: 2,
                          backgroundColor: "#f8fafc",
                        }}
                      >
                        <Typography variant="subtitle2" fontWeight={700}>
                          Tests internos
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
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

                      <Box
                        sx={{
                          p: 1.25,
                          borderRadius: 2,
                          backgroundColor: "#f0f9ff",
                        }}
                      >
                        <Typography variant="subtitle2" fontWeight={700}>
                          Exámenes DGT
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
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
                    </Stack>
                  </Paper>
                </Grid>

                {/* SEGUNDA COLUMNA: Exámenes teóricos (Ocupa 6 de 12 columnas) */}
                <Grid item xs={6}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      width: "550px",
                      height: "300px",
                    }} // width: "100%" asegura que llene la columna
                  >
                    <Typography fontWeight={800} sx={{ mb: 1 }}>
                      Exámenes teóricos
                    </Typography>

                    {detail?.examenes?.teoricos?.length ? (
                      <Stack spacing={1}>
                        {detail.examenes.teoricos.map((examen) => {
                          const state = examStateMeta(examen.estado);

                          return (
                            <Box
                              key={examen.id}
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
                                sx={{ mb: 0.5 }}
                              >
                                <Typography
                                  variant="subtitle2"
                                  fontWeight={700}
                                  sx={{ mr: 35 }}
                                >
                                  Fecha:{" "}
                                  {formatExamDate(
                                    examen.fechaProgramada ||
                                      examen.fechaSolicitud,
                                  )}
                                </Typography>
                                <Chip
                                  icon={state.icon}
                                  size="small"
                                  color={state.color}
                                  label={state.label}
                                />
                              </Stack>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Aciertos: {examen.aciertosExamen ?? "-"} |
                                Fallos: {examen.fallosExamen ?? "-"}
                              </Typography>
                            </Box>
                          );
                        })}
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        El alumno no se ha presentado al examen teórico.
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              </Grid>

              {detail?.areasRefuerzo?.length ? (
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography
                    fontWeight={700}
                    color="text.secondary"
                    gutterBottom
                  >
                    Áreas de refuerzo
                  </Typography>
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
                </Paper>
              ) : null}

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Paper
                    variant="outlined"
                    sx={{ p: 2, borderRadius: 2, width: "550px" }}
                  >
                    <Typography
                      fontWeight={700}
                      color="text.secondary"
                      gutterBottom
                    >
                      Práctica
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.75 }}>
                      {detail?.practica?.bonoActivo
                        ? `Bono activo: ${detail.practica.bonoActivo.nombre} | Clases bono: ${detail.practica.bonoActivo.clasesBono} | Clases restantes: ${detail.practica.bonoActivo.clasesRestantes}`
                        : "Bono activo: No"}
                    </Typography>
                    <Typography variant="body2">
                      Clases realizadas:{" "}
                      {detail?.practica?.clasesRealizadas ?? 0} | Clases
                      reservadas: {detail?.practica?.clasesReservadas ?? 0} |
                      Horas completadas:{" "}
                      {detail?.practica?.horasCompletadasTexto || "0h 00min"}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper
                    variant="outlined"
                    sx={{ p: 2, borderRadius: 2, width: "550px" }}
                  >
                    <Typography
                      fontWeight={700}
                      color="text.secondary"
                      gutterBottom
                    >
                      Exámenes prácticos
                    </Typography>

                    {detail?.examenes?.practicos?.length ? (
                      <Stack spacing={1}>
                        {detail.examenes.practicos.map((examen) => {
                          const state = examStateMeta(examen.estado);

                          return (
                            <Box
                              key={examen.id}
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
                                sx={{ mb: 0.5 }}
                              >
                                <Typography
                                  variant="subtitle2"
                                  fontWeight={700}
                                  sx={{ mr: 35 }}
                                >
                                  Fecha:{" "}
                                  {formatExamDate(
                                    examen.fechaProgramada ||
                                      examen.fechaSolicitud,
                                  )}
                                </Typography>
                                <Chip
                                  icon={state.icon}
                                  size="small"
                                  color={state.color}
                                  label={state.label}
                                />
                              </Stack>

                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Faltas leves: {examen.faltasLeves ?? "-"} |
                                Deficientes: {examen.faltasDeficientes ?? "-"} |
                                Eliminatorias:{" "}
                                {examen.faltasEliminatorias ?? "-"}
                              </Typography>
                            </Box>
                          );
                        })}
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        El alumno no se ha presentado al examen práctico.
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              </Grid>

              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Typography
                  fontWeight={700}
                  color="text.secondary"
                  gutterBottom
                >
                  Próximas clases
                </Typography>
                {detail?.practica?.proximasClases?.length ? (
                  <Stack spacing={1}>
                    {detail.practica.proximasClases.map((clase) => (
                      <Typography key={clase.id} variant="body2">
                        Fecha: {formatDateTime(clase.fecha)} | Duración:{" "}
                        {clase.duracion} min | Vehículo:{" "}
                        {clase.vehiculo?.marca || "Sin vehículo"}{" "}
                        {clase.vehiculo?.modelo || ""}{" "}
                        {clase.vehiculo?.matricula || ""}
                      </Typography>
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2">
                    No tiene clases programadas.
                  </Typography>
                )}
              </Paper>
            </Stack>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDetail(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openHistory}
        onClose={() => {
          setOpenHistory(false);
          setSelectedHistoryEvent(null);
        }}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>Historial de estado</DialogTitle>
        <DialogContent>
          <Box sx={{ height: 520, mt: 1 }}>
            <DataGrid
              rows={historyRows}
              columns={historyColumns}
              getRowId={(row) => row.id}
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              initialState={{
                pagination: { paginationModel: { pageSize: 10, page: 0 } },
                sorting: { sortModel: [{ field: "fecha", sort: "asc" }] },
              }}
              localeText={{ noRowsLabel: "No hay acciones registradas" }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenHistory(false);
              setSelectedHistoryEvent(null);
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(selectedHistoryEvent)}
        onClose={() => setSelectedHistoryEvent(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Detalle de acción</DialogTitle>
        <DialogContent>
          <Stack spacing={1} sx={{ mt: 0.5 }}>
            <Typography variant="body2">
              <strong>Fecha:</strong>{" "}
              {formatDateTime(selectedHistoryEvent?.fecha)}
            </Typography>
            <Typography variant="body2">
              <strong>Acción:</strong> {selectedHistoryEvent?.accion || "-"}
            </Typography>
            <Typography variant="body2">
              <strong>Categoría:</strong>{" "}
              {selectedHistoryEvent?.categoria || "-"}
            </Typography>
            <Typography variant="body2">
              <strong>Resumen:</strong> {selectedHistoryEvent?.resumen || "-"}
            </Typography>
            <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 1.5 }}>
              <Typography variant="subtitle2" sx={{ mb: 1.25 }}>
                Datos adicionales
              </Typography>
              <Stack spacing={0.8}>
                {Object.entries(selectedHistoryEvent?.detalle || {}).length ? (
                  Object.entries(selectedHistoryEvent?.detalle || {}).map(
                    ([key, value]) => (
                      <Box
                        key={key}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 2,
                          borderBottom: "1px dashed #e2e8f0",
                          py: 0.6,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          {HISTORY_DETAIL_LABELS[key] || key}
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight={700}
                          sx={{ textAlign: "right" }}
                        >
                          {formatHistoryFieldValue(value)}
                        </Typography>
                      </Box>
                    ),
                  )
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Sin datos adicionales.
                  </Typography>
                )}
              </Stack>
            </Paper>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedHistoryEvent(null)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
