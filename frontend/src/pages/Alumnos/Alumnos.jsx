import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Paper,
  Typography,
  Chip,
  CircularProgress,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import { alumnosService } from "../../services/alumnosService";
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

import DownloadIcon from "@mui/icons-material/Download";
import Menu from "@mui/material/Menu";

import { exportAlumnosExcel } from "../../utils/exportAlumnosExcel";

import { exportAlumnosPdf } from "../../utils/exportAlumnosPdf";

import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
} from "@mui/material";

const LICENCIAS_OPCIONES = [
  { value: "B", label: "B - Turismo" },
  { value: "A1", label: "A1 - Motocicletas" },
  { value: "A2", label: "A2 - Motocicletas" },
  { value: "A", label: "A - Motocicletas" },
  { value: "C", label: "C - Camión" },
  { value: "D", label: "D - Autobús" },
  { value: "E", label: "E - Remolques" },
];

const formatearFechaParaFormulario = (valor) => {
  if (!valor) {
    return "";
  }

  const texto = String(valor).trim();

  if (/^\d{2}[/-]\d{2}[/-]\d{4}$/.test(texto)) {
    const [dia, mes, anio] = texto.split(/[/-]/);
    return `${dia}/${mes}/${anio}`;
  }

  const fecha = new Date(texto);
  if (Number.isNaN(fecha.getTime())) {
    return "";
  }

  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const anio = String(fecha.getFullYear());

  return `${dia}/${mes}/${anio}`;
};

const limpiarDni = (valor) =>
  String(valor || "")
    .toUpperCase()
    .replace(/[^0-9A-Z]/g, "");

const normalizarDniFormulario = (valor) => {
  const limpio = limpiarDni(valor);
  const numeros = limpio.replace(/[^0-9]/g, "").slice(0, 8);
  const letra = limpio.replace(/[0-9]/g, "").slice(0, 1);

  return `${numeros}${letra}`;
};

const aplicarMascaraFecha = (valor) => {
  const digitos = String(valor || "")
    .replace(/\D/g, "")
    .slice(0, 8);

  if (digitos.length <= 2) {
    return digitos;
  }

  if (digitos.length <= 4) {
    return `${digitos.slice(0, 2)}/${digitos.slice(2)}`;
  }

  return `${digitos.slice(0, 2)}/${digitos.slice(2, 4)}/${digitos.slice(4)}`;
};

const esDniCompleto = (valor) => /^\d{8}[A-Z]$/.test(limpiarDni(valor));

const esFechaCompletaValida = (valor) => {
  const texto = String(valor || "").trim();

  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(texto)) {
    return false;
  }

  const [dia, mes, anio] = texto.split("/").map(Number);
  const fecha = new Date(anio, mes - 1, dia);

  return (
    fecha.getFullYear() === anio &&
    fecha.getMonth() === mes - 1 &&
    fecha.getDate() === dia
  );
};

// BUSCA ESTA FUNCIÓN Y REEMPLÁZALA COMPLETAMENTE:
const formatearFechaParaApi = (valor) => {
  const texto = String(valor || "").trim();

  // Si no cumple el patrón dd/mm/aaaa, devolvemos el valor original como fallback
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(texto)) {
    return texto;
  }

  const [dia, mes, anio] = texto.split("/");

  // 🌟 CAMBIO: Creamos un objeto Date de JavaScript en formato UTC neutro medianoche
  const fechaObjeto = new Date(
    Date.UTC(Number(anio), Number(mes) - 1, Number(dia)),
  );

  // Convertimos a string ISO (ej: "1986-01-31T00:00:00.000Z") que Prisma exige
  return fechaObjeto.toISOString();
};

