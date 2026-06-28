import client from "./client";
import type {
  Department,
  Course,
  ResearchArea,
  Institution,
  InstitutionCategory,
  Opportunity,
  MoU,
  DashboardStats,
} from "../types";

// ==========================================
// ACADEMICS API
// ==========================================
export const AcademicsApi = {
  getDepartments: async () => {
    const res = await client.get("/departments/");
    return res.data;
  },
  createDepartment: async (data: Partial<Department>) => {
    const res = await client.post("/departments/", data);
    return res.data;
  },
  getCourses: async () => {
    const res = await client.get("/courses/");
    return res.data;
  },
  createCourse: async (data: Partial<Course>) => {
    const res = await client.post("/courses/", data);
    return res.data;
  },
  getResearchAreas: async () => {
    const res = await client.get("/research-areas/");
    return res.data;
  },
  createResearchArea: async (data: Partial<ResearchArea>) => {
    const res = await client.post("/research-areas/", data);
    return res.data;
  },
};

// ==========================================
// INSTITUTIONS (PARTNERS) API
// ==========================================
export const InstitutionsApi = {
  getInstitutions: async (params?: any) => {
    const res = await client.get("/institutions/", { params });
    return res.data;
  },
  getInstitution: async (id: number | string) => {
    const res = await client.get(`/institutions/${id}/`);
    return res.data;
  },
  createInstitution: async (data: Partial<Institution>) => {
    const res = await client.post("/institutions/", data);
    return res.data;
  },
  updateInstitution: async (id: number | string, data: Partial<Institution>) => {
    const res = await client.put(`/institutions/${id}/`, data);
    return res.data;
  },
  deleteInstitution: async (id: number | string) => {
    const res = await client.delete(`/institutions/${id}/`);
    return res.data;
  },
  getCategories: async () => {
    const res = await client.get("/institution-categories/");
    return res.data;
  },
  createCategory: async (data: Partial<InstitutionCategory>) => {
    const res = await client.post("/institution-categories/", data);
    return res.data;
  },
};

// ==========================================
// OPPORTUNITIES API
// ==========================================
export const OpportunitiesApi = {
  getOpportunities: async (params?: any) => {
    const res = await client.get("/opportunities/", { params });
    return res.data;
  },
  getOpportunity: async (id: number | string) => {
    const res = await client.get(`/opportunities/${id}/`);
    return res.data;
  },
  createOpportunity: async (data: Partial<Opportunity>) => {
    const res = await client.post("/opportunities/", data);
    return res.data;
  },
  updateOpportunity: async (id: number | string, data: Partial<Opportunity>) => {
    const res = await client.put(`/opportunities/${id}/`, data);
    return res.data;
  },
  deleteOpportunity: async (id: number | string) => {
    const res = await client.delete(`/opportunities/${id}/`);
    return res.data;
  },
};

// ==========================================
// DOCUMENTS API
// ==========================================
export const DocumentsApi = {
  getDocuments: async (params?: any) => {
    const res = await client.get("/documents/", { params });
    return res.data;
  },
  uploadDocument: async (formData: FormData) => {
    const res = await client.post("/documents/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },
  deleteDocument: async (id: number | string) => {
    const res = await client.delete(`/documents/${id}/`);
    return res.data;
  },
};

// ==========================================
// MOU API
// ==========================================
export const MoUsApi = {
  getMoUs: async (params?: any) => {
    const res = await client.get("/mous/", { params });
    return res.data;
  },
  getMoU: async (id: number | string) => {
    const res = await client.get(`/mous/${id}/`);
    return res.data;
  },
  createMoU: async (data: Partial<MoU>) => {
    const res = await client.post("/mous/", data);
    return res.data;
  },
  updateMoU: async (id: number | string, data: Partial<MoU>) => {
    const res = await client.put(`/mous/${id}/`, data);
    return res.data;
  },
  deleteMoU: async (id: number | string) => {
    const res = await client.delete(`/mous/${id}/`);
    return res.data;
  },
};

// ==========================================
// USER & PROFILE MANAGEMENT API
// ==========================================
export const UsersApi = {
  getPendingUsers: async () => {
    const res = await client.get("/users/pending_approvals/");
    return res.data;
  },
  approveUser: async (id: string | number) => {
    const res = await client.post(`/users/${id}/approve/`);
    return res.data;
  },
  registerUser: async (data: any) => {
    const res = await client.post("/users/register/", data);
    return res.data;
  },
  getUsersList: async () => {
    const res = await client.get("/users/");
    return res.data;
  },
};

// ==========================================
// DASHBOARD & ANALYTICS API
// ==========================================
export const DashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const res = await client.get("/dashboard/summary/");
    return res.data;
  },
};

// ==========================================
// NOTIFICATIONS API
// ==========================================
export const NotificationsApi = {
  getNotifications: async () => {
    const res = await client.get("/notifications/");
    return res.data;
  },
  markRead: async (id: number | string) => {
    const res = await client.post(`/notifications/${id}/mark_read/`);
    return res.data;
  },
  markAllRead: async () => {
    const res = await client.post("/notifications/mark_all_read/");
    return res.data;
  },
};

// ==========================================
// SETTINGS API
// ==========================================
export const SettingsApi = {
  getSettings: async () => {
    const res = await client.get("/settings/");
    return res.data;
  },
  updateSettings: async (data: any) => {
    const res = await client.post("/settings/update_settings/", data);
    return res.data;
  },
};

// ==========================================
// AUDIT LOGS API
// ==========================================
export const AuditLogsApi = {
  getLogs: async (params?: any) => {
    const res = await client.get("/audit-logs/", { params });
    return res.data;
  },
};

// ==========================================
// SEARCH & REPORTS API
// ==========================================
export const SearchApi = {
  globalSearch: async (query: string) => {
    const res = await client.get("/search/", { params: { q: query } });
    return res.data;
  },
};

export const ReportsApi = {
  exportReport: async (format: "csv" | "pdf", params?: any) => {
    const res = await client.get("/reports/export/", {
      params: { ...params, format },
      responseType: "blob",
    });
    return res.data;
  },
};
