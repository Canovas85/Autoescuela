import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

import { notificacionesService } from "../../services/notificacionesService";

const notifyUnreadChanged = () => {
  window.dispatchEvent(new CustomEvent("notificaciones:updated"));
};

const colorByType = (type) => {
  if (type?.includes("CANCELADA")) return "error";
  if (type?.includes("CONFIRMADA")) return "success";
  if (type?.includes("PAGO")) return "warning";
  return "info";
};

const formatDate = (value) =>
  new Date(value).toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function Notificaciones() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [error, setError] = useState("");

  const loadData = async (unread = onlyUnread) => {
    setLoading(true);
    setError("");

    try {
      const data = await notificacionesService.getMine(unread);
      setRows(data || []);
    } catch (loadError) {
      setError(
        loadError.response?.data?.message ||
          "No se pudieron cargar las notificaciones",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(onlyUnread);
  }, [onlyUnread]);

  const markOneAsRead = async (id) => {
    try {
      await notificacionesService.markAsRead(id);
      await loadData(onlyUnread);
      notifyUnreadChanged();
    } catch (markError) {
      setError(
        markError.response?.data?.message || "No se pudo marcar como leída",
      );
    }
  };

  const markAll = async () => {
    try {
      await notificacionesService.markAllAsRead();
      await loadData(onlyUnread);
      notifyUnreadChanged();
    } catch (markError) {
      setError(
        markError.response?.data?.message || "No se pudieron marcar todas",
      );
    }
  };

  if (loading) {
    return <Typography>Cargando notificaciones...</Typography>;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Notificaciones
          </Typography>
          <Typography color="text.secondary">
            Centro de avisos de tu actividad en la plataforma.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button
            variant={onlyUnread ? "contained" : "outlined"}
            onClick={() => setOnlyUnread((prev) => !prev)}
          >
            {onlyUnread ? "Mostrando no leídas" : "Filtrar no leídas"}
          </Button>
          <Button variant="contained" onClick={markAll}>
            Marcar todo leído
          </Button>
        </Stack>
      </Box>

      {error ? <Alert severity="error">{error}</Alert> : null}

      <Stack spacing={1.2}>
        {rows.length === 0 ? (
          <Card>
            <CardContent>
              <Typography color="text.secondary">
                No tienes notificaciones por ahora.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          rows.map((item) => (
            <Card
              key={item.id}
              sx={{
                border: item.leida ? "1px solid #e2e8f0" : "2px solid #2563eb",
              }}
            >
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 0.7 }}
                >
                  <Typography fontWeight={800}>{item.titulo}</Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip
                      label={item.tipo}
                      color={colorByType(item.tipo)}
                      size="small"
                    />
                    <Chip
                      label={item.leida ? "Leída" : "Nueva"}
                      color={item.leida ? "default" : "primary"}
                      size="small"
                    />
                  </Stack>
                </Stack>

                <Typography variant="body2" sx={{ mb: 1 }}>
                  {item.mensaje}
                </Typography>

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(item.createdAt)}
                  </Typography>
                  {!item.leida ? (
                    <Button size="small" onClick={() => markOneAsRead(item.id)}>
                      Marcar como leída
                    </Button>
                  ) : null}
                </Stack>
              </CardContent>
            </Card>
          ))
        )}
      </Stack>
    </Box>
  );
}
