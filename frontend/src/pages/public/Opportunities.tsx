import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Breadcrumbs,
  Link,
} from "@mui/material";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import { Search, CalendarToday, People, AttachMoney } from "@mui/icons-material";
import client from "../../apis/client";
import type { Opportunity } from "../../types";

export const Opportunities: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [type, setType] = useState(searchParams.get("type") || "");

  // Modal Detail state
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const params: any = {};
      const q = searchParams.get("q");
      if (q) params.q = q;

      const t = searchParams.get("type");
      if (t) params.type = t;

      const res = await client.get("/opportunities/", { params });
      setOpportunities(res.data.data || []);
    } catch (e) {
      console.error("Error loading opportunities", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, [searchParams]);

  const handleApplyFilters = () => {
    const params: any = {};
    if (search.trim()) params.q = search;
    if (type) params.type = type;
    setSearchParams(params);
  };

  const handleResetFilters = () => {
    setSearch("");
    setType("");
    setSearchParams({});
  };

  const handleOpenDetails = (opp: Opportunity) => {
    setSelectedOpp(opp);
  };

  const handleCloseDetails = () => {
    setSelectedOpp(null);
  };

  const getDeadlineDiff = (deadlineStr?: string) => {
    if (!deadlineStr) return null;
    const diff = new Date(deadlineStr).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <Box sx={{ py: 5, backgroundColor: "background.default" }}>
      <Container maxWidth="lg">
        {/* Breadcrumbs */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
          <Link component={RouterLink} color="inherit" to="/" sx={{ textDecoration: "none" }}>
            Home
          </Link>
          <Typography color="text.primary" sx={{ fontWeight: 700 }}>
            Opportunities
          </Typography>
        </Breadcrumbs>

        {/* Title Banner */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #005028 0%, #003014 100%)",
            color: "#ffffff",
            p: { xs: 4, md: 5 },
            borderRadius: 4,
            mb: 5,
            boxShadow: "0 6px 20px rgba(0, 80, 40, 0.15)",
          }}
        >
          <Typography variant="h3" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, mb: 1.5 }}>
            Linkage Opportunities
          </Typography>
          <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.85)", fontWeight: 400 }}>
            Discover internships, student attachments, research collaborations, and funding opportunities.
          </Typography>
        </Box>

        {/* Search & Filter Bar */}
        <Card sx={{ p: 2, mb: 4 }}>
          <Grid container spacing={2} sx={{ alignItems: "center" }}>
            <Grid size={{ xs: 12, sm: 5 }}>
              <TextField
                fullWidth
                label="Search Keywords"
                placeholder="Job title, requirements, etc..."
                size="small"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: <Search sx={{ color: "text.secondary", mr: 1 }} />,
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Opportunity Type</InputLabel>
                <Select
                  value={type}
                  label="Opportunity Type"
                  onChange={(e) => setType(e.target.value as string)}
                >
                  <MenuItem value=""><em>All Types</em></MenuItem>
                  <MenuItem value="INTERNSHIP">Internships</MenuItem>
                  <MenuItem value="ATTACHMENT">Student Attachments</MenuItem>
                  <MenuItem value="RESEARCH">Research Collaborations</MenuItem>
                  <MenuItem value="FUNDING">Funding Opportunities</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }} sx={{ display: "flex", gap: 1.5 }}>
              <Button variant="contained" onClick={handleApplyFilters} fullWidth sx={{ py: 1 }}>
                Apply
              </Button>
              <Button variant="outlined" onClick={handleResetFilters} fullWidth sx={{ py: 1, borderColor: "primary.main" }}>
                Reset
              </Button>
            </Grid>
          </Grid>
        </Card>

        {/* Listings */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}><CircularProgress /></Box>
        ) : opportunities.length === 0 ? (
          <Card sx={{ p: 5, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary">
              No opportunities found matching your criteria.
            </Typography>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {opportunities.map((opp) => {
              const daysLeft = getDeadlineDiff(opp.application_deadline);
              return (
                <Grid size={{ xs: 12 }} key={opp.id}>
                  <Card
                    sx={{
                      p: 1.5,
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                      },
                    }}
                  >
                    <CardContent sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 3, p: "20px !important" }}>
                      <Box sx={{ flexGrow: 1, minWidth: 280 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5, flexWrap: "wrap" }}>
                          <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>
                            {opp.title}
                          </Typography>
                          <Chip label={opp.type} size="small" sx={{ fontWeight: 800, bgcolor: "rgba(0,80,40,0.05)", color: "primary.main" }} />
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary", mb: 1 }}>
                          Partner: {opp.institution_details?.name || "Corporate Partner"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.5 }}>
                          {opp.description}
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2, alignItems: { xs: "flex-start", sm: "flex-end" } }}>
                        {daysLeft !== null && (
                          <Chip
                              label={daysLeft > 0 ? `${daysLeft} days left` : "Expired"}
                              color={daysLeft > 0 ? (daysLeft <= 7 ? "error" : "success") : "default"}
                              size="small"
                              sx={{ fontWeight: 800 }}
                          />
                        )}
                        <Button variant="outlined" size="small" onClick={() => handleOpenDetails(opp)} sx={{ mt: 1, fontWeight: 700 }}>
                          View Details
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        {/* Opportunity Detail Dialog */}
        <Dialog open={Boolean(selectedOpp)} onClose={handleCloseDetails} maxWidth="md" fullWidth>
          {selectedOpp && (
            <>
              <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 3 }}>
                <Box>
                  <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>
                    {selectedOpp.title}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ color: "primary.main", fontWeight: 700, mt: 0.5 }}>
                    {selectedOpp.institution_details?.name}
                  </Typography>
                </Box>
                <Chip label={selectedOpp.type} size="small" color="primary" sx={{ fontWeight: 800 }} />
              </DialogTitle>
              <DialogContent dividers sx={{ p: 3 }}>
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CalendarToday sx={{ color: "text.secondary" }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>Deadline</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {selectedOpp.application_deadline ? new Date(selectedOpp.application_deadline).toLocaleDateString() : "No Deadline"}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <People sx={{ color: "text.secondary" }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>Slots Available</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedOpp.slots}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  {selectedOpp.funding_amount && (
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <AttachMoney sx={{ color: "text.secondary" }} />
                        <Box>
                          <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>Funding/Grant</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>KES {selectedOpp.funding_amount}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                  )}
                </Grid>

                <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1, color: "primary.main" }}>Description</Typography>
                <Typography variant="body1" sx={{ color: "text.secondary", mb: 3, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                  {selectedOpp.description}
                </Typography>

                {selectedOpp.requirements && (
                  <>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1, color: "primary.main" }}>Requirements</Typography>
                    <Typography variant="body1" sx={{ color: "text.secondary", mb: 3, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                      {selectedOpp.requirements}
                    </Typography>
                  </>
                )}

                <Divider sx={{ my: 3 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1, color: "secondary.main" }}>How to Apply</Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                  To apply for this opportunity, please make sure you coordinate with the department linkage officer or university liaison desk. Direct inquiries may also be made to the respective partner liaison contact info listed under the organization's profile page. Please reference the opportunity ID: <strong>KU-OPP-{selectedOpp.id}</strong> in all correspondence.
                </Typography>
              </DialogContent>
              <DialogActions sx={{ p: 3 }}>
                <Button onClick={handleCloseDetails} sx={{ fontWeight: 700 }}>Close</Button>
                <Button variant="contained" component={RouterLink} to={`/institutions/${selectedOpp.institution}`} sx={{ fontWeight: 700 }}>
                  View Company Profile
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </Box>
  );
};
export default Opportunities;
