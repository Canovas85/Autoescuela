import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  IconButton,
  DialogContent,
  DialogTitle,
  DialogContentText,
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
import TemarioHero from "./TemarioHero";

const LICENCIAS = ["B", "A1", "A2", "A", "C", "D", "E"];
const LICENCIAS_MOTO = ["A1", "A2", "A"];

const LICENCIAS_FILTRO = [
  { value: "B", label: "B Turismos" },
  { value: "A_MOTOS", label: "A1, A2 y A Motocicletas" },
  { value: "C", label: "C Camiones" },
  { value: "D", label: "D Autobuses" },
  { value: "E", label: "E Remolques y Conjuntos de Vehiculos" },
];

const toLicenciasArray = (valor) => {
  if (Array.isArray(valor)) return valor;
  if (typeof valor === "string" && valor.trim()) return [valor.trim()];
  return [];
};

const emptyForm = {
  titulo: "",
  descripcion: "",
  tipoLicenciaObjetivo: ["B"],
  orden: 0,
};

export default function Temarios() {
  const [rows, setRows] = useState([]);
  const [filtroLicencia, setFiltroLicencia] = useState("");
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
    temarioId: null,
    tituloTemario: "",
    title: "",
    message: "",
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

  const filteredRows = useMemo(() => {
    if (!filtroLicencia) return rows;

    return rows.filter((row) => {
      const licencias = toLicenciasArray(row.tipoLicenciaObjetivo);

      if (filtroLicencia === "A_MOTOS") {
        return licencias.some((licencia) => LICENCIAS_MOTO.includes(licencia));
      }

      return licencias.includes(filtroLicencia);
    });
  }, [rows, filtroLicencia]);

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
      tipoLicenciaObjetivo: toLicenciasArray(row.tipoLicenciaObjetivo),
      orden: row.orden ?? 0,
    });
    setOpen(true);
  };

  const handleDelete = async (row) => {
    const tituloTemario = row?.titulo || "este temario";

    setConfirmDialog({
      open: true,
      action: "delete",
      temarioId: row.id,
      tituloTemario,
      title: "Confirmar eliminación",
      message: `Vas a eliminar definitivamente el temario "${tituloTemario}" de Autoescuela Eguzkilore. Todo el contenido asociado será eliminado de forma permanente. Esta acción no podrá deshacerse. ¿Deseas continuar?`,
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({
      open: false,
      action: null,
      temarioId: null,
      tituloTemario: "",
      title: "",
      message: "",
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmDialog.temarioId) {
      closeConfirmDialog();
      return;
    }

    try {
      await temariosService.delete(confirmDialog.temarioId);

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
    } finally {
      closeConfirmDialog();
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...form,
        tipoLicenciaObjetivo: toLicenciasArray(form.tipoLicenciaObjetivo),
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
    {
      field: "tipoLicenciaObjetivo",
      headerName: "Permisos",
      flex: 1,
      renderCell: (params) => {
        const licencias = toLicenciasArray(params.row.tipoLicenciaObjetivo);
        return licencias.length > 0 ? licencias.join(", ") : "-";
      },
    },
    { field: "orden", headerName: "Orden", flex: 0.6 },
    {
      field: "descripcion",
      headerName: "Descripción",
      flex: 1.6,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <Typography variant="body2" noWrap>
            {params.row.descripcion || "Sin descripción"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 140,
      sortable: false,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            gap: 0.5,
          }}
        >
          <IconButton color="primary" onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>

          <IconButton color="error" onClick={() => handleDelete(params.row)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <TemarioHero mode="admin" />

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
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              width: "100%",
              maxWidth: 560,
              justifyContent: "center",
            }}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              Licencia
            </Typography>

            <FormControl size="small" sx={{ minWidth: 340 }}>
              <InputLabel id="filtro-licencia-label">Licencia</InputLabel>
              <Select
                labelId="filtro-licencia-label"
                label="Licencia"
                value={filtroLicencia}
                onChange={(event) => setFiltroLicencia(event.target.value)}
              >
                <MenuItem value="">Todas</MenuItem>
                {LICENCIAS_FILTRO.map((licencia) => (
                  <MenuItem key={licencia.value} value={licencia.value}>
                    {licencia.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
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
            <InputLabel id="permisos-label">Permisos</InputLabel>
            <Select
              labelId="permisos-label"
              multiple
              label="Permisos"
              value={form.tipoLicenciaObjetivo}
              renderValue={(selected) => selected.join(", ")}
              onChange={(event) => {
                const value = event.target.value;
                setForm((prev) => ({
                  ...prev,
                  tipoLicenciaObjetivo:
                    typeof value === "string" ? value.split(",") : value,
                }));
              }}
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
            color="error"
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
