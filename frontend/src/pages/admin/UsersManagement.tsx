import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Tabs,
  Tab,
} from "@mui/material";
import { CheckCircle, Person, PeopleOutlined } from "@mui/icons-material";
import client from "../../apis/client";
import type { User } from "../../types";
import { toast } from "react-toastify";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => (
  <div role="tabpanel" hidden={value !== index} {...other}>
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

export const UsersManagement: React.FC = () => {
  const [tabVal, setTabVal] = useState(0);
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [_loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Load all users
      const allUsersRes = await client.get("/users/");
      const allUsers: User[] = allUsersRes.data.data || [];
      
      // Filter out approved and unapproved
      setActiveUsers(allUsers.filter((u) => u.is_approved));
      setPendingUsers(allUsers.filter((u) => !u.is_approved));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApprove = async (id: string | number) => {
    try {
      await client.post(`/users/${id}/approve/`);
      toast.success("User account approved successfully.");
      fetchUsers();
    } catch (e) {
      console.error(e);
      toast.error("Error approving user account.");
    }
  };

  return (
    <Box>
      {/* Tab Selection */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={tabVal} onChange={(_, val) => setTabVal(val)} textColor="primary" indicatorColor="primary">
          <Tab icon={<PeopleOutlined sx={{ fontSize: 20 }} />} label={`Approved Users (${activeUsers.length})`} iconPosition="start" sx={{ fontWeight: 700 }} />
          <Tab icon={<Person sx={{ fontSize: 20 }} />} label={`Pending Approvals (${pendingUsers.length})`} iconPosition="start" sx={{ fontWeight: 700 }} />
        </Tabs>
      </Box>

      {/* Approved Users List Tab */}
      <TabPanel value={tabVal} index={0}>
        <TableContainer component={Paper} sx={{ borderRadius: 3, border: "1px solid #f1f5f9" }}>
          <Table>
            <TableHead sx={{ backgroundColor: "rgba(0, 80, 40, 0.03)" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800 }}>Full Name</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Username</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Email Address</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Approval Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activeUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
                    No users registered in system.
                  </TableCell>
                </TableRow>
              ) : (
                activeUsers.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell sx={{ fontWeight: 700 }}>
                      {u.first_name ? `${u.first_name} ${u.last_name || ""}` : "Unnamed Admin"}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "primary.main" }}>{u.username}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <Chip label={u.role} size="small" sx={{ fontWeight: 800, fontSize: "0.72rem" }} />
                    </TableCell>
                    <TableCell>
                      <Chip label="Approved" color="success" size="small" sx={{ fontWeight: 800, fontSize: "0.72rem" }} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Pending Registrations Tab */}
      <TabPanel value={tabVal} index={1}>
        <TableContainer component={Paper} sx={{ borderRadius: 3, border: "1px solid #f1f5f9" }}>
          <Table>
            <TableHead sx={{ backgroundColor: "rgba(0, 80, 40, 0.03)" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800 }}>Full Name</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Username</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Email Address</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Requested Role</TableCell>
                <TableCell sx={{ fontWeight: 800, textAlign: "right" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
                    No pending account registrations.
                  </TableCell>
                </TableRow>
              ) : (
                pendingUsers.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell sx={{ fontWeight: 700 }}>{`${u.first_name} ${u.last_name || ""}`}</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "primary.main" }}>{u.username}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <Chip label={u.role} size="small" sx={{ fontWeight: 800, fontSize: "0.72rem" }} />
                    </TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      <Button
                        variant="contained"
                        size="small"
                        color="success"
                        startIcon={<CheckCircle />}
                        onClick={() => handleApprove(u.id)}
                        sx={{ fontWeight: 700, borderRadius: 2 }}
                      >
                        Approve User
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
    </Box>
  );
};
export default UsersManagement;
