import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  LinearProgress,
  Link,
  List,
  ListItem,
  ListItemText,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SchoolIcon from "@mui/icons-material/School";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import PersonIcon from "@mui/icons-material/Person";

import { temariosService } from "../../services/temariosService";
import { getTemarioBTheory } from "./temarioBTheory";

export default function TemarioTemaDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [temario, setTemario] = useState(null);
  const [error, setError] = useState("");
  const [respuestas, setRespuestas] = useState({});
  const [corregido, setCorregido] = useState(false);
  const [guardandoResultado, setGuardandoResultado] = useState(false);
  const [resultadoGuardado, setResultadoGuardado] = useState(null);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [videoUrlDraft, setVideoUrlDraft] = useState("");
  const [adminFeedback, setAdminFeedback] = useState(null);

  const token = localStorage.getItem("token");
  const isAdmin = (() => {
    if (!token) {
      return false;
    }

    try {
      const decoded = jwtDecode(token);
      return decoded?.rol === "ADMIN" || decoded?.rol === "ADMINISTRATIVO";
    } catch (error) {
      console.error("Error leyendo JWT del temario:", error);
      return false;
    }
  })();

  useEffect(() => {
    const loadTema = async () => {
      try {
        setLoading(true);
        setError("");

        const data = isAdmin
          ? await temariosService.getById(id)
          : await temariosService.getMineById(id);

        setTemario(data);
        setRespuestas({});
        setCorregido(false);
        setResultadoGuardado(null);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "No se pudo cargar el detalle del tema.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadTema();
  }, [id, isAdmin]);

  const theory = useMemo(() => getTemarioBTheory(temario), [temario]);
  const miniTest = theory?.miniTest || [];
  const historialIntentos = temario?.historialIntentos || [];
  const licenciasTemario = Array.isArray(temario?.tipoLicenciaObjetivo)
    ? temario.tipoLicenciaObjetivo
    : temario?.tipoLicenciaObjetivo
      ? [temario.tipoLicenciaObjetivo]
      : [];
  const licenciasTemarioLabel =
    licenciasTemario.length > 0 ? licenciasTemario.join(", ") : "-";
  const preguntasRespondidas = Object.keys(respuestas).length;
  const miniTestCompleto =
    miniTest.length > 0 && preguntasRespondidas === miniTest.length;
  const aciertos = miniTest.reduce((total, pregunta, index) => {
    return respuestas[index] === pregunta.correcta ? total + 1 : total;
  }, 0);
  const porcentaje =
    miniTest.length > 0 ? Math.round((aciertos / miniTest.length) * 100) : 0;

  const handleRespuesta = (index, value) => {
    setRespuestas((prev) => ({
      ...prev,
      [index]: value,
    }));

    if (corregido) {
      setCorregido(false);
    }

    if (resultadoGuardado) {
      setResultadoGuardado(null);
    }
  };

  const handleCorregir = async () => {
    setCorregido(true);

    try {
      setGuardandoResultado(true);

      const response = await temariosService.saveMiniTestResult(id, {
        aciertos,
        totalPreguntas: miniTest.length,
        porcentaje,
      });

      if (response?.temario) {
        setTemario(response.temario);
      }

      setResultadoGuardado({
        ok: true,
        message:
          response?.message ||
          "Resultado del mini test guardado correctamente.",
      });
    } catch (saveError) {
      setResultadoGuardado({
        ok: false,
        message:
          saveError.response?.data?.message ||
          "No se pudo guardar el resultado del mini test.",
      });
    } finally {
      setGuardandoResultado(false);
    }
  };

  const handleReintentar = () => {
    setRespuestas({});
    setCorregido(false);
    setResultadoGuardado(null);
  };

  const hasDocumentacion = Boolean(temario?.documentacionRuta);
  const hasClaseDirecto = Boolean(temario?.claseDirectoVideoUrl);
  const backPath = isAdmin ? "/temarios" : "/temario";
  const claseDirectoViewerPath = isAdmin
    ? `/temarios/${id}/clase-directo`
    : `/temario/${id}/clase-directo`;

  const toLicenciasArray = (valor) => {
    if (Array.isArray(valor)) {
      return valor;
    }

    if (typeof valor === "string" && valor.trim()) {
      return [valor.trim()];
    }

    return [];
  };

  const handleUploadDocumentacion = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setAdminFeedback(null);
      const updated = await temariosService.uploadDocumentacion(id, file);
      setTemario(updated);
      setAdminFeedback({
        ok: true,
        message: "Documentación subida correctamente",
      });
    } catch (uploadError) {
      setAdminFeedback({
        ok: false,
        message:
          uploadError.response?.data?.message ||
          "No se pudo subir la documentación",
      });
    } finally {
      event.target.value = "";
    }
  };

  const handleGuardarVideoTema = async () => {
    if (!temario) {
      return;
    }

    try {
      setAdminFeedback(null);

      const updated = await temariosService.update(id, {
        titulo: temario.titulo || "",
        descripcion: temario.descripcion || "",
        tipoLicenciaObjetivo: toLicenciasArray(temario.tipoLicenciaObjetivo),
        orden: Number(temario.orden ?? 0),
        documentacionRuta: temario.documentacionRuta || "",
        claseDirectoVideoUrl: videoUrlDraft,
      });

      setTemario(updated);
      setVideoDialogOpen(false);
      setVideoUrlDraft("");
      setAdminFeedback({
        ok: true,
        message: "Clase en directo guardada correctamente",
      });
    } catch (saveError) {
      setAdminFeedback({
        ok: false,
        message:
          saveError.response?.data?.message ||
          "No se pudo guardar la clase en directo",
      });
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        sx={{
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          gap: 2,
          mb: 3,
        }}
      >
        <Breadcrumbs>
          <Link
            underline="hover"
            color="inherit"
            component="button"
            onClick={() => navigate(backPath)}
            sx={{ fontWeight: 600 }}
          >
            {isAdmin ? "Temarios" : "Temario"}
          </Link>
          <Typography color="text.primary">Detalle del tema</Typography>
        </Breadcrumbs>

        {/* Contenedor de acciones agrupadas a la izquierda del botón de retorno */}
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "flex-end",
            flex: 1,
          }}
        >
          {/* 1. Subir documentación (Admin) - Azul Eléctrico Ciano */}
          {isAdmin && !loading && !error && (
            <Button
              component="label"
              variant="outlined"
              size="small"
              startIcon={<UploadFileIcon />}
              sx={{
                fontWeight: 700,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                borderRadius: "8px",
                padding: "4px 16px",
                border: "1px solid",
                borderColor: "#0284c7 !important",
                color: "#0284c7",
                backgroundColor: "transparent",
                boxShadow: `
            0px 3px 0px #0369a1, 
            0px 6px 12px rgba(2, 132, 199, 0.15)
          `,
                transition: "all 0.15s ease-in-out",
                "& .MuiButton-startIcon": { color: "inherit" },
                "&:hover": {
                  color: "#0ea5e9",
                  borderColor: "#0ea5e9 !important",
                  backgroundColor: "rgba(2, 132, 199, 0.04)",
                  boxShadow: `
              0px 3px 0px #0369a1, 
              0px 8px 14px rgba(14, 165, 233, 0.25)
            `,
                  transform: "translateY(-1px)",
                },
                "&:active": {
                  borderColor: "#0284c7 !important",
                  boxShadow: `
              0px 1px 0px #0369a1, 
              0px 2px 4px rgba(2, 132, 199, 0.2)
            `,
                  transform: "translateY(2px)",
                },
              }}
            >
              Subir documentación
              <input
                hidden
                accept="application/pdf"
                type="file"
                onChange={handleUploadDocumentacion}
              />
            </Button>
          )}

          {/* 2. Clase en Directo (Admin) - Morado Vibrante */}
          {isAdmin && !loading && !error && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<OndemandVideoIcon />}
              onClick={() => {
                setVideoUrlDraft(temario?.claseDirectoVideoUrl || "");
                setVideoDialogOpen(true);
              }}
              sx={{
                fontWeight: 700,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                borderRadius: "8px",
                padding: "4px 16px",
                border: "1px solid",
                borderColor: "#6d28d9 !important",
                color: "#6d28d9",
                backgroundColor: "transparent",
                boxShadow: `
            0px 3px 0px #5b21b6, 
            0px 6px 12px rgba(109, 40, 217, 0.15)
          `,
                transition: "all 0.15s ease-in-out",
                "& .MuiButton-startIcon": { color: "inherit" },
                "&:hover": {
                  color: "#8b5cf6",
                  borderColor: "#8b5cf6 !important",
                  backgroundColor: "rgba(109, 40, 217, 0.04)",
                  boxShadow: `
              0px 3px 0px #5b21b6, 
              0px 8px 14px rgba(139, 92, 246, 0.25)
            `,
                  transform: "translateY(-1px)",
                },
                "&:active": {
                  borderColor: "#6d28d9 !important",
                  boxShadow: `
              0px 1px 0px #5b21b6, 
              0px 2px 4px rgba(109, 40, 217, 0.2)
            `,
                  transform: "translateY(2px)",
                },
              }}
            >
              Clase en Directo
            </Button>
          )}

          {/* 3. Documentación (Usuario) - Naranja */}
          {!loading && !error && hasDocumentacion && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<UploadFileIcon />}
              href={temario.documentacionRuta}
              target="_blank"
              rel="noreferrer"
              sx={{
                fontWeight: 700,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                borderRadius: "8px",
                padding: "4px 16px",
                border: "1px solid",
                color: "#ea580c",
                borderColor: "#ea580c !important",
                backgroundColor: "transparent",
                boxShadow: `
            0px 3px 0px #9a3412, 
            0px 6px 12px rgba(234, 88, 12, 0.15)
          `,
                transition: "all 0.15s ease-in-out",
                "& .MuiButton-startIcon": { color: "inherit" },
                "&:hover": {
                  color: "#f97316",
                  borderColor: "#f97316 !important",
                  backgroundColor: "rgba(234, 88, 12, 0.04)",
                  boxShadow: `
              0px 3px 0px #9a3412, 
              0px 8px 14px rgba(249, 115, 22, 0.25)
            `,
                  transform: "translateY(-1px)",
                },
                "&:active": {
                  borderColor: "#ea580c !important",
                  boxShadow: `
              0px 1px 0px #9a3412, 
              0px 2px 4px rgba(234, 88, 12, 0.2)
            `,
                  transform: "translateY(2px)",
                },
              }}
            >
              Documentación
            </Button>
          )}

          {/* 4. Clase en Directo (Usuario) - Verde Esmeralda */}
          {!loading && !error && hasClaseDirecto && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<OndemandVideoIcon />}
              href={claseDirectoViewerPath}
              sx={{
                fontWeight: 700,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                borderRadius: "8px",
                padding: "4px 16px",
                border: "1px solid",
                color: "#15803d",
                borderColor: "#15803d !important",
                backgroundColor: "transparent",
                boxShadow: `
            0px 3px 0px #166534, 
            0px 6px 12px rgba(21, 128, 61, 0.15)
          `,
                transition: "all 0.15s ease-in-out",
                "& .MuiButton-startIcon": { color: "inherit" },
                "&:hover": {
                  color: "#22c55e",
                  borderColor: "#22c55e !important",
                  backgroundColor: "rgba(21, 128, 61, 0.04)",
                  boxShadow: `
              0px 3px 0px #166534, 
              0px 8px 14px rgba(34, 197, 94, 0.25)
            `,
                  transform: "translateY(-1px)",
                },
                "&:active": {
                  borderColor: "#15803d !important",
                  boxShadow: `
              0px 1px 0px #166534, 
              0px 2px 4px rgba(21, 128, 61, 0.2)
            `,
                  transform: "translateY(2px)",
                },
              }}
            >
              Clase en Directo
            </Button>
          )}

          {/* Botón de navegación estructural - Azul Oscuro Profundo */}
          <Button
            variant="outlined"
            size="small"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(backPath)}
            sx={{
              fontWeight: 700,
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              borderRadius: "8px",
              padding: "4px 16px",
              border: "1px solid",
              color: "#1e3a8a",
              borderColor: "#1e3a8a !important",
              backgroundColor: "transparent",
              boxShadow: `
          0px 3px 0px #172554, 
          0px 6px 12px rgba(30, 58, 138, 0.15)
        `,
              transition: "all 0.15s ease-in-out",
              "& .MuiButton-startIcon": { color: "inherit" },
              "&:hover": {
                color: "#2563eb",
                borderColor: "#2563eb !important",
                backgroundColor: "rgba(30, 58, 138, 0.04)",
                boxShadow: `
            0px 3px 0px #172554, 
            0px 8px 14px rgba(37, 99, 235, 0.25)
          `,
                transform: "translateY(-1px)",
              },
              "&:active": {
                borderColor: "#1e3a8a !important",
                boxShadow: `
            0px 1px 0px #172554, 
            0px 2px 4px rgba(30, 58, 138, 0.2)
          `,
                transform: "translateY(2px)",
              },
            }}
          >
            {isAdmin ? "Volver a temarios" : "Volver al temario"}
          </Button>
        </Stack>
      </Stack>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ borderRadius: "8px", fontWeight: 600 }}>
          {error}
        </Alert>
      ) : (
        <>
          <Card
            sx={{
              borderRadius: 2,
              background:
                "linear-gradient(120deg, rgba(15,23,42,0.97) 0%, rgba(30,64,175,0.9) 100%)",
              color: "#fff",
              boxShadow: "0px 8px 32px rgba(15, 23, 42, 0.08)",
            }}
          >
            <CardContent>
              <Stack
                direction={{ xs: "column", md: "row" }}
                sx={{
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", md: "center" },
                }}
                spacing={2}
              >
                <Box>
                  <Typography variant="overline" sx={{ opacity: 0.85 }}>
                    Tema {temario?.orden ?? "-"}
                  </Typography>
                  <Typography variant="h4" fontWeight={900} sx={{ mt: 0.5 }}>
                    {temario?.titulo}
                  </Typography>
                  <Typography sx={{ mt: 1.5, opacity: 0.9 }}>
                    {temario?.descripcion ||
                      "Contenido teórico del tema en construcción."}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip
                    icon={
                      <SchoolIcon
                        fontSize="small"
                        style={{ color: "inherit" }}
                      />
                    }
                    label={"Permisos " + licenciasTemarioLabel}
                    sx={{
                      fontWeight: 600,
                      backgroundColor: "rgba(255,255,255,0.15)",
                      color: "#fff",
                      borderRadius: "6px",
                      border: "1px solid rgba(255,255,255,0.25)",
                    }}
                  />
                </Stack>
              </Stack>

              {isAdmin && adminFeedback && (
                <Alert
                  severity={adminFeedback.ok ? "success" : "error"}
                  sx={{ mt: 2 }}
                >
                  {adminFeedback.message}
                </Alert>
              )}
            </CardContent>
          </Card>

          {theory ? (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 7 }}>
                <Card sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
                      Objetivo de aprendizaje
                    </Typography>
                    <Typography color="text.secondary">
                      {theory.objetivo}
                    </Typography>

                    <Divider sx={{ my: 2.5 }} />

                    <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
                      Teoría del tema
                    </Typography>
                    <List sx={{ py: 0 }}>
                      {theory.teoria.map((punto) => (
                        <ListItem key={punto} sx={{ px: 0, py: 0.5 }}>
                          <ListItemText primary={punto} />
                        </ListItem>
                      ))}
                    </List>

                    <Divider sx={{ my: 2.5 }} />

                    <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
                      Repaso rápido
                    </Typography>
                    <Alert
                      icon={<MenuBookIcon fontSize="inherit" />}
                      severity="info"
                      sx={{ mb: 4 }}
                    >
                      {theory.repasoRapido}
                    </Alert>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 5 }}>
                <Stack spacing={3}>
                  <Card sx={{ borderRadius: 3 }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
                        Conceptos clave
                      </Typography>
                      <List sx={{ py: 0 }}>
                        {theory.conceptosClave.map((item) => (
                          <ListItem key={item} sx={{ px: 0, py: 0.5 }}>
                            <ListItemText primary={item} />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>

                  <Card sx={{ borderRadius: 3 }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
                        Errores frecuentes
                      </Typography>
                      <List sx={{ py: 0 }}>
                        {theory.erroresFrecuentes.map((item) => (
                          <ListItem key={item} sx={{ px: 0, py: 0.5 }}>
                            <ListItemText primary={item} />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Stack>
              </Grid>
            </Grid>
          ) : (
            <Alert severity="warning">
              La teoría detallada para este tema se publicará próximamente.
            </Alert>
          )}
        </>
      )}

      <Card sx={{ borderRadius: 3 }}>
        {!isAdmin && (
          <Box
            sx={{
              mt: 2,
              p: 1.5,

              borderRadius: 0,
              backgroundColor: "#f5f5f5",
            }}
          >
            <Stack
              direction="row"
              sx={{
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#3033ff",
                    color: "#fff",
                  }}
                >
                  <PersonIcon fontSize="small" />
                </Box>
                <Typography variant="h6" fontWeight={900} color="#111827">
                  Zona del alumno
                </Typography>
              </Stack>

              <Chip
                size="small"
                label="Evaluación"
                sx={{
                  backgroundColor: "#3033ff",
                  color: "#fff",
                  fontWeight: 700,
                  borderRadius: 1,
                }}
              />
            </Stack>

            {miniTest.length === 0 ? (
              <Alert severity="info">
                Este tema todavía no tiene mini test disponible.
              </Alert>
            ) : (
              <>
                <Grid container spacing={2} alignItems="stretch">
                  {miniTest.slice(0, 3).map((pregunta, index) => (
                    <Grid
                      key={`${pregunta.pregunta}-${index}`}
                      size={{ xs: 12, md: 4 }}
                    >
                      <Box
                        sx={{
                          border: "3px solid #666565",
                          borderRadius: 2,
                          backgroundColor: "#fff",
                          p: 2,
                          height: "100%",
                          minHeight: 260,
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Typography
                          variant="h6"
                          fontWeight={900}
                          sx={{ mb: 1 }}
                        >
                          Pregunta {index + 1}
                        </Typography>
                        <Typography fontWeight={700} sx={{ mb: 1 }}>
                          {pregunta.pregunta}
                        </Typography>
                        <FormControl fullWidth>
                          <RadioGroup
                            value={respuestas[index] || ""}
                            onChange={(event) =>
                              handleRespuesta(index, event.target.value)
                            }
                          >
                            {pregunta.opciones.map((opcion) => (
                              <FormControlLabel
                                key={opcion}
                                value={opcion}
                                control={<Radio />}
                                label={opcion}
                              />
                            ))}
                          </RadioGroup>
                        </FormControl>

                        {corregido && (
                          <Typography
                            variant="body2"
                            sx={{
                              color:
                                respuestas[index] === pregunta.correcta
                                  ? "#15803d"
                                  : "#b91c1c",
                              fontWeight: 700,
                              mt: 1.5,
                            }}
                          >
                            {respuestas[index] === pregunta.correcta
                              ? "Respuesta correcta"
                              : `Respuesta correcta: ${pregunta.correcta}`}
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                <Grid container spacing={2} alignItems="stretch" sx={{ mt: 2 }}>
                  {miniTest.slice(3, 5).map((pregunta, index) => (
                    <Grid
                      key={`${pregunta.pregunta}-${index + 3}`}
                      size={{ xs: 12, md: 4 }}
                    >
                      <Box
                        sx={{
                          border: "3px solid #666565",
                          borderRadius: 2,
                          backgroundColor: "#fff",
                          p: 2,
                          height: "100%",
                          minHeight: 260,
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Typography
                          variant="h6"
                          fontWeight={900}
                          sx={{ mb: 1 }}
                        >
                          Pregunta {index + 4}
                        </Typography>
                        <Typography fontWeight={700} sx={{ mb: 1 }}>
                          {pregunta.pregunta}
                        </Typography>
                        <FormControl fullWidth>
                          <RadioGroup
                            value={respuestas[index + 3] || ""}
                            onChange={(event) =>
                              handleRespuesta(index + 3, event.target.value)
                            }
                          >
                            {pregunta.opciones.map((opcion) => (
                              <FormControlLabel
                                key={opcion}
                                value={opcion}
                                control={<Radio />}
                                label={opcion}
                              />
                            ))}
                          </RadioGroup>
                        </FormControl>

                        {corregido && (
                          <Typography
                            variant="body2"
                            sx={{
                              color:
                                respuestas[index + 3] === pregunta.correcta
                                  ? "#15803d"
                                  : "#b91c1c",
                              fontWeight: 700,
                              mt: 1.5,
                            }}
                          >
                            {respuestas[index + 3] === pregunta.correcta
                              ? "Respuesta correcta"
                              : `Respuesta correcta: ${pregunta.correcta}`}
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                <Box
                  sx={{
                    mt: 2,
                    border: "3px solid #666565",
                    borderRadius: 2,
                    backgroundColor: "#fff",
                    p: 2,
                  }}
                >
                  <Typography variant="h6" fontWeight={900} sx={{ mb: 2 }}>
                    Corrección del examen
                  </Typography>

                  <Stack spacing={1.5}>
                    <Button
                      variant="outlined"
                      onClick={handleCorregir}
                      disabled={!miniTestCompleto || guardandoResultado}
                      sx={{
                        border: "3px solid #111827",
                        color: "#111827",
                        borderRadius: 0,
                        fontWeight: 800,
                        py: 1.25,
                        textTransform: "none",
                      }}
                    >
                      {guardandoResultado
                        ? "Guardando resultado..."
                        : "Corregir test"}
                    </Button>

                    <Button
                      variant="outlined"
                      onClick={handleReintentar}
                      disabled={guardandoResultado}
                      sx={{
                        border: "3px solid #111827",
                        color: "#111827",
                        borderRadius: 0,
                        fontWeight: 800,
                        py: 1.25,
                        textTransform: "none",
                      }}
                    >
                      Reintentar Mini test
                    </Button>
                  </Stack>

                  {!miniTestCompleto && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1.5 }}
                    >
                      Responde todas las preguntas para corregir.
                    </Typography>
                  )}

                  {resultadoGuardado && (
                    <Alert
                      severity={resultadoGuardado.ok ? "success" : "error"}
                      sx={{ mt: 2 }}
                    >
                      {resultadoGuardado.message}
                    </Alert>
                  )}

                  {corregido && (
                    <Box sx={{ mt: 2 }}>
                      <Typography fontWeight={800} sx={{ mb: 1 }}>
                        Resultado: {aciertos}/{miniTest.length} ({porcentaje}%)
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={porcentaje}
                        sx={{ height: 10, borderRadius: 999, mb: 1 }}
                      />
                      <Alert
                        severity={porcentaje >= 80 ? "success" : "warning"}
                      >
                        {porcentaje >= 80
                          ? "Buen dominio del tema. Puedes seguir al siguiente bloque."
                          : "Conviene repasar la teoría y volver a intentarlo."}
                      </Alert>
                    </Box>
                  )}

                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" fontWeight={900} sx={{ mb: 1 }}>
                      Historial de intentos
                    </Typography>

                    {historialIntentos.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        Todavía no hay intentos guardados para este tema.
                      </Typography>
                    ) : (
                      <Stack spacing={1}>
                        {historialIntentos.map((intento) => (
                          <Box
                            key={intento.id}
                            sx={{
                              border: "1px solid #e2e8f0",
                              borderRadius: 2,
                              p: 1.25,
                              backgroundColor: "#f8fafc",
                            }}
                          >
                            <Stack
                              direction="row"
                              sx={{
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 0.5,
                              }}
                            >
                              <Typography variant="body2" fontWeight={700}>
                                {intento.aciertos}/{intento.totalPreguntas} (
                                {intento.porcentaje}%)
                              </Typography>
                              <Chip
                                size="small"
                                color={
                                  intento.resultado === "APROBADO"
                                    ? "success"
                                    : "warning"
                                }
                                label={intento.resultado}
                              />
                            </Stack>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {new Date(intento.fecha).toLocaleString("es-ES")}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    )}
                  </Box>
                </Box>
              </>
            )}
          </Box>
        )}
      </Card>

      <Dialog
        open={videoDialogOpen}
        onClose={() => setVideoDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Clase en directo del tema</DialogTitle>
        <DialogContent sx={{ pt: 1, display: "grid", gap: 2 }}>
          <TextField
            label="URL de YouTube o video"
            fullWidth
            value={videoUrlDraft}
            onChange={(event) => setVideoUrlDraft(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVideoDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleGuardarVideoTema}>
            Guardar video
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
