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
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [includeArchived, setIncludeArchived] = useState(false);
  const [error, setError] = useState("");

  const loadData = async (unread = onlyUnread, archived = includeArchived) => {
    setLoading(true);
    setError("");

    try {
      const data = await notificacionesService.getMine(unread, archived);
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
    loadData(onlyUnread, includeArchived);
  }, [onlyUnread, includeArchived]);

  useEffect(() => {
    const stream = notificacionesService.createStream();

    if (!stream) {
      return undefined;
    }

    const onRealtime = () => {
      loadData(onlyUnread, includeArchived);
      notifyUnreadChanged();
    };

    stream.addEventListener("notification:created", onRealtime);
    stream.addEventListener("notification:updated", onRealtime);
    stream.addEventListener("notification:bulk-updated", onRealtime);

    return () => {
      stream.close();
    };
  }, [onlyUnread, includeArchived]);

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

  const archiveToggle = async (item) => {
    try {
      if (item.archivada) {
        await notificacionesService.unarchive(item.id);
      } else {
        await notificacionesService.archive(item.id);
      }
      await loadData(onlyUnread, includeArchived);
      notifyUnreadChanged();
    } catch (archiveError) {
      setError(
        archiveError.response?.data?.message ||
          "No se pudo actualizar el archivado",
      );
    }
  };

  const goToSource = (item) => {
    const route = item?.metadata?.route;

    if (!route || typeof route !== "string") {
      return;
    }

    navigate(route);
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
          <Button
            variant={includeArchived ? "contained" : "outlined"}
            onClick={() => setIncludeArchived((prev) => !prev)}
          >
            {includeArchived ? "Incluye archivadas" : "Sin archivadas"}
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
                border: item.archivada
                  ? "1px dashed #cbd5e1"
                  : item.leida
                    ? "1px solid #e2e8f0"
                    : "2px solid #2563eb",
              }}
            >
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  spacing={3}
                  alignItems="center"
                  sx={{ mb: 0.7 }}
                >
                  <Typography fontWeight={800} sx={{ mb: 1 }}>
                    {item.titulo}{" "}
                  </Typography>
                  <Stack direction="row" spacing={3} alignItems="center">
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
                    <Chip
                      label={item.archivada ? "Archivada" : "Activa"}
                      color={item.archivada ? "default" : "success"}
                      size="small"
                    />
                  </Stack>
                </Stack>

                <Typography variant="body2" sx={{ mb: 1, mt: 3 }}>
                  {item.mensaje}
                </Typography>

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                  >
                    {formatDate(item.createdAt)}
                  </Typography>
                  {!item.leida ? (
                    <Button
                      size="small"
                      onClick={() => markOneAsRead(item.id)}
                      sx={{ ml: 5, mt: 0.3 }}
                    >
                      Marcar como leída
                    </Button>
                  ) : null}
                  <Stack direction="row" spacing={1}>
                    {item?.metadata?.route ? (
                      <Button size="small" onClick={() => goToSource(item)}>
                        Ir al origen
                      </Button>
                    ) : null}
                    <Button size="small" onClick={() => archiveToggle(item)}>
                      {item.archivada ? "Desarchivar" : "Archivar"}
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))
        )}
      </Stack>
    </Box>
  );
}
