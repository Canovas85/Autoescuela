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
const HOUR_HEIGHT = 72;

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
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("es-ES", {
    timeZone: "UTC",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
};

const formatDayMonth = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("es-ES", {
    timeZone: "UTC",
    day: "numeric",
    month: "short",
  });
};

const addDaysToUtcDate = (value, days) => {
  if (!value) {
    return null;
  }

  const base = new Date(value);

  return new Date(
    Date.UTC(
      base.getUTCFullYear(),
      base.getUTCMonth(),
      base.getUTCDate() + days,
      12,
      0,
      0,
      0,
    ),
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
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 1;
  }

  const day = date.getDay();
  if (Number.isNaN(date.getTime())) {
    return 1;
  }

  const utcDay = date.getUTCDay();
  return utcDay === 0 ? 7 : utcDay;
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

export default function ProfesorAgenda() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [agenda, setAgenda] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [savingClassId, setSavingClassId] = useState("");
  const [openScheduleModal, setOpenScheduleModal] = useState(false);
  const [viewMenuAnchor, setViewMenuAnchor] = useState(null);

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
      const data = await profesorPortalService.getAgenda(offset);
      setAgenda(data);

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
    const weekStart = agenda?.semana?.inicio;

    if (!weekStart) {
      return DAYS.map((day) => ({
        ...day,
        date: null,
      }));
    }

    return DAYS.map((day, index) => {
      const date = addDaysToUtcDate(weekStart, index);

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
        spacing={1.5}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", md: "center" }}
        sx={{ mb: 2 }}
      >
        <Typography variant="h4" fontWeight={800}>
          Mi agenda
        </Typography>

        <Button variant="outlined" onClick={() => setOpenScheduleModal(true)}>
          Configurar horario
        </Button>
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
              onClick={() => setWeekOffset((prev) => prev - 1)}
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
              onClick={() => setWeekOffset((prev) => prev + 1)}
            >
              <NavigateNextIcon />
            </IconButton>
          </Box>

          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={() => setWeekOffset(0)}>
              Hoy
            </Button>

            <Button
              variant="contained"
              sx={{
                backgroundColor: "#2f80ed",
                textTransform: "none",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#1d6fe0",
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
            <Box sx={{ minWidth: 1180 }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "74px repeat(7, minmax(150px, 1fr))",
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
                  gridTemplateColumns: "74px repeat(7, minmax(150px, 1fr))",
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
                    height: timelineHeight,
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
                          right: 0,
                          borderTop: "0px solid #edf2fa",
                          pr: 1,
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
                  const isSundayWithoutClasses =
                    day.id === 7 && dayClasses.length === 0;

                  return (
                    <Box
                      key={day.id}
                      sx={{
                        position: "relative",
                        height: timelineHeight,
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

                      {dayClasses.map((clase) => {
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
                          isProgramada ? 126 : 112,
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
                              minHeight: 114,
                              height,
                              p: 1,
                              borderRadius: 2,
                              border: `1px solid ${color.border}`,
                              backgroundColor: color.bg,
                              overflow: "visible",
                              zIndex: 2,
                              boxShadow: "0 4px 10px rgba(15,23,42,0.06)",
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: 700, color: color.title }}
                            >
                              {`${formatHour(clase.fecha)} - ${minutesToTime(startMinute + duration)}`}
                            </Typography>

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
                                maxWidth: "100%",
                                fontSize: 10,
                                height: 20,
                                bgcolor: "#fff",
                                border: "1px solid #dbe5f2",
                              }}
                            />

                            <Stack
                              direction="row"
                              spacing={0.6}
                              sx={{ mt: 0.55, flexWrap: "wrap" }}
                              useFlexGap
                            >
                              <Chip
                                size="small"
                                label={clase.estado}
                                color={
                                  clase.estado === "CONFIRMADA"
                                    ? "success"
                                    : "primary"
                                }
                                sx={{ height: 20, fontSize: 10 }}
                              />
                            </Stack>

                            {isProgramada && (
                              <Stack
                                direction="row"
                                spacing={0.6}
                                sx={{ mt: 0.45 }}
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
