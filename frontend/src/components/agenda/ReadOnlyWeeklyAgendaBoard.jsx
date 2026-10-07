import { useMemo } from "react";
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import PersonIcon from "@mui/icons-material/Person";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";

const WEEK_DAYS = [
  { id: 1, label: "Lunes" },
  { id: 2, label: "Martes" },
  { id: 3, label: "Miercoles" },
  { id: 4, label: "Jueves" },
  { id: 5, label: "Viernes" },
  { id: 6, label: "Sabado" },
  { id: 7, label: "Domingo" },
];

const STATUS_COLORS = {
  REGISTRADA: "success",
  PENDIENTE_REGISTRO: "warning",
  EN_CURSO: "info",
  CONFIRMADA: "primary",
  PROGRAMADA: "default",
};

const STATUS_LABELS = {
  REGISTRADA: "REGISTRADA",
  PENDIENTE_REGISTRO: "PENDIENTE REGISTRO",
  EN_CURSO: "EN CURSO",
  CONFIRMADA: "CONFIRMADA",
  PROGRAMADA: "PROGRAMADA",
};

const STUDENT_PALETTE = [
  { bg: "#ecfeff", border: "#a5f3fc", title: "#155e75" },
  { bg: "#fff7ed", border: "#fed7aa", title: "#9a3412" },
  { bg: "#ecfdf5", border: "#a7f3d0", title: "#14532d" },
  { bg: "#f5f3ff", border: "#c4b5fd", title: "#5b21b6" },
  { bg: "#eff6ff", border: "#bfdbfe", title: "#1e3a8a" },
];

function toDate(value) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatDate(value, withYear = false) {
  const date = toDate(value);
  if (!date) {
    return "-";
  }

  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: withYear ? "numeric" : "short",
    year: withYear ? "numeric" : undefined,
  });
}

function formatTime(value) {
  const date = toDate(value);
  if (!date) {
    return "--:--";
  }

  return date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatHourRange(value, duration = 45) {
  const start = toDate(value);
  if (!start) {
    return "--:-- - --:--";
  }

  const minutes = Number(duration) || 45;
  const end = new Date(start);
  end.setMinutes(end.getMinutes() + minutes);

  return `${formatTime(start)} - ${formatTime(end)}`;
}

function normalizeStatus(status) {
  return String(status || "")
    .trim()
    .toUpperCase();
}

function getStatusChip(status) {
  const key = normalizeStatus(status);
  return {
    color: STATUS_COLORS[key] || "default",
    label: STATUS_LABELS[key] || key || "SIN ESTADO",
  };
}

function getColorByStudent(studentId, studentName) {
  const seed = String(studentId || studentName || "SIN_ALUMNO");
  let hash = 0;

  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }

  return STUDENT_PALETTE[Math.abs(hash) % STUDENT_PALETTE.length];
}

function buildWeekDays(weekStart) {
  const start = toDate(weekStart);

  if (!start) {
    return WEEK_DAYS.map((day) => ({ ...day, date: null }));
  }

  return WEEK_DAYS.map((day, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);

    return {
      ...day,
      date,
    };
  });
}

function getWeekDayIdFromValue(value) {
  const date = toDate(value);

  if (!date) {
    return null;
  }

  const day = date.getDay();
  return day === 0 ? 7 : day;
}

