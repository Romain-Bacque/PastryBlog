import { ThemeProvider } from "@emotion/react";
import { createTheme, Theme } from "@mui/material";
import React, { useCallback } from "react";
import theme from "../../styles/theme";

// Component
const AuthContainerThemeProvider: React.FC<{ children: JSX.Element }> = ({
  children,
}) => {
  return (
    <ThemeProvider theme={theme}>
      <ThemeProvider
        theme={useCallback(
          (theme: Theme) =>
            createTheme({
              ...theme,
              components: {
                ...theme.components,
                MuiButton: {
                  styleOverrides: {
                    contained: {
                      ...((theme.components?.MuiButton?.styleOverrides
                        ?.contained as Object) ?? {}),
                    },
                    root: {
                      ...((theme.components?.MuiButton?.styleOverrides
                        ?.root as Object) ?? {}),
                      width: "90%",
                    },
                  },
                },
                MuiContainer: {
                  styleOverrides: {
                    root: {
                      ...((theme.components?.MuiContainer?.styleOverrides
                        ?.root as Object) ?? {}),
                      width: "500px",
                      maxWidth: "90%",
                      padding: "3rem",
                      backgroundColor: "white",
                      borderRadius: "10px",
                      border: "1px solid rgb(230, 230, 230)",
                    },
                  },
                },
              },
            }),
          []
        )}
      >
        {children}
      </ThemeProvider>
    </ThemeProvider>
  );
};

export default AuthContainerThemeProvider;
