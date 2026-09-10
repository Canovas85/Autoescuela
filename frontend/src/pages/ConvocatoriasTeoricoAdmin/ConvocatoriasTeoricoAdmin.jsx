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
import { convocatoriasTeoricoService } from "../../services/convocatoriasTeoricoService";
import Tooltip from "@mui/material/Tooltip"; // Asegúrate de importar el componente

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

const DEFAULT_FORM = {
  fecha: "",
  licencia: "B",
  activo: true,
};

export default function ConvocatoriasTeoricoAdmin() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const loadRows = async () => {
    try {
      const data = await convocatoriasTeoricoService.getAll();
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

  useEffect(() => {
    loadRows();
  }, []);

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
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar" arrow>
              <IconButton
                onClick={() => handleDeactivate(params.row)}
                size="small"
                color="error"
                disabled={!params.row.activo}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
      },
    ],
    [],
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Convocatorias DGT teóricas
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Gestiona las fechas oficiales que verán los alumnos para solicitar
        examen.
      </Typography>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        sx={{ mb: 2 }}
      >
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Nueva convocatoria
        </Button>
      </Stack>

      <DataGrid
        autoHeight
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id}
        disableRowSelectionOnClick
        pageSizeOptions={[10, 25, 50]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10, page: 0 } },
          sorting: { sortModel: [{ field: "fecha", sort: "asc" }] },
        }}
      />

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