export default function Alumnos() {
  const [rows, setRows] = useState([]);

  const [estadoFiltro, setEstadoFiltro] = useState("activos");

  const [profesorFiltro, setProfesorFiltro] = useState("");

  const [profesores, setProfesores] = useState([]);

  const [search, setSearch] = useState("");

  const loadProfesores = async () => {
    try {
      const data = await profesoresService.getAll();

      setProfesores(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadAlumnos();
  }, [estadoFiltro, profesorFiltro, search]);

  useEffect(() => {
    loadProfesores();
  }, []);

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

      if (profesorFiltro) {
        filteredData = filteredData.filter(
          (alumno) =>
            String(alumno.profesorAsignado?.id) === String(profesorFiltro),
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
      const nombre = newAlumno.nombre?.trim() || "";
      const email = newAlumno.email?.trim() || "";
      const telefono = newAlumno.telefono?.trim() || "";
      const dni = limpiarDni(newAlumno.dni);
      const fechaNacimiento = newAlumno.fechaNacimiento?.trim() || "";
      const dniValido = esDniCompleto(newAlumno.dni);
      const fechaValida = esFechaCompletaValida(fechaNacimiento);
      const tipoLicencia =
        newAlumno.tipoLicenciaObjetivo ?? newAlumno.tipoLicencia ?? "";

      if (
        !nombre ||
        !email ||
        !telefono ||
        !dni ||
        !fechaNacimiento ||
        !tipoLicencia
      ) {
        setNotification({
          open: true,
          message:
            "Todos los campos son obligatorios en el alta, incluyendo DNI y fecha de nacimiento",
          severity: "error",
        });
        return;
      }

      if (!dniValido) {
        setNotification({
          open: true,
          message: "El DNI está incompleto. Formato esperado: 12345678Z",
          severity: "error",
        });
        setFieldTouched((prev) => ({ ...prev, dni: true }));
        return;
      }

      if (!fechaValida) {
        setNotification({
          open: true,
          message:
            "La fecha de nacimiento está incompleta o es inválida. Formato esperado: dd/mm/aaaa",
          severity: "error",
        });
        setFieldTouched((prev) => ({ ...prev, fechaNacimiento: true }));
        return;
      }

      if (!editingId && !newAlumno.password?.trim()) {
        setNotification({
          open: true,
          message: "La contraseña es obligatoria en el alta de alumnos",
          severity: "error",
        });
        return;
      }

      const payload = {
        ...newAlumno,
        nombre,
        email,
        telefono,
        dni: dni.toUpperCase(),
        fechaNacimiento: formatearFechaParaApi(fechaNacimiento),
        tipoLicenciaObjetivo:
          newAlumno.tipoLicenciaObjetivo ?? newAlumno.tipoLicencia ?? "B",
      };

      delete payload.tipoLicencia;

      // En edición, si no se informa contraseña, se conserva la actual en BD.
      if (editingId && !payload.password?.trim()) {
        delete payload.password;
      }

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

      setFieldTouched({
        dni: false,
        fechaNacimiento: false,
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

  const handleDeactivate = async (row) => {
    const nombreAlumno = row?.usuario?.nombre || "este alumno";

    setConfirmDialog({
      open: true,
      action: "deactivate",
      alumnoId: row.id,
      alumnoNombre: nombreAlumno,
      title: "Confirmar desactivación",
      message: `Vas a desactivar a ${nombreAlumno} en la plataforma Autoescuela Eguzkilore. No podrá operar hasta su reactivación. ¿Deseas continuar?`,
    });
  };

  const handleActivate = async (row) => {
    const nombreAlumno = row?.usuario?.nombre || "este alumno";

    setConfirmDialog({
      open: true,
      action: "activate",
      alumnoId: row.id,
      alumnoNombre: nombreAlumno,
      title: "Confirmar activación",
      message: `Vas a reactivar a ${nombreAlumno} en la plataforma Autoescuela Eguzkilore. Recuperará acceso operativo de inmediato. ¿Deseas continuar?`,
    });
  };

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    action: null,
    alumnoId: null,
    alumnoNombre: "",
    title: "",
    message: "",
  });

  const closeConfirmDialog = () => {
    setConfirmDialog({
      open: false,
      action: null,
      alumnoId: null,
      alumnoNombre: "",
      title: "",
      message: "",
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmDialog.alumnoId || !confirmDialog.action) {
      closeConfirmDialog();
      return;
    }

    try {
      if (confirmDialog.action === "deactivate") {
        await alumnosService.deactivate(confirmDialog.alumnoId);
      }

      if (confirmDialog.action === "activate") {
        await alumnosService.activate(confirmDialog.alumnoId);
      }

      loadAlumnos();

      setNotification({
        open: true,
        message:
          confirmDialog.action === "deactivate"
            ? "Alumno desactivado correctamente"
            : "Alumno activado correctamente",
        severity: "success",
      });
    } catch (error) {
      console.error(error);

      setNotification({
        open: true,
        message:
          confirmDialog.action === "deactivate"
            ? "Error desactivando alumno"
            : "Error activando alumno",
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
      width: 120,

      renderCell: (params) => (
        <>
          <IconButton
            color="primary"
            onClick={(event) => {
              event.stopPropagation();
              handleEdit(params.row);
            }}
          >
            <EditIcon />
          </IconButton>

          {params.row.activo ? (
            <IconButton
              color="warning"
              onClick={(event) => {
                event.stopPropagation();
                handleDeactivate(params.row);
              }}
            >
              <ToggleOffIcon />
            </IconButton>
          ) : (
            <IconButton
              color="success"
              onClick={(event) => {
                event.stopPropagation();
                handleActivate(params.row);
              }}
            >
              <ToggleOnIcon />
            </IconButton>
          )}
        </>
      ),
    },
  ];

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [selectedAlumno, setSelectedAlumno] = useState(null);

  const [newAlumno, setNewAlumno] = useState({
    nombre: "",
    email: "",
    password: "",
    telefono: "",
    dni: "",
    fechaNacimiento: "",
    tipoLicencia: "B",
  });

  const [fieldTouched, setFieldTouched] = useState({
    dni: false,
    fechaNacimiento: false,
  });

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [exportAnchor, setExportAnchor] = useState(null);

  const dniIncompleto = fieldTouched.dni && !esDniCompleto(newAlumno.dni);
  const fechaIncompleta =
    fieldTouched.fechaNacimiento &&
    !esFechaCompletaValida(newAlumno.fechaNacimiento);

  const handleEdit = (row) => {
    setEditingId(row.id);

    setNewAlumno({
      nombre: row.usuario?.nombre || "",
      email: row.usuario?.email || "",
      password: "",
      telefono: row.usuario?.telefono || "",
      dni: normalizarDniFormulario(row.usuario?.dni || ""),
      fechaNacimiento: formatearFechaParaFormulario(row.fechaNacimiento),
      tipoLicencia: row.tipoLicenciaObjetivo || "B",
    });

    setFieldTouched({
      dni: false,
      fechaNacimiento: false,
    });

    setOpen(true);
  };

  const openExportMenu = (event) => {
    setExportAnchor(event.currentTarget);
  };

  const closeExportMenu = () => {
    setExportAnchor(null);
  };

  const handleExportExcel = () => {
    exportAlumnosExcel(rows);

    closeExportMenu();
  };

  const handleExportPdf = () => {
    exportAlumnosPdf(rows);

    closeExportMenu();
  };

  const handleOpenDetail = async (row) => {
    setOpenDetail(true);
    setLoadingDetail(true);
    setSelectedAlumno(row);

    try {
      const detalle = await alumnosService.getById(row.id);

      setSelectedAlumno(detalle);
    } catch (error) {
      console.error(error);

      setNotification({
        open: true,
        message: "No se pudo cargar el detalle del alumno",
        severity: "error",
      });
    } finally {
      setLoadingDetail(false);
    }
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

            setFieldTouched({
              dni: false,
              fechaNacimiento: false,
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

          {profesores.map((profesor) => (
            <MenuItem key={profesor.id} value={profesor.id}>
              {profesor.usuario?.nombre}
            </MenuItem>
          ))}
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
          onRowClick={(params) => handleOpenDetail(params.row)}
          localeText={{
            noRowsLabel: profesorFiltro
              ? "No hay alumnos asignados al profesor seleccionado"
              : "No hay alumnos disponibles",
          }}
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
            required
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
            required
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
            required={!editingId}
            type="password"
            helperText={
              editingId
                ? "Si la dejas vacía, se mantiene la contraseña actual."
                : "Mínimo 8 caracteres"
            }
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
            required
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
            required
            placeholder="12345678Z"
            value={newAlumno.dni}
            onChange={(e) =>
              setNewAlumno({
                ...newAlumno,
                dni: normalizarDniFormulario(e.target.value),
              })
            }
            onBlur={() =>
              setFieldTouched((prev) => ({
                ...prev,
                dni: true,
              }))
            }
            error={dniIncompleto}
            helperText={
              dniIncompleto
                ? "DNI incompleto. Introduce 8 números y 1 letra (ejemplo: 12345678Z)."
                : " "
            }
            inputProps={{ maxLength: 9 }}
          />

          <TextField
            margin="normal"
            fullWidth
            required
            type="text"
            label="Fecha de nacimiento"
            placeholder="dd/mm/aaaa"
            InputLabelProps={{ shrink: true }}
            value={newAlumno.fechaNacimiento}
            onChange={(e) =>
              setNewAlumno({
                ...newAlumno,
                fechaNacimiento: aplicarMascaraFecha(e.target.value),
              })
            }
            onBlur={() =>
              setFieldTouched((prev) => ({
                ...prev,
                fechaNacimiento: true,
              }))
            }
            error={fechaIncompleta}
            helperText={
              fechaIncompleta
                ? "Fecha incompleta o inválida. Usa el formato dd/mm/aaaa."
                : " "
            }
            inputProps={{ maxLength: 10 }}
          />

          <TextField
            margin="normal"
            fullWidth
            required
            select
            label="Licencia Objetivo"
            value={newAlumno.tipoLicencia}
            onChange={(e) =>
              setNewAlumno({
                ...newAlumno,
                tipoLicencia: e.target.value,
              })
            }
          >
            {LICENCIAS_OPCIONES.map((licencia) => (
              <MenuItem key={licencia.value} value={licencia.value}>
                {licencia.label}
              </MenuItem>
            ))}
          </TextField>
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

      <Dialog
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Detalle del Alumno</DialogTitle>

        <DialogContent>
          {loadingDetail ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                py: 4,
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Box
              sx={{
                display: "grid",
                gap: 2,
                mt: 2,
              }}
            >
              <TextField
                label="Nombre"
                value={selectedAlumno?.usuario?.nombre || ""}
                InputProps={{ readOnly: true }}
                fullWidth
              />

              <TextField
                label="Email"
                value={selectedAlumno?.usuario?.email || ""}
                InputProps={{ readOnly: true }}
                fullWidth
              />

              <TextField
                label="Teléfono"
                value={selectedAlumno?.usuario?.telefono || ""}
                InputProps={{ readOnly: true }}
                fullWidth
              />

              <TextField
                label="DNI"
                value={selectedAlumno?.usuario?.dni || ""}
                InputProps={{ readOnly: true }}
                fullWidth
              />

              <TextField
                label="Licencia Objetivo"
                value={selectedAlumno?.tipoLicenciaObjetivo || ""}
                InputProps={{ readOnly: true }}
                fullWidth
              />

              <TextField
                label="Horas Prácticas"
                value={selectedAlumno?.horasPracticasCompletadas ?? 0}
                InputProps={{ readOnly: true }}
                fullWidth
              />

              <TextField
                label="Profesor Asignado"
                value={
                  selectedAlumno?.profesorAsignado?.usuario?.nombre ||
                  "Sin asignar"
                }
                InputProps={{ readOnly: true }}
                fullWidth
              />

              <TextField
                label="Estado"
                value={selectedAlumno?.activo ? "Activo" : "Inactivo"}
                InputProps={{ readOnly: true }}
                fullWidth
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            onClick={() => {
              if (selectedAlumno) {
                setOpenDetail(false);
                handleEdit(selectedAlumno);
              }
            }}
          >
            Editar alumno
          </Button>

          <Button onClick={() => setOpenDetail(false)}>Cerrar</Button>
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
            color={confirmDialog.action === "deactivate" ? "error" : "success"}
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
