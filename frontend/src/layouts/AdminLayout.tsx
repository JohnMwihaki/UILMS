import React, { useState, useEffect } from "react";
import { Outlet, Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  ThemeProvider,
  CssBaseline,
  CircularProgress,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Business as BusinessIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Description as DescriptionIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
  ReceiptLong as AuditIcon,
  Notifications as NotificationsIcon,
  ExitToApp as LogoutIcon,
  Person as ProfileIcon,
  LightMode,
  DarkMode,
} from "@mui/icons-material";
import useThemeStore from "../stores/themeStore";
import useAuthStore from "../stores/authStore";
import { getTheme } from "../theme/theme";
import client from "../apis/client";
import type { Notification } from "../types";

const drawerWidth = 260;

export const AdminLayout: React.FC = () => {
  const { mode, toggleTheme } = useThemeStore();
  const theme = getTheme(mode);
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  
  const { user, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorOpen] = useState<null | HTMLElement>(null);
  const [notifAnchorEl, setNotifAnchor] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotifs, setLoadingNotifs] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    setLoadingNotifs(true);
    try {
      const res = await client.get("/notifications/");
      setNotifications(res.data.data || []);
    } catch (e) {
      console.error("Error loading notifications:", e);
    } finally {
      setLoadingNotifs(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorOpen(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorOpen(null);
  };

  const handleNotifMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotifAnchor(event.currentTarget);
  };

  const handleNotifMenuClose = () => {
    setNotifAnchor(null);
  };

  const handleMarkAllRead = async () => {
    try {
      await client.post("/notifications/mark_all_read/");
      fetchNotifications();
    } catch (e) {
      console.error(e);
    }
    setNotifAnchor(null);
  };

  const handleNotificationClick = async (notif: Notification) => {
    if (!notif.is_read) {
      try {
        await client.post(`/notifications/${notif.id}/read/`);
        fetchNotifications();
      } catch (e) {
        console.error(e);
      }
    }
    setNotifAnchor(null);
  };

  const handleLogout = async () => {
    handleProfileMenuClose();
    await logout();
    navigate("/");
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
    { text: "Organizations", icon: <BusinessIcon />, path: "/admin/institutions" },
    { text: "Academics", icon: <SchoolIcon />, path: "/admin/academics" },
    { text: "Opportunities", icon: <WorkIcon />, path: "/admin/opportunities" },
    { text: "MoUs", icon: <DescriptionIcon />, path: "/admin/mous" },
    { text: "Users", icon: <PeopleIcon />, path: "/admin/users" },
    { text: "Audit Logs", icon: <AuditIcon />, path: "/admin/audit-logs" },
    { text: "Settings", icon: <SettingsIcon />, path: "/admin/settings" },
  ];

  const sidebarContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", backgroundColor: "#003014", color: "#ffffff" }}>
      {/* Branding Area */}
      <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 1.5, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            backgroundColor: "#ffffff",
            border: "2px solid #d4af37",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#005028",
            fontWeight: 900,
            fontFamily: "'Outfit', sans-serif",
            fontSize: "1.1rem",
          }}
        >
          KU
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, lineHeight: 1.2, letterSpacing: "0.02em" }}>
            Karatina Uni
          </Typography>
          <Typography variant="caption" sx={{ color: "#d4af37", fontWeight: 600, fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Admin Portal
          </Typography>
        </Box>
      </Box>

      {/* Navigation List */}
      <List sx={{ px: 2, py: 3, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.8 }}>
              <ListItemButton
                component={RouterLink}
                to={item.path}
                onClick={() => isMobile && setMobileOpen(false)}
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  px: 2,
                  backgroundColor: isActive ? "#d4af37" : "transparent",
                  color: isActive ? "#003014" : "rgba(255,255,255,0.8)",
                  "&:hover": {
                    backgroundColor: isActive ? "#d4af37" : "rgba(255,255,255,0.05)",
                    color: isActive ? "#003014" : "#ffffff",
                    "& .MuiListItemIcon-root": {
                      color: isActive ? "#003014" : "#d4af37",
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ color: isActive ? "#003014" : "rgba(255,255,255,0.6)", minWidth: 40, transition: "all 0.2s" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={<Typography sx={{ fontSize: "0.92rem", fontWeight: isActive ? 700 : 500 }}>{item.text}</Typography>} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

      {/* User Info Block */}
      <Box sx={{ p: 2.5, display: "flex", alignItems: "center", gap: 1.5, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <Avatar src={user?.avatar} sx={{ width: 38, height: 38, border: "2px solid #d4af37" }} />
        <Box sx={{ overflow: "hidden" }}>
          <Typography variant="body2" noWrap sx={{ fontWeight: 700 }}>
            {user?.first_name ? `${user.first_name} ${user.last_name || ""}` : user?.username || "Admin User"}
          </Typography>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)", textTransform: "capitalize", display: "block" }}>
            {user?.role?.toLowerCase() || "administrator"}
          </Typography>
        </Box>
        <IconButton onClick={handleLogout} sx={{ color: "rgba(255,255,255,0.5)", ml: "auto", "&:hover": { color: "#ff4d4f" } }}>
          <LogoutIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );

  const unreadNotifs = notifications.filter((n) => !n.is_read).length;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: theme.palette.background.default }}>
        {/* Navigation Bar */}
        <AppBar
          position="fixed"
          sx={{
            width: { lg: `calc(100% - ${drawerWidth}px)` },
            ml: { lg: `${drawerWidth}px` },
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          }}
        >
          <Toolbar sx={{ height: 70, px: { xs: 2, sm: 3 } }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { lg: "none" } }}
            >
              <MenuIcon />
            </IconButton>

            {/* Current Section Title */}
            <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, flexGrow: 1, textTransform: "capitalize" }}>
              {location.pathname.split("/").pop()?.replace("-", " ") || "Admin Dashboard"}
            </Typography>

            {/* Action Buttons */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              {/* Theme Toggle */}
              <IconButton onClick={toggleTheme} color="inherit">
                {mode === "dark" ? <LightMode /> : <DarkMode />}
              </IconButton>

              {/* Notifications Tray */}
              <IconButton color="inherit" onClick={handleNotifMenuOpen}>
                <Badge badgeContent={unreadNotifs} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              {/* Notifications Menu Dropdown */}
              <Menu
                anchorEl={notifAnchorEl}
                open={Boolean(notifAnchorEl)}
                onClose={handleNotifMenuClose}
                slotProps={{
                  paper: {
                    sx: { width: 320, maxHeight: 400, borderRadius: 3, boxShadow: "0 8px 32px rgba(0,0,0,0.1)", p: 0 }
                  }
                }}
              >
                <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${theme.palette.divider}` }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Notifications</Typography>
                  {unreadNotifs > 0 && (
                    <Typography variant="caption" sx={{ color: theme.palette.primary.main, cursor: "pointer", fontWeight: 600 }} onClick={handleMarkAllRead}>
                      Mark all as read
                    </Typography>
                  )}
                </Box>
                <Box sx={{ overflowY: "auto", maxHeight: 300 }}>
                  {loadingNotifs && (
                    <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}><CircularProgress size={24} /></Box>
                  )}
                  {!loadingNotifs && notifications.length === 0 && (
                    <Box sx={{ p: 4, textAlign: "center" }}><Typography variant="body2" sx={{ color: "text.secondary" }}>No notifications found</Typography></Box>
                  )}
                  {notifications.map((n) => (
                    <MenuItem
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      sx={{
                        py: 1.5,
                        px: 2,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        backgroundColor: n.is_read ? "transparent" : "rgba(0, 80, 40, 0.03)",
                        whiteSpace: "normal",
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: n.is_read ? 500 : 700, fontSize: "0.85rem" }}>
                        {n.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.78rem", mt: 0.5 }}>
                        {n.message}
                      </Typography>
                    </MenuItem>
                  ))}
                </Box>
              </Menu>

              {/* User Dropdown Profile Avatar */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 1 }}>
                <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0 }}>
                  <Avatar src={user?.avatar} sx={{ width: 40, height: 40, border: `2px solid ${theme.palette.primary.main}` }} />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleProfileMenuClose}
                  slotProps={{ paper: { sx: { width: 180, borderRadius: 2, mt: 1.5 } } }}
                >
                  <MenuItem component={RouterLink} to="/" onClick={handleProfileMenuClose}>
                    <ProfileIcon sx={{ mr: 1.5, fontSize: 18 }} /> Public Website
                  </MenuItem>
                  <MenuItem onClick={handleLogout} sx={{ color: "#ff4d4f" }}>
                    <LogoutIcon sx={{ mr: 1.5, fontSize: 18 }} /> Logout
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Sidebar Container */}
        <Box component="nav" sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}>
          {/* Mobile sidebar drawer */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "block", lg: "none" },
              "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth, border: "none", backgroundColor: "#003014", color: "#ffffff" },
            }}
          >
            {sidebarContent}
          </Drawer>

          {/* Desktop permanent sidebar */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", lg: "block" },
              "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth, border: "none", backgroundColor: "#003014", color: "#ffffff" },
            }}
            open
          >
            {sidebarContent}
          </Drawer>
        </Box>

        {/* Main Work Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2.5, md: 4 },
            width: { lg: `calc(100% - ${drawerWidth}px)` },
            mt: "70px",
            minHeight: "calc(100vh - 70px)",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
};
export default AdminLayout;
