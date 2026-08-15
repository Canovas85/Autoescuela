import React from "react";
import ReactDOM from "react-dom/client";

import AppRouter from "./routes/AppRouter";

import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

import theme from "./theme/theme";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <AppRouter />
    </ThemeProvider>
  </React.StrictMode>,
);
