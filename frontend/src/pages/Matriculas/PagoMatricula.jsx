import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Divider,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { matriculasService } from "../../services/matriculasService";

export default function PagoMatricula() {
  const navigate = useNavigate();

  const [matricula, setMatricula] = useState(null);

  const [loading, setLoading] = useState(true);

  const descuento = matricula
    ? Math.round(
        ((Number(matricula.precioBase) - Number(matricula.precioFinal)) /
          Number(matricula.precioBase)) *
          100,
      )
    : 0;

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [titular, setTitular] = useState("");

  const [numeroTarjeta, setNumeroTarjeta] = useState("");

  const [caducidad, setCaducidad] = useState("");

  const [cvv, setCvv] = useState("");

  const [errores, setErrores] = useState({});

  const [openConfirmarPago, setOpenConfirmarPago] = useState(false);

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!titular.trim()) {
      nuevosErrores.titular = "El titular es obligatorio";
    }

    if (!/^\d{16}$/.test(numeroTarjeta)) {
      nuevosErrores.numeroTarjeta = "La tarjeta debe tener 16 dígitos";
    }

    if (!/^\d{2}\/\d{2}$/.test(caducidad)) {
      nuevosErrores.caducidad = "Formato MM/AA";
    }

    if (!/^\d{3}$/.test(cvv)) {
      nuevosErrores.cvv = "El CVV debe tener 3 dígitos";
    }

    setErrores(nuevosErrores);

    return Object.keys(nuevosErrores).length === 0;
  };

  useEffect(() => {
    const loadMatricula = async () => {
      try {
        const data = await matriculasService.getMine();

        setMatricula(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadMatricula();
  }, []);

  const handlePagar = async () => {
    if (!validarFormulario()) {
      return;
    }

    try {
      await matriculasService.pagar(matricula.id);

      setNotification({
        open: true,
        message: "Pago realizado correctamente",
        severity: "success",
      });

      navigate("/dashboard", {
        replace: true,
      });

      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 10,
        }}
      >
        Cargando matrícula...
      </Box>
    );
  }
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        py: 5,
      }}
    >
      <Card
        sx={{
          width: 700,
          maxWidth: "100%",
          borderRadius: 4,
        }}
      >
        <CardContent>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Pago de Matrícula
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Completa el pago de tu matrícula para acceder a todos los contenidos
            de la plataforma.
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Box
            sx={{
              mb: 3,
              p: 2,
              borderRadius: 2,
              backgroundColor: "#f8fafc",
            }}
          >
            <Typography fontWeight={700}>
              Permiso: {matricula?.licencia}
            </Typography>

            <Typography>Precio original: {matricula?.precioBase} €</Typography>

            {matricula?.promocion && (
              <Typography color="success.main">
                Promoción aplicada: {matricula.promocion.nombre}
              </Typography>
            )}

            {matricula?.promocion && (
              <Typography color="success.main">
                Descuento: {descuento} %
              </Typography>
            )}

            <Typography
              sx={{
                mt: 1,
                fontWeight: 700,
                fontSize: "1.1rem",
              }}
            >
              Importe final: {matricula?.precioFinal} €
            </Typography>

            <Typography color="warning.main">
              Estado: {matricula?.estado}
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="Titular de la tarjeta"
            value={titular}
            onChange={(e) => setTitular(e.target.value)}
            error={Boolean(errores.titular)}
            helperText={errores.titular}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Número de tarjeta"
            value={numeroTarjeta}
            inputProps={{
              maxLength: 16,
            }}
            onChange={(e) =>
              setNumeroTarjeta(e.target.value.replace(/\D/g, ""))
            }
            error={Boolean(errores.numeroTarjeta)}
            helperText={errores.numeroTarjeta}
            sx={{ mb: 2 }}
          />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 2,
              mb: 3,
            }}
          >
            <TextField
              label="Caducidad"
              value={caducidad}
              onChange={(e) => setCaducidad(e.target.value)}
              error={Boolean(errores.caducidad)}
              helperText={errores.caducidad}
            />

            <TextField
              label="CVV"
              value={cvv}
              inputProps={{
                maxLength: 3,
              }}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
              error={Boolean(errores.cvv)}
              helperText={errores.cvv}
            />
          </Box>

          <Button
            variant="contained"
            fullWidth
            size="large"
            color="success"
            onClick={() => {
              if (validarFormulario()) {
                setOpenConfirmarPago(true);
              }
            }}
          >
            Pagar Matrícula
          </Button>

          <Dialog
            open={openConfirmarPago}
            onClose={() => setOpenConfirmarPago(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Confirmar pago</DialogTitle>

            <DialogContent>
              <Typography>Vas a realizar el pago de tu matrícula.</Typography>

              <Typography sx={{ mt: 2 }} fontWeight={700}>
                Permiso: {matricula?.licencia}
              </Typography>

              <Typography>
                Precio original: {matricula?.precioBase} €
              </Typography>

              {matricula?.promocion && (
                <Typography color="success.main">
                  Promoción: {matricula.promocion.nombre}
                </Typography>
              )}

              <Typography fontWeight={700} sx={{ mt: 1 }}>
                Total a pagar: {matricula?.precioFinal} €
              </Typography>
            </DialogContent>

            <DialogActions>
              <Button onClick={() => setOpenConfirmarPago(false)}>
                Cancelar
              </Button>

              <Button variant="contained" color="success" onClick={handlePagar}>
                Confirmar pago
              </Button>
            </DialogActions>
          </Dialog>
        </CardContent>
      </Card>

      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={() =>
          setNotification((prev) => ({
            ...prev,
            open: false,
          }))
        }
      >
        <Alert severity={notification.severity} variant="filled">
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
