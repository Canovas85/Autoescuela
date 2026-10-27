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
import { matriculasService } from "../../services/matriculasService";

import AccesoRestringidoMatricula from "../../components/matricula/AccesoRestringidoMatricula";
import { useNavigate } from "react-router-dom";

export default function ClasesDirecto() {
  const navigate = useNavigate();
  const [clases, setClases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matricula, setMatricula] = useState(null);

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
      const matriculaData = await matriculasService.getMine();

      setMatricula(matriculaData);

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
  if (matricula && matricula.estado !== "PAGADA") {
    return <AccesoRestringidoMatricula matricula={matricula} />;
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
                  variant="outlined"
                  onClick={() => navigate(`/clases-directo/${clase.id}`)}
                  sx={{
                    mt: "auto",
                    fontWeight: 700,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    borderRadius: "8px",
                    padding: "6px 24px",
                    border: "1px solid",

                    // Texto y bordes en color azul oscuro profundo
                    color: "#1e3a8a",
                    borderColor: "#1e3a8a !important",
                    backgroundColor: "transparent",

                    // Triple sombra adaptada para relieve azul oscuro (borde inferior sólido + brillo sutil)
                    boxShadow: `
      0px 4px 0px #172554, 
      0px 8px 16px rgba(30, 58, 138, 0.15),
      inset 0px 1px 0px rgba(255, 255, 255, 0.1)
    `,

                    // Suavizado de todas las animaciones físicas
                    transition: "all 0.15s ease-in-out",

                    "&:hover": {
                      // Al pasar el ratón, se activa un azul más vivo con un fondo sutilmente iluminado
                      color: "#2563eb",
                      borderColor: "#2563eb !important",
                      backgroundColor: "rgba(30, 58, 138, 0.04)",
                      boxShadow: `
        0px 4px 0px #172554, 
        0px 12px 20px rgba(37, 99, 235, 0.25),
        inset 0px 1px 0px rgba(255, 255, 255, 0.2)
      `,
                      transform: "translateY(-1px)", // Se eleva ligeramente
                    },

                    "&:active": {
                      // Efecto mecánico físico de hundimiento al hacer clic (Relieve presionado)
                      borderColor: "#1e3a8a !important",
                      boxShadow: `
        0px 1px 0px #172554, 
        0px 2px 4px rgba(30, 58, 138, 0.2),
        inset 0px 2px 4px rgba(0, 0, 0, 0.05)
      `,
                      transform: "translateY(3px)", // Se desplaza hacia abajo exactamente el grosor del relieve anterior
                    },
                  }}
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
