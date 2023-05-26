import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  // palette is area that store our customs colors
  palette: {
    // Most important color
    primary: {
      main: "#nnn'",
      light: "#ffffc7",
      dark: "#be9b68",
    },
    // Secondary Color
    secondary: {
      main: "#cb9951",
      light: "#fffffc",
      dark: "#b28646",
    },
    // Error message color
    error: {
      main: "#d32f2f",
    },
    // Important message color, for potentially dangerous action
    warning: {
      main: "#ed6c02",
    },
    // Information message color
    info: {
      main: "#0288d1",
    },
    // Success message color
    success: {
      main: "#2e7d32",
    },
  },
  // Media query breakpoints
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  typography: {
    body1: {
      fontFamily: "Gentium plus, sans-serif",
    },
    body2: {
      fontFamily: "Roboto, sans-serif",
    },
  },
  // Override components properties
  // 'Mui' next to component name (ex: 'Button' next to 'Mui' -> 'MuiButton')
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          width: 800,
          maxWidth: "90%",
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 1,
      },
      styleOverrides: {
        root: {
          backgroundColor: "white",
          borderRadius: "10px",
          overflow: "hidden",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        variant: "contained",
        color: "secondary",
      },
      styleOverrides: {
        root: {
          display: "block",
        },
        contained: {
          color: "#ffff",
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "standard",
      },
      styleOverrides: {
        root: {
          width: "100%",
          padding: ".5rem",
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          fontSize: "1.4rem",
        },
      },
    },
  },
});

export default theme;
