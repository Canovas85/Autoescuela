import { useEffect, useState } from "react";

import { Box, Button, Paper, Typography } from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import { profesoresService } from "../../services/profesoresService";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { IconButton } from "@mui/material";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";

import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import InputAdornment from "@mui/material/InputAdornment";
import CloseIcon from "@mui/icons-material/Close";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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

  const [profesorFiltro, setProfesorFiltro] = useState("");

  const [search, setSearch] = useState("");

  const licencias = ["B", "A1", "A2", "A", "C", "D", "E"];

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
        await profesoresService.update(editingId, {
          nombre: payloadBase.nombre,
          email: payloadBase.email,
          dni: payloadBase.dni,
          telefono: payloadBase.telefono,
          licenciaConducir: payloadBase.licenciaConducir,
          permisosLicencias: payloadBase.permisosLicencias,
        });
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

  const handleDeactivate = async (id) => {
    try {
      const confirmar = window.confirm(
        "¿Seguro que deseas desactivar este Profesor?",
      );

      if (!confirmar) {
        return;
      }

      await profesoresService.deactivate(id);

      loadProfesores();

      setNotification({
        open: true,
        message: "Profesor desactivado correctamente",
        severity: "success",
      });
    } catch (error) {
      console.error(error);

      setNotification({
        open: true,
        message: "Error desactivando Profesor",
        severity: "error",
      });
    }
  };

  const handleActivate = async (id) => {
    try {
      await profesoresService.activate(id);

      loadProfesores();

      setNotification({
        open: true,
        message: "Profesor activado correctamente",
        severity: "success",
      });
    } catch (error) {
      console.error(error);

      setNotification({
        open: true,
        message: "Error activando Profesor",
        severity: "error",
      });
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
      width: 120,
      valueGetter: (_, row) => (row.activo ? "Activo" : "Inactivo"),
    },

    {
      field: "acciones",
      headerName: "Acciones",
      width: 120,

      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>

          {params.row.activo ? (
            <IconButton
              color="error"
              onClick={() => handleDeactivate(params.row.id)}
            >
              <DeleteIcon />
            </IconButton>
          ) : (
            <IconButton
              color="success"
              onClick={() => handleActivate(params.row.id)}
            >
              <CheckCircleIcon />
            </IconButton>
          )}
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

        <Select
          size="small"
          value={profesorFiltro}
          onChange={(e) => setProfesorFiltro(e.target.value)}
          sx={{ minWidth: 220 }}
        >
          <MenuItem value="">Todos los profesores</MenuItem>
        </Select>

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
            disabled={Boolean(editingId)}
            helperText={
              editingId
                ? "No se modifica desde esta pantalla. Si está vacía, se mantiene la contraseña actual."
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
