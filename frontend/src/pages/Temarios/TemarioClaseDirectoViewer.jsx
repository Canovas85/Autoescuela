import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { temariosService } from "../../services/temariosService";

const toEmbedUrl = (url = "") => {
  const value = url.trim();

  if (!value) {
    return "";
  }

  if (value.includes("youtube.com/watch?v=")) {
    return value.replace("watch?v=", "embed/");
  }

  if (value.includes("youtu.be/")) {
    const videoId = value.split("youtu.be/")[1]?.split(/[?&]/)[0] || "";
    return videoId ? `https://www.youtube.com/embed/${videoId}` : value;
  }

  return value;
};

export default function TemarioClaseDirectoViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [temario, setTemario] = useState(null);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const isAdmin = (() => {
    if (!token) {
      return false;
    }

    try {
      const decoded = jwtDecode(token);
      return decoded?.rol === "ADMIN" || decoded?.rol === "ADMINISTRATIVO";
    } catch {
      return false;
    }
  })();

  const backPath = isAdmin ? `/temarios/${id}` : `/temario/${id}`;

  useEffect(() => {
    const loadTema = async () => {
      try {
        setLoading(true);
        setError("");

        const data = isAdmin
          ? await temariosService.getById(id)
          : await temariosService.getMineById(id);

        setTemario(data);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "No se pudo cargar la clase en directo.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadTema();
  }, [id, isAdmin]);

  const embedUrl = useMemo(
    () => toEmbedUrl(temario?.claseDirectoVideoUrl || ""),
    [temario],
  );

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!temario?.claseDirectoVideoUrl) {
    return (
      <Box sx={{ display: "grid", gap: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(backPath)}
        >
          Volver al tema
        </Button>
        <Alert severity="info">
          Este tema todavía no tiene clase en directo configurada.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "grid", gap: 2.5 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(backPath)}
        sx={{ justifySelf: "start" }}
      >
        Volver al tema
      </Button>

      <Card
        sx={{
          borderRadius: 2,
          background:
            "linear-gradient(120deg, rgba(15,23,42,0.97) 0%, rgba(30,64,175,0.9) 100%)",
          color: "#fff",
        }}
      >
        <CardContent>
          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1} alignItems="center" useFlexGap>
              <OndemandVideoIcon />
              <Typography variant="h4" fontWeight={900}>
                {temario.titulo || "Clase en Directo"}
              </Typography>
            </Stack>
            <Typography sx={{ opacity: 0.9 }}>
              {temario.descripcion || "Visualización interna de la clase."}
            </Typography>
            <Stack direction="row" spacing={1} useFlexGap>
              <Chip
                icon={<PersonIcon fontSize="small" />}
                label="Visualización interna"
                sx={{
                  backgroundColor: "rgba(255,255,255,0.14)",
                  color: "#fff",
                }}
              />
              <Chip
                icon={<AccessTimeIcon fontSize="small" />}
                label="Reproducción en nueva pestaña"
                sx={{
                  backgroundColor: "rgba(255,255,255,0.14)",
                  color: "#fff",
                }}
              />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Paper
        elevation={3}
        sx={{
          overflow: "hidden",
          borderRadius: 2,
          width: "100%",
          minHeight: { xs: 280, md: 620 },
          height: { xs: 280, md: 620 },
        }}
      >
        <iframe
          width="100%"
          height="100%"
          src={embedUrl}
          title={temario.titulo || "Clase en directo"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ border: 0 }}
        />
      </Paper>
    </Box>
  );
}
