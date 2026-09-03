import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  IconButton,
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

import { tarifasMatriculaService } from "../../services/tarifasMatriculaService";

const LICENCIAS = ["B", "A1", "A2", "A", "C", "D", "E"];

const emptyForm = {
  licencia: "B",
  precio: "",
  activa: true,
};

export default function TarifasMatricula() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    action: null,
    tarifaId: null,
    licenciaTarifa: "",
    title: "",
    message: "",
  });

  const loadTarifas = async () => {
    try {
      const data = await tarifasMatriculaService.getAll();
      setRows(data);
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message: "No se pudieron cargar las tarifas de matricula",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    loadTarifas();
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
      licencia: row.licencia || "B",
      precio: row.precio ?? "",
      activa: Boolean(row.activa),
    });
    setOpen(true);
  };

  const handleDelete = (row) => {
    setConfirmDialog({
      open: true,
      action: "delete",
      tarifaId: row.id,
      licenciaTarifa: row.licencia,
      title: "Confirmar eliminación",
      message: `Vas a eliminar definitivamente la tarifa de la licencia "${row.licencia}" de Autoescuela Eguzkilore. Esta accion no podra deshacerse. Deseas continuar?`,
    });
  };

  const handleToggleActivo = (row) => {
    setConfirmDialog({
      open: true,
      action: row.activa ? "deactivate" : "activate",
      tarifaId: row.id,
      licenciaTarifa: row.licencia,
      title: row.activa ? "Confirmar desactivación" : "Confirmar activación",
      message: row.activa
        ? `Vas a desactivar la tarifa de la licencia "${row.licencia}" en Autoescuela Eguzkilore. No podra utilizarse hasta su reactivacion. Deseas continuar?`
        : `Vas a reactivar la tarifa de la licencia "${row.licencia}" en Autoescuela Eguzkilore. Volvera a estar disponible de inmediato. Deseas continuar?`,
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({
      open: false,
      action: null,
      tarifaId: null,
      licenciaTarifa: "",
      title: "",
      message: "",
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmDialog.tarifaId || !confirmDialog.action) {
      closeConfirmDialog();
      return;
    }

    try {
      if (confirmDialog.action === "delete") {
        await tarifasMatriculaService.delete(confirmDialog.tarifaId);
      }

      if (confirmDialog.action === "deactivate") {
        await tarifasMatriculaService.deactivate(confirmDialog.tarifaId);
      }

      if (confirmDialog.action === "activate") {
        await tarifasMatriculaService.activate(confirmDialog.tarifaId);
      }

      await loadTarifas();

      setNotification({
        open: true,
        message:
          confirmDialog.action === "delete"
            ? "Tarifa eliminada correctamente"
            : confirmDialog.action === "deactivate"
              ? "Tarifa desactivada correctamente"
              : "Tarifa activada correctamente",
        severity: "success",
      });
    } catch (error) {
      console.error(error);

      setNotification({
        open: true,
        message: error.response?.data?.message || "Error procesando la acción",
        severity: "error",
      });
    } finally {
      closeConfirmDialog();
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...form,
        precio: Number(form.precio),
      };

      if (editingId) {
        await tarifasMatriculaService.update(editingId, payload);
      } else {
        await tarifasMatriculaService.create(payload);
      }

      await loadTarifas();
      setOpen(false);
      resetForm();
      setNotification({
        open: true,
        message: editingId
          ? "Tarifa actualizada correctamente"
          : "Tarifa creada correctamente",
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "Error guardando tarifa",
        severity: "error",
      });
    }
  };

  const columns = [
    {
      field: "licencia",
      headerName: "Licencia",
      flex: 1,
    },

    {
      field: "precio",
      headerName: "Precio",
      flex: 1,

      valueFormatter: (value) => `${value} €`,
    },

    {
      field: "activa",
      headerName: "Estado",
      flex: 1,

      renderCell: (params) => (
        <Chip
          label={params.row.activa ? "Activa" : "Inactiva"}
          color={params.row.activa ? "success" : "default"}
          size="small"
        />
      ),
    },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton onClick={() => handleEdit(params.row)} size="small">
            <EditIcon fontSize="small" />
          </IconButton>

          <IconButton
            onClick={() => handleToggleActivo(params.row)}
            size="small"
            color={params.row.activa ? "warning" : "success"}
          >
            {params.row.activa ? (
              <ToggleOffIcon fontSize="small" />
            ) : (
              <ToggleOnIcon fontSize="small" />
            )}
          </IconButton>

          <IconButton
            onClick={() => handleDelete(params.row)}
            size="small"
            color="error"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
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
            Tarifas de Matrícula
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
          Nueva tarifa
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
          {editingId ? "Editar tarifa" : "Nueva tarifa"}
        </DialogTitle>
        <DialogContent
          sx={{
            pt: 1,
            display: "grid",
            gap: 2,
          }}
        >
          <FormControl fullWidth>
            <InputLabel>Licencia</InputLabel>

            <Select
              label="Licencia"
              value={form.licencia}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  licencia: event.target.value,
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
            label="Precio"
            type="number"
            fullWidth
            value={form.precio}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                precio: event.target.value,
              }))
            }
          />

          <FormControl fullWidth>
            <InputLabel>Estado</InputLabel>

            <Select
              label="Estado"
              value={form.activa ? "true" : "false"}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  activa: event.target.value === "true",
                }))
              }
            >
              <MenuItem value="true">Activa</MenuItem>

              <MenuItem value="false">Inactiva</MenuItem>
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

      <Dialog
        open={confirmDialog.open}
        onClose={closeConfirmDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>{confirmDialog.title}</DialogTitle>

        <DialogContent>
          <DialogContentText>{confirmDialog.message}</DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeConfirmDialog}>Cancelar</Button>

          <Button
            variant="contained"
            color={confirmDialog.action === "activate" ? "success" : "error"}
            onClick={handleConfirmAction}
          >
            Confirmar
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
