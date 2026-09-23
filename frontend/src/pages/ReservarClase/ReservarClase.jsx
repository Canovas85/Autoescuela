import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
  Link,
} from "@mui/material";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import PersonIcon from "@mui/icons-material/Person";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";

import { clasesPracticasPortalService } from "../../services/clasesPracticasPortalService";
import { useNavigate } from "react-router-dom";
import {
  addDaysToDateKey,
  dateFromKeyAtNoon,
  extractDateKey,
  formatDateValue,
  getWeekDayIdFromValue,
} from "../../utils/calendarDate";

const DAYS = [
  "Lunes",
  "Martes",
  "Miercoles",
  "Jueves",
  "Viernes",
  "Sabado",
  "Domingo",
];

const DAY_NAME_BY_ID = {
  1: "Lunes",
  2: "Martes",
  3: "Miercoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sabado",
  7: "Domingo",
};

const STUDENT_AGENDA_PALETTE = [
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

const COMPLETED_CLASS_STATES = [
  "COMPLETADA",
  "REALIZADA",
  "FINALIZADA",
  "REGISTRADA",
];

const formatDateOnly = (value) => {
  const text = formatDateValue(value, {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

  return text || "-";
};

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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

const formatHourRange = (value, duracion = 45) => {
  const startDate = new Date(value);

  if (Number.isNaN(startDate.getTime())) {
    return "--:-- - --:--";
  }

  const endDate = new Date(startDate);
  endDate.setMinutes(endDate.getMinutes() + (Number(duracion) || 45));

  return `${formatHour(startDate)} - ${formatHour(endDate)}`;
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

  if (normalized === "COMPLETADA") {
    return { label: "COMPLETADA", color: "success" };
  }

  if (normalized === "CONFIRMADA") {
    return { label: "CONFIRMADA", color: "primary" };
  }

  if (normalized === "PROGRAMADA") {
    return { label: "PROGRAMADA", color: "default" };
  }

  return { label: normalized || "SIN ESTADO", color: "default" };
};

const getAgendaItemTypeChip = (type) => {
  if (type === "REALIZADA") {
    return { label: "EFECTUADA", color: "success" };
  }

  if (type === "SOLICITUD") {
    return { label: "SOLICITUD", color: "warning" };
  }

  return { label: "PROXIMA", color: "info" };
};

const getColorByAgendaItem = (item) => {
  const seed = String(item?.profesor?.id || item?.profesor?.nombre || item?.id);
  let hash = 0;

  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }

  const index = Math.abs(hash) % STUDENT_AGENDA_PALETTE.length;
  return STUDENT_AGENDA_PALETTE[index];
};

const isCompletedWithRoadmap = (item) => {
  const status = String(item?.estado || "").toUpperCase();
  return COMPLETED_CLASS_STATES.includes(status) && Boolean(item?.hojaRutaId);
};

const combineDateAndHour = (weekStart, dayIndex, hourText) => {
  const weekStartKey = extractDateKey(weekStart);
  const dayKey = addDaysToDateKey(weekStartKey, dayIndex);
  const date = dateFromKeyAtNoon(dayKey);

  if (!date) {
    return null;
  }

  const [hh, mm] = hourText.split(":").map(Number);
  date.setHours(hh, mm, 0, 0);

  return date;
};

const canStudentCancelClass = (clase) => {
  const status = String(clase?.estado || "").toUpperCase();

  if (!["PROGRAMADA", "CONFIRMADA"].includes(status)) {
    return false;
  }

  const classDate = new Date(clase?.fecha);

  if (Number.isNaN(classDate.getTime())) {
    return false;
  }

  const diffMs = classDate.getTime() - Date.now();
  return diffMs > 24 * 60 * 60 * 1000;
};

export default function ReservarClase() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);
  const [context, setContext] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [step, setStep] = useState("seleccion");
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedHour, setSelectedHour] = useState("");
  const [metodoPago, setMetodoPago] = useState("INDIVIDUAL");
  const [selectedBonoId, setSelectedBonoId] = useState("");

  const loadContext = async (offset = weekOffset) => {
    setLoading(true);
    setError("");

    try {
      const data =
        await clasesPracticasPortalService.getStudentBookingContext(offset);
      setContext(data);

      const bonos = data?.pago?.bonosDisponibles || [];
      if (bonos.length > 0) {
        setMetodoPago("BONO");
        setSelectedBonoId(bonos[0].id);
      } else {
        setMetodoPago("INDIVIDUAL");
        setSelectedBonoId("");
      }

      const firstDay = (data?.calendarioSemana?.dias || []).findIndex(
        (day) => day.disponibles > 0,
      );
      const safeDay = firstDay >= 0 ? firstDay : 0;
      setSelectedDay(safeDay);

      const firstHour =
        data?.calendarioSemana?.dias?.[safeDay]?.slots?.find(
          (slot) => slot.disponible,
        )?.hora || "";
      setSelectedHour(firstHour);
    } catch (loadError) {
      setError(
        loadError.response?.data?.message ||
          "No se pudo cargar el panel de solicitud de clases",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContext(weekOffset);
  }, [weekOffset]);

  const days = context?.calendarioSemana?.dias || [];
  const currentDay = days[selectedDay] || null;

  const agendaWeekDays = useMemo(() => {
    const weekStartKey = extractDateKey(context?.calendarioSemana?.inicio);

    if (!weekStartKey) {
      return Object.entries(DAY_NAME_BY_ID).map(([id, label]) => ({
        id: Number(id),
        label,
        date: null,
      }));
    }

    return Object.entries(DAY_NAME_BY_ID).map(([id, label]) => {
      const dayOffset = Number(id) - 1;
      const date = dateFromKeyAtNoon(addDaysToDateKey(weekStartKey, dayOffset));

      return {
        id: Number(id),
        label,
        date,
      };
    });
  }, [context?.calendarioSemana?.inicio]);

  const agendaByDay = useMemo(() => {
    const map = new Map();
    agendaWeekDays.forEach((day) => map.set(day.id, []));

    const classesMap = new Map();
    const now = new Date();

    (context?.solicitudesPendientes || []).forEach((item) => {
      classesMap.set(item.id, {
        ...item,
        agendaType: "SOLICITUD",
      });
    });

    (context?.proximasClases || []).forEach((item) => {
      const classDate = new Date(item.fecha);
      classesMap.set(item.id, {
        ...item,
        agendaType: classDate < now ? "REALIZADA" : "PROXIMA",
      });
    });

    for (const item of classesMap.values()) {
      const classDate = new Date(item.fecha);

      if (Number.isNaN(classDate.getTime())) {
        continue;
      }

      const dayId = getWeekDayIdFromValue(classDate);

      if (!map.has(dayId)) {
        continue;
      }

      map.get(dayId).push(item);
    }

    for (const day of agendaWeekDays) {
      const sorted = (map.get(day.id) || []).sort(
        (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime(),
      );
      map.set(day.id, sorted);
    }

    return map;
  }, [agendaWeekDays, context?.proximasClases, context?.solicitudesPendientes]);

  const selectedDate = useMemo(() => {
    if (!context?.calendarioSemana?.inicio || !selectedHour) {
      return null;
    }

    return combineDateAndHour(
      context.calendarioSemana.inicio,
      selectedDay,
      selectedHour,
    );
  }, [context?.calendarioSemana?.inicio, selectedDay, selectedHour]);

  const handleNextStep = () => {
    if (!selectedHour || !selectedDate) {
      setError("Selecciona primero una fecha y una hora disponible");
      return;
    }

    setError("");
    setStep("resumen");
  };

  const handleSubmitRequest = async () => {
    if (!selectedDate) {
      setError("No hay fecha seleccionada");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await clasesPracticasPortalService.createStudentRequest({
        fecha: selectedDate.toISOString(),
        metodoPago,
        compraBonoId: metodoPago === "BONO" ? selectedBonoId : null,
      });

      setSuccess("Solicitud enviada correctamente al profesor");
      setStep("seleccion");
      await loadContext(weekOffset);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "No se pudo solicitar la clase",
      );
    } finally {
      setSaving(false);
    }
  };

  const cancelarSolicitud = async (id) => {
    try {
      await clasesPracticasPortalService.cancelStudentRequest(id);
      setSuccess("Solicitud cancelada correctamente");
      await loadContext(weekOffset);
    } catch (cancelError) {
      setError(
        cancelError.response?.data?.message ||
          "No se pudo cancelar la solicitud",
      );
    }
  };

  if (loading) {
    return <Typography>Cargando solicitud de clases...</Typography>;
  }

  const elegibilidad = context?.elegibilidad;
  const bloqueos = Array.isArray(elegibilidad?.bloqueos)
    ? elegibilidad.bloqueos.filter(Boolean)
    : [];
  const mensajeBloqueoPrincipal =
    bloqueos[0] ||
    "Para solicitar clase práctica necesitas tener el examen teórico en estado APTO.";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box>
        <Typography variant="h4" fontWeight={800}>
          Solicitud de clase práctica
        </Typography>
        <Typography color="text.secondary">
          Reserva una franja en la agenda de tu profesor y envía la solicitud
          para confirmación.
        </Typography>
      </Box>

      {error ? <Alert severity="error">{error}</Alert> : null}
      {success ? <Alert severity="success">{success}</Alert> : null}

      {!elegibilidad?.permitido ? (
        <Card sx={{ border: "2px solid #f59e0b", backgroundColor: "#fff7ed" }}>
          <CardContent>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <EventBusyIcon color="warning" />
              <Typography variant="h6" fontWeight={800}>
                Aún no puedes reservar clases prácticas
              </Typography>
            </Stack>
            <Typography sx={{ mt: 1 }}>{mensajeBloqueoPrincipal}</Typography>

            {bloqueos.length > 1 ? (
              <Typography sx={{ mt: 0.75 }} color="text.secondary">
                {bloqueos.slice(1).join(" · ")}
              </Typography>
            ) : null}

            <Stack
              direction="row"
              spacing={1}
              sx={{ mt: 2 }}
              useFlexGap
              flexWrap="wrap"
            >
              <Chip
                color="info"
                label={`Vidas disponibles: ${elegibilidad?.vidas?.disponibles ?? 0}`}
                sx={{ fontSize: 16, px: 1, py: 2.2, fontWeight: 800 }}
              />

              {elegibilidad?.examenTeoricoProgramado?.fecha ? (
                <Chip
                  color="secondary"
                  label={`Tu teórico está programado: ${formatDate(elegibilidad.examenTeoricoProgramado.fecha)}`}
                />
              ) : null}
            </Stack>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardContent>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            useFlexGap
            flexWrap="wrap"
          >
            <Chip
              icon={<EventAvailableIcon />}
              color="success"
              label={`Vidas restantes: ${elegibilidad?.vidas?.disponibles ?? 0}`}
              sx={{ fontWeight: 700 }}
            />
            <Chip
              label={`Profesor: ${context?.calendarioSemana?.profesor?.nombre || "Sin asignar"}`}
              color="primary"
              variant="outlined"
            />
            <Chip
              label={`Precio clase: ${Number(context?.pago?.precioClase || 35).toFixed(2)} EUR`}
              color="default"
            />
          </Stack>
        </CardContent>
      </Card>

      {elegibilidad?.permitido ? (
        <>
          {step === "seleccion" ? (
            <Grid container spacing={2}>
              <Grid item xs={12} md={7}>
                <Paper sx={{ p: 2, border: "1px solid #e2e8f0" }}>
                  <Box
                    sx={{
                      mb: 1,
                      display: "grid",
                      gridTemplateColumns: "1fr auto 1fr",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                      <Button
                        startIcon={<NavigateBeforeIcon />}
                        onClick={() => setWeekOffset((prev) => prev - 1)}
                      >
                        Semana anterior
                      </Button>
                    </Box>

                    <Typography
                      fontWeight={700}
                      sx={{ textAlign: "center", whiteSpace: "nowrap" }}
                    >
                      {formatDateOnly(context?.calendarioSemana?.inicio)} -{" "}
                      {formatDateOnly(context?.calendarioSemana?.fin)}
                    </Typography>

                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Button
                        endIcon={<NavigateNextIcon />}
                        onClick={() => setWeekOffset((prev) => prev + 1)}
                      >
                        Próxima semana
                      </Button>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 1.5 }} />

                  <Grid container spacing={1}>
                    {days.map((day, index) => (
                      <Grid key={day.diaSemana} item xs={12} sm={6} md={4}>
                        <Card
                          onClick={() => {
                            setSelectedDay(index);
                            const firstAvailable =
                              day.slots.find((slot) => slot.disponible)?.hora ||
                              "";
                            setSelectedHour(firstAvailable);
                          }}
                          sx={{
                            cursor: "pointer",
                            border:
                              selectedDay === index
                                ? "2px solid #2563eb"
                                : "1px solid #e2e8f0",
                            backgroundColor:
                              selectedDay === index ? "#eff6ff" : "#fff",
                          }}
                        >
                          <CardContent sx={{ py: 1.2 }}>
                            <Typography fontWeight={700}>
                              {DAY_NAME_BY_ID[day.diaSemana] || DAYS[index]}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {formatDateOnly(
                                addDaysToDateKey(
                                  extractDateKey(
                                    context?.calendarioSemana?.inicio,
                                  ),
                                  day.diaSemana - 1,
                                ),
                              )}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {day.disponibles}/{day.totalSlots} huecos
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>

              <Grid item xs={12} md={5}>
                <Paper sx={{ p: 2, border: "1px solid #e2e8f0" }}>
                  <Typography variant="h6" fontWeight={800}>
                    Horas disponibles (
                    {currentDay
                      ? DAY_NAME_BY_ID[currentDay.diaSemana] ||
                        DAYS[selectedDay]
                      : "-"}
                    )
                  </Typography>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                      gap: 1,
                      mt: 1.5,
                    }}
                  >
                    {(currentDay?.slots || []).map((slot) => (
                      <Button
                        key={slot.hora}
                        variant={
                          selectedHour === slot.hora ? "contained" : "outlined"
                        }
                        disabled={!slot.disponible}
                        color={slot.disponible ? "primary" : "error"}
                        sx={
                          !slot.disponible
                            ? {
                                borderColor: "#ef4444",
                                color: "#ef4444",
                                backgroundColor: "#fef2f2",
                              }
                            : undefined
                        }
                        onClick={() => setSelectedHour(slot.hora)}
                      >
                        {slot.hora}
                      </Button>
                    ))}
                  </Box>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1, display: "block" }}
                  >
                    Las horas en rojo están ocupadas y no se pueden solicitar.
                  </Typography>

                  <Button
                    fullWidth
                    sx={{ mt: 2 }}
                    variant="contained"
                    onClick={handleNextStep}
                  >
                    Siguiente
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          ) : (
            <Paper sx={{ p: 2, border: "1px solid #e2e8f0" }}>
              <Typography variant="h6" fontWeight={800}>
                Resumen de solicitud
              </Typography>
              <Typography sx={{ mt: 1 }}>
                Fecha y hora: <b>{formatDate(selectedDate)}</b>
              </Typography>
              <Typography>
                Profesor: <b>{context?.calendarioSemana?.profesor?.nombre}</b>
              </Typography>
              <Typography>
                Duración: <b>45 minutos</b>
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" fontWeight={800}>
                Forma de pago
              </Typography>

              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Button
                  variant={metodoPago === "BONO" ? "contained" : "outlined"}
                  onClick={() => setMetodoPago("BONO")}
                  disabled={
                    (context?.pago?.bonosDisponibles || []).length === 0
                  }
                >
                  Bono
                </Button>
                <Button
                  variant={
                    metodoPago === "INDIVIDUAL" ? "contained" : "outlined"
                  }
                  onClick={() => setMetodoPago("INDIVIDUAL")}
                  startIcon={<CreditCardIcon />}
                >
                  Clase individual
                </Button>
              </Stack>

              {metodoPago === "BONO" ? (
                <Box sx={{ mt: 1.5 }}>
                  <Select
                    fullWidth
                    value={selectedBonoId}
                    onChange={(event) => setSelectedBonoId(event.target.value)}
                  >
                    {(context?.pago?.bonosDisponibles || []).map((bono) => (
                      <MenuItem value={bono.id} key={bono.id}>
                        {bono.nombre} ({bono.clasesDisponibles} clases)
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              ) : (
                <Alert sx={{ mt: 1.5 }} severity="info">
                  El pago quedará pendiente al confirmar el profesor y deberá
                  abonarse mínimo 24h antes.
                </Alert>
              )}

              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Button variant="outlined" onClick={() => setStep("seleccion")}>
                  Volver
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmitRequest}
                  disabled={saving}
                >
                  Solicitar clase
                </Button>
              </Stack>
            </Paper>
          )}

          <Paper sx={{ p: 2, border: "1px solid #e2e8f0" }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", md: "center" }}
              spacing={1}
            >
              <Box>
                <Typography variant="h6" fontWeight={800}>
                  Agenda de mis clases
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Vista semanal con próximas clases, solicitudes y clases
                  efectuadas.
                </Typography>
              </Box>

              <Stack direction="row" spacing={0.8} useFlexGap flexWrap="wrap">
                <Chip size="small" label="Próxima" color="info" />
                <Chip size="small" label="Solicitud" color="warning" />
                <Chip size="small" label="Efectuada" color="success" />
              </Stack>
            </Stack>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(7, minmax(0, 1fr))",
                },
                gap: 1,
                mt: 1.5,
              }}
            >
              {agendaWeekDays.map((day) => {
                const dayClasses = agendaByDay.get(day.id) || [];

                return (
                  <Box
                    key={day.id}
                    sx={{
                      border: "1px solid #e2e8f0",
                      borderRadius: 1,
                      p: 1,
                      minHeight: 220,
                      backgroundColor: "#f8fafc",
                    }}
                  >
                    <Typography fontWeight={700} variant="body2">
                      {day.label}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mb: 1 }}
                    >
                      {formatDateOnly(day.date)}
                    </Typography>

                    <Stack spacing={0.8}>
                      {dayClasses.length ? (
                        dayClasses.map((item) => {
                          const color = getColorByAgendaItem(item);
                          const typeChip = getAgendaItemTypeChip(
                            item.agendaType,
                          );
                          const statusChip = getAgendaStatusChipConfig(
                            item.estado,
                          );

                          return (
                            <Box
                              key={item.id}
                              sx={{
                                border: "1px solid",
                                borderColor: color.border,
                                borderRadius: 1.5,
                                p: 0.9,
                                bgcolor: color.bg,
                              }}
                            >
                              <Typography
                                variant="caption"
                                fontWeight={700}
                                sx={{ color: color.title }}
                              >
                                {formatHourRange(item.fecha, item.duracion)}
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
                                    color: color.title,
                                  }}
                                />
                                <Typography
                                  variant="caption"
                                  fontWeight={700}
                                  sx={{ color: color.title }}
                                >
                                  {item.profesor?.nombre || "Profesor"}
                                </Typography>
                              </Stack>

                              <Stack
                                direction="row"
                                spacing={0.5}
                                alignItems="center"
                                sx={{ mt: 0.2 }}
                              >
                                <DirectionsCarIcon
                                  sx={{ fontSize: 13, color: "text.secondary" }}
                                />
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {item.vehiculo?.marca || "Vehiculo"}{" "}
                                  {item.vehiculo?.modelo || ""}
                                </Typography>
                              </Stack>

                              <Stack
                                direction="row"
                                spacing={0.5}
                                sx={{ mt: 0.5 }}
                              >
                                <Chip
                                  size="small"
                                  color={typeChip.color}
                                  label={typeChip.label}
                                  sx={{ height: 20, fontSize: 10 }}
                                />
                                <Chip
                                  size="small"
                                  color={statusChip.color}
                                  label={statusChip.label}
                                  sx={{ height: 20, fontSize: 10 }}
                                />
                              </Stack>

                              <Stack sx={{ mt: 0.6 }}>
                                {canStudentCancelClass(item) ? (
                                  <Button
                                    color="error"
                                    size="small"
                                    onClick={() => cancelarSolicitud(item.id)}
                                    sx={{
                                      px: 0,
                                      justifyContent: "flex-start",
                                      minWidth: "auto",
                                    }}
                                  >
                                    Cancelar
                                  </Button>
                                ) : null}

                                {isCompletedWithRoadmap(item) ? (
                                  <Link
                                    component="button"
                                    variant="caption"
                                    onClick={() =>
                                      navigate(
                                        `/hojas-ruta?roadmapId=${item.hojaRutaId}`,
                                      )
                                    }
                                    sx={{ textAlign: "left" }}
                                  >
                                    Ver hoja de ruta
                                  </Link>
                                ) : null}

                                {!canStudentCancelClass(item) &&
                                !isCompletedWithRoadmap(item) &&
                                ["PROGRAMADA", "CONFIRMADA"].includes(
                                  String(item?.estado || "").toUpperCase(),
                                ) ? (
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    Menos de 24h
                                  </Typography>
                                ) : null}
                              </Stack>
                            </Box>
                          );
                        })
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          Sin clases
                        </Typography>
                      )}
                    </Stack>
                  </Box>
                );
              })}
            </Box>
          </Paper>
        </>
      ) : null}
    </Box>
  );
}
