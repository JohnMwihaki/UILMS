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
  Typography,
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

  const [uploadNewFile, setUploadNewFile] = useState(false);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [newFileTitle, setNewFileTitle] = useState("");
  const [saving, setSaving] = useState(false);

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
    setUploadNewFile(false);
    setNewFile(null);
    setNewFileTitle("");
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
    setUploadNewFile(false);
    setNewFile(null);
    setNewFileTitle("");
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
    
    if (!formData.institution || !formData.start_date || !formData.end_date) {
      toast.error("Institution and Date spans are required.");
      return;
    }

    if (!uploadNewFile && !formData.document) {
      toast.error("Please select an existing MoU PDF File Record.");
      return;
    }

    if (uploadNewFile && !newFile) {
      toast.error("Please select a PDF file to upload.");
      return;
    }

    setSaving(true);
    try {
      let finalDocId = formData.document;

      if (uploadNewFile && newFile) {
        const fileData = new FormData();
        const instName = institutions.find(i => String(i.id) === String(formData.institution))?.name || "Partner";
        const title = newFileTitle.trim() || `MoU Document - ${instName}`;
        
        fileData.append("title", title);
        fileData.append("file", newFile);
        fileData.append("document_type", "MOU");
        fileData.append("is_public", "true");
        fileData.append("institution", formData.institution);

        const fileUploadRes = await client.post("/documents/files/", fileData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        
        const uploadedDoc = fileUploadRes.data.data || fileUploadRes.data;
        if (uploadedDoc && uploadedDoc.id) {
          finalDocId = String(uploadedDoc.id);
        } else {
          throw new Error("Failed to retrieve uploaded document ID.");
        }
      }

      const savePayload = {
        ...formData,
        document: finalDocId,
      };

      if (editId) {
        await client.put(`/documents/mous/${editId}/`, savePayload);
        toast.success("MoU details modified successfully.");
      } else {
        await client.post("/documents/mous/", savePayload);
        toast.success("New legal MoU registered successfully.");
      }
      fetchMoUs();
      fetchMetadata();
      setOpenForm(false);
    } catch (err: any) {
      console.error(err);
      const serverErr = err.response?.data?.error || err.response?.data?.detail || "An error occurred while saving MoU.";
      toast.error(typeof serverErr === "string" ? serverErr : "An error occurred while saving MoU.");
    } finally {
      setSaving(false);
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
                      {mou.document_file && (
                        <IconButton size="small" href={mou.document_file} target="_blank" color="primary" sx={{ mr: 1 }}>
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

          <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, p: 2, backgroundColor: "rgba(0,0,0,0.01)" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "text.primary" }}>
                MoU PDF File Record
              </Typography>
              <Button 
                size="small" 
                onClick={() => setUploadNewFile(!uploadNewFile)} 
                sx={{ fontWeight: 800, textTransform: "none" }}
              >
                {uploadNewFile ? "Select Existing File" : "Upload New File"}
              </Button>
            </Box>

            {uploadNewFile ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  fullWidth
                  label="Document Title"
                  placeholder="e.g. Legal Agreement MoU 2026"
                  value={newFileTitle}
                  onChange={(e) => setNewFileTitle(e.target.value)}
                />
                <Button
                  variant="outlined"
                  component="label"
                  sx={{
                    py: 1.5,
                    borderStyle: "dashed",
                    borderWidth: 2,
                    borderColor: "primary.main",
                    backgroundColor: "rgba(0, 48, 20, 0.02)",
                    "&:hover": {
                      borderColor: "primary.dark",
                      backgroundColor: "rgba(0, 48, 20, 0.05)",
                    }
                  }}
                >
                  {newFile ? `Selected: ${newFile.name}` : "Select MoU PDF File"}
                  <input
                    type="file"
                    hidden
                    accept=".pdf"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setNewFile(e.target.files[0]);
                        if (!newFileTitle) {
                          const rawName = e.target.files[0].name.replace(/\.[^/.]+$/, "");
                          setNewFileTitle(rawName);
                        }
                      }
                    }}
                  />
                </Button>
              </Box>
            ) : (
              <FormControl fullWidth required={!uploadNewFile}>
                <InputLabel>Choose from Uploaded PDF Files</InputLabel>
                <Select
                  name="document"
                  value={formData.document}
                  label="Choose from Uploaded PDF Files"
                  onChange={handleInputChange}
                >
                  {documents.length === 0 ? (
                    <MenuItem disabled value="">No files uploaded yet. Select 'Upload New File' above.</MenuItem>
                  ) : (
                    documents.map((doc) => (
                      <MenuItem key={doc.id} value={doc.id}>{doc.title}</MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            )}
          </Box>

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
          <Button onClick={() => setOpenForm(false)} disabled={saving}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default MouManagement;
