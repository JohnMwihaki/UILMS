import React from "react";
import { Outlet } from "react-router-dom";
import { Box, ThemeProvider, CssBaseline } from "@mui/material";
import PublicHeader from "../components/Headers/PublicHeader";
import Footer from "../components/Headers/Footer";
import { getTheme } from "../theme/theme";
import useThemeStore from "../stores/themeStore";

export const PublicLayout: React.FC = () => {
  const { mode } = useThemeStore();
  const theme = getTheme(mode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundColor: theme.palette.background.default,
        }}
      >
        <PublicHeader />
        
        {/* Main Content Area */}
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Outlet />
        </Box>

        <Footer />
      </Box>
    </ThemeProvider>
  );
};
export default PublicLayout;
