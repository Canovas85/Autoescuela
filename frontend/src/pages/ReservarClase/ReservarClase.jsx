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

import { clasesPracticasPortalService } from "../../services/clasesPracticasPortalService";
import { useNavigate } from "react-router-dom";

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

const formatDateOnlyUtc = (value) => {
  if (!value) return "-";

  return new Date(value).toLocaleDateString("es-ES", {
    timeZone: "UTC",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
};

const addDaysToUtcDate = (value, days) => {
  const start = new Date(value);

  return new Date(
    Date.UTC(
      start.getUTCFullYear(),
      start.getUTCMonth(),
      start.getUTCDate() + days,
      12,
      0,
      0,
      0,
    ),
  );
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

const combineDateAndHour = (weekStart, dayIndex, hourText) => {
  const date = addDaysToUtcDate(weekStart, dayIndex);

  const [hh, mm] = hourText.split(":").map(Number);
  date.setHours(hh, mm, 0, 0);

  return date;
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

  const realizadas = useMemo(() => {
    const now = new Date();
    return (context?.proximasClases || []).filter(
      (item) => new Date(item.fecha) < now,
    );
  }, [context?.proximasClases]);

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
                      {formatDateOnlyUtc(context?.calendarioSemana?.inicio)} -{" "}
                      {formatDateOnlyUtc(context?.calendarioSemana?.fin)}
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
                              {formatDateOnlyUtc(
                                addDaysToUtcDate(
                                  context?.calendarioSemana?.inicio,
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

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, border: "1px solid #e2e8f0" }}>
                <Typography variant="h6" fontWeight={800}>
                  Mis próximas clases
                </Typography>
                {(context?.proximasClases || []).length === 0 ? (
                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    No tienes clases confirmadas próximas.
                  </Typography>
                ) : (
                  <Box sx={{ mt: 1, overflowX: "auto" }}>
                    <Box sx={{ minWidth: 840 }}>
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "2fr 1.4fr 1.6fr 1fr",
                          gap: 1,
                          px: 1,
                          py: 0.5,
                          borderBottom: "1px solid #e2e8f0",
                        }}
                      >
                        <Typography variant="caption" fontWeight={700}>
                          Fecha
                        </Typography>
                        <Typography variant="caption" fontWeight={700}>
                          Profesor
                        </Typography>
                        <Typography variant="caption" fontWeight={700}>
                          Vehículo
                        </Typography>
                        <Typography variant="caption" fontWeight={700}>
                          Estado
                        </Typography>
                      </Box>
                      {(context?.proximasClases || []).map((item) => (
                        <Box
                          key={item.id}
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "2fr 1.4fr 1.6fr 1fr",
                            gap: 1,
                            px: 1,
                            py: 1,
                            borderBottom: "1px solid #f1f5f9",
                          }}
                        >
                          <Typography variant="body2" fontWeight={600}>
                            {formatDate(item.fecha)}
                          </Typography>
                          <Typography variant="body2">
                            {item.profesor?.nombre}
                          </Typography>
                          <Typography variant="body2">
                            {item.vehiculo?.marca} {item.vehiculo?.modelo}
                          </Typography>
                          <Typography variant="body2">{item.estado}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, border: "1px solid #e2e8f0" }}>
                <Typography variant="h6" fontWeight={800}>
                  Solicitudes pendientes
                </Typography>
                {(context?.solicitudesPendientes || []).length === 0 ? (
                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    No tienes solicitudes pendientes.
                  </Typography>
                ) : (
                  <Box sx={{ mt: 1, overflowX: "auto" }}>
                    <Box sx={{ minWidth: 900 }}>
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "2fr 1.4fr 1.6fr 1fr 1fr",
                          gap: 1,
                          px: 1,
                          py: 0.5,
                          borderBottom: "1px solid #e2e8f0",
                        }}
                      >
                        <Typography variant="caption" fontWeight={700}>
                          Fecha
                        </Typography>
                        <Typography variant="caption" fontWeight={700}>
                          Profesor
                        </Typography>
                        <Typography variant="caption" fontWeight={700}>
                          Vehículo
                        </Typography>
                        <Typography variant="caption" fontWeight={700}>
                          Estado
                        </Typography>
                        <Typography variant="caption" fontWeight={700}>
                          Acción
                        </Typography>
                      </Box>
                      {context.solicitudesPendientes.map((item) => (
                        <Box
                          key={item.id}
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "2fr 1.4fr 1.6fr 1fr 1fr",
                            gap: 1,
                            px: 1,
                            py: 1,
                            borderBottom: "1px solid #f1f5f9",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="body2" fontWeight={600}>
                            {formatDate(item.fecha)}
                          </Typography>
                          <Typography variant="body2">
                            {item.profesor?.nombre}
                          </Typography>
                          <Typography variant="body2">
                            {item.vehiculo?.marca} {item.vehiculo?.modelo}
                          </Typography>
                          <Typography variant="body2">{item.estado}</Typography>
                          <Button
                            color="error"
                            size="small"
                            onClick={() => cancelarSolicitud(item.id)}
                          >
                            Cancelar
                          </Button>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 2, border: "1px solid #e2e8f0" }}>
                <Typography variant="h6" fontWeight={800}>
                  Clases efectuadas
                </Typography>
                {realizadas.length === 0 ? (
                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    No hay clases efectuadas todavía.
                  </Typography>
                ) : (
                  <Stack spacing={1} sx={{ mt: 1 }}>
                    {realizadas.map((item) => (
                      <Box
                        key={`done-${item.id}`}
                        sx={{
                          display: "grid",
                          gridTemplateColumns: {
                            xs: "1fr",
                            md: "2fr 1.3fr 1.3fr 1fr",
                          },
                          gap: 1,
                          p: 1,
                          border: "1px solid #e2e8f0",
                          borderRadius: 1.5,
                        }}
                      >
                        <Typography variant="body2" fontWeight={600}>
                          {formatDate(item.fecha)}
                        </Typography>
                        <Typography variant="body2">
                          Profesor: {item.profesor?.nombre || "-"}
                        </Typography>
                        <Typography variant="body2">
                          Vehículo: {item.vehiculo?.matricula || "-"}
                        </Typography>
                        {item.hojaRutaId ? (
                          <Link
                            component="button"
                            variant="body2"
                            onClick={() => navigate("/hojas-ruta")}
                          >
                            Ver hoja de ruta
                          </Link>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Sin hoja de ruta
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Stack>
                )}
              </Paper>
            </Grid>
          </Grid>
        </>
      ) : null}
    </Box>
  );
}
