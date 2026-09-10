import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

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

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={800}>
                Solicitudes pendientes
              </Typography>
              <Stack spacing={1} sx={{ mt: 1.5 }}>
                {pendientes.length === 0 ? (
                  <Typography color="text.secondary">
                    No hay solicitudes pendientes.
                  </Typography>
                ) : (
                  pendientes.map((item) => (
                    <Card key={item.id} variant="outlined">
                      <CardContent>
                        <Typography fontWeight={700}>
                          {formatDate(item.fecha)}
                        </Typography>
                        <Typography variant="body2">
                          Alumno: {item.alumno?.nombre}
                        </Typography>
                        <Typography variant="body2">
                          Vehículo: {item.vehiculo?.marca}{" "}
                          {item.vehiculo?.modelo}
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
                  ))
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={800}>
                Próximas confirmadas
              </Typography>
              <Stack spacing={1} sx={{ mt: 1.5 }}>
                {confirmadas.length === 0 ? (
                  <Typography color="text.secondary">
                    No hay clases confirmadas.
                  </Typography>
                ) : (
                  confirmadas.map((item) => (
                    <Card key={item.id} variant="outlined">
                      <CardContent>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography fontWeight={700}>
                            {formatDate(item.fecha)}
                          </Typography>
                          <Chip
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
                  ))
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography>
                        {formatDate(item.fecha)} · {item.alumno?.nombre}
                      </Typography>
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
