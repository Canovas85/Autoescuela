import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
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

import { temariosService } from "../../services/temariosService";

const LICENCIAS = ["B", "A1", "A2", "A", "C", "D", "E"];

const emptyForm = {
  titulo: "",
  descripcion: "",
  tipoLicenciaObjetivo: "B",
  orden: 0,
};

export default function Temarios() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const loadTemarios = async () => {
    try {
      const data = await temariosService.getAll();
      setRows(data);
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message: "No se pudieron cargar los temarios",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    loadTemarios();
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
      titulo: row.titulo || "",
      descripcion: row.descripcion || "",
      tipoLicenciaObjetivo: row.tipoLicenciaObjetivo || "B",
      orden: row.orden ?? 0,
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este temario?")) {
      return;
    }

    try {
      await temariosService.delete(id);
      await loadTemarios();
      setNotification({
        open: true,
        message: "Temario eliminado correctamente",
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "Error eliminando temario",
        severity: "error",
      });
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...form,
        orden: Number(form.orden),
      };

      if (editingId) {
        await temariosService.update(editingId, payload);
      } else {
        await temariosService.create(payload);
      }

      await loadTemarios();
      setOpen(false);
      resetForm();
      setNotification({
        open: true,
        message: editingId
          ? "Temario actualizado correctamente"
          : "Temario creado correctamente",
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "Error guardando temario",
        severity: "error",
      });
    }
  };

  const columns = [
    { field: "titulo", headerName: "Título", flex: 1.2 },
    { field: "tipoLicenciaObjetivo", headerName: "Permiso", flex: 0.8 },
    { field: "orden", headerName: "Orden", flex: 0.6 },
    {
      field: "descripcion",
      headerName: "Descripción",
      flex: 1.6,
      renderCell: (params) => (
        <Typography variant="body2" noWrap>
          {params.row.descripcion || "Sin descripción"}
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
            Temarios
          </Typography>
          <Typography color="text.secondary">
            Gestión de contenido teórico asociado al permiso objetivo.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
        >
          Nuevo temario
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
          {editingId ? "Editar temario" : "Nuevo temario"}
        </DialogTitle>
        <DialogContent sx={{ pt: 1, display: "grid", gap: 2 }}>
          <TextField
            label="Título"
            fullWidth
            value={form.titulo}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, titulo: event.target.value }))
            }
          />
          <TextField
            label="Descripción"
            fullWidth
            multiline
            minRows={3}
            value={form.descripcion}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, descripcion: event.target.value }))
            }
          />
          <FormControl fullWidth>
            <InputLabel>Permiso</InputLabel>
            <Select
              label="Permiso"
              value={form.tipoLicenciaObjetivo}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  tipoLicenciaObjetivo: event.target.value,
                }))
              }
            >
              {LICENCIAS.map((licencia) => (
                <MenuItem key={licencia} value={licencia}>
                  {licencia}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Orden"
            type="number"
            fullWidth
            value={form.orden}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, orden: event.target.value }))
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
