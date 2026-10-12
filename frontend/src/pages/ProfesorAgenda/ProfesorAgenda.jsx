import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PersonIcon from "@mui/icons-material/Person";
import { profesorPortalService } from "../../services/profesorPortalService";
import { clasesPracticasPortalService } from "../../services/clasesPracticasPortalService";
import {
  addDaysToDateKey,
  dateFromKeyAtNoon,
  extractDateKey,
  formatDateValue,
  getWeekDayIdFromValue,
  toDateKeyFromDate,
} from "../../utils/calendarDate";
import { LicenseChip } from "../../components/common/LicenseChip";

const DAYS = [
  { id: 1, short: "Lun", label: "Lunes" },
  { id: 2, short: "Mar", label: "Martes" },
  { id: 3, short: "Mie", label: "Miercoles" },
  { id: 4, short: "Jue", label: "Jueves" },
  { id: 5, short: "Vie", label: "Viernes" },
  { id: 6, short: "Sab", label: "Sabado" },
  { id: 7, short: "Dom", label: "Domingo" },
];

const DAY_NAME_BY_ID = DAYS.reduce((acc, day) => {
  acc[day.id] = day.label;
  return acc;
}, {});

const DEFAULT_START_MINUTES = 8 * 60;
const DEFAULT_END_MINUTES = 16 * 60;
const HOUR_HEIGHT = 230;
const EVENT_CARD_BOTTOM_BUFFER = 150;
const TIME_GUTTER_WIDTH = 98;
const TIME_GUTTER_HEIGHT = 98;
const DAY_COLUMN_MIN_WIDTH = 210;

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

const formatDate = (value) => {
  return (
    formatDateValue(value, {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    }) || ""
  );
};

