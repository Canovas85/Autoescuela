import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  FormControlLabel,
  IconButton,
  Tab,
  Tabs,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
//import GoogleIcon from "@mui/icons-material/Google";
//import AppleIcon from "@mui/icons-material/Apple";

import { api } from "../../services/api";

import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm();

  const [tab, setTab] = useState(0);

  const [loading, setLoading] = useState(false);

  const [loginError, setLoginError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [openRegister, setOpenRegister] = useState(false);

  const [openForgotPassword, setOpenForgotPassword] = useState(false);

  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");

  const [registerForm, setRegisterForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    dni: "",
    fechaNacimiento: "",
    licenciaObjetivo: "B",
  });

  const [activePromotion, setActivePromotion] = useState(0);

  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    const loadPromotions = async () => {
      try {
        const response = await api.get("/promociones/public");

        setPromotions(
          response.data.filter(
            (promocion) => promocion.activa && promocion.imagenRuta,
          ),
        );
      } catch (error) {
        console.error("Error cargando promociones públicas", error);
      }
    };

    loadPromotions();
  }, []);

  useEffect(() => {
    if (!promotions.length) {
      return;
    }

    const interval = setInterval(() => {
      setActivePromotion((prev) => (prev + 1) % promotions.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [promotions]);

  const onSubmit = async (data) => {
    setLoading(true);
    setLoginError("");

    try {
      const response = await api.post("/auth/login", data);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "requiresPasswordChange",
        String(Boolean(response.data.requiereCambioPassword)),
      );

      navigate(
        response.data.requiereCambioPassword ? "/primer-login" : "/dashboard",
      );
    } catch (error) {
      const status = error.response?.status;
      const backendMessage = error.response?.data?.message;

      if (status === 401) {
        setLoginError(
          backendMessage ||
            "Credenciales no válidas. Verifica tu email y contraseña.",
        );
      } else if (status === 403) {
        setLoginError(
          backendMessage ||
            "Tu usuario requiere completar acciones de seguridad para poder acceder.",
        );
      } else if (!status) {
        setLoginError(
          "No hay conexión con el servicio de autenticación. Inténtalo de nuevo en unos segundos.",
        );
      } else {
        setLoginError(
          backendMessage ||
            "No hemos podido iniciar tu sesión en este momento. Inténtalo de nuevo más tarde.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const promotion = promotions.length > 0 ? promotions[activePromotion] : null;

  const descuento = promotion
    ? Math.round(
        ((promotion.precioOriginal - promotion.precioPromocional) /
          promotion.precioOriginal) *
          100,
      )
    : 0;

  return (
    <Box className="login-page">
      <div className="login-header">
        <h1>Autoescuela Eguzkilore</h1>
      </div>
      <div className="login-layout">
        <section className="form-section">
          <Card className="promo-card">
            <CardContent>
              <div className="promo-content">
                {promotion ? (
                  <>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "250px 1fr",
                        gap: 3,
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      <img
                        src={promotion.imagenRuta}
                        alt={promotion.nombre}
                        style={{
                          width: "260px",
                          height: "350px",
                          objectFit: "contain",
                          borderRadius: "12px",
                        }}
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        gap: 1.5,
                      }}
                    >
                      <Typography
                        variant="h4"
                        fontWeight={700}
                        sx={{
                          textAlign: "left",
                        }}
                      >
                        {promotion.nombre}
                      </Typography>

                      <Typography
                        variant="body1"
                        sx={{
                          textAlign: "left",
                          minHeight: 70,
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {promotion.descripcion}
                      </Typography>

                      <Chip label={`🔥 ${descuento}% DTO`} color="error" />

                      <Typography
                        sx={{
                          textDecoration: "line-through",
                          color: "#999",
                          fontSize: "1rem",
                        }}
                      >
                        Antes: {promotion.precioOriginal} €
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: "2.0rem",
                          fontWeight: 800,
                          color: "#ff6f00",
                          lineHeight: 1,
                        }}
                      >
                        Ahora: {promotion.precioPromocional} €
                      </Typography>

                      <Button
                        variant="contained"
                        sx={{
                          width: "fit-content",
                          mt: 1,
                          borderRadius: "30px",
                          px: 4,
                          background: "linear-gradient(135deg,#ff9800,#f57c00)",
                        }}
                      >
                        Ver promoción
                      </Button>
                    </Box>
                  </>
                ) : (
                  <Box
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                      px: 4,
                    }}
                  >
                    <Typography
                      variant="h2"
                      sx={{
                        mb: 2,
                      }}
                    >
                      🎁
                    </Typography>

                    <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
                      Próximamente nuevas promociones
                    </Typography>

                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{
                        maxWidth: 420,
                      }}
                    >
                      Estamos preparando nuevas ofertas, descuentos exclusivos y
                      campañas especiales para nuestros alumnos. Vuelve pronto
                      para descubrir nuestras próximas promociones.
                    </Typography>
                  </Box>
                )}
              </div>

              <div className="indicators">
                {promotions.map((_, index) => (
                  <span
                    key={index}
                    className={
                      index === activePromotion ? "pill active" : "pill"
                    }
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="promo-section">
          <Card className="login-card">
            <CardContent>
              <Tabs
                value={tab}
                onChange={(e, value) => {
                  if (value === 1) {
                    setOpenRegister(true);
                    return;
                  }

                  setTab(value);
                }}
                centered
              >
                <Tab label="Iniciar Sesión" />
                <Tab label="Registrarse" />
              </Tabs>

              {tab === 0 && loginError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {loginError}
                </Alert>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                {tab === 1 && (
                  <div className="grid-two">
                    <TextField fullWidth label="Nombre" />

                    <TextField fullWidth label="Teléfono" />
                  </div>
                )}

                <TextField
                  fullWidth
                  label="Email"
                  margin="normal"
                  {...register("email")}
                />

                <Box
                  sx={{
                    position: "relative",
                  }}
                >
                  <TextField
                    fullWidth
                    label="Contraseña"
                    margin="normal"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                  />

                  <IconButton
                    sx={{
                      position: "absolute",
                      right: 12,
                      top: 20,
                    }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </Box>

                {tab === 0 && (
                  <Typography
                    variant="body2"
                    color="primary"
                    sx={{
                      cursor: "pointer",
                      fontWeight: 600,
                      textAlign: "right",
                    }}
                    onClick={() => setOpenForgotPassword(true)}
                  >
                    ¿Olvidaste tu contraseña?
                  </Typography>
                )}

                {tab === 1 && (
                  <FormControlLabel
                    control={<Checkbox />}
                    label="Acepto los términos y condiciones"
                  />
                )}

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{ mt: 3 }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : tab === 0 ? (
                    "Iniciar sesión"
                  ) : (
                    "Crear cuenta"
                  )}
                </Button>

                <div className="divider"></div>

                <div className="social-container">
                  <Button
                    variant="outlined"
                    className="social-btn"
                    startIcon={<FcGoogle size={22} />}
                  >
                    Continuar con Google
                  </Button>

                  <Button
                    variant="outlined"
                    className="social-btn"
                    startIcon={<FaApple size={20} />}
                  >
                    Continuar con Apple
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </section>
      </div>

      <Dialog
        open={openRegister}
        onClose={() => setOpenRegister(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Registro de Alumno</DialogTitle>

        <DialogContent>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Bienvenido a Autoescuela Eguzkilore. Completa la siguiente
            información para solicitar tu alta como alumno. Una vez validado el
            registro por la autoescuela, podrás acceder a todos los servicios de
            formación. La contraseña inicial será asignada automáticamente.
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr",
              },
              gap: 2,
            }}
          >
            <TextField
              label="Nombre"
              fullWidth
              value={registerForm.nombre}
              onChange={(e) =>
                setRegisterForm({
                  ...registerForm,
                  nombre: e.target.value,
                })
              }
            />

            <TextField
              label="Email"
              fullWidth
              value={registerForm.email}
              onChange={(e) =>
                setRegisterForm({
                  ...registerForm,
                  email: e.target.value,
                })
              }
            />

            <TextField
              label="Teléfono"
              fullWidth
              value={registerForm.telefono}
              onChange={(e) =>
                setRegisterForm({
                  ...registerForm,
                  telefono: e.target.value,
                })
              }
            />

            <TextField
              label="DNI"
              fullWidth
              value={registerForm.dni}
              onChange={(e) =>
                setRegisterForm({
                  ...registerForm,
                  dni: e.target.value,
                })
              }
            />

            <TextField
              label="Fecha de nacimiento"
              type="date"
              fullWidth
              value={registerForm.fechaNacimiento}
              onChange={(e) =>
                setRegisterForm({
                  ...registerForm,
                  fechaNacimiento: e.target.value,
                })
              }
              sx={{
                "& input::-webkit-datetime-edit": {
                  color: registerForm.fechaNacimiento
                    ? "inherit"
                    : "transparent",
                },
              }}
            />

            <FormControl fullWidth>
              <InputLabel>Licencia objetivo</InputLabel>

              <Select
                label="Licencia objetivo"
                value={registerForm.licenciaObjetivo}
                onChange={(e) =>
                  setRegisterForm({
                    ...registerForm,
                    licenciaObjetivo: e.target.value,
                  })
                }
              >
                <MenuItem value="B">B - Turismo</MenuItem>
                <MenuItem value="A1">A1 - Motocicletas</MenuItem>
                <MenuItem value="A2">A2 - Motocicletas</MenuItem>
                <MenuItem value="A">A - Motocicletas</MenuItem>
                <MenuItem value="C">C - Camión</MenuItem>
                <MenuItem value="D">D - Autobús</MenuItem>
                <MenuItem value="E">E - Remolques</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenRegister(false)}>Cancelar</Button>

          <Button variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openForgotPassword}
        onClose={() => setOpenForgotPassword(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Olvidaste tu contraseña</DialogTitle>

        <DialogContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
              mb: 3,
              mt: 1,
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: "#2563eb",
                color: "#fff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: 700,
              }}
            >
              1
            </Box>

            <Box
              sx={{
                width: 60,
                height: 2,
                backgroundColor: "#cbd5e1",
              }}
            />

            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: "#e2e8f0",
                color: "#64748b",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: 700,
              }}
            >
              2
            </Box>

            <Box
              sx={{
                width: 60,
                height: 2,
                backgroundColor: "#cbd5e1",
              }}
            />

            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: "#e2e8f0",
                color: "#64748b",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: 700,
              }}
            >
              3
            </Box>
          </Box>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            No te preocupes. Si has olvidado tu contraseña, podremos ayudarte a
            recuperarla. Introduce el correo electrónico asociado a tu cuenta y
            te enviaremos instrucciones para restablecer tu contraseña de forma
            segura.
          </Typography>

          <TextField
            label="Correo electrónico"
            fullWidth
            value={forgotPasswordEmail}
            onChange={(e) => setForgotPasswordEmail(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenForgotPassword(false)}>Cancelar</Button>

          <Button variant="contained">Continuar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
