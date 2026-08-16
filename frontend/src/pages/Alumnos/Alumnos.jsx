import { useEffect, useState } from "react";

import { Box, Button, Paper, Typography } from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import { alumnosService } from "../../services/alumnosService";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { IconButton } from "@mui/material";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

export default function Alumnos() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    loadAlumnos();
  }, []);

  const loadAlumnos = async () => {
    try {
      const data = await alumnosService.getAll();

      setRows(data);
    } catch (error) {
      console.error(error);
    }
  };

  const saveAlumno = async () => {
    try {
      if (editingId) {
        await alumnosService.update(editingId, newAlumno);
      } else {
        await alumnosService.create(newAlumno);
      }

      setOpen(false);

      setEditingId(null);

      setNewAlumno({
        nombre: "",
        email: "",
        password: "",
        telefono: "",
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
      field: "acciones",
      headerName: "Acciones",
      width: 120,

      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>

          <IconButton
            color="error"
            onClick={() => handleDeactivate(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
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
      tipoLicencia: row.tipoLicenciaObjetivo || "B",
    });

    setOpen(true);
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Gestión de Alumnos
      </Typography>

      <Button
        variant="contained"
        sx={{ mb: 3 }}
        onClick={() => {
          setEditingId(null);

          setNewAlumno({
            nombre: "",
            email: "",
            password: "",
            telefono: "",
            tipoLicencia: "B",
          });

          setOpen(true);
        }}
      >
        Nuevo Alumno
      </Button>

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
