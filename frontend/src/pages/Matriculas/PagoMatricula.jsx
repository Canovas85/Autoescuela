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
import { useNavigate, useSearchParams } from "react-router-dom";

import { matriculasService } from "../../services/matriculasService";
import { pagosService } from "../../services/pagosService";

export default function PagoMatricula() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pagoId = searchParams.get("pagoId");

  const [matricula, setMatricula] = useState(null);
  const [pagoPendiente, setPagoPendiente] = useState(null);

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

  const esPagoPendiente = Boolean(pagoId);

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
    const loadData = async () => {
      try {
        if (esPagoPendiente) {
          const pago = await pagosService.getMineById(pagoId);
          setPagoPendiente(pago);
        } else {
          const data = await matriculasService.getMine();
          setMatricula(data);
        }
      } catch (error) {
        console.error(error);
        setNotification({
          open: true,
          message:
            error.response?.data?.message ||
            "No se pudieron cargar los datos de pago",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [esPagoPendiente, pagoId]);

  const handlePagar = async () => {
    if (!validarFormulario()) {
      return;
    }

    try {
      if (esPagoPendiente) {
        await pagosService.payMine(pagoPendiente.id);
      } else {
        await matriculasService.pagar(matricula.id);
      }

      setNotification({
        open: true,
        message: "Pago realizado correctamente",
        severity: "success",
      });

      navigate(esPagoPendiente ? "/mis-pagos" : "/dashboard", {
        replace: true,
      });

      if (!esPagoPendiente) {
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message:
          error.response?.data?.message || "No se pudo completar el pago",
        severity: "error",
      });
    }
  };

  const importePagoPendiente = Number(pagoPendiente?.importe || 0);

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
            {esPagoPendiente ? "Pago pendiente" : "Pago de Matrícula"}
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 3 }}>
            {esPagoPendiente
              ? "Completa el pago pendiente para continuar con tu proceso formativo."
              : "Completa el pago de tu matrícula para acceder a todos los contenidos de la plataforma."}
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
            {esPagoPendiente ? (
              <>
                <Typography fontWeight={700}>
                  Concepto: {pagoPendiente?.concepto}
                </Typography>

                <Typography>
                  Permiso: {pagoPendiente?.permiso || "-"}
                </Typography>

                <Typography
                  sx={{
                    mt: 1,
                    fontWeight: 700,
                    fontSize: "1.1rem",
                  }}
                >
                  Importe: {importePagoPendiente.toFixed(2)} €
                </Typography>

                <Typography
                  color={
                    pagoPendiente?.estado === "PAGADO"
                      ? "success.main"
                      : "warning.main"
                  }
                >
                  Estado: {pagoPendiente?.estado}
                </Typography>

                {typeof pagoPendiente?.convocatoriasIncluidas === "number" && (
                  <Typography>
                    Convocatorias: {pagoPendiente?.convocatoriasConsumidas || 0}
                    /{pagoPendiente?.convocatoriasIncluidas}
                  </Typography>
                )}
              </>
            ) : (
              <>
                <Typography fontWeight={700}>
                  Permiso: {matricula?.licencia}
                </Typography>

                <Typography>
                  Precio original: {matricula?.precioBase} €
                </Typography>

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
              </>
            )}
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
            disabled={esPagoPendiente && pagoPendiente?.estado !== "PENDIENTE"}
            onClick={() => {
              if (validarFormulario()) {
                setOpenConfirmarPago(true);
              }
            }}
          >
            {esPagoPendiente ? "Pagar ahora" : "Pagar Matrícula"}
          </Button>

          <Dialog
            open={openConfirmarPago}
            onClose={() => setOpenConfirmarPago(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Confirmar pago</DialogTitle>

            <DialogContent>
              {esPagoPendiente ? (
                <>
                  <Typography>
                    Vas a realizar el pago de este concepto.
                  </Typography>

                  <Typography sx={{ mt: 2 }} fontWeight={700}>
                    Concepto: {pagoPendiente?.concepto}
                  </Typography>

                  <Typography>
                    Permiso: {pagoPendiente?.permiso || "-"}
                  </Typography>

                  <Typography fontWeight={700} sx={{ mt: 1 }}>
                    Total a pagar: {importePagoPendiente.toFixed(2)} €
                  </Typography>
                </>
              ) : (
                <>
                  <Typography>
                    Vas a realizar el pago de tu matrícula.
                  </Typography>

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
                </>
              )}
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
