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
        <Typography variant="h4" fontWeight={900} sx={{ mb: 1, mt: -2 }}>
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
        <Grid container spacing={3} sx={{ justifyContent: "flex-start" }}>
          {temarios.length === 0 && (
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
              key={temario.id}
              size={{ xs: 12, sm: 6, md: 3 }}
              sx={{
                width: 330,
              }}
            >
              <Card
                sx={{
                  width: 390,
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
                      mb: 0.5, // Reducido para acercar la descripción hacia arriba
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
                      mb: 4, // Aumentado para generar la línea en blanco con el siguiente bloque
                      display: "-webkit-box",
                      WebkitLineClamp: 3, // Aumentado a 3 para que el texto de la imagen no se corte
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
                      sx={{
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
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
                        sx={{
                          fontWeight: 700,
                          letterSpacing: "1px",
                          textTransform: "uppercase",
                          borderRadius: "8px",
                          padding: "8px 24px",
                          border: "1px solid",
                          borderColor: "#0284c7 !important",
                          color: "#0284c7",
                          backgroundColor: "transparent",
                          boxShadow: `
      0px 4px 0px #0369a1, 
      0px 8px 16px rgba(2, 132, 199, 0.15),
      inset 0px 1px 0px rgba(255, 255, 255, 0.1)
    `,
                          transition: "all 0.15s ease-in-out",
                          "& .MuiButton-endIcon": { color: "inherit" },
                          "&:hover": {
                            color: "#0ea5e9",
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
                        }}
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