const formatDayMonth = (value) => {
  return (
    formatDateValue(value, {
      day: "numeric",
      month: "short",
    }) || ""
  );
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

const formatWeekLabel = (week) => {
  if (!week?.inicio || !week?.fin) {
    return "Semana";
  }

  return `${formatDate(week.inicio)} - ${formatDate(week.fin)}`;
};

const dateToDayId = (value) => {
  return getWeekDayIdFromValue(value);
};

const timeToMinutes = (time) => {
  if (typeof time !== "string") {
    return Number.NaN;
  }

  const match = time.match(/^([01]\d|2[0-3]):([0-5]\d)$/);

  if (!match) {
    return Number.NaN;
  }

  return Number(match[1]) * 60 + Number(match[2]);
};

const minutesToTime = (minutes) => {
  const hh = String(Math.floor(minutes / 60)).padStart(2, "0");
  const mm = String(minutes % 60).padStart(2, "0");
  return `${hh}:${mm}`;
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

const formatHoursSummary = (minutes) => {
  const safeMinutes = Number.isFinite(minutes) ? Math.max(minutes, 0) : 0;
  const hours = Math.floor(safeMinutes / 60);
  const remainder = safeMinutes % 60;
  return `${hours}h ${String(remainder).padStart(2, "0")}min`;
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

const COMPLETED_STATUSES = [
  "REALIZADA",
  "COMPLETADA",
  "FINALIZADA",
  "REGISTRADA",
];

const PROGRAMMED_STATUSES = ["PROGRAMADA", "CONFIRMADA"];

const buildImageSrc = (ruta) => {
  if (!ruta) {
    return "";
  }

  if (ruta.startsWith("http://") || ruta.startsWith("https://")) {
    return ruta;
  }

  if (ruta.startsWith("/api/")) {
    return ruta;
  }

  if (ruta.startsWith("api/")) {
    return `/${ruta}`;
  }

  if (ruta.startsWith("/uploads/")) {
    return `/api${ruta}`;
  }

  if (ruta.startsWith("uploads/")) {
    return `/api/${ruta}`;
  }

  return ruta;
};

const isDateInRange = (value, from, to) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return date >= from && date <= to;
};

const summarizeClassesByPeriod = (rows, from, to) => {
  return (rows || []).reduce(
    (acc, row) => {
      if (!isDateInRange(row?.fecha, from, to)) {
        return acc;
      }

      const estado = String(row?.estado || "").toUpperCase();

      if (PROGRAMMED_STATUSES.includes(estado)) {
        acc.programadasConfirmadas += 1;
      }

      if (estado === "PROGRAMADA") {
        acc.pendientesConfirmar += 1;
      }

      if (COMPLETED_STATUSES.includes(estado)) {
        acc.completadasRegistradas += 1;
      }

      return acc;
    },
    {
      programadasConfirmadas: 0,
      pendientesConfirmar: 0,
      completadasRegistradas: 0,
    },
  );
};

export default function ProfesorAgenda() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [agenda, setAgenda] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [savingClassId, setSavingClassId] = useState("");
  const [openScheduleModal, setOpenScheduleModal] = useState(false);
  const [viewMenuAnchor, setViewMenuAnchor] = useState(null);
  const [showOnlyToday, setShowOnlyToday] = useState(false);
  const [classRows, setClassRows] = useState([]);

  const [scheduleBlocks, setScheduleBlocks] = useState([]);
  const [newBlock, setNewBlock] = useState({
    diaSemana: 1,
    horaInicio: "08:00",
    horaFin: "08:45",
  });

  const loadAgenda = async (offset = weekOffset) => {
    setLoading(true);
    setError("");

    try {
      const [data, professorClasses] = await Promise.all([
        profesorPortalService.getAgenda(offset),
        clasesPracticasPortalService.getProfessorRequests(),
      ]);
      setAgenda(data);
      setClassRows(Array.isArray(professorClasses) ? professorClasses : []);

      const flattened = (data?.horario || []).flatMap((day) =>
        (day?.bloques || []).map((block) => ({
          diaSemana: day.diaSemana,
          horaInicio: block.horaInicio,
          horaFin: block.horaFin,
        })),
      );

      setScheduleBlocks(flattened);
    } catch (loadError) {
      setError(
        loadError.response?.data?.message ||
          "No se pudo cargar la agenda del profesor",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAgenda(weekOffset);
  }, [weekOffset]);

  const weekDays = useMemo(() => {
    const weekStartKey = extractDateKey(agenda?.semana?.inicio);

    if (!weekStartKey) {
      return DAYS.map((day) => ({
        ...day,
        date: null,
      }));
    }

    return DAYS.map((day, index) => {
      const dayKey = addDaysToDateKey(weekStartKey, index);
      const date = dateFromKeyAtNoon(dayKey);

      return {
        ...day,
        date,
      };
    });
  }, [agenda?.semana?.inicio]);

  const classesByDay = useMemo(() => {
    const map = new Map();
    weekDays.forEach((day) => map.set(day.id, []));

    (agenda?.clases || []).forEach((clase) => {
      const dayId = dateToDayId(clase.fecha);
      const list = map.get(dayId) || [];
      list.push(clase);
      map.set(dayId, list);
    });

    for (const day of weekDays) {
      const sorted = (map.get(day.id) || []).sort(
        (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime(),
      );
      map.set(day.id, sorted);
    }

    return map;
  }, [agenda, weekDays]);

  const minuteRange = useMemo(() => {
    const allMinutes = [];

    for (const block of scheduleBlocks) {
      const start = timeToMinutes(block.horaInicio);
      const end = timeToMinutes(block.horaFin);

      if (!Number.isNaN(start)) {
        allMinutes.push(start);
      }

      if (!Number.isNaN(end)) {
        allMinutes.push(end);
      }
    }

    for (const clase of agenda?.clases || []) {
      const date = new Date(clase.fecha);

      if (Number.isNaN(date.getTime())) {
        continue;
      }

      const start = date.getHours() * 60 + date.getMinutes();
      const duration = Number(clase.duracion) || 45;
      allMinutes.push(start, start + duration);
    }

    if (allMinutes.length === 0) {
      return {
        startMinutes: DEFAULT_START_MINUTES,
        endMinutes: DEFAULT_END_MINUTES,
      };
    }

    const minValue = Math.max(0, Math.min(...allMinutes));
    const maxValue = Math.min(24 * 60, Math.max(...allMinutes));
    const startMinutes = Math.floor(minValue / 60) * 60;
    const endRounded = Math.ceil(maxValue / 60) * 60;
    const endMinutes = Math.max(endRounded, startMinutes + 60);

    return {
      startMinutes,
      endMinutes,
    };
  }, [agenda?.clases, scheduleBlocks]);

  const hourMarks = useMemo(() => {
    const marks = [];

    for (
      let minutes = minuteRange.startMinutes;
      minutes <= minuteRange.endMinutes;
      minutes += 60
    ) {
      marks.push(minutes);
    }

    return marks;
  }, [minuteRange]);

  const timelineHeight =
    ((minuteRange.endMinutes - minuteRange.startMinutes) / 60) * HOUR_HEIGHT;
  const dayColumnHeight = timelineHeight + EVENT_CARD_BOTTOM_BUFFER;

  const footerSummary = useMemo(() => {
    const clases = agenda?.clases || [];
    const totalReservas = clases.length;

    const totalMinutes = clases.reduce(
      (acc, clase) => acc + (Number(clase.duracion) || 45),
      0,
    );

    const vehiculosUnicos = new Set(
      clases
        .map((clase) => clase.vehiculo?.matricula)
        .filter((matricula) => Boolean(matricula)),
    );

    return {
      totalReservas,
      totalMinutes,
      vehiculosUtilizados: vehiculosUnicos.size,
    };
  }, [agenda?.clases]);

  const periodSummary = useMemo(() => {
    const now = new Date();

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    const weekStart = new Date(now);
    weekStart.setHours(0, 0, 0, 0);
    const dayIndex = weekStart.getDay();
    const distanceFromMonday = (dayIndex + 6) % 7;
    weekStart.setDate(weekStart.getDate() - distanceFromMonday);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    return {
      mes: summarizeClassesByPeriod(classRows, startOfMonth, endOfMonth),
      semana: summarizeClassesByPeriod(classRows, weekStart, weekEnd),
    };
  }, [classRows]);

  const addBlock = () => {
    const startMinutes = timeToMinutes(newBlock.horaInicio);
    const endMinutes = timeToMinutes(newBlock.horaFin);

    if (Number.isNaN(startMinutes) || Number.isNaN(endMinutes)) {
      setError("Las horas del bloque deben tener formato HH:mm");
      return;
    }

    if (endMinutes <= startMinutes) {
      setError("La hora de fin del bloque debe ser posterior a la de inicio");
      return;
    }

    setError("");

    setScheduleBlocks((prev) => [
      ...prev,
      {
        diaSemana: Number(newBlock.diaSemana),
        horaInicio: newBlock.horaInicio,
        horaFin: newBlock.horaFin,
      },
    ]);
  };

  const removeBlock = (index) => {
    setScheduleBlocks((prev) => prev.filter((_, i) => i !== index));
  };

  const removeLastInsertedBlock = () => {
    setScheduleBlocks((prev) => prev.slice(0, -1));
  };

  const saveSchedule = async () => {
    setSaving(true);
    setError("");

    try {
      const response =
        await profesorPortalService.updateWorkSchedule(scheduleBlocks);

      const flattened = (response?.horario || []).flatMap((day) =>
        (day?.bloques || []).map((block) => ({
          diaSemana: day.diaSemana,
          horaInicio: block.horaInicio,
          horaFin: block.horaFin,
        })),
      );

      setScheduleBlocks(flattened);
      await loadAgenda(weekOffset);
    } catch (saveError) {
      setError(
        saveError.response?.data?.message || "No se pudo guardar el horario",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleClassStatus = async (classId, estado) => {
    setSavingClassId(classId);
    setError("");

    try {
      await profesorPortalService.updateClassStatus(classId, estado);
      await loadAgenda(weekOffset);
    } catch (statusError) {
      setError(
        statusError.response?.data?.message ||
          "No se pudo actualizar el estado de la clase",
      );
    } finally {
      setSavingClassId("");
    }
  };

  return (
    <Box>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1.25}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", md: "flex-start" }}
        sx={{ mb: 2 }}
      >
        <Stack spacing={1} sx={{ width: "100%" }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <Typography variant="h4" fontWeight={800}>
              Mi agenda
            </Typography>

            <Button
              variant="outlined"
              onClick={() => setOpenScheduleModal(true)}
            >
              Configurar horario
            </Button>
          </Stack>

          <Stack
            direction={{ xs: "column", lg: "row" }}
            spacing={1}
            sx={{ width: "100%" }}
          >
            <Paper
              variant="outlined"
              sx={{
                p: 1,
                borderRadius: 2,
                flex: 1,
                minWidth: 300,
                backgroundColor: "#f8fbff",
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Clases del mes actual
              </Typography>
              <Stack direction="row" spacing={0.75} sx={{ mt: 0.7 }} useFlexGap>
                <Chip
                  size="small"
                  color="primary"
                  label={`Prog./Conf.: ${periodSummary.mes.programadasConfirmadas}`}
                />
                <Chip
                  size="small"
                  color="warning"
                  label={`Pend. confirmar: ${periodSummary.mes.pendientesConfirmar}`}
                />
                <Chip
                  size="small"
                  color="success"
                  label={`Complet./Reg.: ${periodSummary.mes.completadasRegistradas}`}
                />
              </Stack>
            </Paper>

            <Paper
              variant="outlined"
              sx={{
                p: 1,
                borderRadius: 2,
                flex: 1,
                minWidth: 300,
                backgroundColor: "#f7fcf9",
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Clases de esta semana
              </Typography>
              <Stack direction="row" spacing={0.75} sx={{ mt: 0.7 }} useFlexGap>
                <Chip
                  size="small"
                  color="primary"
                  label={`Prog./Conf.: ${periodSummary.semana.programadasConfirmadas}`}
                />
                <Chip
                  size="small"
                  color="warning"
                  label={`Pend. confirmar: ${periodSummary.semana.pendientesConfirmar}`}
                />
                <Chip
                  size="small"
                  color="success"
                  label={`Complet./Reg.: ${periodSummary.semana.completadasRegistradas}`}
                />
              </Stack>
            </Paper>
          </Stack>
        </Stack>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, borderRadius: 3 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "center" }}
          spacing={1.5}
          sx={{ mb: 2 }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "auto minmax(230px, 1fr) auto",
              alignItems: "center",
              gap: 1,
              width: { xs: "100%", md: 320 },
            }}
          >
            <IconButton
              sx={{ border: "1px solid #dbe5f2", borderRadius: 2 }}
              onClick={() => {
                setWeekOffset((prev) => prev - 1);
                setShowOnlyToday(false);
              }}
            >
              <NavigateBeforeIcon />
            </IconButton>

            <Typography
              fontWeight={700}
              sx={{ textAlign: "center", whiteSpace: "nowrap" }}
            >
              {formatWeekLabel(agenda?.semana)}
            </Typography>

            <IconButton
              sx={{ border: "1px solid #dbe5f2", borderRadius: 2 }}
              onClick={() => {
                setWeekOffset((prev) => prev + 1);
                setShowOnlyToday(false);
              }}
            >
              <NavigateNextIcon />
            </IconButton>
          </Box>

          <Stack direction="row" spacing={1}>
            <Button
              variant={showOnlyToday ? "contained" : "outlined"}
              onClick={() => {
                setWeekOffset(0);
                setShowOnlyToday(true);
              }}
            >
              Hoy
            </Button>

            <Button
              variant={showOnlyToday ? "outlined" : "contained"}
              onClick={() => setShowOnlyToday(false)}
              sx={{
                backgroundColor: showOnlyToday ? "transparent" : "#2f80ed",
                textTransform: "none",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: showOnlyToday ? "transparent" : "#1d6fe0",
                  boxShadow: "none",
                },
              }}
            >
              Semana
            </Button>

            <Button
              variant="outlined"
              onClick={(event) => setViewMenuAnchor(event.currentTarget)}
            >
              Mas vistas
            </Button>

            <Menu
              anchorEl={viewMenuAnchor}
              open={Boolean(viewMenuAnchor)}
              onClose={() => setViewMenuAnchor(null)}
            >
              <MenuItem disabled>2 semanas (proximamente)</MenuItem>
              <MenuItem disabled>4 semanas (proximamente)</MenuItem>
            </Menu>

            <Button variant="outlined" onClick={() => loadAgenda(weekOffset)}>
              Recargar
            </Button>
          </Stack>
        </Stack>

        {loading ? (
          <Typography color="text.secondary">Cargando agenda...</Typography>
        ) : (
          <Box sx={{ overflowX: "auto" }}>
            <Box sx={{ minWidth: 1600 }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: `${TIME_GUTTER_WIDTH}px repeat(7, minmax(${DAY_COLUMN_MIN_WIDTH}px, 1fr))`,
                  borderTop: "1px solid #e3ebf6",
                  borderLeft: "1px solid #e3ebf6",
                  borderRight: "1px solid #e3ebf6",
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{ borderBottom: "1px solid #e3ebf6", bgcolor: "#f9fbff" }}
                />

                {weekDays.map((day) => (
                  <Box
                    key={day.id}
                    sx={{
                      py: 1,
                      px: 1.25,
                      borderLeft: "1px solid #e3ebf6",
                      borderBottom: "1px solid #e3ebf6",
                      bgcolor: "#f9fbff",
                    }}
                  >
                    <Typography variant="body2" fontWeight={600}>
                      {day.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDayMonth(day.date)}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: `${TIME_GUTTER_WIDTH}px repeat(7, minmax(${DAY_COLUMN_MIN_WIDTH}px, 1fr))`,
                  borderLeft: "1px solid #e3ebf6",
                  borderRight: "1px solid #e3ebf6",
                  borderBottom: "1px solid #e3ebf6",
                  borderBottomLeftRadius: 12,
                  borderBottomRightRadius: 12,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    height: dayColumnHeight,
                    bgcolor: "#fbfdff",
                  }}
                >
                  {hourMarks.map((minutes) => {
                    const top =
                      ((minutes - minuteRange.startMinutes) / 60) * HOUR_HEIGHT;

                    return (
                      <Box
                        key={minutes}
                        sx={{
                          position: "absolute",
                          top,
                          marginTop: 4,
                          left: 10,
                          right: 8,
                          borderTop: "0px solid #edf2fa",
                          pr: 1.25,
                        }}
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            position: "absolute",
                            top: -7,
                            left: 6,
                            fontWeight: 600,
                          }}
                        >
                          {minutesToTime(minutes)}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>

                {weekDays.map((day) => {
                  const dayClasses = classesByDay.get(day.id) || [];
                  const now = new Date();
                  const todayDayId = now.getDay() === 0 ? 7 : now.getDay();

                  const visibleDayClasses = showOnlyToday
                    ? day.id === todayDayId
                      ? dayClasses.filter((clase) => {
                          const classDateKey = extractDateKey(clase.fecha);
                          const todayDateKey = toDateKeyFromDate(now);

                          if (!classDateKey) {
                            return false;
                          }

                          return classDateKey === todayDateKey;
                        })
                      : []
                    : dayClasses;

                  const isSundayWithoutClasses =
                    day.id === 7 && visibleDayClasses.length === 0;

                  return (
                    <Box
                      key={day.id}
                      sx={{
                        position: "relative",
                        height: dayColumnHeight,
                        borderLeft: "1px solid #e3ebf6",
                        bgcolor: "#fff",
                      }}
                    >
                      {hourMarks.map((minutes) => {
                        const top =
                          ((minutes - minuteRange.startMinutes) / 60) *
                          HOUR_HEIGHT;

                        return (
                          <Box
                            key={`${day.id}-${minutes}`}
                            sx={{
                              position: "absolute",
                              top,
                              left: 0,
                              right: 0,
                              borderTop: "1px solid #edf2fa",
                            }}
                          />
                        );
                      })}

                      {isSundayWithoutClasses && (
                        <Stack
                          direction="row" // 💡 Cambia a horizontal
                          spacing={1} // Espacio entre el icono y el texto
                          alignItems="center"
                          justifyContent="center"
                          sx={{
                            mt: 4,
                            ml: 3,
                            position: "absolute",
                            inset: 0,
                            color: "#8ea0b8",
                          }}
                        >
                          <CalendarMonthIcon />
                          <Typography
                            variant="body2"
                            sx={{
                              whiteSpace: "nowrap", // 💡 Fuerza a que no se rompa la línea jamás
                            }}
                          >
                            Sin clases programadas
                          </Typography>
                        </Stack>
                      )}

                      {visibleDayClasses.map((clase) => {
                        const date = new Date(clase.fecha);
                        const startMinute =
                          date.getHours() * 60 + date.getMinutes();
                        const duration = Number(clase.duracion) || 45;
                        const endMinute = startMinute + duration;
                        const offset = startMinute - minuteRange.startMinutes;

                        if (endMinute <= minuteRange.startMinutes) {
                          return null;
                        }

                        if (startMinute >= minuteRange.endMinutes) {
                          return null;
                        }

                        const top = (offset / 60) * HOUR_HEIGHT;
                        const isProgramada = clase.estado === "PROGRAMADA";
                        const height = Math.max(
                          (duration / 60) * HOUR_HEIGHT,
                          isProgramada ? 176 : 154,
                        );
                        const color = getColorByStudent(
                          clase.alumno?.id,
                          clase.alumno?.nombre,
                        );

                        return (
                          <Box
                            key={clase.id}
                            sx={{
                              position: "absolute",
                              top,
                              left: 7,
                              right: 7,
                              minHeight: 154,
                              height: 154,
                              p: 1,
                              borderRadius: 1,
                              border: `1px solid ${color.border}`,
                              backgroundColor: color.bg,
                              overflow: "visible",
                              zIndex: 2,
                              boxShadow: "0 4px 10px rgba(15,23,42,0.06)",
                            }}
                          >
                            {/* Fecha y Hora de la clase */}
                            <Typography
                              variant="caption"
                              sx={{
                                fontWeight: 700,
                                color: color.title,
                                display: "block",
                                pr: 4,
                              }} // Añadimos padding derecho para que el texto largo no choque con el chip
                            >
                              {`${formatHour(clase.fecha)} - ${minutesToTime(startMinute + duration)}`}
                            </Typography>

                            {/* CHIP DE LICENCIA: Posicionado de forma absoluta arriba a la derecha */}
                            <Box
                              sx={{ position: "absolute", top: 7, right: 12 }}
                            >
                              <LicenseChip
                                value={clase.vehiculo?.tipoPermiso || "-"}
                                size="small"
                                sx={{
                                  width: 22, // Tamaño pequeño y discreto
                                  height: 22, // Mismo ancho y alto para círculo perfecto
                                  borderRadius: "50%", // Lo convierte en un círculo
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  p: 0,
                                  fontSize: 10, // Letra compacta para que quepa en el círculo pequeño
                                  fontWeight: 700,
                                  "& .MuiChip-label": {
                                    p: 0, // Quita márgenes internos del texto para centrarlo
                                  },
                                }}
                              />
                            </Box>

                            <Stack
                              direction="row"
                              spacing={0.5}
                              alignItems="center"
                              sx={{ mt: 0.4 }}
                            >
                              <PersonIcon
                                sx={{ fontSize: 14, color: color.title }}
                              />
                              <Typography
                                variant="body2"
                                sx={{
                                  lineHeight: 1.15,
                                  fontWeight: 700,
                                  color: color.title,
                                  whiteSpace: "normal",
                                  wordBreak: "break-word",
                                }}
                              >
                                {clase.alumno?.nombre || "Alumno"}
                              </Typography>
                            </Stack>

                            <Typography
                              variant="caption"
                              display="block"
                              color="text.secondary"
                              sx={{ mt: 0.25 }}
                            >
                              {clase.vehiculo?.marca || "Vehiculo"}{" "}
                              {clase.vehiculo?.modelo || ""}
                            </Typography>

                            <Chip
                              size="small"
                              label={
                                clase.vehiculo?.matricula || "Sin matricula"
                              }
                              sx={{
                                mt: 0.55,
                                ml: 1,
                                maxWidth: "100%",
                                fontSize: 10,
                                height: 20,
                                bgcolor: "#fff",
                                border: "1px solid #dbe5f2",
                              }}
                            />

                            {/* Eliminamos el Stack antiguo del LicenseChip que rompía la línea */}

                            <Stack
                              direction="row"
                              spacing={0.6}
                              sx={{ mt: 0.55, flexWrap: "wrap", pr: 5 }}
                              useFlexGap
                            >
                              {(() => {
                                const statusConfig = getAgendaStatusChipConfig(
                                  clase.estadoAgenda || clase.estado,
                                );

                                return (
                                  <Chip
                                    size="small"
                                    label={statusConfig.label}
                                    color={statusConfig.color}
                                    sx={{ height: 20, fontSize: 10 }}
                                  />
                                );
                              })()}
                            </Stack>

                            {isProgramada && (
                              <Stack
                                direction="row"
                                spacing={0.6}
                                sx={{ mt: 0.45, pr: 5 }}
                              >
                                <Chip
                                  size="small"
                                  color="success"
                                  label="Confirmar"
                                  icon={<CheckCircleIcon />}
                                  onClick={() =>
                                    handleClassStatus(clase.id, "CONFIRMADA")
                                  }
                                  disabled={savingClassId === clase.id}
                                  sx={{ height: 20, fontSize: 10 }}
                                />
                                <Chip
                                  size="small"
                                  color="error"
                                  label="Cancelar"
                                  icon={<CancelIcon />}
                                  onClick={() =>
                                    handleClassStatus(clase.id, "CANCELADA")
                                  }
                                  disabled={savingClassId === clase.id}
                                  sx={{ height: 20, fontSize: 10 }}
                                />
                              </Stack>
                            )}

                            <Box
                              sx={{
                                position: "absolute",
                                right: 8,
                                bottom: 8,
                                width: 40,
                                height: 30,
                                borderRadius: 1,
                                overflow: "hidden",
                                border: "1px solid #cbd5e1",
                                backgroundColor: "#fff",
                                display: "grid",
                                placeItems: "center",
                              }}
                            >
                              {buildImageSrc(clase.vehiculo?.imagenRuta) ? (
                                <Box
                                  component="img"
                                  src={buildImageSrc(
                                    clase.vehiculo?.imagenRuta,
                                  )}
                                  alt={clase.vehiculo?.matricula || "Vehiculo"}
                                  sx={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                              ) : (
                                <DirectionsCarIcon
                                  sx={{ fontSize: 14, color: "#64748b" }}
                                />
                              )}
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  );
                })}
              </Box>
            </Box>

            <Paper
              variant="outlined"
              sx={{
                mt: 2,
                p: 0,
                borderColor: "#dbe5f2",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    md: "1fr 1fr 1fr",
                  },
                  bgcolor: "#fff",
                }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ p: 1.6, borderRight: { md: "1px solid #edf2fa" } }}
                >
                  <CalendarMonthIcon sx={{ color: "#1d4ed8" }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Total de clases esta semana
                    </Typography>
                    <Typography variant="h6" fontWeight={800}>
                      {footerSummary.totalReservas}
                    </Typography>
                  </Box>
                </Stack>

                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ p: 1.6, borderRight: { md: "1px solid #edf2fa" } }}
                >
                  <AccessTimeIcon sx={{ color: "#0f172a" }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Horas de clase
                    </Typography>
                    <Typography variant="h6" fontWeight={800}>
                      {formatHoursSummary(footerSummary.totalMinutes)}
                    </Typography>
                  </Box>
                </Stack>

                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ p: 1.6 }}
                >
                  <DirectionsCarIcon sx={{ color: "#1e3a8a" }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Vehiculos utilizados
                    </Typography>
                    <Typography variant="h6" fontWeight={800}>
                      {footerSummary.vehiculosUtilizados}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Paper>
          </Box>
        )}
      </Paper>

      <Dialog
        open={openScheduleModal}
        onClose={() => setOpenScheduleModal(false)}
        fullWidth
        maxWidth={false} // 💡 Desactiva los tamaños preestablecidos de MUI (sm, md, lg, etc.)
        sx={{
          "& .MuiDialog-paper": {
            width: "auto", // El ancho inicial se adapta al tamaño de los datos
            maxWidth: "90%", // 💡 Límite porcentual máximo para que no toque los bordes de la pantalla
            minWidth: "320px", // Evita que se vea demasiado estrecho si hay pocos datos
            transition: "max-width 0.3s ease-in-out", // Opcional: suaviza el cambio si los datos se cargan dinámicamente
          },
        }}
      >
        <DialogTitle>Configurar horario de trabajo</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Define bloques por dia. Puedes crear una jornada continua o partida.
            Maximo 8 horas por dia.
          </Typography>

          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1.5}
            sx={{ alignItems: { md: "center" } }}
          >
            <FormControl size="small" sx={{ minWidth: 170 }}>
              <InputLabel>Dia</InputLabel>
              <Select
                value={newBlock.diaSemana}
                label="Dia"
                onChange={(event) =>
                  setNewBlock((prev) => ({
                    ...prev,
                    diaSemana: event.target.value,
                  }))
                }
              >
                {DAYS.map((day) => (
                  <MenuItem key={day.id} value={day.id}>
                    {day.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              size="small"
              type="time"
              label="Inicio"
              value={newBlock.horaInicio}
              onChange={(event) =>
                setNewBlock((prev) => ({
                  ...prev,
                  horaInicio: event.target.value,
                }))
              }
              InputLabelProps={{ shrink: true }}
              sx={{ width: 140 }}
            />

            <TextField
              size="small"
              type="time"
              label="Fin"
              value={newBlock.horaFin}
              onChange={(event) =>
                setNewBlock((prev) => ({
                  ...prev,
                  horaFin: event.target.value,
                }))
              }
              InputLabelProps={{ shrink: true }}
              sx={{ width: 140 }}
            />

            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addBlock}
            >
              Anadir bloque
            </Button>
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            flexWrap="wrap"
            sx={{ mt: 2 }}
          >
            {scheduleBlocks.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                No hay bloques definidos.
              </Typography>
            )}

            {scheduleBlocks.map((block, index) => (
              <Chip
                key={`${block.diaSemana}-${block.horaInicio}-${block.horaFin}-${index}`}
                label={`${DAY_NAME_BY_ID[block.diaSemana]} ${block.horaInicio}-${block.horaFin}`}
                onDelete={() => removeBlock(index)}
                deleteIcon={<DeleteIcon />}
                color="primary"
                variant="outlined"
              />
            ))}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => {
              removeLastInsertedBlock();
            }}
            disabled={scheduleBlocks.length === 0}
          >
            Deshacer ultimo
          </Button>

          <Button onClick={() => setOpenScheduleModal(false)} color="inherit">
            Cerrar
          </Button>

          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={saving}
            onClick={async () => {
              await saveSchedule();
              setOpenScheduleModal(false);
            }}
          >
            Guardar horario
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
