import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Avatar,
  Tab,
  Tabs,
  Chip,
  Button,
  Divider,
  CircularProgress,
  Breadcrumbs,
  Link,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
  Room,
  Business,
  Mail,
  Phone,
  Language,
  ContactPhone,
  Star,
  FilePresent,
} from "@mui/icons-material";
import client from "../../apis/client";
import type { Institution, Opportunity, Document } from "../../types";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => (
  <div role="tabpanel" hidden={value !== index} {...other}>
    {value === index && <Box sx={{ py: 4 }}>{children}</Box>}
  </div>
);

export const InstitutionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [value, setValue] = useState(0);
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const instRes = await client.get(`/organizations/institutions/${id}/`);
        setInstitution(instRes.data.data);

        // Fetch related opportunities
        const oppsRes = await client.get(`/opportunities/?institution=${id}`);
        setOpportunities(oppsRes.data.data || []);

        // Fetch related documents
        const docsRes = await client.get(`/documents/files/?institution=${id}`);
        setDocuments(docsRes.data.data || []);
      } catch (e) {
        console.error("Error fetching institution details", e);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!institution) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h5" color="text.secondary">Institution not found</Typography>
        <Button variant="contained" component={RouterLink} to="/institutions" sx={{ mt: 3 }}>
          Back to List
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ py: 5, backgroundColor: "background.default" }}>
      <Container maxWidth="lg">
        {/* Breadcrumbs */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
          <Link component={RouterLink} color="inherit" to="/" sx={{ textDecoration: "none" }}>
            Home
          </Link>
          <Link component={RouterLink} color="inherit" to="/institutions" sx={{ textDecoration: "none" }}>
            Institutions
          </Link>
          <Typography color="text.primary" sx={{ fontWeight: 700 }}>
            {institution.name}
          </Typography>
        </Breadcrumbs>

        {/* Institution Banner Card */}
        <Card sx={{ p: 1.5, mb: 4 }}>
          <CardContent sx={{ display: "flex", flexWrap: "wrap", gap: 3.5, alignItems: "center", p: "24px !important" }}>
            <Avatar
              src={institution.logo}
              sx={{
                width: 80,
                height: 80,
                bgcolor: institution.status === "STRATEGIC" ? "primary.main" : "secondary.main",
                fontSize: "1.8rem",
                fontWeight: 800,
              }}
            >
              {getInitials(institution.name)}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1, flexWrap: "wrap" }}>
                <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>
                  {institution.name}
                </Typography>
                <Chip label={institution.custom_id} size="small" sx={{ fontWeight: 800, bgcolor: "rgba(0,80,40,0.05)", color: "primary.main" }} />
                {institution.status === "STRATEGIC" && (
                  <Chip icon={<Star sx={{ fontSize: "14px !important", color: "#d4af37 !important" }} />} label="Strategic Partner" size="small" sx={{ fontWeight: 700, bgcolor: "rgba(212,175,55,0.1)", color: "#9e7a15" }} />
                )}
              </Box>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, color: "text.secondary" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Business fontSize="inherit" />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {typeof institution.category === "object" ? institution.category.name : "Corporate"}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Room fontSize="inherit" />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{institution.county}, Kenya</Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Tab Selection */}
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Overview" sx={{ fontWeight: 700, fontSize: "0.95rem" }} />
            <Tab label={`Opportunities (${opportunities.length})`} sx={{ fontWeight: 700, fontSize: "0.95rem" }} />
            <Tab label="Collaboration & Focus" sx={{ fontWeight: 700, fontSize: "0.95rem" }} />
            <Tab label={`Documents (${documents.length})`} sx={{ fontWeight: 700, fontSize: "0.95rem" }} />
            <Tab label="Contact & Details" sx={{ fontWeight: 700, fontSize: "0.95rem" }} />
          </Tabs>
        </Box>

        {/* Tab Contents */}
        <TabPanel value={value} index={0}>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, mb: 2, color: "primary.main" }}>
                About {institution.name}
              </Typography>
              <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.6, mb: 4, whiteSpace: "pre-line" }}>
                {institution.description || "No description provided for this industry partner."}
              </Typography>

              <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, mb: 2, color: "primary.main" }}>
                Partner Remarks
              </Typography>
              <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.6, mb: 4 }}>
                {institution.remarks || "No additional partner comments or remarks recorded."}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ p: 2 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, mb: 2.5, color: "primary.main" }}>
                    Quick Information
                  </Typography>
                  <List sx={{ p: 0 }}>
                    <ListItem sx={{ py: 1.5, px: 0, borderBottom: "1px solid #f1f5f9" }}>
                      <Language sx={{ mr: 2, color: "text.secondary" }} />
                      <ListItemText
                        primary="Website"
                        secondary={
                          institution.website ? (
                            <Link href={institution.website} target="_blank" rel="noopener noreferrer" sx={{ fontWeight: 600 }}>
                              {institution.website}
                            </Link>
                          ) : (
                            "Not provided"
                          )
                        }
                      />
                    </ListItem>
                    <ListItem sx={{ py: 1.5, px: 0, borderBottom: "1px solid #f1f5f9" }}>
                      <Mail sx={{ mr: 2, color: "text.secondary" }} />
                      <ListItemText primary="Email Address" secondary={institution.contact_email || "Not provided"} />
                    </ListItem>
                    <ListItem sx={{ py: 1.5, px: 0, borderBottom: "1px solid #f1f5f9" }}>
                      <Phone sx={{ mr: 2, color: "text.secondary" }} />
                      <ListItemText primary="Phone Number" secondary={institution.contact_phone || "Not provided"} />
                    </ListItem>
                    <ListItem sx={{ py: 1.5, px: 0 }}>
                      <ContactPhone sx={{ mr: 2, color: "text.secondary" }} />
                      <ListItemText primary="Liaison Person" secondary={institution.contact_person_name || "Not provided"} />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={value} index={1}>
          <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, mb: 3.5, color: "primary.main" }}>
            Available Opportunities
          </Typography>
          {opportunities.length === 0 ? (
            <Card sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="body1" color="text.secondary">
                No active opportunities are currently listed for this partner.
              </Typography>
            </Card>
          ) : (
            <Grid container spacing={3}>
              {opportunities.map((opp) => (
                <Grid size={{ xs: 12, sm: 6 }} key={opp.id}>
                  <Card sx={{ height: "100%", display: "flex", flexDirection: "column", p: 1 }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: 2 }}>
                        <Chip label={opp.type} size="small" color="primary" sx={{ fontWeight: 800 }} />
                        {opp.application_deadline && (
                          <Typography variant="caption" color="error" sx={{ fontWeight: 700 }}>
                            Deadline: {new Date(opp.application_deadline).toLocaleDateString()}
                          </Typography>
                        )}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: "'Outfit', sans-serif", mb: 1 }}>
                        {opp.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", mb: 2 }}>
                        {opp.description}
                      </Typography>
                    </CardContent>
                    <Divider sx={{ mx: 2 }} />
                    <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>Slots: {opp.slots}</Typography>
                      <Button size="small" component={RouterLink} to="/opportunities">View Details</Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>

        <TabPanel value={value} index={2}>
          <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, mb: 3, color: "primary.main" }}>
            Collaboration Areas
          </Typography>
          <Grid container spacing={2}>
            {[
              { label: "Internships Offered", val: institution.has_internship },
              { label: "Student Attachments", val: institution.has_attachment },
              { label: "Joint Research", val: institution.has_joint_research },
              { label: "Staff Exchange", val: institution.has_staff_exchange },
              { label: "Grant Proposal Writing", val: institution.has_grant_writing },
              { label: "Laboratory Trainings", val: institution.has_lab_training },
              { label: "Curriculum Development", val: institution.has_curriculum_dev },
              { label: "Research Funding", val: institution.has_funding },
            ].map((collab, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                <Card sx={{ borderLeft: `4px solid ${collab.val ? "#10b981" : "#e5e7eb"}` }}>
                  <CardContent sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{collab.label}</Typography>
                    <Chip
                      label={collab.val ? "Active" : "Inactive"}
                      size="small"
                      color={collab.val ? "secondary" : "default"}
                      sx={{ fontWeight: 800 }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={value} index={3}>
          <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, mb: 3.5, color: "primary.main" }}>
            MoUs & Documents
          </Typography>
          {documents.length === 0 ? (
            <Card sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="body1" color="text.secondary">
                No related documents are currently listed for this partner.
              </Typography>
            </Card>
          ) : (
            <List>
              {documents.map((doc) => (
                <ListItem
                  key={doc.id}
                  sx={{
                    mb: 1.5,
                    border: "1px solid #f1f5f9",
                    borderRadius: 2,
                    backgroundColor: "background.paper",
                    py: 2,
                  }}
                  secondaryAction={
                    <Button
                      variant="outlined"
                      size="small"
                      href={doc.file}
                      target="_blank"
                      startIcon={<FilePresent />}
                    >
                      View File
                    </Button>
                  }
                >
                  <FilePresent sx={{ mr: 2.5, color: "primary.main", fontSize: 28 }} />
                  <ListItemText
                    primary={<Typography sx={{ fontWeight: 700 }}>{doc.title}</Typography>}
                    secondary={`${doc.document_type} • Uploaded on ${new Date(doc.uploaded_at).toLocaleDateString()}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </TabPanel>

        <TabPanel value={value} index={4}>
          <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, mb: 3, color: "primary.main" }}>
            Administrative Contact Profile
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Card sx={{ p: 2 }}>
                <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Primary Industry Liaison</Typography>
                  <Typography variant="body2"><strong>Name:</strong> {institution.contact_person_name || "N/A"}</Typography>
                  <Typography variant="body2"><strong>Role / Designation:</strong> {institution.contact_person_role || "N/A"}</Typography>
                  <Typography variant="body2"><strong>Direct Email:</strong> {institution.contact_email || "N/A"}</Typography>
                  <Typography variant="body2"><strong>Direct Phone:</strong> {institution.contact_phone || "N/A"}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Card sx={{ p: 2 }}>
                <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Office Address Location</Typography>
                  <Typography variant="body2"><strong>County:</strong> {institution.county}</Typography>
                  <Typography variant="body2"><strong>Physical Address:</strong> {institution.address || "N/A"}</Typography>
                  <Typography variant="body2"><strong>Website Portal:</strong> {institution.website || "N/A"}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Container>
    </Box>
  );
};
export default InstitutionDetails;
