import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";

import CreditCardIcon from "@mui/icons-material/CreditCard";

import { useNavigate } from "react-router-dom";

export default function AccesoRestringidoMatricula({ matricula }) {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "70vh",
      }}
    >
      <Card
        sx={{
          width: 720,
          maxWidth: "100%",
          borderRadius: 4,
          textAlign: "center",
          boxShadow: "0 18px 40px rgba(15,23,42,0.12)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Acceso restringido
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mb: 3,
            }}
          >
            Tu matrícula todavía no ha sido abonada. Debes completar el pago
            para acceder a los contenidos teóricos de la plataforma.
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 1,
              flexWrap: "wrap",
              mb: 3,
            }}
          >
            <Chip label={`Permiso ${matricula?.licencia}`} color="primary" />

            <Chip label={matricula?.estado} color="warning" />
          </Box>

          <Typography fontWeight={700} sx={{ mb: 3 }}>
            Importe pendiente: {matricula?.precioFinal} €
          </Typography>

          <Button
            variant="contained"
            color="success"
            size="large"
            startIcon={<CreditCardIcon />}
            onClick={() => navigate("/pago-matricula")}
          >
            Pagar matrícula
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
