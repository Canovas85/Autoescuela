import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ViewListIcon from "@mui/icons-material/ViewList";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { convocatoriasTeoricoService } from "../../services/convocatoriasTeoricoService";
import Tooltip from "@mui/material/Tooltip";
import { LicenseChip } from "../../components/common/LicenseChip";
import { ExamTypeChip } from "../../components/common/ExamTypeChip";
import { StatusChip } from "../../components/common/StatusChip";
import { exportConvocatoriasTemplateExcel } from "../../utils/exportConvocatoriasTemplateExcel";
import {
  findMissingColumns,
  parseBooleanCell,
  parseDateCellToIso,
  readExcelRows,
} from "../../utils/excelImportUtils";

const WEEK_DAYS = ["L", "M", "X", "J", "V", "S", "D"];

const formatDateInput = (value) => {
  if (!value) return "";

  if (typeof value === "string") {
    const [datePart] = value.split("T");
    if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
      return datePart;
    }
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDate = (value) => {
  const dateKey = formatDateInput(value);
  if (!dateKey) return "-";

  const [year, month, day] = dateKey.split("-");
  return `${day}/${month}/${year}`;
};

const formatearEstado = (estado) => {
  if (!estado) return "";

  const estadoUpper = estado.toUpperCase();
  if (estadoUpper === "NO_APTO") return "No Apto";
  if (estadoUpper === "NO_PRESENTADO") return "No Presentado";

  // Para los demás estados, los pasa a minúsculas y el CSS se encarga de capitalizarlo
  return estado.toLowerCase();
};

const toLocalDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const buildMonthGrid = (viewDate) => {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const startOffset = (firstDay.getDay() + 6) % 7;
  const cells = [];

  for (let i = 0; i < startOffset; i += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(year, month, day));
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
};

const getEstadoChipColor = (estado) => {
  if (estado === "APTO") return "success";
  if (estado === "NO_APTO") return "error";
  return "inherit";
};

const DEFAULT_FORM = {
  fecha: "",
  licencia: "B",
  tipoExamen: "TEORICO",
  activo: true,
};

const LICENCIAS_APP = ["AM", "A1", "A2", "A", "B", "C", "D", "E"];
const ESTADOS_ALUMNO = [
  "SOLICITADO",
  "PROGRAMADO",
  "APTO",
  "NO_APTO",
  "NO_PRESENTADO",
  "CANCELADO",
  "PENDIENTE",
];

export default function ConvocatoriaExamen() {
  const [rows, setRows] = useState([]);
  const [agendaRows, setAgendaRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [openAgendaModal, setOpenAgendaModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedConvocatoria, setSelectedConvocatoria] = useState(null);
  const [selectedAgendaExam, setSelectedAgendaExam] = useState(null);
  const [openAgendaExamModal, setOpenAgendaExamModal] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    loading: false,
    row: null,
    impact: null,
  });
  const [form, setForm] = useState(DEFAULT_FORM);
  const [viewMode, setViewMode] = useState("TABLA");
  const [tipoFilter, setTipoFilter] = useState("ALL");
  const [licenciaFilter, setLicenciaFilter] = useState("ALL");
  const [activoFilter, setActivoFilter] = useState("ALL");
  const [estadoAlumnoFilter, setEstadoAlumnoFilter] = useState("ALL");
  const [viewDate, setViewDate] = useState(new Date());
  const [importingExcel, setImportingExcel] = useState(false);
  const importInputRef = useRef(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const loadRows = async () => {
    try {
      const params = {};

      if (tipoFilter !== "ALL") {
        params.tipoExamen = tipoFilter;
      }

      if (licenciaFilter !== "ALL") {
        params.licencia = licenciaFilter;
      }

      if (activoFilter !== "ALL") {
        params.activo = activoFilter;
      }

      if (estadoAlumnoFilter !== "ALL") {
        params.estadoAlumno = estadoAlumnoFilter;
      }

      const data = await convocatoriasTeoricoService.getAll(params);
      setRows(data || []);
    } catch (error) {
      setNotification({
        open: true,
        severity: "error",
        message:
          error.response?.data?.message ||
          "No se pudieron cargar las convocatorias",
      });
    }
  };

  const loadAgenda = async () => {
    try {
      const params = {
        year: viewDate.getFullYear(),
        month: viewDate.getMonth() + 1,
      };

      if (tipoFilter !== "ALL") {
        params.tipoExamen = tipoFilter;
      }

      if (licenciaFilter !== "ALL") {
        params.licencia = licenciaFilter;
      }

      if (activoFilter !== "ALL") {
        params.activo = activoFilter;
      }

      if (estadoAlumnoFilter !== "ALL") {
        params.estadoAlumno = estadoAlumnoFilter;
      }

      const data = await convocatoriasTeoricoService.getAgenda(params);
      setAgendaRows(data?.convocatorias || []);
    } catch (error) {
      setNotification({
        open: true,
        severity: "error",
        message: error.response?.data?.message || "No se pudo cargar la agenda",
      });
    }
  };

  useEffect(() => {
    loadRows();
  }, [tipoFilter, licenciaFilter, activoFilter, estadoAlumnoFilter]);

  useEffect(() => {
    if (viewMode === "AGENDA") {
      loadAgenda();
    }
  }, [
    viewMode,
    tipoFilter,
    licenciaFilter,
    activoFilter,
    estadoAlumnoFilter,
    viewDate,
  ]);

  const resetDialog = () => {
    setForm(DEFAULT_FORM);
    setEditingId(null);
  };

  const handleClose = () => {
    setOpen(false);
    resetDialog();
  };

  const handleCreate = () => {
    resetDialog();
    setOpen(true);
  };

  const handleImportExcel = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setImportingExcel(true);

      const rowsExcel = await readExcelRows(file);
      const missingColumns = findMissingColumns(rowsExcel[0] || {}, [
        "FECHA",
        "LICENCIA",
        "TIPO_EXAMEN",
      ]);

      if (missingColumns.length > 0) {
        throw new Error(
          `Faltan columnas obligatorias: ${missingColumns.join(", ")}.`,
        );
      }

      const errores = [];
      let creadas = 0;

      for (let idx = 0; idx < rowsExcel.length; idx += 1) {
        const row = rowsExcel[idx];
        const rowIndex = idx + 2;

        try {
          await convocatoriasTeoricoService.create({
            fecha: parseDateCellToIso(row.FECHA),
            licencia: String(row.LICENCIA || "")
              .trim()
              .toUpperCase(),
            tipoExamen: String(row.TIPO_EXAMEN || "")
              .trim()
              .toUpperCase(),
            activo: parseBooleanCell(row.ACTIVO, true),
          });

          creadas += 1;
        } catch (error) {
          errores.push(`Fila ${rowIndex}: ${error.message}`);
        }
      }

      await Promise.all([loadRows(), loadAgenda()]);

      setNotification({
        open: true,
        severity: errores.length > 0 ? "warning" : "success",
        message:
          errores.length > 0
            ? `Importación parcial: ${creadas} creadas, ${errores.length} con error. Primer error: ${errores[0]}`
            : `Importación completada: ${creadas} convocatoria(s) creada(s).`,
      });
    } catch (error) {
      setNotification({
        open: true,
        severity: "error",
        message: error?.message || "No se pudo importar el Excel.",
      });
    } finally {
      setImportingExcel(false);

      if (event.target) {
        event.target.value = "";
      }
    }
  };

  const handleEdit = (row) => {
    setEditingId(row.id);
    setForm({
      fecha: formatDateInput(row.fecha),
      licencia: row.licencia || "B",
      tipoExamen: row.tipoExamen || "TEORICO",
      activo: Boolean(row.activo),
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.fecha) {
      setNotification({
        open: true,
        severity: "warning",
        message: "La fecha es obligatoria",
      });
      return;
    }

    try {
      if (editingId) {
        await convocatoriasTeoricoService.update(editingId, form);
      } else {
        await convocatoriasTeoricoService.create(form);
      }

      setNotification({
        open: true,
        severity: "success",
        message: editingId
          ? "Convocatoria actualizada correctamente"
          : "Convocatoria creada correctamente",
      });
      handleClose();
      await Promise.all([loadRows(), loadAgenda()]);
    } catch (error) {
      setNotification({
        open: true,
        severity: "error",
        message:
          error.response?.data?.message || "No se pudo guardar la convocatoria",
      });
    }
  };

  const handleDeactivate = async (row) => {
    setDeleteDialog({
      open: true,
      loading: true,
      row,
      impact: null,
    });

    try {
      const impact = await convocatoriasTeoricoService.getDeleteImpact(row.id);

      setDeleteDialog({
        open: true,
        loading: false,
        row,
        impact,
      });
    } catch (error) {
      setDeleteDialog({
        open: false,
        loading: false,
        row: null,
        impact: null,
      });

      setNotification({
        open: true,
        severity: "error",
        message:
          error.response?.data?.message ||
          "No se pudo cargar el impacto de la eliminación",
      });
    }
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({
      open: false,
      loading: false,
      row: null,
      impact: null,
    });
  };

  const confirmDeactivate = async () => {
    if (!deleteDialog?.row?.id) {
      return;
    }

    setDeleteDialog((prev) => ({ ...prev, loading: true }));

    try {
      const response = await convocatoriasTeoricoService.remove(
        deleteDialog.row.id,
      );
      setNotification({
        open: true,
        severity: "success",
        message: response?.message || "Convocatoria desactivada correctamente",
      });
      closeDeleteDialog();
      await Promise.all([loadRows(), loadAgenda()]);
    } catch (error) {
      setDeleteDialog((prev) => ({ ...prev, loading: false }));
      setNotification({
        open: true,
        severity: "error",
        message:
          error.response?.data?.message ||
          "No se pudo desactivar la convocatoria",
      });
    }
  };

  const handleOpenAgendaConvocatoria = (convocatoria) => {
    setSelectedConvocatoria(convocatoria);
    setOpenAgendaModal(true);
  };

  const handleOpenAgendaExamModal = (row) => {
    setSelectedAgendaExam(row);
    setOpenAgendaExamModal(true);
  };

  const handleOpenTableConvocatoriaDetail = async (row) => {
    try {
      const date = new Date(row?.fecha);
      const params = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        tipoExamen: row?.tipoExamen || undefined,
        licencia: row?.licencia || undefined,
      };

      if (activoFilter !== "ALL") {
        params.activo = activoFilter;
      }

      if (estadoAlumnoFilter !== "ALL") {
        params.estadoAlumno = estadoAlumnoFilter;
      }

      const data = await convocatoriasTeoricoService.getAgenda(params);
      const convocatoria = (data?.convocatorias || []).find(
        (item) => item.id === row.id,
      );

      handleOpenAgendaConvocatoria(
        convocatoria || {
          ...row,
          alumnos: [],
        },
      );
    } catch (error) {
      setNotification({
        open: true,
        severity: "error",
        message:
          error.response?.data?.message ||
          "No se pudo cargar el detalle de la convocatoria",
      });
    }
  };

  const handleCloseAgendaExamModal = () => {
    setOpenAgendaExamModal(false);
    setSelectedAgendaExam(null);
  };

  const monthGrid = useMemo(() => buildMonthGrid(viewDate), [viewDate]);

  const agendaByDate = useMemo(() => {
    const map = new Map();

    agendaRows.forEach((row) => {
      const key = formatDateInput(row.fecha);

      if (!map.has(key)) {
        map.set(key, []);
      }

      map.get(key).push(row);
    });

    return map;
  }, [agendaRows]);

  const columns = useMemo(
    () => [
      {
        field: "fecha",
        headerName: "Fecha",
        flex: 1,
        valueGetter: (_, row) => formatDate(row.fecha),
      },
      {
        field: "licencia",
        headerName: "Licencia",
        width: 130,
        renderCell: (params) => <LicenseChip value={params.value} />,
      },
      {
        field: "tipoExamen",
        headerName: "Tipo",
        width: 150,
        renderCell: (params) => <ExamTypeChip value={params.value} />,
      },
      {
        field: "activo",
        headerName: "Estado",
        width: 150,
        renderCell: (params) => (
          <StatusChip label={params.value ? "Activa" : "Inactiva"} />
        ),
      },
      {
        field: "acciones",
        headerName: "Acciones",
        width: 160,
        sortable: false,
        renderCell: (params) => (
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Editar" arrow>
              <IconButton
                onClick={(event) => {
                  event.stopPropagation();
                  handleEdit(params.row);
                }}
                size="small"
                color="primary"
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar" arrow>
              <IconButton
                onClick={(event) => {
                  event.stopPropagation();
                  handleDeactivate(params.row);
                }}
                size="small"
                color="error"
                disabled={!params.row.activo}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
      },
    ],
    [],
  );

  const agendaColumns = [
    {
      field: "nombre",
      headerName: "Alumno",
      flex: 1,
      minWidth: 180,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 220,
    },
    {
      field: "licencia",
      headerName: "Licencia",
      width: 120,
      renderCell: (params) => <LicenseChip value={params.value} />,
    },
    {
      field: "tipoExamen",
      headerName: "Tipo examen",
      width: 150,
      renderCell: (params) => <ExamTypeChip value={params.value} />,
    },
    {
      field: "estado",
      headerName: "Estado",
      width: 130,
      renderCell: (params) => <StatusChip label={params.value} />,
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Convocatorias DGT de examen
          </Typography>

          <Typography color="text.secondary">
            Gestiona convocatorias teóricas y prácticas para cada licencia.
            Consulta la agenda mensual con alumnos confirmados para las
            convocatorias de examen.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} useFlexGap flexWrap="wrap">
          <Button
            variant="outlined" // Changed to outlined for a transparent background with custom colored borders and text
            onClick={handleCreate}
            sx={{
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase",
              borderRadius: "8px",
              padding: "10px 24px",

              // Deep blue text, borders, and icon baseline
              color: "#1e3a8a",
              borderColor: "#1e3a8a",
              backgroundColor: "transparent",

              // Triple layered shadow for the 3D relief effect (solid bottom ridge + ambient light glow)
              boxShadow: `
      0px 4px 0px #172554, 
      0px 8px 16px rgba(30, 58, 138, 0.15),
      inset 0px 1px 0px rgba(255, 255, 255, 0.1)
    `,

              // Smooth timing transition for clean feedback animations
              transition: "all 0.15s ease-in-out",

              // Forces the Material-UI startIcon to inherit the custom deep blue color dynamically
              "& .MuiButton-startIcon": {
                color: "inherit",
              },

              "&:hover": {
                // Swaps to a vivid tech-blue on mouse-over with a subtle background light
                color: "#2563eb",
                borderColor: "#2563eb",
                backgroundColor: "rgba(30, 58, 138, 0.04)",
                boxShadow: `
        0px 4px 0px #172554, 
        0px 12px 20px rgba(37, 99, 235, 0.25),
        inset 0px 1px 0px rgba(255, 255, 255, 0.2)
      `,
                transform: "translateY(-1px)", // Elevates slightly
              },

              "&:active": {
                // Immersive physical button press mechanism on click
                boxShadow: `
        0px 1px 0px #172554, 
        0px 2px 4px rgba(30, 58, 138, 0.2),
        inset 0px 2px 4px rgba(0, 0, 0, 0.05)
      `,
                transform: "translateY(3px)", // Pushes down exactly by the width of the bottom ridge
              },
            }}
          >
            Nueva convocatoria
          </Button>

          <TextField
            select
            size="small"
            label="Tipo"
            value={tipoFilter}
            onChange={(event) => setTipoFilter(event.target.value)}
            sx={{ minWidth: 170 }}
          >
            <MenuItem value="ALL">Todos</MenuItem>
            <MenuItem value="TEORICO">Teórico</MenuItem>
            <MenuItem value="PRACTICO">Práctico</MenuItem>
          </TextField>

          <TextField
            select
            size="small"
            label="Licencia"
            value={licenciaFilter}
            onChange={(event) => setLicenciaFilter(event.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="ALL">Todas</MenuItem>
            {LICENCIAS_APP.map((licencia) => (
              <MenuItem key={licencia} value={licencia}>
                {licencia}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            size="small"
            label="Estado convocatoria"
            value={activoFilter}
            onChange={(event) => setActivoFilter(event.target.value)}
            sx={{ minWidth: 210 }}
          >
            <MenuItem value="ALL">Todas</MenuItem>
            <MenuItem value="true">Activas</MenuItem>
            <MenuItem value="false">Inactivas</MenuItem>
          </TextField>

          <TextField
            select
            size="small"
            label="Estado alumnos"
            value={estadoAlumnoFilter}
            onChange={(event) => setEstadoAlumnoFilter(event.target.value)}
            sx={{
              minWidth: 210,
              "& .MuiSelect-select": { textTransform: "capitalize" },
            }}
          >
            <MenuItem value="ALL">Todos</MenuItem>
            {ESTADOS_ALUMNO.map((estado) => (
              <MenuItem
                key={estado}
                value={estado}
                sx={{ textTransform: "capitalize" }}
              >
                {formatearEstado(estado)}
              </MenuItem>
            ))}
          </TextField>

          <Button
            variant={viewMode === "TABLA" ? "contained" : "outlined"}
            startIcon={<ViewListIcon />}
            onClick={() => setViewMode("TABLA")}
          >
            Tabla
          </Button>

          <Button
            variant={viewMode === "AGENDA" ? "contained" : "outlined"}
            startIcon={<CalendarMonthIcon />}
            onClick={() => setViewMode("AGENDA")}
          >
            Agenda
          </Button>

          <Button
            variant="outlined"
            onClick={exportConvocatoriasTemplateExcel}
            sx={{
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase",
              borderRadius: "8px",
              padding: "10px 24px",

              // FUERZA EL BORDE: Contorno completo en color morado vibrante
              border: "1px solid",
              borderColor: "#6d28d9 !important", // Morado principal
              color: "#6d28d9",
              backgroundColor: "transparent",

              // Sombra de capas adaptada para relieve morado (borde inferior sólido + brillo ambiental)
              boxShadow: `
    0px 4px 0px #5b21b6, 
    0px 8px 16px rgba(109, 40, 217, 0.15),
    inset 0px 1px 0px rgba(255, 255, 255, 0.1)
  `,

              // Transición suave para las animaciones físicas
              transition: "all 0.15s ease-in-out",

              // Sincroniza el icono de Material-UI para que herede el color del texto automáticamente
              "& .MuiButton-startIcon": {
                color: "inherit",
              },

              "&:hover": {
                // Pasa a un tono morado más vivo con un fondo sutilmente iluminado
                color: "#8b5cf6",
                borderColor: "#8b5cf6 !important",
                backgroundColor: "rgba(109, 40, 217, 0.04)",
                boxShadow: `
      0px 4px 0px #5b21b6, 
      0px 12px 20px rgba(139, 92, 246, 0.25),
      inset 0px 1px 0px rgba(255, 255, 255, 0.2)
    `,
                transform: "translateY(-1px)", // Se eleva ligeramente
              },

              "&:active": {
                // Mecanismo físico de hundimiento real al hacer clic
                borderColor: "#6d28d9 !important",
                boxShadow: `
      0px 1px 0px #5b21b6, 
      0px 2px 4px rgba(109, 40, 217, 0.2),
      inset 0px 2px 4px rgba(0, 0, 0, 0.05)
    `,
                transform: "translateY(3px)", // Se desplaza hacia abajo el grosor exacto del relieve
              },
            }}
          >
            Descargar plantilla
          </Button>

          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUploadIcon />}
            disabled={importingExcel}
            sx={{
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase",
              borderRadius: "8px",
              padding: "10px 24px",
              cursor: "pointer",

              // Texto, borde e icono base en color verde
              color: "#16a34a", // Tailwind green-600
              borderColor: "#16a34a",
              backgroundColor: "transparent",

              // Sombra de capas adaptada para relieve verde (borde inferior sólido + brillo ambiental)
              boxShadow: `
      0px 4px 0px #15803d, 
      0px 8px 16px rgba(22, 163, 74, 0.15),
      inset 0px 1px 0px rgba(255, 255, 255, 0.1)
    `,

              // Transición suave para las animaciones físicas
              transition: "all 0.15s ease-in-out",

              // Sincroniza el icono de Material-UI para que herede el color del texto automáticamente
              "& .MuiButton-startIcon": {
                color: "inherit",
              },

              "&:hover": {
                // Pasa a un tono verde más vivo con un fondo sutilmente iluminado
                color: "#15803d", // Tailwind green-700
                borderColor: "#15803d",
                backgroundColor: "rgba(22, 163, 74, 0.04)",
                boxShadow: `
        0px 4px 0px #15803d, 
        0px 12px 20px rgba(21, 128, 61, 0.25),
        inset 0px 1px 0px rgba(255, 255, 255, 0.2)
      `,
                transform: "translateY(-1px)", // Se eleva ligeramente
              },

              "&:active": {
                // Mecanismo físico de hundimiento real al hacer clic
                boxShadow: `
        0px 1px 0px #15803d, 
        0px 2px 4px rgba(22, 163, 74, 0.2),
        inset 0px 2px 4px rgba(0, 0, 0, 0.05)
      `,
                transform: "translateY(3px)", // Se desplaza hacia abajo el grosor exacto del relieve
              },

              // Estilos cuando el botón está deshabilitado (importingExcel === true)
              "&.Mui-disabled": {
                boxShadow: "none",
                transform: "none",
                color: "#9ca3af",
                borderColor: "#d1d5db",
                backgroundColor: "#f3f4f6",
              },
            }}
          >
            {importingExcel ? "Importando..." : "Importar Excel"}
            <input
              ref={importInputRef}
              hidden
              type="file"
              accept=".xlsx,.xls"
              onChange={handleImportExcel}
            />
          </Button>
        </Stack>
      </Box>

      {viewMode === "TABLA" ? (
        <Box sx={{ height: 700 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => row.id}
            disableRowSelectionOnClick
            onRowClick={(params) =>
              handleOpenTableConvocatoriaDetail(params.row)
            }
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                  page: 0,
                },
              },
              sorting: {
                sortModel: [{ field: "fecha", sort: "asc" }],
              },
            }}
          />
        </Box>
      ) : (
        <Box sx={{ border: "1px solid #e2e8f0", borderRadius: 2, p: 2 }}>
          <Stack
            direction="row"
            spacing={1}
            justifyContent="flex-end"
            sx={{ mb: 1.5 }}
          >
            <Button
              size="small"
              variant="outlined"
              onClick={() => {
                const prev = new Date(viewDate);
                prev.setMonth(prev.getMonth() - 1);
                setViewDate(prev);
              }}
            >
              Mes anterior
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => {
                const next = new Date(viewDate);
                next.setMonth(next.getMonth() + 1);
                setViewDate(next);
              }}
            >
              Mes siguiente
            </Button>
          </Stack>

          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
            {viewDate.toLocaleDateString("es-ES", {
              month: "long",
              year: "numeric",
            })}
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
              gap: 1,
            }}
          >
            {WEEK_DAYS.map((label) => (
              <Box
                key={label}
                sx={{
                  textAlign: "center",
                  fontWeight: 700,
                  color: "text.secondary",
                }}
              >
                {label}
              </Box>
            ))}

            {monthGrid.map((cell, index) => {
              if (!cell) {
                return (
                  <Box
                    key={`empty-${index}`}
                    sx={{ minHeight: 90, border: "1px dashed #e2e8f0" }}
                  />
                );
              }

              const key = toLocalDateKey(cell);
              const items = agendaByDate.get(key) || [];

              return (
                <Box
                  key={key}
                  sx={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 1,
                    p: 0.75,
                    minHeight: 90,
                    backgroundColor:
                      items.length > 0 ? "#f8fafc" : "transparent",
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    {cell.getDate()}
                  </Typography>

                  <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                    {items.map((item) => (
                      <Button
                        key={item.id}
                        size="small"
                        variant="outlined"
                        onClick={() => handleOpenAgendaConvocatoria(item)}
                        sx={{
                          justifyContent: "flex-start",
                          minHeight: 24,
                          fontSize: 11,
                          px: 0.75,
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={0.5}
                          alignItems="center"
                        >
                          <ExamTypeChip value={item.tipoExamen} size="small" />
                          <LicenseChip value={item.licencia} size="small" />
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: 700 }}
                          >
                            ({item.totalAlumnos || 0})
                          </Typography>
                        </Stack>
                      </Button>
                    ))}
                  </Stack>
                </Box>
              );
            })}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body2" color="text.secondary">
            Pulsa sobre una convocatoria para ver alumnos asignados. En fechas
            pasadas se incluyen tambien estados APTO y NO_APTO.
          </Typography>
        </Box>
      )}

      <Dialog
        open={deleteDialog.open}
        onClose={deleteDialog.loading ? () => {} : closeDeleteDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Confirmar eliminación de convocatoria</DialogTitle>
        <DialogContent sx={{ pt: "12px !important" }}>
          <Stack spacing={1.25}>
            <Typography>
              Vas a desactivar la convocatoria{" "}
              <strong>
                {deleteDialog?.impact?.convocatoria?.tipoExamen ||
                  deleteDialog?.row?.tipoExamen ||
                  "-"}
              </strong>{" "}
              de licencia{" "}
              <strong>
                {deleteDialog?.impact?.convocatoria?.licencia ||
                  deleteDialog?.row?.licencia ||
                  "-"}
              </strong>{" "}
              del día{" "}
              <strong>
                {formatDate(
                  deleteDialog?.impact?.convocatoria?.fecha ||
                    deleteDialog?.row?.fecha,
                )}
              </strong>
              .
            </Typography>

            {deleteDialog.loading ? (
              <Alert severity="info">Calculando alumnos afectados...</Alert>
            ) : null}

            {!deleteDialog.loading &&
            (deleteDialog?.impact?.afectados?.length || 0) > 0 ? (
              <>
                <Alert severity="warning">
                  Se cancelarán automáticamente las solicitudes SOLICITADO o
                  PROGRAMADO asociadas a esta fecha y se notificará a cada
                  alumno para solicitar una nueva convocatoria.
                </Alert>
                <Box sx={{ maxHeight: 220, overflowY: "auto" }}>
                  <List dense>
                    {deleteDialog.impact.afectados.map((item) => (
                      <ListItem key={item.solicitudId} disableGutters>
                        <ListItemText
                          primary={`${item.alumnoNombre} (${item.alumnoEmail || "sin email"})`}
                          secondary={`Estado solicitud: ${item.estado} | Programada: ${formatDate(item.fechaProgramada)}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </>
            ) : null}

            {!deleteDialog.loading &&
            (deleteDialog?.impact?.afectados?.length || 0) === 0 ? (
              <Alert severity="info">
                No hay solicitudes en estado SOLICITADO o PROGRAMADO para esta
                convocatoria.
              </Alert>
            ) : null}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} disabled={deleteDialog.loading}>
            Cancelar
          </Button>
          <Button
            onClick={confirmDeactivate}
            variant="contained"
            color="error"
            disabled={deleteDialog.loading}
          >
            {deleteDialog.loading ? "Eliminando..." : "Confirmar eliminación"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {editingId ? "Editar convocatoria" : "Nueva convocatoria"}
        </DialogTitle>
        <DialogContent sx={{ pt: "12px !important" }}>
          <Stack spacing={2}>
            <TextField
              size="small"
              type="date"
              label="Fecha"
              value={form.fecha}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, fecha: event.target.value }))
              }
              InputLabelProps={{ shrink: true }}
              fullWidth
              sx={{
                minWidth: 210,
                // 1. Fuerza a la etiqueta a estar SIEMPRE en color azul
                "& .MuiInputLabel-root": {
                  color: "rgb(0, 0, 0) !important",
                },
                // 2. Fuerza al borde/muesca exterior a estar SIEMPRE en color azul
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#1976d2 !important",
                  borderWidth: "1px",
                },
                // 3. Mantiene el color azul si pasas el ratón por encima (Hover)
                "& :hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#1976d2 !important",
                },
                // 4. CONTROL DINÁMICO DEL FORMATO dd/mm/aaaa:
                // Oculto por defecto si no hay fecha informada
                "& input::-webkit-datetime-edit": {
                  color: form.fecha ? "inherit" : "transparent",
                },
                // Se muestra en color gris cuando el campo recibe el foco (haces clic dentro)
                "& .MuiInputBase-root.Mui-focused input::-webkit-datetime-edit":
                  {
                    color: form.fecha ? "inherit" : "rgba(0, 0, 0, 0.42)",
                  },
                // 5. Ajuste de espaciado interno
                "& .MuiInputBase-input": {
                  pt: 1.5,
                },
              }}
            />

            <TextField
              select
              label="Licencia"
              value={form.licencia}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, licencia: event.target.value }))
              }
              fullWidth
            >
              {LICENCIAS_APP.map((licencia) => (
                <MenuItem key={licencia} value={licencia}>
                  {licencia}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Tipo examen"
              value={form.tipoExamen}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, tipoExamen: event.target.value }))
              }
              fullWidth
            >
              <MenuItem value="TEORICO">Teórico</MenuItem>
              <MenuItem value="PRACTICO">Práctico</MenuItem>
            </TextField>

            <TextField
              select
              label="Activa"
              value={String(form.activo)}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  activo: event.target.value === "true",
                }))
              }
              fullWidth
            >
              <MenuItem value="true">Sí</MenuItem>
              <MenuItem value="false">No</MenuItem>
            </TextField>

            <Alert severity="info">
              Las convocatorias inactivas no se muestran a los alumnos.
            </Alert>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openAgendaModal}
        onClose={() => setOpenAgendaModal(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {selectedConvocatoria
            ? `Convocatoria ${selectedConvocatoria.tipoExamen} ${selectedConvocatoria.licencia} - ${formatDate(selectedConvocatoria.fecha)}`
            : "Convocatoria"}
        </DialogTitle>
        <DialogContent sx={{ pt: "12px !important" }}>
          {/* <Alert severity="info" sx={{ mb: 1.5 }}>
              Estados incluidos:{" "}
                {selectedConvocatoria?.estadosMostrados?.join(", ") ||
                "SOLICITADO, PROGRAMADO"}
                .
          </Alert> */}

          <Box sx={{ height: 420 }}>
            <DataGrid
              rows={selectedConvocatoria?.alumnos || []}
              columns={agendaColumns}
              getRowId={(row) => row.solicitudId}
              disableRowSelectionOnClick
              onRowClick={(params) => handleOpenAgendaExamModal(params.row)}
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAgendaModal(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={4500}
        onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          variant="filled"
          severity={notification.severity}
          onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      <Dialog
        open={openAgendaExamModal}
        onClose={handleCloseAgendaExamModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center", // Keeps them perfectly aligned vertically
            width: "100%",
          }}
        >
          <span>Detalle de evaluación</span>
          <StatusChip label={selectedAgendaExam?.estado || "-"} />
        </DialogTitle>

        <DialogContent sx={{ display: "grid", gap: 1, pt: 1 }}>
          <Typography>
            <strong>Alumno:</strong> {selectedAgendaExam?.nombre || "-"}
          </Typography>
          <Typography>
            <strong>Tipo:</strong> {selectedAgendaExam?.tipoExamen || "-"}
          </Typography>
          {selectedAgendaExam?.tipoExamen === "PRACTICO" ? (
            <Typography>
              <strong>Subtipo:</strong>{" "}
              {selectedAgendaExam?.tipoPracticoLabel || "Circulacion"}
            </Typography>
          ) : null}

          <Typography>
            <strong>Fecha convocatoria:</strong>{" "}
            {formatDate(selectedAgendaExam?.fechaProgramada)}
          </Typography>

          {selectedAgendaExam?.tipoExamen === "TEORICO" ? (
            <>
              <Typography>
                <strong>Errores:</strong>{" "}
                {selectedAgendaExam?.erroresExamen ?? "-"}
              </Typography>
              <Typography>
                <strong>Aciertos:</strong>{" "}
                {selectedAgendaExam?.aciertosExamen ?? "-"}
              </Typography>
            </>
          ) : (
            <>
              <Divider sx={{ my: 0.5 }} />
              <Typography>
                <strong>Faltas leves:</strong>{" "}
                {selectedAgendaExam?.faltasLeves ?? 0}
              </Typography>
              {(selectedAgendaExam?.faltasLevesDetalle || []).length > 0 ? (
                <List dense disablePadding>
                  {selectedAgendaExam.faltasLevesDetalle.map((falta, index) => (
                    <ListItem key={`ag-leve-${index}`} sx={{ px: 0, py: 0.2 }}>
                      <ListItemText
                        primaryTypographyProps={{ variant: "body2" }}
                        primary={`- ${falta}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : null}
              <Typography>
                <strong>Faltas deficientes:</strong>{" "}
                {selectedAgendaExam?.faltasDeficientes ?? 0}
              </Typography>
              {(selectedAgendaExam?.faltasDeficientesDetalle || []).length >
              0 ? (
                <List dense disablePadding>
                  {selectedAgendaExam.faltasDeficientesDetalle.map(
                    (falta, index) => (
                      <ListItem key={`ag-def-${index}`} sx={{ px: 0, py: 0.2 }}>
                        <ListItemText
                          primaryTypographyProps={{ variant: "body2" }}
                          primary={`- ${falta}`}
                        />
                      </ListItem>
                    ),
                  )}
                </List>
              ) : null}
              <Typography>
                <strong>Faltas eliminatorias:</strong>{" "}
                {selectedAgendaExam?.faltasEliminatorias ?? 0}
              </Typography>
              {(selectedAgendaExam?.faltasEliminatoriasDetalle || []).length >
              0 ? (
                <List dense disablePadding>
                  {selectedAgendaExam.faltasEliminatoriasDetalle.map(
                    (falta, index) => (
                      <ListItem key={`ag-eli-${index}`} sx={{ px: 0, py: 0.2 }}>
                        <ListItemText
                          primaryTypographyProps={{ variant: "body2" }}
                          primary={`- ${falta}`}
                        />
                      </ListItem>
                    ),
                  )}
                </List>
              ) : null}
              <Typography>
                <strong>Motivo no apto:</strong>{" "}
                {selectedAgendaExam?.motivoNoApto || "-"}
              </Typography>
            </>
          )}
          {/*<Typography>
            <strong>Observaciones:</strong>{" "}
            {selectedAgendaExam?.observaciones || "-"}
          </Typography> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAgendaExamModal}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
