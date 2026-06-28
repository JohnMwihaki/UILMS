import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Chip,
  CircularProgress,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import client from "../../apis/client";
import type { AuditLog } from "../../types";

export const AuditLogsManagement: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await client.get("/audit-logs/");
      setLogs(res.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) =>
    log.details.toLowerCase().includes(search.toLowerCase()) ||
    log.user.toLowerCase().includes(search.toLowerCase()) ||
    log.action.toLowerCase().includes(search.toLowerCase()) ||
    log.module.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      {/* Search filter bar */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box sx={{ display: "flex", backgroundColor: "background.paper", borderRadius: 2, p: 0.5, border: "1px solid #e2e8f0", width: 320 }}>
          <TextField
            fullWidth
            placeholder="Search by action, user, details..."
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
      </Box>

      {/* Audit list table */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}><CircularProgress /></Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 3, border: "1px solid #f1f5f9" }}>
          <Table>
            <TableHead sx={{ backgroundColor: "rgba(0, 80, 40, 0.03)" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800 }}>Timestamp</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>User</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Action</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Module</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Action Details</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>IP Address</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
                    No audit trails recorded.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow key={log.id} sx={{ "&:hover": { backgroundColor: "rgba(0,80,40,0.01)" } }}>
                    <TableCell sx={{ fontSize: "0.85rem" }}>{new Date(log.timestamp).toLocaleString()}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "primary.main" }}>{log.user}</TableCell>
                    <TableCell>
                      <Chip
                        label={log.action}
                        size="small"
                        sx={{
                          fontWeight: 800,
                          fontSize: "0.72rem",
                          bgcolor: log.action === "CREATE" ? "rgba(16,185,129,0.1)" : log.action === "DELETE" ? "rgba(239,68,68,0.1)" : "rgba(107,114,128,0.1)",
                          color: log.action === "CREATE" ? "#047857" : log.action === "DELETE" ? "#ef4444" : "#4b5563",
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{log.module}</TableCell>
                    <TableCell sx={{ color: "text.secondary", fontSize: "0.85rem" }}>{log.details}</TableCell>
                    <TableCell sx={{ fontSize: "0.82rem", color: "text.secondary" }}>{log.ip_address || "N/A"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};
export default AuditLogsManagement;
