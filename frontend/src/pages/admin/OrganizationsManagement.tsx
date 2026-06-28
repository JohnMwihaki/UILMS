import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
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
  FormControlLabel,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
} from "@mui/material";
import { Add, Edit, Delete, Search, Star } from "@mui/icons-material";
import client from "../../apis/client";
import type { Institution, InstitutionCategory } from "../../types";
import { toast } from "react-toastify";

export const OrganizationsManagement: React.FC = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [categories, setCategories] = useState<InstitutionCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Modal open states
  const [openForm, setOpenForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // Form Field states
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    county: "",
    address: "",
    website: "",
    contact_email: "",
    contact_phone: "",
    contact_person_name: "",
    contact_person_role: "",
    description: "",
    status: "STANDARD",
    remarks: "",
    has_internship: false,
    has_attachment: false,
    has_joint_research: false,
    has_staff_exchange: false,
    has_grant_writing: false,
    has_lab_training: false,
    has_curriculum_dev: false,
    has_funding: false,
  });

  const fetchInstitutions = async () => {
    setLoading(true);
    try {
      const res = await client.get("/organizations/institutions/");
      setInstitutions(res.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await client.get("/organizations/categories/");
      setCategories(res.data.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchInstitutions();
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditId(null);
    setFormData({
      name: "",
      category: "",
      county: "",
      address: "",
      website: "",
      contact_email: "",
      contact_phone: "",
      contact_person_name: "",
      contact_person_role: "",
      description: "",
      status: "STANDARD",
      remarks: "",
      has_internship: false,
      has_attachment: false,
      has_joint_research: false,
      has_staff_exchange: false,
      has_grant_writing: false,
      has_lab_training: false,
      has_curriculum_dev: false,
      has_funding: false,
    });
    setOpenForm(true);
  };

  const handleOpenEdit = (inst: Institution) => {
    setEditId(inst.id);
    setFormData({
      name: inst.name,
      category: typeof inst.category === "object" ? String(inst.category.id) : String(inst.category),
      county: inst.county,
      address: inst.address || "",
      website: inst.website || "",
      contact_email: inst.contact_email || "",
      contact_phone: inst.contact_phone || "",
      contact_person_name: inst.contact_person_name || "",
      contact_person_role: inst.contact_person_role || "",
      description: inst.description || "",
      status: inst.status,
      remarks: inst.remarks || "",
      has_internship: inst.has_internship,
      has_attachment: inst.has_attachment,
      has_joint_research: inst.has_joint_research,
      has_staff_exchange: inst.has_staff_exchange,
      has_grant_writing: inst.has_grant_writing,
      has_lab_training: inst.has_lab_training,
      has_curriculum_dev: inst.has_curriculum_dev,
      has_funding: inst.has_funding,
    });
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: unknown } }) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.checked,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.county) {
      toast.error("Please fill in all required fields (Name, Category, County).");
      return;
    }

    try {
      if (editId) {
        await client.put(`/organizations/institutions/${editId}/`, formData);
        toast.success("Organization updated successfully.");
      } else {
        await client.post("/organizations/institutions/", formData);
        toast.success("New organization registered successfully.");
      }
      fetchInstitutions();
      setOpenForm(false);
    } catch (err: any) {
      console.error(err);
      toast.error("An error occurred while saving organization profile.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await client.delete(`/organizations/institutions/${id}/`);
      toast.success("Organization deleted successfully.");
      fetchInstitutions();
    } catch (e) {
      console.error(e);
      toast.error("Error deleting organization.");
    }
  };

  const filteredInsts = institutions.filter((inst) =>
    inst.name.toLowerCase().includes(search.toLowerCase()) ||
    inst.custom_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      {/* Header and Actions */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexWrap: "wrap", gap: 2 }}>
        <Box sx={{ display: "flex", backgroundColor: "background.paper", borderRadius: 2, p: 0.5, border: "1px solid #e2e8f0", width: 320 }}>
          <TextField
            fullWidth
            placeholder="Search custom ID, organization name..."
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
          Add Organization
        </Button>
      </Box>

      {/* Main Table Container */}
      <TableContainer component={Paper} sx={{ borderRadius: 3, border: "1px solid #f1f5f9" }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: "rgba(0, 80, 40, 0.03)" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 800 }}>Custom ID</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Organization Name</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>County Location</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 800, textAlign: "right" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: "center", py: 4 }}>
                  <CircularProgress size={30} color="primary" />
                </TableCell>
              </TableRow>
            ) : filteredInsts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
                  No organizations found.
                </TableCell>
              </TableRow>
            ) : (
              filteredInsts.map((inst) => (
                <TableRow key={inst.id} sx={{ "&:hover": { backgroundColor: "rgba(0,80,40,0.01)" } }}>
                  <TableCell sx={{ fontWeight: 700, color: "primary.main" }}>{inst.custom_id}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{inst.name}</TableCell>
                  <TableCell>{typeof inst.category === "object" ? inst.category.name : "Uncategorized"}</TableCell>
                  <TableCell>{inst.county}</TableCell>
                  <TableCell>
                    <Chip
                      icon={inst.status === "STRATEGIC" ? <Star sx={{ fontSize: "14px !important", color: "#b45309 !important" }} /> : undefined}
                      label={inst.status}
                      size="small"
                      sx={{
                        fontWeight: 800,
                        bgcolor: inst.status === "STRATEGIC" ? "rgba(251,191,36,0.12)" : inst.status === "EMERGING" ? "rgba(16,185,129,0.1)" : "rgba(107,114,128,0.1)",
                        color: inst.status === "STRATEGIC" ? "#b45309" : inst.status === "EMERGING" ? "#047857" : "#4b5563",
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: "right" }}>
                    <IconButton size="small" onClick={() => handleOpenEdit(inst)} color="primary" sx={{ mr: 1 }}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(inst.id)} sx={{ color: "#ef4444" }}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add / Edit Form Dialog Modal */}
      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, p: 3 }}>
          {editId ? "Edit Organization Profile" : "Register New Organization"}
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                label="Organization Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  label="Category"
                  onChange={handleInputChange}
                >
                  {categories.map((c) => (
                    <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                label="County Location"
                name="county"
                value={formData.county}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Partnership Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  label="Partnership Status"
                  onChange={handleInputChange}
                >
                  <MenuItem value="STANDARD">Standard Partner</MenuItem>
                  <MenuItem value="EMERGING">Emerging Partner</MenuItem>
                  <MenuItem value="STRATEGIC">Strategic Partner</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Physical Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Website Portal"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
              />
            </Grid>

            {/* Liaison Details */}
            <Grid size={{ xs: 12 }} sx={{ mt: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "primary.main" }}>Primary Industry Liaison</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Liaison Name"
                name="contact_person_name"
                value={formData.contact_person_name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Liaison Role / Title"
                name="contact_person_role"
                value={formData.contact_person_role}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="email"
                label="Liaison Email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Liaison Phone"
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </Grid>

            {/* Collaboration Checklist */}
            <Grid size={{ xs: 12 }} sx={{ mt: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "primary.main" }}>Collaboration Channels</Typography>
            </Grid>
            {[
              { label: "Internships", name: "has_internship" },
              { label: "Student Attachments", name: "has_attachment" },
              { label: "Joint Research", name: "has_joint_research" },
              { label: "Staff Exchange", name: "has_staff_exchange" },
              { label: "Grant Proposals", name: "has_grant_writing" },
              { label: "Lab Trainings", name: "has_lab_training" },
              { label: "Curriculum Dev", name: "has_curriculum_dev" },
              { label: "Research Funding", name: "has_funding" },
            ].map((collab) => (
              <Grid size={{ xs: 6, sm: 3 }} key={collab.name}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={(formData as any)[collab.name]}
                      onChange={handleCheckboxChange}
                      name={collab.name}
                    />
                  }
                  label={collab.label}
                />
              </Grid>
            ))}

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Administrative Remarks / Notes"
                name="remarks"
                value={formData.remarks}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseForm} sx={{ fontWeight: 700 }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} sx={{ fontWeight: 700 }}>
            {editId ? "Save Changes" : "Create Partner"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default OrganizationsManagement;
