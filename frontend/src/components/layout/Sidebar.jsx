import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
} from "@mui/material";

import { Box } from "@mui/material";
import { jwtDecode } from "jwt-decode";

const drawerWidth = 240;

const menus = {
  ADMIN: [
    {
      title: "GENERAL",
      items: [{ label: "Dashboard", path: "/dashboard" }],
    },

    {
      title: "GESTIÓN",
      items: [
        { label: "Alumnos", path: "/alumnos" },
        { label: "Profesores", path: "/profesores" },
        { label: "Vehículos", path: "/vehiculos" },
        { label: "Temarios", path: "/temarios" },
        { label: "Bonos", path: "/bonos" },
        { label: "Solicitudes Examen", path: "/solicitudes-examen" },
        { label: "Clases", path: "/clases" },
      ],
    },

    {
      title: "EVALUACIÓN",
      items: [
        { label: "Exámenes Teóricos", path: "/examenes-teoricos" },
        { label: "Exámenes Prácticos", path: "/examenes" },
      ],
    },

    {
      title: "NEGOCIO",
      items: [
        { label: "Facturación", path: "/facturacion" },
        { label: "Promociones", path: "/promociones" },
      ],
    },
  ],

  PROFESOR: [
    {
      title: "FORMACIÓN",
      items: [
        {
          label: "Gestión Formación Virtual",
          path: "/formacion-virtual",
        },
      ],
    },

    {
      title: "EVALUACIÓN",
      items: [
        {
          label: "Evaluación Teórica",
          path: "/evaluacion-teorica",
        },

        {
          label: "Hoja de Ruta",
          path: "/hoja-ruta",
        },
      ],
    },

    {
      title: "PRÁCTICAS",
      items: [
        {
          label: "Planificación Clases",
          path: "/planificacion-clases",
        },
      ],
    },
  ],

  ALUMNO: [
    {
      title: "GENERAL",
      items: [
        {
          label: "Dashboard",
          path: "/dashboard",
        },
      ],
    },

    {
      title: "ÁREA TEÓRICA",
      items: [
        {
          label: "Temario",
          path: "/temario",
        },

        {
          label: "Clases en Directo",
          path: "/clases-directo",
        },

        {
          label: "Test de Práctica",
          path: "/test-practica",
        },
      ],
    },

    {
      title: "ÁREA PRÁCTICA",
      items: [
        {
          label: "Reservar Clase",
          path: "/reservar-clase",
        },

        {
          label: "Mi Evolución",
          path: "/evolucion",
        },
      ],
    },

    {
      title: "GESTIÓN",
      items: [
        {
          label: "Comprar Bonos",
          path: "/bonos",
        },

        {
          label: "Solicitar Examen",
          path: "/solicitar-examen",
        },
      ],
    },
  ],
};

export default function Sidebar({ navigate, location }) {
  const token = localStorage.getItem("token");

  let role = "ALUMNO";

  if (token) {
    try {
      const user = jwtDecode(token);

      role = user.rol;
    } catch (error) {
      console.error("Error leyendo JWT:", error);
    }
  }

  const menu = menus[role];
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
        {menu.map((section) => (
          <Box key={section.title}>
            <ListSubheader>{section.title}</ListSubheader>

            {section.items.map((item) => (
              <ListItemButton
                key={item.path}
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              >
                <ListItemText primary={item.label} sx={{ pl: 2 }} />
              </ListItemButton>
            ))}
          </Box>
        ))}
      </List>
    </Drawer>
  );
}
