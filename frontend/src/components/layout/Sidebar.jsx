import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
} from "@mui/material";

const drawerWidth = 240;

export default function Sidebar({ navigate, location }) {
  return (
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

        "& .MuiListSubheader-root": {
          fontWeight: 700,
          fontSize: "0.75rem",
          color: "#64748b",
          backgroundColor: "#fff",
          lineHeight: "24px",
          paddingTop: "8px",
        },

        "& .Mui-selected": {
          backgroundColor: "#dbeafe !important",

          borderRight: "4px solid #2563eb",
        },

        "& .Mui-selected .MuiListItemText-primary": {
          fontWeight: 600,
          color: "#1d4ed8",
        },
      }}
    >
      <List>
        <ListSubheader sx={{ fontWeight: "bold" }}>GENERAL</ListSubheader>

        <ListItemButton
          selected={location.pathname === "/dashboard"}
          onClick={() => navigate("/dashboard")}
        >
          <ListItemText primary="Dashboard" sx={{ pl: 2 }} />
        </ListItemButton>

        <ListSubheader sx={{ fontWeight: "bold" }}>GESTIÓN</ListSubheader>

        <ListItemButton
          selected={location.pathname.startsWith("/alumnos")}
          onClick={() => navigate("/alumnos")}
        >
          <ListItemText primary="Alumnos" sx={{ pl: 2 }} />
        </ListItemButton>

        <ListItemButton
          selected={location.pathname.startsWith("/profesores")}
          onClick={() => navigate("/profesores")}
        >
          <ListItemText primary="Profesores" sx={{ pl: 2 }} />
        </ListItemButton>

        <ListItemButton
          selected={location.pathname.startsWith("/vehiculos")}
          onClick={() => navigate("/vehiculos")}
        >
          <ListItemText primary="Vehículos" sx={{ pl: 2 }} />
        </ListItemButton>

        <ListItemButton onClick={() => navigate("/clases")}>
          <ListItemText primary="Clases" sx={{ pl: 2 }} />
        </ListItemButton>

        <ListSubheader sx={{ fontWeight: "bold" }}>EVALUACIÓN</ListSubheader>

        <ListItemButton
          selected={location.pathname.startsWith("/examenes")}
          onClick={() => navigate("/examenes")}
        >
          <ListItemText primary="Exámenes" sx={{ pl: 2 }} />
        </ListItemButton>

        <ListItemButton>
          <ListItemText primary="Exámenes Teóricos" sx={{ pl: 2 }} />
        </ListItemButton>

        <ListSubheader sx={{ fontWeight: "bold" }}>NEGOCIO</ListSubheader>

        <ListItemButton>
          <ListItemText primary="Facturación" sx={{ pl: 2 }} />
        </ListItemButton>

        <ListItemButton>
          <ListItemText primary="Promociones" sx={{ pl: 2 }} />
        </ListItemButton>
      </List>
    </Drawer>
  );
}
