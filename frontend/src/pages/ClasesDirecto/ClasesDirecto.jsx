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

import SchoolIcon from "@mui/icons-material/School";

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
  const getTemaNumero = (titulo = "") => {
    const match = titulo.match(/tema\s*(\d+)/i);
    if (!match) return Number.MAX_SAFE_INTEGER;
    return Number(match[1]);
  };

  const cargarClases = async () => {
    try {
      const data = await clasesDirectoService.getAllAlumno();

      const ordenadas = [...data].sort((a, b) => {
        return getTemaNumero(a.titulo) - getTemaNumero(b.titulo);
      });

      setClases(ordenadas);
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

      {clases.length === 0 && (
        <Box
          p={6}
          textAlign="center"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <SchoolIcon
            sx={{
              fontSize: 100,
              color: "#1976d2",
              mb: 2,
            }}
          />

          <Typography variant="h4" fontWeight={700} gutterBottom>
            Próximamente nuevas clases en directo
          </Typography>

          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 700 }}
          >
            Estamos preparando contenido exclusivo para el permiso de conducir
            que estás cursando.
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              mt: 2,
              maxWidth: 700,
            }}
          >
            Muy pronto tendrás acceso a clases explicadas por nuestros
            profesores, material de apoyo y contenido formativo para ayudarte a
            superar el examen con éxito.
          </Typography>

          <Button
            variant="contained"
            disabled
            sx={{
              mt: 4,
              px: 4,
              py: 1.5,
            }}
          >
            Contenido disponible próximamente
          </Button>
        </Box>
      )}

      <Grid container spacing={3}>
        {clases.map((clase) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={clase.id}>
            <Card
              sx={{
                height: 430,
                width: 400,
                mt: 3,
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
              <CardContent
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  {clase.titulo}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 0,
                    minHeight: 60,
                  }}
                >
                  {clase.descripcion?.slice(0, 120)}...
                </Typography>

                <Typography variant="body2">
                  Permiso: {clase.permiso}
                </Typography>

                <Button
                  variant="contained"
                  sx={{ mt: "auto" }}
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
