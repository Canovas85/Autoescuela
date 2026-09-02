import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@mui/material";

import { useNavigate } from "react-router-dom";

import { Tabs, Tab, LinearProgress } from "@mui/material";

import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Grid,
  Chip,
} from "@mui/material";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import SellIcon from "@mui/icons-material/Sell";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import DownloadIcon from "@mui/icons-material/Download";

import { clasesDirectoService } from "../../services/clasesDirecto.service";

export default function ClaseDirectoDetalle() {
  const { id } = useParams();

  const [clase, setClase] = useState(null);
  const [loading, setLoading] = useState(true);

  const [tab, setTab] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    cargarClase();
  }, [id]);

  const cargarClase = async () => {
    try {
      const data = await clasesDirectoService.getById(id);

      setClase(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!clase) {
    return (
      <Box p={4}>
        <Typography>Clase no encontrada</Typography>
      </Box>
    );
  }

  const duracionMinutos = Math.round(clase.duracionSegundos / 60);

  const videoEmbedUrl = clase.videoUrl.includes("watch?v=")
    ? clase.videoUrl.replace("watch?v=", "embed/")
    : clase.videoUrl;

  return (
    <Box p={3}>
      <Button
        variant="text"
        sx={{ mb: 0 }}
        onClick={() => navigate("/clases-directo")}
      >
        ← Volver a mis clases
      </Button>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 1,
        }}
      >
        <Typography variant="h4" fontWeight={700}>
          {clase.titulo}
        </Typography>

        <Chip label="Clase grabada" color="primary" variant="outlined" />
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <PersonIcon fontSize="small" />
          <Typography variant="body2">
            {clase.profesor?.usuario?.nombre || "Sin asignar"}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AccessTimeIcon fontSize="small" />
          <Typography variant="body2">{duracionMinutos} min</Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={9}>
          <Paper
            elevation={3}
            sx={{
              marginTop: 1,
              overflow: "hidden",
              borderRadius: 3,
              height: "520px",
              width: "100%",
            }}
          >
            <iframe
              width="100%"
              height="520"
              src={videoEmbedUrl}
              title={clase.titulo}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                border: "none",
                height: "100%",
              }}
            />
          </Paper>
          <Paper
            elevation={1}
            sx={{
              mt: 2,
              p: 2,
              display: "flex",
              gap: 2,
              justifyContent: "center",
            }}
          >
            <Button startIcon={<CheckCircleIcon />}>
              Marcar como completada
            </Button>

            <Button startIcon={<FavoriteBorderIcon />}>
              Añadir a favoritos
            </Button>

            <Button startIcon={<DownloadIcon />}>Descargar material</Button>
          </Paper>

          <Paper
            elevation={3}
            sx={{
              mt: 2,
              borderRadius: 3,
              width: "100%",
              height: 420,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Tabs value={tab} onChange={(e, value) => setTab(value)}>
              <Tab label="Descripción" />
              <Tab label="Contenido" />
              <Tab label="Material de apoyo" />
              <Tab label="Preguntas frecuentes" />
            </Tabs>

            <Box
              sx={{
                pt: 7,
                pl: 5,
                pr: 4,
                pb: 4,
                flex: 1,
                overflowY: "auto",
              }}
            >
              {tab === 0 && <Typography>{clase.descripcion}</Typography>}

              {tab === 1 && (
                <>
                  <Typography sx={{ mb: 2 }}>1. Introducción</Typography>

                  <Typography sx={{ mb: 2 }}>2. Desarrollo del tema</Typography>

                  <Typography sx={{ mb: 2 }}>3. Ejemplos prácticos</Typography>

                  <Typography>4. Resumen final</Typography>
                </>
              )}

              {tab === 2 && (
                <Typography color="text.secondary">
                  Próximamente podrás descargar material de apoyo para esta
                  clase.
                </Typography>
              )}
              {tab === 3 && (
                <>
                  <Typography mb={2}>¿Puedo repetir la clase?</Typography>

                  <Typography mb={2}>
                    Sí, puedes verla tantas veces como necesites.
                  </Typography>

                  <Typography mb={2}>¿Se guarda mi progreso?</Typography>

                  <Typography>Próximamente.</Typography>
                </>
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper
            elevation={3}
            sx={{
              mt: 1,
              p: 4,
              borderRadius: 3,
              height: "400px",
              width: "100%",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Información de la clase
            </Typography>

            <Box display="flex" gap={1} mb={2}>
              <CalendarMonthIcon fontSize="small" />
              <Typography variant="body2">Fecha publicación</Typography>
            </Box>

            <Box display="flex" gap={1} mb={2}>
              <AccessTimeIcon fontSize="small" />
              <Typography variant="body2">{duracionMinutos} min</Typography>
            </Box>

            <Box display="flex" gap={1} mb={2}>
              <PersonIcon fontSize="small" />
              <Typography variant="body2">
                {clase.profesor?.usuario?.nombre || "Sin asignar"}
              </Typography>
            </Box>

            <Box display="flex" gap={1} mb={3}>
              <SellIcon fontSize="small" />
              <Typography variant="body2">Señales de tráfico</Typography>
            </Box>

            <Typography>
              <Chip
                label={clase.activa ? "Activa" : "Inactiva"}
                color={clase.activa ? "success" : "error"}
              />
            </Typography>

            <Button
              variant="contained"
              size="large"
              fullWidth
              sx={{
                mt: 6,
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 600,
              }}
            >
              Comenzar clase
            </Button>
          </Paper>
          <Paper
            elevation={3}
            sx={{
              mt: 6,
              p: 3,
              borderRadius: 3,
              width: "100%",
            }}
          >
            <Typography fontWeight={600} gutterBottom>
              Progreso de la clase
            </Typography>

            <Typography variant="h4" color="primary">
              60%
            </Typography>

            <LinearProgress
              variant="determinate"
              value={60}
              sx={{
                height: 10,
                borderRadius: 5,
                mt: 1,
                mb: 1,
              }}
            />

            <Typography variant="body2" color="text.secondary">
              27:18 min vistos
            </Typography>
          </Paper>
          <Paper
            elevation={3}
            sx={{
              mt: 3,
              p: 3,
              borderRadius: 3,
              width: "100%",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Cuestionario final
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Comprueba los conocimientos adquiridos durante esta clase.
            </Typography>

            <Button fullWidth variant="contained" disabled>
              Próximamente disponible
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
