import React from "react";
import { Box, CircularProgress } from "@mui/material";

const Loader = () => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", p: 2 }}>
      <CircularProgress size={24} sx={{ color: "#8B5E34" }} />
    </Box>
  );
};

export default Loader;
