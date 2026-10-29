import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import RouteIcon from "@mui/icons-material/Route";
import { useNavigate } from "react-router-dom";

import { clasesPracticasPortalService } from "../../services/clasesPracticasPortalService";
import { LicenseChip } from "../../components/common/LicenseChip";
import { PracticalClassTypeChip } from "../../components/common/PracticalClassTypeChip";

const formatDate = (value) =>
  new Date(value).toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const colorByState = (state) => {
  if (state === "PROGRAMADA") return "warning";
  if (state === "CONFIRMADA") return "info";
  if (state === "REALIZADA") return "success";
  if (state.includes("CANCELADA")) return "error";
  return "default";
};

const canProfessorCancelClass = (clase) => {
  const status = String(clase?.estado || "").toUpperCase();

  if (!["PROGRAMADA", "CONFIRMADA"].includes(status)) {
    return false;
  }

  return true;
};

export default function ClasesPracticasProfesor() {
  const navigate = useNavigate();
  const VISIBLE_ITEMS = 5;

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pendingStart, setPendingStart] = useState(0);
  const [confirmedStart, setConfirmedStart] = useState(0);
  const [historyDateFrom, setHistoryDateFrom] = useState("");
  const [historyDateTo, setHistoryDateTo] = useState("");
  const [historyStudentSearch, setHistoryStudentSearch] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await clasesPracticasPortalService.getProfessorRequests();
      setRows(data || []);
    } catch (loadError) {
      setError(
        loadError.response?.data?.message ||
          "No se pudieron cargar las solicitudes de clases",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const pendientes = useMemo(
    () => rows.filter((item) => item.estado === "PROGRAMADA"),
    [rows],
  );

  const confirmadas = useMemo(
    () => rows.filter((item) => item.estado === "CONFIRMADA"),
    [rows],
  );

  const historico = useMemo(
    () =>
      rows.filter(
        (item) => item.estado !== "PROGRAMADA" && item.estado !== "CONFIRMADA",
      ),
    [rows],
  );

  const historicoFiltrado = useMemo(() => {
    const search = historyStudentSearch.trim().toLowerCase();
    const fromDate = historyDateFrom
      ? new Date(`${historyDateFrom}T00:00:00`)
      : null;
    const toDate = historyDateTo ? new Date(`${historyDateTo}T23:59:59`) : null;

    return historico.filter((item) => {
      const alumno = String(item?.alumno?.nombre || "").toLowerCase();
      if (search && !alumno.includes(search)) {
        return false;
      }

      const fecha = new Date(item.fecha);
      if (Number.isNaN(fecha.getTime())) {
        return false;
      }

      if (fromDate && fecha < fromDate) {
        return false;
      }

      if (toDate && fecha > toDate) {
        return false;
      }

      return true;
    });
  }, [historico, historyStudentSearch, historyDateFrom, historyDateTo]);

  const pendingMaxStart = Math.max(0, pendientes.length - VISIBLE_ITEMS);
  const confirmedMaxStart = Math.max(0, confirmadas.length - VISIBLE_ITEMS);

  useEffect(() => {
    setPendingStart((current) => Math.min(current, pendingMaxStart));
  }, [pendingMaxStart]);

  useEffect(() => {
    setConfirmedStart((current) => Math.min(current, confirmedMaxStart));
  }, [confirmedMaxStart]);

  const pendientesVisible = useMemo(
    () => pendientes.slice(pendingStart, pendingStart + VISIBLE_ITEMS),
    [pendientes, pendingStart],
  );

  const confirmadasVisible = useMemo(
    () => confirmadas.slice(confirmedStart, confirmedStart + VISIBLE_ITEMS),
    [confirmadas, confirmedStart],
  );

  const confirm = async (id) => {
    try {
      await clasesPracticasPortalService.confirmProfessorRequest(id);
      setSuccess("Solicitud confirmada correctamente");
      await loadData();
    } catch (confirmError) {
      setError(confirmError.response?.data?.message || "No se pudo confirmar");
    }
  };

  const cancel = async (id) => {
    try {
      await clasesPracticasPortalService.cancelProfessorRequest(id);
      setSuccess("Solicitud cancelada correctamente");
      await loadData();
    } catch (cancelError) {
      setError(cancelError.response?.data?.message || "No se pudo cancelar");
    }
  };

  if (loading) {
    return <Typography>Cargando clases prácticas...</Typography>;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box>
        <Typography variant="h4" fontWeight={800}>
          Clases prácticas
        </Typography>
        <Typography color="text.secondary">
          Gestiona solicitudes pendientes, confirmaciones y cancelaciones.
        </Typography>
      </Box>

      {error ? <Alert severity="error">{error}</Alert> : null}
      {success ? <Alert severity="success">{success}</Alert> : null}

      <Card>
        <CardContent>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6" fontWeight={800}>
              Solicitudes pendientes
            </Typography>
            <Box>
              <IconButton
                size="small"
                onClick={() =>
                  setPendingStart((current) => Math.max(0, current - 1))
                }
                disabled={pendingStart === 0}
              >
                <ArrowBackIosNewIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() =>
                  setPendingStart((current) =>
                    Math.min(pendingMaxStart, current + 1),
                  )
                }
                disabled={pendingStart >= pendingMaxStart}
              >
                <ArrowForwardIosIcon fontSize="small" />
              </IconButton>
            </Box>
          </Stack>

          {pendientes.length === 0 ? (
            <Typography color="text.secondary" sx={{ mt: 1.5 }}>
              No hay solicitudes pendientes.
            </Typography>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                  md: "repeat(3, minmax(0, 1fr))",
                  lg: "repeat(5, minmax(0, 1fr))",
                },
                gap: 2,
                mt: 1.5,
                pb: 1,
              }}
            >
              {pendientesVisible.map((item) => (
                <Card key={item.id} variant="outlined">
                  <CardContent>
                    <Typography fontWeight={700} sx={{ mb: 1 }}>
                      {formatDate(item.fecha)}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.75 }}>
                      Alumno: {item.alumno?.nombre}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.75 }}>
                      Vehículo: {item.vehiculo?.marca} {item.vehiculo?.modelo}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.75 }}>
                      Pago: {item.metodoPago}
                    </Typography>
                    <Stack direction="row" spacing={0.75} sx={{ mt: 1, mb: 2 }}>
                      <LicenseChip value={item.vehiculo?.tipoPermiso || "-"} />
                      <PracticalClassTypeChip
                        value={item.tipoClasePractica || "CIRCULACION"}
                      />
                    </Stack>

                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      {/* Botón Confirmar - Verde Esmeralda */}
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => confirm(item.id)}
                        sx={{
                          fontWeight: 700,
                          letterSpacing: "1px",
                          textTransform: "uppercase",
                          borderRadius: "8px",
                          padding: "4px 16px",
                          border: "1px solid",
                          color: "#15803d",
                          borderColor: "#15803d !important",
                          backgroundColor: "transparent",
                          boxShadow: `
        0px 3px 0px #166534, 
        0px 6px 12px rgba(21, 128, 61, 0.15),
        inset 0px 1px 0px rgba(255, 255, 255, 0.1)
      `,
                          transition: "all 0.15s ease-in-out",
                          "&:hover": {
                            color: "#22c55e",
                            borderColor: "#22c55e !important",
                            backgroundColor: "rgba(21, 128, 61, 0.04)",
                            boxShadow: `
          0px 3px 0px #166534, 
          0px 10px 16px rgba(34, 197, 94, 0.25),
          inset 0px 1px 0px rgba(255, 255, 255, 0.2)
        `,
                            transform: "translateY(-1px)",
                          },
                          "&:active": {
                            borderColor: "#15803d !important",
                            boxShadow: `
          0px 1px 0px #166534, 
          0px 2px 4px rgba(21, 128, 61, 0.2),
          inset 0px 2px 4px rgba(0, 0, 0, 0.05)
        `,
                            transform: "translateY(2px)",
                          },
                        }}
                      >
                        Confirmar
                      </Button>

                      {/* Botón Cancelar - Rojo Carmesí */}
                      {canProfessorCancelClass(item) ? (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => cancel(item.id)}
                          sx={{
                            fontWeight: 700,
                            letterSpacing: "1px",
                            textTransform: "uppercase",
                            borderRadius: "8px",
                            padding: "4px 16px",
                            border: "1px solid",
                            color: "#dc2626",
                            borderColor: "#dc2626 !important",
                            backgroundColor: "transparent",
                            boxShadow: `
          0px 3px 0px #991b1b, 
          0px 6px 12px rgba(220, 38, 38, 0.15),
          inset 0px 1px 0px rgba(255, 255, 255, 0.1)
        `,
                            transition: "all 0.15s ease-in-out",
                            "&:hover": {
                              color: "#ef4444",
                              borderColor: "#ef4444 !important",
                              backgroundColor: "rgba(220, 38, 38, 0.04)",
                              boxShadow: `
            0px 3px 0px #991b1b, 
            0px 10px 16px rgba(239, 68, 68, 0.25),
            inset 0px 1px 0px rgba(255, 255, 255, 0.2)
          `,
                              transform: "translateY(-1px)",
                            },
                            "&:active": {
                              borderColor: "#dc2626 !important",
                              boxShadow: `
            0px 1px 0px #991b1b, 
            0px 2px 4px rgba(220, 38, 38, 0.2),
            inset 0px 2px 4px rgba(0, 0, 0, 0.05)
        `,
                              transform: "translateY(2px)",
                            },
                          }}
                        >
                          Cancelar
                        </Button>
                      ) : null}
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6" fontWeight={800}>
              Próximas confirmadas
            </Typography>
            <Box>
              <IconButton
                size="small"
                onClick={() =>
                  setConfirmedStart((current) => Math.max(0, current - 1))
                }
                disabled={confirmedStart === 0}
              >
                <ArrowBackIosNewIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() =>
                  setConfirmedStart((current) =>
                    Math.min(confirmedMaxStart, current + 1),
                  )
                }
                disabled={confirmedStart >= confirmedMaxStart}
              >
                <ArrowForwardIosIcon fontSize="small" />
              </IconButton>
            </Box>
          </Stack>

          {confirmadas.length === 0 ? (
            <Typography color="text.secondary" sx={{ mt: 1.5 }}>
              No hay clases confirmadas.
            </Typography>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                  md: "repeat(3, minmax(0, 1fr))",
                  lg: "repeat(5, minmax(0, 1fr))",
                },
                gap: 2,
                mt: 1.5,
                pb: 1,
              }}
            >
              {confirmadasVisible.map((item) => (
                <Card key={item.id} variant="outlined">
                  <CardContent>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography fontWeight={700} sx={{ mb: 1 }}>
                        {formatDate(item.fecha)}
                      </Typography>
                      <Chip
                        sx={{ ml: 13 }}
                        label={item.estado}
                        color={colorByState(item.estado)}
                        size="small"
                      />
                    </Stack>
                    <Typography variant="body2">
                      Alumno: {item.alumno?.nombre}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.75 }}>
                      Vehículo: {item.vehiculo?.matricula}
                    </Typography>

                    <Typography variant="body2" sx={{ mt: 0.75 }}>
                      Pago: {item.metodoPago}
                    </Typography>
                    <Stack direction="row" spacing={0.75} sx={{ mt: 2, mb: 2 }}>
                      <LicenseChip value={item.vehiculo?.tipoPermiso || "-"} />
                      <PracticalClassTypeChip
                        value={item.tipoClasePractica || "CIRCULACION"}
                      />
                    </Stack>
                    {canProfessorCancelClass(item) ? (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => cancel(item.id)}
                        sx={{
                          fontWeight: 700,
                          letterSpacing: "1px",
                          textTransform: "uppercase",
                          borderRadius: "8px",
                          padding: "4px 16px", // Padding optimizado para botones pequeños
                          border: "1px solid",
                          color: "#dc2626",
                          borderColor: "#dc2626 !important",
                          backgroundColor: "transparent",
                          boxShadow: `
      0px 3px 0px #991b1b, 
      0px 6px 12px rgba(220, 38, 38, 0.15),
      inset 0px 1px 0px rgba(255, 255, 255, 0.1)
    `,
                          transition: "all 0.15s ease-in-out",
                          "&:hover": {
                            color: "#ef4444",
                            borderColor: "#ef4444 !important",
                            backgroundColor: "rgba(220, 38, 38, 0.04)",
                            boxShadow: `
        0px 3px 0px #991b1b, 
        0px 10px 16px rgba(239, 68, 68, 0.25),
        inset 0px 1px 0px rgba(255, 255, 255, 0.2)
      `,
                            transform: "translateY(-1px)",
                          },
                          "&:active": {
                            borderColor: "#dc2626 !important",
                            boxShadow: `
        0px 1px 0px #991b1b, 
        0px 2px 4px rgba(220, 38, 38, 0.2),
        inset 0px 2px 4px rgba(0, 0, 0, 0.05)
      `,
                            transform: "translateY(2px)", // Hundimiento correspondiente al relieve pequeño
                          },
                        }}
                      >
                        Cancelar clase
                      </Button>
                    ) : null}
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack
            direction={{ xs: "column", lg: "row" }}
            alignItems={{ xs: "flex-start", lg: "flex-end" }} // Alinea la base de los filtros con el título abajo
            justifyContent="flex-end" // Fuerza a todos los elementos a pegarse a la derecha del todo
            spacing={2}
            sx={{ mb: 1, width: "100%" }}
          >
            {/* Título de la sección ajustado un poco más abajo */}
            <Typography
              variant="h6"
              fontWeight={800}
              sx={{
                whiteSpace: "nowrap",
                pt: 0.8, // Baja sutilmente el título para nivelarse con los inputs
                mr: "auto", // Hace un efecto imán: empuja el título a la izquierda del todo y los filtros a la derecha del todo
              }}
            >
              Histórico reciente
            </Typography>

            {/* Bloque de Filtros de Búsqueda pegado al extremo derecho */}
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={1.25}
              sx={{
                width: { xs: "100%", lg: "auto" },
              }}
            >
              <TextField
                size="small"
                label="Alumno"
                value={historyStudentSearch}
                onChange={(event) =>
                  setHistoryStudentSearch(event.target.value)
                }
                sx={{ minWidth: { xs: "100%", md: 240 } }}
              />
              <TextField
                size="small"
                type="date"
                label="Fecha desde"
                InputLabelProps={{ shrink: true }}
                value={historyDateFrom}
                onChange={(event) => setHistoryDateFrom(event.target.value)}
                sx={{
                  minWidth: { xs: "100%", md: 170 },
                  "& input::-webkit-datetime-edit-text, & input::-webkit-datetime-edit-month-field, & input::-webkit-datetime-edit-day-field, & input::-webkit-datetime-edit-year-field":
                    {
                      color: historyDateFrom ? "inherit" : "transparent",
                    },
                }}
              />

              <TextField
                size="small"
                type="date"
                label="Fecha hasta"
                InputLabelProps={{ shrink: true }}
                value={historyDateTo}
                onChange={(event) => setHistoryDateTo(event.target.value)}
                sx={{
                  minWidth: { xs: "100%", md: 170 },
                  "& input::-webkit-datetime-edit-text, & input::-webkit-datetime-edit-month-field, & input::-webkit-datetime-edit-day-field, & input::-webkit-datetime-edit-year-field":
                    {
                      color: historyDateTo ? "inherit" : "transparent",
                    },
                }}
              />
            </Stack>
          </Stack>

          <Stack spacing={1} sx={{ mt: 1.5 }}>
            {historicoFiltrado.length === 0 ? (
              <Typography color="text.secondary">
                Sin movimientos recientes.
              </Typography>
            ) : (
              historicoFiltrado.slice(0, 12).map((item) => (
                <Card key={item.id} variant="outlined">
                  <CardContent sx={{ py: 1.5, mt: 2, mb: -1 }}>
                    <Stack
                      direction="row"
                      justifyContent="flex-start" // Alinea todos los elementos de izquierda a derecha
                      alignItems="center"
                    >
                      {/* 1. BOTÓN DE RUTA */}
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() =>
                          navigate(
                            `/hojas-ruta?claseId=${encodeURIComponent(item.id)}`,
                          )
                        }
                        sx={{ mr: "24px" }} // 5 espacios de separación aproximados (24px)
                      >
                        <RouteIcon fontSize="small" />
                      </IconButton>

                      {/* 2. FECHA */}
                      <Typography sx={{ mr: "20px" }}>
                        {" "}
                        {/* 4 espacios de separación aproximados (20px) */}
                        {formatDate(item.fecha)}
                      </Typography>

                      {/* 3. NOMBRE DEL ALUMNO */}
                      <Typography sx={{ mr: "24px" }}>
                        {" "}
                        {/* 5 espacios de separación aproximados (24px) */}·{" "}
                        {item.alumno?.nombre}
                      </Typography>

                      {/* CHIP DE LICENCIA + ESPACIO */}
                      <Box sx={{ mr: "20px", display: "inline-flex" }}>
                        <LicenseChip
                          value={item.vehiculo?.tipoPermiso || "-"}
                        />
                      </Box>

                      {/* TIPO DE CLASE + ESPACIO */}
                      <Box sx={{ mr: "20px", display: "inline-flex" }}>
                        <PracticalClassTypeChip
                          value={item.tipoClasePractica || "CIRCULACION"}
                        />
                      </Box>

                      {/* 4. ESTADO (CHIP) */}
                      <Chip
                        label={item.estado}
                        color={colorByState(item.estado)}
                        size="small"
                      />
                    </Stack>
                  </CardContent>
                </Card>
              ))
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
