import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";

import Tooltip from "@mui/material/Tooltip"; // Asegúrate de importar el componente

import { tarifasConceptoService } from "../../services/tarifasConceptoService";

const PERMISOS = ["A", "A1", "A2", "B", "C", "D", "E"];
const TIPOS = ["FIJO", "VARIABLE", "POR_CLASE", "POR_EXAMEN"];

const emptyForm = {
  permisos: ["B"],
  concepto: "",
  precio: "",
  tipo: "FIJO",
  descripcion: "",
  activa: true,
};

export default function TarifasConcepto() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [permisoFiltro, setPermisoFiltro] = useState("all");
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    action: null,
    tarifaId: null,
    title: "",
    message: "",
  });

  const loadTarifas = async () => {
    try {
      const data = await tarifasConceptoService.getAll({
        permiso: permisoFiltro === "all" ? undefined : permisoFiltro,
      });
      setRows(data);
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message: "No se pudieron cargar los precios por permiso",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    loadTarifas();
  }, [permisoFiltro]);

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
      permisos: [row.permiso || "B"],
      concepto: row.concepto || "",
      precio: row.precio ?? "",
      tipo: row.tipo || "FIJO",
      descripcion: row.descripcion || "",
      activa: Boolean(row.activa),
    });
    setOpen(true);
  };

  const buildConfirm = ({ action, tarifaId, title, message }) => {
    setConfirmDialog({ open: true, action, tarifaId, title, message });
  };

  const handleDelete = (row) => {
    buildConfirm({
      action: "delete",
      tarifaId: row.id,
      title: "Confirmar eliminación",
      message: `Vas a desactivar la tarifa "${row.concepto}" para el permiso ${row.permiso}. Deseas continuar?`,
    });
  };

  const handleToggleActivo = (row) => {
    buildConfirm({
      action: row.activa ? "deactivate" : "activate",
      tarifaId: row.id,
      title: row.activa ? "Confirmar desactivación" : "Confirmar activación",
      message: row.activa
        ? `Vas a desactivar la tarifa "${row.concepto}" del permiso ${row.permiso}.`
        : `Vas a reactivar la tarifa "${row.concepto}" del permiso ${row.permiso}.`,
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({
      open: false,
      action: null,
      tarifaId: null,
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
        await tarifasConceptoService.delete(confirmDialog.tarifaId);
      }

      if (confirmDialog.action === "deactivate") {
        await tarifasConceptoService.deactivate(confirmDialog.tarifaId);
      }

      if (confirmDialog.action === "activate") {
        await tarifasConceptoService.activate(confirmDialog.tarifaId);
      }

      await loadTarifas();

      setNotification({
        open: true,
        message:
          confirmDialog.action === "delete"
            ? "Tarifa desactivada correctamente"
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
      const permisos = Array.isArray(form.permisos) ? form.permisos : [];

      const payload = {
        ...form,
        permiso: editingId ? permisos[0] : permisos,
        precio: Number(form.precio),
      };

      delete payload.permisos;

      if (editingId) {
        await tarifasConceptoService.update(editingId, payload);
      } else {
        await tarifasConceptoService.create(payload);
      }

      await loadTarifas();
      setOpen(false);
      resetForm();
      setNotification({
        open: true,
        message: editingId
          ? "Precio actualizado correctamente"
          : permisos.length > 1
            ? "Precios creados correctamente"
            : "Precio creado correctamente",
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "Error guardando precio",
        severity: "error",
      });
    }
  };

  const columns = [
    {
      field: "permiso",
      headerName: "Permiso",
      flex: 1,
    },
    {
      field: "concepto",
      headerName: "Concepto",
      flex: 2,
    },
    {
      field: "precio",
      headerName: "Precio",
      flex: 1,
      valueFormatter: (value) => `${value} €`,
    },
    {
      field: "tipo",
      headerName: "Tipo",
      flex: 1,
    },
    {
      field: "descripcion",
      headerName: "Descripción",
      flex: 2,
      valueGetter: (value, row) => row.descripcion || "-",
    },
    {
      field: "activa",
      headerName: "Estado",
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.row.activa ? "Activo" : "Inactivo"}
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
        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
          <Tooltip title="Editar" arrow>
            <IconButton color="primary" onClick={() => handleEdit(params.row)}>
              <EditIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={params.row.activa ? "Desactivar" : "Activar"} arrow>
            <IconButton
              onClick={() => handleToggleActivo(params.row)}
              color={params.row.activa ? "warning" : "success"}
            >
              {params.row.activa ? <ToggleOffIcon /> : <ToggleOnIcon />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Eliminar" arrow>
            <IconButton onClick={() => handleDelete(params.row)} color="error">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
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
            Tarifas por permisos
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Permiso</InputLabel>
            <Select
              label="Permiso"
              value={permisoFiltro}
              onChange={(event) => setPermisoFiltro(event.target.value)}
            >
              <MenuItem value="all">Todos</MenuItem>
              {PERMISOS.map((permiso) => (
                <MenuItem key={permiso} value={permiso}>
                  {permiso}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
          >
            Nuevo precio
          </Button>
        </Box>
      </Box>

      <Box sx={{ height: 700 }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
            sorting: { sortModel: [{ field: "permiso", sort: "asc" }] },
          }}
        />
      </Box>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editingId ? "Editar precio" : "Nuevo precio"}
        </DialogTitle>
        <DialogContent sx={{ pt: 1, display: "grid", gap: 2 }}>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Permiso</InputLabel>
            <Select
              multiple={!editingId}
              label="Permiso"
              value={form.permisos}
              renderValue={(selected) =>
                Array.isArray(selected) ? selected.join(", ") : ""
              }
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  permisos:
                    typeof event.target.value === "string"
                      ? event.target.value.split(",")
                      : event.target.value,
                }))
              }
            >
              {PERMISOS.map((permiso) => (
                <MenuItem key={permiso} value={permiso}>
                  {!editingId ? (
                    <>
                      <Checkbox checked={form.permisos.includes(permiso)} />
                      <ListItemText primary={permiso} />
                    </>
                  ) : (
                    permiso
                  )}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Concepto"
            fullWidth
            value={form.concepto}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, concepto: event.target.value }))
            }
          />

          <TextField
            label="Precio"
            type="number"
            fullWidth
            value={form.precio}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, precio: event.target.value }))
            }
          />

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
            label="Descripción"
            fullWidth
            multiline
            minRows={2}
            value={form.descripcion}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, descripcion: event.target.value }))
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
