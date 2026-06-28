import { createTheme } from "@mui/material/styles";

export const getTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: "#004d40", // Karatina University Deep Forest Green
        light: "#00796b",
        dark: "#00251a",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#10b981", // Emerald green for tags/success
        light: "#34d399",
        dark: "#047857",
        contrastText: "#ffffff",
      },
      background: {
        default: mode === "light" ? "#f4f6f5" : "#0d0e12",
        paper: mode === "light" ? "#ffffff" : "#13141c",
      },
      text: {
        primary: mode === "light" ? "#1e293b" : "#f1f5f9",
        secondary: mode === "light" ? "#475569" : "#9ca3af",
      },
      divider: mode === "light" ? "#e2e8f0" : "#1e293b",
    },
    typography: {
      fontFamily: "'Outfit', 'Inter', 'Roboto', 'sans-serif'",
      h1: {
        fontWeight: 800,
        letterSpacing: "-0.03em",
      },
      h2: {
        fontWeight: 700,
        letterSpacing: "-0.02em",
      },
      h3: {
        fontWeight: 700,
        letterSpacing: "-0.02em",
      },
      h4: {
        fontWeight: 600,
        letterSpacing: "-0.01em",
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
      button: {
        textTransform: "none",
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: ({ ownerState }: { ownerState: any }) => ({
            borderRadius: 8,
            padding: "8px 16px",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px rgba(0, 77, 64, 0.2)",
            },
            ...(ownerState.variant === "contained" &&
              ownerState.color === "primary" && {
                backgroundColor: "#004d40",
                backgroundImage: "linear-gradient(135deg, #004d40 0%, #00251a 100%)",
                color: "#ffffff",
                "&:hover": {
                  backgroundColor: "#005a4a",
                  backgroundImage: "linear-gradient(135deg, #006050 0%, #00352a 100%)",
                },
              }),
          }),
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            backgroundImage: "none",
            boxShadow:
              mode === "light"
                ? "0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)"
                : "0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)",
            border: mode === "light" ? "1px solid #f1f5f9" : "1px solid #1e293b",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "light" ? "#004d40" : "#13141c",
            color: "#ffffff",
            boxShadow: "none",
          },
        },
      },
    },
  });
