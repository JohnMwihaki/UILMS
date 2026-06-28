import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";

// Public Pages
import Home from "./pages/public/Home";
import BrowseInstitutions from "./pages/public/BrowseInstitutions";
import InstitutionDetails from "./pages/public/InstitutionDetails";
import Opportunities from "./pages/public/Opportunities";
import ContactUs from "./pages/public/ContactUs";
import Login from "./pages/public/Login";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import OrganizationsManagement from "./pages/admin/OrganizationsManagement";
import AcademicsManagement from "./pages/admin/AcademicsManagement";
import OpportunitiesManagement from "./pages/admin/OpportunitiesManagement";
import MouManagement from "./pages/admin/MouManagement";
import UsersManagement from "./pages/admin/UsersManagement";
import AuditLogsManagement from "./pages/admin/AuditLogsManagement";
import SettingsManagement from "./pages/admin/SettingsManagement";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes with Navbar and Footer */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="institutions" element={<BrowseInstitutions />} />
          <Route path="institutions/:id" element={<InstitutionDetails />} />
          <Route path="opportunities" element={<Opportunities />} />
          <Route path="contact" element={<ContactUs />} />
        </Route>

        {/* Auth Route (Scenic login & register request layout) */}
        <Route path="/login" element={<Login />} />

        {/* Private Admin Portal Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="institutions" element={<OrganizationsManagement />} />
          <Route path="academics" element={<AcademicsManagement />} />
          <Route path="opportunities" element={<OpportunitiesManagement />} />
          <Route path="mous" element={<MouManagement />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="audit-logs" element={<AuditLogsManagement />} />
          <Route path="settings" element={<SettingsManagement />} />
        </Route>

        {/* Fallback Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </Router>
  );
};

export default App;
