import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Avatar,
  CircularProgress,
  Pagination,
  Breadcrumbs,
  Link,
  Chip,
} from "@mui/material";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import { Search, Room, Business, Star } from "@mui/icons-material";
import client from "../../apis/client";
import type { Institution, InstitutionCategory, Department } from "../../types";

export const BrowseInstitutions: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter form states
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [county, setCounty] = useState(searchParams.get("county") || "");
  const [department, setDepartment] = useState(searchParams.get("department") || "");

  // Metadata states
  const [categories, setCategories] = useState<InstitutionCategory[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [counties, setCounties] = useState<string[]>([]);

  // Results states
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setPages] = useState(1);

  // Sync state with query parameters on URL changes
  useEffect(() => {
    setSearch(searchParams.get("q") || "");
    setCategory(searchParams.get("category") || "");
    setCounty(searchParams.get("county") || "");
    setDepartment(searchParams.get("department") || "");
  }, [searchParams]);

  // Load filter metadata options (Categories, Departments, and Counties)
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const catRes = await client.get("/organizations/categories/");
        setCategories(catRes.data.data || []);

        const deptRes = await client.get("/academics/departments/");
        setDepartments(deptRes.data.data || []);

        // Hardcoded counties list matching seed script/Kenya counties
        setCounties([
          "Nairobi", "Karatina", "Nyeri", "Kiambu", "Mombasa", "Kisumu", "Nakuru", "Uasin Gishu"
        ]);
      } catch (e) {
        console.error("Error loading filter metadata options:", e);
      }
    };
    fetchMetadata();
  }, []);

  // Fetch institutions list based on current filters and pagination parameters
  const fetchInstitutions = async () => {
    setLoading(true);
    try {
      const params: any = {};
      
      const q = searchParams.get("q");
      if (q) params.q = q;

      const cat = searchParams.get("category");
      if (cat) params.category = cat;

      const co = searchParams.get("county");
      if (co) params.county = co;

      const dept = searchParams.get("department");
      if (dept) params.department = dept;

      // Use the unified search endpoint
      const res = await client.get("/search/", { params });
      let data: Institution[] = res.data.data || [];

      // Manual sorting if needed
      if (sortBy === "name") {
        data = [...data].sort((a, b) => a.name.localeCompare(b.name));
      } else {
        data = [...data].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }

      setInstitutions(data);
      setPages(Math.max(1, Math.ceil(data.length / 10)));
    } catch (e) {
      console.error("Error loading institutions:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstitutions();
  }, [searchParams, sortBy]);

  const handleApplyFilters = () => {
    const newParams: any = {};
    if (search.trim()) newParams.q = search;
    if (category) newParams.category = category;
    if (county) newParams.county = county;
    if (department) newParams.department = department;

    setSearchParams(newParams);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch("");
    setCategory("");
    setCounty("");
    setDepartment("");
    setSearchParams({});
    setPage(1);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const paginatedInstitutions = institutions.slice((page - 1) * 10, page * 10);

  return (
    <Box sx={{ py: 5, backgroundColor: "background.default" }}>
      <Container maxWidth="lg">
        {/* Breadcrumbs Navigation */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
          <Link component={RouterLink} color="inherit" to="/" sx={{ textDecoration: "none" }}>
            Home
          </Link>
          <Typography color="text.primary" sx={{ fontWeight: 700 }}>
            Institutions
          </Typography>
        </Breadcrumbs>

        {/* Header Title Banner */}
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
            Our Industry Partners
          </Typography>
          <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.85)", fontWeight: 400 }}>
            Explore our vast network of top industry collaborators, organizations, and research institutions.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Left Panel Sidebar Filters */}
          <Grid size={{ xs: 12, md: 3.5 }}>
            <Card sx={{ p: 1.5, position: "sticky", top: 100 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, mb: 3, color: "primary.main" }}>
                  Filters
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 3.2 }}>
                  {/* Search Input */}
                  <TextField
                    fullWidth
                    label="Search Name / Details"
                    placeholder="Enter keywords..."
                    size="small"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    slotProps={{
                      input: {
                        startAdornment: <Search sx={{ color: "text.secondary", mr: 1, fontSize: 20 }} />,
                      },
                    }}
                  />

                  {/* Category Filter */}
                  <FormControl fullWidth size="small">
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={category}
                      label="Category"
                      onChange={(e) => setCategory(e.target.value as string)}
                    >
                      <MenuItem value=""><em>All Categories</em></MenuItem>
                      {categories.map((c) => (
                        <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* County Filter */}
                  <FormControl fullWidth size="small">
                    <InputLabel>County</InputLabel>
                    <Select
                      value={county}
                      label="County"
                      onChange={(e) => setCounty(e.target.value as string)}
                    >
                      <MenuItem value=""><em>All Counties</em></MenuItem>
                      {counties.map((co) => (
                        <MenuItem key={co} value={co}>{co}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Department Filter */}
                  <FormControl fullWidth size="small">
                    <InputLabel>Department</InputLabel>
                    <Select
                      value={department}
                      label="Department"
                      onChange={(e) => setDepartment(e.target.value as string)}
                    >
                      <MenuItem value=""><em>All Departments</em></MenuItem>
                      {departments.map((dept) => (
                        <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Filter Submission Actions */}
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 1 }}>
                    <Button
                      variant="contained"
                      onClick={handleApplyFilters}
                      fullWidth
                      sx={{ py: 1.2, fontWeight: 700 }}
                    >
                      Apply Filters
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleResetFilters}
                      fullWidth
                      sx={{ py: 1.2, borderColor: "#005028", color: "#005028" }}
                    >
                      Reset Filters
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Panel Listings */}
          <Grid size={{ xs: 12, md: 8.5 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3.5 }}>
              <Typography variant="body1" sx={{ fontWeight: 700, color: "text.primary" }}>
                {institutions.length} Institutions Found
              </Typography>
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value as string)}
                >
                  <MenuItem value="newest">Newest</MenuItem>
                  <MenuItem value="name">Name (A-Z)</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}><CircularProgress /></Box>
            ) : institutions.length === 0 ? (
              <Card sx={{ p: 5, textAlign: "center" }}>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1, fontWeight: 700 }}>
                  No Partners Match Your Search
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Try updating your keyword search criteria or resetting filters.
                </Typography>
                <Button variant="contained" onClick={handleResetFilters}>
                  Clear All Filters
                </Button>
              </Card>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {paginatedInstitutions.map((inst) => (
                  <Card
                    key={inst.id}
                    sx={{
                      p: 1.5,
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                      },
                    }}
                  >
                    <CardContent sx={{ display: "flex", flexWrap: { xs: "wrap", sm: "nowrap" }, gap: 3, alignItems: "center", p: "20px !important" }}>
                      {/* Avatar */}
                      <Avatar
                        src={inst.logo}
                        sx={{
                          width: 64,
                          height: 64,
                          fontSize: "1.4rem",
                          fontWeight: 800,
                          bgcolor: inst.status === "STRATEGIC" ? "primary.main" : "secondary.main",
                          color: "#ffffff",
                          border: "2px solid rgba(255,255,255,0.2)",
                        }}
                      >
                        {getInitials(inst.name)}
                      </Avatar>

                      {/* Info details */}
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap", mb: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>
                            {inst.name}
                          </Typography>
                          <Chip label={inst.custom_id} size="small" sx={{ fontWeight: 800, bgcolor: "rgba(0,80,40,0.05)", color: "primary.main" }} />
                          {inst.status === "STRATEGIC" && (
                            <Chip icon={<Star sx={{ fontSize: "14px !important", color: "#d4af37 !important" }} />} label="Strategic" size="small" sx={{ fontWeight: 700, bgcolor: "rgba(212,175,55,0.1)", color: "#9e7a15" }} />
                          )}
                        </Box>

                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2.5, mb: 1.5 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary" }}>
                            <Business fontSize="inherit" />
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>
                              {typeof inst.category === "object" ? inst.category.name : "Corporate"}
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary" }}>
                            <Room fontSize="inherit" />
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>{inst.county}, Kenya</Typography>
                          </Box>
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.5 }}>
                          {inst.description || "Leading industry institution collaborating with Karatina University across multiple professional focus channels and initiatives."}
                        </Typography>
                      </Box>

                      {/* View Profile Action */}
                      <Box sx={{ ml: { xs: 0, sm: "auto" }, width: { xs: "100%", sm: "auto" }, textAlign: "right" }}>
                        <Button
                          component={RouterLink}
                          to={`/institutions/${inst.id}`}
                          variant="contained"
                          sx={{
                            borderRadius: 2,
                            fontWeight: 700,
                            whiteSpace: "nowrap",
                            width: { xs: "100%", sm: "auto" },
                          }}
                        >
                          View Profile
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                ))}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={(_, value) => setPage(value)}
                      color="primary"
                    />
                  </Box>
                )}
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
export default BrowseInstitutions;
