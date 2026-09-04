import { Box, Chip, Stack, Typography } from "@mui/material";

const heroImage =
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80";

const features = [
  "Actualizado 2024",
  "Válido para examen",
  "Test oficiales",
  "Miles de preguntas",
];

export default function TemarioHero({ mode = "admin" }) {
  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 4,
        p: { xs: 2.5, md: 4 },
        background:
          "linear-gradient(120deg, rgba(7, 17, 30, 0.97) 0%, rgba(9, 28, 45, 0.96) 52%, rgba(12, 82, 90, 0.82) 100%)",
        boxShadow: "0 24px 50px rgba(15, 23, 42, 0.28)",
        mb: 4,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 90% 20%, rgba(34,197,94,0.45), transparent 23%)",
        }}
      />

      <Box
        sx={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1.4fr 0.9fr" },
          alignItems: "center",
          gap: 3,
          zIndex: 1,
        }}
      >
        <Box>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              color: "#f8fafc",
              letterSpacing: "-0.05em",
              lineHeight: 1,
              mb: 2,
              fontSize: { xs: "2.2rem", md: "4rem" },
            }}
          >
            TEMARIOS PERMISO DE CONDUCIR{" "}
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: "#dbeafe",
              mb: 3,
              fontWeight: 500,
            }}
          >
            Todo lo que necesitas saber para aprobar tu examen teórico
          </Typography>

          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            {features.map((feature) => (
              <Chip
                key={feature}
                label={feature}
                sx={{
                  background: "rgba(15, 118, 110, 0.22)",
                  color: "#d1fae5",
                  border: "1px solid rgba(110, 231, 183, 0.35)",
                  fontWeight: 700,
                  px: 1,
                }}
              />
            ))}
          </Stack>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 260,
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              right: "-6%",
              top: "-3%",
              width: { xs: 280, md: 380 },
              height: { xs: 280, md: 380 },
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, rgba(16,185,129,0.75), rgba(6,182,212,0.4))",
              filter: "blur(16px)",
            }}
          />

          <Box
            component="img"
            src={heroImage}
            alt="Coche blanco del temario de permiso B"
            sx={{
              position: "relative",
              width: "100%",
              maxWidth: 520,
              objectFit: "cover",
              borderRadius: 4,
              boxShadow: "0 26px 45px rgba(15, 23, 42, 0.45)",
            }}
          />
        </Box>
      </Box>

      {mode === "student" && (
        <Typography
          variant="subtitle1"
          sx={{
            mt: 3,
            color: "#bbf7d0",
            fontWeight: 700,
          }}
        >
          La teoría se irá desarrollando por tema a medida que avances en tu
          formación.
        </Typography>
      )}
    </Box>
  );
}
