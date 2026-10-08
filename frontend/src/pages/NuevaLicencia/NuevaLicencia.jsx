import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
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

import { promocionesService } from "../../services/promocionesService";
import { LicenseChip } from "../../components/common/LicenseChip";

const LICENCIAS = ["B", "A1", "A2", "A", "C", "D", "E"];

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
  const [licencia, setLicencia] = useState("B");
  const [promociones, setPromociones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    const loadPromociones = async () => {
      setLoading(true);

      try {
        const allPromos = await promocionesService.getPublic();
        setPromociones(Array.isArray(allPromos) ? allPromos : []);
      } catch (error) {
        setPromociones([]);
        setSnackbar({
          open: true,
          message: "No se pudieron cargar las promociones",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    loadPromociones();
  }, []);

  const promocionesFiltradas = useMemo(() => {
    const now = new Date();

    return promociones.filter((promo) => {
      if (!Array.isArray(promo?.licenciasAplicables)) {
        return false;
      }

      return (
        promo.licenciasAplicables.includes(licencia) &&
        promo.activa === true &&
        isPromotionCurrent(promo, now)
      );
    });
  }, [promociones, licencia]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box>
        <Typography variant="h4" fontWeight={800}>
          Nueva licencia
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Selecciona la licencia que quieres obtener y revisa las promociones
          vigentes disponibles.
        </Typography>
      </Box>

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
              >
                {LICENCIAS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button variant="contained" disabled>
              Confirmar nueva licencia (Próximamente)
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 2 }}>
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
                        sx={{ mt: 2 }}
                        disabled
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
