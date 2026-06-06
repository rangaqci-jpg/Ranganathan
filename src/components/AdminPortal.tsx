import React, { useState } from 'react';
import { JobVacancy, CandidateProfile, ServiceDetail, ClientRequisition, AllocationCategory } from '../types';
import { 
  Lock, 
  Trash2, 
  Edit3, 
  Plus, 
  Check, 
  X, 
  Search, 
  Briefcase, 
  Users, 
  SlidersHorizontal, 
  Eye, 
  AlertCircle, 
  Activity, 
  FolderEdit, 
  CheckCircle, 
  Clock, 
  HelpCircle,
  TrendingUp,
  Landmark,
  FileText,
  Settings
} from 'lucide-react';

import { categoryDisplayLabels } from './VacanciesSection';

interface AdminPortalProps {
  vacancies: JobVacancy[];
  candidates: CandidateProfile[];
  services: ServiceDetail[];
  requisitions?: ClientRequisition[];
  allocationCategories?: AllocationCategory[];
  onUpdateVacancies: (vacancies: JobVacancy[]) => void;
  onUpdateCandidates: (candidates: CandidateProfile[]) => void;
  onUpdateServices: (services: ServiceDetail[]) => void;
  onUpdateRequisitions?: (requisitions: ClientRequisition[]) => void;
  onUpdateAllocationCategories: (allocationCategories: AllocationCategory[]) => void;
}

