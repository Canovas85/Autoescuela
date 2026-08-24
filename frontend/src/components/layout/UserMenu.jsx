import { useState } from "react";
import { jwtDecode } from "jwt-decode";

import {
  Avatar,
  Box,
  Divider,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export default function UserMenu({ navigate }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const token = localStorage.getItem("token");

  let user = null;

  if (token) {
    try {
      user = jwtDecode(token);
    } catch (error) {
      console.error("Error leyendo JWT:", error);
    }
  }

  return (
    <>
      <Box
        onClick={handleMenuOpen}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          cursor: "pointer",
          padding: "6px 10px",
          borderRadius: "12px",

          "&:hover": {
            backgroundColor: "rgba(255,255,255,0.08)",
          },
        }}
      >
        <Avatar
          sx={{
            bgcolor: "#2563eb",
            width: 40,
            height: 40,
          }}
        >
          {(user?.rol || "US").substring(0, 2).toUpperCase()}
        </Avatar>

        <Box>
          <Typography
            variant="body2"
            sx={{
              color: "white",
              fontWeight: 600,
            }}
          >
            {user?.email || "Usuario"}
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: "#cbd5e1",
            }}
          >
            {user?.rol || "Sin rol"}
          </Typography>
        </Box>

        <KeyboardArrowDownIcon
          sx={{
            color: "white",
          }}
        />
      </Box>

      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
        <MenuItem onClick={handleMenuClose}>Mi perfil</MenuItem>

        <MenuItem onClick={handleMenuClose}>Configuración</MenuItem>

        <Divider />

        <MenuItem
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("requiresPasswordChange");

            handleMenuClose();

            navigate("/");
          }}
          sx={{
            color: "#dc2626",
          }}
        >
          Cerrar sesión
        </MenuItem>
      </Menu>
    </>
  );
}
