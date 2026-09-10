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
      return decoded?.rol === "ADMIN";
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
        direction="row"
        sx={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <Breadcrumbs>
          <Link
            underline="hover"
            color="inherit"
            component="button"
            onClick={() => navigate(backPath)}
          >
            {isAdmin ? "Temarios" : "Temario"}
          </Link>
          <Typography color="text.primary">Detalle del tema</Typography>
        </Breadcrumbs>

        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(backPath)}
        >
          {isAdmin ? "Volver a temarios" : "Volver al temario"}
        </Button>
      </Stack>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <>
          <Card
            sx={{
              borderRadius: 2,
              background:
                "linear-gradient(120deg, rgba(15,23,42,0.97) 0%, rgba(30,64,175,0.9) 100%)",
              color: "#fff",
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

                <Stack
                  direction="row"
                  spacing={1}
                  useFlexGap
                  sx={{ flexWrap: "wrap" }}
                >
                  {isAdmin && (
                    <Button
                      component="label"
                      variant="contained"
                      startIcon={<UploadFileIcon />}
                      sx={{ backgroundColor: "#FFFFAA", color: "#000000" }}
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

                  {isAdmin && (
                    <Button
                      variant="contained"
                      startIcon={<OndemandVideoIcon />}
                      onClick={() => {
                        setVideoUrlDraft(temario?.claseDirectoVideoUrl || "");
                        setVideoDialogOpen(true);
                      }}
                      sx={{ backgroundColor: "#FFFFAA", color: "#000000" }}
                    >
                      Clase en Directo
                    </Button>
                  )}

                  {hasDocumentacion && (
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<UploadFileIcon />}
                      href={temario.documentacionRuta}
                      target="_blank"
                      rel="noreferrer"
                      sx={{ backgroundColor: "#C00000", color: "#FFFFFF" }}
                    >
                      Documentación
                    </Button>
                  )}
                  {hasClaseDirecto && (
                    <Button
                      variant="contained"
                      startIcon={<OndemandVideoIcon />}
                      color="warning"
                      href={temario.claseDirectoVideoUrl}
                      target="_blank"
                      rel="noreferrer"
                      sx={{ backgroundColor: "#C00000", color: "#FFFFFF" }}
                    >
                      Clase en Directo
                    </Button>
                  )}
                  <Chip
                    icon={<SchoolIcon fontSize="small" />}
                    label={"Permisos " + licenciasTemarioLabel}
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.15)",
                      color: "#fff",
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
