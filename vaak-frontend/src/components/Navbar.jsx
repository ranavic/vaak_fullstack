import React from "react";
import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { label: "Chat", to: "/" },
  { label: "Dictionary", to: "/dictionary" },
  { label: "Translate", to: "/translate" },
  { label: "History", to: "/history" },
];

const Navbar = () => {
  const location = useLocation();

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: "linear-gradient(90deg, #6A4D37 0%, #5E412A 100%)",
        color: "#FFFFFF",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.24)",
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 56, sm: 64 },
          px: { xs: 1, sm: 2 },
          gap: 1,
          flexWrap: "wrap",
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
            fontSize: { xs: "1rem", sm: "1.25rem" },
            "&:hover": { color: "#EFEBE9" },
          }}
        >
          Vaak
        </Typography>

        {navItems.map((item) => {
          const active = location.pathname === item.to;

          return (
            <Button
              key={item.to}
              component={Link}
              to={item.to}
              sx={{
                backgroundColor: active ? "#F2E7DA" : "transparent",
                border: active ? "1px solid #F2E7DA" : "1px solid rgba(255,255,255,0.18)",
                color: active ? "#3A2D23" : "#FFFFFF",
                fontWeight: "bold",
                textTransform: "none",
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                minWidth: "auto",
                transition: "background-color 0.2s ease, border-color 0.2s ease",
                "&:hover": {
                  backgroundColor: active ? "#F2E7DA" : "rgba(255,255,255,0.1)",
                },
              }}
            >
              {item.label}
            </Button>
          );
        })}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
