import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { DataGrid } from "@mui/x-data-grid";

import { evaluacionExamenesService } from "../../services/evaluacionExamenesService";
import { LicenseChip } from "../../components/common/LicenseChip";

const formatDate = (value) => {
  if (!value) return "-";

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
};

const stateToColor = (estado) => {
  if (estado === "APTO" || estado === "APROBADO") return "success";
  if (estado === "NO_APTO" || estado === "SUSPENSO") return "error";
  if (estado === "CANCELADO") return "default";
  return "warning";
};

export default function Examenes() {
  const [rows, setRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [licenciaFiltro, setLicenciaFiltro] = useState("TODAS");
  const [estadoFiltro, setEstadoFiltro] = useState("TODOS");

  const loadData = async () => {
    try {
      const [teorico, practico] = await Promise.all([
        evaluacionExamenesService.getTeorico(),
        evaluacionExamenesService.getPractico(),
      ]);

      setRows([...(teorico || []), ...(practico || [])]);
    } catch (error) {
      setNotification({
        open: true,
        message:
          error.response?.data?.message ||
          "No se pudo cargar la información de exámenes",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const licencias = useMemo(() => {
    const values = new Set();

    rows.forEach((row) => {
      if (row.permisoLicencia) {
        values.add(row.permisoLicencia);
      }
    });

    return Array.from(values).sort();
  }, [rows]);

  const estados = useMemo(() => {
    const values = new Set();

    rows.forEach((row) => {
      if (row.estado) {
        values.add(row.estado);
      }
    });

    return Array.from(values).sort();
  }, [rows]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const convocatoria = row.fechaConvocatoria
        ? new Date(row.fechaConvocatoria)
        : null;

      if (fechaDesde && convocatoria && convocatoria < new Date(fechaDesde)) {
        return false;
      }

      if (fechaHasta && convocatoria) {
        const end = new Date(fechaHasta);
        end.setHours(23, 59, 59, 999);

        if (convocatoria > end) {
          return false;
        }
      }

      if (
        licenciaFiltro !== "TODAS" &&
        row.permisoLicencia !== licenciaFiltro
      ) {
        return false;
      }

      if (estadoFiltro !== "TODOS" && row.estado !== estadoFiltro) {
        return false;
      }

      return true;
    });
  }, [rows, fechaDesde, fechaHasta, licenciaFiltro, estadoFiltro]);

  const columns = useMemo(
    () => [
      {
        field: "alumnoNombre",
        headerName: "Alumno",
        flex: 1.2,
      },
      {
        field: "fechaSolicitud",
        headerName: "Fecha solicitud",
        flex: 0.95,
        valueGetter: (_, row) => formatDate(row.fechaSolicitud),
      },
      {
        field: "fechaConvocatoria",
        headerName: "Fecha convocatoria",
        flex: 1,
        valueGetter: (_, row) => formatDate(row.fechaConvocatoria),
      },
      {
        field: "permisoLicencia",
        headerName: "Permiso/Licencia",
        flex: 0.95,
        renderCell: (params) => <LicenseChip value={params.value} />,
      },
      {
        field: "estado",
        headerName: "Estado/Resultado",
        flex: 1,
        renderCell: (params) => (
          <Chip
            size="small"
            color={stateToColor(params.row.estado)}
            label={params.row.estado}
          />
        ),
      },
      {
        field: "acciones",
        headerName: "Acciones",
        width: 120,
        sortable: false,
        renderCell: (params) => (
          <Box
            sx={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <Tooltip title="Ver detalle" arrow>
              <IconButton
                color="primary"
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedRow(params.row);
                  setOpenDetail(true);
                }}
              >
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [],
  );

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" fontWeight="bold">
          Exámenes
        </Typography>
        <Typography color="text.secondary">
          Vista unificada de exámenes teóricos y prácticos.
        </Typography>
      </Box>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1.5}
        sx={{ mb: 2 }}
      >
        <TextField
          size="small"
          label="Convocatoria desde"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={fechaDesde}
          onChange={(event) => setFechaDesde(event.target.value)}
        />

        <TextField
          size="small"
          label="Convocatoria hasta"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={fechaHasta}
          onChange={(event) => setFechaHasta(event.target.value)}
        />

        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel>Licencia</InputLabel>
          <Select
            label="Licencia"
            value={licenciaFiltro}
            onChange={(event) => setLicenciaFiltro(event.target.value)}
          >
            <MenuItem value="TODAS">Todas</MenuItem>
            {licencias.map((licencia) => (
              <MenuItem key={licencia} value={licencia}>
                {licencia}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel>Estado/Resultado</InputLabel>
          <Select
            label="Estado/Resultado"
            value={estadoFiltro}
            onChange={(event) => setEstadoFiltro(event.target.value)}
          >
            <MenuItem value="TODOS">Todos</MenuItem>
            {estados.map((estado) => (
              <MenuItem key={estado} value={estado}>
                {estado}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <Box sx={{ height: 700 }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          onRowClick={(params) => {
            setSelectedRow(params.row);
            setOpenDetail(true);
          }}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
            sorting: {
              sortModel: [{ field: "fechaConvocatoria", sort: "desc" }],
            },
          }}
        />
      </Box>

      <Dialog
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Detalle de examen</DialogTitle>
        <DialogContent>
          {!selectedRow ? null : (
            <Stack spacing={2} sx={{ pt: 1 }}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Información general
                </Typography>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={2}
                  sx={{ mt: 1 }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Alumno
                    </Typography>
                    <Typography fontWeight={700}>
                      {selectedRow.alumnoNombre || "-"}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Permiso/Licencia
                    </Typography>
                    <LicenseChip value={selectedRow.permisoLicencia} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Tipo
                    </Typography>
                    <Chip size="small" label={selectedRow.tipo || "-"} />
                  </Box>
                </Stack>
              </Paper>

              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Convocatoria y resultado
                </Typography>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={2}
                  sx={{ mt: 1 }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Fecha solicitud
                    </Typography>
                    <Typography>
                      {formatDate(selectedRow.fechaSolicitud)}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Fecha convocatoria
                    </Typography>
                    <Typography>
                      {formatDate(selectedRow.fechaConvocatoria)}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Estado/Resultado
                    </Typography>
                    <Chip
                      size="small"
                      label={selectedRow.estado || "-"}
                      color={stateToColor(selectedRow.estado)}
                    />
                  </Box>
                </Stack>
              </Paper>

              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Datos del examen
                </Typography>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={2}
                  sx={{ mt: 1 }}
                >
                  <Typography variant="body2">
                    <strong>Número de convocatoria:</strong>{" "}
                    {selectedRow.numeroIntento ?? "-"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Convocatorias restantes:</strong>{" "}
                    {selectedRow.convocatoriasRestantes ?? "-"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Profesor:</strong>{" "}
                    {selectedRow.profesorAsignado || "Sin asignar"}
                  </Typography>
                </Stack>

                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={2}
                  sx={{ mt: 1 }}
                >
                  <Chip
                    size="small"
                    label={`Aciertos: ${selectedRow.aciertosExamen ?? "-"}`}
                  />
                  <Chip
                    size="small"
                    label={`Errores: ${selectedRow.erroresExamen ?? "-"}`}
                  />
                  <Chip
                    size="small"
                    label={`Leves: ${selectedRow.faltasLeves ?? "-"}`}
                  />
                  <Chip
                    size="small"
                    label={`Deficientes: ${selectedRow.faltasDeficientes ?? "-"}`}
                  />
                  <Chip
                    size="small"
                    label={`Eliminatorias: ${selectedRow.faltasEliminatorias ?? "-"}`}
                  />
                </Stack>
              </Paper>

              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Observaciones
                </Typography>
                <Typography sx={{ mt: 1 }}>
                  {selectedRow.observaciones || "Sin observaciones"}
                </Typography>
                {selectedRow.motivoNoApto ? (
                  <Typography sx={{ mt: 1 }}>
                    <strong>Motivo no apto:</strong> {selectedRow.motivoNoApto}
                  </Typography>
                ) : null}
              </Paper>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetail(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          severity={notification.severity}
          onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
