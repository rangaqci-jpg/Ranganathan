/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface JobVacancy {
  id: string;
  title: string;
  company: string;
  category: string;
  type: 'Contract' | 'Temporary' | 'Permanent';
  scopeOfWork: string;
  serviceRequirements: string[];
  location: string;
  salaryRange: string;
  status: 'Active' | 'Draft';
  datePosted: string;
  applicantsCount: number;
}

export interface CandidateProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  appliedJobId: string; // "general" for General Database
  appliedJobTitle: string; // Title of job or "General Pool"
  resumeSummary: string;
  skills: string[];
  experienceYears: number;
  education: string;
  status: 'Pending' | 'Under Review' | 'Interviewing' | 'Shortlisted' | 'Rejected';
  dateSubmitted: string;
  resumeFileName?: string;
}

export interface ServiceDetail {
  id: string;
  category: string;
  title: string;
  description: string;
  subservices: string[];
  icon: string;
}

export interface RequisitionItem {
  role: string;
  count: number;
}

export interface ClientRequisition {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  location: string;
  notes?: string;
  requestedPositions: RequisitionItem[];
  status: 'Pending Review' | 'Sourcing Personnel' | 'Partially Filled' | 'Contract Active' | 'Completed';
  dateSubmitted: string;
}

export interface AllocationCategory {
  groupName: string;
  positions: string[];
}

