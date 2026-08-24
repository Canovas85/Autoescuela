import { useEffect, useState } from "react";

import { Box, Button, Paper, Typography } from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import { alumnosService } from "../../services/alumnosService";

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

export default function Alumnos() {
  const [rows, setRows] = useState([]);

  const [estadoFiltro, setEstadoFiltro] = useState("activos");

  const [profesorFiltro, setProfesorFiltro] = useState("");

  const [search, setSearch] = useState("");

  useEffect(() => {
    loadAlumnos();
  }, [estadoFiltro, search]);

  const loadAlumnos = async () => {
    try {
      const data = await alumnosService.getAll();

      console.log("TOTAL ALUMNOS:", data.length);

      console.log(
        "TODOS LOS ALUMNOS:",
        data.map((a) => ({
          nombre: a.usuario?.nombre,
          activo: a.activo,
        })),
      );

      let filteredData = data;

      if (estadoFiltro === "activos") {
        filteredData = data.filter(
          (alumno) => (alumno.activo ?? true) === true,
        );
      }

      if (estadoFiltro === "inactivos") {
        filteredData = data.filter(
          (alumno) => (alumno.activo ?? true) === false,
        );
      }

      if (estadoFiltro === "todos") {
        filteredData = data;
      }

      if (search.trim() !== "") {
        const texto = search.toLowerCase();

        filteredData = filteredData.filter(
          (alumno) =>
            alumno.usuario?.nombre?.toLowerCase().includes(texto) ||
            alumno.usuario?.email?.toLowerCase().includes(texto) ||
            alumno.usuario?.telefono?.toLowerCase().includes(texto),
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

  const saveAlumno = async () => {
    try {
      const payload = {
        ...newAlumno,
        dni: newAlumno.dni?.trim().toUpperCase() || "",
        fechaNacimiento: newAlumno.fechaNacimiento || null,
        tipoLicenciaObjetivo:
          newAlumno.tipoLicenciaObjetivo ?? newAlumno.tipoLicencia ?? "B",
      };

      delete payload.tipoLicencia;

      if (editingId) {
        await alumnosService.update(editingId, payload);
      } else {
        await alumnosService.create(payload);
      }

      setOpen(false);

      setEditingId(null);

      setNewAlumno({
        nombre: "",
        email: "",
        password: "",
        telefono: "",
        dni: "",
        fechaNacimiento: "",
        tipoLicencia: "B",
      });

      loadAlumnos();

      setNotification({
        open: true,
        message: editingId
          ? "Alumno actualizado correctamente"
          : "Alumno creado correctamente",
        severity: "success",
      });
    } catch (error) {
      console.error(error);

      setNotification({
        open: true,
        message:
          error.response?.data?.message ||
          (editingId ? "Error modificando alumno" : "Error creando alumno"),
        severity: "error",
      });
    }
  };

  const handleDeactivate = async (id) => {
    try {
      const confirmar = window.confirm(
        "¿Seguro que deseas desactivar este alumno?",
      );

      if (!confirmar) {
        return;
      }

      await alumnosService.deactivate(id);

      loadAlumnos();

      setNotification({
        open: true,
        message: "Alumno desactivado correctamente",
        severity: "success",
      });
    } catch (error) {
      console.error(error);

      setNotification({
        open: true,
        message: "Error desactivando alumno",
        severity: "error",
      });
    }
  };

  const handleActivate = async (id) => {
    try {
      await alumnosService.activate(id);

      loadAlumnos();

      setNotification({
        open: true,
        message: "Alumno activado correctamente",
        severity: "success",
      });
    } catch (error) {
      console.error(error);

      setNotification({
        open: true,
        message: "Error activando alumno",
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
      field: "tipoLicenciaObjetivo",
      headerName: "Licencia",
      flex: 1,
    },

    {
      field: "horasPracticasCompletadas",
      headerName: "Horas Prácticas",
      flex: 1,
    },

    {
      field: "profesorAsignado",
      headerName: "Profesor",
      flex: 1,

      valueGetter: (_, row) =>
        row.profesorAsignado?.usuario?.nombre || "Sin asignar",
    },
    {
      field: "telefono",
      headerName: "Teléfono",
      flex: 1,

      valueGetter: (_, row) => row.usuario?.telefono || "",
    },
    {
      field: "activo",
      headerName: "Estado",
      width: 120,
      valueGetter: (_, row) => ((row.activo ?? true) ? "Activo" : "Inactivo"),
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

  const [newAlumno, setNewAlumno] = useState({
    nombre: "",
    email: "",
    password: "",
    telefono: "",
    dni: "",
    fechaNacimiento: "",
    tipoLicencia: "B",
  });

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleEdit = (row) => {
    setEditingId(row.id);

    setNewAlumno({
      nombre: row.usuario?.nombre || "",
      email: row.usuario?.email || "",
      password: "",
      telefono: row.usuario?.telefono || "",
      dni: row.usuario?.dni || "",
      fechaNacimiento: row.fechaNacimiento || "",
      tipoLicencia: row.tipoLicenciaObjetivo || "B",
    });

    setOpen(true);
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Gestión de Alumnos
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

            setNewAlumno({
              nombre: "",
              email: "",
              password: "",
              telefono: "",
              dni: "",
              fechaNacimiento: "",
              tipoLicencia: "B",
            });

            setOpen(true);
          }}
        >
          Nuevo Alumno
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
          label="Buscar alumno"
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
          {editingId ? "Editar Alumno" : "Crear Alumno"}
        </DialogTitle>

        <DialogContent>
          <TextField
            margin="normal"
            fullWidth
            label="Nombre"
            value={newAlumno.nombre}
            onChange={(e) =>
              setNewAlumno({
                ...newAlumno,
                nombre: e.target.value,
              })
            }
          />

          <TextField
            margin="normal"
            fullWidth
            label="Email"
            value={newAlumno.email}
            onChange={(e) =>
              setNewAlumno({
                ...newAlumno,
                email: e.target.value,
              })
            }
          />

          <TextField
            margin="normal"
            fullWidth
            label="Contraseña"
            type="password"
            value={newAlumno.password}
            onChange={(e) =>
              setNewAlumno({
                ...newAlumno,
                password: e.target.value,
              })
            }
          />

          <TextField
            margin="normal"
            fullWidth
            label="Teléfono"
            value={newAlumno.telefono}
            onChange={(e) =>
              setNewAlumno({
                ...newAlumno,
                telefono: e.target.value,
              })
            }
          />

          <TextField
            margin="normal"
            fullWidth
            label="DNI"
            value={newAlumno.dni}
            onChange={(e) =>
              setNewAlumno({
                ...newAlumno,
                dni: e.target.value,
              })
            }
          />

          <TextField
            margin="normal"
            fullWidth
            type="date"
            label="Fecha de nacimiento"
            InputLabelProps={{ shrink: true }}
            value={newAlumno.fechaNacimiento}
            onChange={(e) =>
              setNewAlumno({
                ...newAlumno,
                fechaNacimiento: e.target.value,
              })
            }
          />

          <TextField
            margin="normal"
            fullWidth
            label="Licencia Objetivo"
            value={newAlumno.tipoLicencia}
            onChange={(e) =>
              setNewAlumno({
                ...newAlumno,
                tipoLicencia: e.target.value,
              })
            }
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancelar
          </Button>

          <Button variant="contained" onClick={saveAlumno}>
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