export default function AdminPortal({
  vacancies,
  candidates,
  services,
  requisitions = [],
  allocationCategories = [],
  onUpdateVacancies,
  onUpdateCandidates,
  onUpdateServices,
  onUpdateRequisitions,
  onUpdateAllocationCategories
}: AdminPortalProps) {

  // Auth lock
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');

  // Admin section sub-tabs (Defaulting to client contract requisitions panel)
  const [adminTab, setAdminTab] = useState<'vacancies' | 'candidates' | 'services' | 'requisitions' | 'allocations'>('requisitions');

  // Search/Filters for contract requisitions
  const [reqSearch, setReqSearch] = useState('');
  const [reqStatusFilter, setReqStatusFilter] = useState('all');

  // Active requisition audit drawer
  const [reviewingRequisition, setReviewingRequisition] = useState<ClientRequisition | null>(null);

  // Search/Filters for candidates
  const [candSearch, setCandSearch] = useState('');
  const [candRoleFilter, setCandRoleFilter] = useState('all');
  const [candStatusFilter, setCandStatusFilter] = useState('all');

  // Active candidate reviewer drawer
  const [reviewingCandidate, setReviewingCandidate] = useState<CandidateProfile | null>(null);

  // Vacancy add/edit form states
  const [isVacancyModalOpen, setIsVacancyModalOpen] = useState(false);
  const [editingVacancyId, setEditingVacancyId] = useState<string | null>(null);
  const [vacTitle, setVacTitle] = useState('');
  const [vacCompany, setVacCompany] = useState('');
  const [vacCat, setVacCat] = useState<string>('staffing');
  const [vacType, setVacType] = useState<'Contract' | 'Temporary' | 'Permanent'>('Permanent');
  const [vacScope, setVacScope] = useState('');
  const [vacReqs, setVacReqs] = useState('');
  const [vacLoc, setVacLoc] = useState('');
  const [vacSalary, setVacSalary] = useState('');
  const [vacStatus, setVacStatus] = useState<'Active' | 'Draft'>('Active');

  // Service editing states
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [servDesc, setServDesc] = useState('');
  const [servSubs, setServSubs] = useState('');

  // Authenticate PIN
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1234' || pin === 'EXPRESS') {
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError('Incorrect authorization key. (Hint: enter "1234" to enter the demo console)');
    }
  };

  // Dynamic positions/categories handlers
  const handleAddNewCategory = () => {
    const nextList = [...(allocationCategories || []), { groupName: 'New Category Group', positions: ['New Role Position'] }];
    onUpdateAllocationCategories(nextList);
  };

  const handleDeleteCategory = (catIdx: number) => {
    const nextList = (allocationCategories || []).filter((_, idx) => idx !== catIdx);
    onUpdateAllocationCategories(nextList);
  };

  const handleCategoryNameChange = (catIdx: number, newName: string) => {
    const nextList = [...(allocationCategories || [])];
    nextList[catIdx] = { ...nextList[catIdx], groupName: newName };
    onUpdateAllocationCategories(nextList);
  };

  const handlePositionNameChange = (catIdx: number, posIdx: number, newPosName: string) => {
    const nextList = [...(allocationCategories || [])];
    const nextPositions = [...nextList[catIdx].positions];
    nextPositions[posIdx] = newPosName;
    nextList[catIdx] = { ...nextList[catIdx], positions: nextPositions };
    onUpdateAllocationCategories(nextList);
  };

  const handleDeletePosition = (catIdx: number, posIdx: number) => {
    const nextList = [...(allocationCategories || [])];
    const nextPositions = nextList[catIdx].positions.filter((_, idx) => idx !== posIdx);
    nextList[catIdx] = { ...nextList[catIdx], positions: nextPositions };
    onUpdateAllocationCategories(nextList);
  };

  const handleAddPositionToCategory = (catIdx: number) => {
    const nextList = [...(allocationCategories || [])];
    const nextPositions = [...nextList[catIdx].positions, 'New Position Option'];
    nextList[catIdx] = { ...nextList[catIdx], positions: nextPositions };
    onUpdateAllocationCategories(nextList);
  };

  // Create or Update Vacancy Action
  const handleVacancySubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!vacTitle || !vacCompany || !vacScope || !vacLoc) {
      alert('Key structural variables like Title, company, scope, and location are mandatory.');
      return;
    }

    const requirementsArray = vacReqs
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const finalRequirements = requirementsArray.length > 0 ? requirementsArray : ['Demonstrated attendance, safety compliance & skills certs'];

    if (editingVacancyId) {
      // Update existing
      const updated = vacancies.map(v => {
        if (v.id === editingVacancyId) {
          return {
            ...v,
            title: vacTitle,
            company: vacCompany,
            category: vacCat,
            type: vacType,
            scopeOfWork: vacScope,
            serviceRequirements: finalRequirements,
            location: vacLoc,
            salaryRange: vacSalary || 'Negotiable basis',
            status: vacStatus
          };
        }
        return v;
      });
      onUpdateVacancies(updated);
    } else {
      // Add new
      const randId = `job-${Math.floor(100 + Math.random() * 900)}`;
      const newVac: JobVacancy = {
        id: randId,
        title: vacTitle,
        company: vacCompany,
        category: vacCat,
        type: vacType,
        scopeOfWork: vacScope,
        serviceRequirements: finalRequirements,
        location: vacLoc,
        salaryRange: vacSalary || 'Market standard rate',
        status: vacStatus,
        datePosted: new Date().toISOString().split('T')[0],
        applicantsCount: 0
      };
      onUpdateVacancies([newVac, ...vacancies]);
    }

    setIsVacancyModalOpen(false);
    resetVacancyForm();
  };

  const resetVacancyForm = () => {
    setEditingVacancyId(null);
    setVacTitle('');
    setVacCompany('');
    setVacCat('technical');
    setVacType('Permanent');
    setVacScope('');
    setVacReqs('');
    setVacLoc('');
    setVacSalary('');
    setVacStatus('Active');
  };

  const handleEditVacancyClick = (v: JobVacancy) => {
    setEditingVacancyId(v.id);
    setVacTitle(v.title);
    setVacCompany(v.company);
    setVacCat(v.category);
    setVacType(v.type);
    setVacScope(v.scopeOfWork);
    setVacReqs(v.serviceRequirements.join('\n'));
    setVacLoc(v.location);
    setVacSalary(v.salaryRange);
    setVacStatus(v.status);
    setIsVacancyModalOpen(true);
  };

  const handleDeleteVacancy = (vId: string) => {
    if (confirm('Are you absolutely sure you want to delete this recruitment vacancy listing?')) {
      onUpdateVacancies(vacancies.filter(v => v.id !== vId));
    }
  };

  // Services Content Edits
  const handleServiceEditSave = (sId: string) => {
    const updated = services.map(s => {
      if (s.id === sId) {
        return {
          ...s,
          description: servDesc,
          subservices: servSubs.split('\n').map(item => item.trim()).filter(item => item.length > 0)
        };
      }
      return s;
    });
    onUpdateServices(updated);
    setEditingServiceId(null);
  };

  // Client requisition evaluation updates
  const handleUpdateRequisitionStatus = (rId: string, status: ClientRequisition['status']) => {
    const updated = requisitions.map(r => {
      if (r.id === rId) {
        return { ...r, status };
      }
      return r;
    });
    if (onUpdateRequisitions) {
      onUpdateRequisitions(updated);
    } else {
      localStorage.setItem('express_requisitions', JSON.stringify(updated));
    }
    if (reviewingRequisition && reviewingRequisition.id === rId) {
      setReviewingRequisition({ ...reviewingRequisition, status });
    }
  };

  const handleDeleteRequisition = (rId: string) => {
    if (confirm('Are you absolutely sure you want to delete this contract manpower requisition?')) {
      const updated = requisitions.filter(r => r.id !== rId);
      if (onUpdateRequisitions) {
        onUpdateRequisitions(updated);
      } else {
        localStorage.setItem('express_requisitions', JSON.stringify(updated));
      }
      setReviewingRequisition(null);
    }
  };

  // Filter requisitions logic
  const filteredRequisitions = requisitions.filter(r => {
    const matchesSearch = r.companyName.toLowerCase().includes(reqSearch.toLowerCase()) ||
                          r.contactName.toLowerCase().includes(reqSearch.toLowerCase()) ||
                          r.location.toLowerCase().includes(reqSearch.toLowerCase()) ||
                          r.requestedPositions.some(item => item.role.toLowerCase().includes(reqSearch.toLowerCase()));
    const matchesStatus = reqStatusFilter === 'all' ? true : r.status === reqStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Candidate evaluation updates
  const handleUpdateCandidateStatus = (cId: string, status: CandidateProfile['status']) => {
    const updated = candidates.map(c => {
      if (c.id === cId) {
        return { ...c, status };
      }
      return c;
    });
    onUpdateCandidates(updated);
    if (reviewingCandidate) {
      setReviewingCandidate({ ...reviewingCandidate, status });
    }
  };

  // Filter candidates logic
  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = c.fullName.toLowerCase().includes(candSearch.toLowerCase()) ||
                          c.skills.some(s => s.toLowerCase().includes(candSearch.toLowerCase())) ||
                          c.resumeSummary.toLowerCase().includes(candSearch.toLowerCase());
    const matchesRole = candRoleFilter === 'all' 
      ? true 
      : candRoleFilter === 'general' 
        ? c.appliedJobId === 'general' 
        : c.appliedJobId !== 'general';
    const matchesStatus = candStatusFilter === 'all' ? true : c.status === candStatusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Login view if not logged in
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-16 px-4">
        <div className="bg-white border border-slate-200 p-6 sm:p-8 text-center space-y-6 rounded-none">
          <div className="border border-slate-200 bg-slate-100 text-slate-800 w-12 h-12 flex items-center justify-center mx-auto rounded-none">
            <Lock className="h-6 w-6" />
          </div>
          
          <div className="space-y-2">
            <h3 className="font-black text-xl text-slate-900 uppercase tracking-tight">Express Recruitment Admin</h3>
            <p className="text-xs text-slate-500 font-normal leading-relaxed">
              Express Employment restricted console. Access required for administrative posting, services layout updates, and candidate audits compliance.
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-left text-[10px] font-bold text-slate-400 pl-1 uppercase tracking-wider">Demographic passcodePIN</label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                className="w-full text-center tracking-widest text-lg font-mono font-bold px-4 py-3 border border-slate-200 focus:outline-none focus:border-slate-900 bg-slate-50 rounded-none"
              />
            </div>

            {pinError && (
              <p className="text-red-500 text-[10px] font-bold flex items-center justify-center bg-red-50 p-2 border border-red-200 rounded-none">
                <AlertCircle className="h-3.5 w-3.5 mr-1" />
                {pinError}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 transition cursor-pointer uppercase tracking-widest text-xs rounded-none"
            >
              Verify Authorized Key
            </button>
          </form>

          <div className="pt-2">
            <button
              onClick={() => {
                setPin('1234');
                setPinError('');
              }}
              className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-850 text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-none transition cursor-pointer"
            >
              Auto-fill Demo Code (1234)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4 animate-fadeIn">
      
      {/* Admin Session Banner */}
      <div className="bg-slate-900 border border-slate-800 text-white p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 rounded-none">
        <div className="flex items-center space-x-3.5">
          <div className="bg-slate-950 text-white p-3 border border-slate-800 rounded-none">
            <Landmark className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white">Recruitment Control Workspace</h2>
            <p className="text-[9px] text-slate-400 font-mono uppercase tracking-widest bg-slate-950 px-2.5 py-1 border border-slate-850 mt-1">AUTHORIZED SESSION: HR ADMIN EXECUTIVE</p>
          </div>
        </div>

        {/* Dashboard metrics */}
        <div className="grid grid-cols-4 gap-6 text-center border-t border-slate-800 md:border-t-0 md:border-l md:pt-0 md:pl-6 shrink-0 pt-4 select-none">
          <div>
            <p className="text-base sm:text-lg font-bold text-[#bae0fd] font-mono">{requisitions.length}</p>
            <p className="text-[9px] text-slate-400 font-bold tracking-widest uppercase">Contract Requests</p>
          </div>
          <div>
            <p className="text-base sm:text-lg font-bold text-white font-mono">{vacancies.length}</p>
            <p className="text-[9px] text-slate-400 font-bold tracking-widest uppercase">Vacancies</p>
          </div>
          <div>
            <p className="text-base sm:text-lg font-bold text-primary-300 font-mono">{candidates.length}</p>
            <p className="text-[9px] text-slate-400 font-bold tracking-widest uppercase">Applicants</p>
          </div>
          <div>
            <p className="text-base sm:text-lg font-bold text-teal-400 font-mono">
              {candidates.filter(c => c.appliedJobId === 'general').length}
            </p>
            <p className="text-[9px] text-slate-400 font-bold tracking-widest uppercase">Gen Pool</p>
          </div>
        </div>
      </div>

      {/* Workspace Menu Tabs */}
      <div className="flex flex-wrap border border-slate-200 bg-slate-50 p-1.5 gap-1 select-none">
        <button
          onClick={() => setAdminTab('requisitions')}
          className={`flex items-center space-x-2 px-4.5 py-2.5 text-xs font-black uppercase tracking-wider border transition cursor-pointer ${
            adminTab === 'requisitions'
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <FileText className="h-4 w-4 text-sky-500" />
          <span>Client Staff Requisitions</span>
        </button>
        <button
          onClick={() => setAdminTab('vacancies')}
          className={`flex items-center space-x-2 px-4.5 py-2.5 text-xs font-black uppercase tracking-wider border transition cursor-pointer ${
            adminTab === 'vacancies'
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <Briefcase className="h-4 w-4" />
          <span>Manage Vacancies</span>
        </button>
        <button
          onClick={() => setAdminTab('candidates')}
          className={`flex items-center space-x-2 px-4.5 py-2.5 text-xs font-black uppercase tracking-wider border transition cursor-pointer ${
            adminTab === 'candidates'
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Candidate Database Pool</span>
        </button>
        <button
          onClick={() => setAdminTab('services')}
          className={`flex items-center space-x-2 px-4.5 py-2.5 text-xs font-black uppercase tracking-wider border transition cursor-pointer ${
            adminTab === 'services'
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <FolderEdit className="h-4 w-4" />
          <span>Edit Services Page Descriptions</span>
        </button>
        <button
          onClick={() => setAdminTab('allocations')}
          className={`flex items-center space-x-2 px-4.5 py-2.5 text-xs font-black uppercase tracking-wider border transition cursor-pointer ${
            adminTab === 'allocations'
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <Settings className="h-4 w-4 text-emerald-550" />
          <span>Personnel Drops & Positions Settings</span>
        </button>
      </div>

      {/* CORE ADMIN SECTIONS */}
      {adminTab === 'requisitions' && (
        <div className="space-y-6">
          <div className="bg-slate-100 p-4 border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 select-none">
            <div className="space-y-0.5 text-left">
              <h3 className="font-extrabold uppercase text-base text-slate-800 tracking-tight">Contract Personnel Requisitions</h3>
              <p className="text-xs text-slate-500 font-normal">Review incoming contract manpower requests submitted by portal clients.</p>
            </div>
            
            <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={reqSearch}
                  onChange={(e) => setReqSearch(e.target.value)}
                  placeholder="Search client/company..."
                  className="pl-8.5 pr-3 py-2 text-xs border border-slate-250 bg-white focus:outline-none focus:border-slate-900 rounded-none w-48 font-bold placeholder-slate-400 text-slate-700 uppercase"
                />
              </div>
              
              <select
                value={reqStatusFilter}
                onChange={(e) => setReqStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs border border-slate-250 bg-white focus:outline-none focus:border-slate-900 rounded-none font-bold uppercase cursor-pointer"
              >
                <option value="all">All statuses</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Sourcing Personnel">Sourcing Personnel</option>
                <option value="Partially Filled">Partially Filled</option>
                <option value="Contract Active">Contract Active</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="bg-white border border-slate-200 overflow-hidden rounded-none shadow-none">
            {filteredRequisitions.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                    <th className="px-6 py-4">Client Company</th>
                    <th className="px-6 py-4">Key Contact Details</th>
                    <th className="px-6 py-4">Operation Site</th>
                    <th className="px-6 py-4 text-center">Allocated Roles & Counts</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 font-light text-sm text-gray-700 font-sans">
                  {filteredRequisitions.map((r) => {
                    const totalHeads = r.requestedPositions.reduce((acc, curr) => acc + curr.count, 0);
                    return (
                      <tr key={r.id} className="hover:bg-slate-50/60 border-b border-slate-100">
                        <td className="px-6 py-4 text-left">
                          <p className="font-bold text-slate-900 uppercase tracking-tight">{r.companyName}</p>
                          <p className="text-[10px] text-slate-400 font-bold font-mono tracking-wider uppercase">REQ-ID: {r.id.substring(0, 8).toUpperCase()}</p>
                        </td>
                        <td className="px-6 py-4 text-left">
                          <p className="text-xs font-bold text-slate-800 uppercase">{r.contactName}</p>
                          <p className="text-[10px] text-slate-500 font-sans tracking-tight">{r.email} • {r.phone}</p>
                        </td>
                        <td className="px-6 py-4 text-left">
                          <span className="text-xs font-mono font-bold text-slate-600 uppercase">{r.location}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex flex-wrap gap-1 justify-center max-w-sm mx-auto">
                            {r.requestedPositions.map((it, idx) => (
                              <span key={idx} className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2.5 py-1 border border-slate-200 rounded uppercase font-sans">
                                {it.role} : <strong className="text-[#0a65af]">{it.count}</strong>
                              </span>
                            ))}
                            <span className="w-full text-[10px] text-slate-400 mt-1 font-bold">Total Request: {totalHeads} manpower heads</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-left">
                          <span className={`inline-flex items-center text-[9px] font-extrabold px-2.5 py-1 uppercase tracking-widest border ${
                            r.status === 'Completed' ? 'bg-slate-900 text-white border-slate-900' :
                            r.status === 'Contract Active' ? 'bg-[#0a65af] text-white border-[#0a65af]' :
                            r.status === 'Sourcing Personnel' ? 'bg-emerald-55 text-emerald-800 border-emerald-200' :
                            r.status === 'Partially Filled' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                            'bg-amber-50 text-[#9a6a1a] border-amber-200'
                          }`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => setReviewingRequisition(r)}
                              className="bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-800 border border-slate-250 font-bold text-xs px-3 py-1.5 transition inline-flex items-center space-x-1 cursor-pointer"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              <span>Audit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteRequisition(r.id)}
                              className="p-1.5 border border-red-200 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white transition cursor-pointer"
                              title="Delete Requisition"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-wider text-xs select-none">
                <FileText className="h-8 w-8 mx-auto mb-2 text-slate-300 animate-pulse" />
                No contract personnel requisitions logged in active system feed.
              </div>
            )}
          </div>
        </div>
      )}

      {/* CORE ADMIN SECTIONS */}
      {adminTab === 'vacancies' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-slate-100 p-4 border border-slate-200">
            <div className="space-y-0.5">
              <h3 className="font-extrabold uppercase text-base text-slate-800 tracking-tight">Job Posting Management</h3>
              <p className="text-xs text-slate-500 font-normal">Publish new industrial roles or edit active requirements schedules.</p>
            </div>
            <button
              onClick={() => {
                resetVacancyForm();
                setIsVacancyModalOpen(true);
              }}
              className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 transition cursor-pointer rounded-none uppercase tracking-wider"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Vacancy</span>
            </button>
          </div>

          <div className="bg-white border border-slate-200 overflow-hidden rounded-none shadow-none">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                  <th className="px-6 py-4">Title & Company</th>
                  <th className="px-6 py-4">Solution Stream</th>
                  <th className="px-6 py-4">Stream Type</th>
                  <th className="px-6 py-4">Location & Post</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Applicants</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-light text-sm text-gray-700">
                {vacancies.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/60 border-b border-slate-100">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900 uppercase tracking-tight">{v.title}</p>
                      <p className="text-[10px] text-slate-400 font-bold font-mono uppercase tracking-wider">{v.company}</p>
                    </td>
                    <td className="px-6 py-4 uppercase text-[10px] font-black text-slate-700 font-mono">
                      {categoryDisplayLabels[v.category] || v.category}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 border border-slate-200 text-slate-800 text-[10px] font-black uppercase tracking-wider px-2 py-1 select-none">
                        {v.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-bold text-slate-700 uppercase">{v.location}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{v.datePosted}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center text-[9px] font-extrabold px-2.5 py-1 uppercase tracking-widest ${
                        v.status === 'Active' ? 'bg-slate-900 text-white border border-slate-900' : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-black text-slate-900 uppercase font-mono">{v.applicantsCount} active</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => handleEditVacancyClick(v)}
                          className="p-2 border border-slate-200 bg-slate-50 hover:bg-slate-900 text-slate-600 hover:text-white transition cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteVacancy(v.id)}
                          className="p-2 border border-red-200 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white transition cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {adminTab === 'candidates' && (
        <div className="space-y-6">
          
          {/* Candidate database search console */}
          <div className="bg-white p-5 border border-slate-200 space-y-4 rounded-none shadow-none">
            <h3 className="font-extrabold uppercase text-base text-slate-800 tracking-tight">Active Candidate Database Registry</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              
              <div className="relative md:col-span-5">
                <Search className="absolute left-3 top-4 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search candidate name, skills index, or statement keywords..."
                  value={candSearch}
                  onChange={(e) => setCandSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 border border-slate-200 text-xs focus:outline-none focus:border-slate-900 bg-slate-50 font-bold uppercase tracking-wider rounded-none"
                />
              </div>

              <div className="md:col-span-3">
                <select
                  value={candRoleFilter}
                  onChange={(e) => setCandRoleFilter(e.target.value)}
                  className="w-full px-3 py-3 border border-slate-200 text-xs focus:outline-none focus:border-slate-900 bg-slate-50 font-bold uppercase tracking-wider cursor-pointer rounded-none"
                >
                  <option value="all">All Application Streams</option>
                  <option value="jobs">Specific Open Vacancies</option>
                  <option value="general">General Placement Pool</option>
                </select>
              </div>

              <div className="md:col-span-4">
                <select
                  value={candStatusFilter}
                  onChange={(e) => setCandStatusFilter(e.target.value)}
                  className="w-full px-3 py-3 border border-slate-200 text-xs focus:outline-none focus:border-slate-900 bg-slate-50 font-bold uppercase tracking-wider cursor-pointer rounded-none"
                >
                  <option value="all">All Verification Statuses</option>
                  <option value="Pending">Pending Audit</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Interviewing">Interviewing</option>
                  <option value="Shortlisted">Shortlisted (Priority Hire)</option>
                  <option value="Rejected">Compliance Rejected</option>
                </select>
              </div>

            </div>
          </div>

          <div className="bg-white border border-slate-200 overflow-hidden shadow-none rounded-none">
            {filteredCandidates.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                    <th className="px-6 py-4">Nominee Full Name</th>
                    <th className="px-6 py-4">Candidacy Objective/Stream</th>
                    <th className="px-6 py-4">Experience & Degree</th>
                    <th className="px-6 py-4">Skills Tags</th>
                    <th className="px-6 py-4">Status Stage</th>
                    <th className="px-6 py-4 text-right">Resume Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 font-light text-sm text-gray-700">
                  {filteredCandidates.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/60 border-b border-slate-100">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900 uppercase tracking-tight">{c.fullName}</p>
                        <p className="text-[10px] text-slate-400 font-bold font-mono tracking-wide mt-0.5">{c.email}</p>
                      </td>
                      <td className="px-6 py-4 max-w-[180px] truncate text-xs font-bold text-slate-700 font-mono uppercase">
                        {c.appliedJobTitle}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-extrabold text-slate-800 uppercase">{c.experienceYears} Years Exp</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase truncate max-w-[140px] mt-0.5">{c.education}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {c.skills.slice(0, 3).map((sk, idx) => (
                            <span key={idx} className="bg-slate-100 text-slate-800 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 border border-slate-200">
                              {sk}
                            </span>
                          ))}
                          {c.skills.length > 3 && <span className="text-[9px] text-slate-400 font-bold">+{c.skills.length - 3}</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-widest border ${
                          c.status === 'Shortlisted' ? 'bg-slate-900 text-white border-slate-900' :
                          c.status === 'Interviewing' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                          c.status === 'Under Review' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                          c.status === 'Rejected' ? 'bg-red-50 text-red-800 border-red-200' :
                          'bg-slate-100 text-slate-650 border-slate-200'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setReviewingCandidate(c)}
                          className="bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-800 border border-slate-200 font-bold text-xs px-3 py-1.5 transition inline-flex items-center space-x-1 cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Audit</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-wider text-xs">
                <Users className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                No candidates correspond to current query parameters.
              </div>
            )}
          </div>
        </div>
      )}

      {adminTab === 'services' && (
        <div className="space-y-6">
          <div className="bg-slate-100 p-4 border border-slate-200">
            <h3 className="font-extrabold uppercase text-base text-slate-800 tracking-tight">Services Layout Description Management</h3>
            <p className="text-xs text-slate-500 font-normal">Dynamically configure the active texts on our home landing page solutions list.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
            {services.map((service) => {
              const isEditing = editingServiceId === service.id;
              return (
                <div key={service.id} className="bg-white border border-slate-200 p-6 space-y-4 relative rounded-none shadow-none">
                  
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="font-extrabold uppercase tracking-tight text-slate-900 text-sm">{service.title}</h4>
                    <span className="text-[9px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 border border-slate-200 uppercase tracking-widest">
                      ID: {service.id}
                    </span>
                  </div>

                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">solutions block Description text</label>
                        <textarea
                          rows={4}
                          value={servDesc}
                          onChange={(e) => setServDesc(e.target.value)}
                          className="w-full text-xs p-3.5 border border-slate-200 rounded-none bg-slate-55 focus:outline-none focus:border-slate-800 font-sans"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Specialties & Capabilities List (One per line)</label>
                        <textarea
                          rows={4}
                          value={servSubs}
                          onChange={(e) => setServSubs(e.target.value)}
                          className="w-full text-xs p-3.5 border border-slate-200 rounded-none bg-slate-55 focus:outline-none focus:border-slate-800 font-mono"
                        />
                      </div>

                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setEditingServiceId(null)}
                          className="px-3.5 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider hover:bg-slate-55 transition"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleServiceEditSave(service.id)}
                          className="bg-slate-900 hover:bg-slate-850 text-white font-extrabold text-xs px-4 py-1.5 transition uppercase tracking-wider rounded-none cursor-pointer"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-xs text-slate-600 leading-relaxed">{service.description}</p>
                      
                      <div className="space-y-1.5">
                        <h5 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Sub-disciplines active:</h5>
                        <ul className="text-xs text-slate-700 font-bold space-y-1.5 shadow-none">
                          {service.subservices.map((sub, i) => (
                            <li key={i} className="flex items-center bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-none font-mono text-[11px]">
                              <span className="w-1.5 h-1.5 bg-slate-900 mr-2 shrink-0"></span>
                              <span>{sub}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => {
                            setEditingServiceId(service.id);
                            setServDesc(service.description);
                            setServSubs(service.subservices.join('\n'));
                          }}
                          className="flex items-center space-x-1.5 text-xs font-extrabold text-slate-800 bg-slate-100 hover:bg-slate-900 hover:text-white border border-slate-200 px-3.5 py-2 transition cursor-pointer rounded-none uppercase tracking-wider"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          <span>Modify Details</span>
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>
      )}

      {adminTab === 'allocations' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-slate-100 p-4 border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-left">
              <h3 className="font-extrabold uppercase text-base text-slate-800 tracking-tight">Personnel Dropdown Configurations</h3>
              <p className="text-xs text-slate-500 font-normal">Add and edit candidate categories and requisition positions available to users during checkout.</p>
            </div>
            <button
              onClick={handleAddNewCategory}
              className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-4 py-2.5 transition uppercase tracking-wider flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" />
              <span>Create New Category Group</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(allocationCategories || []).map((cat, catIdx) => (
              <div key={catIdx} className="bg-white border border-slate-250 p-6 space-y-4 rounded-xl shadow-xs">
                
                {/* Category Header with Title Editing */}
                <div className="flex items-end justify-between border-b border-slate-100 pb-3">
                  <div className="flex-1 mr-4">
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 text-left">Category Group Title</label>
                    <input
                      type="text"
                      value={cat.groupName}
                      onChange={(e) => handleCategoryNameChange(catIdx, e.target.value)}
                      placeholder="e.g. Specialists, Engineers"
                      className="w-full text-xs font-semibold px-2 py-1.5 border border-slate-200 focus:outline-none focus:border-slate-800 font-sans text-slate-850"
                    />
                  </div>
                  <button
                    onClick={() => handleDeleteCategory(catIdx)}
                    className="text-xs font-bold text-red-600 hover:text-red-700 uppercase tracking-wider hover:underline px-2 py-1 transition"
                    title="Delete Category Group"
                  >
                    Delete Group
                  </button>
                </div>

                {/* Positions management list */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-1">
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest text-left">Available Positions / Roles</label>
                    <span className="text-[10px] text-slate-400 font-mono italic">{cat.positions.length} Options</span>
                  </div>

                  <div className="space-y-2">
                    {cat.positions.map((pos, posIdx) => (
                      <div key={posIdx} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={pos}
                          onChange={(e) => handlePositionNameChange(catIdx, posIdx, e.target.value)}
                          placeholder="e.g. Lead Operator"
                          className="flex-grow text-xs px-3 py-2 border border-slate-200 bg-slate-50/55 rounded-lg focus:bg-white focus:outline-none focus:border-slate-850 text-slate-800"
                        />
                        <button
                          onClick={() => handleDeletePosition(catIdx, posIdx)}
                          className="p-2 border border-slate-200 bg-white hover:bg-red-50 text-slate-400 hover:text-red-650 hover:border-red-200 transition rounded-lg cursor-pointer"
                          title="Remove position option"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Position Button */}
                  <button
                    onClick={() => handleAddPositionToCategory(catIdx)}
                    className="w-full py-2 border border-dashed border-slate-250 hover:border-slate-400 text-slate-500 hover:text-slate-850 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 mt-3 bg-slate-50/30 hover:bg-slate-55"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Position Option</span>
                  </button>
                </div>

              </div>
            ))}
          </div>

          {(allocationCategories || []).length === 0 && (
            <div className="bg-white border border-slate-200 p-8 text-center text-slate-400 font-bold uppercase tracking-wider">
              No personnel allocation groups defined. Click "Create New Category Group" to establish one.
            </div>
          )}
        </div>
      )}

      {/* Audit & Evaluation Candidate Drawer Modal */}
      {reviewingCandidate && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-md h-screen border-l border-slate-200 shadow-xl overflow-y-auto flex flex-col justify-between p-6 sm:p-8 relative animate-slideLeft rounded-none">
            
            <button
              onClick={() => setReviewingCandidate(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 p-2 border border-slate-200 transition bg-slate-50 cursor-pointer"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="space-y-6">
              
              <div>
                <span className="text-[9px] font-mono tracking-widest bg-slate-100 text-slate-800 px-2 py-1 border border-slate-200 uppercase font-bold">
                  ID: {reviewingCandidate.id}
                </span>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mt-3">{reviewingCandidate.fullName}</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider font-mono mt-1">{reviewingCandidate.appliedJobTitle}</p>
              </div>

              {/* Status Update Console */}
              <div className="bg-slate-50 p-4.5 border border-slate-200 space-y-3 rounded-none">
                <h4 className="text-[9px] font-extrabold text-slate-400 tracking-widest uppercase font-mono">Administrative Evaluation Status</h4>
                
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { status: 'Under Review', label: 'Under Review', color: 'hover:bg-amber-100 hover:text-amber-800' },
                    { status: 'Interviewing', label: 'Interviewing', color: 'hover:bg-blue-100 hover:text-blue-800' },
                    { status: 'Shortlisted', label: 'Shortlist (Recruit)', color: 'hover:bg-slate-900 hover:text-white' },
                    { status: 'Rejected', label: 'Reject', color: 'hover:bg-red-100 hover:text-red-850' }
                  ].map((btn) => {
                    const standsActive = reviewingCandidate.status === btn.status;
                    return (
                      <button
                        key={btn.status}
                        onClick={() => handleUpdateCandidateStatus(reviewingCandidate.id, btn.status as any)}
                        className={`py-2 px-3 text-xs font-bold border transition-all text-center cursor-pointer rounded-none uppercase tracking-wider ${
                          standsActive 
                            ? 'bg-slate-900 border-slate-900 text-white font-black' 
                            : `border-slate-200 bg-white text-slate-600 ${btn.color}`
                        }`}
                      >
                        {btn.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Informational parameter list */}
              <div className="space-y-4">
                
                <div className="border-b border-slate-100 pb-3">
                  <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Experience Years</h4>
                  <p className="text-xs text-slate-800 font-bold uppercase tracking-wide">{reviewingCandidate.experienceYears} Years active field knowledge</p>
                </div>

                <div className="border-b border-slate-100 pb-3">
                  <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Applicant Contact Channel</h4>
                  <p className="text-xs text-slate-800 font-bold">📨 {reviewingCandidate.email}</p>
                  <p className="text-xs text-slate-800 font-bold mt-1">📞 {reviewingCandidate.phone}</p>
                </div>

                <div className="border-b border-slate-100 pb-3">
                  <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Education Background</h4>
                  <p className="text-xs text-slate-800 font-bold uppercase">{reviewingCandidate.education}</p>
                </div>

                <div className="border-b border-slate-100 pb-3">
                  <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Verified Competency List</h4>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {reviewingCandidate.skills.map((sk, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-800 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 border border-slate-200 select-none">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Curriculum Vitae Cover Summary</h4>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 font-normal italic p-3 border border-slate-200 rounded-none">
                    &ldquo;{reviewingCandidate.resumeSummary}&rdquo;
                  </p>
                </div>

                {reviewingCandidate.resumeFileName && (
                  <div className="bg-slate-50 p-3 border border-slate-200 flex items-center justify-between text-xs text-slate-800 rounded-none">
                    <span className="font-mono text-[10px] truncate max-w-[200px]">{reviewingCandidate.resumeFileName}</span>
                    <span className="text-[9px] bg-slate-200 px-2.5 py-1 text-slate-900 border border-slate-300 font-bold uppercase tracking-wider select-none">SECURE CLOUD DOC</span>
                  </div>
                )}

              </div>

            </div>

            <div className="pt-6 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setReviewingCandidate(null)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3.5 text-xs uppercase tracking-widest transition cursor-pointer rounded-none"
              >
                Conclude candidate profile evaluation
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Audit & Evaluation Requisition Drawer Modal */}
      {reviewingRequisition && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex justify-end select-none">
          <div className="bg-white w-full max-w-md h-screen border-l border-slate-200 shadow-xl overflow-y-auto flex flex-col justify-between p-6 sm:p-8 relative animate-slideLeft rounded-none">
            
            <button
              onClick={() => setReviewingRequisition(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 p-2 border border-slate-200 transition bg-slate-50 cursor-pointer"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="space-y-6">
              
              <div>
                <span className="text-[9px] font-mono tracking-widest bg-slate-100 text-slate-800 px-2 py-1 border border-slate-200 uppercase font-bold">
                  REQ-ID: {reviewingRequisition.id.toUpperCase()}
                </span>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mt-3">{reviewingRequisition.companyName}</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider font-mono mt-1">Operational Manpower Allocation</p>
              </div>

              {/* Status Update Console */}
              <div className="bg-slate-50 p-4.5 border border-slate-200 space-y-3 rounded-none text-left">
                <h4 className="text-[9px] font-extrabold text-slate-405 tracking-widest uppercase font-mono">Administrative Evaluation Status</h4>
                
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { status: 'Pending Review', label: 'Pending Review', color: 'hover:bg-amber-100 hover:text-amber-800' },
                    { status: 'Sourcing Personnel', label: 'Sourcing Personnel', color: 'hover:bg-emerald-100 hover:text-emerald-850' },
                    { status: 'Partially Filled', label: 'Partially Filled', color: 'hover:bg-blue-100 hover:text-blue-800' },
                    { status: 'Contract Active', label: 'Contract Active', color: 'hover:bg-[#0a65af] hover:text-white' },
                    { status: 'Completed', label: 'Completed', color: 'hover:bg-slate-900 hover:text-white' }
                  ].map((btn) => {
                    const standsActive = reviewingRequisition.status === btn.status;
                    return (
                      <button
                        key={btn.status}
                        onClick={() => handleUpdateRequisitionStatus(reviewingRequisition.id, btn.status as any)}
                        className={`py-2 px-1 text-[10px] font-bold border transition-all text-center cursor-pointer rounded-none uppercase tracking-wider ${
                          standsActive 
                            ? 'bg-slate-900 border-slate-900 text-white font-black' 
                            : `border-slate-200 bg-white text-slate-600 ${btn.color}`
                        }`}
                      >
                        {btn.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Detailed allocated parameters list */}
              <div className="space-y-4 text-left font-sans">
                
                <div className="border-b border-slate-100 pb-3">
                  <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Allocated Personnel</h4>
                  <div className="space-y-1.5">
                    {reviewingRequisition.requestedPositions.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-slate-50 border border-slate-250 px-3 py-2 font-mono text-xs">
                        <span className="font-bold text-slate-800 uppercase">{item.role}</span>
                        <span className="font-extrabold text-[#0a65af] text-sm bg-white border border-slate-300 px-3 py-0.5">{item.count} heads</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-b border-slate-100 pb-3">
                  <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-mono">Client Contact Channel</h4>
                  <p className="text-xs text-slate-850 font-extrabold uppercase">{reviewingRequisition.contactName}</p>
                  <p className="text-xs text-slate-700 font-bold mt-1">📨 {reviewingRequisition.email}</p>
                  <p className="text-xs text-slate-705 font-bold mt-0.5">📞 {reviewingRequisition.phone}</p>
                </div>

                <div className="border-b border-slate-100 pb-3">
                  <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-mono">Deployment Site / Location</h4>
                  <p className="text-xs text-slate-850 font-bold uppercase">{reviewingRequisition.location}</p>
                </div>

                <div>
                  <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-mono">Scope Notes & Remarks</h4>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 font-normal p-3.5 border border-slate-200 rounded-none whitespace-pre-wrap font-sans normal-case">
                    {reviewingRequisition.notes || "No extra requirements or instructions provided by client."}
                  </p>
                </div>

              </div>

            </div>

            <div className="pt-6 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setReviewingRequisition(null)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3.5 text-xs uppercase tracking-widest transition cursor-pointer rounded-none"
              >
                Conclude Requisition Review
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Add / Edit Vacancy Modal Form */}
      {isVacancyModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex justify-center items-center p-4">
          <div className="bg-white w-full max-w-xl border border-slate-300 shadow-2xl overflow-hidden animate-slideUp rounded-none">
            
            <div className="bg-slate-900 text-white p-5 flex justify-between items-center">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-white">
                {editingVacancyId ? 'Modify Opportunity Specifications' : 'Draft New Opportunity requirements'}
              </h3>
              <button 
                onClick={() => setIsVacancyModalOpen(false)}
                className="text-white/70 hover:text-white p-1 border border-slate-800 bg-slate-850 hover:bg-slate-950 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleVacancySubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Opportunity Position Title *</label>
                  <input
                    type="text"
                    required
                    value={vacTitle}
                    onChange={(e) => setVacTitle(e.target.value)}
                    placeholder="e.g. Forklift operator, compliance executive"
                    className="w-full px-3 py-2.5 text-xs border border-slate-200 bg-slate-50 focus:outline-none focus:border-slate-900 font-bold uppercase tracking-wider rounded-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Company/Client Employer *</label>
                  <input
                    type="text"
                    required
                    value={vacCompany}
                    onChange={(e) => setVacCompany(e.target.value)}
                    placeholder="e.g. Express Logistics"
                    className="w-full px-3 py-2.5 text-xs border border-slate-200 bg-slate-50 focus:outline-none focus:border-slate-900 font-bold uppercase tracking-wider rounded-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Solution Stream Category</label>
                  <select
                    value={vacCat}
                    onChange={(e) => setVacCat(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs border border-slate-200 bg-slate-50 focus:outline-none focus:border-slate-900 font-bold uppercase tracking-wider cursor-pointer rounded-none text-slate-800"
                  >
                    <option value="staffing">Contract, Temporary & Permanent Staffing</option>
                    <option value="drivers_forklift">Drivers and Forklift Operators</option>
                    <option value="hr_payroll">HR, Payroll and Statutory Compliance</option>
                    <option value="painters_welders">Painters, Welders and Maintenance Operators</option>
                    <option value="industrial_manpower">Skilled and Unskilled Industrial Manpower</option>
                    <option value="facility_security">Security, Gardening and House Keeping</option>
                    <option value="skill_development">Skill Development & Training Programs</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Stream Classification type</label>
                  <select
                    value={vacType}
                    onChange={(e) => setVacType(e.target.value as any)}
                    className="w-full px-3 py-2.5 text-xs border border-slate-200 bg-slate-50 focus:outline-none focus:border-slate-900 font-bold uppercase tracking-wider cursor-pointer rounded-none"
                  >
                    <option value="Permanent">Permanent Position</option>
                    <option value="Contract">Contract Placement</option>
                    <option value="Temporary">Temporary/Seasonal</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Worksite Location *</label>
                  <input
                    type="text"
                    required
                    value={vacLoc}
                    onChange={(e) => setVacLoc(e.target.value)}
                    placeholder="e.g. Industrial Park, Downtown"
                    className="w-full px-3 py-2.5 text-xs border border-slate-200 bg-slate-50 focus:outline-none focus:border-slate-900 font-bold uppercase tracking-wider rounded-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Salary Range / Compensation</label>
                  <input
                    type="text"
                    value={vacSalary}
                    onChange={(e) => setVacSalary(e.target.value)}
                    placeholder="e.g. ₹250/hour, ₹6,00,000/year"
                    className="w-full px-3 py-2.5 text-xs border border-slate-200 bg-slate-50 focus:outline-none focus:border-slate-900 font-bold uppercase tracking-wider rounded-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Task Scope & Functional Schedulings *</label>
                <textarea
                  required
                  rows={3}
                  value={vacScope}
                  onChange={(e) => setVacScope(e.target.value)}
                  placeholder="Summarize structural goals, daily work shift patterns, and equipment operated..."
                  className="w-full p-3.5 text-xs border border-slate-200 bg-slate-50 focus:outline-none focus:border-slate-900 font-sans rounded-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Prerequisite Certifications (one requirement per line)</label>
                <textarea
                  rows={4}
                  value={vacReqs}
                  onChange={(e) => setVacReqs(e.target.value)}
                  placeholder="e.g. Forklift Class IV license&#10;OSHA-10 card certification required&#10;Clean drug test metrics"
                  className="w-full p-3.5 text-xs border border-slate-200 bg-slate-50 focus:outline-none focus:border-slate-900 font-mono rounded-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-250 pt-4">
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Publishing Status</label>
                  <div className="flex space-x-2 select-none">
                    {['Active', 'Draft'].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setVacStatus(st as any)}
                        className={`flex-1 py-2 text-xs font-black uppercase tracking-wider border transition cursor-pointer rounded-none ${
                          vacStatus === st
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-end justify-end space-x-2 select-none">
                  <button
                    type="button"
                    onClick={() => setIsVacancyModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-400 hover:bg-slate-50 border border-slate-200 transition cursor-pointer uppercase tracking-wider rounded-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-5 py-2 transition cursor-pointer uppercase tracking-wider border border-slate-900 rounded-none shadow-none"
                  >
                    {editingVacancyId ? 'Update Opportunity' : 'Publish Opportunity'}
                  </button>
                </div>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
