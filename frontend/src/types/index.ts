export type UserRole = "ADMIN" | "LECTURER" | "STUDENT";

export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  phone_number?: string;
  is_approved: boolean;
  avatar?: string;
  department?: string | number | null;
  is_staff?: boolean;
}

export interface Department {
  id: number;
  name: string;
  code: string;
  description?: string;
}

export type CourseLevel = "UNDERGRADUATE" | "POSTGRADUATE" | "DIPLOMA" | "CERTIFICATE";

export interface Course {
  id: number;
  name: string;
  code: string;
  department: number | Department;
  level: CourseLevel;
}

export interface ResearchArea {
  id: number;
  name: string;
  description?: string;
}

export type PartnerStatus = "STRATEGIC" | "EMERGING" | "STANDARD";

export interface InstitutionCategory {
  id: number;
  name: string;
  description?: string;
}

export interface Institution {
  id: number;
  custom_id: string;
  name: string;
  category: number | InstitutionCategory;
  county: string;
  address?: string;
  website?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_person_name?: string;
  contact_person_role?: string;
  description?: string;
  logo?: string;
  status: PartnerStatus;
  remarks?: string;
  departments?: number[] | Department[];
  courses?: number[] | Course[];
  has_internship: boolean;
  has_attachment: boolean;
  has_joint_research: boolean;
  has_staff_exchange: boolean;
  has_grant_writing: boolean;
  has_lab_training: boolean;
  has_curriculum_dev: boolean;
  has_funding: boolean;
  created_at: string;
  updated_at: string;
}

export type OpportunityType = "INTERNSHIP" | "ATTACHMENT" | "RESEARCH" | "FUNDING";
export type OpportunityStatus = "OPEN" | "CLOSED";

export interface Opportunity {
  id: number;
  title: string;
  institution: number | Institution;
  institution_details?: {
    id: number;
    name: string;
    custom_id: string;
    logo?: string;
    county: string;
  };
  type: OpportunityType;
  description: string;
  requirements?: string;
  slots: number;
  funding_amount?: string | number;
  research_area?: number | ResearchArea;
  research_area_details?: ResearchArea;
  application_deadline?: string;
  status: OpportunityStatus;
  created_at: string;
  updated_at: string;
}

export type DocumentType = "MOU" | "REPORT" | "LETTER" | "ANNOUNCEMENT" | "OTHER";

export interface Document {
  id: number;
  title: string;
  file: string;
  institution?: number | Institution;
  institution_name?: string;
  document_type: DocumentType;
  is_public: boolean;
  uploaded_at: string;
  uploaded_by?: string;
}

export type MouStatus = "ACTIVE" | "EXPIRED" | "TERMINATED";

export interface MoU {
  id: number;
  institution: number | Institution;
  institution_name?: string;
  institution_details?: {
    id: number;
    name: string;
    custom_id: string;
  };
  document: number | Document;
  document_details?: Document;
  document_file?: string;
  document_title?: string;
  start_date: string;
  end_date: string;
  status: MouStatus;
  signed_by_university: string;
  signed_by_institution: string;
  description?: string;
  created_at: string;
}

export interface Notification {
  id: number;
  user?: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface AuditLog {
  id: number;
  user: string;
  action: string;
  module: string;
  details: string;
  ip_address?: string;
  timestamp: string;
}

export interface DashboardStats {
  summary: {
    total_partners: number;
    active_mous: number;
    internships: number;
    attachments: number;
    research_collaborations: number;
    funding_opportunities: number;
    total_funding_amount: number;
  };
  charts: {
    category_distribution: Array<{ name: string; value: number }>;
    status_distribution: Array<{ name: string; value: number }>;
    county_distribution: Array<{ name: string; value: number }>;
  };
  recent_activities: AuditLog[];
}
