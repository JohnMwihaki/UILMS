import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Divider,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  Business,
  Work,
  Description,
  Science,
  TrendingUp,
  School,
  People,
  CalendarToday,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import client from "../../apis/client";
import type { DashboardStats } from "../../types";

const COLORS = ["#004d40", "#10b981", "#d4af37", "#3b82f6", "#f59e0b", "#aa3bff"];

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await client.get("/dashboard/summary/");
        setStats(res.data.data);
      } catch (e) {
        console.error("Error loading dashboard stats", e);
        // Load fallback mockup stats if database is unseeded
        setStats({
          summary: {
            total_partners: 120,
            active_mous: 45,
            internships: 120,
            attachments: 150,
            research_collaborations: 80,
            funding_opportunities: 60,
            total_funding_amount: 15000000,
          },
          charts: {
            category_distribution: [
              { name: "Telecommunications", value: 30 },
              { name: "Energy", value: 25 },
              { name: "Banking", value: 20 },
              { name: "Health", value: 15 },
              { name: "Manufacturing", value: 10 },
            ],
            status_distribution: [
              { name: "Strategic Partner", value: 45 },
              { name: "Emerging Partner", value: 35 },
              { name: "Standard Partner", value: 40 },
            ],
            county_distribution: [],
          },
          recent_activities: [
            { id: 1, user: "admin", action: "CREATE", module: "Organizations", details: "New organization Safaricom PLC added", timestamp: new Date(Date.now() - 3600000).toISOString() },
            { id: 2, user: "admin", action: "CREATE", module: "Opportunities", details: "New internship opportunity posted: Software Engineering Intern", timestamp: new Date(Date.now() - 7200000).toISOString() },
            { id: 3, user: "admin", action: "UPDATE", module: "MoUs", details: "Signed MoU renewed with KEMRI", timestamp: new Date(Date.now() - 86400000).toISOString() },
          ],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  const kpis = [
    { label: "Total Institutions", count: stats.summary.total_partners, icon: <Business fontSize="medium" />, color: "#004d40", pct: "+12%" },
    { label: "Internships Listed", count: stats.summary.internships, icon: <Work fontSize="medium" />, color: "#10b981", pct: "+18%" },
    { label: "Attachments listed", count: stats.summary.attachments, icon: <Work fontSize="medium" />, color: "#3b82f6", pct: "+8%" },
    { label: "Research Collaborations", count: stats.summary.research_collaborations, icon: <Science fontSize="medium" />, color: "#d4af37", pct: "+5%" },
    { label: "Funding Opportunities", count: stats.summary.funding_opportunities, icon: <TrendingUp fontSize="medium" />, color: "#f59e0b", pct: "+15%" },
    { label: "Active MoUs", count: stats.summary.active_mous, icon: <Description fontSize="medium" />, color: "#aa3bff", pct: "+12%" },
    { label: "Departments", count: 18, icon: <School fontSize="medium" />, color: "#0d9488", pct: "+5%" },
    { label: "Active Users", count: 25, icon: <People fontSize="medium" />, color: "#6366f1", pct: "+8%" },
  ];

  // Dummy monthly trend data
  const trendData = [
    { month: "Jan", partners: 5, mous: 3 },
    { month: "Feb", partners: 12, mous: 8 },
    { month: "Mar", partners: 18, mous: 14 },
    { month: "Apr", partners: 25, mous: 20 },
    { month: "May", partners: 35, mous: 28 },
    { month: "Jun", partners: 45, mous: 35 },
  ];

  const upcomingDeadlines = [
    { title: "Internship deadline - Safaricom PLC", date: "30 Jun 2026" },
    { title: "Attachment deadline - Equity Bank", date: "15 Jul 2026" },
    { title: "Funding deadline - Kenya Power", date: "28 Jul 2026" },
  ];

  return (
    <Box>
      {/* Upper Grid KPIs */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {kpis.map((kpi, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Card sx={{ borderLeft: `5px solid ${kpi.color}` }}>
              <CardContent sx={{ p: 2.5, display: "flex", alignItems: "center", justifyBlock: "space-between" }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: "block", mb: 0.5, textTransform: "uppercase", letterSpacing: "0.02em" }}>
                    {kpi.label}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>
                    {kpi.count}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#10b981", fontWeight: 700, display: "inline-flex", alignItems: "center", mt: 0.5 }}>
                    {kpi.pct} <span style={{ color: "#6b7280", fontWeight: 500, marginLeft: "4px" }}>vs last month</span>
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: `${kpi.color}15`, color: kpi.color, width: 44, height: 44, ml: "auto" }}>
                  {kpi.icon}
                </Avatar>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts Grid */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        {/* Onboarding Trends Line Chart */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, mb: 3 }}>
                Partnership Onboarding Overview
              </Typography>
              <Box sx={{ width: "100%", height: 320 }}>
                <ResponsiveContainer>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="partners" stroke="#004d40" name="New Partnerships" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="mous" stroke="#10b981" name="MoUs Signed" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Categories Pie Chart */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, mb: 3 }}>
                Top Onboarded Categories
              </Typography>
              <Box sx={{ width: "100%", height: 320, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={stats.charts.category_distribution}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {stats.charts.category_distribution.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                {/* Labels legend */}
                <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 1.5, mt: 1 }}>
                  {stats.charts.category_distribution.map((entry, index) => (
                    <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: COLORS[index % COLORS.length] }} />
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>{entry.name} ({entry.value}%)</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Lower Details - Lists */}
      <Grid container spacing={4}>
        {/* Recent Activities */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, mb: 2 }}>
                Recent Activities
              </Typography>
              <List sx={{ p: 0 }}>
                {stats.recent_activities.slice(0, 4).map((activity) => (
                  <Box key={activity.id}>
                    <ListItem sx={{ py: 1.8, px: 0 }}>
                      <ListItemText
                        primary={<Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>{activity.details}</Typography>}
                        secondary={<Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>{`${activity.user} • ${activity.module} • ${new Date(activity.timestamp).toLocaleString()}`}</Typography>}
                      />
                    </ListItem>
                    <Divider />
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Deadlines */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, mb: 2 }}>
                Upcoming Deadlines
              </Typography>
              <List sx={{ p: 0 }}>
                {upcomingDeadlines.map((dl, idx) => (
                  <Box key={idx}>
                    <ListItem sx={{ py: 1.8, px: 0, display: "flex", alignItems: "center", gap: 2 }}>
                      <CalendarToday color="primary" sx={{ fontSize: 20 }} />
                      <ListItemText
                        primary={<Typography sx={{ fontWeight: 700, fontSize: "0.85rem" }}>{dl.title}</Typography>}
                        secondary={<Typography sx={{ color: "error.main", fontWeight: 700, fontSize: "0.75rem" }}>{dl.date}</Typography>}
                      />
                    </ListItem>
                    <Divider />
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
export default AdminDashboard;
