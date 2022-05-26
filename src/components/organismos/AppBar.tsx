import * as React from "react";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";

import Toolbar from "../atoms/Toolbar";

const rightLink = {
  fontSize: 16,
  color: "common.white",
  ml: 3,
};
import MuiAppBar, { AppBarProps } from "@mui/material/AppBar";

function AppBar() {
  return (
    <div>
      <MuiAppBar elevation={0} position="fixed">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ flex: 1 }} />
          <Link
            variant="h6"
            underline="none"
            color="inherit"
            href="/"
            sx={{ fontSize: 24 }}
          >
            {"Test CRUD - Next.JS"}
          </Link>
          <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
            <Link
              color="inherit"
              variant="h6"
              underline="none"
              href="/"
              sx={rightLink}
            >
              {"Listar"}
            </Link>
            <Link
              variant="h6"
              underline="none"
              href="/contact/create"
              sx={{ ...rightLink, color: "secondary.main" }}
            >
              {"Nuevo"}
            </Link>
          </Box>
        </Toolbar>
      </MuiAppBar>
    </div>
  );
}

export default AppBar;
