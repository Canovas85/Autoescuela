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
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import DownloadIcon from "@mui/icons-material/Download";
import LockResetIcon from "@mui/icons-material/LockReset";

import { otrosUsuariosService } from "../../services/otrosUsuariosService";
import { exportOtrosUsuariosExcel } from "../../utils/exportOtrosUsuariosExcel";
import { exportOtrosUsuariosPdf } from "../../utils/exportOtrosUsuariosPdf";

const emptyForm = {
  nombre: "",
  email: "",
  password: "",
  dni: "",
  telefono: "",
  rol: "ADMINISTRATIVO",
};

const normalizarTelefono = (valor) =>
  String(valor || "")
    .replace(/\D/g, "")
    .slice(0, 9);

const limpiarDni = (valor) =>
  String(valor || "")
    .toUpperCase()
    .replace(/[^0-9A-Z]/g, "");

const esDniCompleto = (valor) => /^\d{8}[A-Z]$/.test(limpiarDni(valor));

const esTelefonoValido = (valor) => /^\d{9}$/.test(String(valor || ""));

export default function OtrosUsuarios() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const [rolFiltro, setRolFiltro] = useState("todos");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const [resetDialog, setResetDialog] = useState({
    open: false,
    usuarioId: null,
    nombre: "",
    motivo: "",
    newPassword: "",
  });

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    action: null,
    usuarioId: null,
    nombre: "",
    title: "",
    message: "",
  });

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const loadData = async () => {
    setLoading(true);

    try {
      const params = {
        search: search.trim() || undefined,
        rol: rolFiltro !== "todos" ? rolFiltro : undefined,
        activo:
          estadoFiltro === "todos"
            ? undefined
            : estadoFiltro === "activos"
              ? true
              : false,
      };

      const data = await otrosUsuariosService.getAll(params);
      setRows(Array.isArray(data) ? data : []);
    } catch (error) {
      setNotification({
        open: true,
        message:
          error.response?.data?.message || "No se pudieron cargar los usuarios",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, rolFiltro, estadoFiltro]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setOpenDialog(true);
  };

  const handleOpenEdit = (row) => {
    setEditingId(row.id);
    setForm({
      nombre: row.nombre || "",
      email: row.email || "",
      password: "",
      dni: row.dni || "",
      telefono: row.telefono || "",
      rol: row.rol || "ADMINISTRATIVO",
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    resetForm();
  };

  const saveUsuario = async () => {
    try {
      if (!form.nombre.trim()) {
        throw new Error("El nombre es obligatorio");
      }

      if (!form.email.trim()) {
        throw new Error("El email es obligatorio");
      }

      if (!esDniCompleto(form.dni)) {
        throw new Error("El DNI debe tener formato 12345678Z");
      }

      const telefono = normalizarTelefono(form.telefono);

      if (!esTelefonoValido(telefono)) {
        throw new Error("El teléfono debe tener 9 dígitos");
      }

      if (!editingId && String(form.password || "").length < 8) {
        throw new Error("La contraseña debe tener al menos 8 caracteres");
      }

      const payload = {
        nombre: form.nombre.trim(),
        email: form.email.trim(),
        dni: limpiarDni(form.dni),
        telefono,
        rol: form.rol,
      };

      if (form.password.trim()) {
        payload.password = form.password.trim();
      }

      if (editingId) {
        await otrosUsuariosService.update(editingId, payload);
      } else {
        await otrosUsuariosService.create({
          ...payload,
          password: form.password,
        });
      }

      setNotification({
        open: true,
        message: editingId
          ? "Usuario actualizado correctamente"
          : "Usuario creado correctamente",
        severity: "success",
      });

      handleCloseDialog();
      await loadData();
    } catch (error) {
      setNotification({
        open: true,
        message:
          error.response?.data?.message ||
          error.message ||
          "Error guardando usuario",
        severity: "error",
      });
    }
  };

  const askDeactivate = (row) => {
    setConfirmDialog({
      open: true,
      action: "deactivate",
      usuarioId: row.id,
      nombre: row.nombre,
      title: "Confirmar desactivación",
      message: `Vas a desactivar a ${row.nombre}. ¿Deseas continuar?`,
    });
  };

  const askActivate = (row) => {
    setConfirmDialog({
      open: true,
      action: "activate",
      usuarioId: row.id,
      nombre: row.nombre,
      title: "Confirmar activación",
      message: `Vas a activar a ${row.nombre}. ¿Deseas continuar?`,
    });
  };

  const closeConfirm = () => {
    setConfirmDialog({
      open: false,
      action: null,
      usuarioId: null,
      nombre: "",
      title: "",
      message: "",
    });
  };

  const handleConfirmAction = async () => {
    try {
      if (!confirmDialog.usuarioId) {
        return;
      }

      if (confirmDialog.action === "deactivate") {
        await otrosUsuariosService.deactivate(confirmDialog.usuarioId);
      }

      if (confirmDialog.action === "activate") {
        await otrosUsuariosService.activate(confirmDialog.usuarioId);
      }

      setNotification({
        open: true,
        message:
          confirmDialog.action === "activate"
            ? "Usuario activado correctamente"
            : "Usuario desactivado correctamente",
        severity: "success",
      });

      closeConfirm();
      await loadData();
    } catch (error) {
      setNotification({
        open: true,
        message:
          error.response?.data?.message || "No se pudo procesar la acción",
        severity: "error",
      });
    }
  };

  const openResetDialog = (row) => {
    setResetDialog({
      open: true,
      usuarioId: row.id,
      nombre: row.nombre,
      motivo: "",
      newPassword: "",
    });
  };

  const closeResetDialog = () => {
    setResetDialog({
      open: false,
      usuarioId: null,
      nombre: "",
      motivo: "",
      newPassword: "",
    });
  };

  const submitResetPassword = async () => {
    try {
      const response = await otrosUsuariosService.resetPassword(
        resetDialog.usuarioId,
        {
          motivo: resetDialog.motivo || undefined,
          newPassword: resetDialog.newPassword || undefined,
        },
      );

      setNotification({
        open: true,
        message: `Password reseteada. Temporal: ${response.passwordTemporal}`,
        severity: "success",
      });

      closeResetDialog();
      await loadData();
    } catch (error) {
      setNotification({
        open: true,
        message:
          error.response?.data?.message || "No se pudo resetear la contraseña",
        severity: "error",
      });
    }
  };

  const filteredRows = useMemo(() => rows, [rows]);

  const columns = [
    {
      field: "nombre",
      headerName: "Nombre",
      flex: 1.2,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1.4,
    },
    {
      field: "rol",
      headerName: "Perfil",
      flex: 0.9,
      renderCell: (params) => {
        // 1. Definimos los colores personalizados para cada rol
        const coloresPorRol = {
          SOPORTE: { fondo: "#e3f2fd", texto: "#0d47a1" }, // Azul claro y oscuro
          ADMINISTRATIVO: { fondo: "#fff3e0", texto: "#e65100" }, // Naranja claro y oscuro
        };

        // 2. Obtenemos los colores correspondientes o asignamos unos por defecto
        const estiloActual = coloresPorRol[params.value] || {
          fondo: "#f5f5f5",
          texto: "#333333",
        };

        return (
          <Chip
            label={params.value}
            size="small"
            sx={{
              backgroundColor: estiloActual.fondo,
              color: estiloActual.texto,
              fontWeight: "bold", // Opcional: para que resalte más el texto
            }}
          />
        );
      },
    },
    {
      field: "dni",
      headerName: "DNI",
      flex: 0.8,
      valueGetter: (_, row) => row.dni || "-",
    },
    {
      field: "telefono",
      headerName: "Teléfono",
      flex: 0.9,
      valueGetter: (_, row) => row.telefono || "-",
    },
    {
      field: "activo",
      headerName: "Estado",
      flex: 0.8,
      renderCell: (params) => (
        <Chip
          size="small"
          label={params.value ? "Activo" : "Inactivo"}
          color={params.value ? "success" : "error"}
        />
      ),
    },
    {
      field: "acciones",
      headerName: "Acciones",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      width: 220,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Editar" arrow>
            <IconButton
              color="primary"
              size="small"
              onClick={() => handleOpenEdit(params.row)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Reset password" arrow>
            <IconButton
              color="warning"
              size="small"
              onClick={() => openResetDialog(params.row)}
            >
              <LockResetIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {params.row.activo ? (
            <Tooltip title="Desactivar" arrow>
              <IconButton
                color="error"
                size="small"
                onClick={() => askDeactivate(params.row)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Activar" arrow>
              <IconButton
                color="success"
                size="small"
                onClick={() => askActivate(params.row)}
              >
                <ToggleOnIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
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
          gap: 2,
          mb: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Otros Usuarios
          </Typography>
          <Typography color="text.secondary">
            Gestión de perfiles ADMINISTRATIVO y SOPORTE.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={(e) => setExportAnchorEl(e.currentTarget)}
          >
            Exportar
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
          >
            Nuevo
          </Button>
        </Stack>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            fullWidth
            label="Buscar"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Nombre, email, DNI o teléfono"
          />

          <FormControl sx={{ minWidth: 220 }}>
            <InputLabel id="rol-filter-label">Perfil</InputLabel>
            <Select
              labelId="rol-filter-label"
              label="Perfil"
              value={rolFiltro}
              onChange={(event) => setRolFiltro(event.target.value)}
            >
              <MenuItem value="todos">Todos</MenuItem>
              <MenuItem value="ADMINISTRATIVO">ADMINISTRATIVO</MenuItem>
              <MenuItem value="SOPORTE">SOPORTE</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel id="estado-filter-label">Estado</InputLabel>
            <Select
              labelId="estado-filter-label"
              label="Estado"
              value={estadoFiltro}
              onChange={(event) => setEstadoFiltro(event.target.value)}
            >
              <MenuItem value="todos">Todos</MenuItem>
              <MenuItem value="activos">Activos</MenuItem>
              <MenuItem value="inactivos">Inactivos</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <DataGrid
          autoHeight
          rows={filteredRows}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
                page: 0,
              },
            },
          }}
        />
      </Paper>

      <Menu
        anchorEl={exportAnchorEl}
        open={Boolean(exportAnchorEl)}
        onClose={() => setExportAnchorEl(null)}
      >
        <MenuItem
          onClick={() => {
            exportOtrosUsuariosExcel(filteredRows);
            setExportAnchorEl(null);
          }}
        >
          Exportar Excel
        </MenuItem>
        <MenuItem
          onClick={() => {
            exportOtrosUsuariosPdf(filteredRows);
            setExportAnchorEl(null);
          }}
        >
          Exportar PDF
        </MenuItem>
      </Menu>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editingId ? "Editar usuario" : "Nuevo usuario"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 0.5 }}>
            <TextField
              label="Nombre"
              value={form.nombre}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, nombre: event.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, email: event.target.value }))
              }
              fullWidth
            />
            <TextField
              label={editingId ? "Nueva contraseña (opcional)" : "Contraseña"}
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, password: event.target.value }))
              }
              fullWidth
            />
            <TextField
              label="DNI"
              value={form.dni}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  dni: limpiarDni(event.target.value),
                }))
              }
              fullWidth
            />
            <TextField
              label="Teléfono"
              value={form.telefono}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  telefono: normalizarTelefono(event.target.value),
                }))
              }
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel id="rol-label">Perfil</InputLabel>
              <Select
                labelId="rol-label"
                label="Perfil"
                value={form.rol}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, rol: event.target.value }))
                }
              >
                <MenuItem value="ADMINISTRATIVO">ADMINISTRATIVO</MenuItem>
                <MenuItem value="SOPORTE">SOPORTE</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button variant="contained" onClick={saveUsuario}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDialog.open} onClose={closeConfirm}>
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{confirmDialog.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirm}>Cancelar</Button>
          <Button
            variant="contained"
            color={confirmDialog.action === "activate" ? "success" : "error"}
            onClick={handleConfirmAction}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={resetDialog.open}
        onClose={closeResetDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Reset de contraseña</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Se forzará cambio de contraseña en el próximo acceso para{" "}
            {resetDialog.nombre}.
          </DialogContentText>
          <Stack spacing={2}>
            <TextField
              label="Nueva contraseña temporal (opcional)"
              type="password"
              value={resetDialog.newPassword}
              onChange={(event) =>
                setResetDialog((prev) => ({
                  ...prev,
                  newPassword: event.target.value,
                }))
              }
              fullWidth
            />
            <TextField
              label="Motivo de reset (opcional)"
              value={resetDialog.motivo}
              onChange={(event) =>
                setResetDialog((prev) => ({
                  ...prev,
                  motivo: event.target.value,
                }))
              }
              fullWidth
              multiline
              minRows={2}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeResetDialog}>Cancelar</Button>
          <Button
            variant="contained"
            color="warning"
            onClick={submitResetPassword}
          >
            Resetear
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={4500}
        onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
          severity={notification.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
