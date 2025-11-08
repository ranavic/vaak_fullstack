import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: "linear-gradient(90deg, #82534bff 0%, #7d4d45ff 100%)",
        color: "#FFFFFF",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 48, sm: 64 }, // shorter on mobile
          px: { xs: 1, sm: 2 },
        }}
      >
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            color: "#FFFFFF",
            fontWeight: "bold",
            textDecoration: "none",
            letterSpacing: "0.5px",
            fontSize: { xs: "1rem", sm: "1.25rem" },
            "&:hover": { color: "#EFEBE9" },
          }}
        >
          Vaak
        </Typography>

        {[
          { label: "Chat", to: "/" },
          { label: "Dictionary", to: "/dictionary" },
          { label: "Translate", to: "/translate" },
          { label: "History", to: "/history" },
        ].map((item) => (
          <Button
            key={item.to}
            component={Link}
            to={item.to}
            sx={{
              backgroundColor: "#5E3D22",
              color: "#FFFFFF",
              fontWeight: "bold",
              textTransform: "none",
              mx: { xs: 0.5, sm: 1.5 },
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              transition: "background-color 0.3s ease, transform 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "#5d3737ff",
                transform: "translateY(-2px)",
              },
            }}
          >
            {item.label}
          </Button>
        ))}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
