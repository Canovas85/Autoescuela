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
        "Contraseña actualizada. Inicia sesión con tu nueva contraseña.",
      );

      setTimeout(() => {
        navigate("/");
      }, 800);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "No se pudo actualizar la contraseña",
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
            Cambio obligatorio de contraseña
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={3}>
            Es tu primer acceso. Antes de continuar debes establecer una nueva
            contraseña segura.
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
              números.
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
                "Guardar nueva contraseña"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
