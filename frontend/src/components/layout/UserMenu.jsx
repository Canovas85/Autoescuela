import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { api } from "../../services/api";

import {
  Avatar,
  Box,
  Divider,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const getInitialsFromName = (name) => {
  if (!name || typeof name !== "string") {
    return "US";
  }

  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "US";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

export default function UserMenu({ navigate }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [profile, setProfile] = useState(null);

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

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setProfile(null);
        return;
      }

      try {
        const response = await api.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfile(response.data);
      } catch {
        setProfile(null);
      }
    };

    fetchProfile();
  }, [token]);

  const displayName = profile?.nombre || user?.nombre || "";
  const avatarInitials = getInitialsFromName(displayName);

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
          {avatarInitials}
        </Avatar>

        <Box>
          <Typography
            variant="body2"
            sx={{
              color: "white",
              fontWeight: 600,
            }}
          >
            {profile?.email || user?.email || "Usuario"}
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: "#cbd5e1",
            }}
          >
            {profile?.rol || user?.rol || "Sin rol"}
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
