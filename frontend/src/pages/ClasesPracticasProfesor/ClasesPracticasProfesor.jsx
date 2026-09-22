import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import RouteIcon from "@mui/icons-material/Route";
import { useNavigate } from "react-router-dom";

import { clasesPracticasPortalService } from "../../services/clasesPracticasPortalService";

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
  if (state === "CONFIRMADA") return "success";
  if (state.includes("CANCELADA")) return "error";
  return "default";
};

export default function ClasesPracticasProfesor() {
  const navigate = useNavigate();
  const pendingRef = useRef(null);
  const confirmedRef = useRef(null);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  const scrollRow = (ref, direction) => {
    if (!ref.current) {
      return;
    }

    ref.current.scrollBy({
      left: direction === "left" ? -360 : 360,
      behavior: "smooth",
    });
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
                onClick={() => scrollRow(pendingRef, "left")}
              >
                <ArrowBackIosNewIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => scrollRow(pendingRef, "right")}
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
              ref={pendingRef}
              sx={{
                display: "flex",
                gap: 2,
                overflowX: "auto",
                mt: 1.5,
                pb: 1,
              }}
            >
              {pendientes.map((item) => (
                <Card key={item.id} variant="outlined">
                  <CardContent sx={{ minWidth: 300 }}>
                    <Typography fontWeight={700} sx={{ mb: 1 }}>
                      {formatDate(item.fecha)}
                    </Typography>
                    <Typography variant="body2">
                      Alumno: {item.alumno?.nombre}
                    </Typography>
                    <Typography variant="body2">
                      Vehículo: {item.vehiculo?.marca} {item.vehiculo?.modelo}
                    </Typography>
                    <Typography variant="body2">
                      Pago: {item.metodoPago}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        onClick={() => confirm(item.id)}
                      >
                        Confirmar
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => cancel(item.id)}
                      >
                        Cancelar
                      </Button>
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
                onClick={() => scrollRow(confirmedRef, "left")}
              >
                <ArrowBackIosNewIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => scrollRow(confirmedRef, "right")}
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
              ref={confirmedRef}
              sx={{
                display: "flex",
                gap: 2,
                overflowX: "auto",
                mt: 1.5,
                pb: 1,
              }}
            >
              {confirmadas.map((item) => (
                <Card key={item.id} variant="outlined">
                  <CardContent sx={{ minWidth: 300 }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography fontWeight={700} sx={{ mb: 1 }}>
                        {formatDate(item.fecha)}
                      </Typography>
                      <Chip
                        sx={{ ml: 5 }}
                        label={item.estado}
                        color={colorByState(item.estado)}
                        size="small"
                      />
                    </Stack>
                    <Typography variant="body2">
                      Alumno: {item.alumno?.nombre}
                    </Typography>
                    <Typography variant="body2">
                      Vehículo: {item.vehiculo?.matricula}
                    </Typography>
                    <Typography variant="body2">
                      Pago: {item.metodoPago}
                    </Typography>
                    <Button
                      size="small"
                      color="error"
                      sx={{ mt: 1 }}
                      onClick={() => cancel(item.id)}
                    >
                      Cancelar clase
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={800}>
            Histórico reciente
          </Typography>
          <Stack spacing={1} sx={{ mt: 1.5 }}>
            {historico.length === 0 ? (
              <Typography color="text.secondary">
                Sin movimientos recientes.
              </Typography>
            ) : (
              historico.slice(0, 12).map((item) => (
                <Card key={item.id} variant="outlined">
                  <CardContent sx={{ py: 1.5 }}>
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
