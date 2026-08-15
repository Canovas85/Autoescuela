import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2563eb",
    },

    secondary: {
      main: "#ff7a00",
    },

    background: {
      default: "#f5f7fb",
    },

    success: {
      main: "#16a34a",
    },
  },

  typography: {
    fontFamily: "'Inter', 'Roboto', sans-serif",
  },

  shape: {
    borderRadius: 16,
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 12,
          fontWeight: 600,
          height: 48,
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          boxShadow: "0 10px 25px rgba(15,23,42,.08)",
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;
