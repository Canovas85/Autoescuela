import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SchoolIcon from "@mui/icons-material/School";
import MenuBookIcon from "@mui/icons-material/MenuBook";

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

  useEffect(() => {
    const loadTema = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await temariosService.getMineById(id);
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
  }, [id]);

  const theory = useMemo(() => getTemarioBTheory(temario), [temario]);
  const miniTest = theory?.miniTest || [];
  const historialIntentos = temario?.historialIntentos || [];
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

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Breadcrumbs>
          <Link
            underline="hover"
            color="inherit"
            component="button"
            onClick={() => navigate("/temario")}
          >
            Temario
          </Link>
          <Typography color="text.primary">Detalle del tema</Typography>
        </Breadcrumbs>

        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/temario")}
        >
          Volver al temario
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

                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  <Chip
                    icon={<SchoolIcon fontSize="small" />}
                    label={`Permiso ${temario?.tipoLicenciaObjetivo ?? "-"}`}
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.15)",
                      color: "#fff",
                    }}
                  />
                  <Chip
                    label={temario?.revisado ? "Revisado" : "Pendiente"}
                    color={temario?.revisado ? "success" : "warning"}
                  />
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {theory ? (
            <Grid container spacing={3}>
              <Grid item xs={12} md={7}>
                <Card sx={{ borderRadius: 3, height: "100%" }}>
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
                    >
                      {theory.repasoRapido}
                    </Alert>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={5}>
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

                  <Card sx={{ borderRadius: 3 }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
                        Mini test del tema
                      </Typography>

                      {miniTest.length === 0 ? (
                        <Alert severity="info">
                          Este tema todavía no tiene mini test disponible.
                        </Alert>
                      ) : (
                        <Stack spacing={2}>
                          {miniTest.map((pregunta, index) => (
                            <Box key={`${pregunta.pregunta}-${index}`}>
                              <Typography fontWeight={700} sx={{ mb: 1 }}>
                                {index + 1}. {pregunta.pregunta}
                              </Typography>
                              <FormControl>
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
                                    mt: 0.5,
                                  }}
                                >
                                  {respuestas[index] === pregunta.correcta
                                    ? "Respuesta correcta"
                                    : `Respuesta correcta: ${pregunta.correcta}`}
                                </Typography>
                              )}

                              {index < miniTest.length - 1 && (
                                <Divider sx={{ mt: 1.5 }} />
                              )}
                            </Box>
                          ))}

                          <Button
                            variant="contained"
                            onClick={handleCorregir}
                            disabled={!miniTestCompleto || guardandoResultado}
                          >
                            {guardandoResultado
                              ? "Guardando resultado..."
                              : "Corregir mini test"}
                          </Button>

                          <Button
                            variant="outlined"
                            onClick={handleReintentar}
                            disabled={guardandoResultado}
                          >
                            Reintentar mini test
                          </Button>

                          {!miniTestCompleto && (
                            <Typography variant="body2" color="text.secondary">
                              Responde todas las preguntas para corregir.
                            </Typography>
                          )}

                          {resultadoGuardado && (
                            <Alert
                              severity={
                                resultadoGuardado.ok ? "success" : "error"
                              }
                            >
                              {resultadoGuardado.message}
                            </Alert>
                          )}

                          {corregido && (
                            <Box>
                              <Typography fontWeight={800} sx={{ mb: 1 }}>
                                Resultado: {aciertos}/{miniTest.length} (
                                {porcentaje}%)
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={porcentaje}
                                sx={{ height: 10, borderRadius: 999, mb: 1 }}
                              />
                              <Alert
                                severity={
                                  porcentaje >= 80 ? "success" : "warning"
                                }
                              >
                                {porcentaje >= 80
                                  ? "Buen dominio del tema. Puedes seguir al siguiente bloque."
                                  : "Conviene repasar la teoría y volver a intentarlo."}
                              </Alert>
                            </Box>
                          )}
                        </Stack>
                      )}
                    </CardContent>
                  </Card>

                  <Card sx={{ borderRadius: 3 }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
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
                                justifyContent="space-between"
                                alignItems="center"
                                sx={{ mb: 0.5 }}
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
                                {new Date(intento.fecha).toLocaleString(
                                  "es-ES",
                                )}
                              </Typography>
                            </Box>
                          ))}
                        </Stack>
                      )}
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
    </Box>
  );
}
