import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import pack10ClasesImg from "../../assets/promotions/pack10clases.jpeg";
import carnetBImg from "../../assets/promotions/carnetb.jpeg";
import intensivoVeranoImg from "../../assets/promotions/intensivo-verano.jpeg";

import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  Tab,
  Tabs,
  TextField,
  Typography,
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

  const [showPassword, setShowPassword] = useState(false);

  const promotions = [
    {
      image: pack10ClasesImg,
      title: "Pack 10 Clases",
      oldPrice: "350€",
      newPrice: "299€",
      benefits: ["Profesor asignado", "Vehículo incluido", "Reserva flexible"],
    },

    {
      image: carnetBImg,
      title: "Matrícula Carnet B",
      oldPrice: "220€",
      newPrice: "149€",
      benefits: [
        "Teórica online",
        "Seguimiento personalizado",
        "Material incluido",
      ],
    },

    {
      image: intensivoVeranoImg,
      title: "Pack Intensivo Verano",
      oldPrice: "450€",
      newPrice: "349€",
      benefits: [
        "Tutor dedicado",
        "Simulacros incluidos",
        "Preparación acelerada",
      ],
    },
  ];

  const [activePromotion, setActivePromotion] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePromotion((prev) => (prev + 1) % promotions.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);

    console.log("LOGIN DATA", data);

    try {
      const response = await api.post("/auth/login", data);

      console.log("LOGIN OK:", response.data);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "requiresPasswordChange",
        String(Boolean(response.data.requiereCambioPassword)),
      );

      navigate(
        response.data.requiereCambioPassword ? "/primer-login" : "/dashboard",
      );
    } catch (error) {
      console.error("LOGIN ERROR:", error.response?.data);

      alert(error.response?.data?.message || "Credenciales inválidas");
    } finally {
      setLoading(false);
    }
  };

  const promotion = promotions[activePromotion];

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
                <div className="promo-image-container">
                  <img
                    src={promotion.image}
                    alt={promotion.title}
                    className="promo-image"
                  />
                </div>

                <div className="promo-info">
                  <h2>{promotion.title}</h2>
                  <ul>
                    {promotion.benefits.map((benefit) => (
                      <li key={benefit}>{benefit}</li>
                    ))}
                  </ul>

                  <div className="price-container">
                    <span className="old-price">
                      Antes: {promotion.oldPrice}
                    </span>

                    <span className="new-price">
                      Ahora: {promotion.newPrice}
                    </span>
                  </div>

                  <Button variant="contained" color="warning">
                    Ver promoción
                  </Button>
                </div>
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
              <Tabs value={tab} onChange={(e, value) => setTab(value)} centered>
                <Tab label="Iniciar Sesión" />
                <Tab label="Registrarse" />
              </Tabs>

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
                  <Typography textAlign="right" variant="body2" color="primary">
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
    </Box>
  );
}
