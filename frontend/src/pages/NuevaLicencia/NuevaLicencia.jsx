import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";

import LocalOfferIcon from "@mui/icons-material/LocalOffer";

import { dashboardService } from "../../services/dashboardService";
import { LicenseChip } from "../../components/common/LicenseChip";

const LICENCIAS = ["B", "A1", "A2", "A", "C", "D", "E"];
const TEMARIO_IMAGES = {
  A: "/assets/branding/Temario_A_A1_A2.png",
  A1: "/assets/branding/Temario_A_A1_A2.png",
  A2: "/assets/branding/Temario_A_A1_A2.png",
  B: "/assets/branding/Temario_B.png",
  C: "/assets/branding/Temario_C.png",
  D: "/assets/branding/Temario_D.png",
};

const isPromotionCurrent = (promo, now = new Date()) => {
  const start = promo?.fechaInicio ? new Date(promo.fechaInicio) : null;
  const end = promo?.fechaFin ? new Date(promo.fechaFin) : null;

  const startOk = !start || start <= now;
  const endOk = !end || end >= now;

  return startOk && endOk;
};

const formatDate = (value) => {
  if (!value) {
    return "Sin fecha límite";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Sin fecha límite";
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

export default function NuevaLicencia() {
  const [licencia, setLicencia] = useState("");
  const [promociones, setPromociones] = useState([]);
  const [selectedPromocionId, setSelectedPromocionId] = useState("");
  const [context, setContext] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    const loadContext = async () => {
      setLoading(true);

      try {
        const data = await dashboardService.getStudentNewLicenseContext();
        setContext(data);

        const available = Array.isArray(data?.licenciasDisponibles)
          ? data.licenciasDisponibles
          : [];
        setLicencia(available[0] || "");
      } catch (error) {
        setSnackbar({
          open: true,
          message:
            error.response?.data?.message ||
            "No se pudo cargar el contexto de nueva licencia",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    loadContext();
  }, []);

  useEffect(() => {
    const loadPromociones = async () => {
      if (!licencia) {
        setPromociones([]);
        setSelectedPromocionId("");
        return;
      }

      setLoading(true);
      try {
        const items =
          await dashboardService.getStudentNewLicensePromotions(licencia);
        setPromociones(Array.isArray(items) ? items : []);
        setSelectedPromocionId("");
      } catch (error) {
        setPromociones([]);
        setSnackbar({
          open: true,
          message:
            error.response?.data?.message ||
            "No se pudieron cargar las promociones de la licencia",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    loadPromociones();
  }, [licencia]);

  const promocionesFiltradas = useMemo(() => {
    return (promociones || []).filter((promo) =>
      isPromotionCurrent(promo, new Date()),
    );
  }, [promociones]);

  const selectedPromotion =
    promocionesFiltradas.find((item) => item.id === selectedPromocionId) ||
    null;

  const handleConfirmNewLicense = async () => {
    if (!licencia) {
      return;
    }

    setConfirming(true);
    try {
      await dashboardService.createStudentNewLicenseEnrollment({
        licenciaObjetivo: licencia,
        promocionId: selectedPromotion?.id || null,
      });

      setSnackbar({
        open: true,
        message:
          "Nuevo expediente creado en estado PENDIENTE_MATRICULA. Revisa Mi progreso para continuar.",
        severity: "success",
      });
      setConfirmOpen(false);

      const data = await dashboardService.getStudentNewLicenseContext();
      setContext(data);
      const available = Array.isArray(data?.licenciasDisponibles)
        ? data.licenciasDisponibles
        : [];
      setLicencia(available[0] || "");
      setSelectedPromocionId("");
    } catch (error) {
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message ||
          "No se pudo crear el nuevo expediente",
        severity: "error",
      });
    } finally {
      setConfirming(false);
    }
  };

  const licenciasDisponibles = context?.licenciasDisponibles || [];
  const licenciasObtenidas = context?.licenciasObtenidas || [];
  const temarioImage = TEMARIO_IMAGES[licencia] || TEMARIO_IMAGES.B;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box>
        <Typography variant="h4" fontWeight={800}>
          Nueva licencia
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Solicita una nueva licencia y genera un nuevo expediente en estado
          pendiente de matrícula.
        </Typography>
      </Box>

      {licenciasObtenidas.length > 0 ? (
        <Alert severity="info">
          Licencias obtenidas históricamente: {licenciasObtenidas.join(", ")}
        </Alert>
      ) : null}

      {licenciasDisponibles.length === 0 ? (
        <Alert severity="warning">
          No hay licencias disponibles para solicitar actualmente.
        </Alert>
      ) : null}

      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <FormControl size="small" sx={{ minWidth: 220 }}>
              <InputLabel id="nueva-licencia-select-label">
                Licencia objetivo
              </InputLabel>
              <Select
                labelId="nueva-licencia-select-label"
                value={licencia}
                label="Licencia objetivo"
                onChange={(event) => setLicencia(event.target.value)}
                disabled={licenciasDisponibles.length === 0}
              >
                {LICENCIAS.filter((option) =>
                  licenciasDisponibles.includes(option),
                ).map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              disabled={!licencia || licenciasDisponibles.length === 0}
              onClick={() => setConfirmOpen(true)}
              sx={{
                fontWeight: 700,
                letterSpacing: "1px",
                textTransform: "uppercase",
                borderRadius: "8px",
                padding: "6px 24px",
                border: "1px solid",
                borderColor: "#0284c7 !important", // Azul Eléctrico base
                color: "#0284c7",
                backgroundColor: "transparent",
                boxShadow: `
      0px 4px 0px #0369a1, 
      0px 8px 16px rgba(2, 132, 199, 0.15),
      inset 0px 1px 0px rgba(255, 255, 255, 0.1)
    `,
                transition: "all 0.15s ease-in-out",
                "&:hover": {
                  color: "#0ea5e9", // Ciano más brillante
                  borderColor: "#0ea5e9 !important",
                  backgroundColor: "rgba(2, 132, 199, 0.04)",
                  boxShadow: `
        0px 4px 0px #0369a1, 
        0px 12px 20px rgba(14, 165, 233, 0.25),
        inset 0px 1px 0px rgba(255, 255, 255, 0.2)
      `,
                  transform: "translateY(-1px)",
                },
                "&:active": {
                  borderColor: "#0284c7 !important",
                  boxShadow: `
        0px 1px 0px #0369a1, 
        0px 2px 4px rgba(2, 132, 199, 0.2),
        inset 0px 2px 4px rgba(0, 0, 0, 0.05)
      `,
                  transform: "translateY(3px)",
                },
                "&:disabled": {
                  color: "#bae6fd",
                  borderColor: "#e5e7eb !important",
                  boxShadow: "none",
                  transform: "none",
                  opacity: 0.6,
                },
              }}
            >
              Confirmar nueva licencia
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={3} alignItems="stretch">
        {/* 1. TARJETA DEL TEMARIO (Izquierda - 50% en pantallas medianas/grandes) */}
        <Grid item xs={12} md={4}>
          {" "}
          {/* Cambiado a md={4} para que ocupe solo 1/3 de la pantalla en lugar de la mitad */}
          <Card sx={{ borderRadius: 2, height: "100%" }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1 }}>
                {" "}
                {/* Bajada de escala a subtitle1 para equilibrar las proporciones */}
                Temario de licencia {licencia || "-"}
              </Typography>
              <Box
                component="img"
                src={temarioImage}
                alt={`Temario licencia ${licencia || "B"}`}
                sx={{
                  width: "100%",
                  maxWidth: 700, // Evita que la imagen se estire demasiado si la pantalla es muy grande
                  display: "block",
                  aspectRatio: "16 / 10",
                  borderRadius: 2,
                  border: "1px solid #e2e8f0",
                  backgroundColor: "#f8fafc",
                  objectFit: "contain",
                  margin: "0 auto", // Mantiene la imagen centrada dentro de su tarjeta más pequeña
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* 2. TARJETA DE PROMOCIONES (Derecha - 50% en pantallas medianas/grandes) */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, height: "100%" }}>
            <CardContent>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
                Promociones vigentes para licencia {licencia || "-"}
              </Typography>

              {loading ? (
                <Typography color="text.secondary">
                  Cargando promociones...
                </Typography>
              ) : promocionesFiltradas.length === 0 ? (
                <Alert severity="info">
                  No hay promociones disponibles para la licencia seleccionada
                </Alert>
              ) : (
                <Grid container spacing={2}>
                  {promocionesFiltradas.map((promo) => {
                    const selected = selectedPromocionId === promo.id;
                    return (
                      <Grid item xs={12} key={promo.id}>
                        <Card
                          variant="outlined"
                          onClick={() => setSelectedPromocionId(promo.id)}
                          sx={{
                            cursor: "pointer",
                            borderWidth: selected ? 3 : 1,
                            borderColor: selected ? "#facc15" : "divider",
                            boxShadow: selected
                              ? "0 0 0 2px rgba(250, 204, 21, 0.45)"
                              : "none",
                            backgroundColor: selected ? "#fffbeb" : "#fff",
                          }}
                        >
                          <CardContent>
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              alignItems="flex-start"
                              spacing={1}
                            >
                              <Box>
                                <Typography variant="h6" fontWeight={700}>
                                  {promo.nombre}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {promo.descripcion || "Promoción activa"}
                                </Typography>
                              </Box>
                              <Chip
                                icon={<LocalOfferIcon />}
                                label="Vigente"
                                color="success"
                                size="small"
                              />
                            </Stack>

                            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                              {(promo.licenciasAplicables || []).map((item) => (
                                <LicenseChip
                                  key={`${promo.id}-${item}`}
                                  value={item}
                                />
                              ))}
                            </Stack>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mt: 1 }}
                            >
                              Precio original:{" "}
                              {Number(promo.precioOriginal || 0).toFixed(2)} EUR
                            </Typography>
                            <Typography variant="body1" fontWeight={800}>
                              Precio oferta:{" "}
                              {Number(promo.precioPromocional || 0).toFixed(2)}{" "}
                              EUR
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Vigencia: {formatDate(promo.fechaInicio)} -{" "}
                              {formatDate(promo.fechaFin)}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirmar nueva licencia</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 1 }}>
            Vas a crear un nuevo expediente para la licencia{" "}
            <strong>{licencia}</strong>
            {selectedPromotion ? (
              <>
                {" "}
                con la promoción <strong>{selectedPromotion.nombre}</strong>.
              </>
            ) : (
              "."
            )}
          </Typography>
          <Typography color="text.secondary">
            Tras confirmar, se generará la matrícula en estado pendiente para
            completar el pago y activar el nuevo flujo del expediente.
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "flex-end", // Alineación estricta a la derecha
            mb: 3, // Separación exacta de la parte baja del modal (24px)
            px: 3, // Colchón lateral para el relieve
            gap: 2, // Espaciado uniforme entre botones
          }}
        >
          {/* Botón Cancelar - Rojo Carmesí */}
          <Button
            onClick={() => setConfirmOpen(false)}
            sx={{
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase",
              borderRadius: "8px",
              padding: "6px 24px",
              border: "1px solid",
              color: "#dc2626",
              borderColor: "#dc2626 !important",
              backgroundColor: "transparent",
              boxShadow: `
        0px 4px 0px #991b1b, 
        0px 8px 16px rgba(220, 38, 38, 0.15),
        inset 0px 1px 0px rgba(255, 255, 255, 0.1)
      `,
              transition: "all 0.15s ease-in-out",
              "&:hover": {
                color: "#ef4444",
                borderColor: "#ef4444 !important",
                backgroundColor: "rgba(220, 38, 38, 0.04)",
                boxShadow: `
          0px 4px 0px #991b1b, 
          0px 12px 20px rgba(239, 68, 68, 0.25),
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
                transform: "translateY(3px)",
              },
            }}
          >
            Cancelar
          </Button>

          {/* Botón Confirmar - Verde Esmeralda */}
          <Button
            variant="outlined"
            onClick={handleConfirmNewLicense}
            disabled={confirming || !licencia}
            sx={{
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase",
              borderRadius: "8px",
              padding: "6px 24px",
              border: "1px solid",
              color: "#15803d",
              borderColor: "#15803d !important",
              backgroundColor: "transparent",
              boxShadow: `
        0px 4px 0px #166534, 
        0px 8px 16px rgba(21, 128, 61, 0.15),
        inset 0px 1px 0px rgba(255, 255, 255, 0.1)
      `,
              transition: "all 0.15s ease-in-out",
              "&:hover": {
                color: "#22c55e",
                borderColor: "#22c55e !important",
                backgroundColor: "rgba(21, 128, 61, 0.04)",
                boxShadow: `
          0px 4px 0px #166534, 
          0px 12px 20px rgba(34, 197, 94, 0.25),
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
                transform: "translateY(3px)",
              },
              "&:disabled": {
                color: "#86efac",
                borderColor: "#e5e7eb !important",
                boxShadow: "none",
                transform: "none",
                opacity: 0.6,
              },
            }}
          >
            {confirming ? "Creando..." : "Confirmar"}
          </Button>
        </DialogActions>
      </Dialog>

      <Card sx={{ borderRadius: 2, display: "none" }}>
        <CardContent>
          <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
            Promociones vigentes para licencia {licencia}
          </Typography>

          {loading ? (
            <Typography color="text.secondary">
              Cargando promociones...
            </Typography>
          ) : promocionesFiltradas.length === 0 ? (
            <Alert severity="info">
              No hay promociones disponibles para la licencia seleccionada
            </Alert>
          ) : (
            <Grid container spacing={2}>
              {promocionesFiltradas.map((promo) => (
                <Grid item xs={12} md={6} lg={4} key={promo.id}>
                  <Card variant="outlined" sx={{ height: "100%" }}>
                    <CardContent>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        spacing={1}
                      >
                        <Box>
                          <Typography variant="h6" fontWeight={700}>
                            {promo.nombre}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {promo.descripcion || "Promoción activa"}
                          </Typography>
                        </Box>
                        <Chip
                          icon={<LocalOfferIcon />}
                          label="Vigente"
                          color="success"
                          size="small"
                        />
                      </Stack>

                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ mt: 1.5, mb: 1 }}
                      >
                        {(promo.licenciasAplicables || []).map((item) => (
                          <LicenseChip
                            key={`${promo.id}-${item}`}
                            value={item}
                          />
                        ))}
                      </Stack>

                      <Typography variant="body2" color="text.secondary">
                        Precio original:{" "}
                        {Number(promo.precioOriginal || 0).toFixed(2)} EUR
                      </Typography>
                      <Typography variant="body1" fontWeight={800}>
                        Precio oferta:{" "}
                        {Number(promo.precioPromocional || 0).toFixed(2)} EUR
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        Vigencia: {formatDate(promo.fechaInicio)} -{" "}
                        {formatDate(promo.fechaFin)}
                      </Typography>

                      <Button
                        variant="outlined"
                        fullWidth
                        disabled
                        sx={{
                          mt: 2,
                          fontWeight: 700,
                          letterSpacing: "1px",
                          textTransform: "uppercase",
                          borderRadius: "8px",
                          padding: "10px 24px",
                          border: "1px solid",
                          borderColor: "#6d28d9 !important", // Morado principal
                          color: "#6d28d9",
                          backgroundColor: "transparent",
                          boxShadow: `
      0px 4px 0px #5b21b6, 
      0px 8px 16px rgba(109, 40, 217, 0.15),
      inset 0px 1px 0px rgba(255, 255, 255, 0.1)
    `,
                          transition: "all 0.15s ease-in-out",
                          "&:hover": {
                            color: "#8b5cf6",
                            borderColor: "#8b5cf6 !important",
                            backgroundColor: "rgba(109, 40, 217, 0.04)",
                            boxShadow: `
        0px 4px 0px #5b21b6, 
        0px 12px 20px rgba(139, 92, 246, 0.25),
        inset 0px 1px 0px rgba(255, 255, 255, 0.2)
      `,
                            transform: "translateY(-1px)",
                          },
                          "&:active": {
                            borderColor: "#6d28d9 !important",
                            boxShadow: `
        0px 1px 0px #5b21b6, 
        0px 2px 4px rgba(109, 40, 217, 0.2),
        inset 0px 2px 4px rgba(0, 0, 0, 0.05)
      `,
                            transform: "translateY(3px)",
                          },
                          "&:disabled": {
                            color: "#ddd6fe",
                            borderColor: "#e5e7eb !important",
                            boxShadow: "none",
                            transform: "none",
                            opacity: 0.5,
                          },
                        }}
                      >
                        Comprar promoción (Próximamente)
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
