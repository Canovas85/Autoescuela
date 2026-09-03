import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
} from "@mui/material";

import { Box } from "@mui/material";
import { jwtDecode } from "jwt-decode";

import { useState, useEffect } from "react";

import Collapse from "@mui/material/Collapse";

import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import PaymentsIcon from "@mui/icons-material/Payments";
import SchoolIcon from "@mui/icons-material/School";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PeopleIcon from "@mui/icons-material/People";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import QuizIcon from "@mui/icons-material/Quiz";
import ArticleIcon from "@mui/icons-material/Article";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PaymentIcon from "@mui/icons-material/Payment";
import EventNoteIcon from "@mui/icons-material/EventNote";
import GroupIcon from "@mui/icons-material/Group";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CommuteIcon from "@mui/icons-material/Commute";

import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import TrafficIcon from "@mui/icons-material/Traffic";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import DriveEtaIcon from "@mui/icons-material/DriveEta";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import ReceiptIcon from "@mui/icons-material/Receipt";

import { matriculasService } from "../../services/matriculasService";

const drawerWidth = 240;

const menus = {
  ADMIN: [
    {
      label: "Dashboard",
      icon: <DashboardIcon />,
      path: "/dashboard",
    },

    {
      label: "Gestión",
      icon: <SettingsIcon />,
      children: [
        {
          label: "Alumnos",
          path: "/alumnos",
          icon: <PeopleIcon fontSize="small" />,
        },
        {
          label: "Profesores",
          path: "/profesores",
          icon: <SchoolOutlinedIcon fontSize="small" />,
        },
        {
          label: "Vehículos",
          path: "/vehiculos",
          icon: <DirectionsCarFilledIcon fontSize="small" />,
        },
      ],
    },

    {
      label: "Precios",
      icon: <PaymentsIcon />,
      children: [
        {
          label: "Matriculas",
          path: "/matricula",
          icon: <LocalOfferIcon fontSize="small" />,
        },
        {
          label: "Tarifas matricula",
          path: "/tarifas-matricula",
          icon: <LocalOfferIcon fontSize="small" />,
        },
        {
          label: "Bonos",
          path: "/bonos",
          icon: <LocalOfferIcon fontSize="small" />,
        },
        {
          label: "Promociones",
          path: "/promociones",
          icon: <LocalOfferIcon fontSize="small" />,
        },
      ],
    },

    {
      label: "Teórica",
      icon: <SchoolIcon />,
      children: [
        {
          label: "Temarios",
          path: "/temarios",
          icon: <MenuBookIcon fontSize="small" />,
        },
        {
          label: "Clases En Directo",
          path: "/admin-clases-directo",
          icon: <SchoolIcon fontSize="small" />,
        },
        {
          label: "Test por tema",
          path: "/test-por-tema",
          icon: <QuizIcon fontSize="small" />,
        },
        {
          label: "Test DGT",
          path: "/test-dgt",
          icon: <QuizIcon fontSize="small" />,
        },
      ],
    },

    {
      label: "Práctica",
      icon: <DirectionsCarIcon />,
      children: [
        {
          label: "Hojas de Ruta",
          path: "/hojas-ruta",
          icon: <ReceiptLongIcon fontSize="small" />,
        },
        {
          label: "Solicitud Examen",
          path: "/solicitudes-examen",
          icon: <ArticleIcon fontSize="small" />,
        },
      ],
    },

    {
      label: "Evaluación",
      icon: <FactCheckIcon />,
      children: [
        {
          label: "Exámen Teórico",
          path: "/examenes-teoricos",
          icon: <QuizIcon fontSize="small" />,
        },
        {
          label: "Exámen Práctico",
          path: "/examenes",
          icon: <QuizIcon fontSize="small" />,
        },
      ],
    },

    {
      label: "Contabilidad",
      icon: <AssessmentIcon />,
      children: [
        {
          label: "Pagos",
          path: "/pagos",
          icon: <PaymentIcon fontSize="small" />,
        },
        {
          label: "Informes",
          path: "/informes",
          icon: <AssessmentIcon fontSize="small" />,
        },
        {
          label: "Facturas",
          path: "/facturas",
          icon: <ReceiptLongIcon fontSize="small" />,
        },
      ],
    },
  ],

  PROFESOR: [
    {
      label: "Dashboard",
      icon: <DashboardIcon />,
      path: "/dashboard",
    },

    {
      label: "Agenda",
      icon: <EventNoteIcon />,
      path: "/agenda",
    },

    {
      label: "Alumnos",
      icon: <GroupIcon />,
      path: "/profesor-alumnos",
    },

    {
      label: "Clases prácticas",
      icon: <DirectionsCarFilledIcon />,
      path: "/clases-practicas",
    },

    {
      label: "Hoja de Ruta",
      icon: <AssignmentIcon />,
      path: "/hoja-ruta",
    },

    {
      label: "Vehículos",
      icon: <CommuteIcon />,
      path: "/vehiculos",
    },
  ],

  ALUMNO: [
    {
      label: "Mi progreso",
      icon: <TrendingUpIcon />,
      path: "/dashboard",
    },

    {
      label: "Clases teóricas",
      icon: <SchoolIcon />,
      children: [
        {
          label: "Clases En Directo",
          path: "/clases-directo",
          icon: <OndemandVideoIcon fontSize="small" />,
        },
        {
          label: "Material de apoyo",
          path: "/temario",
          icon: <MenuBookOutlinedIcon fontSize="small" />,
        },
        {
          label: "Test Teóricos",
          path: "/test-teoricos",
          icon: <TaskAltIcon fontSize="small" />,
        },
        {
          label: "Test DGT",
          path: "/test-dgt",
          icon: <TrafficIcon fontSize="small" />,
        },
      ],
    },

    {
      label: "Clases prácticas",
      icon: <DirectionsCarIcon />,
      children: [
        {
          label: "Solicitud Clase",
          path: "/reservar-clase",
          icon: <CalendarMonthIcon fontSize="small" />,
        },
        {
          label: "Hoja Ruta",
          path: "/evolucion",
          icon: <AssignmentOutlinedIcon fontSize="small" />,
        },
      ],
    },

    {
      label: "Exámenes",
      icon: <FactCheckIcon />,
      children: [
        {
          label: "Examen Teórico",
          path: "/examen-teorico",
          icon: <SchoolOutlinedIcon fontSize="small" />,
        },
        {
          label: "Examen Práctico",
          path: "/examen-practico",
          icon: <DriveEtaIcon fontSize="small" />,
        },
      ],
    },

    {
      label: "Compras",
      icon: <ShoppingCartIcon />,
      children: [
        {
          label: "Bonos",
          path: "/bonos",
          icon: <LocalOfferIcon fontSize="small" />,
        },
        {
          label: "Promociones",
          path: "/promociones",
          icon: <LocalOfferIcon fontSize="small" />,
        },
        {
          label: "Mis Pagos",
          path: "/mis-pagos",
          icon: <CreditCardIcon fontSize="small" />,
        },
        {
          label: "Mis Facturas",
          path: "/mis-facturas",
          icon: <ReceiptIcon fontSize="small" />,
        },
      ],
    },
  ],
};

