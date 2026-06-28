import React, { useState, useEffect } from "react";
import {
  Grid,
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Add, Edit, Delete, Search } from "@mui/icons-material";
import client from "../../apis/client";
import type { Opportunity, Institution, ResearchArea } from "../../types";
import { toast } from "react-toastify";

export const OpportunitiesManagement: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [researchAreas, setResearchAreas] = useState<ResearchArea[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Modal open states
  const [openForm, setOpenForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    institution: "",
    type: "INTERNSHIP",
    description: "",
    requirements: "",
    slots: 1,
    funding_amount: "",
    research_area: "",
    application_deadline: "",
    status: "OPEN",
  });

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const res = await client.get("/opportunities/");
      setOpportunities(res.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetadata = async () => {
    try {
       const instRes = await client.get("/organizations/institutions/");
       setInstitutions(instRes.data.data || []);

       const resArea = await client.get("/academics/research-areas/");
       setResearchAreas(resArea.data.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchOpportunities();
    fetchMetadata();
  }, []);

  const handleOpenAdd = () => {
    setEditId(null);
    setFormData({
      title: "",
      institution: "",
      type: "INTERNSHIP",
      description: "",
      requirements: "",
      slots: 1,
      funding_amount: "",
      research_area: "",
      application_deadline: "",
      status: "OPEN",
    });
    setOpenForm(true);
  };

  const handleOpenEdit = (opp: Opportunity) => {
    setEditId(opp.id);
    setFormData({
      title: opp.title,
      institution: String(opp.institution),
      type: opp.type,
      description: opp.description,
      requirements: opp.requirements || "",
      slots: opp.slots,
      funding_amount: opp.funding_amount ? String(opp.funding_amount) : "",
      research_area: opp.research_area ? String(opp.research_area) : "",
      application_deadline: opp.application_deadline ? opp.application_deadline.split("T")[0] : "",
      status: opp.status,
    });
    setOpenForm(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: unknown } }) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.institution || !formData.description) {
      toast.error("Please fill in all required fields (Title, Institution, Description).");
      return;
    }

    try {
      if (editId) {
        await client.put(`/opportunities/${editId}/`, formData);
        toast.success("Opportunity modified successfully.");
      } else {
        await client.post("/opportunities/", formData);
        toast.success("New opportunity listed successfully.");
      }
      fetchOpportunities();
      setOpenForm(false);
    } catch (err: any) {
      console.error(err);
      toast.error("An error occurred while saving opportunity.");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to remove this opportunity listing?")) {
      try {
        await client.delete(`/opportunities/${id}/`);
        toast.success("Opportunity listing deleted.");
        fetchOpportunities();
      } catch (e) {
        console.error(e);
        toast.error("Error deleting opportunity.");
      }
    }
  };

  const filteredOpps = opportunities.filter((opp) =>
    opp.title.toLowerCase().includes(search.toLowerCase()) ||
    (opp.institution_details?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      {/* Search and Add */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexWrap: "wrap", gap: 2 }}>
        <Box sx={{ display: "flex", backgroundColor: "background.paper", borderRadius: 2, p: 0.5, border: "1px solid #e2e8f0", width: 320 }}>
          <TextField
            fullWidth
            placeholder="Search opportunity title..."
            variant="standard"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{
              input: {
                disableUnderline: true,
                startAdornment: <Search sx={{ color: "text.secondary", mr: 1, ml: 1 }} />,
                sx: { px: 1, color: "text.primary" },
              }
            }}
          />
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpenAdd} sx={{ fontWeight: 700 }}>
          Add Opportunity
        </Button>
      </Box>

      {/* Main Table Container / Loader */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 3, border: "1px solid #f1f5f9" }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ backgroundColor: "rgba(0, 80, 40, 0.03)" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800 }}>Opportunity Title</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Partner Institution</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Slots</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Deadline</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 800, textAlign: "right" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOpps.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
                    No opportunities listed.
                  </TableCell>
                </TableRow>
              ) : (
                filteredOpps.map((opp) => (
                  <TableRow key={opp.id} sx={{ "&:hover": { backgroundColor: "rgba(0,80,40,0.01)" } }}>
                    <TableCell sx={{ fontWeight: 700 }}>{opp.title}</TableCell>
                    <TableCell>{opp.institution_details?.name || "Corporate Partner"}</TableCell>
                    <TableCell>
                      <Chip label={opp.type} size="small" sx={{ fontWeight: 800, fontSize: "0.72rem" }} />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{opp.slots}</TableCell>
                    <TableCell>{opp.application_deadline ? new Date(opp.application_deadline).toLocaleDateString() : "No Deadline"}</TableCell>
                    <TableCell>
                      <Chip
                        label={opp.status}
                        size="small"
                        color={opp.status === "OPEN" ? "success" : "default"}
                        sx={{ fontWeight: 800, fontSize: "0.72rem" }}
                      />
                    </TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      <IconButton size="small" onClick={() => handleOpenEdit(opp)} color="primary" sx={{ mr: 1 }}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(opp.id)} sx={{ color: "#ef4444" }}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add / Edit dialog Form */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>
          {editId ? "Edit Opportunity Details" : "Register Linkage Opportunity"}
        </DialogTitle>
        <DialogContent dividers sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 2.5 }}>
          <TextField
            fullWidth
            required
            label="Opportunity Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
          />

          <FormControl fullWidth required>
            <InputLabel>Partner Institution</InputLabel>
            <Select
              name="institution"
              value={formData.institution}
              label="Partner Institution"
              onChange={handleInputChange}
            >
              {institutions.map((inst) => (
                <MenuItem key={inst.id} value={inst.id}>{inst.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Opportunity Type</InputLabel>
            <Select
              name="type"
              value={formData.type}
              label="Opportunity Type"
              onChange={handleInputChange}
            >
              <MenuItem value="INTERNSHIP">Internship Position</MenuItem>
              <MenuItem value="ATTACHMENT">Student Placement Attachment</MenuItem>
              <MenuItem value="RESEARCH">Joint Research Collaboration</MenuItem>
              <MenuItem value="FUNDING">Research Grant Funding</MenuItem>
            </Select>
          </FormControl>

          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Slots Available"
                name="slots"
                value={formData.slots}
                onChange={handleInputChange}
                slotProps={{ htmlInput: { min: 1 } }}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                type="date"
                label="Application Deadline"
                name="application_deadline"
                slotProps={{ inputLabel: { shrink: true } }}
                value={formData.application_deadline}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>

          {formData.type === "FUNDING" && (
            <TextField
              fullWidth
              label="Funding Amount (KES)"
              name="funding_amount"
              value={formData.funding_amount}
              onChange={handleInputChange}
            />
          )}

          {formData.type === "RESEARCH" && (
            <FormControl fullWidth>
              <InputLabel>Associated Research Focus Area</InputLabel>
              <Select
                name="research_area"
                value={formData.research_area}
                label="Associated Research Focus Area"
                onChange={handleInputChange}
              >
                <MenuItem value=""><em>None / General</em></MenuItem>
                {researchAreas.map((ra) => (
                  <MenuItem key={ra.id} value={ra.id}>{ra.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <TextField
            fullWidth
            required
            multiline
            rows={4}
            label="Full Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Requirements / Eligibility"
            name="requirements"
            value={formData.requirements}
            onChange={handleInputChange}
          />

          <FormControl fullWidth>
            <InputLabel>Listing Status</InputLabel>
            <Select
              name="status"
              value={formData.status}
              label="Listing Status"
              onChange={handleInputChange}
            >
              <MenuItem value="OPEN">Open (Accepting Submissions)</MenuItem>
              <MenuItem value="CLOSED">Closed (Archived)</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpenForm(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default OpportunitiesManagement;
