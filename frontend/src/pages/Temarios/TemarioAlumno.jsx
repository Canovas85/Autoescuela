import { useEffect, useState } from "react";

import {
  Button,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import SchoolIcon from "@mui/icons-material/School";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";

import { temariosService } from "../../services/temariosService";
import TemarioHero from "./TemarioHero";
import { matriculasService } from "../../services/matriculasService";

import AccesoRestringidoMatricula from "../../components/matricula/AccesoRestringidoMatricula";

export default function TemarioAlumno() {
  const [temarios, setTemarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matricula, setMatricula] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const loadTemarios = async () => {
      try {
        const matriculaData = await matriculasService.getMine();

        setMatricula(matriculaData);
        const data = await temariosService.getMine();
        setTemarios(data || []);
      } catch (error) {
        console.error("Error cargando temarios del alumno:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTemarios();
  }, []);
  if (matricula && matricula.estado !== "PAGADA") {
    return <AccesoRestringidoMatricula matricula={matricula} />;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <TemarioHero mode="student" />

      <Box>
        <Typography variant="h4" fontWeight={900} sx={{ mb: 1 }}>
          Temario de tu permiso
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Aquí tienes los bloques teóricos de tu licencia objetivo, ordenados
          para ir estudiando progresivamente.
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3} justifyContent="flex-start">
          {temarios.length === 0 && (
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: 3, border: "1px solid #e2e8f0" }}>
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  <Typography color="text.secondary">
                    No hay temas asignados para tu permiso todavía.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}

          {temarios.map((temario) => (
            <Grid
              item
              key={temario.id}
              sx={{
                width: 330,
              }}
            >
              <Card
                sx={{
                  width: 330,
                  height: 320,
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 18px 36px rgba(15, 23, 42, 0.08)",
                  transition: "transform 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <Chip
                      icon={<SchoolIcon fontSize="small" />}
                      label={`Tema ${temario.orden ?? "-"}`}
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      label={temario.revisado ? "Revisado" : "Pendiente"}
                      color={temario.revisado ? "success" : "warning"}
                      size="small"
                    />
                  </Box>

                  <Typography
                    variant="h6"
                    fontWeight={800}
                    sx={{
                      mb: 1,
                      minHeight: 64,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {temario.titulo}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      minHeight: 48,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {temario.descripcion ||
                      "El contenido teórico de este tema se irá desarrollando en próximas entregas."}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                      gap: 2,
                      color: "#0f172a",
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <Typography
                          variant="body2"
                          fontWeight={700}
                          sx={{ color: "text.secondary" }}
                        >
                          Estado del tema:
                        </Typography>

                        <Box
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 0.75,
                            color: temario.revisado ? "#15803d" : "#b45309",
                            fontWeight: 700,
                            fontSize: "0.875rem", // Para emparejar el tamaño con el variant="body2"
                          }}
                        >
                          {temario.revisado ? "Revisado" : "Por empezar"}
                        </Box>
                      </Box>
                    </Stack>
                    <Box sx={{ mt: "auto" }}>
                      <Button
                        fullWidth
                        variant="contained"
                        endIcon={<ArrowForwardIcon />}
                        onClick={() => navigate(`/temario/${temario.id}`)}
                      >
                        Entrar al tema
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