function DayColumn({ day, classes, showStudentName, emptyMessage }) {
  return (
    <Box
      sx={{
        border: "1px solid #e2e8f0",
        borderRadius: 1,
        backgroundColor: "#f8fafc",
        minHeight: 240,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ p: 1, borderBottom: "1px solid #e2e8f0" }}>
        <Typography variant="body2" fontWeight={700}>
          {day.label}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {formatDate(day.date)}
        </Typography>
      </Box>

      <Stack spacing={0.8} sx={{ p: 1 }}>
        {classes.length === 0 ? (
          <Typography variant="caption" color="text.secondary">
            {emptyMessage || "Sin clases"}
          </Typography>
        ) : (
          classes.map((clase) => {
            const palette = getColorByStudent(
              clase.alumno?.id,
              clase.alumno?.nombre,
            );
            const status = getStatusChip(clase.estadoAgenda || clase.estado);

            return (
              <Box
                key={clase.id}
                sx={{
                  border: "1px solid",
                  borderColor: palette.border,
                  backgroundColor: palette.bg,
                  borderRadius: 1,
                  p: 0.9,
                }}
              >
                <Typography
                  variant="caption"
                  fontWeight={700}
                  sx={{ color: palette.title, display: "block" }}
                >
                  {formatHourRange(clase.fecha, clase.duracion)}
                </Typography>

                {showStudentName ? (
                  <Stack
                    direction="row"
                    spacing={0.5}
                    alignItems="center"
                    sx={{ mt: 0.25 }}
                  >
                    <PersonIcon sx={{ fontSize: 14, color: palette.title }} />
                    <Typography
                      variant="caption"
                      fontWeight={700}
                      sx={{ color: palette.title }}
                    >
                      {clase.alumno?.nombre || "Alumno"}
                    </Typography>
                  </Stack>
                ) : null}

                <Stack
                  direction="row"
                  spacing={0.5}
                  alignItems="center"
                  sx={{ mt: 0.2 }}
                >
                  <DirectionsCarIcon
                    sx={{ fontSize: 12, color: "text.secondary" }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {clase.vehiculo?.matricula || "Sin matricula"}
                  </Typography>
                </Stack>

                <Chip
                  size="small"
                  color={status.color}
                  label={status.label}
                  sx={{ mt: 0.45, height: 20, fontSize: 10 }}
                />
              </Box>
            );
          })
        )}
      </Stack>
    </Box>
  );
}

function SummaryRow({ title, summary, colorMap }) {
  const entries = Object.entries(summary || {});

  return (
    <Paper variant="outlined" sx={{ p: 1, borderRadius: 1 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mb: 0.7 }}
      >
        {title}
      </Typography>

      <Stack direction="row" spacing={0.6} useFlexGap flexWrap="wrap">
        {entries.length === 0 ? (
          <Chip size="small" label="Sin datos" variant="outlined" />
        ) : (
          entries.map(([key, value]) => {
            const status = getStatusChip(key);
            return (
              <Chip
                key={key}
                size="small"
                color={colorMap?.[key] || status.color}
                label={`${status.label}: ${value}`}
              />
            );
          })
        )}
      </Stack>
    </Paper>
  );
}

export default function ReadOnlyWeeklyAgendaBoard({
  title = "Agenda semanal",
  data,
  loading,
  error,
  onPrevWeek,
  onNextWeek,
  showStudentName = true,
  emptyMessage = "Sin clases",
}) {
  const weekDays = useMemo(
    () => buildWeekDays(data?.semana?.inicio),
    [data?.semana?.inicio],
  );

  const classesByDay = useMemo(() => {
    const map = new Map();

    WEEK_DAYS.forEach((day) => {
      map.set(day.id, []);
    });

    (data?.clasesSemana || []).forEach((clase) => {
      const dayId = getWeekDayIdFromValue(clase.fecha);

      if (!dayId) {
        return;
      }

      const current = map.get(dayId) || [];
      current.push(clase);
      map.set(dayId, current);
    });

    WEEK_DAYS.forEach((day) => {
      const sorted = (map.get(day.id) || []).sort(
        (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime(),
      );
      map.set(day.id, sorted);
    });

    return map;
  }, [data?.clasesSemana]);

  if (loading && !data) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 1 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          flexWrap: "wrap",
          mb: 0.8,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={700}>
            {title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Vista de solo lectura. Navega por semanas y revisa carga por estado.
          </Typography>
        </Box>

        <Stack direction="row" alignItems="center" spacing={0.2}>
          <IconButton size="small" onClick={onPrevWeek} disabled={loading}>
            <NavigateBeforeIcon fontSize="small" />
          </IconButton>

          <Typography
            variant="body2"
            fontWeight={700}
            sx={{ minWidth: 180, textAlign: "center" }}
          >
            {formatDate(data?.semana?.inicio, true)} -{" "}
            {formatDate(data?.semana?.fin, true)}
          </Typography>

          <IconButton size="small" onClick={onNextWeek} disabled={loading}>
            <NavigateNextIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>

      {error ? (
        <Alert severity="error" sx={{ mb: 1 }}>
          {error}
        </Alert>
      ) : null}

      <Box
        sx={{
          display: "grid",
          gap: 1,
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          mb: 1,
        }}
      >
        <SummaryRow
          title={`Clases de la semana: ${(data?.clasesSemana || []).length}`}
          summary={data?.resumenSemanaPorEstado}
        />

        <SummaryRow
          title={`Mes visible (${data?.mesVisible?.month || "-"}/${data?.mesVisible?.year || "-"}): ${data?.mesVisible?.totalClases || 0} clases`}
          summary={data?.resumenMesPorEstado}
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(7, minmax(0, 1fr))",
          },
          gap: 0.8,
          opacity: loading ? 0.75 : 1,
          transition: "opacity 180ms ease",
        }}
      >
        {weekDays.map((day) => (
          <DayColumn
            key={`${day.id}-${String(day.date || "nodate")}`}
            day={day}
            classes={classesByDay.get(day.id) || []}
            showStudentName={showStudentName}
            emptyMessage={emptyMessage}
          />
        ))}
      </Box>
    </Paper>
  );
}
