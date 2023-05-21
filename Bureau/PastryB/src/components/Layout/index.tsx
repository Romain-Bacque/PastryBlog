import Header from "../Header";
import { LayoutProps } from "./types";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "../../styles/theme";
import LoaderAndAlert from "../UI/LoaderAndAlert";
import { useAppSelector } from "../../hooks/use-store";

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const loading = useAppSelector((state) => state.loading);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <main style={{ margin: "12rem 0 5rem" }}>
        <LoaderAndAlert
          statut={loading.statut}
          message={{
            errorMessage: loading.message.error,
            successMessage: loading.message.success,
          }}
        />
        {children}
      </main>
      <footer></footer>
    </ThemeProvider>
  );
};

export default Layout;
