// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#8B5E34", // deep caramel brown
      contrastText: "#FFF9F5", // light beige text
    },
    secondary: {
      main: "#A86F3A", // warm amber accent
    },
    background: {
      default: "#FFF9F0", // soft parchment beige
      paper: "#FFF7E0",   // lighter paper tone
    },
    text: {
      primary: "#3B2A14", // dark walnut text
      secondary: "#5E3D22",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
          "&:hover": {
            backgroundColor: "#6a3e3eff",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#8B5E34",
          },
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: "#8B5E34",
        },
      },
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
});

export default theme;
