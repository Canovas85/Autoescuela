import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
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
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Tooltip from "@mui/material/Tooltip";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

import { bonosService } from "../../services/bonosService";

const emptyForm = {
  nombre: "",
  descripcion: "",
  clasesIncluidas: 10,
  precio: "",
  validezDias: 90,
  activo: true,
};

function formatPrice(value) {
  return `${Number(value || 0).toFixed(2)} EUR`;
}

function StudentBonosView({ rows, loading, onBuy }) {
  if (loading) {
    return <Typography>Cargando bonos...</Typography>;
  }

  if (rows.length === 0) {
    return (
      <Typography color="text.secondary">
        No hay bonos activos disponibles en este momento.
      </Typography>
    );
  }

  return (
    <Grid container spacing={3}>
      {rows.map((row) => (
        <Grid item xs={12} md={6} lg={4} key={row.id}>
          <Card
            sx={{
              height: "100%",
              minHeight: 320,
              borderRadius: 3,
              border: "1px solid rgba(15, 23, 42, 0.14)",
              boxShadow: "0 12px 28px rgba(15, 23, 42, 0.08)",
            }}
          >
            <CardContent
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 900,
                  color: "#0f4c81",
                  lineHeight: 1.1,
                }}
              >
                {row.nombre}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Typography sx={{ fontWeight: 700 }}>
                  {row.clasesIncluidas} clases
                </Typography>
                <Typography sx={{ fontWeight: 700 }} color="text.secondary">
                  Validez: {row.validezDias} dias
                </Typography>
              </Box>

              <Typography color="text.secondary" sx={{ flexGrow: 1 }}>
                {row.descripcion || "Bono de clases practicas"}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 900 }}>
                  {formatPrice(row.precio)}
                </Typography>

                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCartIcon />}
                  onClick={() => onBuy(row)}
                >
                  Comprar bono
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default function Bonos() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState(null);
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

  useEffect(() => {
    const token = localStorage.getItem("token") || "";

    try {
      const decoded = jwtDecode(token);
      setRole(decoded?.rol ?? "ALUMNO");
    } catch {
      setRole("ALUMNO");
    }
  }, []);

  const loadBonos = async () => {
    if (!role) {
      return;
    }

    try {
      setLoading(true);
      const data =
        role === "ADMIN"
          ? await bonosService.getAll()
          : await bonosService.getAvailable();
      setRows(data);
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message:
          role === "ADMIN"
            ? "No se pudieron cargar los bonos"
            : "No se pudieron cargar los bonos disponibles",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBonos();
  }, [role]);

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
      precio: row.precio ?? "",
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
      title: "Confirmar eliminacion",
      message: `Vas a eliminar definitivamente el bono "${row.nombre}" de Autoescuela Eguzkilore. Toda la informacion asociada sera eliminada de forma permanente. Esta accion no podra deshacerse. Deseas continuar?`,
    });
  };

  const handleToggleActivo = (row) => {
    setConfirmDialog({
      open: true,
      action: row.activo ? "deactivate" : "activate",
      bonoId: row.id,
      nombreBono: row.nombre,
      title: row.activo ? "Confirmar desactivacion" : "Confirmar activacion",
      message: row.activo
        ? `Vas a desactivar el bono "${row.nombre}" en Autoescuela Eguzkilore. No podra utilizarse hasta su reactivacion. Deseas continuar?`
        : `Vas a reactivar el bono "${row.nombre}" en Autoescuela Eguzkilore. Volvera a estar disponible de inmediato. Deseas continuar?`,
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
        message: error.response?.data?.message || "Error procesando la accion",
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
        precio: Number(form.precio),
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

  const handleBuy = async (row) => {
    try {
      const result = await bonosService.buy(row.id);
      const pagoId = result?.pago?.id;

      if (!pagoId) {
        throw new Error("No se pudo generar el pago pendiente del bono");
      }

      navigate(`/pago-matricula?pagoId=${pagoId}`);
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message:
          error.response?.data?.message ||
          error.message ||
          "No se pudo iniciar la compra del bono",
        severity: "error",
      });
    }
  };

  const columns = [
    { field: "nombre", headerName: "Nombre", flex: 1.1 },
    { field: "clasesIncluidas", headerName: "Clases", flex: 0.6 },
    {
      field: "precio",
      headerName: "Precio",
      flex: 0.7,
      valueFormatter: (value) => formatPrice(value),
    },
    { field: "validezDias", headerName: "Validez (dias)", flex: 0.8 },
    {
      field: "descripcion",
      headerName: "Descripcion",
      flex: 1.4,
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
            {params.row.descripcion || "Sin descripcion"}
          </Typography>
        </Box>
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
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.5,
            width: "100%",
          }}
        >
          <Tooltip title="Editar" arrow>
            <IconButton color="primary" onClick={() => handleEdit(params.row)}>
              <EditIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={params.row.activo ? "Desactivar" : "Activar"} arrow>
            <IconButton
              color={params.row.activo ? "warning" : "success"}
              onClick={() => handleToggleActivo(params.row)}
            >
              {params.row.activo ? <ToggleOffIcon /> : <ToggleOnIcon />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Eliminar" arrow>
            <IconButton color="error" onClick={() => handleDelete(params.row)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  if (!role) {
    return <Typography>Cargando bonos...</Typography>;
  }

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
        <Typography variant="h4" fontWeight="bold">
          {role === "ADMIN" ? "Bonos" : "Compra de Bonos"}
        </Typography>

        {role === "ADMIN" ? (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
          >
            Nuevo bono
          </Button>
        ) : null}
      </Box>

      {role === "ADMIN" ? (
        <Box sx={{ height: 700 }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            getRowId={(row) => row.id}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            loading={loading}
            initialState={{
              pagination: { paginationModel: { pageSize: 10, page: 0 } },
              sorting: { sortModel: [{ field: "nombre", sort: "asc" }] },
            }}
          />
        </Box>
      ) : (
        <StudentBonosView rows={rows} loading={loading} onBuy={handleBuy} />
      )}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{editingId ? "Editar bono" : "Nuevo bono"}</DialogTitle>
        <DialogContent sx={{ pt: 1, display: "grid", gap: 2 }}>
          <TextField
            sx={{ mt: 2 }}
            label="Nombre"
            fullWidth
            value={form.nombre}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, nombre: event.target.value }))
            }
          />
          <TextField
            label="Descripcion"
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
            label="Precio"
            type="number"
            fullWidth
            value={form.precio}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, precio: event.target.value }))
            }
            inputProps={{ min: 0, step: "0.01" }}
          />
          <TextField
            label="Validez en dias"
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
