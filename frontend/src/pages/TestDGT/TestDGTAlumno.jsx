import { useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Typography,
} from "@mui/material";

import QuizIcon from "@mui/icons-material/Quiz";
import TimerIcon from "@mui/icons-material/Timer";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

import { preguntasDGTService } from "../../services/preguntasDGTService";

const LICENCIAS = ["B", "A1", "A2", "A", "C", "D", "E"];

const formatDuration = (seconds) => {
  const min = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const sec = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${min}:${sec}`;
};

export default function TestDGTAlumno({ defaultLicencia = "B" }) {
  const [licencia, setLicencia] = useState(defaultLicencia || "B");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [error, setError] = useState("");
  const [resultado, setResultado] = useState(null);
  const [startedAt, setStartedAt] = useState(null);

  const totalRespondidas = Object.keys(respuestas).length;
  const examenCompleto =
    preguntas.length > 0 && totalRespondidas === preguntas.length;

  const duracionSegundos = useMemo(() => {
    if (!startedAt) {
      return 0;
    }

    return Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
  }, [startedAt, totalRespondidas, submitting, loading]);

  const correccionByPregunta = useMemo(() => {
    if (!resultado?.correccion || !Array.isArray(resultado.correccion)) {
      return new Map();
    }

    return new Map(resultado.correccion.map((item) => [item.preguntaId, item]));
  }, [resultado]);

  const getColorRespuesta = (preguntaId, respuestaId) => {
    if (!resultado) {
      return null;
    }

    const detalle = correccionByPregunta.get(preguntaId);

    if (!detalle) {
      return null;
    }

    if (detalle.esCorrecta && detalle.respuestaCorrectaId === respuestaId) {
      return "success";
    }

    if (!detalle.esCorrecta && detalle.respuestaAlumnoId === respuestaId) {
      return "error";
    }

    if (!detalle.esCorrecta && detalle.respuestaCorrectaId === respuestaId) {
      return "success";
    }

    return null;
  };

  const isPreguntaFallada = (preguntaId) => {
    if (!resultado) {
      return false;
    }

    const detalle = correccionByPregunta.get(preguntaId);

    return Boolean(detalle && !detalle.esCorrecta);
  };

  const sanitizarPreguntas = (items = []) => {
    return items.map((item) => ({
      id: item.id,
      enunciado: item.enunciado,
      explicacion: item.explicacion,
      imagenRuta: item.imagenRuta,
      respuestas: (item.respuestas || []).map((respuesta) => ({
        id: respuesta.id,
        texto: respuesta.texto,
        orden: respuesta.orden,
      })),
    }));
  };

  const handleGenerar = async () => {
    try {
      setLoading(true);
      setError("");
      setResultado(null);
      setRespuestas({});

      const data = await preguntasDGTService.generarExamen(licencia);
      const preguntasSanitizadas = sanitizarPreguntas(data);

      setPreguntas(preguntasSanitizadas);
      setStartedAt(Date.now());
    } catch (requestError) {
      console.error(requestError);
      setError(
        requestError.response?.data?.message ||
          "No se pudo generar el examen DGT para la licencia seleccionada.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSeleccion = (preguntaId, respuestaId) => {
    setRespuestas((prev) => ({
      ...prev,
      [preguntaId]: respuestaId,
    }));
  };

  const handleCorregir = async () => {
    if (!examenCompleto) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const payload = {
        licencia,
        preguntas: preguntas.map((pregunta) => pregunta.id),
        respuestasAlumno: preguntas.map((pregunta) => ({
          preguntaId: pregunta.id,
          respuestaId: respuestas[pregunta.id],
        })),
      };

      const data = await preguntasDGTService.corregirExamen(payload);

      setResultado(data);
    } catch (requestError) {
      console.error(requestError);
      setError(
        requestError.response?.data?.message ||
          "No se pudo corregir el examen. Inténtalo de nuevo.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleReiniciar = () => {
    setPreguntas([]);
    setRespuestas({});
    setResultado(null);
    setError("");
    setStartedAt(null);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
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
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
            spacing={2}
          >
            <Box>
              <Typography variant="h4" fontWeight={900}>
                Simulador Test DGT
              </Typography>
              <Typography sx={{ opacity: 0.9, mt: 1 }}>
                Genera un examen oficial de 30 preguntas y corrígelo al
                instante.
              </Typography>
            </Box>

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              useFlexGap
              flexWrap="wrap"
            >
              {/* 1. TIEMPO: Cambiado a Button (deshabilitado el click) para igualar el tamaño perfectamente */}
              <Button
                component="div" // Evita que actúe como un botón interactivo real
                startIcon={<TimerIcon fontSize="small" />}
                sx={{
                  width: 180,
                  height: 40,
                  textTransform: "none", // Evita mayúsculas automáticas
                  backgroundColor: "rgba(255,255,255,0.15)",
                  color: "#fff",
                  borderRadius: 1, // Bordes sutiles para emparejar con Select y Button
                  cursor: "default",
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.15)" },
                }}
              >
                Tiempo {formatDuration(duracionSegundos)}
              </Button>

              {/* 2. LICENCIA SELECT */}
              <FormControl size="small" sx={{ width: 180, height: 40 }}>
                <Select
                  value={licencia}
                  onChange={(event) => setLicencia(event.target.value)}
                  sx={{
                    height: "100%", // Obliga al Select a tomar los 40px del FormControl
                    color: "#fff",
                    ".MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255,255,255,0.4)",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#fff",
                    },
                    ".MuiSvgIcon-root": {
                      color: "#fff",
                    },
                  }}
                >
                  {LICENCIAS.map((item) => (
                    <MenuItem key={item} value={item}>
                      Permiso {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* 3. BOTÓN GENERAR EXAMEN */}
              <Button
                variant="contained"
                color="warning"
                startIcon={<QuizIcon />}
                onClick={handleGenerar}
                disabled={loading || submitting}
                sx={{
                  width: 180,
                  height: 40,
                  textTransform: "none", // Opcional: mantiene el texto en minúsculas/mayúsculas naturales
                }}
              >
                {loading ? "Generando..." : "Generar examen"}
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {error && <Alert severity="error">{error}</Alert>}

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && preguntas.length > 0 && (
        <Stack spacing={2}>
          <Typography variant="h6" fontWeight={800}>
            Examen generado: {preguntas.length} preguntas
          </Typography>

          {preguntas.map((pregunta, index) => {
            const preguntaFallada = isPreguntaFallada(pregunta.id);

            return (
              <Card
                key={pregunta.id}
                sx={
                  preguntaFallada
                    ? {
                        borderRadius: 3,
                        backgroundColor: "#fff7ed",
                        border: "1px solid #fed7aa",
                      }
                    : { borderRadius: 3 }
                }
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 2,
                      mb: 1.25,
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={700}>
                      {index + 1}. {pregunta.enunciado}
                    </Typography>
                    {preguntaFallada ? (
                      <Typography
                        variant="body2"
                        fontWeight={700}
                        sx={{ color: "error.main", whiteSpace: "nowrap" }}
                      >
                        Pregunta fallada
                      </Typography>
                    ) : null}
                  </Box>

                  {pregunta.imagenRuta ? (
                    <Box
                      component="img"
                      src={pregunta.imagenRuta}
                      alt={`Imagen pregunta ${index + 1}`}
                      sx={{
                        width: "100%",
                        maxWidth: 420,
                        borderRadius: 2,
                        mb: 1.5,
                        border: "1px solid #e2e8f0",
                      }}
                    />
                  ) : null}

                  <FormControl>
                    <RadioGroup
                      sx={{ ml: 2, mt: 10 }}
                      value={respuestas[pregunta.id] || ""}
                      onChange={(event) =>
                        handleSeleccion(pregunta.id, event.target.value)
                      }
                      disabled={Boolean(resultado)}
                    >
                      {pregunta.respuestas.map((respuesta) => {
                        const color = getColorRespuesta(
                          pregunta.id,
                          respuesta.id,
                        );

                        return (
                          <FormControlLabel
                            key={respuesta.id}
                            value={respuesta.id}
                            control={<Radio color={color || "primary"} />}
                            label={respuesta.texto}
                            sx={
                              color === "success"
                                ? {
                                    color: "success.main",
                                    "& .MuiFormControlLabel-label": {
                                      fontWeight: 700,
                                    },
                                  }
                                : color === "error"
                                  ? {
                                      color: "error.main",
                                      "& .MuiFormControlLabel-label": {
                                        fontWeight: 700,
                                      },
                                    }
                                  : undefined
                            }
                          />
                        );
                      })}
                    </RadioGroup>
                  </FormControl>

                  {index < preguntas.length - 1 && <Divider sx={{ mt: 1.5 }} />}
                </CardContent>
              </Card>
            );
          })}

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <Button
              variant="contained"
              onClick={handleCorregir}
              disabled={!examenCompleto || submitting}
            >
              {submitting ? "Corrigiendo..." : "Corregir examen"}
            </Button>

            <Button
              variant="outlined"
              onClick={handleReiniciar}
              startIcon={<RestartAltIcon />}
            >
              Reiniciar
            </Button>
          </Stack>

          {!examenCompleto && (
            <Typography variant="body2" color="text.secondary">
              Responde todas las preguntas antes de corregir.
            </Typography>
          )}
        </Stack>
      )}

      {resultado && (
        <Card sx={{ borderRadius: 3, border: "1px solid #e2e8f0" }}>
          <CardContent>
            <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
              Resultado del examen
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
              <Chip label={`Aciertos: ${resultado.aciertos}`} color="success" />
              <Chip label={`Fallos: ${resultado.fallos}`} color="error" />
              <Chip
                label={resultado.aprobado ? "APROBADO" : "SUSPENDIDO"}
                color={resultado.aprobado ? "success" : "error"}
              />
            </Stack>
            <Alert severity={resultado.aprobado ? "success" : "warning"}>
              {resultado.aprobado
                ? "Buen trabajo. Has superado el umbral del test DGT."
                : "Todavía no llegas al mínimo. Revisa teoría y vuelve a intentarlo."}
            </Alert>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
