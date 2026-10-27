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
            variant="outlined"
            size="large"
            onClick={() => navigate("/pago-matricula")}
            startIcon={<CreditCardIcon />}
            sx={{
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase",
              borderRadius: "8px",
              padding: "10px 24px", // Ajustado proporcionalmente para la variante grande (size="large")
              border: "1px solid",
              color: "#15803d",
              borderColor: "#15803d !important",
              backgroundColor: "transparent",
              boxShadow: `
      0px 4px 0px #166534, 
      0px 8px 16px rgba(21, 128, 61, 0.15),
      inset 0px 1px 0px rgba(255, 255, 255, 0.1)
    `,
              transition: "all 0.15s ease-in-out",
              "& .MuiButton-startIcon": {
                color: "inherit",
              },
              "&:hover": {
                color: "#22c55e",
                borderColor: "#22c55e !important",
                backgroundColor: "rgba(21, 128, 61, 0.04)",
                boxShadow: `
        0px 4px 0px #166534, 
        0px 12px 20px rgba(34, 197, 94, 0.25),
        inset 0px 1px 0px rgba(255, 255, 255, 0.2)
      `,
                transform: "translateY(-1px)",
              },
              "&:active": {
                borderColor: "#15803d !important",
                boxShadow: `
        0px 1px 0px #166534, 
        0px 2px 4px rgba(21, 128, 61, 0.2),
        inset 0px 2px 4px rgba(0, 0, 0, 0.05)
      `,
                transform: "translateY(3px)", // Mecanismo físico de hundimiento completo
              },
            }}
          >
            Pagar matrícula
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
