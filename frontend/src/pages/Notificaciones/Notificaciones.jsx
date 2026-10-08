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

const normalizeNotificationRoute = (route) => {
  const normalizedRoute = String(route || "")
    .trim()
    .toLowerCase();

  if (normalizedRoute === "/matricula" || normalizedRoute === "/matriculas") {
    return "/facturas";
  }

  return route;
};

const upper = (value) =>
  String(value || "")
    .trim()
    .toUpperCase();

const shouldOpenInFacturas = (item) => {
  const route = normalizeNotificationRoute(item?.metadata?.route || "");
  const tipo = upper(item?.tipo);

  if (route === "/facturas") {
    return true;
  }

  return ["BONO_COMPRADO", "MATRICULA_PAGADA"].includes(tipo);
};

const buildFacturasRoute = (item) => {
  const params = new URLSearchParams();
  const metadata = item?.metadata || {};

  params.set("openFactura", "1");

  [
    "facturaId",
    "numeroFactura",
    "numeroFacturaPago",
    "matriculaId",
    "compraBonoId",
    "pagoId",
    "clasePracticaId",
  ].forEach((key) => {
    const value = metadata?.[key];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      params.set(key, String(value));
    }
  });

  params.set("notificationType", upper(item?.tipo));

  return `/facturas?${params.toString()}`;
};

export default function Notificaciones() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [onlyUnread, setOnlyUnread] = useState(true);
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
    const normalizedRoute = normalizeNotificationRoute(route);

    if (!route || typeof route !== "string") {
      return;
    }

    if (shouldOpenInFacturas(item)) {
      navigate(buildFacturasRoute(item));
      return;
    }

    navigate(normalizedRoute);
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
                  alignItems="center"
                  spacing={2} // Un pequeño espacio de seguridad entre el texto y los chips
                  sx={{ mb: 0.7, width: "100%" }}
                >
                  {/* El flexGrow: 1 hace que este contenedor ocupe todo el espacio libre restante, empujando los chips a la derecha */}
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography fontWeight={800}>{item.titulo}</Typography>
                  </Box>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip
                      label={item.leida ? "Leída" : "Nueva"}
                      variant="outlined" // Permite visualizar el borde personalizado
                      size="small"
                      sx={{
                        ...(item.leida
                          ? {
                              backgroundColor: "#fff3e0", // Fondo naranja muy claro
                              color: "#e65100", // Letra naranja oscuro (alta legibilidad)
                              borderColor: "#f57c00", // Borde naranja medio
                            }
                          : {
                              backgroundColor: "#e3f2fd", // Fondo azul claro
                              color: "#0d47a1", // Letra azul oscuro
                              borderColor: "#1976d2", // Borde azul
                            }),
                        fontWeight: "500", // Opcional: mejora la legibilidad
                      }}
                    />
                    <Chip
                      label={item.archivada ? "Archivada" : "Activa"}
                      variant="outlined"
                      size="small"
                      sx={{
                        ...(item.archivada
                          ? {
                              backgroundColor: "#eceff1", // Fondo gris azulado
                              color: "#455a64", // Letra gris oscuro
                              borderColor: "#b0bec5", // Borde
                            }
                          : {
                              backgroundColor: "#e8f5e9", // Fondo verde claro
                              color: "#1b5e20", // Letra verde oscuro
                              borderColor: "#2e7d32", // Borde verde
                            }),
                        fontWeight: "500",
                      }}
                    />
                  </Stack>
                </Stack>

                <Typography variant="body2" sx={{ mb: 1, mt: 3 }}>
                  {item.mensaje}
                </Typography>

                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  sx={{ width: "100%", mt: 2 }} // Forzamos el ancho completo del contenedor
                >
                  {/* El flexGrow: 1 en este Box expande el espacio y empuja todo lo que esté después hacia la derecha */}
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography color="text.secondary">
                      {formatDate(item.createdAt)}
                    </Typography>
                  </Box>

                  {/* Contenedor de botones alineados perfectamente a la derecha */}
                  <Stack direction="row" spacing={1} alignItems="center">
                    {!item.leida ? (
                      <Button
                        size="small"
                        onClick={() => markOneAsRead(item.id)}
                      >
                        Marcar como leída
                      </Button>
                    ) : null}

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
