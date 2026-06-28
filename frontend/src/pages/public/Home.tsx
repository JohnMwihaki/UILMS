import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Avatar,
  Paper,
  CircularProgress,
  Stack,
  Divider,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Search,
  Business,
  Work,
  Science,
  AttachMoney,
  Description,
  ArrowForward,
  FormatQuote,
  CheckCircle,
} from "@mui/icons-material";
import client from "../../apis/client";
import type { Institution } from "../../types";

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    partners: 65,
    opportunities: 180,
    research: 45,
    funding: 24,
    documents: 95,
  });
  const [popularPartners, setPopularPartners] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      try {
        // Load popular institutions
        const res = await client.get("/search/");
        const data = res.data.data || [];
        setPopularPartners(data.slice(0, 6)); // take first 6 as popular

        if (data.length > 0) {
          setStats((prev) => ({
            ...prev,
            partners: data.length,
          }));
        }
      } catch (e) {
        console.error("Error loading home page data", e);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/institutions?q=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate("/institutions");
    }
  };

  const statCards = [
    { label: "Industries", count: stats.partners, desc: "Active Partners", icon: <Business sx={{ fontSize: 24 }} />, path: "/institutions", color: "#004d40" },
    { label: "Internships", count: stats.opportunities, desc: "Available Positions", icon: <Work sx={{ fontSize: 24 }} />, path: "/opportunities?type=INTERNSHIP", color: "#10b981" },
    { label: "Research", count: stats.research, desc: "Joint Collaborations", icon: <Science sx={{ fontSize: 24 }} />, path: "/opportunities?type=RESEARCH", color: "#d4af37" },
    { label: "Funding", count: stats.funding, desc: "Sponsored Projects", icon: <AttachMoney sx={{ fontSize: 24 }} />, path: "/opportunities?type=FUNDING", color: "#f59e0b" },
    { label: "Attachments", count: stats.documents, desc: "Student Placements", icon: <Description sx={{ fontSize: 24 }} />, path: "/opportunities?type=ATTACHMENT", color: "#3b82f6" },
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const testimonials = [
    {
      quote: "Through the Karatina UILMS portal, we established a strategic partnership that has allowed over 15 computer science students to join our cloud engineering internship tracks this year alone.",
      author: "Dr. Evans Kimani",
      role: "Director of Talent & Linkages, Safaricom PLC",
      avatarBg: "#10b981",
    },
    {
      quote: "Coordinating student attachments used to take weeks of paperwork. Now, with the online MoU database and immediate linkage communication, the turnaround is just a matter of hours.",
      author: "Prof. Grace Wambui",
      role: "Dean, School of Pure & Applied Sciences, Karatina University",
      avatarBg: "#004d40",
    },
    {
      quote: "My attachment placement at KEMRI was fully coordinated through this portal. The experience bridged my biochemistry class theories with real-world clinical trial applications.",
      author: "Julius Omondi",
      role: "BSc. Biochemistry Student / Alumnus",
      avatarBg: "#d4af37",
    },
  ];

  return (
    <Box sx={{ width: "100%", overflowX: "hidden" }}>
      {/* Scenic Hero Banner Section */}
      <Paper
        sx={{
          position: "relative",
          backgroundColor: "#00251a",
          color: "#fff",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundImage: "linear-gradient(rgba(0, 48, 20, 0.85), rgba(0, 20, 5, 0.9)), url('/karu3.jfif')",
          py: { xs: 8, md: 14 },
          borderRadius: 0,
          boxShadow: "none",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", flexDirection: "column", maxWidth: { xs: "100%", md: 800 } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
              <Box
                component="img"
                src="/logo.png"
                alt="KU Logo"
                sx={{ width: 60, height: 60, objectFit: "contain" }}
              />
              <Typography
                variant="subtitle1"
                sx={{
                  color: "#d4af37",
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  fontSize: { xs: "0.8rem", sm: "1rem" },
                }}
              >
                Karatina University Industry Linkage
              </Typography>
            </Box>

            <Typography
              variant="h1"
              sx={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 900,
                lineHeight: 1.15,
                mb: 3,
                fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.2rem" },
                color: "#ffffff",
                textShadow: "0 2px 10px rgba(0,0,0,0.3)",
              }}
            >
              Bridging Rigorous Academia with Dynamic Industry
            </Typography>

            <Typography
              variant="h6"
              sx={{
                mb: 5,
                color: "rgba(255,255,255,0.9)",
                fontWeight: 400,
                lineHeight: 1.6,
                fontSize: { xs: "1rem", md: "1.25rem" },
                maxWidth: 680,
              }}
            >
              Unlock access to world-class corporate partners, joint research grants, student attachments, and cutting-edge internships designed to inspire innovation and leadership.
            </Typography>

            {/* Global Search Bar */}
            <Box
              component="form"
              onSubmit={handleSearch}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                backgroundColor: "#ffffff",
                borderRadius: { xs: 2, sm: 4 },
                p: 1,
                boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
                maxWidth: 640,
                width: "100%",
                gap: 1,
              }}
            >
              <TextField
                fullWidth
                placeholder="Search industries, research collaborations, internships..."
                variant="standard"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                slotProps={{
                  input: {
                    disableUnderline: true,
                    startAdornment: <Search sx={{ color: "text.secondary", mr: 1.5, ml: 1 }} />,
                    sx: { color: "#111827", px: 1, height: 48 },
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "#004d40",
                  color: "#fff",
                  px: 4,
                  py: { xs: 1.5, sm: 0 },
                  borderRadius: { xs: 1.5, sm: 3 },
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 700,
                  fontSize: "1rem",
                  "&:hover": {
                    backgroundColor: "#00251a",
                    backgroundImage: "none",
                  },
                  height: { sm: 48 },
                  minWidth: 120,
                }}
              >
                Search
              </Button>
            </Box>
          </Box>
        </Container>
      </Paper>

      {/* KPI Stats Section (Grid replaced with Flex Box) */}
      <Container maxWidth="lg" sx={{ mt: -6, position: "relative", zIndex: 10, mb: 10 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 2.5,
            justifyContent: "center",
          }}
        >
          {statCards.map((stat, i) => (
            <Card
              key={i}
              component={RouterLink}
              to={stat.path}
              sx={{
                flex: { xs: "1 1 calc(50% - 12px)", sm: "1 1 calc(33.3% - 18px)", md: "1 1 calc(20% - 20px)" },
                minWidth: 160,
                textDecoration: "none",
                backgroundColor: "background.paper",
                textAlign: "center",
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: `0 16px 30px rgba(0, 77, 64, 0.12)`,
                  borderColor: stat.color,
                },
              }}
            >
              <CardContent sx={{ py: 4, px: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Avatar
                  sx={{
                    bgcolor: "rgba(0, 77, 64, 0.05)",
                    color: stat.color,
                    mb: 2,
                    width: 52,
                    height: 52,
                  }}
                >
                  {stat.icon}
                </Avatar>
                <Typography variant="h3" sx={{ fontWeight: 800, color: "text.primary", mb: 0.5, fontFamily: "'Outfit', sans-serif" }}>
                  {stat.count}+
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "text.primary" }}>
                  {stat.label}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mt: 0.5 }}>
                  {stat.desc}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      {/* About Section: Vision, Mission & Values (Grid replaced with Flex Columns) */}
      <Box sx={{ py: 10, backgroundColor: "background.paper", borderBottom: "1px solid", borderColor: "divider" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography
              variant="h3"
              sx={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 900,
                color: "primary.main",
                mb: 2,
              }}
            >
              About Office of Linkages
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: 700, mx: "auto", fontSize: "1.1rem" }}>
              The University-Industry Linkages office acts as the strategic node connecting Karatina University's vibrant intellectual capital with the corporate, industrial, and developmental world.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 4,
              alignItems: "stretch",
            }}
          >
            {/* Mission & Vision Column */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              {/* Vision Card */}
              <Card sx={{ p: 1, height: "100%", borderLeft: "5px solid #d4af37" }}>
                <CardContent>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: "primary.main", mb: 2, fontFamily: "'Outfit', sans-serif" }}>
                    Our Vision
                  </Typography>
                  <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.7, fontSize: "1.05rem" }}>
                    To be a University of global excellence, meeting the dynamic needs and development of society through outstanding academic and collaborative excellence.
                  </Typography>
                </CardContent>
              </Card>

              {/* Mission Card */}
              <Card sx={{ p: 1, height: "100%", borderLeft: "5px solid #004d40" }}>
                <CardContent>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: "primary.main", mb: 2, fontFamily: "'Outfit', sans-serif" }}>
                    Our Mission
                  </Typography>
                  <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.7, fontSize: "1.05rem" }}>
                    To conserve, create, and disseminate knowledge through training, research, innovation, and community outreach for posterity, integrating student industrial exposure at the heart of our curriculum.
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            {/* Core Values Column */}
            <Card sx={{ flex: 1, p: 1, bgcolor: "rgba(0, 77, 64, 0.02)", border: "1px dashed", borderColor: "primary.main" }}>
              <CardContent sx={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: "primary.main", mb: 3, fontFamily: "'Outfit', sans-serif" }}>
                  Core Institutional Values
                </Typography>
                
                <Stack spacing={2}>
                  {[
                    { title: "Equity", desc: "Equal opportunity, access, and fair treatment for all students and corporate stakeholders." },
                    { title: "Excellence", desc: "Rigorous standards, high performance, and distinction in research, training, and placements." },
                    { title: "Accountability", desc: "Transparency, robust administrative oversight, and fiscal responsibility in all MoUs." },
                    { title: "Academic Freedom", desc: "Nurturing innovation, independent query, and progressive collaboration channels." },
                    { title: "Teamwork & Probity", desc: "Honesty, moral integrity, and deep synergy in joint academia-industry engagements." }
                  ].map((val, idx) => (
                    <Box key={idx} sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                      <CheckCircle sx={{ color: "secondary.main", mt: 0.3, fontSize: 20 }} />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "text.primary" }}>{val.title}</Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>{val.desc}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Box>

      {/* Popular Institutions Section (Grid replaced with Flex Wrap) */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 5, flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Typography variant="h3" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, color: "primary.main" }}>
              Popular Institutions
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", mt: 0.5 }}>
              Explore and coordinate with some of our highest-profile industry partners.
            </Typography>
          </Box>
          <Button
            component={RouterLink}
            to="/institutions"
            endIcon={<ArrowForward />}
            variant="outlined"
            sx={{ fontWeight: 700, borderColor: "primary.main", color: "primary.main" }}
          >
            View All Partners
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}><CircularProgress /></Box>
        ) : popularPartners.length === 0 ? (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center" }}>
            {/* Fallback mockup cards directly aligned with client's Excel institutions */}
            {[
              { name: "Safaricom PLC", cat: "Telecommunications & Technology", county: "Nairobi", status: "STRATEGIC" },
              { name: "Kenya Power", cat: "Energy & Infrastructure", county: "Nairobi", status: "STRATEGIC" },
              { name: "Equity Bank", cat: "Financial Services", county: "Nairobi", status: "STRATEGIC" },
              { name: "Kenyatta National Hospital", cat: "Healthcare & Research", county: "Nairobi", status: "STRATEGIC" },
              { name: "Kenya Airways", cat: "Transport & Logistics", county: "Nairobi", status: "STRATEGIC" },
              { name: "KEMRI", cat: "Medical Research", county: "Nairobi", status: "STRATEGIC" },
            ].map((inst, idx) => (
              <Card
                key={idx}
                sx={{
                  flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 12px)", md: "1 1 calc(33.3% - 16px)" },
                  minWidth: 280,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 3, display: "flex", gap: 2 }}>
                  <Avatar
                    sx={{
                      width: 50,
                      height: 50,
                      bgcolor: idx % 2 === 0 ? "primary.main" : "secondary.main",
                      color: "#fff",
                      fontWeight: 800,
                      fontFamily: "'Outfit', sans-serif",
                    }}
                  >
                    {getInitials(inst.name)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: "'Outfit', sans-serif", mb: 0.5, lineHeight: 1.2 }}>
                      {inst.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.85rem", mb: 1, fontWeight: 500 }}>
                      {inst.cat}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                      {inst.county}, Kenya • {inst.status} Partner
                    </Typography>
                  </Box>
                </CardContent>
                <Box sx={{ p: 2, pt: 0, mt: "auto", display: "flex", justifyContent: "flex-end", borderTop: "1px solid", borderColor: "rgba(0,0,0,0.03)" }}>
                  <Button variant="text" size="small" component={RouterLink} to="/institutions" sx={{ fontWeight: 700 }}>
                    View Profile
                  </Button>
                </Box>
              </Card>
            ))}
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center" }}>
            {popularPartners.map((inst) => (
              <Card
                key={inst.id}
                sx={{
                  flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 12px)", md: "1 1 calc(33.3% - 16px)" },
                  minWidth: 280,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 3, display: "flex", gap: 2 }}>
                  <Avatar
                    src={inst.logo}
                    sx={{
                      width: 50,
                      height: 50,
                      bgcolor: inst.status === "STRATEGIC" ? "primary.main" : "secondary.main",
                      color: "#fff",
                      fontWeight: 800,
                      fontFamily: "'Outfit', sans-serif",
                    }}
                  >
                    {getInitials(inst.name)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: "'Outfit', sans-serif", mb: 0.5, lineHeight: 1.2 }}>
                      {inst.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.85rem", mb: 1 }}>
                      {typeof inst.category === "object" ? inst.category.name : "Industry Partner"}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                      {inst.county}, Kenya • {inst.status} Partner
                    </Typography>
                  </Box>
                </CardContent>
                <Box sx={{ p: 2, pt: 0, mt: "auto", display: "flex", justifyContent: "flex-end" }}>
                  <Button variant="text" size="small" component={RouterLink} to={`/institutions/${inst.id}`} sx={{ fontWeight: 700 }}>
                    View Profile
                  </Button>
                </Box>
              </Card>
            ))}
          </Box>
        )}
      </Container>

      {/* Testimonials Section (Grid replaced with Flex wrap) */}
      <Box sx={{ py: 12, backgroundColor: "background.paper", borderTop: "1px solid", borderColor: "divider" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography
              variant="h3"
              sx={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 900,
                color: "primary.main",
                mb: 2,
              }}
            >
              Linkage Testimonials
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: 680, mx: "auto", fontSize: "1.1rem" }}>
              Hear from our administrators, students, and key corporate leaders who coordinate and participate in the UILMS ecosystems daily.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 3.5,
              justifyContent: "center",
            }}
          >
            {testimonials.map((test, index) => (
              <Card
                key={index}
                sx={{
                  flex: 1,
                  p: 1.5,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  borderRadius: 4,
                  backgroundColor: "background.paper",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
                  transition: "all 0.3s",
                  border: "1px solid",
                  borderColor: "divider",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 16px 35px rgba(0,0,0,0.06)",
                    borderColor: "secondary.main",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <FormatQuote sx={{ color: "secondary.main", fontSize: 40, opacity: 0.3, mb: 1.5 }} />
                  <Typography variant="body1" sx={{ fontStyle: "italic", color: "text.primary", lineHeight: 1.7, mb: 3 }}>
                    "{test.quote}"
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: test.avatarBg, color: "#fff", fontWeight: 700, width: 44, height: 44 }}>
                      {getInitials(test.author)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "text.primary" }}>
                        {test.author}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                        {test.role}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
