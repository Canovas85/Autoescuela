import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@mui/material";

import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Grid,
  Chip,
} from "@mui/material";

import { clasesDirectoService } from "../../services/clasesDirecto.service";

export default function ClaseDirectoDetalle() {
  const { id } = useParams();

  const [clase, setClase] = useState(null);
  const [loading, setLoading] = useState(true);

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
      <Typography variant="h4" fontWeight={700} mb={3}>
        {clase.titulo}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={9}>
          <Paper
            elevation={3}
            sx={{
              marginTop: 4,
              overflow: "hidden",
              borderRadius: 3,
              height: "400px",
              width: "600px",
            }}
          >
            <iframe
              width="600"
              height="400"
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
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper
            elevation={3}
            sx={{
              mt: 4,
              p: 4,
              borderRadius: 3,
              height: "400px",
              width: "400px",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Información
            </Typography>
            <Typography sx={{ mb: 2 }}>
              <Chip label={`Permiso ${clase.permiso}`} color="primary" />
            </Typography>
            <Typography sx={{ mb: 2 }}>
              <strong>Duración:</strong> {duracionMinutos} min
            </Typography>

            <Typography sx={{ mb: 2 }}>
              <strong>Profesor:</strong>{" "}
              {clase.profesor?.usuario?.nombre || "No asignado"}
            </Typography>

            <Typography>
              <Chip label="Activa" color="success" />
            </Typography>

            <Button
              variant="contained"
              size="large"
              fullWidth
              sx={{
                mt: 12,
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 600,
              }}
            >
              Comenzar clase
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <Paper
        elevation={3}
        sx={{
          mt: 4,
          p: 4,
          borderRadius: 3,
        }}
      >
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Descripción de la clase
        </Typography>

        <Typography>{clase.descripcion}</Typography>
      </Paper>
    </Box>
  );
}
