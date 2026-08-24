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
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";

import { bonosService } from "../../services/bonosService";

const emptyForm = {
  nombre: "",
  descripcion: "",
  clasesIncluidas: 10,
  validezDias: 90,
  activo: true,
};

export default function Bonos() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const loadBonos = async () => {
    try {
      const data = await bonosService.getAll();
      setRows(data);
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message: "No se pudieron cargar los bonos",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    loadBonos();
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
      nombre: row.nombre || "",
      descripcion: row.descripcion || "",
      clasesIncluidas: row.clasesIncluidas ?? 10,
      validezDias: row.validezDias ?? 90,
      activo: Boolean(row.activo),
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este bono?")) {
      return;
    }

    try {
      await bonosService.delete(id);
      await loadBonos();
      setNotification({
        open: true,
        message: "Bono eliminado correctamente",
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "Error eliminando bono",
        severity: "error",
      });
    }
  };

  const handleToggleActivo = async (row) => {
    try {
      if (row.activo) {
        await bonosService.deactivate(row.id);
      } else {
        await bonosService.activate(row.id);
      }

      await loadBonos();
      setNotification({
        open: true,
        message: row.activo
          ? "Bono desactivado correctamente"
          : "Bono activado correctamente",
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "Error actualizando bono",
        severity: "error",
      });
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...form,
        clasesIncluidas: Number(form.clasesIncluidas),
        validezDias: Number(form.validezDias),
      };

      if (editingId) {
        await bonosService.update(editingId, payload);
      } else {
        await bonosService.create(payload);
      }

      await loadBonos();
      setOpen(false);
      resetForm();
      setNotification({
        open: true,
        message: editingId
          ? "Bono actualizado correctamente"
          : "Bono creado correctamente",
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "Error guardando bono",
        severity: "error",
      });
    }
  };

  const columns = [
    { field: "nombre", headerName: "Nombre", flex: 1.1 },
    { field: "clasesIncluidas", headerName: "Clases", flex: 0.6 },
    { field: "validezDias", headerName: "Validez (días)", flex: 0.8 },
    {
      field: "descripcion",
      headerName: "Descripción",
      flex: 1.4,
      renderCell: (params) => (
        <Typography variant="body2" noWrap>
          {params.row.descripcion || "Sin descripción"}
        </Typography>
      ),
    },
    {
      field: "activo",
      headerName: "Estado",
      flex: 0.7,
      renderCell: (params) => (
        <Chip
          label={params.row.activo ? "Activo" : "Inactivo"}
          color={params.row.activo ? "success" : "default"}
          size="small"
        />
      ),
    },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 220,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
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
          <Button
            size="small"
            variant="outlined"
            startIcon={params.row.activo ? <ToggleOffIcon /> : <ToggleOnIcon />}
            onClick={() => handleToggleActivo(params.row)}
          >
            {params.row.activo ? "Desactivar" : "Activar"}
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
            Bonos
          </Typography>
          <Typography color="text.secondary">
            Catálogo de packs de clases y su estado de activación.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
        >
          Nuevo bono
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
        <DialogTitle>{editingId ? "Editar bono" : "Nuevo bono"}</DialogTitle>
        <DialogContent sx={{ pt: 1, display: "grid", gap: 2 }}>
          <TextField
            label="Nombre"
            fullWidth
            value={form.nombre}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, nombre: event.target.value }))
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
          <TextField
            label="Clases incluidas"
            type="number"
            fullWidth
            value={form.clasesIncluidas}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                clasesIncluidas: event.target.value,
              }))
            }
          />
          <TextField
            label="Validez en días"
            type="number"
            fullWidth
            value={form.validezDias}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, validezDias: event.target.value }))
            }
          />
          <FormControl fullWidth>
            <InputLabel>Estado</InputLabel>
            <Select
              label="Estado"
              value={form.activo ? "true" : "false"}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  activo: event.target.value === "true",
                }))
              }
            >
              <MenuItem value="true">Activo</MenuItem>
              <MenuItem value="false">Inactivo</MenuItem>
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
