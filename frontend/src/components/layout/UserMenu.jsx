import { useState } from "react";

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
          SC
        </Avatar>

        <Box>
          <Typography
            variant="body2"
            sx={{
              color: "white",
              fontWeight: 600,
            }}
          >
            Sergio Cano
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: "#cbd5e1",
            }}
          >
            Administrador
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
