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

  const sanitizarPreguntas = (items = []) => {
    return items.map((item) => ({
      id: item.id,
      enunciado: item.enunciado,
      explicacion: item.explicacion,
      imagenRuta: item.imagenRuta,
      respuestas: (item.respuestas || [])
        .map((respuesta) => ({
          id: respuesta.id,
          texto: respuesta.texto,
          orden: respuesta.orden,
        }))
        .sort((a, b) => (a.orden || 0) - (b.orden || 0)),
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
        duracionSegundos,
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
          borderRadius: 4,
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
              <Chip
                icon={<TimerIcon fontSize="small" />}
                label={`Tiempo ${formatDuration(duracionSegundos)}`}
                sx={{
                  backgroundColor: "rgba(255,255,255,0.15)",
                  color: "#fff",
                }}
              />

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select
                  value={licencia}
                  onChange={(event) => setLicencia(event.target.value)}
                  sx={{
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

              <Button
                variant="contained"
                color="warning"
                startIcon={<QuizIcon />}
                onClick={handleGenerar}
                disabled={loading || submitting}
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

          {preguntas.map((pregunta, index) => (
            <Card key={pregunta.id} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  sx={{ mb: 1.25 }}
                >
                  {index + 1}. {pregunta.enunciado}
                </Typography>

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
                    value={respuestas[pregunta.id] || ""}
                    onChange={(event) =>
                      handleSeleccion(pregunta.id, event.target.value)
                    }
                  >
                    {pregunta.respuestas.map((respuesta) => (
                      <FormControlLabel
                        key={respuesta.id}
                        value={respuesta.id}
                        control={<Radio />}
                        label={respuesta.texto}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>

                {index < preguntas.length - 1 && <Divider sx={{ mt: 1.5 }} />}
              </CardContent>
            </Card>
          ))}

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
