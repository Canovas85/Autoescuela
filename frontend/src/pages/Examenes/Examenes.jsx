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
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import { examenesService } from "../../services/examenesService";
import { alumnosService } from "../../services/alumnosService";

const TIPOS = ["TEORICO", "PRACTICO"];
const ESTADOS = [
  "PENDIENTE",
  "PROGRAMADO",
  "APROBADO",
  "SUSPENDIDO",
  "CANCELADO",
];

const emptyForm = {
  alumnoId: "",
  tipo: "TEORICO",
  fecha: new Date().toISOString().slice(0, 10),
  estado: "PROGRAMADO",
  observaciones: "",
};

const formatDate = (value) => {
  if (!value) return "Sin fecha";

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

export default function Examenes() {
  const [rows, setRows] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const loadData = async () => {
    try {
      const [examenes, alumnosData] = await Promise.all([
        examenesService.getAll(),
        alumnosService.getAll(),
      ]);

      setRows(examenes);
      setAlumnos(alumnosData);
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message: "No se pudieron cargar los exámenes",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredRows = useMemo(() => rows, [rows]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setOpen(true);
  };

  const handleEdit = (row) => {
    setEditingId(row.id);
    setForm({
      alumnoId: row.alumnoId || row.alumno?.id || "",
      tipo: row.tipo || "TEORICO",
      fecha: row.fecha
        ? new Date(row.fecha).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
      estado: row.estado || "PROGRAMADO",
      observaciones: row.observaciones || "",
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este examen?")) return;

    try {
      await examenesService.delete(id);
      await loadData();
      setNotification({
        open: true,
        message: "Examen eliminado correctamente",
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "Error eliminando examen",
        severity: "error",
      });
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...form,
        observaciones: form.observaciones || null,
      };

      if (editingId) {
        await examenesService.update(editingId, payload);
      } else {
        await examenesService.create(payload);
      }

      await loadData();
      setOpen(false);
      resetForm();
      setNotification({
        open: true,
        message: editingId
          ? "Examen actualizado correctamente"
          : "Examen creado correctamente",
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "Error guardando examen",
        severity: "error",
      });
    }
  };

  const columns = [
    {
      field: "alumno",
      headerName: "Alumno",
      flex: 1.3,
      valueGetter: (_, row) => row.alumno?.usuario?.nombre || "Sin alumno",
    },
    { field: "tipo", headerName: "Tipo", flex: 0.7 },
    {
      field: "fecha",
      headerName: "Fecha",
      flex: 0.8,
      valueGetter: (_, row) => formatDate(row.fecha),
    },
    {
      field: "estado",
      headerName: "Estado",
      flex: 0.9,
      renderCell: (params) => (
        <Chip
          label={params.row.estado}
          size="small"
          color={
            params.row.estado === "APROBADO"
              ? "success"
              : params.row.estado === "SUSPENDIDO"
                ? "error"
                : "default"
          }
        />
      ),
    },
    {
      field: "observaciones",
      headerName: "Observaciones",
      flex: 1.2,
      renderCell: (params) => (
        <Typography variant="body2" noWrap>
          {params.row.observaciones || "Sin observaciones"}
        </Typography>
      ),
    },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 140,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            size="small"
            startIcon={<EditIcon />}
            onClick={() => handleEdit(params.row)}
          >
            Editar
          </Button>
          <Button
            size="small"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => handleDelete(params.row.id)}
          >
            Borrar
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Exámenes
          </Typography>
          <Typography color="text.secondary">
            Gestión de convocatorias y resultados de exámenes.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
        >
          Nuevo examen
        </Button>
      </Box>

      <Box sx={{ height: 620 }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
        />
      </Box>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editingId ? "Editar examen" : "Nuevo examen"}
        </DialogTitle>
        <DialogContent sx={{ pt: 1, display: "grid", gap: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Alumno</InputLabel>
            <Select
              label="Alumno"
              value={form.alumnoId}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, alumnoId: event.target.value }))
              }
            >
              {alumnos.map((alumno) => (
                <MenuItem key={alumno.id} value={alumno.id}>
                  {alumno.usuario?.nombre || alumno.id}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Tipo</InputLabel>
            <Select
              label="Tipo"
              value={form.tipo}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, tipo: event.target.value }))
              }
            >
              {TIPOS.map((tipo) => (
                <MenuItem key={tipo} value={tipo}>
                  {tipo}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Fecha"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={form.fecha}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, fecha: event.target.value }))
            }
          />

          <FormControl fullWidth>
            <InputLabel>Estado</InputLabel>
            <Select
              label="Estado"
              value={form.estado}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, estado: event.target.value }))
              }
            >
              {ESTADOS.map((estado) => (
                <MenuItem key={estado} value={estado}>
                  {estado}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Observaciones"
            fullWidth
            multiline
            minRows={3}
            value={form.observaciones}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                observaciones: event.target.value,
              }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={3500}
        onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          severity={notification.severity}
          variant="filled"
          onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
