import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Paper,
  Grid,
  Typography,
  Chip,
  CircularProgress,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import { alumnosService } from "../../services/alumnosService";
import { profesoresService } from "../../services/profesoresService";

import EditIcon from "@mui/icons-material/Edit";

import { IconButton } from "@mui/material";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";

import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import Tooltip from "@mui/material/Tooltip"; // Asegúrate de importar el componente

import InputAdornment from "@mui/material/InputAdornment";
import CloseIcon from "@mui/icons-material/Close";

import DownloadIcon from "@mui/icons-material/Download";
import Menu from "@mui/material/Menu";

import { exportAlumnosExcel } from "../../utils/exportAlumnosExcel";

import { exportAlumnosPdf } from "../../utils/exportAlumnosPdf";

import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { LicenseChip } from "../../components/common/LicenseChip";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
  Checkbox,
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

const normalizarTelefono = (valor) =>
  String(valor || "")
    .replace(/\D/g, "")
    .slice(0, 9);

const esTelefonoValido = (valor) => /^\d{9}$/.test(String(valor || ""));

const esFechaParcialValida = (valor) => {
  const texto = String(valor || "").trim();

  if (!texto) {
    return true;
  }

  const partes = texto.split("/");

  if (partes.length > 3) {
    return false;
  }

  const [dia = "", mes = "", anio = ""] = partes;

  if (dia.length > 2 || mes.length > 2 || anio.length > 4) {
    return false;
  }

  if ((dia && !/^\d+$/.test(dia)) || (mes && !/^\d+$/.test(mes))) {
    return false;
  }

  if (dia.length === 1 && Number(dia) > 3) {
    return false;
  }

  if (dia.length === 2) {
    const dayNumber = Number(dia);
    if (dayNumber < 1 || dayNumber > 31) {
      return false;
    }
  }

  if (mes.length === 1 && Number(mes) > 1) {
    return false;
  }

  if (mes.length === 2) {
    const monthNumber = Number(mes);
    if (monthNumber < 1 || monthNumber > 12) {
      return false;
    }
  }

  return true;
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

const getEstadoAcademicoChip = (estado) => {
  const code = String(estado?.codigo || "").toUpperCase();

  if (["LICENCIA_OBTENIDA", "LICENCIA_APROBADA"].includes(code)) {
    return { label: estado?.label || "Licencia obtenida", color: "success" };
  }

  if (code === "PRACTICO_SUSPENSO") {
    return { label: estado?.label || "Práctico suspenso", color: "error" };
  }

  if (code === "TEORICO_APROBADO") {
    return { label: estado?.label || "Teórico aprobado", color: "info" };
  }

  if (code === "TEORICO_SUSPENSO") {
    return { label: estado?.label || "Teórico suspenso", color: "warning" };
  }

  return { label: estado?.label || "En formación", color: "default" };
};

const isLicenseObtainedState = (estado) =>
  ["LICENCIA_OBTENIDA", "LICENCIA_APROBADA"].includes(
    String(estado?.codigo || "").toUpperCase(),
  );

const formatDateLabel = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
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

const obtenerEstadoMatricula = (alumno) =>
  alumno?.matriculas?.[0]?.estado === "PAGADA" ? "PAGADA" : "PENDIENTE";

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
      let reassignmentNoticeShown = false;
      const nombre = newAlumno.nombre?.trim() || "";
      const email = newAlumno.email?.trim() || "";
      const telefono = newAlumno.telefono?.trim() || "";
      const dni = limpiarDni(newAlumno.dni);
      const fechaNacimiento = newAlumno.fechaNacimiento?.trim() || "";
      const dniValido = esDniCompleto(newAlumno.dni);
      const fechaValida = esFechaCompletaValida(fechaNacimiento);
      const telefonoValido = esTelefonoValido(telefono);
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

      if (!telefonoValido) {
        setNotification({
          open: true,
          message: "El teléfono debe tener exactamente 9 dígitos numéricos",
          severity: "error",
        });
        setFieldTouched((prev) => ({ ...prev, telefono: true }));
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

      let promocionesAplicables = promocionesElegibles;

      if (!editingId) {
        promocionesAplicables = await alumnosService.getEligiblePromotions({
          tipoLicenciaObjetivo: tipoLicencia,
          dni,
          fechaNacimiento: formatearFechaParaApi(fechaNacimiento),
          esEstudiante: Boolean(newAlumno.esEstudiante),
        });

        setPromocionesElegibles(promocionesAplicables);

        if (promocionesAplicables.length > 1 && !newAlumno.promocionId) {
          setNotification({
            open: true,
            message:
              "Hay varias promociones vigentes para esta licencia. Debes seleccionar una antes de confirmar el alta.",
            severity: "error",
          });
          return;
        }

        if (
          newAlumno.promocionId &&
          !promocionesAplicables.some(
            (promocion) => promocion.id === newAlumno.promocionId,
          )
        ) {
          setNotification({
            open: true,
            message:
              "La promoción seleccionada ya no es aplicable para este alumno.",
            severity: "error",
          });
          return;
        }
      }

      const promocionAsignada =
        newAlumno.promocionId ||
        (promocionesAplicables.length === 1 ? promocionesAplicables[0].id : "");

      const payload = {
        ...newAlumno,
        nombre,
        email,
        telefono,
        dni: dni.toUpperCase(),
        fechaNacimiento: formatearFechaParaApi(fechaNacimiento),
        tipoLicenciaObjetivo:
          newAlumno.tipoLicenciaObjetivo ?? newAlumno.tipoLicencia ?? "B",
        esEstudiante: Boolean(newAlumno.esEstudiante),
        promocionId: promocionAsignada || undefined,
      };

      delete payload.tipoLicencia;

      if (editingId) {
        delete payload.esEstudiante;
        payload.profesorAsignadoId = payload.profesorAsignadoId || null;
      } else {
        delete payload.profesorAsignadoId;
      }

      // En edición, si no se informa contraseña, se conserva la actual en BD.
      if (editingId && !payload.password?.trim()) {
        delete payload.password;
      }

      if (editingId) {
        const updated = await alumnosService.update(editingId, payload);

        const resumenReasignacion = updated?.reasignacionClases;

        if (resumenReasignacion?.totalFuturas > 0) {
          reassignmentNoticeShown = true;
          setNotification({
            open: true,
            message: `Cambio de profesor aplicado. Clases futuras: ${resumenReasignacion.totalFuturas}, reasignadas: ${resumenReasignacion.reasignadas}, canceladas por conflicto: ${resumenReasignacion.canceladas}.`,
            severity:
              resumenReasignacion.canceladas > 0 ? "warning" : "success",
          });
        }
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
        profesorAsignadoId: "",
        esEstudiante: false,
        promocionId: "",
      });

      setPromocionesElegibles([]);
      setProfesoresElegibles([]);
      setPuedeAsignarProfesor(false);
      setResumenPromocionOculto(false);

      setFieldTouched({
        dni: false,
        fechaNacimiento: false,
        telefono: false,
      });

      loadAlumnos();

      if (!(editingId && reassignmentNoticeShown)) {
        setNotification({
          open: true,
          message: editingId
            ? "Alumno actualizado correctamente"
            : "Alumno creado correctamente",
          severity: "success",
        });
      }
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
      renderCell: (params) => (
        <LicenseChip value={params.row.tipoLicenciaObjetivo} />
      ),
    },

    {
      field: "faseActual",
      headerName: "Fase",
      flex: 1.2,
      renderCell: (params) => (
        <Chip label={params.row.faseActual || "En formación"} size="small" />
      ),
    },

    {
      field: "horasPracticasCompletadas",
      headerName: "Horas Prácticas",
      flex: 1,
      valueGetter: (_, row) =>
        row.horasPracticasCompletadasTexto ||
        `${Number(row.horasPracticasCompletadas || 0).toFixed(2)} h`,
    },

    {
      field: "profesorAsignado",
      headerName: "Profesor",
      flex: 1,
      renderCell: (params) => {
        const matriculaPagada = obtenerEstadoMatricula(params.row) === "PAGADA";
        const sinProfesor = !params.row.profesorAsignado?.usuario?.nombre;
        const pendienteAsignar = matriculaPagada && sinProfesor;

        return (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              px: 1,
              backgroundColor: pendienteAsignar ? "#fff8d6" : "transparent",
              borderRadius: 1,
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontWeight: pendienteAsignar ? 700 : 400 }}
            >
              {params.row.profesorAsignado?.usuario?.nombre || "Sin asignar"}
            </Typography>
          </Box>
        );
      },
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
        </>
      ),
    },
  ];

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [selectedAlumno, setSelectedAlumno] = useState(null);
  const [extendedSummary, setExtendedSummary] = useState(null);
  const [showExtendedSummary, setShowExtendedSummary] = useState(false);
  const [promocionMatricula, setPromocionMatricula] = useState(null);
  const [resumenPromocionOculto, setResumenPromocionOculto] = useState(false);

  const [newAlumno, setNewAlumno] = useState({
    nombre: "",
    email: "",
    password: "",
    telefono: "",
    dni: "",
    fechaNacimiento: "",
    tipoLicencia: "B",
    profesorAsignadoId: "",
    esEstudiante: false,
    promocionId: "",
  });

  const [promocionesElegibles, setPromocionesElegibles] = useState([]);
  const [loadingPromociones, setLoadingPromociones] = useState(false);
  const [profesoresElegibles, setProfesoresElegibles] = useState([]);
  const [loadingProfesoresElegibles, setLoadingProfesoresElegibles] =
    useState(false);
  const [puedeAsignarProfesor, setPuedeAsignarProfesor] = useState(false);

  const [fieldTouched, setFieldTouched] = useState({
    dni: false,
    fechaNacimiento: false,
    telefono: false,
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
  const telefonoIncompleto =
    fieldTouched.telefono && !esTelefonoValido(newAlumno.telefono);

  const handleEdit = async (row) => {
    setEditingId(row.id);

    const matriculaActual = row?.matriculas?.[0] || null;
    const matriculaPagada = matriculaActual?.estado === "PAGADA";

    setNewAlumno({
      nombre: row.usuario?.nombre || "",
      email: row.usuario?.email || "",
      password: "",
      telefono: row.usuario?.telefono || "",
      dni: normalizarDniFormulario(row.usuario?.dni || ""),
      fechaNacimiento: formatearFechaParaFormulario(row.fechaNacimiento),
      tipoLicencia: row.tipoLicenciaObjetivo || "B",
      profesorAsignadoId: row.profesorAsignado?.id || "",
      esEstudiante: false,
      promocionId: "",
    });

    setPromocionesElegibles([]);
    setProfesoresElegibles([]);
    setPuedeAsignarProfesor(matriculaPagada);
    setResumenPromocionOculto(false);

    setFieldTouched({
      dni: false,
      fechaNacimiento: false,
      telefono: false,
    });

    setPromocionMatricula(row?.matriculas?.[0]?.promocion || null);

    setOpen(true);

    if (!matriculaPagada) {
      return;
    }

    setLoadingProfesoresElegibles(true);

    try {
      const elegibles = await alumnosService.getEligibleProfesores(row.id);
      setProfesoresElegibles(elegibles);
    } catch (error) {
      console.error(error);
      setProfesoresElegibles([]);
      setNotification({
        open: true,
        message:
          error.response?.data?.message ||
          "No se pudieron cargar los profesores elegibles",
        severity: "error",
      });
    } finally {
      setLoadingProfesoresElegibles(false);
    }
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

    try {
      const detalle = await alumnosService.getById(row.id);

      setSelectedAlumno(detalle);
      setPromocionMatricula(detalle?.matriculas?.[0]?.promocion || null);
      setExtendedSummary(null);
      setShowExtendedSummary(false);
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

  const cargarPromocionesElegibles = async () => {
    const licencia = newAlumno.tipoLicencia?.trim();
    const dni = limpiarDni(newAlumno.dni);
    const fechaNacimiento = newAlumno.fechaNacimiento?.trim();

    if (!licencia || !dni || !esFechaCompletaValida(fechaNacimiento)) {
      setPromocionesElegibles([]);
      return;
    }

    setLoadingPromociones(true);

    if (editingId && !puedeAsignarProfesor) {
      setResumenPromocionOculto(true);
      setPromocionMatricula(null);
    }

    try {
      const promociones = await alumnosService.getEligiblePromotions({
        tipoLicenciaObjetivo: licencia,
        dni,
        fechaNacimiento: formatearFechaParaApi(fechaNacimiento),
        esEstudiante: Boolean(newAlumno.esEstudiante),
      });

      setPromocionesElegibles(promociones);

      if (
        newAlumno.promocionId &&
        !promociones.some((promocion) => promocion.id === newAlumno.promocionId)
      ) {
        setNewAlumno((prev) => ({ ...prev, promocionId: "" }));
      }
    } catch (error) {
      console.error(error);
      setPromocionesElegibles([]);
      setNotification({
        open: true,
        message:
          error.response?.data?.message ||
          "No se pudieron evaluar las promociones elegibles",
        severity: "error",
      });
    } finally {
      setLoadingPromociones(false);
    }
  };

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
        Gestión de Alumnos
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Administra los perfiles, el estado de las matrículas y el progreso en
        los permisos de conducir de cada estudiante.
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
            setPromocionMatricula(null);
            setResumenPromocionOculto(false);

            setNewAlumno({
              nombre: "",
              email: "",
              password: "",
              telefono: "",
              dni: "",
              fechaNacimiento: "",
              tipoLicencia: "B",
              profesorAsignadoId: "",
              esEstudiante: false,
              promocionId: "",
            });

            setPromocionesElegibles([]);
            setProfesoresElegibles([]);
            setPuedeAsignarProfesor(false);

            setFieldTouched({
              dni: false,
              fechaNacimiento: false,
              telefono: false,
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

        <TextField
          select
          size="small"
          label="Buscar por profesor"
          value={profesorFiltro}
          onChange={(e) => setProfesorFiltro(e.target.value)}
          sx={{ width: 320 }}
        >
          <MenuItem value="">Todos los profesores</MenuItem>

          {profesores.map((profesor) => (
            <MenuItem key={profesor.id} value={profesor.id}>
              {profesor.usuario?.nombre}
            </MenuItem>
          ))}
        </TextField>

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
        maxWidth="md" // 🌟 Cambiado a 'md' para dar suficiente espacio a las dos columnas
      >
        <DialogTitle>
          {editingId ? "Editar Alumno" : "Crear Alumno"}
        </DialogTitle>

        <DialogContent>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, // 1 columna en móvil, 2 en pantallas 'sm' o superior
              gap: 3, // Espacio entre las dos columnas
              mt: 1,
            }}
          >
            {/* --- COLUMNA IZQUIERDA: FORMULARIO PRINCIPAL --- */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <TextField
                margin="none"
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
                margin="none"
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
                margin="none"
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
                margin="none"
                fullWidth
                label="Teléfono"
                required
                placeholder="600123123"
                value={newAlumno.telefono}
                onChange={(e) =>
                  setNewAlumno({
                    ...newAlumno,
                    telefono: normalizarTelefono(e.target.value),
                  })
                }
                onBlur={() =>
                  setFieldTouched((prev) => ({
                    ...prev,
                    telefono: true,
                  }))
                }
                error={telefonoIncompleto}
                helperText={
                  telefonoIncompleto
                    ? "Debe tener 9 dígitos numéricos"
                    : "Formato España: 9 dígitos"
                }
                inputProps={{
                  maxLength: 9,
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }}
              />

              <TextField
                margin="none"
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
                    ? "DNI incompleto. Introduce 8 números y 1 letra."
                    : undefined // Eliminado el espacio vacío " " para reducir la altura real
                }
                inputProps={{ maxLength: 9 }}
              />

              <TextField
                margin="none"
                fullWidth
                required
                type="text"
                label="Fecha de nacimiento"
                placeholder="dd/mm/aaaa"
                InputLabelProps={{ shrink: true }}
                value={newAlumno.fechaNacimiento}
                onChange={(e) => {
                  const masked = aplicarMascaraFecha(e.target.value);

                  if (!esFechaParcialValida(masked)) {
                    return;
                  }

                  setNewAlumno({
                    ...newAlumno,
                    fechaNacimiento: masked,
                  });
                }}
                onBlur={() =>
                  setFieldTouched((prev) => ({
                    ...prev,
                    fechaNacimiento: true,
                  }))
                }
                error={fechaIncompleta}
                helperText={
                  fechaIncompleta
                    ? "Fecha incompleta o inválida. Usa dd/mm/aaaa."
                    : undefined // Eliminado el espacio vacío " " para reducir la altura real
                }
                inputProps={{ maxLength: 10 }}
              />

              <TextField
                margin="none"
                fullWidth
                required
                select
                label="Licencia Objetivo"
                value={newAlumno.tipoLicencia}
                disabled={Boolean(editingId && puedeAsignarProfesor)}
                onChange={(e) =>
                  setNewAlumno({
                    ...newAlumno,
                    tipoLicencia: e.target.value,
                    promocionId: "",
                  })
                }
                helperText={
                  editingId && puedeAsignarProfesor
                    ? "No editable con matrícula pagada."
                    : ""
                }
              >
                {LICENCIAS_OPCIONES.map((licencia) => (
                  <MenuItem key={licencia.value} value={licencia.value}>
                    {licencia.label}
                  </MenuItem>
                ))}
              </TextField>

              {editingId && (
                <>
                  {!puedeAsignarProfesor && (
                    <Alert severity="info" sx={{ mt: 1 }}>
                      Solo se puede asignar profesor cuando la matrícula del
                      alumno está pagada.
                    </Alert>
                  )}

                  <TextField
                    margin="none"
                    fullWidth
                    select
                    label="Profesor Asignado"
                    value={newAlumno.profesorAsignadoId || ""}
                    disabled={
                      !puedeAsignarProfesor || loadingProfesoresElegibles
                    }
                    onChange={(e) =>
                      setNewAlumno((prev) => ({
                        ...prev,
                        profesorAsignadoId: e.target.value,
                      }))
                    }
                    helperText={
                      !puedeAsignarProfesor
                        ? "Matrícula pendiente de pago"
                        : "Solo se muestran profesores activos con permiso para esta licencia"
                    }
                  >
                    <MenuItem value="">Sin asignar</MenuItem>
                    {profesoresElegibles.map((profesor) => (
                      <MenuItem key={profesor.id} value={profesor.id}>
                        {profesor.usuario?.nombre}
                      </MenuItem>
                    ))}
                  </TextField>
                </>
              )}
            </Box>

            {/* --- COLUMNA DERECHA: SECCIÓN DE PROMOCIONES --- */}
            <Box>
              {!editingId ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mb: -0.5 }}
                  >
                    Promociones y Descuentos
                  </Typography>

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={Boolean(newAlumno.esEstudiante)}
                        onChange={(event) =>
                          setNewAlumno((prev) => ({
                            ...prev,
                            esEstudiante: event.target.checked,
                            promocionId: "",
                          }))
                        }
                      />
                    }
                    label="Acredita carnet de estudiante"
                  />

                  <Button
                    variant="outlined"
                    onClick={cargarPromocionesElegibles}
                    disabled={loadingPromociones}
                    fullWidth
                  >
                    {loadingPromociones
                      ? "Comprobando promociones..."
                      : "Comprobar promociones vigentes"}
                  </Button>

                  {promocionesElegibles.length > 0 && (
                    <Box
                      sx={{
                        mt: 1,
                        p: 2,
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        display: "grid",
                        gap: 1.5,
                        maxHeight: "260px", // Limita el alto del contenedor para que no estire el modal
                        overflowY: "auto", // Añade scroll interno si hay muchas tarjetas de descuento
                      }}
                    >
                      <Typography variant="caption" fontWeight="bold">
                        Promociones elegibles para este alta
                      </Typography>

                      {promocionesElegibles.map((promocion) => (
                        <Box
                          key={promocion.id}
                          sx={{
                            p: 1,
                            borderRadius: 1,
                            backgroundColor: "background.default",
                            border: "1px solid",
                            borderColor: "action.hover",
                          }}
                        >
                          <Typography variant="body2" fontWeight={700}>
                            {promocion.nombre}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            component="p"
                          >
                            {promocion.descripcion || "Sin descripción"}
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            Precio promoción: {promocion.precioPromocional} EUR
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            component="p"
                          >
                            Reglas:{" "}
                            {promocion.requiereCarnetEstudiante
                              ? "requiere carnet estudiante"
                              : "público general"}
                            {promocion.requiereFidelidad ? " + fidelidad" : ""}
                            {promocion.edadMinima !== null &&
                            promocion.edadMinima !== undefined
                              ? ` + edad mín. ${promocion.edadMinima}`
                              : ""}
                            {promocion.edadMaxima !== null &&
                            promocion.edadMaxima !== undefined
                              ? ` + edad máx. ${promocion.edadMaxima}`
                              : ""}
                          </Typography>
                        </Box>
                      ))}

                      <TextField
                        select
                        fullWidth
                        size="small"
                        label="Promoción a asignar"
                        value={newAlumno.promocionId}
                        onChange={(event) =>
                          setNewAlumno((prev) => ({
                            ...prev,
                            promocionId: event.target.value,
                          }))
                        }
                        helperText={
                          promocionesElegibles.length > 1
                            ? "Obligatorio seleccionar una promoción"
                            : "Si solo hay una promoción aplicable se asignará automáticamente"
                        }
                      >
                        {promocionesElegibles.length > 1 && (
                          <MenuItem value="">Seleccionar promoción...</MenuItem>
                        )}
                        {promocionesElegibles.map((promocion) => (
                          <MenuItem key={promocion.id} value={promocion.id}>
                            {promocion.nombre} - {promocion.precioPromocional}{" "}
                            EUR
                          </MenuItem>
                        ))}
                      </TextField>
                    </Box>
                  )}
                </Box>
              ) : (
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    backgroundColor: "background.paper",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ mb: 2 }}
                  >
                    Promoción asociada a la matrícula
                  </Typography>

                  {!puedeAsignarProfesor && (
                    <Box sx={{ display: "grid", gap: 1.5, mb: 2 }}>
                      <Alert severity="info">
                        La matrícula está pendiente. Si cambias la licencia,
                        puedes recalcular promociones antes de guardar.
                      </Alert>
                      <Button
                        variant="outlined"
                        onClick={cargarPromocionesElegibles}
                        disabled={loadingPromociones}
                      >
                        {loadingPromociones
                          ? "Comprobando promociones..."
                          : "Recalcular promociones para la licencia"}
                      </Button>

                      {promocionesElegibles.length > 0 ? (
                        <TextField
                          select
                          fullWidth
                          size="small"
                          label="Promoción a aplicar (opcional)"
                          value={newAlumno.promocionId || ""}
                          onChange={(event) =>
                            setNewAlumno((prev) => ({
                              ...prev,
                              promocionId: event.target.value,
                            }))
                          }
                          helperText="Si no eliges ninguna, se guardará la matrícula sin promoción"
                        >
                          <MenuItem value="">Sin promoción</MenuItem>
                          {promocionesElegibles.map((promocion) => (
                            <MenuItem key={promocion.id} value={promocion.id}>
                              {promocion.nombre} - {promocion.precioPromocional}{" "}
                              EUR
                            </MenuItem>
                          ))}
                        </TextField>
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          No hay promociones elegibles para la licencia
                          seleccionada.
                        </Typography>
                      )}
                    </Box>
                  )}

                  {resumenPromocionOculto ? (
                    <Alert severity="info">
                      La promoción anterior ha sido ocultada temporalmente.
                      Selecciona una nueva promoción (o deja sin promoción) y
                      pulsa Actualizar para guardar los cambios.
                    </Alert>
                  ) : promocionMatricula ? (
                    <>
                      <TextField
                        fullWidth
                        margin="dense"
                        label="Nombre de la promoción"
                        value={promocionMatricula.nombre || ""}
                        InputProps={{
                          readOnly: true,
                        }}
                      />

                      <TextField
                        fullWidth
                        margin="dense"
                        multiline
                        minRows={3}
                        label="Descripción"
                        value={promocionMatricula.descripcion || ""}
                        InputProps={{
                          readOnly: true,
                        }}
                      />

                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} md={4}>
                          <Box
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              bgcolor: "#f5f5f5",
                              textAlign: "center",
                              border: "1px solid #e0e0e0",
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                            >
                              Precio Base
                            </Typography>

                            <Typography variant="h6" fontWeight="bold">
                              {Number(
                                promocionMatricula.precioOriginal || 0,
                              ).toFixed(2)}{" "}
                              €
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <Box
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              bgcolor: "#e8f5e9",
                              textAlign: "center",
                              border: "1px solid #81c784",
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                            >
                              Precio Final
                            </Typography>

                            <Typography
                              variant="h6"
                              fontWeight="bold"
                              color="success.main"
                            >
                              {Number(
                                promocionMatricula.precioPromocional || 0,
                              ).toFixed(2)}{" "}
                              €
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <Box
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              bgcolor: "#fff8e1",
                              textAlign: "center",
                              border: "1px solid #ffcc80",
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                            >
                              Ahorro
                            </Typography>

                            <Typography
                              variant="h6"
                              fontWeight="bold"
                              color="warning.main"
                            >
                              {(
                                Number(promocionMatricula.precioOriginal || 0) -
                                Number(
                                  promocionMatricula.precioPromocional || 0,
                                )
                              ).toFixed(2)}{" "}
                              €
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>

                      <Chip
                        color="success"
                        sx={{
                          mt: 2,
                          fontWeight: "bold",
                        }}
                        label={`Descuento aplicado: ${(
                          Number(promocionMatricula.precioOriginal || 0) -
                          Number(promocionMatricula.precioPromocional || 0)
                        ).toFixed(2)} €`}
                      />

                      <Alert severity="success" sx={{ mt: 2 }}>
                        El alumno obtuvo un descuento de{" "}
                        <strong>
                          {(
                            Number(promocionMatricula.precioOriginal || 0) -
                            Number(promocionMatricula.precioPromocional || 0)
                          ).toFixed(2)}{" "}
                          €
                        </strong>{" "}
                        durante el alta de matrícula.
                      </Alert>
                    </>
                  ) : (
                    <Alert severity="info">
                      No existen promociones asignadas en el alta de matrícula
                      del alumno.
                    </Alert>
                  )}
                </Box>
              )}
            </Box>
          </Box>
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
            <Box sx={{ perspective: "1400px", mt: 2, minHeight: 620 }}>
              <Box
                sx={{
                  position: "relative",
                  minHeight: 620,
                  transition: "transform 700ms ease",
                  transformStyle: "preserve-3d",
                  transform: showExtendedSummary
                    ? "rotateY(180deg)"
                    : "rotateY(0deg)",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    backfaceVisibility: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        md: "1fr 1fr",
                      },
                      gap: 3,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      <TextField
                        label="Nombre"
                        value={selectedAlumno?.usuario?.nombre || ""}
                        InputProps={{ readOnly: true }}
                        sx={readOnlyFieldSx}
                        fullWidth
                      />

                      <TextField
                        label="Email"
                        value={selectedAlumno?.usuario?.email || ""}
                        InputProps={{ readOnly: true }}
                        sx={readOnlyFieldSx}
                        fullWidth
                      />

                      <TextField
                        label="Teléfono"
                        value={selectedAlumno?.usuario?.telefono || ""}
                        InputProps={{ readOnly: true }}
                        sx={readOnlyFieldSx}
                        fullWidth
                      />

                      <TextField
                        label="DNI"
                        value={selectedAlumno?.usuario?.dni || ""}
                        InputProps={{ readOnly: true }}
                        sx={readOnlyFieldSx}
                        fullWidth
                      />

                      <TextField
                        label="Licencia Objetivo"
                        value={selectedAlumno?.tipoLicenciaObjetivo || ""}
                        InputProps={{ readOnly: true }}
                        sx={readOnlyFieldSx}
                        fullWidth
                      />

                      <TextField
                        label="Horas Prácticas"
                        value={
                          selectedAlumno?.horasPracticasCompletadasTexto ||
                          `${Number(selectedAlumno?.horasPracticasCompletadas || 0).toFixed(2)} h`
                        }
                        InputProps={{ readOnly: true }}
                        sx={readOnlyFieldSx}
                        fullWidth
                      />

                      <TextField
                        label="Profesor Asignado"
                        value={
                          selectedAlumno?.profesorAsignado?.usuario?.nombre ||
                          "Sin asignar"
                        }
                        InputProps={{ readOnly: true }}
                        sx={readOnlyFieldSx}
                        fullWidth
                      />

                      <TextField
                        label="Estado"
                        value={selectedAlumno?.activo ? "Activo" : "Inactivo"}
                        InputProps={{ readOnly: true }}
                        sx={readOnlyFieldSx}
                        fullWidth
                      />

                      <Chip
                        label="Ver resumen académico y pagos"
                        color="primary"
                        variant="outlined"
                        clickable
                        onClick={async () => {
                          if (!selectedAlumno?.id) {
                            return;
                          }

                          if (!extendedSummary) {
                            const resumen =
                              await alumnosService.getExtendedSummary(
                                selectedAlumno.id,
                              );
                            setExtendedSummary(resumen);
                          }

                          setShowExtendedSummary(true);
                        }}
                        sx={{ width: "fit-content", fontWeight: 600 }}
                      />
                    </Box>

                    <Box>
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{ mb: 2 }}
                      >
                        Promoción asociada a la matrícula
                      </Typography>
                      {promocionMatricula ? (
                        <>
                          <TextField
                            fullWidth
                            margin="dense"
                            label="Nombre de la promoción"
                            value={promocionMatricula.nombre || ""}
                            InputProps={{
                              readOnly: true,
                            }}
                            sx={readOnlyFieldSx}
                          />

                          <TextField
                            fullWidth
                            margin="dense"
                            multiline
                            minRows={3}
                            label="Descripción"
                            value={promocionMatricula.descripcion || ""}
                            InputProps={{
                              readOnly: true,
                            }}
                            sx={readOnlyFieldSx}
                          />

                          <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12} md={4}>
                              <Box
                                sx={{
                                  p: 2,
                                  borderRadius: 2,
                                  bgcolor: "#f5f5f5",
                                  textAlign: "center",
                                  border: "1px solid #e0e0e0",
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  display="block"
                                >
                                  Precio Base
                                </Typography>

                                <Typography variant="h6" fontWeight="bold">
                                  {Number(
                                    promocionMatricula.precioOriginal || 0,
                                  ).toFixed(2)}{" "}
                                  €
                                </Typography>
                              </Box>
                            </Grid>

                            <Grid item xs={12} md={4}>
                              <Box
                                sx={{
                                  p: 2,
                                  borderRadius: 2,
                                  bgcolor: "#e8f5e9",
                                  textAlign: "center",
                                  border: "1px solid #81c784",
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  display="block"
                                >
                                  Precio Final
                                </Typography>

                                <Typography
                                  variant="h6"
                                  fontWeight="bold"
                                  color="success.main"
                                >
                                  {Number(
                                    promocionMatricula.precioPromocional || 0,
                                  ).toFixed(2)}{" "}
                                  €
                                </Typography>
                              </Box>
                            </Grid>

                            <Grid item xs={12} md={4}>
                              <Box
                                sx={{
                                  p: 2,
                                  borderRadius: 2,
                                  bgcolor: "#fff8e1",
                                  textAlign: "center",
                                  border: "1px solid #ffcc80",
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  display="block"
                                >
                                  Ahorro
                                </Typography>

                                <Typography
                                  variant="h6"
                                  fontWeight="bold"
                                  color="warning.main"
                                >
                                  {(
                                    Number(
                                      promocionMatricula.precioOriginal || 0,
                                    ) -
                                    Number(
                                      promocionMatricula.precioPromocional || 0,
                                    )
                                  ).toFixed(2)}{" "}
                                  €
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>

                          <Chip
                            color="success"
                            sx={{
                              mt: 2,
                              fontWeight: "bold",
                            }}
                            label={`Descuento aplicado: ${(
                              Number(promocionMatricula.precioOriginal || 0) -
                              Number(promocionMatricula.precioPromocional || 0)
                            ).toFixed(2)} €`}
                          />

                          <Alert severity="success" sx={{ mt: 2 }}>
                            El alumno obtuvo un descuento de{" "}
                            <strong>
                              {(
                                Number(promocionMatricula.precioOriginal || 0) -
                                Number(
                                  promocionMatricula.precioPromocional || 0,
                                )
                              ).toFixed(2)}{" "}
                              €
                            </strong>{" "}
                            durante el alta de matrícula.
                          </Alert>
                        </>
                      ) : (
                        <Alert severity="info">
                          No existen promociones asignadas en el alta de
                          matrícula del alumno.
                        </Alert>
                      )}
                    </Box>
                  </Box>
                </Box>

                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    borderRadius: 2,
                    p: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                    overflowY: "auto",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 1,
                      mb: 1.5,
                    }}
                  >
                    <Typography variant="h6" fontWeight={800}>
                      Resumen académico y pagos
                    </Typography>
                    <Chip
                      label="Volver al detalle"
                      color="primary"
                      clickable
                      onClick={() => setShowExtendedSummary(false)}
                    />
                  </Box>

                  {extendedSummary ? (
                    <Box sx={{ display: "grid", gap: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Typography variant="subtitle1" fontWeight={800}>
                            {extendedSummary.nombreCompleto}
                          </Typography>
                          {isLicenseObtainedState(
                            extendedSummary.estadoAcademico,
                          ) && (
                            <Box
                              sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 0.75,
                                px: 1,
                                py: 0.25,
                                borderRadius: 999,
                                bgcolor: "#fffbeb",
                                border: "1px solid #facc15",
                              }}
                            >
                              <EmojiEventsIcon
                                sx={{ color: "#ca8a04", fontSize: 16 }}
                              />
                              <Typography
                                variant="caption"
                                sx={{ color: "#854d0e", fontWeight: 800 }}
                              >
                                Medalla de oro
                              </Typography>
                              <Box
                                sx={{
                                  width: 20,
                                  height: 20,
                                  borderRadius: "50%",
                                  display: "grid",
                                  placeItems: "center",
                                  color: "#064e3b",
                                  bgcolor: "#d1fae5",
                                  border: "1px solid #34d399",
                                  fontWeight: 900,
                                }}
                              >
                                L
                              </Box>
                            </Box>
                          )}
                        </Box>
                        <Chip
                          size="small"
                          label={
                            getEstadoAcademicoChip(
                              extendedSummary.estadoAcademico,
                            ).label
                          }
                          color={
                            getEstadoAcademicoChip(
                              extendedSummary.estadoAcademico,
                            ).color
                          }
                        />
                      </Box>

                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: "#f8fafc",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          fontWeight={700}
                          sx={{ mb: 1 }}
                        >
                          Resumen académico
                        </Typography>

                        <Typography variant="body2">
                          Test de temario realizados:{" "}
                          {extendedSummary.testsTemario?.realizados ?? 0}
                        </Typography>
                        <Typography variant="body2">
                          Test aprobados:{" "}
                          {extendedSummary.testsTemario?.aprobados ?? 0} | Test
                          suspensos:{" "}
                          {extendedSummary.testsTemario?.suspendidos ?? 0} |
                          Porcentaje aprobados:{" "}
                          {extendedSummary.testsTemario?.porcentajeAprobados ??
                            0}
                          %
                        </Typography>

                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Test DGT realizados:{" "}
                          {extendedSummary.testsDgt?.realizados ?? 0}
                        </Typography>
                        <Typography variant="body2">
                          Test DGT aprobados:{" "}
                          {extendedSummary.testsDgt?.aprobados ?? 0} | Test DGT
                          suspensos:{" "}
                          {extendedSummary.testsDgt?.suspendidos ?? 0} |
                          Porcentaje aprobados:{" "}
                          {extendedSummary.testsDgt?.porcentajeAprobados ?? 0}%
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{ mt: 1, fontWeight: 700 }}
                        >
                          Convocatorias examen teórico
                        </Typography>
                        {(extendedSummary.examenTeoricoHistorial || [])
                          .length ? (
                          (extendedSummary.examenTeoricoHistorial || []).map(
                            (item) => (
                              <Typography
                                variant="body2"
                                key={`teorico-${item.id}`}
                              >
                                {formatDateLabel(item.fecha)} | {item.estado} |
                                Fallos/Aciertos: {item.fallos ?? "-"} /{" "}
                                {item.aciertos ?? "-"}
                              </Typography>
                            ),
                          )
                        ) : (
                          <Typography variant="body2">No presentado</Typography>
                        )}

                        <Typography
                          variant="body2"
                          sx={{ mt: 1, fontWeight: 700 }}
                        >
                          Convocatorias examen práctico
                        </Typography>
                        {(extendedSummary.examenPracticoHistorial || [])
                          .length ? (
                          (extendedSummary.examenPracticoHistorial || []).map(
                            (item) => (
                              <Typography
                                variant="body2"
                                key={`practico-${item.id}`}
                              >
                                {formatDateLabel(item.fecha)} | {item.estado} |
                                Faltas (L/D/E): {item.leves ?? "-"} /{" "}
                                {item.deficientes ?? "-"} /{" "}
                                {item.eliminatorias ?? "-"}
                              </Typography>
                            ),
                          )
                        ) : (
                          <Typography variant="body2">No presentado</Typography>
                        )}
                      </Box>

                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: "#fffaf0",
                          border: "1px solid #fde68a",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          fontWeight={700}
                          sx={{ mb: 1 }}
                        >
                          Resumen pagos
                        </Typography>

                        <Typography variant="body2">
                          Matrícula:{" "}
                          {extendedSummary.pagos?.matriculaPagada
                            ? "Pagada"
                            : "No pagada"}
                        </Typography>
                        <Typography variant="body2">
                          Promoción matrícula:{" "}
                          {extendedSummary.pagos?.promocionMatricula?.tiene
                            ? extendedSummary.pagos?.promocionMatricula?.nombre
                            : "Sin promoción"}
                        </Typography>
                        <Typography variant="body2">
                          Psicotécnico:{" "}
                          {extendedSummary.documentacion?.psicotecnicoEntregado
                            ? "Entregado"
                            : "No entregado"}
                        </Typography>
                        <Typography variant="body2">
                          Tasa DGT:{" "}
                          {extendedSummary.pagos?.tasaDgtEstado ===
                          "PENDIENTE_RENOVACION"
                            ? "Pendiente renovación"
                            : extendedSummary.pagos?.tasaDgtPagada
                              ? "Pagada"
                              : "No pagada"}
                        </Typography>
                        <Typography variant="body2">
                          Vidas restantes:{" "}
                          {extendedSummary.vidas?.restantes ?? 0}
                        </Typography>
                        <Typography variant="body2">
                          Pago examen práctico:{" "}
                          {extendedSummary.pagos?.pagoExamenPracticoPagado
                            ? "Pagado"
                            : "No pagado"}
                        </Typography>
                        <Typography variant="body2">
                          Bono clases:{" "}
                          {extendedSummary.bonoClases?.detalle?.nombre ||
                            "No tiene bonos comprados ni asociados"}
                          {extendedSummary.bonoClases?.detalle
                            ? ` | Caducidad: ${formatDateLabel(extendedSummary.bonoClases?.detalle?.fechaCaducidad)}`
                            : ""}
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: 300,
                      }}
                    >
                      <CircularProgress size={26} />
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
