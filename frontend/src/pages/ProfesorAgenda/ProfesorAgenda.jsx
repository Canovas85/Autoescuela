import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
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

const MIN_HOUR = 6;
const MAX_HOUR = 22;
const HOUR_HEIGHT = 62;

const formatDate = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
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
  return day === 0 ? 7 : day;
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

export default function ProfesorAgenda() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [agenda, setAgenda] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [savingClassId, setSavingClassId] = useState("");

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

  const classesByDay = useMemo(() => {
    const map = new Map();
    DAYS.forEach((day) => map.set(day.id, []));

    (agenda?.clases || []).forEach((clase) => {
      const dayId = dateToDayId(clase.fecha);
      const list = map.get(dayId) || [];
      list.push(clase);
      map.set(dayId, list);
    });

    return map;
  }, [agenda]);

  const workBlocksByDay = useMemo(() => {
    const map = new Map();
    DAYS.forEach((day) => map.set(day.id, []));

    scheduleBlocks.forEach((block) => {
      const list = map.get(Number(block.diaSemana)) || [];
      list.push(block);
      map.set(Number(block.diaSemana), list);
    });

    return map;
  }, [scheduleBlocks]);

  const timelineHeight = (MAX_HOUR - MIN_HOUR) * HOUR_HEIGHT;

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
      <Typography variant="h4" fontWeight={800} mb={1.2}>
        Mi agenda
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 2.5 }}>
        Agenda semanal de clases practicas. Puedes ajustar tu horario por dias,
        confirmar clases programadas o cancelarlas.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 2.5, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={700}>
          Mi horario de trabajo
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Define bloques por dia. Puedes usar horario continuo o partido. Maximo
          8 horas por dia.
        </Typography>

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={1.5}
          sx={{ mt: 2, alignItems: { md: "center" } }}
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

          <Button variant="outlined" startIcon={<AddIcon />} onClick={addBlock}>
            Anadir bloque
          </Button>

          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={saving}
            onClick={saveSchedule}
          >
            Guardar horario
          </Button>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
          {scheduleBlocks.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No hay bloques definidos. Anade bloques para mostrar tu jornada.
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
      </Paper>

      <Paper sx={{ p: 2, borderRadius: 3 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "center" }}
          spacing={1.5}
          sx={{ mb: 2 }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton onClick={() => setWeekOffset((prev) => prev - 1)}>
              <NavigateBeforeIcon />
            </IconButton>

            <Typography fontWeight={700}>
              {formatWeekLabel(agenda?.semana)}
            </Typography>

            <IconButton onClick={() => setWeekOffset((prev) => prev + 1)}>
              <NavigateNextIcon />
            </IconButton>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={() => setWeekOffset(0)}>
              Hoy
            </Button>

            <Button variant="outlined" onClick={() => loadAgenda(weekOffset)}>
              Recargar
            </Button>
          </Stack>
        </Stack>

        {loading ? (
          <Typography color="text.secondary">Cargando agenda...</Typography>
        ) : (
          <Box sx={{ overflowX: "auto" }}>
            <Grid container sx={{ minWidth: 1100 }}>
              <Grid item xs={1.35}>
                <Box sx={{ height: 52, borderBottom: "1px solid #e5e7eb" }} />

                <Box sx={{ position: "relative", height: timelineHeight }}>
                  {Array.from({ length: MAX_HOUR - MIN_HOUR + 1 }).map(
                    (_, index) => {
                      const hour = MIN_HOUR + index;
                      const top = index * HOUR_HEIGHT;

                      return (
                        <Box
                          key={hour}
                          sx={{
                            position: "absolute",
                            top,
                            left: 0,
                            right: 0,
                            height: HOUR_HEIGHT,
                            borderTop: "1px solid #eef2f7",
                            pr: 1,
                          }}
                        >
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              position: "absolute",
                              top: -7,
                              left: 0,
                              fontWeight: 600,
                            }}
                          >
                            {`${String(hour).padStart(2, "0")}:00`}
                          </Typography>
                        </Box>
                      );
                    },
                  )}
                </Box>
              </Grid>

              <Grid item xs>
                <Grid container>
                  {DAYS.map((day) => (
                    <Grid item xs key={day.id}>
                      <Box
                        sx={{
                          p: 1,
                          height: 52,
                          borderBottom: "1px solid #e5e7eb",
                          borderLeft: "1px solid #f1f5f9",
                        }}
                      >
                        <Typography fontWeight={700} variant="body2">
                          {day.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {day.short}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          position: "relative",
                          height: timelineHeight,
                          borderLeft: "1px solid #f1f5f9",
                          backgroundColor: "#fcfdff",
                        }}
                      >
                        {Array.from({ length: MAX_HOUR - MIN_HOUR + 1 }).map(
                          (_, index) => (
                            <Box
                              key={index}
                              sx={{
                                position: "absolute",
                                top: index * HOUR_HEIGHT,
                                left: 0,
                                right: 0,
                                borderTop: "1px solid #eef2f7",
                              }}
                            />
                          ),
                        )}

                        {(workBlocksByDay.get(day.id) || []).map(
                          (block, idx) => {
                            const start = timeToMinutes(block.horaInicio);
                            const end = timeToMinutes(block.horaFin);
                            const offset = start - MIN_HOUR * 60;

                            if (
                              Number.isNaN(start) ||
                              Number.isNaN(end) ||
                              offset < 0
                            ) {
                              return null;
                            }

                            return (
                              <Box
                                key={`${day.id}-work-${idx}`}
                                sx={{
                                  position: "absolute",
                                  top: (offset / 60) * HOUR_HEIGHT,
                                  left: 4,
                                  right: 4,
                                  height: ((end - start) / 60) * HOUR_HEIGHT,
                                  backgroundColor: "rgba(37,99,235,0.10)",
                                  border: "1px dashed rgba(37,99,235,0.35)",
                                  borderRadius: 1,
                                }}
                              />
                            );
                          },
                        )}

                        {(classesByDay.get(day.id) || []).map((clase) => {
                          const date = new Date(clase.fecha);
                          const start =
                            date.getHours() * 60 + date.getMinutes();
                          const offset = start - MIN_HOUR * 60;
                          const duration = Number(clase.duracion) || 45;

                          if (
                            offset < 0 ||
                            offset > (MAX_HOUR - MIN_HOUR) * 60
                          ) {
                            return null;
                          }

                          const isProgramada = clase.estado === "PROGRAMADA";

                          return (
                            <Box
                              key={clase.id}
                              sx={{
                                position: "absolute",
                                top: (offset / 60) * HOUR_HEIGHT,
                                left: 7,
                                right: 7,
                                minHeight: 54,
                                height: Math.max(
                                  (duration / 60) * HOUR_HEIGHT,
                                  54,
                                ),
                                p: 1,
                                borderRadius: 2,
                                border: "1px solid",
                                borderColor:
                                  clase.estado === "CONFIRMADA"
                                    ? "#16a34a"
                                    : "#2563eb",
                                backgroundColor:
                                  clase.estado === "CONFIRMADA"
                                    ? "#ecfdf3"
                                    : "#eff6ff",
                                overflow: "hidden",
                              }}
                            >
                              <Typography variant="caption" fontWeight={700}>
                                {`${formatHour(clase.fecha)} - ${minutesToTime(start + duration)}`}
                              </Typography>

                              <Typography
                                variant="body2"
                                sx={{ lineHeight: 1.2, mt: 0.2 }}
                                fontWeight={700}
                              >
                                {clase.alumno?.nombre || "Alumno"}
                              </Typography>

                              <Typography
                                variant="caption"
                                display="block"
                                color="text.secondary"
                              >
                                {clase.vehiculo?.marca || "Vehiculo"}{" "}
                                {clase.vehiculo?.modelo || ""}
                              </Typography>

                              <Typography
                                variant="caption"
                                display="block"
                                color="text.secondary"
                              >
                                {clase.vehiculo?.matricula || "Sin matricula"}
                              </Typography>

                              <Stack
                                direction="row"
                                spacing={0.7}
                                sx={{ mt: 0.6 }}
                              >
                                <Chip
                                  size="small"
                                  label={clase.estado}
                                  color={
                                    clase.estado === "CONFIRMADA"
                                      ? "success"
                                      : "primary"
                                  }
                                />

                                {isProgramada && (
                                  <>
                                    <Chip
                                      size="small"
                                      color="success"
                                      label="Confirmar"
                                      icon={<CheckCircleIcon />}
                                      onClick={() =>
                                        handleClassStatus(
                                          clase.id,
                                          "CONFIRMADA",
                                        )
                                      }
                                      disabled={savingClassId === clase.id}
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
                                    />
                                  </>
                                )}
                              </Stack>
                            </Box>
                          );
                        })}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
