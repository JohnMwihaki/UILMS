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
import { Add, Edit, Delete, Search, FilePresent } from "@mui/icons-material";
import client from "../../apis/client";
import type { MoU, Institution, Document } from "../../types";
import { toast } from "react-toastify";

export const MouManagement: React.FC = () => {
  const [mous, setMoUs] = useState<MoU[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Modals open states
  const [openForm, setOpenForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    institution: "",
    document: "",
    start_date: "",
    end_date: "",
    status: "ACTIVE",
    signed_by_university: "",
    signed_by_institution: "",
    description: "",
  });

  const fetchMoUs = async () => {
    setLoading(true);
    try {
      const res = await client.get("/documents/mous/");
      setMoUs(res.data.data || []);
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

      const docRes = await client.get("/documents/files/?document_type=MOU");
      setDocuments(docRes.data.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchMoUs();
    fetchMetadata();
  }, []);

  const handleOpenAdd = () => {
    setEditId(null);
    setFormData({
      institution: "",
      document: "",
      start_date: "",
      end_date: "",
      status: "ACTIVE",
      signed_by_university: "",
      signed_by_institution: "",
      description: "",
    });
    setOpenForm(true);
  };

  const handleOpenEdit = (mou: MoU) => {
    setEditId(mou.id);
    setFormData({
      institution: String(mou.institution),
      document: String(mou.document),
      start_date: mou.start_date ? mou.start_date.split("T")[0] : "",
      end_date: mou.end_date ? mou.end_date.split("T")[0] : "",
      status: mou.status,
      signed_by_university: mou.signed_by_university,
      signed_by_institution: mou.signed_by_institution,
      description: mou.description || "",
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
    if (!formData.institution || !formData.document || !formData.start_date || !formData.end_date) {
      toast.error("Institution, Document File link, and Date spans are required.");
      return;
    }

    try {
      if (editId) {
        await client.put(`/documents/mous/${editId}/`, formData);
        toast.success("MoU details modified successfully.");
      } else {
        await client.post("/documents/mous/", formData);
        toast.success("New legal MoU registered successfully.");
      }
      fetchMoUs();
      setOpenForm(false);
    } catch (err: any) {
      console.error(err);
      toast.error("An error occurred while saving MoU.");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this MoU contract log?")) {
      try {
        await client.delete(`/documents/mous/${id}/`);
        toast.success("MoU deleted successfully.");
        fetchMoUs();
      } catch (e) {
        console.error(e);
        toast.error("Error deleting MoU.");
      }
    }
  };

  const filteredMoUs = mous.filter((mou) =>
    (mou.institution_name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      {/* Search and Add */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexWrap: "wrap", gap: 2 }}>
        <Box sx={{ display: "flex", backgroundColor: "background.paper", borderRadius: 2, p: 0.5, border: "1px solid #e2e8f0", width: 320 }}>
          <TextField
            fullWidth
            placeholder="Search organization name..."
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
          Add MoU
        </Button>
      </Box>

      {/* Table listing or Loading */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 3, border: "1px solid #f1f5f9" }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ backgroundColor: "rgba(0, 80, 40, 0.03)" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800 }}>Partner Organization</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Signing Span Dates</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Signed By (Uni)</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Signed By (Partner)</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>MoU Status</TableCell>
                <TableCell sx={{ fontWeight: 800, textAlign: "right" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMoUs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
                    No active or expired MoUs recorded.
                  </TableCell>
                </TableRow>
              ) : (
                filteredMoUs.map((mou) => (
                  <TableRow key={mou.id} sx={{ "&:hover": { backgroundColor: "rgba(0,80,40,0.01)" } }}>
                    <TableCell sx={{ fontWeight: 700 }}>{mou.institution_name}</TableCell>
                    <TableCell>
                      {new Date(mou.start_date).toLocaleDateString()} - {new Date(mou.end_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.85rem", color: "text.secondary" }}>{mou.signed_by_university}</TableCell>
                    <TableCell sx={{ fontSize: "0.85rem", color: "text.secondary" }}>{mou.signed_by_institution}</TableCell>
                    <TableCell>
                      <Chip
                        label={mou.status}
                        size="small"
                        color={mou.status === "ACTIVE" ? "success" : mou.status === "EXPIRED" ? "warning" : "error"}
                        sx={{ fontWeight: 800, fontSize: "0.72rem" }}
                      />
                    </TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      {mou.document_details?.file && (
                        <IconButton size="small" href={mou.document_details.file} target="_blank" color="primary" sx={{ mr: 1 }}>
                          <FilePresent fontSize="small" />
                        </IconButton>
                      )}
                      <IconButton size="small" onClick={() => handleOpenEdit(mou)} color="primary" sx={{ mr: 1 }}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(mou.id)} sx={{ color: "#ef4444" }}>
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

      {/* Form Dialog Modal */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>
          {editId ? "Edit MoU details" : "Register Legal MoU Contract"}
        </DialogTitle>
        <DialogContent dividers sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 2.5 }}>
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

          <FormControl fullWidth required>
            <InputLabel>MoU PDF File Record</InputLabel>
            <Select
              name="document"
              value={formData.document}
              label="MoU PDF File Record"
              onChange={handleInputChange}
            >
              {documents.map((doc) => (
                <MenuItem key={doc.id} value={doc.id}>{doc.title}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                required
                type="date"
                label="Contract Commencement Date"
                name="start_date"
                slotProps={{ inputLabel: { shrink: true } }}
                value={formData.start_date}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                required
                type="date"
                label="Contract Expiry Date"
                name="end_date"
                slotProps={{ inputLabel: { shrink: true } }}
                value={formData.end_date}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>

          <TextField
            fullWidth
            required
            label="Signed By (University Representative)"
            name="signed_by_university"
            placeholder="e.g. Vice-Chancellor, Karatina Uni"
            value={formData.signed_by_university}
            onChange={handleInputChange}
          />

          <TextField
            fullWidth
            required
            label="Signed By (Partner Liaison Representative)"
            name="signed_by_institution"
            placeholder="e.g. Director, Safaricom Linkages"
            value={formData.signed_by_institution}
            onChange={handleInputChange}
          />

          <FormControl fullWidth>
            <InputLabel>MoU Contract Status</InputLabel>
            <Select
              name="status"
              value={formData.status}
              label="MoU Contract Status"
              onChange={handleInputChange}
            >
              <MenuItem value="ACTIVE">Active (In Force)</MenuItem>
              <MenuItem value="EXPIRED">Expired (Lapsed)</MenuItem>
              <MenuItem value="TERMINATED">Terminated</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            multiline
            rows={3}
            label="MoU Scope / Brief Summary"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpenForm(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default MouManagement;
