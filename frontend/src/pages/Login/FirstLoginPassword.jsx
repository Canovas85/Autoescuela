import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { api } from "../../services/api";

export default function FirstLoginPassword() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    setLoading(true);

    try {
      await api.post(
        "/auth/primer-acceso/cambiar-password",
        {
          newPassword,
          confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      localStorage.removeItem("token");
      localStorage.removeItem("requiresPasswordChange");
      setSuccess(
        "Credenciales actualizadas correctamente. Por seguridad, vuelve a iniciar sesión.",
      );

      setTimeout(() => {
        navigate("/");
      }, 800);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "No ha sido posible actualizar las credenciales en este momento.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at top left, #dbeafe 0%, #f8fafc 45%, #e2e8f0 100%)",
        p: 2,
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 520, borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight={700} mb={1}>
            Actualización de credenciales
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={3}>
            Para completar tu primer acceso en la plataforma Eguzkilore, debes
            establecer una nueva contraseña de seguridad.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Nueva contraseña"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Confirmar nueva contraseña"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />

            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              mt={1}
            >
              Debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas y
              números para cumplir la política de seguridad.
            </Typography>

            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Actualizar contraseña"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
