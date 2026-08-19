import { AppBar, Toolbar, Typography } from "@mui/material";

import UserMenu from "./UserMenu";

export default function Topbar({ navigate }) {
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: 1201,
        background: "linear-gradient(90deg,#0f172a,#172554)",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6">Autoescuela Eguzkilore</Typography>

        <UserMenu navigate={navigate} />
      </Toolbar>
    </AppBar>
  );
}
