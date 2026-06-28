import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { Menu as MenuIcon, DarkMode, LightMode, Person, Dashboard } from "@mui/icons-material";
import useThemeStore from "../../stores/themeStore";
import useAuthStore from "../../stores/authStore";

export const PublicHeader: React.FC = () => {
  const { mode, toggleTheme } = useThemeStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Institutions", path: "/institutions" },
    { label: "Opportunities", path: "/opportunities" },
    { label: "Announcements", path: "/announcements" },
    { label: "Contact", path: "/contact" },
  ];

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const activeLinkStyle = (path: string) => ({
    color: location.pathname === path ? theme.palette.secondary.main : theme.palette.text.primary,
    fontWeight: location.pathname === path ? 700 : 500,
    borderBottom: location.pathname === path ? `2px solid ${theme.palette.secondary.main}` : "none",
    borderRadius: 0,
    px: 1,
    mx: 1,
    minWidth: "auto",
    "&:hover": {
      color: theme.palette.secondary.main,
      background: "transparent",
    },
  });

  return (
    <AppBar position="sticky" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", height: 74, px: { xs: 2, md: 4 } }}>
        {/* Logo and Brand */}
        <Box
          component={RouterLink}
          to="/"
          sx={{ display: "flex", alignItems: "center", textDecoration: "none", gap: 1.5 }}
        >
          {/* Real Karatina University Logo Asset */}
          <Box
            component="img"
            src="/logo.png"
            alt="Karatina University Logo"
            sx={{
              width: 44,
              height: 44,
              objectFit: "contain",
            }}
          />
          <Box>
            <Typography
              variant="h6"
              sx={{
                color: "#0a8447",
                fontWeight: 800,
                fontSize: { xs: "1rem", sm: "1.2rem" },
                lineHeight: 1.1,
                fontFamily: "'Outfit', sans-serif",
                textTransform: "uppercase",
              }}
            >
              Karatina University
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "#d4af37",
                fontWeight: 600,
                fontSize: "0.68rem",
                display: "block",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Industry Linkage Portal
            </Typography>
          </Box>
        </Box>

        {/* Desktop Navigation Links */}
        {!isMobile && (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {navLinks.map((link) => (
              <Button
                key={link.path}
                component={RouterLink}
                to={link.path}
                sx={activeLinkStyle(link.path)}
              >
                {link.label}
              </Button>
            ))}
          </Box>
        )}

        {/* Action Controls */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton onClick={toggleTheme} color="primary" sx={{ color: "#005028" }}>
            {mode === "dark" ? <LightMode /> : <DarkMode />}
          </IconButton>

          {!isMobile ? (
            isAuthenticated ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Button
                  component={RouterLink}
                  to={user?.role === "ADMIN" ? "/admin/dashboard" : "/profile"}
                  variant="outlined"
                  color="primary"
                  startIcon={user?.role === "ADMIN" ? <Dashboard /> : <Person />}
                  sx={{ borderColor: "#005028", color: "#005028" }}
                >
                  {user?.role === "ADMIN" ? "Dashboard" : "My Profile"}
                </Button>
                <Button onClick={handleLogout} variant="contained" color="secondary">
                  Logout
                </Button>
              </Box>
            ) : (
              <Button
                component={RouterLink}
                to="/login"
                variant="contained"
                sx={{
                  background: "linear-gradient(135deg, #005028 0%, #1b814a 100%)",
                  boxShadow: "0 4px 10px rgba(0, 80, 40, 0.3)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #003014 0%, #005028 100%)",
                  },
                }}
              >
                Admin Login
              </Button>
            )
          ) : (
            <IconButton onClick={handleDrawerToggle} color="primary" sx={{ color: "#005028" }}>
              <MenuIcon />
            </IconButton>
          )}
        </Box>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        slotProps={{
          paper: {
            sx: { width: 280, p: 2, backgroundColor: mode === "light" ? "#fbfbfe" : "#0d0e12" }
          }
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <IconButton onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
        </Box>
        <List>
          {navLinks.map((link) => (
            <ListItem key={link.path} disablePadding>
              <ListItemButton
                component={RouterLink}
                to={link.path}
                onClick={handleDrawerToggle}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  backgroundColor: location.pathname === link.path ? "rgba(0, 80, 40, 0.08)" : "transparent",
                  color: location.pathname === link.path ? "#005028" : "inherit",
                }}
              >
                <ListItemText primary={<Typography sx={{ fontWeight: 600 }}>{link.label}</Typography>} />
              </ListItemButton>
            </ListItem>
          ))}
          <Box sx={{ mt: 4, px: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            {isAuthenticated ? (
              <>
                <Button
                  component={RouterLink}
                  to={user?.role === "ADMIN" ? "/admin/dashboard" : "/profile"}
                  variant="outlined"
                  fullWidth
                  onClick={handleDrawerToggle}
                  sx={{ borderColor: "#005028", color: "#005028" }}
                >
                  Dashboard
                </Button>
                <Button onClick={handleLogout} variant="contained" color="secondary" fullWidth>
                  Logout
                </Button>
              </>
            ) : (
              <Button
                component={RouterLink}
                to="/login"
                variant="contained"
                fullWidth
                onClick={handleDrawerToggle}
                sx={{
                  background: "linear-gradient(135deg, #005028 0%, #1b814a 100%)",
                }}
              >
                Admin Login
              </Button>
            )}
          </Box>
        </List>
      </Drawer>
    </AppBar>
  );
};
export default PublicHeader;
