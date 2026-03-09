// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#7A5C43", // sophisticated muted brown
      contrastText: "#FFFFFF", // crisp white text
    },
    secondary: {
      main: "#B38762", // soft caramel accent
    },
    background: {
      default: "#FDFBF7", // alabaster/cream base
      paper: "#FFFFFF",   // clean white for contrast
    },
    text: {
      primary: "#2C221B", // deepest espresso
      secondary: "#685241", // muted taupe brown
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          borderRadius: 16,
          boxShadow: "0 6px 20px rgba(44, 34, 27, 0.04)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 10,
          padding: "8px 20px",
          boxShadow: "0 4px 10px rgba(122, 92, 67, 0.2)",
          "&:hover": {
            backgroundColor: "#5C4330",
            boxShadow: "0 6px 14px rgba(122, 92, 67, 0.3)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
            backgroundColor: "#FDFBF7",
          },
          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#7A5C43",
          },
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: "#7A5C43",
        },
      },
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h4: {
      fontWeight: 600,
      color: "#2C221B",
    },
  },
});

export default theme;
