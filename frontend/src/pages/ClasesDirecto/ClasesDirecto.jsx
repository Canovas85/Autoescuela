import { useEffect, useState } from "react";
import CardMedia from "@mui/material/CardMedia";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
} from "@mui/material";

import { clasesDirectoService } from "../../services/clasesDirecto.service";
import { useNavigate } from "react-router-dom";

export default function ClasesDirecto() {
  const navigate = useNavigate();
  const [clases, setClases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarClases();
  }, []);

  const getThumbnail = (url) => {
    const match = url.match(/v=([^&]+)/);

    if (!match) return "";

    return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
  };

  const cargarClases = async () => {
    try {
      const data = await clasesDirectoService.getAll();
      const duracionMinutos = data.map((clase) =>
        Math.round(clase.duracionSegundos / 60),
      );

      setClases(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Typography>Cargando clases...</Typography>;
  }

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Clases en Directo
      </Typography>

      <Grid container spacing={3}>
        {clases.map((clase) => (
          <Grid item xs={12} md={6} lg={4} key={clase.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardMedia
                component="img"
                height="180"
                image={getThumbnail(clase.videoUrl)}
                alt={clase.titulo}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {clase.titulo}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {clase.descripcion?.slice(0, 120)}...
                </Typography>

                <Typography variant="body2">
                  Permiso: {clase.permiso}
                </Typography>

                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={() => navigate(`/clases-directo/${clase.id}`)}
                >
                  Ver clase
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
