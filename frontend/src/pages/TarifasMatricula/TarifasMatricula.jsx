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

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    action: null,
    bonoId: null,
    nombreBono: "",
    title: "",
    message: "",
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

  const handleDelete = (row) => {
    setConfirmDialog({
      open: true,
      action: "delete",
      bonoId: row.id,
      nombreBono: row.nombre,
      title: "Confirmar eliminación",
      message: `Vas a eliminar definitivamente el bono "${row.nombre}" de Autoescuela Eguzkilore. Toda la información asociada será eliminada de forma permanente. Esta acción no podrá deshacerse. ¿Deseas continuar?`,
    });
  };

  const handleToggleActivo = (row) => {
    setConfirmDialog({
      open: true,
      action: row.activo ? "deactivate" : "activate",
      bonoId: row.id,
      nombreBono: row.nombre,
      title: row.activo ? "Confirmar desactivación" : "Confirmar activación",
      message: row.activo
        ? `Vas a desactivar el bono "${row.nombre}" en Autoescuela Eguzkilore. No podrá utilizarse hasta su reactivación. ¿Deseas continuar?`
        : `Vas a reactivar el bono "${row.nombre}" en Autoescuela Eguzkilore. Volverá a estar disponible de inmediato. ¿Deseas continuar?`,
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({
      open: false,
      action: null,
      bonoId: null,
      nombreBono: "",
      title: "",
      message: "",
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmDialog.bonoId || !confirmDialog.action) {
      closeConfirmDialog();
      return;
    }

    try {
      if (confirmDialog.action === "delete") {
        await bonosService.delete(confirmDialog.bonoId);
      }

      if (confirmDialog.action === "deactivate") {
        await bonosService.deactivate(confirmDialog.bonoId);
      }

      if (confirmDialog.action === "activate") {
        await bonosService.activate(confirmDialog.bonoId);
      }

      await loadBonos();

      setNotification({
        open: true,
        message:
          confirmDialog.action === "delete"
            ? "Bono eliminado correctamente"
            : confirmDialog.action === "deactivate"
              ? "Bono desactivado correctamente"
              : "Bono activado correctamente",
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
        <DialogTitle>{editingId ? "Editar bono" : "Nuevo bono"}</DialogTitle>
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
