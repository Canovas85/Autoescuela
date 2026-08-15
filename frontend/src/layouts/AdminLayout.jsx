import {
  AppBar,
  Box,
  Drawer,
  Toolbar,
  Typography,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";

import { Outlet, useNavigate } from "react-router-dom";

const drawerWidth = 240;

export default function AdminLayout() {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: 1201,
          background: "linear-gradient(90deg,#0f172a,#172554)",
        }}
      >
        <Toolbar>
          <Typography variant="h6">Autoescuela Eguzkilore</Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            marginTop: "64px",
          },
        }}
      >
        <List>
          <ListItemButton onClick={() => navigate("/dashboard")}>
            <ListItemText primary="Dashboard" />
          </ListItemButton>

          <ListItemButton onClick={() => navigate("/alumnos")}>
            <ListItemText primary="Alumnos" />
          </ListItemButton>

          <ListItemButton onClick={() => navigate("/profesores")}>
            <ListItemText primary="Profesores" />
          </ListItemButton>

          <ListItemButton onClick={() => navigate("/vehiculos")}>
            <ListItemText primary="Vehículos" />
          </ListItemButton>

          <ListItemButton onClick={() => navigate("/clases")}>
            <ListItemText primary="Clases" />
          </ListItemButton>

          <ListItemButton onClick={() => navigate("/examenes")}>
            <ListItemText primary="Exámenes" />
          </ListItemButton>
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          mt: 8,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
