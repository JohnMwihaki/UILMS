import React from "react";
import { Box, Container, Typography, Link, IconButton, Divider, Stack } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Facebook, Twitter, LinkedIn, Instagram, Email, Phone, Room } from "@mui/icons-material";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      sx={{
        background: "linear-gradient(180deg, #003014 0%, #001a0a 100%)",
        color: "#ffffff",
        pt: 8,
        pb: 4,
        mt: "auto",
        borderTop: "4px solid #d4af37",
      }}
    >
      <Container maxWidth="lg">
        {/* Main Footer columns utilizing Flexbox Wrap layout (No Grids) */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            flexWrap: "wrap",
            gap: 4,
            justifyContent: "space-between",
          }}
        >
          {/* Column 1: Brand & Description */}
          <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 350px" }, maxWidth: { md: 400 } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
              <Box
                component="img"
                src="/logo.png"
                alt="Karatina University Logo"
                sx={{
                  width: 50,
                  height: 50,
                  objectFit: "contain",
                  backgroundColor: "#ffffff",
                  borderRadius: "50%",
                  p: 0.5,
                  border: "2px solid #d4af37",
                }}
              />
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 800,
                    fontSize: "1.2rem",
                    lineHeight: 1.1,
                    letterSpacing: "0.03em",
                    color: "#ffffff",
                  }}
                >
                  KARATINA UNIVERSITY
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#d4af37",
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  Inspiring Innovation and Leadership
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", mb: 3, lineHeight: 1.6 }}>
              The University Industry Linkage Management System (UILMS) coordinates high-impact partnerships, student internships, research sponsorships, and dual academic collaborations between Karatina University and industry leaders worldwide.
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton href="https://facebook.com" target="_blank" sx={{ color: "#ffffff", backgroundColor: "rgba(255,255,255,0.08)", "&:hover": { backgroundColor: "#d4af37" } }}>
                <Facebook fontSize="small" />
              </IconButton>
              <IconButton href="https://twitter.com" target="_blank" sx={{ color: "#ffffff", backgroundColor: "rgba(255,255,255,0.08)", "&:hover": { backgroundColor: "#d4af37" } }}>
                <Twitter fontSize="small" />
              </IconButton>
              <IconButton href="https://linkedin.com" target="_blank" sx={{ color: "#ffffff", backgroundColor: "rgba(255,255,255,0.08)", "&:hover": { backgroundColor: "#d4af37" } }}>
                <LinkedIn fontSize="small" />
              </IconButton>
              <IconButton href="https://instagram.com" target="_blank" sx={{ color: "#ffffff", backgroundColor: "rgba(255,255,255,0.08)", "&:hover": { backgroundColor: "#d4af37" } }}>
                <Instagram fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {/* Column 2: Quick Links */}
          <Box sx={{ flex: { xs: "1 1 calc(50% - 16px)", sm: "1 1 200px" } }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, mb: 3, borderBottom: "2px solid #d4af37", pb: 1, display: "inline-block" }}
            >
              Quick Links
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Link component={RouterLink} to="/" sx={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", "&:hover": { color: "#d4af37", pl: 0.5 }, transition: "all 0.2s" }}>
                Home Page
              </Link>
              <Link component={RouterLink} to="/institutions" sx={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", "&:hover": { color: "#d4af37", pl: 0.5 }, transition: "all 0.2s" }}>
                Institutions
              </Link>
              <Link component={RouterLink} to="/opportunities" sx={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", "&:hover": { color: "#d4af37", pl: 0.5 }, transition: "all 0.2s" }}>
                Opportunities
              </Link>
              <Link component={RouterLink} to="/announcements" sx={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", "&:hover": { color: "#d4af37", pl: 0.5 }, transition: "all 0.2s" }}>
                Research & Funding
              </Link>
              <Link component={RouterLink} to="/contact" sx={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", "&:hover": { color: "#d4af37", pl: 0.5 }, transition: "all 0.2s" }}>
                Contact
              </Link>
            </Box>
          </Box>

          {/* Column 3: Resources */}
          <Box sx={{ flex: { xs: "1 1 calc(50% - 16px)", sm: "1 1 200px" } }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, mb: 3, borderBottom: "2px solid #d4af37", pb: 1, display: "inline-block" }}
            >
              Resources
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Link component={RouterLink} to="/announcements" sx={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", "&:hover": { color: "#d4af37", pl: 0.5 }, transition: "all 0.2s" }}>
                Documents
              </Link>
              <Link component={RouterLink} to="/announcements" sx={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", "&:hover": { color: "#d4af37", pl: 0.5 }, transition: "all 0.2s" }}>
                Reports
              </Link>
              <Link component={RouterLink} to="/" sx={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", "&:hover": { color: "#d4af37", pl: 0.5 }, transition: "all 0.2s" }}>
                Policies
              </Link>
              <Link component={RouterLink} to="/" sx={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", "&:hover": { color: "#d4af37", pl: 0.5 }, transition: "all 0.2s" }}>
                Guidelines
              </Link>
              <Link component={RouterLink} to="/contact" sx={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", "&:hover": { color: "#d4af37", pl: 0.5 }, transition: "all 0.2s" }}>
                FAQ
              </Link>
            </Box>
          </Box>

          {/* Column 4: Contact Information */}
          <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 260px" }, maxWidth: { sm: 300 } }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, mb: 3, borderBottom: "2px solid #d4af37", pb: 1, display: "inline-block" }}
            >
              Contact Us
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                <Room sx={{ color: "#d4af37", mt: 0.3 }} fontSize="small" />
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                  Department of Industry Linkages,<br />
                  Main Campus, Karatina, Kenya<br />
                  P.O. Box 1957-10101, Karatina
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                <Phone sx={{ color: "#d4af37" }} fontSize="small" />
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                  +254 718 000000
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                <Email sx={{ color: "#d4af37" }} fontSize="small" />
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                  industrylinkages@karu.ac.ke
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Box>

        <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.1)" }} />

        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)" }}>
            © {currentYear} Karatina University. All rights reserved.
          </Typography>
          <Box sx={{ display: "flex", gap: 3 }}>
            <Link href="#" sx={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", "&:hover": { color: "#ffffff" } }}>
              Privacy Policy
            </Link>
            <Link href="#" sx={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", "&:hover": { color: "#ffffff" } }}>
              Terms of Use
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
export default Footer;