export default function Sidebar({ navigate, location }) {
  const token = localStorage.getItem("token");
  const [openMenus, setOpenMenus] = useState(() => {
    const saved = localStorage.getItem("sidebarAdminState");

    if (saved) {
      return JSON.parse(saved);
    }

    return {};
  });

  const [matriculaPagada, setMatriculaPagada] = useState(true);

  const toggleMenu = (label) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };
  useEffect(() => {
    localStorage.setItem("sidebarAdminState", JSON.stringify(openMenus));
  }, [openMenus]);

  let role = "ALUMNO";

  if (token) {
    try {
      const user = jwtDecode(token);

      role = user.rol;
    } catch (error) {
      console.error("Error leyendo JWT:", error);
    }
  }

  useEffect(() => {
    const loadMatricula = async () => {
      if (role !== "ALUMNO") {
        return;
      }

      try {
        const matricula = await matriculasService.getMine();

        setMatriculaPagada(matricula.estado === "PAGADA");
      } catch (error) {
        console.error(error);
      }
    };

    loadMatricula();
  }, [role]);

  let menu = menus[role];

  if (role === "ALUMNO" && !matriculaPagada) {
    menu = [
      {
        label: "Mi progreso",
        icon: <TrendingUpIcon />,
        path: "/dashboard",
      },

      {
        label: "Clases teóricas",
        icon: <SchoolIcon />,
        children: [
          {
            label: "Clases En Directo",
            path: "/clases-directo",
            icon: <OndemandVideoIcon fontSize="small" />,
          },
          {
            label: "Material de apoyo",
            path: "/temario",
            icon: <MenuBookOutlinedIcon fontSize="small" />,
          },
          {
            label: "Test Teóricos",
            path: "/test-teoricos",
            icon: <TaskAltIcon fontSize="small" />,
          },
          {
            label: "Test DGT",
            path: "/test-dgt",
            icon: <TrafficIcon fontSize="small" />,
          },
        ],
      },

      {
        label: "Pago matrícula",
        icon: <CreditCardIcon />,
        path: "/pago-matricula",
      },
    ];
  }
  if (!menu) {
    return null;
  }
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
          borderRight: "1px solid #e5e7eb",
          backgroundColor: "#ffffff",
        },

        "& .MuiListItemButton-root": {
          borderRadius: "8px",
          margin: "2px 8px",
        },

        "& .MuiListItemButton-root:hover": {
          backgroundColor: "#f3f4f6",
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
        {role === "ADMIN"
          ? menu.map((item) => (
              <Box key={item.label}>
                {item.children ? (
                  <>
                    <ListItemButton onClick={() => toggleMenu(item.label)}>
                      {item.icon}

                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontSize: "0.95rem",
                          fontWeight: 500,
                        }}
                        sx={{ ml: 2 }}
                      />

                      {openMenus[item.label] ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>

                    <Collapse
                      in={openMenus[item.label]}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List component="div" disablePadding>
                        {item.children?.map((child) => (
                          <ListItemButton
                            key={child.path}
                            sx={{ pl: 5 }}
                            selected={location.pathname === child.path}
                            onClick={() => navigate(child.path)}
                          >
                            <>
                              {child.icon}

                              <ListItemText
                                primary={child.label}
                                sx={{ ml: 1 }}
                              />
                            </>
                          </ListItemButton>
                        ))}
                      </List>
                    </Collapse>
                  </>
                ) : (
                  <ListItemButton
                    selected={location.pathname === item.path}
                    onClick={() => navigate(item.path)}
                  >
                    {item.icon}

                    <ListItemText primary={item.label} sx={{ ml: 2 }} />
                  </ListItemButton>
                )}
              </Box>
            ))
          : role === "PROFESOR"
            ? menu.map((item) => (
                <ListItemButton
                  sx={{
                    borderRadius: 2,
                    mx: 1,
                  }}
                  key={item.path}
                  selected={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                >
                  {item.icon}

                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: "0.95rem",
                      fontWeight: 500,
                    }}
                    sx={{ ml: 2 }}
                  />
                </ListItemButton>
              ))
            : menu.map((item) => (
                <Box key={item.label}>
                  {item.children ? (
                    <>
                      <ListItemButton onClick={() => toggleMenu(item.label)}>
                        {item.icon}

                        <ListItemText
                          primary={item.label}
                          primaryTypographyProps={{
                            fontSize: "0.95rem",
                            fontWeight: 500,
                          }}
                          sx={{ ml: 2 }}
                        />

                        {openMenus[item.label] ? (
                          <ExpandLess />
                        ) : (
                          <ExpandMore />
                        )}
                      </ListItemButton>

                      <Collapse
                        in={openMenus[item.label]}
                        timeout="auto"
                        unmountOnExit
                      >
                        <List component="div" disablePadding>
                          {item.children?.map((child) => (
                            <ListItemButton
                              key={child.path}
                              sx={{
                                pl: 5,
                                borderRadius: 2,
                                mx: 1,
                              }}
                              selected={location.pathname === child.path}
                              onClick={() => navigate(child.path)}
                            >
                              {child.icon}

                              <ListItemText
                                primary={child.label}
                                sx={{ ml: 1 }}
                              />
                            </ListItemButton>
                          ))}
                        </List>
                      </Collapse>
                    </>
                  ) : (
                    <ListItemButton
                      selected={location.pathname === item.path}
                      onClick={() => navigate(item.path)}
                    >
                      {item.icon}

                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontSize: "0.95rem",
                          fontWeight: 500,
                        }}
                        sx={{ ml: 2 }}
                      />
                    </ListItemButton>
                  )}
                </Box>
              ))}
      </List>
    </Drawer>
  );
}
