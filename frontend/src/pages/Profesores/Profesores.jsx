import { useEffect, useState } from "react";

import { Box, Button, Paper, Typography, Chip } from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import { profesoresService } from "../../services/profesoresService";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";

import { IconButton } from "@mui/material";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";

import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import InputAdornment from "@mui/material/InputAdornment";
import CloseIcon from "@mui/icons-material/Close";

import DownloadIcon from "@mui/icons-material/Download";
import Menu from "@mui/material/Menu";

import { exportProfesoresExcel } from "../../utils/exportProfesoresExcel";

import { exportProfesoresPdf } from "../../utils/exportProfesoresPdf";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
} from "@mui/material";

const normalizarDni = (valor) =>
  valor
    ?.toString()
    .toUpperCase()
    .replace(/[^0-9A-Z]/g, "") || "";

export default function Profesores() {
  const [rows, setRows] = useState([]);

  const [estadoFiltro, setEstadoFiltro] = useState("activos");

  const [search, setSearch] = useState("");

  const licencias = ["B", "A1", "A2", "A", "C", "D", "E"];

  const [exportAnchor, setExportAnchor] = useState(null);

  const openExportMenu = (event) => {
    setExportAnchor(event.currentTarget);
  };

  const closeExportMenu = () => {
    setExportAnchor(null);
  };

  const handleExportExcel = () => {
    exportProfesoresExcel(rows);
    closeExportMenu();
  };

  const handleExportPdf = () => {
    exportProfesoresPdf(rows);
    closeExportMenu();
  };

  useEffect(() => {
    loadProfesores();
  }, [estadoFiltro, search]);

  const loadProfesores = async () => {
    try {
      const data = await profesoresService.getAll();

      console.log("TOTAL ProfesorS:", data.length);

      console.log(
        "TODOS LOS ProfesorS:",
        data.map((a) => ({
          nombre: a.usuario?.nombre,
          activo: a.activo,
        })),
      );

      let filteredData = data;

      if (estadoFiltro === "activos") {
        filteredData = data.filter((Profesor) => Profesor.activo === true);
      }

      if (estadoFiltro === "inactivos") {
        filteredData = data.filter((Profesor) => Profesor.activo === false);
      }

      if (estadoFiltro === "todos") {
        filteredData = data;
      }

      if (search.trim() !== "") {
        const texto = search.toLowerCase();

        filteredData = filteredData.filter(
          (Profesor) =>
            Profesor.usuario?.nombre?.toLowerCase().includes(texto) ||
            Profesor.usuario?.email?.toLowerCase().includes(texto) ||
            Profesor.usuario?.telefono?.toLowerCase().includes(texto),
        );
      }

      console.log(
        "FILTRADOS:",
        filteredData.map((a) => ({
          nombre: a.usuario?.nombre,
          activo: a.activo,
        })),
      );

      setRows(filteredData);
    } catch (error) {
      console.error(error);
    }
  };

  const saveProfesor = async () => {
    try {
      const payloadBase = {
        nombre: nuevoProfesor.nombre?.trim() || "",
        email: nuevoProfesor.email?.trim() || "",
        telefono: nuevoProfesor.telefono?.trim() || "",
        permisosLicencias: nuevoProfesor.permisosLicencias,
        licenciaConducir: nuevoProfesor.permisosLicencias[0] || "",
        dni: normalizarDni(nuevoProfesor.dni),
      };

      if (editingId) {
        const payload = {
          nombre: payloadBase.nombre,
          email: payloadBase.email,
          dni: payloadBase.dni,
          telefono: payloadBase.telefono,
          licenciaConducir: payloadBase.licenciaConducir,
          permisosLicencias: payloadBase.permisosLicencias,
        };

        if (nuevoProfesor.password?.trim()) {
          payload.password = nuevoProfesor.password.trim();
        }

        await profesoresService.update(editingId, payload);
      } else {
        await profesoresService.create({
          ...payloadBase,
          password: nuevoProfesor.password || "",
        });
      }

      setOpen(false);

      setEditingId(null);

      setNuevoProfesor({
        nombre: "",
        email: "",
        password: "",
        dni: "",
        telefono: "",
        permisosLicencias: ["B"],
      });

      loadProfesores();

      setNotification({
        open: true,
        message: editingId
          ? "Profesor actualizado correctamente"
          : "Profesor creado correctamente",
        severity: "success",
      });
    } catch (error) {
      console.error(error);

      setNotification({
        open: true,
        message:
          error.response?.data?.message ||
          (editingId ? "Error modificando Profesor" : "Error creando Profesor"),
        severity: "error",
      });
    }
  };

  const handleDeactivate = async (row) => {
    const nombreProfesor = row?.usuario?.nombre || "este profesor";

    setConfirmDialog({
      open: true,
      action: "deactivate",
      profesorId: row.id,
      profesorNombre: nombreProfesor,
      title: "Confirmar desactivación",
      message: `Vas a desactivar a ${nombreProfesor} en la plataforma Autoescuela Eguzkilore. No podrá operar hasta su reactivación. ¿Deseas continuar?`,
    });
  };

  const handleActivate = async (row) => {
    const nombreProfesor = row?.usuario?.nombre || "este profesor";

    setConfirmDialog({
      open: true,
      action: "activate",
      profesorId: row.id,
      profesorNombre: nombreProfesor,
      title: "Confirmar activación",
      message: `Vas a reactivar a ${nombreProfesor} en la plataforma Autoescuela Eguzkilore. Recuperará acceso operativo de inmediato. ¿Deseas continuar?`,
    });
  };

  const handleDelete = async (row) => {
    const nombreProfesor = row?.usuario?.nombre || "este profesor";

    setConfirmDialog({
      open: true,
      action: "delete",
      profesorId: row.id,
      profesorNombre: nombreProfesor,
      title: "Confirmar eliminación",
      message: `Vas a eliminar definitivamente a ${nombreProfesor} de Autoescuela Eguzkilore. Toda la información asociada será eliminada de forma permanente. Esta acción no podrá deshacerse. ¿Deseas continuar?`,
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({
      open: false,
      action: null,
      profesorId: null,
      profesorNombre: "",
      title: "",
      message: "",
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmDialog.profesorId || !confirmDialog.action) {
      closeConfirmDialog();
      return;
    }

    try {
      if (confirmDialog.action === "deactivate") {
        await profesoresService.deactivate(confirmDialog.profesorId);
      }

      if (confirmDialog.action === "activate") {
        await profesoresService.activate(confirmDialog.profesorId);
      }

      if (confirmDialog.action === "delete") {
        await profesoresService.delete(confirmDialog.profesorId);
      }

      loadProfesores();

      setNotification({
        open: true,
        message:
          confirmDialog.action === "deactivate"
            ? "Profesor desactivado correctamente"
            : confirmDialog.action === "activate"
              ? "Profesor activado correctamente"
              : "Profesor eliminado correctamente",
        severity: "success",
      });
    } catch (error) {
      console.error(error);

      setNotification({
        open: true,
        message:
          confirmDialog.action === "deactivate"
            ? "Error desactivando profesor"
            : confirmDialog.action === "activate"
              ? "Error activando profesor"
              : "Error eliminando profesor",
        severity: "error",
      });
    } finally {
      closeConfirmDialog();
    }
  };

  const columns = [
    {
      field: "nombre",
      headerName: "Nombre",
      flex: 1,

      valueGetter: (_, row) => row.usuario?.nombre || "",
    },

    {
      field: "email",
      headerName: "Email",
      flex: 1.5,

      valueGetter: (_, row) => row.usuario?.email || "",
    },

    {
      field: "permisosLicencias",
      headerName: "Permisos",
      flex: 1.2,
      valueGetter: (_, row) =>
        Array.isArray(row.permisosLicencias) && row.permisosLicencias.length > 0
          ? row.permisosLicencias.join(", ")
          : row.licenciaConducir || "",
    },

    {
      field: "telefono",
      headerName: "Teléfono",
      flex: 1,
    },

    {
      field: "activo",
      headerName: "Estado",
      width: 130,
      renderCell: (params) => (
        <Chip
          label={(params.row.activo ?? true) ? "Activo" : "Inactivo"}
          color={(params.row.activo ?? true) ? "success" : "error"}
          size="small"
        />
      ),
    },

    {
      field: "acciones",
      headerName: "Acciones",
      width: 160,

      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>

          {params.row.activo ? (
            <IconButton
              color="warning"
              onClick={() => handleDeactivate(params.row)}
            >
              <ToggleOffIcon />
            </IconButton>
          ) : (
            <IconButton
              color="success"
              onClick={() => handleActivate(params.row)}
            >
              <ToggleOnIcon />
            </IconButton>
          )}

          <IconButton color="error" onClick={() => handleDelete(params.row)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [nuevoProfesor, setNuevoProfesor] = useState({
    nombre: "",
    email: "",
    password: "",
    dni: "",
    permisosLicencias: ["B"],
    telefono: "",
    activo: true,
  });

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    action: null,
    profesorId: null,
    profesorNombre: "",
    title: "",
    message: "",
  });

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleEdit = (row) => {
    setEditingId(row.id);

    setNuevoProfesor({
      nombre: row.usuario?.nombre || "",
      email: row.usuario?.email || "",
      password: "",
      dni: row.usuario?.dni || "",
      telefono: row.usuario?.telefono || "",
      permisosLicencias:
        Array.isArray(row.permisosLicencias) && row.permisosLicencias.length > 0
          ? row.permisosLicencias
          : [row.licenciaConducir || "B"],
    });

    setOpen(true);
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Gestión de Profesores
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          mb: 3,
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="contained"
          onClick={() => {
            setEditingId(null);

            setNuevoProfesor({
              nombre: "",
              email: "",
              password: "",
              dni: "",
              telefono: "",
              permisosLicencias: ["B"],
            });

            setOpen(true);
          }}
        >
          Nuevo Profesor
        </Button>

        <RadioGroup
          row
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value)}
        >
          <FormControlLabel
            value="activos"
            control={<Radio />}
            label="Activos"
          />

          <FormControlLabel
            value="inactivos"
            control={<Radio />}
            label="Inactivos"
          />

          <FormControlLabel value="todos" control={<Radio />} label="Todos" />
        </RadioGroup>

        <TextField
          size="small"
          label="Buscar profesor"
          placeholder="Nombre, email o teléfono"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 320 }}
          InputProps={{
            endAdornment: search && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearch("")}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={openExportMenu}
        >
          Exportar
        </Button>

        <Menu
          anchorEl={exportAnchor}
          open={Boolean(exportAnchor)}
          onClose={closeExportMenu}
        >
          <MenuItem onClick={handleExportExcel}>Exportar a Excel</MenuItem>

          <MenuItem onClick={handleExportPdf}>Exportar a PDF</MenuItem>
        </Menu>
      </Box>

      <Paper
        sx={{
          height: 600,
          p: 2,
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10, 25]}
        />
      </Paper>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editingId ? "Editar Profesor" : "Crear Profesor"}
        </DialogTitle>

        <DialogContent>
          <TextField
            margin="normal"
            fullWidth
            label="Nombre"
            value={nuevoProfesor.nombre}
            onChange={(e) =>
              setNuevoProfesor({
                ...nuevoProfesor,
                nombre: e.target.value,
              })
            }
          />

          <TextField
            margin="normal"
            fullWidth
            label="Email"
            value={nuevoProfesor.email}
            onChange={(e) =>
              setNuevoProfesor({
                ...nuevoProfesor,
                email: e.target.value,
              })
            }
          />

          <TextField
            margin="normal"
            fullWidth
            label="Contraseña"
            type="password"
            helperText={
              editingId
                ? "Si la dejas vacía, se mantiene la contraseña actual."
                : "Mínimo 8 caracteres"
            }
            value={nuevoProfesor.password}
            onChange={(e) =>
              setNuevoProfesor({
                ...nuevoProfesor,
                password: e.target.value,
              })
            }
          />

          <TextField
            margin="normal"
            fullWidth
            required
            label="DNI"
            placeholder="12345678Z"
            value={nuevoProfesor.dni}
            onChange={(e) =>
              setNuevoProfesor({
                ...nuevoProfesor,
                dni: normalizarDni(e.target.value),
              })
            }
          />

          <TextField
            margin="normal"
            fullWidth
            label="Teléfono"
            value={nuevoProfesor.telefono}
            onChange={(e) =>
              setNuevoProfesor({
                ...nuevoProfesor,
                telefono: e.target.value,
              })
            }
          />

          <Select
            fullWidth
            multiple
            value={nuevoProfesor.permisosLicencias}
            renderValue={(selected) => selected.join(", ")}
            onChange={(e) =>
              setNuevoProfesor({
                ...nuevoProfesor,
                permisosLicencias:
                  typeof e.target.value === "string"
                    ? e.target.value.split(",")
                    : e.target.value,
              })
            }
          >
            {licencias.map((e) => (
              <MenuItem key={e} value={e}>
                {e}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancelar
          </Button>

          <Button variant="contained" onClick={saveProfesor}>
            {editingId ? "Actualizar" : "Guardar"}
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
        autoHideDuration={4000}
        onClose={() =>
          setNotification({
            ...notification,
            open: false,
          })
        }
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          severity={notification.severity}
          variant="filled"
          onClose={() =>
            setNotification({
              ...notification,
              open: false,
            })
          }
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
