import { useEffect, useMemo, useState } from "react";

import {
  Box,
  Button,
  Paper,
  Typography,
  Chip,
  CircularProgress,
  Stack,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import { profesoresService } from "../../services/profesoresService";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { LicenseChipList } from "../../components/common/LicenseChip";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import PersonIcon from "@mui/icons-material/Person";

import Tooltip from "@mui/material/Tooltip"; // Asegúrate de importar el componente

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
import {
  addDaysToDateKey,
  dateFromKeyAtNoon,
  extractDateKey,
  formatDateValue,
  getWeekDayIdFromValue,
} from "../../utils/calendarDate";

const normalizarDni = (valor) =>
  valor
    ?.toString()
    .toUpperCase()
    .replace(/[^0-9A-Z]/g, "") || "";

const normalizarTelefono = (valor) =>
  String(valor || "")
    .replace(/\D/g, "")
    .slice(0, 9);

const esTelefonoValido = (valor) => /^\d{9}$/.test(String(valor || ""));

const WEEK_DAYS = [
  { id: 1, label: "Lunes" },
  { id: 2, label: "Martes" },
  { id: 3, label: "Miercoles" },
  { id: 4, label: "Jueves" },
  { id: 5, label: "Viernes" },
  { id: 6, label: "Sabado" },
  { id: 7, label: "Domingo" },
];

const STUDENT_PALETTE = [
  {
    bg: "#e9f2ff",
    border: "#9cc6ff",
    title: "#1e3a8a",
  },
  {
    bg: "#fff3e6",
    border: "#ffd39f",
    title: "#92400e",
  },
  {
    bg: "#e8f9f1",
    border: "#98e4be",
    title: "#166534",
  },
  {
    bg: "#f1ecff",
    border: "#c5b2ff",
    title: "#5b21b6",
  },
  {
    bg: "#e8f7fb",
    border: "#93dff0",
    title: "#0f4f66",
  },
];

const formatAgendaDate = (value) => {
  const formatted = formatDateValue(value, {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

  return formatted || "-";
};

const formatAgendaDay = (value) => {
  const formatted = formatDateValue(value, {
    day: "numeric",
    month: "short",
  });

  return formatted || "-";
};

const formatHour = (value) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "--:--";
  }

  return date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const formatHourRange = (value, duracion = 45) => {
  const startDate = new Date(value);

  if (Number.isNaN(startDate.getTime())) {
    return "--:-- - --:--";
  }

  const endDate = new Date(startDate);
  endDate.setMinutes(endDate.getMinutes() + (Number(duracion) || 45));

  return `${formatHour(startDate)} - ${formatHour(endDate)}`;
};

const getColorByStudent = (studentId, studentName) => {
  const seed = String(studentId || studentName || "SIN_ALUMNO");
  let hash = 0;

  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }

  const index = Math.abs(hash) % STUDENT_PALETTE.length;
  return STUDENT_PALETTE[index];
};

const getAgendaStatusChipConfig = (status) => {
  const normalized = String(status || "").toUpperCase();

  if (normalized === "REGISTRADA") {
    return { label: "REGISTRADA", color: "success" };
  }

  if (normalized === "PENDIENTE_REGISTRO") {
    return { label: "PENDIENTE REGISTRO", color: "warning" };
  }

  if (normalized === "EN_CURSO") {
    return { label: "EN CURSO", color: "info" };
  }

  if (normalized === "CONFIRMADA") {
    return { label: "CONFIRMADA", color: "primary" };
  }

  if (normalized === "PROGRAMADA") {
    return { label: "PROGRAMADA", color: "default" };
  }

  return { label: normalized || "SIN ESTADO", color: "default" };
};

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
      const telefonoNormalizado = normalizarTelefono(nuevoProfesor.telefono);

      if (!esTelefonoValido(telefonoNormalizado)) {
        setNotification({
          open: true,
          message: "El teléfono debe tener exactamente 9 dígitos numéricos",
          severity: "error",
        });
        return;
      }

      const payloadBase = {
        nombre: nuevoProfesor.nombre?.trim() || "",
        email: nuevoProfesor.email?.trim() || "",
        telefono: telefonoNormalizado,
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

    try {
      const impacto = await profesoresService.getDeactivationImpact(row.id);

      if (!impacto?.alumnos?.length) {
        setConfirmDialog({
          open: true,
          action: "deactivate",
          profesorId: row.id,
          profesorNombre: nombreProfesor,
          title: "Confirmar desactivación",
          message: `Vas a desactivar a ${nombreProfesor} en la plataforma Autoescuela Eguzkilore. No podrá operar hasta su reactivación. ¿Deseas continuar?`,
        });
        return;
      }

      const reasignacionesIniciales = {};
      impacto.alumnos.forEach((item) => {
        reasignacionesIniciales[item.alumnoId] = "";
      });

      setReasignacionesProfesor(reasignacionesIniciales);
      setDeactivationModal({
        open: true,
        loading: false,
        profesor: impacto.profesor,
        alumnos: impacto.alumnos,
      });
    } catch (error) {
      setNotification({
        open: true,
        message:
          error.response?.data?.message ||
          "No se pudo cargar el impacto de desactivación del profesor",
        severity: "error",
      });
    }
  };

  const closeDeactivationModal = () => {
    setDeactivationModal({
      open: false,
      loading: false,
      profesor: null,
      alumnos: [],
    });
    setReasignacionesProfesor({});
  };

  const handleConfirmDeactivateWithReassignment = async () => {
    if (!deactivationModal.profesor?.id) {
      return;
    }

    const reasignaciones = [];

    for (const alumno of deactivationModal.alumnos) {
      const nuevoProfesorId = reasignacionesProfesor[alumno.alumnoId];

      if (!nuevoProfesorId) {
        setNotification({
          open: true,
          message:
            "Debes seleccionar un nuevo profesor para todos los alumnos asignados",
          severity: "error",
        });
        return;
      }

      reasignaciones.push({
        alumnoId: alumno.alumnoId,
        nuevoProfesorId,
      });
    }

    try {
      setDeactivationModal((prev) => ({ ...prev, loading: true }));
      await profesoresService.deactivateWithReassignment(
        deactivationModal.profesor.id,
        reasignaciones,
      );
      await loadProfesores();
      closeDeactivationModal();
      setNotification({
        open: true,
        message:
          "Profesor desactivado correctamente con reasignación obligatoria de alumnos y clases futuras",
        severity: "success",
      });
    } catch (error) {
      setNotification({
        open: true,
        message:
          error.response?.data?.message ||
          "No se pudo completar la desactivación con reasignación",
        severity: "error",
      });
    } finally {
      setDeactivationModal((prev) => ({ ...prev, loading: false }));
    }
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
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end", // Empuja los chips al fondo de la celda
            height: "100%", // Usa todo el alto disponible de la fila
            pb: 1.5, // Padding bottom opcional (8px) para separar del borde
          }}
        >
          <LicenseChipList
            values={
              Array.isArray(params.row.permisosLicencias) &&
              params.row.permisosLicencias.length > 0
                ? params.row.permisosLicencias
                : [params.row.licenciaConducir]
            }
          />
        </Box>
      ),
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
          <Tooltip title="Editar" arrow>
            <IconButton
              color="primary"
              onClick={(event) => {
                event.stopPropagation();
                handleEdit(params.row);
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={params.row.activo ? "Desactivar" : "Activar"} arrow>
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
          </Tooltip>

          <Tooltip title="Eliminar" arrow>
            <IconButton
              color="error"
              onClick={(event) => {
                event.stopPropagation();
                handleDelete(params.row);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [openDetail, setOpenDetail] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [selectedProfesor, setSelectedProfesor] = useState(null);
  const [detailView, setDetailView] = useState("PERFIL");
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [overviewData, setOverviewData] = useState(null);
  const [overviewWeekOffset, setOverviewWeekOffset] = useState(0);
  const [selectedAlumnoAgendaId, setSelectedAlumnoAgendaId] = useState("");

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

  const [deactivationModal, setDeactivationModal] = useState({
    open: false,
    loading: false,
    profesor: null,
    alumnos: [],
  });
  const [reasignacionesProfesor, setReasignacionesProfesor] = useState({});

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

  const handleOpenDetail = async (row) => {
    setOpenDetail(true);
    setLoadingDetail(true);
    setDetailView("PERFIL");
    setOverviewData(null);
    setOverviewWeekOffset(0);
    setSelectedAlumnoAgendaId("");

    try {
      const detalle = await profesoresService.getById(row.id);

      setSelectedProfesor(detalle);
    } catch (error) {
      console.error(error);

      setNotification({
        open: true,
        message: "No se pudo cargar el detalle del profesor",
        severity: "error",
      });
    } finally {
      setLoadingDetail(false);
    }
  };

  const loadOverview = async (profesorId, options = {}) => {
    if (!profesorId) {
      return;
    }

    const nextWeekOffset =
      options.weekOffset !== undefined
        ? options.weekOffset
        : overviewWeekOffset;
    const alumnoId = options.alumnoId || selectedAlumnoAgendaId || undefined;

    setOverviewLoading(true);

    try {
      const response = await profesoresService.getOverview(profesorId, {
        weekOffset: nextWeekOffset,
        alumnoId,
      });

      setOverviewData(response);
      setOverviewWeekOffset(nextWeekOffset);
      setSelectedAlumnoAgendaId(
        response?.agendaAlumno?.alumnoSeleccionadoId || "",
      );
    } catch (error) {
      setNotification({
        open: true,
        message:
          error.response?.data?.message ||
          "No se pudo cargar el bloque de alumnos y agenda",
        severity: "error",
      });
    } finally {
      setOverviewLoading(false);
    }
  };

  const openStudentsAndAgendaView = async () => {
    setDetailView("ALUMNOS_AGENDA");

    if (!selectedProfesor?.id) {
      return;
    }

    await loadOverview(selectedProfesor.id, {
      weekOffset: overviewWeekOffset,
      alumnoId: selectedAlumnoAgendaId || undefined,
    });
  };

  const agendaWeekDays = useMemo(() => {
    const weekStartKey = extractDateKey(
      overviewData?.agendaAlumno?.semana?.inicio,
    );

    if (!weekStartKey) {
      return WEEK_DAYS.map((day) => ({
        ...day,
        date: null,
      }));
    }

    return WEEK_DAYS.map((day, index) => {
      const dateKey = addDaysToDateKey(weekStartKey, index);
      return {
        ...day,
        date: dateFromKeyAtNoon(dateKey),
      };
    });
  }, [overviewData?.agendaAlumno?.semana?.inicio]);

  const agendaClassesByDay = useMemo(() => {
    const map = new Map();

    WEEK_DAYS.forEach((day) => {
      map.set(day.id, []);
    });

    const classes = overviewData?.agendaAlumno?.clases || [];

    classes.forEach((clase) => {
      const dayId = getWeekDayIdFromValue(clase.fecha);
      const list = map.get(dayId) || [];
      list.push(clase);
      map.set(dayId, list);
    });

    WEEK_DAYS.forEach((day) => {
      const sorted = (map.get(day.id) || []).sort(
        (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime(),
      );
      map.set(day.id, sorted);
    });

    return map;
  }, [overviewData?.agendaAlumno?.clases]);

  const readOnlyFieldSx = {
    "& .MuiInputBase-input": {
      cursor: "default",
      caretColor: "transparent",
      userSelect: "none",
    },
    "& .MuiOutlinedInput-root": {
      backgroundColor: "action.hover",
    },
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Gestión de Profesores
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Organiza los datos del personal docente, sus horarios de disponibilidad
        y las clases asignadas.
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
          height: 700,
          p: 2,
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
            sorting: { sortModel: [{ field: "nombre", sort: "asc" }] },
          }}
          onRowClick={(params) => handleOpenDetail(params.row)}
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
                telefono: normalizarTelefono(e.target.value),
              })
            }
            helperText="Formato España: 9 dígitos"
            inputProps={{
              maxLength: 9,
              inputMode: "numeric",
              pattern: "[0-9]*",
            }}
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
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Typography variant="h6" fontWeight={700}>
              Detalle del Profesor
            </Typography>

            <Button
              variant="outlined"
              size="small"
              startIcon={<CalendarMonthIcon />}
              onClick={
                detailView === "ALUMNOS_AGENDA"
                  ? () => setDetailView("PERFIL")
                  : openStudentsAndAgendaView
              }
              disabled={loadingDetail}
            >
              {detailView === "ALUMNOS_AGENDA"
                ? "Volver al detalle"
                : "Ver alumnos y agenda"}
            </Button>
          </Box>
        </DialogTitle>

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
            <Box sx={{ perspective: "1400px", mt: 1, minHeight: 620 }}>
              <Box
                sx={{
                  transition: "transform 700ms ease",
                  transformStyle: "preserve-3d",
                  transform:
                    detailView === "ALUMNOS_AGENDA"
                      ? "rotateY(180deg)"
                      : "rotateY(0deg)",
                }}
              >
                <Box
                  sx={{
                    transform:
                      detailView === "ALUMNOS_AGENDA"
                        ? "rotateY(180deg)"
                        : "rotateY(0deg)",
                  }}
                >
                  {detailView === "ALUMNOS_AGENDA" ? (
                    <Box sx={{ display: "grid", gap: 2 }}>
                      {overviewLoading ? (
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
                        <>
                          <Paper variant="outlined" sx={{ p: 2 }}>
                            <Typography
                              variant="subtitle1"
                              fontWeight={700}
                              sx={{ mb: 1 }}
                            >
                              Alumnos asignados
                            </Typography>

                            {overviewData?.alumnos?.length ? (
                              <Box
                                sx={{
                                  display: "grid",
                                  gridTemplateColumns: {
                                    xs: "1fr",
                                    md: "1fr 1fr",
                                  },
                                  gap: 1,
                                }}
                              >
                                {(overviewData?.alumnos || []).map((alumno) => {
                                  const isSelected =
                                    alumno.id ===
                                    overviewData?.agendaAlumno
                                      ?.alumnoSeleccionadoId;

                                  return (
                                    <Button
                                      key={alumno.id}
                                      variant={
                                        isSelected ? "contained" : "outlined"
                                      }
                                      onClick={() =>
                                        loadOverview(selectedProfesor?.id, {
                                          weekOffset: overviewWeekOffset,
                                          alumnoId: alumno.id,
                                        })
                                      }
                                      sx={{
                                        justifyContent: "space-between",
                                        textTransform: "none",
                                        py: 1,
                                        px: 1.5,
                                      }}
                                    >
                                      <Box sx={{ textAlign: "left" }}>
                                        <Typography fontWeight={700}>
                                          {alumno.nombre}
                                        </Typography>
                                      </Box>
                                      <Chip
                                        size="small"
                                        label={`Licencia ${alumno.licencia || "-"}`}
                                        color={isSelected ? "warning" : "info"}
                                      />
                                    </Button>
                                  );
                                })}
                              </Box>
                            ) : (
                              <Alert severity="info">
                                Este profesor no tiene alumnos asignados.
                              </Alert>
                            )}
                          </Paper>

                          <Paper variant="outlined" sx={{ p: 2 }}>
                            <Typography
                              variant="subtitle1"
                              fontWeight={700}
                              sx={{ mb: 1 }}
                            >
                              Clases del mes actual
                            </Typography>
                            <Box
                              sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}
                            >
                              <Chip
                                color="warning"
                                label={`Programadas: ${overviewData?.resumenMes?.programadas ?? 0}`}
                              />
                              <Chip
                                color="success"
                                label={`Realizadas: ${overviewData?.resumenMes?.realizadas ?? 0}`}
                              />
                            </Box>
                          </Paper>

                          <Paper variant="outlined" sx={{ p: 2 }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 1,
                                mb: 1.5,
                                flexWrap: "wrap",
                              }}
                            >
                              <Typography variant="subtitle1" fontWeight={700}>
                                Agenda semanal del alumno
                              </Typography>

                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    loadOverview(selectedProfesor?.id, {
                                      weekOffset: overviewWeekOffset - 1,
                                      alumnoId:
                                        overviewData?.agendaAlumno
                                          ?.alumnoSeleccionadoId,
                                    })
                                  }
                                >
                                  <NavigateBeforeIcon fontSize="small" />
                                </IconButton>

                                <Typography variant="body2" fontWeight={700}>
                                  {formatAgendaDate(
                                    overviewData?.agendaAlumno?.semana?.inicio,
                                  )}{" "}
                                  -{" "}
                                  {formatAgendaDate(
                                    overviewData?.agendaAlumno?.semana?.fin,
                                  )}
                                </Typography>

                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    loadOverview(selectedProfesor?.id, {
                                      weekOffset: overviewWeekOffset + 1,
                                      alumnoId:
                                        overviewData?.agendaAlumno
                                          ?.alumnoSeleccionadoId,
                                    })
                                  }
                                >
                                  <NavigateNextIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </Box>

                            {!overviewData?.agendaAlumno
                              ?.alumnoSeleccionadoId ? (
                              <Alert severity="info">
                                Selecciona un alumno para consultar su agenda
                                semanal.
                              </Alert>
                            ) : (
                              <Box
                                sx={{
                                  display: "grid",
                                  gridTemplateColumns: {
                                    xs: "1fr",
                                    md: "repeat(7, minmax(0, 1fr))",
                                  },
                                  gap: 1,
                                }}
                              >
                                {agendaWeekDays.map((day) => {
                                  const dayClasses =
                                    agendaClassesByDay.get(day.id) || [];

                                  return (
                                    <Box
                                      key={day.id}
                                      sx={{
                                        border: "1px solid #e2e8f0",
                                        borderRadius: 1,
                                        p: 1,
                                        minHeight: 180,
                                        backgroundColor: "#f8fafc",
                                      }}
                                    >
                                      <Typography
                                        fontWeight={700}
                                        variant="body2"
                                      >
                                        {day.label}
                                      </Typography>
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ display: "block", mb: 1 }}
                                      >
                                        {formatAgendaDay(day.date)}
                                      </Typography>

                                      <Stack spacing={0.8}>
                                        {dayClasses.length ? (
                                          dayClasses.map((clase) => (
                                            <Box
                                              key={clase.id}
                                              sx={{
                                                border: "1px solid",
                                                borderColor: getColorByStudent(
                                                  clase.alumno?.id,
                                                  clase.alumno?.nombre,
                                                ).border,
                                                borderRadius: 1.5,
                                                p: 0.9,
                                                bgcolor: getColorByStudent(
                                                  clase.alumno?.id,
                                                  clase.alumno?.nombre,
                                                ).bg,
                                              }}
                                            >
                                              <Typography
                                                variant="caption"
                                                fontWeight={700}
                                                sx={{
                                                  color: getColorByStudent(
                                                    clase.alumno?.id,
                                                    clase.alumno?.nombre,
                                                  ).title,
                                                }}
                                              >
                                                {formatHourRange(
                                                  clase.fecha,
                                                  clase.duracion,
                                                )}
                                              </Typography>

                                              <Stack
                                                direction="row"
                                                spacing={0.5}
                                                alignItems="center"
                                                sx={{ mt: 0.3 }}
                                              >
                                                <PersonIcon
                                                  sx={{
                                                    fontSize: 14,
                                                    color: getColorByStudent(
                                                      clase.alumno?.id,
                                                      clase.alumno?.nombre,
                                                    ).title,
                                                  }}
                                                />
                                                <Typography
                                                  variant="caption"
                                                  fontWeight={700}
                                                  sx={{
                                                    color: getColorByStudent(
                                                      clase.alumno?.id,
                                                      clase.alumno?.nombre,
                                                    ).title,
                                                  }}
                                                >
                                                  {clase.alumno?.nombre ||
                                                    "Alumno"}
                                                </Typography>
                                              </Stack>

                                              <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                sx={{
                                                  display: "block",
                                                  mt: 0.15,
                                                }}
                                              >
                                                {clase.vehiculo?.marca ||
                                                  "Vehículo"}{" "}
                                                {clase.vehiculo?.modelo || ""}
                                              </Typography>

                                              <Chip
                                                size="small"
                                                label={
                                                  clase.vehiculo?.matricula ||
                                                  "Sin matrícula"
                                                }
                                                sx={{
                                                  mt: 0.45,
                                                  height: 20,
                                                  fontSize: 10,
                                                  bgcolor: "#fff",
                                                  border: "1px solid #dbe5f2",
                                                }}
                                              />

                                              <Chip
                                                size="small"
                                                color={
                                                  getAgendaStatusChipConfig(
                                                    clase.estadoAgenda ||
                                                      clase.estado,
                                                  ).color
                                                }
                                                label={
                                                  getAgendaStatusChipConfig(
                                                    clase.estadoAgenda ||
                                                      clase.estado,
                                                  ).label
                                                }
                                                sx={{
                                                  mt: 0.45,
                                                  height: 20,
                                                  fontSize: 10,
                                                }}
                                              />
                                            </Box>
                                          ))
                                        ) : (
                                          <Typography
                                            variant="caption"
                                            color="text.secondary"
                                          >
                                            Sin clases
                                          </Typography>
                                        )}
                                      </Stack>
                                    </Box>
                                  );
                                })}
                              </Box>
                            )}
                          </Paper>
                        </>
                      )}
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
                        value={selectedProfesor?.usuario?.nombre || ""}
                        InputProps={{
                          readOnly: true,
                          tabIndex: -1,
                        }}
                        sx={readOnlyFieldSx}
                        fullWidth
                      />

                      <TextField
                        label="Email"
                        value={selectedProfesor?.usuario?.email || ""}
                        InputProps={{
                          readOnly: true,
                          tabIndex: -1,
                        }}
                        sx={readOnlyFieldSx}
                        fullWidth
                      />

                      <TextField
                        label="Teléfono"
                        value={selectedProfesor?.usuario?.telefono || ""}
                        InputProps={{
                          readOnly: true,
                          tabIndex: -1,
                        }}
                        sx={readOnlyFieldSx}
                        fullWidth
                      />

                      <TextField
                        label="DNI"
                        value={selectedProfesor?.usuario?.dni || ""}
                        InputProps={{
                          readOnly: true,
                          tabIndex: -1,
                        }}
                        sx={readOnlyFieldSx}
                        fullWidth
                      />

                      <TextField
                        label="Permisos"
                        value={
                          selectedProfesor?.permisosLicencias?.join(", ") || ""
                        }
                        InputProps={{
                          readOnly: true,
                          tabIndex: -1,
                        }}
                        sx={readOnlyFieldSx}
                        fullWidth
                      />

                      <TextField
                        label="Estado"
                        value={selectedProfesor?.activo ? "Activo" : "Inactivo"}
                        InputProps={{
                          readOnly: true,
                          tabIndex: -1,
                        }}
                        sx={readOnlyFieldSx}
                        fullWidth
                      />
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            onClick={() => {
              if (selectedProfesor) {
                setOpenDetail(false);
                handleEdit(selectedProfesor);
              }
            }}
            disabled={detailView === "ALUMNOS_AGENDA"}
          >
            Editar profesor
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
            color={confirmDialog.action === "activate" ? "success" : "error"}
            onClick={handleConfirmAction}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deactivationModal.open}
        onClose={deactivationModal.loading ? () => {} : closeDeactivationModal}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Reasignación obligatoria para desactivar profesor
        </DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 2, pt: 1 }}>
          <DialogContentText>
            Debes reasignar todos los alumnos asignados antes de desactivar al
            profesor {deactivationModal.profesor?.nombre || ""}. Al guardar, la
            reasignación también se aplicará a sus clases prácticas futuras.
          </DialogContentText>

          {deactivationModal.alumnos.map((alumno) => (
            <Box
              key={alumno.alumnoId}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                p: 2,
                display: "grid",
                gap: 1,
              }}
            >
              <Typography variant="body2" fontWeight={700}>
                {alumno.alumnoNombre} | Licencia {alumno.licencia}
              </Typography>

              <FormControl fullWidth size="small">
                <Select
                  value={reasignacionesProfesor[alumno.alumnoId] || ""}
                  displayEmpty
                  onChange={(event) =>
                    setReasignacionesProfesor((prev) => ({
                      ...prev,
                      [alumno.alumnoId]: event.target.value,
                    }))
                  }
                >
                  <MenuItem value="">
                    <em>Seleccionar profesor compatible</em>
                  </MenuItem>
                  {alumno.opciones.map((opcion) => (
                    <MenuItem key={opcion.id} value={opcion.id}>
                      {opcion.nombre} (
                      {(opcion.permisosLicencias || []).join(", ")})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={closeDeactivationModal}
            disabled={deactivationModal.loading}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDeactivateWithReassignment}
            disabled={deactivationModal.loading}
          >
            {deactivationModal.loading
              ? "Guardando..."
              : "Guardar y desactivar"}
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
