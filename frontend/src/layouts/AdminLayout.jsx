import { Box } from "@mui/material";

import { Outlet, useNavigate, useLocation } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

export default function AdminLayout() {
  const navigate = useNavigate();

  const location = useLocation();

  return (
    <Box sx={{ display: "flex" }}>
      <Topbar navigate={navigate} />

      <Sidebar navigate={navigate} location={location} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          mt: 8,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
