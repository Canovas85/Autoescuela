import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ViewListIcon from "@mui/icons-material/ViewList";
import { convocatoriasTeoricoService } from "../../services/convocatoriasTeoricoService";
import Tooltip from "@mui/material/Tooltip";

const WEEK_DAYS = ["L", "M", "X", "J", "V", "S", "D"];

const formatDateInput = (value) => {
  if (!value) return "";

  if (typeof value === "string") {
    const [datePart] = value.split("T");
    if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
      return datePart;
    }
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDate = (value) => {
  const dateKey = formatDateInput(value);
  if (!dateKey) return "-";

  const [year, month, day] = dateKey.split("-");
  return `${day}/${month}/${year}`;
};

const toLocalDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const buildMonthGrid = (viewDate) => {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const startOffset = (firstDay.getDay() + 6) % 7;
  const cells = [];

  for (let i = 0; i < startOffset; i += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(year, month, day));
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
};

const getEstadoChipColor = (estado) => {
  if (estado === "APTO") return "success";
  if (estado === "NO_APTO") return "error";
  return "info";
};

const DEFAULT_FORM = {
  fecha: "",
  licencia: "B",
  tipoExamen: "TEORICO",
  activo: true,
};

export default function ConvocatoriaExamen() {
  const [rows, setRows] = useState([]);
  const [agendaRows, setAgendaRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [openAgendaModal, setOpenAgendaModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedConvocatoria, setSelectedConvocatoria] = useState(null);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("TABLA");
  const [tipoFilter, setTipoFilter] = useState("ALL");
  const [viewDate, setViewDate] = useState(new Date());
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const loadRows = async () => {
    try {
      const params = tipoFilter === "ALL" ? {} : { tipoExamen: tipoFilter };
      const data = await convocatoriasTeoricoService.getAll(params);
      setRows(data || []);
    } catch (error) {
      setNotification({
        open: true,
        severity: "error",
        message:
          error.response?.data?.message ||
          "No se pudieron cargar las convocatorias",
      });
    }
  };

  const loadAgenda = async () => {
    try {
      const params = {
        year: viewDate.getFullYear(),
        month: viewDate.getMonth() + 1,
      };

      if (tipoFilter !== "ALL") {
        params.tipoExamen = tipoFilter;
      }

      const data = await convocatoriasTeoricoService.getAgenda(params);
      setAgendaRows(data?.convocatorias || []);
    } catch (error) {
      setNotification({
        open: true,
        severity: "error",
        message: error.response?.data?.message || "No se pudo cargar la agenda",
      });
    }
  };

  useEffect(() => {
    loadRows();
  }, [tipoFilter]);

  useEffect(() => {
    if (viewMode === "AGENDA") {
      loadAgenda();
    }
  }, [viewMode, tipoFilter, viewDate]);

  const resetDialog = () => {
    setForm(DEFAULT_FORM);
    setEditingId(null);
  };

  const handleClose = () => {
    setOpen(false);
    resetDialog();
  };

  const handleCreate = () => {
    resetDialog();
    setOpen(true);
  };

  const handleEdit = (row) => {
    setEditingId(row.id);
    setForm({
      fecha: formatDateInput(row.fecha),
      licencia: row.licencia || "B",
      tipoExamen: row.tipoExamen || "TEORICO",
      activo: Boolean(row.activo),
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.fecha) {
      setNotification({
        open: true,
        severity: "warning",
        message: "La fecha es obligatoria",
      });
      return;
    }

    try {
      if (editingId) {
        await convocatoriasTeoricoService.update(editingId, form);
      } else {
        await convocatoriasTeoricoService.create(form);
      }

      setNotification({
        open: true,
        severity: "success",
        message: editingId
          ? "Convocatoria actualizada correctamente"
          : "Convocatoria creada correctamente",
      });
      handleClose();
      await loadRows();
    } catch (error) {
      setNotification({
        open: true,
        severity: "error",
        message:
          error.response?.data?.message || "No se pudo guardar la convocatoria",
      });
    }
  };

  const handleDeactivate = async (row) => {
    try {
      await convocatoriasTeoricoService.remove(row.id);
      setNotification({
        open: true,
        severity: "success",
        message: "Convocatoria desactivada correctamente",
      });
      await loadRows();
    } catch (error) {
      setNotification({
        open: true,
        severity: "error",
        message:
          error.response?.data?.message ||
          "No se pudo desactivar la convocatoria",
      });
    }
  };

  const handleOpenAgendaConvocatoria = (convocatoria) => {
    setSelectedConvocatoria(convocatoria);
    setOpenAgendaModal(true);
  };

  const filteredRows = useMemo(() => {
    if (!search.trim()) {
      return rows;
    }

    const text = search.toLowerCase();

    return rows.filter((row) => {
      return (
        formatDate(row.fecha).toLowerCase().includes(text) ||
        (row.licencia || "").toLowerCase().includes(text) ||
        (row.tipoExamen || "").toLowerCase().includes(text)
      );
    });
  }, [rows, search]);

  const monthGrid = useMemo(() => buildMonthGrid(viewDate), [viewDate]);

  const agendaByDate = useMemo(() => {
    const map = new Map();

    agendaRows.forEach((row) => {
      const key = formatDateInput(row.fecha);

      if (!map.has(key)) {
        map.set(key, []);
      }

      map.get(key).push(row);
    });

    return map;
  }, [agendaRows]);

  const columns = useMemo(
    () => [
      {
        field: "fecha",
        headerName: "Fecha",
        flex: 1,
        valueGetter: (_, row) => formatDate(row.fecha),
      },
      {
        field: "licencia",
        headerName: "Licencia",
        width: 130,
      },
      {
        field: "tipoExamen",
        headerName: "Tipo",
        width: 150,
        renderCell: (params) => (
          <Chip
            size="small"
            color={params.value === "PRACTICO" ? "secondary" : "primary"}
            label={params.value}
          />
        ),
      },
      {
        field: "activo",
        headerName: "Estado",
        width: 150,
        renderCell: (params) => (
          <Chip
            size="small"
            color={params.value ? "success" : "error"}
            label={params.value ? "Activa" : "Inactiva"}
          />
        ),
      },
      {
        field: "acciones",
        headerName: "Acciones",
        width: 160,
        sortable: false,
        renderCell: (params) => (
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Editar" arrow>
              <IconButton
                onClick={() => handleEdit(params.row)}
                size="small"
                color="primary"
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar" arrow>
              <IconButton
                onClick={() => handleDeactivate(params.row)}
                size="small"
                color="error"
                disabled={!params.row.activo}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
      },
    ],
    [],
  );

  const agendaColumns = [
    {
      field: "nombre",
      headerName: "Alumno",
      flex: 1,
      minWidth: 180,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 220,
    },
    {
      field: "licencia",
      headerName: "Licencia",
      width: 120,
    },
    {
      field: "tipoExamen",
      headerName: "Tipo examen",
      width: 150,
    },
    {
      field: "estado",
      headerName: "Estado",
      width: 130,
      renderCell: (params) => (
        <Chip
          size="small"
          color={getEstadoChipColor(params.value)}
          label={params.value}
        />
      ),
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Convocatorias DGT de examen
          </Typography>

          <Typography color="text.secondary">
            Gestiona convocatorias teóricas y prácticas, y consulta la agenda
            mensual con alumnos confirmados.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} useFlexGap flexWrap="wrap">
          <TextField
            select
            size="small"
            label="Tipo"
            value={tipoFilter}
            onChange={(event) => setTipoFilter(event.target.value)}
            sx={{ minWidth: 170 }}
          >
            <MenuItem value="ALL">Todos</MenuItem>
            <MenuItem value="TEORICO">Teórico</MenuItem>
            <MenuItem value="PRACTICO">Práctico</MenuItem>
          </TextField>

          <TextField
            size="small"
            label="Buscar"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <Button
            variant={viewMode === "TABLA" ? "contained" : "outlined"}
            startIcon={<ViewListIcon />}
            onClick={() => setViewMode("TABLA")}
          >
            Tabla
          </Button>

          <Button
            variant={viewMode === "AGENDA" ? "contained" : "outlined"}
            startIcon={<CalendarMonthIcon />}
            onClick={() => setViewMode("AGENDA")}
          >
            Agenda
          </Button>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
          >
            Nueva convocatoria
          </Button>
        </Stack>
      </Box>

      {viewMode === "TABLA" ? (
        <Box sx={{ height: 700 }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            getRowId={(row) => row.id}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                  page: 0,
                },
              },
              sorting: {
                sortModel: [{ field: "fecha", sort: "asc" }],
              },
            }}
          />
        </Box>
      ) : (
        <Box sx={{ border: "1px solid #e2e8f0", borderRadius: 2, p: 2 }}>
          <Stack
            direction="row"
            spacing={1}
            justifyContent="flex-end"
            sx={{ mb: 1.5 }}
          >
            <Button
              size="small"
              variant="outlined"
              onClick={() => {
                const prev = new Date(viewDate);
                prev.setMonth(prev.getMonth() - 1);
                setViewDate(prev);
              }}
            >
              Mes anterior
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => {
                const next = new Date(viewDate);
                next.setMonth(next.getMonth() + 1);
                setViewDate(next);
              }}
            >
              Mes siguiente
            </Button>
          </Stack>

          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
            {viewDate.toLocaleDateString("es-ES", {
              month: "long",
              year: "numeric",
            })}
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
              gap: 1,
            }}
          >
            {WEEK_DAYS.map((label) => (
              <Box
                key={label}
                sx={{
                  textAlign: "center",
                  fontWeight: 700,
                  color: "text.secondary",
                }}
              >
                {label}
              </Box>
            ))}

            {monthGrid.map((cell, index) => {
              if (!cell) {
                return (
                  <Box
                    key={`empty-${index}`}
                    sx={{ minHeight: 90, border: "1px dashed #e2e8f0" }}
                  />
                );
              }

              const key = toLocalDateKey(cell);
              const items = agendaByDate.get(key) || [];

              return (
                <Box
                  key={key}
                  sx={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 1,
                    p: 0.75,
                    minHeight: 90,
                    backgroundColor:
                      items.length > 0 ? "#f8fafc" : "transparent",
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    {cell.getDate()}
                  </Typography>

                  <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                    {items.map((item) => (
                      <Button
                        key={item.id}
                        size="small"
                        variant="outlined"
                        onClick={() => handleOpenAgendaConvocatoria(item)}
                        sx={{
                          justifyContent: "flex-start",
                          minHeight: 24,
                          fontSize: 11,
                          px: 0.75,
                        }}
                      >
                        {item.tipoExamen} {item.licencia} (
                        {item.totalAlumnos || 0})
                      </Button>
                    ))}
                  </Stack>
                </Box>
              );
            })}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body2" color="text.secondary">
            Pulsa sobre una convocatoria para ver alumnos asignados. En fechas
            pasadas se incluyen tambien estados APTO y NO_APTO.
          </Typography>
        </Box>
      )}

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {editingId ? "Editar convocatoria" : "Nueva convocatoria"}
        </DialogTitle>
        <DialogContent sx={{ pt: "12px !important" }}>
          <Stack spacing={2}>
            <TextField
              type="date"
              label="Fecha"
              value={form.fecha}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, fecha: event.target.value }))
              }
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            <TextField
              select
              label="Licencia"
              value={form.licencia}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, licencia: event.target.value }))
              }
              fullWidth
            >
              <MenuItem value="B">B</MenuItem>
              <MenuItem value="A">A</MenuItem>
              <MenuItem value="AM">AM</MenuItem>
              <MenuItem value="C">C</MenuItem>
              <MenuItem value="D">D</MenuItem>
            </TextField>

            <TextField
              select
              label="Tipo examen"
              value={form.tipoExamen}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, tipoExamen: event.target.value }))
              }
              fullWidth
            >
              <MenuItem value="TEORICO">Teórico</MenuItem>
              <MenuItem value="PRACTICO">Práctico</MenuItem>
            </TextField>

            <TextField
              select
              label="Activa"
              value={String(form.activo)}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  activo: event.target.value === "true",
                }))
              }
              fullWidth
            >
              <MenuItem value="true">Sí</MenuItem>
              <MenuItem value="false">No</MenuItem>
            </TextField>

            <Alert severity="info">
              Las convocatorias inactivas no se muestran a los alumnos.
            </Alert>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openAgendaModal}
        onClose={() => setOpenAgendaModal(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {selectedConvocatoria
            ? `Convocatoria ${selectedConvocatoria.tipoExamen} ${selectedConvocatoria.licencia} - ${formatDate(selectedConvocatoria.fecha)}`
            : "Convocatoria"}
        </DialogTitle>
        <DialogContent sx={{ pt: "12px !important" }}>
          <Alert severity="info" sx={{ mb: 1.5 }}>
            Estados incluidos:{" "}
            {selectedConvocatoria?.estadosMostrados?.join(", ") ||
              "SOLICITADO, PROGRAMADO"}
            .
          </Alert>

          <Box sx={{ height: 420 }}>
            <DataGrid
              rows={selectedConvocatoria?.alumnos || []}
              columns={agendaColumns}
              getRowId={(row) => row.solicitudId}
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                    page: 0,
                  },
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAgendaModal(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={4500}
        onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          variant="filled"
          severity={notification.severity}
          onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
