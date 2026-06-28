import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Breadcrumbs,
  Link,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Room, Phone, Mail, Send } from "@mui/icons-material";
import { toast } from "react-toastify";

export const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    // Simulate inquiry submission
    setTimeout(() => {
      toast.success("Thank you! Your inquiry has been sent to the Department Liaison. We will contact you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setSubmitting(false);
    }, 1500);
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
            Contact Us
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
            Contact Us
          </Typography>
          <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.85)", fontWeight: 400 }}>
            We are here to help. Reach out to us for any industrial partnership or linkage inquiries.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Left panel - Info details */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Card sx={{ height: "100%", p: 1.5 }}>
              <CardContent sx={{ p: "24px !important" }}>
                <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, mb: 4, color: "primary.main" }}>
                  Office of Linkages
                </Typography>

                <Box sx={{ display: "flex", gap: 2.5, mb: 4 }}>
                  <Room color="primary" sx={{ fontSize: 28, mt: 0.5 }} />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Address Location</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.5 }}>
                      Department of Biological & Physical Sciences<br />
                      Karatina University Main Campus, Block C<br />
                      P.O. Box 1957-10101, Karatina, Kenya
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 2.5, mb: 4 }}>
                  <Phone color="primary" sx={{ fontSize: 28, mt: 0.5 }} />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Phone Desk</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      +254 718 000000 / +254 718 111111
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 2.5 }}>
                  <Mail color="primary" sx={{ fontSize: 28, mt: 0.5 }} />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Email Address</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      industrylinkages@karatina.ac.ke
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Right panel - Form submission */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Card sx={{ p: 1.5 }}>
              <CardContent sx={{ p: "24px !important" }}>
                <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, mb: 3.5, color: "primary.main" }}>
                  Send us a Message
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        required
                        label="Your Name"
                        name="name"
                        size="small"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        required
                        type="email"
                        label="Your Email"
                        name="email"
                        size="small"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </Grid>
                  </Grid>

                  <TextField
                    fullWidth
                    label="Subject"
                    name="subject"
                    size="small"
                    value={formData.subject}
                    onChange={handleChange}
                  />

                  <TextField
                    fullWidth
                    required
                    multiline
                    rows={5}
                    label="Message"
                    name="message"
                    size="small"
                    value={formData.message}
                    onChange={handleChange}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={submitting}
                    endIcon={<Send />}
                    sx={{ alignSelf: "flex-end", px: 4, py: 1.2, fontWeight: 700 }}
                  >
                    {submitting ? "Sending..." : "Send Message"}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
export default ContactUs;
