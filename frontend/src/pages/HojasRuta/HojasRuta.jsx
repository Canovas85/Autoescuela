import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  Menu,
  MenuItem,
  Pagination,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import RouteIcon from "@mui/icons-material/Route";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DownloadIcon from "@mui/icons-material/Download";
import { jwtDecode } from "jwt-decode";

import { hojasRutaService } from "../../services/hojasRutaService";
import { exportHojasRutaProfesoresExcel } from "../../utils/exportHojasRutaProfesoresExcel";
import { exportHojasRutaProfesoresPdf } from "../../utils/exportHojasRutaProfesoresPdf";
import { exportHojasRutaAlumnosProfesorExcel } from "../../utils/exportHojasRutaAlumnosProfesorExcel";
import { exportHojasRutaAlumnosProfesorPdf } from "../../utils/exportHojasRutaAlumnosProfesorPdf";
import { exportHojasRutaAlumnoDetalleExcel } from "../../utils/exportHojasRutaAlumnoDetalleExcel";
import { exportHojasRutaAlumnoDetallePdf } from "../../utils/exportHojasRutaAlumnoDetallePdf";

const formatDateTime = (value) => {
  if (!value) return "-";

  return new Date(value).toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDate = (value) => {
  if (!value) return "-";

  return new Date(value).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatTime = (value) => {
  if (!value) return "-";

  return new Date(value).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const colorByStatus = (status) => {
  if (status === "REGISTRADA") return "success";
  if (status === "EN_CURSO") return "warning";
  if (status === "PENDIENTE") return "warning";
  if (status === "CANCELADA") return "error";
  return "default";
};

const ADMIN_ROADMAP_STATUS_OPTIONS = [
  { value: "", label: "Todos" },
  { value: "PENDIENTE", label: "Pendiente" },
  { value: "EN_CURSO", label: "En curso" },
  { value: "REGISTRADA", label: "Registrada" },
  { value: "CANCELADA", label: "Cancelada" },
];

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, index) => {
  const value = String(index + 1);
  return {
    value,
    label: value,
  };
});

const formatDateLocal = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const initialFault = {
  hora: "",
  tipo: "LEVE",
  categoria: "",
  descripcion: "",
  catalogoId: "",
};

const countFaults = (faults = []) => ({
  leves: faults.filter((item) => item.tipo === "LEVE").length,
  deficientes: faults.filter((item) => item.tipo === "DEFICIENTE").length,
  eliminatorias: faults.filter((item) => item.tipo === "ELIMINATORIA").length,
});

const faultToneByType = {
  LEVE: {
    bg: "#f3faf4",
    border: "#d3efd8",
    color: "#1e7a34",
    dot: "#2fb24b",
  },
  DEFICIENTE: {
    bg: "#fff8ef",
    border: "#f7dfbf",
    color: "#ae6500",
    dot: "#f0a020",
  },
  ELIMINATORIA: {
    bg: "#fff3f3",
    border: "#f5caca",
    color: "#b42318",
    dot: "#f04438",
  },
};

const statCardSx = {
  borderRadius: 2.5,
  border: "1px solid",
  borderColor: "divider",
  boxShadow: "none",
};

function RoadmapDetail({
  title,
  readonly,
  value,
  onChange,
  onSaveDraft,
  onFinalize,
  onBack,
  catalog,
  loading,
  onGoRefuel,
}) {
  const [faultDialogOpen, setFaultDialogOpen] = useState(false);
  const [faultDraft, setFaultDraft] = useState(initialFault);

  useEffect(() => {
    if (value) {
      setFaultDraft((prev) => ({
        ...prev,
        hora: prev.hora || new Date().toTimeString().slice(0, 5),
      }));
    }
  }, [value]);

  if (!value) {
    return <Typography>Cargando detalle...</Typography>;
  }

  const faultCounts = countFaults(value.faltas || []);
  const kmHechos =
    value.kilometrosInicio !== null && value.kilometrosFin !== null
      ? value.kilometrosFin - value.kilometrosInicio
      : null;
  const combustibleInicio = value.combustibleInicioPct ?? 0;
  const combustibleActual = value.combustibleFinPct ?? 0;

  const addFault = () => {
    if (!faultDraft.hora || !faultDraft.categoria || !faultDraft.descripcion) {
      return;
    }

    onChange({
      ...value,
      faltas: [...(value.faltas || []), faultDraft],
    });

    setFaultDraft({
      ...initialFault,
      hora: new Date().toTimeString().slice(0, 5),
    });
    setFaultDialogOpen(false);
  };

  const deleteFault = (index) => {
    onChange({
      ...value,
      faltas: (value.faltas || []).filter((_, i) => i !== index),
    });
  };

  const optionsByType = catalog?.[faultDraft.tipo] || [];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <IconButton onClick={onBack}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h5" fontWeight={800}>
            {title}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography color="text.secondary">Estado</Typography>
            <Chip
              size="small"
              label={value.estado || "PENDIENTE"}
              color={colorByStatus(value.estado || "PENDIENTE")}
            />
          </Stack>
        </Box>
      </Stack>

      <Card sx={{ ...statCardSx, width: 1018 }}>
        <CardContent>
          {value?.requiereRepostaje && !readonly ? (
            <Alert
              severity="warning"
              sx={{ mb: 0.5 }}
              action={
                <Button size="small" variant="contained" onClick={onGoRefuel}>
                  Combustible
                </Button>
              }
            >
              <Box sx={{ mb: 0.5 }}>
                {value?.bloqueoRepostajeMensaje ||
                  "El vehículo tiene menos del 20% de combustible. Debes repostar antes de guardar o finalizar la hoja de ruta."}
              </Box>
            </Alert>
          ) : null}

          <Grid container spacing={2.25}>
            <Grid item xs={12} md={4}>
              <Stack
                direction="row"
                spacing={1.25}
                alignItems="center"
                sx={{ mt: 2 }}
              >
                <PersonIcon fontSize="small" />
                <Box>
                  <Typography color="text.secondary">Alumno</Typography>
                  <Typography fontWeight={100}>
                    {value.alumno?.nombre}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack
                direction="row"
                spacing={1.25}
                alignItems="center"
                sx={{ mt: 2 }}
              >
                <DirectionsCarIcon fontSize="small" />
                <Box>
                  <Typography color="text.secondary">Vehículo</Typography>
                  <Typography fontWeight={700}>
                    {value.vehiculo?.marca} {value.vehiculo?.modelo}{" "}
                    {value.vehiculo?.matricula}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} md={2}>
              <Stack
                direction="row"
                spacing={1.25}
                alignItems="center"
                sx={{ mt: 2 }}
              >
                <CalendarMonthIcon fontSize="small" />
                <Box>
                  <Typography color="text.secondary">Fecha</Typography>
                  <Typography fontWeight={700}>
                    {formatDate(value.fecha)}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} md={2}>
              <Stack
                direction="row"
                spacing={1.25}
                alignItems="center"
                sx={{ mt: 2 }}
              >
                <AccessTimeIcon fontSize="small" />
                <Box>
                  <Typography color="text.secondary">Hora inicio</Typography>
                  <Typography fontWeight={700}>
                    {formatTime(value.fecha)}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} md={2}>
              <Stack
                direction="row"
                spacing={1.25}
                alignItems="center"
                sx={{ mt: 2 }}
              >
                <AccessTimeIcon fontSize="small" />
                <Box>
                  <Typography color="text.secondary">Duración</Typography>
                  <Typography fontWeight={700}>
                    {value.duracion ? `${value.duracion} min` : "-"}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack
                direction="row"
                spacing={1.25}
                alignItems="center"
                sx={{ mt: 2 }}
              >
                <PersonIcon fontSize="small" />
                <Box>
                  <Typography color="text.secondary">Profesor</Typography>
                  <Typography fontWeight={700}>
                    {value.profesor?.nombre}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card sx={{ ...statCardSx, width: 500 }}>
            <CardContent>
              <Typography fontWeight={800} sx={{ mb: 1 }}>
                Kilómetros
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Iniciales"
                    type="number"
                    value={value.kilometrosInicio ?? ""}
                    disabled={readonly}
                    onChange={(event) =>
                      onChange({
                        ...value,
                        kilometrosInicio:
                          event.target.value === ""
                            ? null
                            : Number(event.target.value),
                      })
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Actuales"
                    type="number"
                    value={value.kilometrosFin ?? ""}
                    disabled={readonly}
                    onChange={(event) =>
                      onChange({
                        ...value,
                        kilometrosFin:
                          event.target.value === ""
                            ? null
                            : Number(event.target.value),
                      })
                    }
                  />
                </Grid>
              </Grid>
              <Typography color="primary.main" sx={{ mt: 1, fontWeight: 700 }}>
                {kmHechos !== null
                  ? `Kilómetros realizados +${kmHechos} km`
                  : "Kilómetros realizados -"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ ...statCardSx, width: 500 }}>
            <CardContent>
              <Typography fontWeight={800} sx={{ mb: 1 }}>
                Combustible
              </Typography>
              <Stack spacing={1.5}>
                <Box>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{ mb: 0.5 }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Inicio
                    </Typography>
                    <Typography variant="caption" fontWeight={700}>
                      {combustibleInicio}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={Math.max(0, Math.min(100, combustibleInicio))}
                    sx={{ height: 8, borderRadius: 999 }}
                  />
                </Box>
                <Box>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{ mb: 0.5 }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Actual
                    </Typography>
                    <Typography variant="caption" fontWeight={700}>
                      {combustibleActual}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={Math.max(0, Math.min(100, combustibleActual))}
                    sx={{ height: 8, borderRadius: 999 }}
                  />
                </Box>
                {!readonly ? (
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Inicio (%)"
                        type="number"
                        size="small"
                        value={value.combustibleInicioPct ?? ""}
                        onChange={(event) =>
                          onChange({
                            ...value,
                            combustibleInicioPct:
                              event.target.value === ""
                                ? null
                                : Number(event.target.value),
                          })
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Actual (%)"
                        type="number"
                        size="small"
                        value={value.combustibleFinPct ?? ""}
                        onChange={(event) =>
                          onChange({
                            ...value,
                            combustibleFinPct:
                              event.target.value === ""
                                ? null
                                : Number(event.target.value),
                          })
                        }
                      />
                    </Grid>
                  </Grid>
                ) : null}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={statCardSx}>
        <CardContent>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 1.5 }}
          >
            <Typography variant="h6" fontWeight={800}>
              Registro de faltas
            </Typography>
            {!readonly ? (
              <Button
                sx={{ ml: 2 }}
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setFaultDialogOpen(true)}
              >
                Añadir falta
              </Button>
            ) : null}
          </Stack>

          <Grid container spacing={1.2} sx={{ mb: 1.5 }}>
            <Grid item xs={12} md={4}>
              <Paper
                variant="outlined"
                sx={{
                  p: 1.1,
                  borderRadius: 2,
                  textAlign: "center",
                  backgroundColor: "#f3faf4",
                  borderColor: "#d3efd8",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Leves
                </Typography>
                <Typography
                  sx={{
                    color: "#1e7a34",
                    fontWeight: 800,
                    fontSize: 24,
                    width: 100,
                  }}
                >
                  {faultCounts.leves}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                variant="outlined"
                sx={{
                  p: 1.1,
                  borderRadius: 2,
                  textAlign: "center",
                  backgroundColor: "#fff8ef",
                  borderColor: "#f7dfbf",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Deficientes
                </Typography>
                <Typography
                  sx={{
                    color: "#ae6500",
                    fontWeight: 800,
                    fontSize: 24,
                    width: 100,
                  }}
                >
                  {faultCounts.deficientes}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                variant="outlined"
                sx={{
                  p: 1.1,
                  borderRadius: 2,
                  textAlign: "center",
                  backgroundColor: "#fff3f3",
                  borderColor: "#f5caca",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Eliminatorias
                </Typography>
                <Typography
                  sx={{
                    color: "#b42318",
                    fontWeight: 800,
                    fontSize: 24,
                    width: 100,
                  }}
                >
                  {faultCounts.eliminatorias}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <Box sx={{ width: "100%", overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: 0,
                border: "1px solid #eceff3",
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "10px 12px",
                      fontSize: 12,
                      color: "#667085",
                    }}
                  >
                    Hora
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "10px 12px",
                      fontSize: 12,
                      color: "#667085",
                    }}
                  >
                    Tipo
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "10px 12px",
                      fontSize: 12,
                      color: "#667085",
                    }}
                  >
                    Categoría
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "10px 12px",
                      fontSize: 12,
                      color: "#667085",
                    }}
                  >
                    Descripción
                  </th>
                  {!readonly ? (
                    <th style={{ width: 50 }} />
                  ) : (
                    <th style={{ width: 40 }} />
                  )}
                </tr>
              </thead>
              <tbody>
                {(value.faltas || []).length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        padding: "14px 12px",
                        color: "#667085",
                        textAlign: "center",
                        borderTop: "1px solid #eceff3",
                      }}
                    >
                      Sin faltas registradas
                    </td>
                  </tr>
                ) : null}
                {(value.faltas || []).map((fault, index) => {
                  const tone =
                    faultToneByType[fault.tipo] || faultToneByType.LEVE;

                  return (
                    <tr key={`${fault.hora}-${fault.categoria}-${index}`}>
                      <td
                        style={{
                          padding: "10px 12px",
                          borderTop: "1px solid #eceff3",
                        }}
                      >
                        {fault.hora}
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          borderTop: "1px solid #eceff3",
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={0.8}
                          alignItems="center"
                        >
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              backgroundColor: tone.dot,
                            }}
                          />
                          <Chip
                            size="small"
                            label={fault.tipo}
                            sx={{
                              height: 22,
                              backgroundColor: tone.bg,
                              border: "1px solid",
                              borderColor: tone.border,
                              color: tone.color,
                            }}
                          />
                        </Stack>
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          borderTop: "1px solid #eceff3",
                        }}
                      >
                        {fault.categoria}
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          borderTop: "1px solid #eceff3",
                        }}
                      >
                        {fault.descripcion}
                      </td>
                      {!readonly ? (
                        <td
                          style={{
                            padding: "6px 8px",
                            borderTop: "1px solid #eceff3",
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() => deleteFault(index)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </td>
                      ) : (
                        <td
                          style={{
                            padding: "6px 8px",
                            borderTop: "1px solid #eceff3",
                          }}
                        >
                          <IconButton size="small" disabled>
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Box>
        </CardContent>
      </Card>

      <Card sx={statCardSx}>
        <CardContent>
          <Typography fontWeight={700} sx={{ mb: 1 }}>
            Observaciones del profesor
          </Typography>
          <TextField
            fullWidth
            minRows={3}
            multiline
            value={value.observacionesProfesor || ""}
            disabled={readonly}
            onChange={(event) =>
              onChange({
                ...value,
                observacionesProfesor: event.target.value,
              })
            }
          />
        </CardContent>
      </Card>

      {!readonly ? (
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button
            variant="outlined"
            onClick={onSaveDraft}
            disabled={loading || Boolean(value?.requiereRepostaje)}
            sx={{ minWidth: 170 }}
          >
            Guardar borrador
          </Button>
          <Button
            variant="contained"
            onClick={onFinalize}
            disabled={loading || Boolean(value?.requiereRepostaje)}
            sx={{ minWidth: 170 }}
          >
            Finalizar clase
          </Button>
        </Stack>
      ) : null}

      <Dialog
        open={faultDialogOpen}
        onClose={() => setFaultDialogOpen(false)}
        fullWidth
      >
        <DialogTitle>Añadir falta</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            pt: 1,
            px: 3,
          }}
        >
          <TextField
            sx={{ mt: 2 }}
            label="Hora"
            type="time"
            value={faultDraft.hora}
            onChange={(event) =>
              setFaultDraft((prev) => ({ ...prev, hora: event.target.value }))
            }
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            select
            label="Tipo"
            value={faultDraft.tipo}
            onChange={(event) =>
              setFaultDraft((prev) => ({
                ...prev,
                tipo: event.target.value,
                catalogoId: "",
                categoria: "",
                descripcion: "",
              }))
            }
          >
            <MenuItem value="LEVE">Leve</MenuItem>
            <MenuItem value="DEFICIENTE">Deficiente</MenuItem>
            <MenuItem value="ELIMINATORIA">Eliminatoria</MenuItem>
          </TextField>
          <TextField
            select
            label="Catálogo sugerido"
            value={faultDraft.catalogoId}
            onChange={(event) => {
              const selected = optionsByType.find(
                (option) => option.id === event.target.value,
              );

              setFaultDraft((prev) => ({
                ...prev,
                catalogoId: event.target.value,
                categoria: selected?.categoria || prev.categoria,
                descripcion: selected?.descripcion || prev.descripcion,
              }));
            }}
          >
            <MenuItem value="">Sin catálogo</MenuItem>
            {optionsByType.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.categoria} - {option.descripcion}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Categoría"
            value={faultDraft.categoria}
            onChange={(event) =>
              setFaultDraft((prev) => ({
                ...prev,
                categoria: event.target.value,
              }))
            }
          />
          <TextField
            label="Descripción"
            value={faultDraft.descripcion}
            multiline
            minRows={2}
            onChange={(event) =>
              setFaultDraft((prev) => ({
                ...prev,
                descripcion: event.target.value,
              }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFaultDialogOpen(false)}>Cancelar</Button>
          <Button onClick={addFault} variant="contained">
            Añadir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default function HojasRuta() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const token = localStorage.getItem("token");
  const role = useMemo(() => {
    try {
      return jwtDecode(token || "")?.rol || "ALUMNO";
    } catch {
      return "ALUMNO";
    }
  }, [token]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");

  const [profData, setProfData] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [catalog, setCatalog] = useState({
    LEVE: [],
    DEFICIENTE: [],
    ELIMINATORIA: [],
  });
  const [adminRows, setAdminRows] = useState([]);
  const [adminStudentRows, setAdminStudentRows] = useState([]);
  const [adminRoadmapRows, setAdminRoadmapRows] = useState([]);
  const [studentRows, setStudentRows] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [showProfessorFilters, setShowProfessorFilters] = useState(false);
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const [exportScope, setExportScope] = useState("");
  const [focusDia, setFocusDia] = useState(false);
  const [tipoDia, setTipoDia] = useState("text");

  const viewProfesorId = searchParams.get("profesorId");
  const viewAlumnoId = searchParams.get("alumnoId");
  const viewRoadmapId = searchParams.get("roadmapId");
  const viewClaseId = searchParams.get("claseId");

  const statusTab = searchParams.get("estado") || "TODAS";
  const page = Number(searchParams.get("page") || "1");
  const queryKey = searchParams.toString();
  const currentYear = new Date().getFullYear();
  const yearOptions = useMemo(() => {
    const years = [];
    for (let year = 2026; year <= currentYear + 10; year += 1) {
      years.push({ value: String(year), label: String(year) });
    }
    return years;
  }, [currentYear]);

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);

    if (value === null || value === undefined || value === "") {
      next.delete(key);
    } else {
      next.set(key, String(value));
    }

    if (key !== "page") {
      next.set("page", "1");
    }

    setSearchParams(next);
  };

  const goRoot = () => {
    setSearchParams(new URLSearchParams());
  };

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      if (role === "PROFESOR") {
        if (viewClaseId) {
          const [detail, faultCatalog] = await Promise.all([
            hojasRutaService.getProfessorRoadmapDetail(viewClaseId),
            hojasRutaService.getFaultCatalog(),
          ]);

          setDetailData(detail);
          setCatalog(faultCatalog);
        } else {
          const data = await hojasRutaService.getProfessorDashboard({
            estado: statusTab,
            page,
            pageSize: 10,
            search: searchParams.get("search") || undefined,
            vehiculoId: searchParams.get("vehiculoId") || undefined,
            dateFrom: searchParams.get("dateFrom") || undefined,
            dateTo: searchParams.get("dateTo") || undefined,
          });

          setProfData(data);
        }
      }

      if (role === "ADMIN" || role === "ADMINISTRATIVO") {
        if (viewRoadmapId) {
          const detail =
            await hojasRutaService.getAdminRoadmapDetail(viewRoadmapId);
          setDetailData(detail);
        } else if (viewProfesorId && viewAlumnoId) {
          const estadoFiltro = searchParams.get("estadoClase") || undefined;
          const vehiculoFiltro = searchParams.get("vehiculo") || undefined;
          const diaFiltro = searchParams.get("dia") || undefined;

          const data =
            await hojasRutaService.getAdminRegisteredRoadmapsByStudent(
              viewProfesorId,
              viewAlumnoId,
              {
                page,
                pageSize: 10,
                estado: estadoFiltro,
                vehiculoId: vehiculoFiltro,
                day: diaFiltro,
              },
            );
          setAdminRoadmapRows(data.rows || []);
          setPagination(
            data.pagination || { page: 1, totalPages: 1, total: 0 },
          );
        } else if (viewProfesorId) {
          const searchAlumno = searchParams.get("searchAlumno") || undefined;

          const rows = await hojasRutaService.getAdminStudentsByProfessor(
            viewProfesorId,
            {
              search: searchAlumno,
            },
          );
          setAdminStudentRows(rows || []);
        } else {
          const searchProfesor = searchParams.get("search") || undefined;
          const month = Number(searchParams.get("month") || "0");
          const year = Number(searchParams.get("year") || "0");
          let dateFrom;
          let dateTo;

          if (month >= 1 && month <= 12 && year > 0) {
            const start = new Date(year, month - 1, 1);
            const end = new Date(year, month, 0);

            dateFrom = formatDateLocal(start);
            dateTo = formatDateLocal(end);
          }

          const rows = await hojasRutaService.getAdminProfessorsSummary({
            search: searchProfesor,
            dateFrom,
            dateTo,
          });
          setAdminRows(rows || []);
        }
      }

      if (role === "ALUMNO") {
        if (viewRoadmapId) {
          const detail =
            await hojasRutaService.getStudentRoadmapDetail(viewRoadmapId);
          setDetailData(detail);
        } else {
          const data = await hojasRutaService.getStudentRegisteredRoadmaps({
            page,
            pageSize: 10,
            search: searchParams.get("search") || undefined,
            dateFrom: searchParams.get("dateFrom") || undefined,
            dateTo: searchParams.get("dateTo") || undefined,
          });

          setStudentRows(data.rows || []);
          setPagination(
            data.pagination || { page: 1, totalPages: 1, total: 0 },
          );
        }
      }
    } catch (loadError) {
      setError(
        loadError.response?.data?.message ||
          "No se pudieron cargar las hojas de ruta",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [
    role,
    viewProfesorId,
    viewAlumnoId,
    viewRoadmapId,
    viewClaseId,
    statusTab,
    page,
    queryKey,
  ]);

  const adminRowsFiltered = useMemo(() => {
    const search = String(searchParams.get("search") || "")
      .trim()
      .toLowerCase();

    return (adminRows || []).filter((row) => {
      if (!search) {
        return true;
      }

      return String(row.profesorNombre || "")
        .toLowerCase()
        .includes(search);
    });
  }, [adminRows, searchParams]);

  const adminStudentRowsFiltered = useMemo(() => {
    const search = String(searchParams.get("searchAlumno") || "")
      .trim()
      .toLowerCase();

    return (adminStudentRows || []).filter((row) => {
      if (!search) {
        return true;
      }

      return String(row.alumnoNombre || "")
        .toLowerCase()
        .includes(search);
    });
  }, [adminStudentRows, searchParams]);

  const adminRoadmapRowsFiltered = useMemo(() => {
    const estado = String(searchParams.get("estadoClase") || "")
      .trim()
      .toUpperCase();
    const vehiculo = String(searchParams.get("vehiculo") || "")
      .trim()
      .toLowerCase();
    const dia = String(searchParams.get("dia") || "").trim();

    return (adminRoadmapRows || []).filter((row) => {
      const estadoRow = String(row.sinDatos ? "PENDIENTE" : row.estado || "")
        .trim()
        .toUpperCase();

      if (estado && estadoRow !== estado) {
        return false;
      }

      if (vehiculo) {
        const id = String(row.vehiculo?.id || "").toLowerCase();
        const matricula = String(row.vehiculo?.matricula || "").toLowerCase();
        const marca = String(row.vehiculo?.marca || "").toLowerCase();
        const modelo = String(row.vehiculo?.modelo || "").toLowerCase();

        if (
          id !== vehiculo &&
          !matricula.includes(vehiculo) &&
          !marca.includes(vehiculo) &&
          !modelo.includes(vehiculo)
        ) {
          return false;
        }
      }

      if (dia) {
        const rowDate = new Date(row.fecha);

        if (Number.isNaN(rowDate.getTime())) {
          return false;
        }

        if (rowDate.toISOString().slice(0, 10) !== dia) {
          return false;
        }
      }

      return true;
    });
  }, [adminRoadmapRows, searchParams]);

  const adminRoadmapVehicleOptions = useMemo(() => {
    const unique = new Map();

    (adminRoadmapRows || []).forEach((row) => {
      const id = String(row?.vehiculo?.id || "").trim();
      const marca = String(row?.vehiculo?.marca || "").trim();
      const modelo = String(row?.vehiculo?.modelo || "").trim();

      if (!id || (!marca && !modelo)) {
        return;
      }

      if (!unique.has(id)) {
        unique.set(id, {
          value: id,
          label: `${marca} ${modelo}`.trim(),
        });
      }
    });

    return Array.from(unique.values()).sort((a, b) =>
      a.label.localeCompare(b.label, "es"),
    );
  }, [adminRoadmapRows]);

  const openExportMenu = (scope, event) => {
    setExportScope(scope);
    setExportAnchorEl(event.currentTarget);
  };

  const closeExportMenu = () => {
    setExportAnchorEl(null);
    setExportScope("");
  };

  const handleExportExcel = () => {
    if (exportScope === "admin-professors") {
      exportHojasRutaProfesoresExcel(adminRowsFiltered);
    }

    if (exportScope === "admin-students") {
      exportHojasRutaAlumnosProfesorExcel(adminStudentRowsFiltered);
    }

    if (exportScope === "admin-roadmaps") {
      exportHojasRutaAlumnoDetalleExcel(adminRoadmapRowsFiltered);
    }

    closeExportMenu();
  };

  const handleExportPdf = () => {
    if (exportScope === "admin-professors") {
      exportHojasRutaProfesoresPdf(adminRowsFiltered);
    }

    if (exportScope === "admin-students") {
      exportHojasRutaAlumnosProfesorPdf(adminStudentRowsFiltered);
    }

    if (exportScope === "admin-roadmaps") {
      exportHojasRutaAlumnoDetallePdf(adminRoadmapRowsFiltered);
    }

    closeExportMenu();
  };

  const saveDraft = async () => {
    if (!viewClaseId || !detailData) return;

    try {
      setLoading(true);
      const result = await hojasRutaService.saveProfessorDraft(
        viewClaseId,
        detailData,
      );
      setDetailData(result.hojaRuta);
      setNotification(result.message || "Borrador guardado");
    } catch (saveError) {
      setError(
        saveError.response?.data?.message || "No se pudo guardar el borrador",
      );
    } finally {
      setLoading(false);
    }
  };

  const finalizeClass = async () => {
    if (!viewClaseId || !detailData) return;

    try {
      setLoading(true);
      const result = await hojasRutaService.finalizeProfessorRoadmap(
        viewClaseId,
        detailData,
      );
      setDetailData(result.hojaRuta);
      setNotification(result.message || "Clase finalizada");
    } catch (saveError) {
      setError(
        saveError.response?.data?.message || "No se pudo finalizar la clase",
      );
    } finally {
      setLoading(false);
    }
  };

  const renderProfessorList = () => {
    if (loading && !profData) {
      return <Typography>Cargando hojas de ruta...</Typography>;
    }

    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h4" fontWeight={800}>
          Hojas de Ruta
        </Typography>

        {(profData?.alertasRepostaje || []).length ? (
          <Alert severity="warning">
            Tienes {(profData?.alertasRepostaje || []).length} clase(s) con
            vehículo por debajo del 20% de combustible. Reposta antes de guardar
            o finalizar la hoja de ruta.
          </Alert>
        ) : null}

        <Card>
          <CardContent>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={1.5}
              alignItems={{ xs: "stretch", md: "center" }}
            >
              <TextField
                label="Buscar por alumno"
                size="small"
                fullWidth
                value={searchParams.get("search") || ""}
                onChange={(event) => setParam("search", event.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              {/*<Button
                variant="outlined"
                startIcon={<FilterListIcon />}
                onClick={() => setShowProfessorFilters((prev) => !prev)}
              >
                Filtros
              </Button>*/}
            </Stack>

            {/*{showProfessorFilters ? (
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={1.5}
                sx={{ mt: 1.5 }}
              >
                <TextField
                  label="Vehículo (id)"
                  size="small"
                  value={searchParams.get("vehiculoId") || ""}
                  onChange={(event) =>
                    setParam("vehiculoId", event.target.value)
                  }
                />
                <TextField
                  label="Desde"
                  size="small"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  sx={{ minWidth: 180 }}
                  value={searchParams.get("dateFrom") || ""}
                  onChange={(event) => setParam("dateFrom", event.target.value)}
                />
                <TextField
                  label="Hasta"
                  size="small"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  sx={{ minWidth: 180 }}
                  value={searchParams.get("dateTo") || ""}
                  onChange={(event) => setParam("dateTo", event.target.value)}
                />
              </Stack>
            ) : null}*/}

            <Tabs
              sx={{ mt: 2 }}
              value={statusTab}
              onChange={(_, value) => setParam("estado", value)}
            >
              <Tab value="TODAS" label="Todas" />
              <Tab value="EN_CURSO" label="En curso" />
              <Tab value="PENDIENTE" label="Pendientes" />
              <Tab value="REGISTRADA" label="Registradas" />
              <Tab value="CANCELADA" label="Canceladas" />
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={700}>
              Pendientes de registro ({profData?.resumen?.pendientes || 0})
            </Typography>
            <Stack spacing={1} sx={{ mt: 1 }}>
              {(profData?.pendientes || []).length === 0 ? (
                <Typography color="text.secondary">
                  No hay pendientes.
                </Typography>
              ) : (
                profData.pendientes.map((item) => (
                  <Paper
                    key={item.claseId}
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      borderColor: "#f7dfbf",
                      backgroundColor: "#fffaf2",
                    }}
                  >
                    <Stack
                      direction={{ xs: "column", md: "row" }}
                      justifyContent="space-between"
                      spacing={1}
                    >
                      <Box sx={{ display: "flex", gap: 1.25 }}>
                        <Avatar
                          sx={{
                            width: 34,
                            height: 34,
                            bgcolor: "#ffe9cc",
                            color: "#ae6500",
                          }}
                        >
                          <PersonIcon fontSize="small" />
                        </Avatar>
                        <Box>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <Typography fontWeight={700}>
                              {item.alumno?.nombre}
                            </Typography>

                            <Chip
                              size="small"
                              label="PENDIENTE"
                              sx={{
                                backgroundColor: "#fff3df",
                                color: "#ae6500",
                                border: "1px solid #f7dfbf",
                              }}
                            />
                          </Stack>
                          <Typography variant="body2" color="text.secondary">
                            {item.vehiculo?.marca} {item.vehiculo?.modelo} -{" "}
                            {item.vehiculo?.matricula}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatDateTime(item.fecha)}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ flex: 1, textAlign: "right" }}>
                        <Button
                          variant="contained"
                          onClick={() => setParam("claseId", item.claseId)}
                          endIcon={
                            <ArrowBackIcon
                              sx={{ transform: "rotate(180deg)" }}
                            />
                          }
                        >
                          Continuar registro
                        </Button>
                      </Box>
                    </Stack>
                  </Paper>
                ))
              )}
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
              Histórico de hojas de ruta
            </Typography>
            <Stack spacing={1.2}>
              {(profData?.historial || []).length === 0 ? (
                <Typography color="text.secondary">
                  Sin histórico para estos filtros.
                </Typography>
              ) : (
                (profData?.historial || []).map((item) => (
                  <Paper
                    key={item.claseId}
                    variant="outlined"
                    sx={{ p: 1.5, borderRadius: 2 }}
                  >
                    <Stack
                      direction={{ xs: "column", md: "row" }}
                      alignItems={{ xs: "flex-start", md: "center" }}
                      justifyContent="space-between"
                      spacing={1}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.25,
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: "#ecf3ff",
                            color: "#1d4ed8",
                          }}
                        >
                          <RouteIcon fontSize="small" />
                        </Avatar>
                        <Box>
                          <Typography fontWeight={700}>
                            {item.alumno?.nombre}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.vehiculo?.marca} {item.vehiculo?.modelo} -{" "}
                            {item.vehiculo?.matricula}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatDateTime(item.fecha)}
                          </Typography>
                        </Box>
                      </Box>

                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                          size="small"
                          label={item.estado}
                          color={colorByStatus(item.estado)}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {`${item.resumenFaltas?.leves || 0} leves · ${item.resumenFaltas?.deficientes || 0} deficientes · ${item.resumenFaltas?.eliminatorias || 0} eliminatorias`}
                        </Typography>
                        <Button
                          size="small"
                          onClick={() => setParam("claseId", item.claseId)}
                        >
                          Abrir
                        </Button>
                      </Stack>
                    </Stack>
                  </Paper>
                ))
              )}
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ mt: 1.5 }}
            >
              <Typography variant="body2" color="text.secondary">
                Mostrando hasta 10 resultados por página
              </Typography>
              <Pagination
                page={profData?.pagination?.page || 1}
                count={profData?.pagination?.totalPages || 1}
                onChange={(_, nextPage) => setParam("page", nextPage)}
              />
            </Stack>
          </CardContent>
        </Card>
      </Box>
    );
  };

  const renderAdminView = () => {
    if (viewRoadmapId) {
      return (
        <RoadmapDetail
          title="Detalle hoja de ruta"
          readonly
          value={detailData}
          onBack={() => setParam("roadmapId", null)}
          onChange={() => {}}
          onSaveDraft={() => {}}
          onFinalize={() => {}}
          catalog={catalog}
          loading={loading}
          onGoRefuel={() => navigate("/gastos")}
        />
      );
    }

    if (viewProfesorId && viewAlumnoId) {
      return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton onClick={() => setParam("alumnoId", null)}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" fontWeight={800}>
              Hojas de ruta del alumno
            </Typography>
          </Stack>

          <Card>
            <CardContent>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={1.5}
                sx={{ mb: 1.5 }}
              >
                <TextField
                  select
                  size="small"
                  label="Estado"
                  value={searchParams.get("estadoClase") || ""}
                  onChange={(event) =>
                    setParam("estadoClase", event.target.value)
                  }
                  sx={{ minWidth: 180 }}
                >
                  {ADMIN_ROADMAP_STATUS_OPTIONS.map((option) => (
                    <MenuItem key={option.value || "ALL"} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  size="small"
                  label="Vehículo"
                  value={searchParams.get("vehiculo") || ""}
                  onChange={(event) => setParam("vehiculo", event.target.value)}
                  sx={{ minWidth: 240 }}
                >
                  <MenuItem value="">Todos</MenuItem>
                  {adminRoadmapVehicleOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  size="small"
                  type={tipoDia}
                  label="Día"
                  placeholder={focusDia ? "dd/mm/aaaa" : ""}
                  InputLabelProps={{
                    shrink: focusDia || Boolean(searchParams.get("dia")),
                  }}
                  value={searchParams.get("dia") || ""}
                  onChange={(event) => setParam("dia", event.target.value)}
                  onFocus={() => {
                    setFocusDia(true);
                    setTipoDia("date");
                  }}
                  onBlur={() => {
                    setFocusDia(false);
                    if (!searchParams.get("dia")) {
                      setTipoDia("text");
                    }
                  }}
                  sx={{ minWidth: 180 }}
                />

                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={(event) => openExportMenu("admin-roadmaps", event)}
                >
                  Exportar
                </Button>
              </Stack>

              <Box sx={{ height: 560 }}>
                <DataGrid
                  rows={adminRoadmapRowsFiltered}
                  columns={[
                    {
                      field: "fecha",
                      headerName: "Fecha",
                      flex: 1,
                      valueGetter: (_, row) => formatDateTime(row.fecha),
                    },
                    {
                      field: "duracion",
                      headerName: "Duración",
                      flex: 0.7,
                      valueGetter: (_, row) => `${row.duracion || 0} min`,
                    },
                    {
                      field: "vehiculo",
                      headerName: "Vehículo",
                      flex: 1,
                      valueGetter: (_, row) =>
                        `${row.vehiculo?.marca || ""} ${row.vehiculo?.modelo || ""} ${row.vehiculo?.matricula || ""}`,
                    },
                    {
                      field: "faltasResumen",
                      headerName: "Faltas",
                      flex: 1,
                      valueGetter: (_, row) =>
                        `${row.faltasResumen?.leves || 0} · ${row.faltasResumen?.deficientes || 0} · ${row.faltasResumen?.eliminatorias || 0}`,
                    },
                    {
                      field: "estado",
                      headerName: "Estado",
                      flex: 0.9,
                      renderCell: (params) =>
                        params.row?.sinDatos ? (
                          <Chip
                            size="small"
                            sx={{
                              backgroundColor: "#fffbeb", // Color de fondo (puedes usar HEX, RGB o color de MUI)
                              borderColor: "#facc15", // Color del borde
                              borderRadius: "15px", // Radio del borde (bordes menos redondeados)
                              borderWidth: "1px", // Grosor del borde (opcional)
                              color: "#ca8a04", // Color del texto (opcional)
                              "& .MuiChip-label": {
                                // Estilos para el texto interno (opcional)
                                fontWeight: "bold",
                              },
                            }}
                            label="Hoja sin datos"
                          />
                        ) : (
                          <Chip
                            size="small"
                            sx={{
                              backgroundColor: "#e8f5e9", // Color de fondo (puedes usar HEX, RGB o color de MUI)
                              borderColor: "#4caf50", // Color del borde
                              borderRadius: "15px", // Radio del borde (bordes menos redondeados)
                              borderWidth: "1px", // Grosor del borde (opcional)
                              color: "#2e7d32", // Color del texto (opcional)
                              "& .MuiChip-label": {
                                // Estilos para el texto interno (opcional)
                                fontWeight: "bold",
                              },
                            }}
                            label="Registrada"
                          />
                        ),
                    },
                    {
                      field: "acciones",
                      headerName: "",
                      flex: 0.6,
                      sortable: false,
                      renderCell: (params) =>
                        params.row?.sinDatos ? (
                          <Typography variant="caption" color="warning.main">
                            Pendiente de completar
                          </Typography>
                        ) : (
                          <Button
                            onClick={() => setParam("roadmapId", params.row.id)}
                          >
                            Ver
                          </Button>
                        ),
                    },
                  ]}
                  getRowId={(row) => row.id}
                  disableRowSelectionOnClick
                  pageSizeOptions={[10]}
                  hideFooter
                />
              </Box>
              <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1.5 }}>
                <Pagination
                  page={pagination.page || 1}
                  count={pagination.totalPages || 1}
                  onChange={(_, nextPage) => setParam("page", nextPage)}
                />
              </Stack>
            </CardContent>
          </Card>
        </Box>
      );
    }

    if (viewProfesorId) {
      return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton onClick={() => setParam("profesorId", null)}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" fontWeight={800}>
              Alumnos del profesor
            </Typography>
          </Stack>

          <Card>
            <CardContent>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={1.5}
                sx={{ mb: 1.5 }}
              >
                <TextField
                  size="small"
                  label="Filtrar por alumno"
                  value={searchParams.get("searchAlumno") || ""}
                  onChange={(event) =>
                    setParam("searchAlumno", event.target.value)
                  }
                  fullWidth
                />

                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={(event) => openExportMenu("admin-students", event)}
                >
                  Exportar
                </Button>
              </Stack>

              <DataGrid
                rows={adminStudentRowsFiltered}
                columns={[
                  { field: "alumnoNombre", headerName: "Alumno", flex: 1.2 },
                  { field: "total", headerName: "Total", flex: 0.5 },
                  { field: "pendientes", headerName: "Pendientes", flex: 0.7 },
                  { field: "enCurso", headerName: "En curso", flex: 0.7 },
                  {
                    field: "registradas",
                    headerName: "Registradas",
                    flex: 0.8,
                  },
                  { field: "canceladas", headerName: "Canceladas", flex: 0.7 },
                  {
                    field: "acciones",
                    headerName: "",
                    flex: 0.6,
                    sortable: false,
                    renderCell: (params) => (
                      <Button
                        onClick={() => {
                          setParam("alumnoId", params.row.alumnoId);
                        }}
                      >
                        Ver hojas
                      </Button>
                    ),
                  },
                ]}
                getRowId={(row) => row.alumnoId}
                disableRowSelectionOnClick
                pageSizeOptions={[10, 25, 50]}
                initialState={{
                  pagination: { paginationModel: { pageSize: 10, page: 0 } },
                }}
                autoHeight
              />
            </CardContent>
          </Card>
        </Box>
      );
    }

    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h4" fontWeight={800}>
          Hojas de Ruta por Profesor
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Revisa la planificación diaria y el seguimiento de las clases
          prácticas asignadas a cada instructor.
        </Typography>

        <Card>
          <CardContent>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={1.5}
              sx={{ mb: 1.5 }}
            >
              <TextField
                size="small"
                label="Buscar profesor"
                value={searchParams.get("search") || ""}
                onChange={(event) => setParam("search", event.target.value)}
                fullWidth
              />

              <TextField
                select
                size="small"
                label="Mes"
                value={searchParams.get("month") || ""}
                onChange={(event) => setParam("month", event.target.value)}
                sx={{ minWidth: 120 }}
              >
                <MenuItem value="">Todos</MenuItem>
                {MONTH_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                size="small"
                label="Año"
                value={searchParams.get("year") || ""}
                onChange={(event) => setParam("year", event.target.value)}
                sx={{ minWidth: 140 }}
              >
                <MenuItem value="">Todos</MenuItem>
                {yearOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={(event) => openExportMenu("admin-professors", event)}
              >
                Exportar
              </Button>
            </Stack>

            <DataGrid
              rows={adminRowsFiltered}
              columns={[
                { field: "profesorNombre", headerName: "Profesor", flex: 1.5 },
                { field: "total", headerName: "Total", flex: 0.5 },
                { field: "pendientes", headerName: "Pendientes", flex: 0.7 },
                { field: "enCurso", headerName: "En curso", flex: 0.7 },
                { field: "registradas", headerName: "Registradas", flex: 0.8 },
                { field: "canceladas", headerName: "Canceladas", flex: 0.7 },
                {
                  field: "acciones",
                  headerName: "",
                  flex: 0.6,
                  sortable: false,
                  renderCell: (params) => (
                    <Button
                      onClick={() =>
                        setParam("profesorId", params.row.profesorId)
                      }
                    >
                      Ver alumnos
                    </Button>
                  ),
                },
              ]}
              getRowId={(row) => row.profesorId}
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              initialState={{
                pagination: { paginationModel: { pageSize: 10, page: 0 } },
              }}
              autoHeight
            />
          </CardContent>
        </Card>
      </Box>
    );
  };

  const renderStudentView = () => {
    if (viewRoadmapId) {
      return (
        <RoadmapDetail
          title="Detalle hoja de ruta"
          readonly
          value={detailData}
          onBack={() => setParam("roadmapId", null)}
          onChange={() => {}}
          onSaveDraft={() => {}}
          onFinalize={() => {}}
          catalog={catalog}
          loading={loading}
          onGoRefuel={() => navigate("/gastos")}
        />
      );
    }

    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h4" fontWeight={800}>
          Mis Hojas de Ruta
        </Typography>

        <Card>
          <CardContent>
            <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
              <TextField
                label="Buscar por profesor o matrícula"
                value={searchParams.get("search") || ""}
                onChange={(event) => setParam("search", event.target.value)}
              />
              <TextField
                label="Desde"
                type="date"
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 180 }}
                value={searchParams.get("dateFrom") || ""}
                onChange={(event) => setParam("dateFrom", event.target.value)}
              />
              <TextField
                label="Hasta"
                type="date"
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 180 }}
                value={searchParams.get("dateTo") || ""}
                onChange={(event) => setParam("dateTo", event.target.value)}
              />
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <DataGrid
              rows={studentRows}
              columns={[
                {
                  field: "fecha",
                  headerName: "Fecha",
                  flex: 1,
                  valueGetter: (_, row) => formatDateTime(row.fecha),
                },
                { field: "profesorNombre", headerName: "Profesor", flex: 1.2 },
                { field: "vehiculo", headerName: "Vehículo", flex: 1.2 },
                {
                  field: "faltasResumen",
                  headerName: "Faltas",
                  flex: 1,
                  valueGetter: (_, row) =>
                    `${row.faltasResumen?.leves || 0} · ${row.faltasResumen?.deficientes || 0} · ${row.faltasResumen?.eliminatorias || 0}`,
                },
                {
                  field: "estado",
                  headerName: "Estado",
                  flex: 0.9,
                  renderCell: (params) =>
                    params.row?.sinDatos ? (
                      <Chip
                        size="small"
                        color="warning"
                        label="Hoja sin datos"
                      />
                    ) : (
                      <Chip size="small" color="success" label="Registrada" />
                    ),
                },
                {
                  field: "acciones",
                  headerName: "",
                  flex: 0.5,
                  sortable: false,
                  renderCell: (params) =>
                    params.row?.sinDatos ? (
                      <Typography variant="caption" color="warning.main">
                        Pendiente de completar
                      </Typography>
                    ) : (
                      <Button
                        onClick={() => setParam("roadmapId", params.row.id)}
                      >
                        Ver
                      </Button>
                    ),
                },
              ]}
              getRowId={(row) => row.id}
              disableRowSelectionOnClick
              pageSizeOptions={[10]}
              hideFooter
              autoHeight
            />
            <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1.5 }}>
              <Pagination
                page={pagination.page || 1}
                count={pagination.totalPages || 1}
                onChange={(_, nextPage) => setParam("page", nextPage)}
              />
            </Stack>
          </CardContent>
        </Card>
      </Box>
    );
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {error ? <Alert severity="error">{error}</Alert> : null}
      {notification ? (
        <Alert severity="success" onClose={() => setNotification("")}>
          {notification}
        </Alert>
      ) : null}

      {role === "PROFESOR" && viewClaseId ? (
        <RoadmapDetail
          title="Hoja de Ruta"
          readonly={Boolean(detailData?.editable === false)}
          value={detailData}
          onBack={() => setParam("claseId", null)}
          onChange={setDetailData}
          onSaveDraft={saveDraft}
          onFinalize={finalizeClass}
          catalog={catalog}
          loading={loading}
          onGoRefuel={() => navigate("/profesor-vehiculos")}
        />
      ) : null}

      {role === "PROFESOR" && !viewClaseId ? renderProfessorList() : null}
      {role === "ADMIN" || role === "ADMINISTRATIVO" ? renderAdminView() : null}
      {role === "ALUMNO" ? renderStudentView() : null}

      {loading ? (
        <Typography color="text.secondary">Cargando...</Typography>
      ) : null}
      {(role !== "ADMIN" &&
        role !== "ADMINISTRATIVO" &&
        role !== "PROFESOR" &&
        role !== "ALUMNO") ||
      !token ? (
        <Alert severity="info">No se pudo validar el rol actual.</Alert>
      ) : null}

      {(role === "ADMIN" || role === "ADMINISTRATIVO" || role === "ALUMNO") &&
      viewRoadmapId &&
      detailData ? (
        <Stack direction="row" justifyContent="flex-start">
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={goRoot}
          >
            Volver al listado
          </Button>
        </Stack>
      ) : null}

      <Menu
        anchorEl={exportAnchorEl}
        open={Boolean(exportAnchorEl)}
        onClose={closeExportMenu}
      >
        <MenuItem onClick={handleExportExcel}>Exportar a Excel</MenuItem>
        <MenuItem onClick={handleExportPdf}>Exportar a PDF</MenuItem>
      </Menu>
    </Box>
  );
}
