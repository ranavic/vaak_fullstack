import React from "react";
import { Box, Typography } from "@mui/material";

const PageShell = ({ title, actions, children }) => (
  <Box
    sx={{
      width: "100%",
      maxWidth: 920,
      mx: "auto",
      display: "flex",
      flexDirection: "column",
      gap: 2.5,
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: { xs: "flex-start", sm: "center" },
        justifyContent: "space-between",
        gap: 2,
        flexDirection: { xs: "column", sm: "row" },
      }}
    >
      <Typography variant="h4">{title}</Typography>
      {actions}
    </Box>
    {children}
  </Box>
);

export default PageShell;
