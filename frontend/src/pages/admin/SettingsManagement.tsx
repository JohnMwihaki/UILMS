import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Divider,
} from "@mui/material";
import { Save } from "@mui/icons-material";
import client from "../../apis/client";
import { toast } from "react-toastify";

export const SettingsManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Settings State
  const [settings, setSettings] = useState({
    university_name: "Karatina University",
    department_name: "Department of Biological and Physical Sciences",
    representative_name: "Prof. John Doe",
    representative_title: "Dean of School",
    system_email: "linkages@karatina.ac.ke",
    notify_on_mou_expiry: true,
    auto_approve_students: false,
    mou_expiry_warning_days: 30,
  });

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await client.get("/settings/");
      const data = res.data.data;
      if (data && Object.keys(data).length > 0) {
        setSettings({
          university_name: data.university_name || "Karatina University",
          department_name: data.department_name || "Department of Biological and Physical Sciences",
          representative_name: data.representative_name || "Prof. John Doe",
          representative_title: data.representative_title || "Dean of School",
          system_email: data.system_email || "linkages@karatina.ac.ke",
          notify_on_mou_expiry: data.notify_on_mou_expiry !== undefined ? data.notify_on_mou_expiry : true,
          auto_approve_students: data.auto_approve_students !== undefined ? data.auto_approve_students : false,
          mou_expiry_warning_days: data.mou_expiry_warning_days || 30,
        });
      }
    } catch (e) {
      console.error("Error loading system settings", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.checked,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await client.post("/settings/update_settings/", settings);
      toast.success("System configurations updated successfully.");
    } catch (err: any) {
      console.error(err);
      toast.error("Error saving configurations.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}><CircularProgress /></Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 700 }}>
      <Card sx={{ p: 1 }}>
        <CardContent sx={{ p: "28px !important" }}>
          <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, mb: 3, color: "primary.main" }}>
            Global System Configurations
          </Typography>

          <Box component="form" onSubmit={handleSave} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="University Name"
                  name="university_name"
                  value={settings.university_name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Department Name"
                  name="department_name"
                  value={settings.department_name}
                  onChange={handleChange}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "primary.main", mb: 1 }}>University Direct Liaison</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Representative Name"
                  name="representative_name"
                  value={settings.representative_name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Representative Title"
                  name="representative_title"
                  value={settings.representative_title}
                  onChange={handleChange}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  type="email"
                  label="System Notification Email"
                  name="system_email"
                  value={settings.system_email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="MoU Expiry Alarm Warning (Days)"
                  name="mou_expiry_warning_days"
                  value={settings.mou_expiry_warning_days}
                  onChange={handleChange}
                  slotProps={{ htmlInput: { min: 1 } }}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "primary.main", mb: 1.5 }}>Automation Parameters</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={settings.notify_on_mou_expiry}
                      onChange={handleCheckboxChange}
                      name="notify_on_mou_expiry"
                    />
                  }
                  label="Send Admin Alerts on MoU Expirations"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={settings.auto_approve_students}
                      onChange={handleCheckboxChange}
                      name="auto_approve_students"
                    />
                  }
                  label="Automatically approve student accounts"
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              variant="contained"
              disabled={saving}
              startIcon={<Save />}
              sx={{ alignSelf: "flex-end", px: 4, py: 1.2, fontWeight: 700, mt: 2 }}
            >
              {saving ? "Saving Changes..." : "Save Configuration"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
export default SettingsManagement;
