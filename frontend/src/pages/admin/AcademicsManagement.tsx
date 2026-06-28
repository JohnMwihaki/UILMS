import React, { useState, useEffect } from "react";
import {
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
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
} from "@mui/material";
import { Add, School, Class, BubbleChart } from "@mui/icons-material";
import client from "../../apis/client";
import type { Department, Course, ResearchArea } from "../../types";
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

export const AcademicsManagement: React.FC = () => {
  const [tabVal, setTabVal] = useState(0);

  // Data lists
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [researchAreas, setResearchAreas] = useState<ResearchArea[]>([]);

  // Dialog opens
  const [openDept, setOpenDept] = useState(false);
  const [openCourse, setOpenCourse] = useState(false);
  const [openResearch, setOpenResearch] = useState(false);

  // Form states
  const [deptForm, setDeptForm] = useState({ name: "", code: "", description: "" });
  const [courseForm, setCourseForm] = useState({ name: "", code: "", department: "", level: "UNDERGRADUATE" });
  const [researchForm, setResearchForm] = useState({ name: "", description: "" });

  const fetchAcademics = async () => {
    try {
      const deptRes = await client.get("/academics/departments/");
      setDepartments(deptRes.data.data || []);

      const courseRes = await client.get("/academics/courses/");
      setCourses(courseRes.data.data || []);

      const researchRes = await client.get("/academics/research-areas/");
      setResearchAreas(researchRes.data.data || []);
    } catch (e) {
      console.error("Error loading academics data", e);
    }
  };

  useEffect(() => {
    fetchAcademics();
  }, []);

  const handleTabChange = (_e: React.SyntheticEvent, newValue: number) => {
    setTabVal(newValue);
  };

  // Department Saves
  const handleSaveDept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptForm.name || !deptForm.code) {
      toast.error("Department Name and Code are required.");
      return;
    }
    try {
      await client.post("/academics/departments/", deptForm);
      toast.success("Department registered successfully.");
      setDeptForm({ name: "", code: "", description: "" });
      setOpenDept(false);
      fetchAcademics();
    } catch (err: any) {
      console.error(err);
      toast.error("Error adding department.");
    }
  };

  // Course Saves
  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.name || !courseForm.code || !courseForm.department) {
      toast.error("Course Name, Code, and Department are required.");
      return;
    }
    try {
      await client.post("/academics/courses/", courseForm);
      toast.success("Course registered successfully.");
      setCourseForm({ name: "", code: "", department: "", level: "UNDERGRADUATE" });
      setOpenCourse(false);
      fetchAcademics();
    } catch (err: any) {
      console.error(err);
      toast.error("Error adding course.");
    }
  };

  // Research Area Saves
  const handleSaveResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!researchForm.name) {
      toast.error("Research Area Name is required.");
      return;
    }
    try {
      await client.post("/academics/research-areas/", researchForm);
      toast.success("Research Area registered successfully.");
      setResearchForm({ name: "", description: "" });
      setOpenResearch(false);
      fetchAcademics();
    } catch (err: any) {
      console.error(err);
      toast.error("Error adding research area.");
    }
  };

  return (
    <Box>
      {/* Tab select bar */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={tabVal} onChange={handleTabChange} textColor="primary" indicatorColor="primary">
          <Tab icon={<School sx={{ fontSize: 20 }} />} label="Departments" iconPosition="start" sx={{ fontWeight: 700 }} />
          <Tab icon={<Class sx={{ fontSize: 20 }} />} label="Courses" iconPosition="start" sx={{ fontWeight: 700 }} />
          <Tab icon={<BubbleChart sx={{ fontSize: 20 }} />} label="Research Areas" iconPosition="start" sx={{ fontWeight: 700 }} />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={tabVal} index={0}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>
            Academic Departments
          </Typography>
          <Button variant="contained" startIcon={<Add />} onClick={() => setOpenDept(true)}>
            Add Department
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ borderRadius: 3, border: "1px solid #f1f5f9" }}>
          <Table>
            <TableHead sx={{ backgroundColor: "rgba(0, 80, 40, 0.03)" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800 }}>Dept Code</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Department Name</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {departments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
                    No departments added yet.
                  </TableCell>
                </TableRow>
              ) : (
                departments.map((dept) => (
                  <TableRow key={dept.id}>
                    <TableCell sx={{ fontWeight: 800, color: "primary.main" }}>{dept.code}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{dept.name}</TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>{dept.description || "No description provided."}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={tabVal} index={1}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>
            Courses & Programs
          </Typography>
          <Button variant="contained" startIcon={<Add />} onClick={() => setOpenCourse(true)}>
            Add Course
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ borderRadius: 3, border: "1px solid #f1f5f9" }}>
          <Table>
            <TableHead sx={{ backgroundColor: "rgba(0, 80, 40, 0.03)" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800 }}>Course Code</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Course Name</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Department</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Level</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
                    No courses added yet.
                  </TableCell>
                </TableRow>
              ) : (
                courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell sx={{ fontWeight: 800, color: "primary.main" }}>{course.code}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{course.name}</TableCell>
                    <TableCell>{typeof course.department === "object" ? course.department.name : "N/A"}</TableCell>
                    <TableCell>
                      <Chip label={course.level} size="small" sx={{ fontWeight: 800, fontSize: "0.75rem" }} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={tabVal} index={2}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>
            Research Focus Areas
          </Typography>
          <Button variant="contained" startIcon={<Add />} onClick={() => setOpenResearch(true)}>
            Add Research Area
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ borderRadius: 3, border: "1px solid #f1f5f9" }}>
          <Table>
            <TableHead sx={{ backgroundColor: "rgba(0, 80, 40, 0.03)" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800 }}>Focus ID</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Research Area Title</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Scientific Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {researchAreas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
                    No scientific research focus areas registered.
                  </TableCell>
                </TableRow>
              ) : (
                researchAreas.map((ra) => (
                  <TableRow key={ra.id}>
                    <TableCell sx={{ fontWeight: 800, color: "primary.main" }}>RA-0{ra.id}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{ra.name}</TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>{ra.description || "N/A"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Department Dialog Dialog */}
      <Dialog open={openDept} onClose={() => setOpenDept(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>Add Academic Department</DialogTitle>
        <DialogContent dividers sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 2.5 }}>
          <TextField
            fullWidth
            required
            label="Department Name"
            value={deptForm.name}
            onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
          />
          <TextField
            fullWidth
            required
            label="Department Code (e.g. BPS)"
            value={deptForm.code}
            onChange={(e) => setDeptForm({ ...deptForm, code: e.target.value.toUpperCase() })}
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            value={deptForm.description}
            onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpenDept(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveDept}>Create</Button>
        </DialogActions>
      </Dialog>

      {/* Course Dialog Dialog */}
      <Dialog open={openCourse} onClose={() => setOpenCourse(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>Add Course Program</DialogTitle>
        <DialogContent dividers sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 2.5 }}>
          <TextField
            fullWidth
            required
            label="Course Program Name"
            value={courseForm.name}
            onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
          />
          <TextField
            fullWidth
            required
            label="Course Code (e.g. SBL 312)"
            value={courseForm.code}
            onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value.toUpperCase() })}
          />
          <FormControl fullWidth required>
            <InputLabel>Department</InputLabel>
            <Select
              value={courseForm.department}
              label="Department"
              onChange={(e) => setCourseForm({ ...courseForm, department: e.target.value as string })}
            >
              {departments.map((dept) => (
                <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Academic Level</InputLabel>
            <Select
              value={courseForm.level}
              label="Academic Level"
              onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value as string })}
            >
              <MenuItem value="UNDERGRADUATE">Undergraduate</MenuItem>
              <MenuItem value="POSTGRADUATE">Postgraduate</MenuItem>
              <MenuItem value="DIPLOMA">Diploma</MenuItem>
              <MenuItem value="CERTIFICATE">Certificate</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpenCourse(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveCourse}>Create</Button>
        </DialogActions>
      </Dialog>

      {/* Research Area Dialog Dialog */}
      <Dialog open={openResearch} onClose={() => setOpenResearch(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>Add Scientific Research Area</DialogTitle>
        <DialogContent dividers sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 2.5 }}>
          <TextField
            fullWidth
            required
            label="Research Area Name"
            value={researchForm.name}
            onChange={(e) => setResearchForm({ ...researchForm, name: e.target.value })}
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            value={researchForm.description}
            onChange={(e) => setResearchForm({ ...researchForm, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpenResearch(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveResearch}>Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AcademicsManagement;
