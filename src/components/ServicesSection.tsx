import React, { useState, useRef } from 'react';
import regeneratedHeroImg from '../assets/images/regenerated_image_1780637882593.png';
import { ServiceDetail, JobVacancy, CandidateProfile, ClientRequisition, AllocationCategory } from '../types';
import { 
  Plus, 
  MapPin, 
  IndianRupee, 
  Calendar, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  X,
  Search,
  ChevronRight,
  Filter,
  CheckCircle2
} from 'lucide-react';

interface ServicesSectionProps {
  services: ServiceDetail[];
  vacancies: JobVacancy[];
  allocationCategories?: AllocationCategory[];
  onBrowseJobs: (category: string) => void;
  onGeneralApply: () => void;
  onAddApplication: (candidate: Omit<CandidateProfile, 'id' | 'dateSubmitted' | 'status'>) => void;
  onAddRequisition?: (requisition: Omit<ClientRequisition, 'id' | 'dateSubmitted' | 'status'>) => void;
}

export default function ServicesSection({ 
  services, 
  vacancies = [], 
  allocationCategories = [],
  onBrowseJobs, 
  onGeneralApply,
  onAddApplication,
  onAddRequisition
}: ServicesSectionProps) {
  
  const defaultAllocationsFallback = [
    {
      groupName: "Staffing Models",
      positions: ["Contractual staffing", "Temporary staffing", "Permanent staffing"]
    },
    {
      groupName: "Employment Categories",
      positions: ["Technical and non-technical staff", "Technical industrial manpower"]
    },
    {
      groupName: "Industrial & Skilled Roles",
      positions: ["Operators", "Fabricators", "Forklift operators", "Drivers"]
    },
    {
      groupName: "General & Support Services",
      positions: ["Gardening", "Housekeeping", "Security guards"]
    },
    {
      groupName: "Administrative & Professional Services",
      positions: ["HR payroll", "Statutory compliance", "Skill development and training programs"]
    }
  ];

  const activeCategories = allocationCategories.length > 0 ? allocationCategories : defaultAllocationsFallback;

  // High-fidelity active service highlight
  const [selectedService, setSelectedService] = useState<string | null>(services[0]?.id || null);


  // Search & filter state inside the home screen feed
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Contract' | 'Temporary' | 'Permanent'>('All');

  // Job Modal/Apply state
  const [selectedJob, setSelectedJob] = useState<JobVacancy | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [experience, setExperience] = useState<number>(2);
  const [education, setEducation] = useState('');
  const [skills, setSkills] = useState('');
  const [resumeSummary, setResumeSummary] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [simulatedProgress, setSimulatedProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Client Opportunity creation state (specifying Contract manpower Requisitions)
  const [showClientModal, setShowClientModal] = useState(false);
  const [clientCompany, setClientCompany] = useState('');
  const [clientContactName, setClientContactName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientLocation, setClientLocation] = useState('');
  const [clientNotes, setClientNotes] = useState('');
  const [clientSuccess, setClientSuccess] = useState(false);

  interface AllocationItem {
    role: string;
    customRole?: string;
    count: number;
  }

  const [allocations, setAllocations] = useState<AllocationItem[]>([
    { role: 'Contractual staffing', count: 5 }
  ]);

  // Helper function to pre-fill requisition form details when choosing specific manpower supply types
  const handleOpenClientRequisition = (presetType?: string) => {
    setShowClientModal(true);
    setClientNotes('');

    if (presetType === 'staffing') {
      setAllocations([
        { role: 'Contractual staffing', count: 10 },
        { role: 'Temporary staffing', count: 5 }
      ]);
      setClientNotes('Requesting temporary/contract staffing solutions and workforce management support for our administrative operations.');
    } else if (presetType === 'drivers_forklift') {
      setAllocations([
        { role: 'Forklift operators', count: 6 },
        { role: 'Drivers', count: 4 }
      ]);
      setClientNotes('Need experienced logistics drivers and certified forklift operators with clean licensing records.');
    } else if (presetType === 'hr_payroll') {
      setAllocations([
        { role: 'HR payroll', count: 2 },
        { role: 'Statutory compliance', count: 1 }
      ]);
      setClientNotes('Require specialist support for payroll administration, EPF & ESIC contribution auditing, and labor legal advisory.');
    } else if (presetType === 'painters_welders') {
      setAllocations([
        { role: 'Operators', count: 4 },
        { role: 'Fabricators', count: 2 }
      ]);
      setClientNotes('Sourcing skilled structural welders (MIG/TIG), industrial painters, and machinery maintenance operators.');
    } else if (presetType === 'industrial_manpower') {
      setAllocations([
        { role: 'Technical industrial manpower', count: 12 }
      ]);
      setClientNotes('Need general skilled & unskilled labor for manufacturing line helpers, packing warehouse assistants, and loaders.');
    } else if (presetType === 'facility_security') {
      setAllocations([
        { role: 'Security guards', count: 6 },
        { role: 'Housekeeping', count: 4 }
      ]);
      setClientNotes('Requires security guards physical force protection, property gardening support, and industrial janitor housekeeping team.');
    } else if (presetType === 'skill_development') {
      setAllocations([
        { role: 'Skill development and training programs', count: 4 }
      ]);
      setClientNotes('Requesting vocational training programs instructors for safety onboarding drills and machine cert tutorials.');
    } else {
      setAllocations([
        { role: 'Contractual staffing', count: 5 }
      ]);
      setClientNotes('General contract manpower supply request.');
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter lists based on interactive inputs
  const activeVacancies = vacancies.filter(v => v.status === 'Active');
  
  const filteredHomeVacancies = activeVacancies.filter(v => {
    const matchesSearch = v.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          v.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.scopeOfWork.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' ? true : v.category === categoryFilter;
    const matchesType = typeFilter === 'All' ? true : v.type === typeFilter;
    return matchesSearch && matchesCategory && matchesType;
  });

  const handleContractRequisitionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientCompany || !clientContactName || !clientEmail || !clientPhone) {
      alert('Please fill in Company Name, Contact Name, Email, and Phone fields.');
      return;
    }

    const requestedPositions = allocations.map(item => {
      if (item.role === 'other') {
        return { role: item.customRole?.trim() || 'Custom Position', count: item.count };
      }
      return { role: item.role, count: item.count };
    }).filter(item => item.count > 0 && item.role.trim() !== '');

    if (requestedPositions.length === 0) {
      alert('Please select or specify at least one staff role type with a quantity higher than zero.');
      return;
    }

    const newRequisition = {
      companyName: clientCompany,
      contactName: clientContactName,
      email: clientEmail,
      phone: clientPhone,
      location: clientLocation || 'Not Specified',
      notes: clientNotes,
      requestedPositions
    };

    if (onAddRequisition) {
      onAddRequisition(newRequisition);
    } else {
      const stored = localStorage.getItem('express_requisitions') || '[]';
      const parsed = JSON.parse(stored);
      const randId = `req-${Math.floor(100 + Math.random() * 900)}`;
      const fullReq = {
        ...newRequisition,
        id: randId,
        status: 'Pending Review' as const,
        dateSubmitted: new Date().toISOString().split('T')[0]
      };
      localStorage.setItem('express_requisitions', JSON.stringify([fullReq, ...parsed]));
    }

    setClientSuccess(true);
    setTimeout(() => {
      setClientSuccess(false);
      setShowClientModal(false);
      setClientCompany('');
      setClientContactName('');
      setClientEmail('');
      setClientPhone('');
      setClientLocation('');
      setClientNotes('');
      setAllocations([
        { role: 'Contractual staffing', count: 5 }
      ]);
    }, 2500);
  };

  const processSelectedFile = (selectedFile: File) => {
    setUploadError('');
    const extension = selectedFile.name.split('.').pop()?.toLowerCase();
    if (extension !== 'pdf' && extension !== 'docx' && extension !== 'doc') {
      setUploadError('Invalid formatting. We accept PDF, DOC, DOCX files.');
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setUploadError('File size limits are capped at 10MB.');
      return;
    }

    setFile(selectedFile);
    setIsUploading(true);
    setSimulatedProgress(0);

    const interval = setInterval(() => {
      setSimulatedProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 25;
      });
    }, 150);
  };

  const handleApplyHomeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    if (!fullName || !email || !phone || !education || !resumeSummary) {
      alert('Please populate all required details.');
      return;
    }

    const skillsArray = skills.split(',').map(s => s.trim()).filter(s => s !== '');

    onAddApplication({
      fullName,
      email,
      phone,
      appliedJobId: selectedJob.id,
      appliedJobTitle: selectedJob.title,
      resumeSummary,
      skills: skillsArray.length > 0 ? skillsArray : ['Communication', 'Basic Ops'],
      experienceYears: Number(experience),
      education,
      resumeFileName: file ? file.name : 'Candidate_CV_Draft.pdf'
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setIsApplying(false);
      setSelectedJob(null);
      // reset form values
      setFullName('');
      setEmail('');
      setPhone('');
      setExperience(2);
      setEducation('');
      setSkills('');
      setResumeSummary('');
      setFile(null);
    }, 2500);
  };

  return (
    <div className="space-y-16 py-0 font-sans">
           {/* 1. HERO/BANNER PANEL: EXACT KEY CAPTION & TWO CARD SELECTIONS */}
      <section id="hero-banner-section" className="relative bg-transparent overflow-hidden min-h-[580px] lg:min-h-[640px] flex flex-col justify-between group w-full py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-900/15">
        
        {/* Full size majestic photography backdrop matching the attached premium visual exactly */}
        <div className="absolute inset-0 z-0">
          <img 
            src={regeneratedHeroImg} 
            alt="Express Employment Executive and Technical Handshake Website Banner" 
            className="w-full h-full object-cover object-center opacity-100 hover:scale-[1.01] transition-transform duration-1000"
            referrerPolicy="no-referrer"
          />
        </div>        {/* Inner container to align with standard page margins while backdrop bleeds full left/right */}
        <div className="max-w-7xl w-full relative z-10 flex-grow flex flex-col justify-center mt-[150px] mb-0 ml-[44.1574px] mr-[54.1574px] pt-0 pb-0 pr-0 pl-0">
          
          {/* Main Content Layout - No card background, fully transparent, covering full length */}
          <div className="w-full space-y-8 text-left">
            <h1 className="text-[50px] pt-[2px] pl-[5px] font-sans font-black text-white leading-none uppercase tracking-tight [text-shadow:_0_4px_16px_rgba(0,0,0,0.85)] max-w-5xl">
              YOUR PARTNER IN HUMAN CAPITAL
            </h1>
            
            <p className="text-slate-100 text-base sm:text-lg md:text-xl font-bold tracking-wide [text-shadow:_0_2px_10px_rgba(0,0,0,0.9)] max-w-4xl">
              Manpower Supply | Recruitment | Training | Facility Management
            </p>

            {/* TWO RESPONSIVE PILL BUTTONS MATCHING THE ATTACHED DESIGN IMAGE */}
            <div className="flex flex-wrap items-center gap-5 pt-4">
              
              {/* LEFT BUTTON: I'M A JOB SEEKER (SOLID BLUE PILL BUTTON) */}
              <button 
                id="jobseeker-trigger-card"
                onClick={() => {
                  const el = document.getElementById('active-vacancies-head');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-[#0a65af] hover:bg-[#095796] text-white font-sans font-extrabold px-10 py-4 rounded-full shadow-xl transition-all duration-300 transform hover:scale-[1.03] tracking-widest text-xs border-2 border-[#0a65af] hover:border-[#095796] cursor-pointer"
              >
                I'M A JOB SEEKER
              </button>

              {/* RIGHT BUTTON: I'M A CLIENT (TRANSPARENT WHITE OUTLINED PILL BUTTON) */}
              <button 
                id="client-trigger-card"
                onClick={() => handleOpenClientRequisition()}
                className="bg-transparent hover:bg-white/10 border-2 border-white text-white font-sans font-extrabold px-10 py-4 rounded-full shadow-xl transition-all duration-300 transform hover:scale-[1.03] tracking-widest text-xs cursor-pointer"
              >
                I'M A CLIENT
              </button>

            </div>
          </div>

        </div>
      </section>

      {/* Rest of the webpage wrapped in standard width limits */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pb-12 w-full">

      {/* 2. OUR SERVICES SECTION: GORGEOUS NAVY CANVASES & VECTORS */}
      <section id="manpower-solutions-head" className="bg-[#0c233f] text-white p-8 sm:p-12 rounded-2xl border border-[#0d1e30] relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-slate-800 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none"></div>
        
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10 relative z-10">
          <h2 className="text-3xl font-black uppercase tracking-tight text-white flex items-center justify-center gap-2.5">
            <span className="w-1 h-8 bg-[#2362a2] block"></span>
            OUR SERVICES & PERSONNEL SUPPLY
          </h2>
          <p className="text-xs text-slate-300 uppercase tracking-widest font-mono">
            Bridging talent and industry sectors safely as your certified contractor
          </p>
        </div>

        {/* GORGEOUS 4 FOUR WHITE CARDS REPLICATED PRECISELY AS SHOWN IN THE DEVICE GRID WITH DUAL PATHWAYS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10 text-left">
          
          {/* CARD 1: STAFFING SOLUTIONS */}
          <div className="bg-white text-[#0d233a] rounded-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between border-2 border-slate-900 overflow-hidden">
            <div>
              {/* IMAGE THUMBNAIL TOP OVERLAY */}
              <div className="relative h-28 w-full bg-slate-100 overflow-hidden border-b-2 border-slate-900">
                <img 
                  src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=600&auto=format&fit=crop" 
                  alt="Staffing Solutions Card" 
                  className="w-full h-full object-cover transition-transform duration-500" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-[#0d233a]/20"></div>
                <div className="absolute bottom-2 left-2 bg-[#0d233a] text-white text-[8px] font-black px-2 py-0.5 rounded uppercase">
                  Connected Workforce
                </div>
              </div>

              {/* STAFFING VECTOR DRAWING AT HIGH FIDELITY IN CARD */}
              <div className="p-5 pb-0">
                <div className="py-1 text-center">
                  <svg viewBox="0 0 100 100" className="w-12 h-12 mx-auto mb-2 select-none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="8" fill="#2362a2" stroke="#101f30" strokeWidth="2" />
                    <path d="M 50 42 L 50 22" stroke="#101f30" strokeWidth="2" strokeDasharray="3,3" />
                    <path d="M 50 58 L 50 78" stroke="#101f30" strokeWidth="2" strokeDasharray="3,3" />
                    <path d="M 42 50 L 22 50" stroke="#101f30" strokeWidth="2" strokeDasharray="3,3" />
                    <path d="M 58 50 L 78 50" stroke="#101f30" strokeWidth="2" strokeDasharray="3,3" />
                    <circle cx="50" cy="18" r="6" fill="#f59e0b" stroke="#101f30" strokeWidth="2" />
                    <circle cx="50" cy="82" r="6" fill="#ef4444" stroke="#101f30" strokeWidth="2" />
                    <circle cx="18" cy="50" r="6" fill="#10b981" stroke="#101f30" strokeWidth="2" />
                    <circle cx="82" cy="50" r="6" fill="#9333ea" stroke="#101f30" strokeWidth="2" />
                  </svg>
                </div>
                <h3 className="font-extrabold text-sm uppercase tracking-wider mb-2 text-slate-900 leading-none">STAFFING SOLUTIONS</h3>
                <p className="text-[11px] text-slate-500 font-normal leading-relaxed">
                  Contractual helpers, casual labor, temporary assistants, and general office workspace staff.
                </p>
              </div>
            </div>

            {/* HIGH FIDELITY TWO PATHWAY DECK */}
            <div className="p-4 mt-4 bg-slate-50 border-t border-slate-100 flex flex-col gap-1.5 select-none text-center">
              <button
                onClick={() => {
                  setCategoryFilter('staffing');
                  const el = document.getElementById('active-vacancies-head');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-2 bg-[#0d233a] hover:bg-[#2362a2] text-white text-[10px] font-black uppercase tracking-wider rounded-md transition cursor-pointer"
              >
                FOR CANDIDATES: APPLY &rarr;
              </button>
              <button
                onClick={() => handleOpenClientRequisition('staffing')}
                className="w-full py-2 bg-[#bae0fd] hover:bg-[#99ceff] text-[#0d233a] text-[10px] font-black uppercase tracking-wider rounded-md transition border border-[#9fd3fe] cursor-pointer"
              >
                FOR EMPLOYERS: REQUEST &rarr;
              </button>
            </div>
          </div>

          {/* CARD 2: TECHNICAL & INDUSTRIAL */}
          <div className="bg-white text-[#0d233a] rounded-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between border-2 border-slate-900 overflow-hidden">
            <div>
              {/* IMAGE THUMBNAIL TOP OVERLAY */}
              <div className="relative h-28 w-full bg-slate-100 overflow-hidden border-b-2 border-slate-900">
                <img 
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600&auto=format&fit=crop" 
                  alt="Technical & Industrial Services Card" 
                  className="w-full h-full object-cover transition-transform duration-500" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-[#0d233a]/20"></div>
                <div className="absolute bottom-2 left-2 bg-[#0d233a] text-white text-[8px] font-black px-2 py-0.5 rounded uppercase">
                  Specialized Operators
                </div>
              </div>

              {/* FORKLIFT & WELDER VECTOR DRAWING */}
              <div className="p-5 pb-0">
                <div className="py-1 text-center font-bold">
                  <svg viewBox="0 0 100 100" className="w-12 h-12 mx-auto mb-2 select-none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="8" y="55" width="28" height="18" fill="#f59e0b" rx="2" stroke="#101f30" strokeWidth="2" />
                    <path d="M 16 55 L 18 42 L 30 42 L 32 55 Z" fill="none" stroke="#101f30" strokeWidth="2" />
                    <circle cx="15" cy="73" r="6" fill="#101f30" />
                    <circle cx="29" cy="73" r="6" fill="#101f30" />
                    <path d="M 36 42 L 36 73 L 44 73" fill="none" stroke="#101f30" strokeWidth="2" />
                    <path d="M 58 44 C 58 32, 86 32, 86 44" fill="#f59e0b" stroke="#101f30" strokeWidth="2" />
                    <rect x="56" y="42" width="32" height="3.5" fill="#f59e0b" stroke="#101f30" strokeWidth="1.5" />
                  </svg>
                </div>
                <h3 className="font-extrabold text-sm uppercase tracking-wider mb-2 text-slate-900 leading-none">TECHNICAL PERSONNEL</h3>
                <p className="text-[11px] text-slate-500 font-normal leading-relaxed">
                  Heavy Forklift Operators, Machinery Technicians, CNC Machinists, Welders & Mechanical Fitters.
                </p>
              </div>
            </div>

            {/* HIGH FIDELITY TWO PATHWAY DECK */}
            <div className="p-4 mt-4 bg-slate-50 border-t border-slate-100 flex flex-col gap-1.5 select-none text-center">
              <button
                onClick={() => {
                  setCategoryFilter('technical');
                  const el = document.getElementById('active-vacancies-head');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-2 bg-[#0d233a] hover:bg-[#2362a2] text-white text-[10px] font-black uppercase tracking-wider rounded-md transition cursor-pointer"
              >
                FOR CANDIDATES: APPLY &rarr;
              </button>
              <button
                onClick={() => handleOpenClientRequisition('technical')}
                className="w-full py-2 bg-[#bae0fd] hover:bg-[#99ceff] text-[#0d233a] text-[10px] font-black uppercase tracking-wider rounded-md transition border border-[#9fd3fe] cursor-pointer"
              >
                FOR EMPLOYERS: REQUEST &rarr;
              </button>
            </div>
          </div>

          {/* CARD 3: FACILITY MANAGEMENT */}
          <div className="bg-white text-[#0d233a] rounded-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between border-2 border-slate-900 overflow-hidden">
            <div>
              {/* IMAGE THUMBNAIL TOP OVERLAY */}
              <div className="relative h-28 w-full bg-slate-100 overflow-hidden border-b-2 border-slate-900">
                <img 
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop" 
                  alt="Facility Management Card" 
                  className="w-full h-full object-cover transition-transform duration-500" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-[#0d233a]/20"></div>
                <div className="absolute bottom-2 left-2 bg-[#0d233a] text-white text-[8px] font-black px-2 py-0.5 rounded uppercase">
                  Property Operations
                </div>
              </div>

              {/* BROOM, KEYS & SHIELD COMPOSITION */}
              <div className="p-5 pb-0">
                <div className="py-1 text-center font-bold">
                  <svg viewBox="0 0 100 100" className="w-12 h-12 mx-auto mb-2 select-none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="15" y1="75" x2="45" y2="25" stroke="#101f30" strokeWidth="3" />
                    <path d="M 10 70 L 25 85 L 8 82 Z" fill="#10b981" stroke="#101f30" strokeWidth="2" />
                    <circle cx="68" cy="28" r="9" fill="#f59e0b" stroke="#101f30" strokeWidth="2" />
                    <path d="M 52 52 C 52 52, 52 74, 68 84 C 84 74, 84 52, 84 52 Z" fill="#bae0fd" stroke="#101f30" strokeWidth="2" />
                  </svg>
                </div>
                <h3 className="font-extrabold text-sm uppercase tracking-wider mb-2 text-slate-900 leading-none">FACILITY MANAGEMENT</h3>
                <p className="text-[11px] text-slate-500 font-normal leading-relaxed">
                  Property maintenance staff, industrial janitors, commercial gardeners, and site security security teams.
                </p>
              </div>
            </div>

            {/* HIGH FIDELITY TWO PATHWAY DECK */}
            <div className="p-4 mt-4 bg-slate-50 border-t border-slate-100 flex flex-col gap-1.5 select-none text-center">
              <button
                onClick={() => {
                  setCategoryFilter('facility');
                  const el = document.getElementById('active-vacancies-head');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-2 bg-[#0d233a] hover:bg-[#2362a2] text-white text-[10px] font-black uppercase tracking-wider rounded-md transition cursor-pointer"
              >
                FOR CANDIDATES: APPLY &rarr;
              </button>
              <button
                onClick={() => handleOpenClientRequisition('facility')}
                className="w-full py-2 bg-[#bae0fd] hover:bg-[#99ceff] text-[#0d233a] text-[10px] font-black uppercase tracking-wider rounded-md transition border border-[#9fd3fe] cursor-pointer"
              >
                FOR EMPLOYERS: REQUEST &rarr;
              </button>
            </div>
          </div>

          {/* CARD 4: CORPORATE SERVICES */}
          <div className="bg-white text-[#0d233a] rounded-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between border-2 border-slate-900 overflow-hidden">
            <div>
              {/* IMAGE THUMBNAIL TOP OVERLAY */}
              <div className="relative h-28 w-full bg-slate-100 overflow-hidden border-b-2 border-slate-900">
                <img 
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop" 
                  alt="Corporate Services Card" 
                  className="w-full h-full object-cover transition-transform duration-500" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-[#0d233a]/20"></div>
                <div className="absolute bottom-2 left-2 bg-[#0d233a] text-white text-[8px] font-black px-2 py-0.5 rounded uppercase">
                  HR & Payroll Sieve
                </div>
              </div>

              {/* CLOCK & HANDSHAKE COOPERATIVE SYMBOL */}
              <div className="p-5 pb-0">
                <div className="py-1 text-center font-bold">
                  <svg viewBox="0 0 100 100" className="w-12 h-12 mx-auto mb-2 select-none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="30" r="14" fill="#ffffff" stroke="#101f30" strokeWidth="2" />
                    <circle cx="50" cy="30" r="10" fill="#bae0fd" />
                    <line x1="50" y1="30" x2="50" y2="21" stroke="#101f30" strokeWidth="2" />
                    <line x1="50" y1="30" x2="58" y2="30" stroke="#101f30" strokeWidth="2" />
                    <rect x="42" y="65" width="16" height="11" fill="#f59e0b" rx="2" stroke="#101f30" strokeWidth="1.5" />
                  </svg>
                </div>
                <h3 className="font-extrabold text-sm uppercase tracking-wider mb-2 text-slate-900 leading-none">CORPORATE SERVICES</h3>
                <p className="text-[11px] text-slate-500 font-normal leading-relaxed">
                  Payroll validation systems, statutory audit compliance (EPF & ESIC), and liability management advisors.
                </p>
              </div>
            </div>

            {/* HIGH FIDELITY TWO PATHWAY DECK */}
            <div className="p-4 mt-4 bg-slate-50 border-t border-slate-100 flex flex-col gap-1.5 select-none text-center">
              <button
                onClick={() => {
                  setCategoryFilter('corporate');
                  const el = document.getElementById('active-vacancies-head');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-2 bg-[#0d233a] hover:bg-[#2362a2] text-white text-[10px] font-black uppercase tracking-wider rounded-md transition cursor-pointer"
              >
                FOR CANDIDATES: APPLY &rarr;
              </button>
              <button
                onClick={() => handleOpenClientRequisition('corporate')}
                className="w-full py-2 bg-[#bae0fd] hover:bg-[#99ceff] text-[#0d233a] text-[10px] font-black uppercase tracking-wider rounded-md transition border border-[#9fd3fe] cursor-pointer"
              >
                FOR EMPLOYERS: REQUEST &rarr;
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* NEW SECTION EXPLATING REAL CONTRACTOR INTERMEDIARY PIPELINE */}
      <section id="contractor-pipeline-module" className="bg-[#f8fafc] border border-slate-205 p-8 sm:p-10 rounded-2xl select-none">
        
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-[9px] font-black font-mono uppercase bg-[#bae0fd] text-[#0d233a] px-3 py-1 rounded-full tracking-widest">
            THE MANPOWER CONTRACTOR ADVANTAGE
          </span>
          <h2 className="text-2xl font-black uppercase text-slate-900 tracking-tight">
            HOW EXPRESS EMPLOYMENT BRIDGES BOTH SIDES
          </h2>
          <p className="text-xs text-slate-500 max-w-lg mx-auto font-sans leading-relaxed">
            We act as the legal manpower supply licensee and payroll administrator between local employers and candidate workers.
          </p>
        </div>

        {/* 3 Steps Pipeline Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* Step 1 */}
          <div className="bg-white p-6 border border-slate-200 rounded-xl relative space-y-3.5 shadow-xs hover:shadow-md transition-shadow">
            <span className="absolute -top-4 -left-4 w-10 h-10 bg-[#0d233a] text-white rounded-full flex items-center justify-center font-bold font-mono text-sm border-2 border-white shadow-md">
              01
            </span>
            <div className="pt-2">
              <h3 className="text-xs font-black uppercase tracking-wide text-slate-400 font-mono">STEP 1 FOR EMPLOYERS</h3>
              <h4 className="text-base font-extrabold uppercase text-slate-900 tracking-tight mt-1">POST REQUISITIONS</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-normal font-sans">
              Clients/Employers visit our digital portal to lodge <strong>Contract Manpower Requisitions</strong> specifying exactly the positions and headcounts needed for their local logistics or operations.
            </p>
            <div className="pt-2 border-t border-slate-100 text-[10px] text-[#2362a2] font-black uppercase tracking-wider font-mono">
              &bull; Employer specifies headcount needs
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 border-2 border-[#2362a2] rounded-xl relative space-y-3.5 shadow-sm hover:shadow-md transition-shadow">
            <span className="absolute -top-4 -left-4 w-10 h-10 bg-[#2362a2] text-white rounded-full flex items-center justify-center font-bold font-mono text-sm border-2 border-white shadow-md">
              02
            </span>
            <div className="pt-2">
              <h3 className="text-xs font-black uppercase tracking-wide text-[#2362a2] font-mono">STEP 2 AGENCY CONTRACTOR</h3>
              <h4 className="text-base font-extrabold uppercase text-[#0d233a] tracking-tight mt-1">SIEVING & COMPLIANCE</h4>
            </div>
            <p className="text-xs text-slate-650 leading-relaxed font-normal font-sans">
              As the <strong>Licensed Middleman & Contractor</strong>, Express Employment reviews incoming demands, executes thorough background checks, and manages EPF, ESIC, and liability compliance.
            </p>
            <div className="pt-2 border-t border-slate-100 text-[10px] text-green-600 font-black uppercase tracking-wider font-mono">
              &bull; We manage payroll & liability limits
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 border border-slate-200 rounded-xl relative space-y-3.5 shadow-xs hover:shadow-md transition-shadow">
            <span className="absolute -top-4 -left-4 w-10 h-10 bg-slate-600 text-white rounded-full flex items-center justify-center font-bold font-mono text-sm border-2 border-white shadow-md">
              03
            </span>
            <div className="pt-2">
              <h3 className="text-xs font-black uppercase tracking-wide text-slate-400 font-mono">STEP 3 FOR CANDIDATES</h3>
              <h4 className="text-base font-extrabold uppercase text-slate-900 tracking-tight mt-1">APPLY & DEPLOY</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-normal font-sans">
              Candidates/Employees browse current active vacancies on our website, submit their resume summaries, and receive immediate site inductions and onboarding deployment.
            </p>
            <div className="pt-2 border-t border-slate-100 text-[10px] text-[#2362a2] font-black uppercase tracking-wider font-mono">
              &bull; Employee deploys with safe benefits
            </div>
          </div>

        </div>
      </section>

      {/* 3. ACTIVE VACANCIES FEED & DUAL SIDEBAR AS PER TABLET IMAGE */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
        
        {/* LEFT COLUMN: ACTIVE VACANCIES LISTING MODULE */}
        <div className="lg:col-span-8 space-y-6">
          
          <div id="active-vacancies-head" className="space-y-1">
            <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900">
              ACTIVE VACANCIES
            </h2>
            <p className="text-xs text-slate-500 uppercase tracking-wide font-mono font-bold">
              Filter and select feed of real time listings.
            </p>
          </div>

          {/* Quick Search and Stream Sieve Widgets */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-3 shadow-sm">
            
            {/* Search Input */}
            <div className="relative sm:col-span-6">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="SEARCH OPPORTUNITIES..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 focus:outline-none focus:border-slate-900 rounded-md text-xs font-bold uppercase bg-slate-50/50 focus:bg-white"
              />
            </div>

            {/* Category Dropdown */}
            <div className="sm:col-span-3">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 focus:outline-none focus:border-slate-900 rounded-md text-xs font-bold uppercase bg-slate-50 cursor-pointer text-slate-800"
              >
                <option value="all">ALL SUPPLIED MANPOWER</option>
                <option value="staffing">Contract, Temporary & Permanent Staffing</option>
                <option value="drivers_forklift">Drivers and Forklift Operators</option>
                <option value="hr_payroll">HR, Payroll and Statutory Compliance</option>
                <option value="painters_welders">Painters, Welders and Maintenance Operators</option>
                <option value="industrial_manpower">Skilled and Unskilled Industrial Manpower</option>
                <option value="facility_security">Security, Gardening and House Keeping</option>
                <option value="skill_development">Skill Development & Training Programs</option>
              </select>
            </div>

            {/* Employment Type Quick filters */}
            <div className="sm:col-span-3 flex border border-slate-200 bg-slate-100/50 p-1 rounded-md">
              {['All', 'Contract', 'Temporary'].map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type as any)}
                  className={`flex-1 py-1 text-[9px] font-black uppercase tracking-wider rounded transition-all cursor-pointer ${
                    typeFilter === type
                      ? 'bg-[#0d233a] text-white'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

          </div>

          {/* Render feed of current matching vacancies */}
          {filteredHomeVacancies.length > 0 ? (
            <div className="space-y-4">
              {filteredHomeVacancies.map((job) => (
                <div 
                  key={job.id}
                  className="bg-white border border-slate-200 hover:border-[#1b4e85] p-5 rounded-xl transition-all shadow-sm hover:shadow-md flex flex-col justify-between group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <span className="text-[9px] font-black uppercase text-[#2362a2] bg-[#bae0fd]/30 px-2 py-0.5 rounded mr-2">
                        {job.type}
                      </span>
                      <span className="text-[9px] font-extrabold uppercase text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {job.category}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-mono flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      Posted: {job.datePosted}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-950 group-hover:text-[#2362a2] uppercase tracking-tight transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">{job.company}</p>
                  
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {job.scopeOfWork}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 text-xs">
                    <div className="flex items-center space-x-4 text-slate-500">
                      <span className="flex items-center"><MapPin className="h-3.5 w-3.5 mr-1" />{job.location}</span>
                      <span className="flex items-center"><IndianRupee className="h-3.5 w-3.5 mr-0.5" />{job.salaryRange}</span>
                    </div>
                    <button
                      onClick={() => setSelectedJob(job)}
                      className="bg-[#0d233a] hover:bg-[#2362a2] text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-md transition cursor-pointer flex items-center gap-1.5"
                    >
                      <span>VIEW DETAILS</span>
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 p-8 rounded-xl text-center space-y-3">
              <div className="bg-slate-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto border border-slate-200">
                <AlertCircle className="h-6 w-6 text-slate-400" />
              </div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">No matching opportunities found</p>
              <button 
                onClick={() => { setSearchTerm(''); setCategoryFilter('all'); setTypeFilter('All'); }}
                className="text-xs font-bold text-[#2362a2] hover:underline"
              >
                Clear all search criteria filters
              </button>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: GORGEOUS SIDEBAR FEATURING TWO TABLET CTA BLOCKS */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* CTA CARD 1: DEEP BLUE CAN'T FIND MATCH? UPLOAD FOR FUTURE EMPLOYMENT */}
          <div 
            onClick={onGeneralApply}
            className="bg-[#0d233a] text-white p-6 rounded-2xl cursor-pointer border border-[#132c45] shadow-lg transition-all duration-300 hover:bg-[#13304f] hover:-translate-y-1 text-center group flex flex-col justify-between min-h-[170px]"
          >
            <div>
              <span className="text-[9px] bg-[#2362a2] text-white px-2.5 py-1 rounded font-mono uppercase tracking-widest block mb-4 w-max mx-auto">
                No Vacancy Match?
              </span>
              <h3 className="text-base sm:text-lg font-black tracking-wide uppercase line-clamp-3 leading-tight mb-2">
                CAN'T FIND A MATCH? UPLOAD FOR FUTURE EMPLOYMENT.
              </h3>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-xs font-extrabold uppercase mt-4 text-[#7cc3fc] group-hover:underline">
              <span>Go to CV Drop Box</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* CTA CARD 2: LIGHT GREY CARD GENERAL APPLICATION */}
          <div 
            onClick={onGeneralApply}
            className="bg-[#eef2f6] text-[#0d233a] p-6 rounded-2xl cursor-pointer border border-slate-200/80 shadow-md transition-all duration-300 hover:bg-[#e4ebf1] hover:-translate-y-1 flex flex-col justify-between min-h-[160px]"
          >
            <div>
              <h3 className="text-base font-black uppercase mb-2 tracking-tight">
                GENERAL APPLICATION
              </h3>
              <p className="text-xs text-slate-600 leading-normal font-medium leading-relaxed">
                Prepare and submit your profile for instant database storage. Our automation processes resume records instantly under strict statutory liability frameworks.
              </p>
            </div>
            <span className="text-[10px] uppercase font-black tracking-widest text-[#2362a2] mt-4 block">
              SUBMIT CV NOW &rarr;
            </span>
          </div>

        </div>

      </section>

      {/* 4. CLIENT MODAL: CONTRACT MANPOWER REQUISITION INTAKE FORM */}
      {showClientModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 flex justify-center items-start p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl border border-slate-300 my-auto overflow-hidden shadow-2xl animate-slideUp">
            
            <div className="bg-[#0d233a] text-white p-6 relative">
              <button 
                onClick={() => setShowClientModal(false)}
                className="absolute right-4 top-4 text-white/70 hover:text-white p-2 rounded-lg border border-slate-700 bg-slate-900 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
              <h3 className="text-xl font-black uppercase tracking-wide">REQUEST CONTRACT PERSONNEL</h3>
              <p className="text-xs text-[#bae0fd] uppercase tracking-widest mt-1">Express Employment • Client Requisition Panel</p>
            </div>

            <div className="p-6 space-y-4">
              {clientSuccess ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto border border-green-200">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <h4 className="font-extrabold text-lg text-slate-900">REQUISITION SUBMITTED SUCCESSFULLY!</h4>
                  <p className="text-xs text-slate-500 font-light max-w-md mx-auto leading-relaxed">
                    Thank you! Your Contract Personnel Requisition has been securely logged. The Express team will review your manpower allocations and align candidates immediately.
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">Status: Sourcing In Progress • Check Admin Portal</p>
                </div>
              ) : (
                <form onSubmit={handleContractRequisitionSubmit} className="space-y-6 text-xs font-bold text-slate-500 tracking-wider">
                  
                  {/* Firm Information */}
                  <div className="space-y-3 text-left">
                    <h4 className="text-xs font-bold text-[#0d233a] border-b border-slate-100 pb-1.5 uppercase">1. Client Company Information</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">Company Name *</label>
                        <input 
                          type="text" 
                          required 
                          value={clientCompany}
                          onChange={(e) => setClientCompany(e.target.value)}
                          placeholder="e.g. Apex Industrial Logistics"
                          className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">Contact Name *</label>
                        <input 
                          type="text" 
                          required 
                          value={clientContactName}
                          onChange={(e) => setClientContactName(e.target.value)}
                          placeholder="e.g. Sarah Jenkins (HR Director)"
                          className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-1">
                        <label className="block text-[10px] text-slate-400 mb-1">Contact Phone *</label>
                        <input 
                          type="tel" 
                          required 
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          placeholder="+1 (555) 765-4321"
                          className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg text-xs"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label className="block text-[10px] text-slate-400 mb-1">Contact Email *</label>
                        <input 
                          type="email" 
                          required 
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          placeholder="sjenkins@apex.com"
                          className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg text-xs lowercase"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label className="block text-[10px] text-slate-400 mb-1">Operational Site / Location *</label>
                        <input 
                          type="text" 
                          required 
                          value={clientLocation}
                          onChange={(e) => setClientLocation(e.target.value)}
                          placeholder="e.g. East River Terminal"
                          className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Required Positions allocating headcounts */}
                  <div className="space-y-4 text-left">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                      <h4 className="text-xs font-bold text-[#0d233a] uppercase">2. Required Personnel Allocations</h4>
                      <span className="text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded font-mono">Dynamic Headcount Allocator</span>
                    </div>

                    <div className="space-y-3">
                      {allocations.map((alloc, idx) => (
                        <div 
                          key={idx} 
                          className="p-3.5 border border-slate-200 bg-slate-50/60 rounded-xl flex flex-col gap-3 transition-colors hover:border-slate-300"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-[#2362a2] uppercase tracking-wider">
                              Required Position #{idx + 1}
                            </span>
                            {allocations.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  setAllocations(allocations.filter((_, i) => i !== idx));
                                }}
                                className="text-[10px] font-bold text-red-600 hover:text-red-700 hover:underline uppercase tracking-wider"
                              >
                                Remove Pos
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                            {/* Position selection dropdown */}
                            <div className="md:col-span-8">
                              <label className="block text-[9px] text-slate-400 uppercase tracking-widest mb-1">Select Service or Position *</label>
                              <select
                                required
                                value={alloc.role}
                                onChange={(e) => {
                                  const newAllocs = [...allocations];
                                  newAllocs[idx].role = e.target.value;
                                  if (e.target.value !== 'other') {
                                    newAllocs[idx].customRole = '';
                                  }
                                  setAllocations(newAllocs);
                                }}
                                className="w-full p-2 border border-slate-200 rounded-lg bg-white text-xs text-slate-800 font-bold focus:border-[#2362a2] focus:outline-none cursor-pointer"
                              >
                                {activeCategories.map((g, gIdx) => (
                                  <optgroup key={gIdx} label={g.groupName}>
                                    {g.positions.map((p, pIdx) => (
                                      <option key={pIdx} value={p}>{p}</option>
                                    ))}
                                  </optgroup>
                                ))}
                                <option value="other">Other / Custom Category...</option>
                              </select>
                            </div>

                            {/* Headcount Input */}
                            <div className="md:col-span-4">
                              <label className="block text-[9px] text-slate-400 uppercase tracking-widest mb-1">Qty Required *</label>
                              <input
                                type="number"
                                required
                                min="1"
                                value={alloc.count}
                                onChange={(e) => {
                                  const newAllocs = [...allocations];
                                  newAllocs[idx].count = Math.max(1, parseInt(e.target.value) || 0);
                                  setAllocations(newAllocs);
                                }}
                                className="w-full p-2 border border-slate-200 rounded-lg bg-white text-center text-xs font-bold font-mono focus:border-[#2362a2] focus:outline-none"
                              />
                            </div>
                          </div>

                          {/* Render custom input if "other" is selected */}
                          {alloc.role === 'other' && (
                            <div className="pt-1">
                              <label className="block text-[9px] text-slate-400 uppercase tracking-widest mb-1">Specify Custom Position Title *</label>
                              <input
                                type="text"
                                required
                                value={alloc.customRole || ''}
                                onChange={(e) => {
                                  const newAllocs = [...allocations];
                                  newAllocs[idx].customRole = e.target.value;
                                  setAllocations(newAllocs);
                                }}
                                placeholder="e.g. Lead Robotic Welder, Senior Warehouse Supervisor, ESIC Advisory Specialist"
                                className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg text-xs font-bold focus:border-[#2362a2] focus:outline-none"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const defaultRole = activeCategories[0]?.positions[0] || 'Contractual staffing';
                        setAllocations([...allocations, { role: defaultRole, count: 1 }]);
                      }}
                      className="w-full py-2.5 border-2 border-dashed border-slate-200 hover:border-[#2362a2]/40 text-slate-500 hover:text-[#2362a2] rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>+ Add Another Position Allocation</span>
                    </button>
                  </div>

                  {/* Operational Notes / Scope */}
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-[#0d233a] border-b border-slate-100 pb-1.5 uppercase mb-2">3. Requisition Scope Notes & Remarks</h4>
                    <textarea
                      value={clientNotes}
                      onChange={(e) => setClientNotes(e.target.value)}
                      rows={3}
                      placeholder="e.g. Night shift differential, specific safety gear requirements, certified heavy load licenses required, etc."
                      className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg text-xs font-normal leading-relaxed text-slate-700 font-sans normal-case"
                    ></textarea>
                  </div>

                  {/* Submission and Control Buttons */}
                  <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                    <button 
                      type="button" 
                      onClick={() => setShowClientModal(false)}
                      className="px-5 py-2.5 border border-slate-200 text-slate-500 rounded-lg text-xs hover:bg-slate-50 uppercase tracking-widest font-bold"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-6 py-2.5 bg-[#0d233a] hover:bg-[#2362a2] text-white rounded-lg text-xs uppercase tracking-widest font-black"
                    >
                      Submit Requisition Request
                    </button>
                  </div>

                </form>
              )}
            </div>

          </div>
        </div>
      )}

      {/* 5. JOB DETAILS & APPLICATION SUBMISSION MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 flex justify-center items-start p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl border border-slate-300 my-auto overflow-hidden shadow-2xl animate-slideUp">
            
            <div className="bg-[#0d233a] text-white p-6 relative">
              <button
                onClick={() => {
                  setSelectedJob(null);
                  setIsApplying(false);
                  setFile(null);
                }}
                className="absolute right-4 top-4 text-white/70 hover:text-white p-2 rounded-lg border border-slate-700 bg-slate-900 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
              <span className="text-[10px] bg-[#2362a2] text-white px-2 py-0.5 rounded font-bold uppercase tracking-widest mb-1.5 inline-block">
                {selectedJob.type}
              </span>
              <h3 className="text-xl font-black uppercase tracking-tight">{selectedJob.title}</h3>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-black">{selectedJob.company}</p>
            </div>

            <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
              {!isApplying ? (
                // VIEW MODE
                <div className="space-y-5 text-slate-700">
                  <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                    <p className="font-bold">🌍 LOCATION: <span className="font-light text-slate-600">{selectedJob.location}</span></p>
                    <p className="font-bold">💰 SALARY: <span className="font-light text-slate-600">{selectedJob.salaryRange}</span></p>
                    <p className="font-bold">📅 POSTED: <span className="font-light text-slate-600">{selectedJob.datePosted}</span></p>
                    <p className="font-bold">⚡ CLASSIFICATION: <span className="font-light text-slate-600 uppercase">{selectedJob.category}</span></p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-black text-xs uppercase tracking-wider text-slate-900">SCOPE OF WORK</h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">{selectedJob.scopeOfWork}</p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-black text-xs uppercase tracking-wider text-slate-900">REQUIREMENTS & CERTIFICATIONS</h4>
                    <ul className="space-y-2 text-xs">
                      {selectedJob.serviceRequirements.map((req, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <CheckCircle2 className="h-4 w-4 text-[#2362a2] shrink-0 mt-0.5" />
                          <span className="text-slate-600 leading-relaxed">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                    <button 
                      onClick={() => setSelectedJob(null)}
                      className="px-5 py-2.5 border border-slate-200 rounded-lg text-xs font-bold uppercase hover:bg-slate-50"
                    >
                      Close
                    </button>
                    <button 
                      onClick={() => setIsApplying(true)}
                      className="px-6 py-2.5 bg-[#0d233a] hover:bg-[#2362a2] text-white rounded-lg text-xs font-bold uppercase tracking-wider"
                    >
                      Apply Online Now
                    </button>
                  </div>
                </div>
              ) : isSubmitted ? (
                // SUCCESS VIEW
                <div className="py-10 text-center space-y-3">
                  <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto border border-green-200 animate-bounce">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <h4 className="font-black text-lg text-slate-900">APPLICATION SUBMITTED!</h4>
                  <p className="text-xs text-slate-500 font-light max-w-sm mx-auto leading-relaxed">
                    Thank you. We have securely saved your candidate files for <strong>{selectedJob.title}</strong> within the E-Verify HR candidate database directory.
                  </p>
                  <p className="text-[9px] text-slate-400 font-mono italic">Closing modal panel window...</p>
                </div>
              ) : (
                // APPLY FORM
                <form onSubmit={handleApplyHomeSubmit} className="space-y-4 text-xs font-black text-slate-400 uppercase tracking-widest text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-900">
                    <div>
                      <label className="block text-[9px] text-slate-400 mb-1">Full Name *</label>
                      <input 
                        type="text" 
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-slate-400 mb-1">Email Address *</label>
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john.doe@example.com"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs lowercase"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-900">
                    <div>
                      <label className="block text-[9px] text-slate-400 mb-1">Phone Number *</label>
                      <input 
                        type="tel" 
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 012-3456"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-slate-400 mb-1">Years of Experience *</label>
                      <input 
                        type="number" 
                        required
                        value={experience}
                        onChange={(e) => setExperience(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-900">
                    <div>
                      <label className="block text-[9px] text-slate-400 mb-1">Highest Education *</label>
                      <input 
                        type="text" 
                        required
                        value={education}
                        onChange={(e) => setEducation(e.target.value)}
                        placeholder="e.g. B.Sc. in Logistics, Trade Certificate"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-slate-400 mb-1">Skills (comma-separated)</label>
                      <input 
                        type="text" 
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        placeholder="e.g. Lift Truck, OSHA Security, CNC"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="text-slate-900">
                    <label className="block text-[9px] text-slate-400 mb-1">Professional cover summary *</label>
                    <textarea
                      required
                      value={resumeSummary}
                      onChange={(e) => setResumeSummary(e.target.value)}
                      rows={2}
                      placeholder="Outline your certified professional certifications briefly..."
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                    ></textarea>
                  </div>

                  {/* Resume File Upload Widget */}
                  <div className="space-y-1.5 text-slate-900">
                    <label className="block text-[9px] text-slate-400">Attach Resume Document *</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center cursor-pointer hover:border-slate-400 bg-slate-50 transition-all"
                    >
                      <input 
                        type="file"
                        ref={fileInputRef}
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            processSelectedFile(e.target.files[0]);
                          }
                        }}
                        className="hidden"
                      />
                      <Upload className="h-5 w-5 text-slate-400 mx-auto mb-1" />
                      <p className="text-xs text-slate-700 font-bold">
                        {file ? `Resume File attached: ${file.name}` : 'Click to attach CV (.pdf, .doc, .docx)'}
                      </p>
                    </div>

                    {isUploading && (
                      <div className="w-full bg-slate-150 h-1.5 rounded-full overflow-hidden mt-1">
                        <div className="bg-[#2362a2] h-full transition-all" style={{ width: `${simulatedProgress}%` }}></div>
                      </div>
                    )}

                    {uploadError && (
                      <p className="text-red-500 text-[10px] font-bold mt-1 tracking-wider">{uploadError}</p>
                    )}
                  </div>

                  <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                    <button 
                      type="button"
                      onClick={() => setIsApplying(false)}
                      className="px-4 py-2 border border-slate-200 rounded-lg text-xs hover:bg-slate-50 text-slate-500"
                    >
                      Back
                    </button>
                    <button 
                      type="submit"
                      disabled={isUploading}
                      className="px-5 py-2 bg-[#0d233a] hover:bg-[#2362a2] text-white rounded-lg text-xs font-bold"
                    >
                      Submit Application CV
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      )}

      </div> {/* End of max-w-7xl inner container wrapper */}
    </div>
  );
}
