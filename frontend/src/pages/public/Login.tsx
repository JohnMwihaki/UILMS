import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Stack,
} from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Visibility, VisibilityOff, ArrowBack } from "@mui/icons-material";
import { useAuthStore } from "../../stores/authStore";
import { client } from "../../apis/client";
import { toast } from "react-toastify";

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const [regData, setRegData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    role: "STUDENT",
    phone_number: "",
  });

  const handleCredChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleRegChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: unknown } }
  ) => {
    setRegData({ ...regData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentials.username || !credentials.password) {
      toast.error("Please enter both username and password.");
      return;
    }

    setSubmitting(true);
    try {
      await login(credentials);
      toast.success("Welcome back! Login successful.");
      navigate("/admin/dashboard");
    } catch (err: any) {
      console.error(err);
      toast.error(err.detail || "Authentication failed. Please verify credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regData.username || !regData.email || !regData.password || !regData.first_name) {
      toast.error("Please fill in all required registration fields.");
      return;
    }

    setSubmitting(true);
    try {
      await client.post("/users/register/", regData);
      toast.success("Registration request submitted successfully! An administrator must approve your account before you can log in.");
      setIsRegister(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Registration failed. Username or email may be taken.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", width: "100%", overflowX: "hidden" }}>
      {/* Left Scenic Campus Banner Panel - Hidden on mobile */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flex: 1.4,
          backgroundImage: "linear-gradient(rgba(0, 48, 20, 0.8), rgba(0, 20, 5, 0.95)), url('/karu1.jfif')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          flexDirection: "column",
          justifyContent: "center",
          p: 8,
          color: "#ffffff",
        }}
      >
        <Box sx={{ maxWidth: 540, mx: "auto" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
            <Box component="img" src="/logo.png" sx={{ width: 64, height: 64, objectFit: "contain", backgroundColor: "#fff", borderRadius: "50%", p: 0.5 }} />
            <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, letterSpacing: "0.02em" }}>
              Karatina University
            </Typography>
          </Box>
          <Typography variant="h2" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, mb: 3, fontSize: { md: "3.2rem" }, lineHeight: 1.15 }}>
            Inspiring Innovation and Leadership
          </Typography>
          <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.85)", fontWeight: 400, lineHeight: 1.6, fontSize: "1.1rem" }}>
            University–Industry Linkage Management System portal designed for secure administrative management of industry partnerships, MoUs, attachments, and student opportunity placements.
          </Typography>
        </Box>
      </Box>

      {/* Right Login/Registration Panel */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: { xs: 3, sm: 6 },
          backgroundColor: "background.default",
          position: "relative",
        }}
      >
        {/* Simplified public header back-to-home navigation button */}
        <Button
          component={RouterLink}
          to="/"
          startIcon={<ArrowBack />}
          sx={{
            position: { xs: "relative", sm: "absolute" },
            top: { xs: "auto", sm: 30 },
            left: { xs: "auto", sm: 24 },
            alignSelf: { xs: "flex-start", sm: "auto" },
            mb: { xs: 4, sm: 0 },
            fontWeight: 700,
            color: "primary.main",
            "&:hover": {
              backgroundColor: "rgba(0, 77, 64, 0.05)",
            },
          }}
        >
          Back to Portal
        </Button>

        <Box sx={{ width: "100%", maxWidth: 440 ,mt: { xs: 6, sm: 0 } }}>
          <Card sx={{ p: 1, boxShadow: "0 15px 35px rgba(0, 40, 20, 0.06)", border: "1px solid", borderColor: "divider" }}>
            <CardContent sx={{ p: { xs: "24px !important", sm: "36px !important" } }}>
              
              {/* Logo displayed on mobile and card head */}
              <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                <Box
                  component="img"
                  src="/logo.png"
                  alt="Karatina University Logo"
                  sx={{ width: 80, height: 80, objectFit: "contain" }}
                />
              </Box>

              {/* Heading */}
              <Box sx={{ textAlign: "center", mb: 4 }}>
                <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: "primary.main", mb: 1 }}>
                  {isRegister ? "Join UILMS" : "Admin Login"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {isRegister ? "Submit details to request account access." : "Sign in to access your administrative workspace."}
                </Typography>
              </Box>

              {/* Login Form */}
              {!isRegister ? (
                <Box component="form" onSubmit={handleLoginSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <TextField
                    fullWidth
                    required
                    label="Username or Email"
                    name="username"
                    value={credentials.username}
                    onChange={handleCredChange}
                    autoComplete="username"
                  />
                  <TextField
                    fullWidth
                    required
                    type={showPassword ? "text" : "password"}
                    label="Password"
                    name="password"
                    value={credentials.password}
                    onChange={handleCredChange}
                    autoComplete="current-password"
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={submitting}
                    sx={{
                      py: 1.5,
                      fontWeight: 700,
                      mt: 1,
                      backgroundColor: "primary.main",
                      color: "primary.contrastText",
                      backgroundImage: "none",
                      "&:hover": {
                        backgroundColor: "primary.dark",
                      },
                    }}
                  >
                    {submitting ? "Signing in..." : "Sign In"}
                  </Button>
                </Box>
              ) : (
                /* Registration Form using Stack for responsive column alignment */
                <Box component="form" onSubmit={handleRegisterSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField
                      fullWidth
                      required
                      label="First Name"
                      name="first_name"
                      value={regData.first_name}
                      onChange={handleRegChange}
                    />
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="last_name"
                      value={regData.last_name}
                      onChange={handleRegChange}
                    />
                  </Stack>
                  <TextField
                    fullWidth
                    required
                    label="Username"
                    name="username"
                    value={regData.username}
                    onChange={handleRegChange}
                  />
                  <TextField
                    fullWidth
                    required
                    type="email"
                    label="Email Address"
                    name="email"
                    value={regData.email}
                    onChange={handleRegChange}
                  />
                  <TextField
                    fullWidth
                    required
                    type={showPassword ? "text" : "password"}
                    label="Password"
                    name="password"
                    value={regData.password}
                    onChange={handleRegChange}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone_number"
                    value={regData.phone_number}
                    onChange={handleRegChange}
                  />
                  <FormControl fullWidth>
                    <InputLabel>Role Type</InputLabel>
                    <Select
                      name="role"
                      value={regData.role}
                      label="Role Type"
                      onChange={handleRegChange}
                    >
                      <MenuItem value="STUDENT">Student</MenuItem>
                      <MenuItem value="LECTURER">Lecturer / Faculty</MenuItem>
                    </Select>
                  </FormControl>

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={submitting}
                    sx={{
                      py: 1.5,
                      fontWeight: 700,
                      mt: 1,
                      backgroundColor: "primary.main",
                      color: "primary.contrastText",
                      backgroundImage: "none",
                      "&:hover": {
                        backgroundColor: "primary.dark",
                      },
                    }}
                  >
                    {submitting ? "Submitting Request..." : "Request Account Approval"}
                  </Button>
                </Box>
              )}

              {/* Toggle Access Request */}
              <Box sx={{ mt: 4, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  {isRegister ? "Already have an approved account?" : "Need to request access?"}{" "}
                  <Button
                    variant="text"
                    onClick={() => {
                      setIsRegister(!isRegister);
                      setShowPassword(false);
                    }}
                    sx={{ fontWeight: 800, color: "primary.main" }}
                  >
                    {isRegister ? "Log In" : "Request Access"}
                  </Button>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
