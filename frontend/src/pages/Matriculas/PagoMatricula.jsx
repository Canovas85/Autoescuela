import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Divider,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { matriculasService } from "../../services/matriculasService";

export default function PagoMatricula() {
  const navigate = useNavigate();

  const [matricula, setMatricula] = useState(null);

  const [loading, setLoading] = useState(true);

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
    try {
      await matriculasService.pagar(matricula.id);

      navigate("/dashboard");
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

            <Typography>
              Importe pendiente: {matricula?.precioFinal} €
            </Typography>

            <Typography color="warning.main">
              Estado: {matricula?.estado}
            </Typography>
          </Box>

          <TextField fullWidth label="Titular de la tarjeta" sx={{ mb: 2 }} />

          <TextField
            fullWidth
            label="Número de tarjeta"
            placeholder="1234 5678 9012 3456"
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
            <TextField label="Caducidad" placeholder="MM/AA" />

            <TextField label="CVV" placeholder="123" />
          </Box>

          <Button
            variant="contained"
            fullWidth
            size="large"
            color="success"
            onClick={handlePagar}
          >
            Pagar Matrícula
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
