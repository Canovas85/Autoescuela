import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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

export default function AccountActivation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingValidation, setLoadingValidation] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [validToken, setValidToken] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError("El enlace de activación no contiene token.");
        setLoadingValidation(false);
        return;
      }

      try {
        await api.post("/auth/activacion/validar", { token });
        setValidToken(true);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "No se ha podido validar el enlace de activación.",
        );
      } finally {
        setLoadingValidation(false);
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    setSubmitting(true);

    try {
      await api.post("/auth/activacion/completar", {
        token,
        newPassword,
        confirmPassword,
      });

      setSuccess(
        "Cuenta activada correctamente. Ya puedes iniciar sesión con tu nueva contraseña.",
      );

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "No se ha podido completar la activación.",
      );
    } finally {
      setSubmitting(false);
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
      <Card sx={{ width: "100%", maxWidth: 540, borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight={700} mb={1}>
            Activación de cuenta
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={3}>
            Establece tu contraseña inicial para completar el primer acceso a la
            plataforma.
          </Typography>

          {loadingValidation ? (
            <Box display="flex" alignItems="center" gap={2} py={2}>
              <CircularProgress size={20} />
              <Typography variant="body2">Validando enlace...</Typography>
            </Box>
          ) : (
            <>
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

              {validToken && !success && (
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
                    Debe tener al menos 8 caracteres, incluir mayúsculas,
                    minúsculas y números.
                  </Typography>

                  <Button
                    fullWidth
                    variant="contained"
                    type="submit"
                    sx={{ mt: 3 }}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Activar cuenta"
                    )}
                  </Button>
                </form>
              )}

              {!validToken && (
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 1 }}
                  onClick={() => navigate("/")}
                >
                  Volver al inicio de sesión
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
