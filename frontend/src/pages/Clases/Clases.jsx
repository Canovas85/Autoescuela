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

import { clasesService } from "../../services/clasesService";
import { alumnosService } from "../../services/alumnosService";
import { profesoresService } from "../../services/profesoresService";
import { vehiculosService } from "../../services/vehiculosService";

const ESTADOS = ["PROGRAMADA", "REALIZADA", "CANCELADA"];

const emptyForm = {
  alumnoId: "",
  profesorId: "",
  vehiculoId: "",
  fecha: new Date().toISOString().slice(0, 10),
  duracion: 60,
  estado: "PROGRAMADA",
};

const formatDate = (value) => {
  if (!value) return "Sin fecha";

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

export default function Clases() {
  const [rows, setRows] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
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
      const [clases, alumnosData, profesoresData, vehiculosData] =
        await Promise.all([
          clasesService.getAll(),
          alumnosService.getAll(),
          profesoresService.getAll(),
          vehiculosService.getAll(),
        ]);

      setRows(clases);
      setAlumnos(alumnosData);
      setProfesores(profesoresData);
      setVehiculos(vehiculosData);
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message: "No se pudieron cargar las clases",
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
      profesorId: row.profesorId || row.profesor?.id || "",
      vehiculoId: row.vehiculoId || row.vehiculo?.id || "",
      fecha: row.fecha
        ? new Date(row.fecha).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
      duracion: row.duracion ?? 60,
      estado: row.estado || "PROGRAMADA",
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas cancelar esta clase?")) return;

    try {
      await clasesService.cancel(id);
      await loadData();
      setNotification({
        open: true,
        message: "Clase cancelada correctamente",
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "Error cancelando clase",
        severity: "error",
      });
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...form,
        duracion: Number(form.duracion),
      };

      if (editingId) {
        await clasesService.update(editingId, payload);
      } else {
        await clasesService.create(payload);
      }

      await loadData();
      setOpen(false);
      resetForm();
      setNotification({
        open: true,
        message: editingId
          ? "Clase actualizada correctamente"
          : "Clase creada correctamente",
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "Error guardando clase",
        severity: "error",
      });
    }
  };

  const columns = [
    {
      field: "alumno",
      headerName: "Alumno",
      flex: 1.1,
      valueGetter: (_, row) => row.alumno?.usuario?.nombre || "Sin alumno",
    },
    {
      field: "profesor",
      headerName: "Profesor",
      flex: 1.1,
      valueGetter: (_, row) => row.profesor?.usuario?.nombre || "Sin profesor",
    },
    {
      field: "vehiculo",
      headerName: "Vehículo",
      flex: 1,
      valueGetter: (_, row) => row.vehiculo?.matricula || "Sin vehículo",
    },
    {
      field: "fecha",
      headerName: "Fecha",
      flex: 1,
      valueGetter: (_, row) => formatDate(row.fecha),
    },
    { field: "duracion", headerName: "Duración", flex: 0.6 },
    {
      field: "estado",
      headerName: "Estado",
      flex: 0.8,
      renderCell: (params) => (
        <Chip
          label={params.row.estado}
          size="small"
          color={
            params.row.estado === "CANCELADA"
              ? "error"
              : params.row.estado === "REALIZADA"
                ? "success"
                : "default"
          }
        />
      ),
    },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 150,
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
            Cancelar
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
            Clases
          </Typography>
          <Typography color="text.secondary">
            Gestión de clases prácticas y reservas.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
        >
          Nueva clase
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
        maxWidth="md"
      >
        <DialogTitle>{editingId ? "Editar clase" : "Nueva clase"}</DialogTitle>
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
            <InputLabel>Profesor</InputLabel>
            <Select
              label="Profesor"
              value={form.profesorId}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, profesorId: event.target.value }))
              }
            >
              {profesores.map((profesor) => (
                <MenuItem key={profesor.id} value={profesor.id}>
                  {profesor.usuario?.nombre || profesor.id}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Vehículo</InputLabel>
            <Select
              label="Vehículo"
              value={form.vehiculoId}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, vehiculoId: event.target.value }))
              }
            >
              {vehiculos.map((vehiculo) => (
                <MenuItem key={vehiculo.id} value={vehiculo.id}>
                  {vehiculo.matricula} - {vehiculo.marca} {vehiculo.modelo}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Fecha y hora"
            type="datetime-local"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={form.fecha}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, fecha: event.target.value }))
            }
            sx={{
              "& input::-webkit-datetime-edit": {
                color: form.fecha ? "inherit" : "transparent",
              },
            }}
          />

          <TextField
            label="Duración (minutos)"
            type="number"
            fullWidth
            value={form.duracion}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, duracion: event.target.value }))
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
