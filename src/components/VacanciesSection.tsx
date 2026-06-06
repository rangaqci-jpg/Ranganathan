import React, { useState, useRef } from 'react';
import { JobVacancy, CandidateProfile } from '../types';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Calendar, 
  IndianRupee, 
  X, 
  Upload, 
  FileText, 
  CheckCircle, 
  ChevronRight, 
  FilterX, 
  Plus, 
  AlertCircle 
} from 'lucide-react';

export const categoryDisplayLabels: Record<string, string> = {
  staffing: 'Contract, Temp & Permanent Staffing',
  drivers_forklift: 'Drivers & Forklift Operators',
  hr_payroll: 'HR, Payroll & Statutory Compliance',
  painters_welders: 'Painters, Welders & Maintenance',
  industrial_manpower: 'Industrial Manpower Management',
  facility_security: 'Security, Gardening & House Keeping',
  skill_development: 'Skill Development & Training',
  general: 'General / Custom Supply'
};

interface VacanciesSectionProps {
  vacancies: JobVacancy[];
  onAddApplication: (candidate: Omit<CandidateProfile, 'id' | 'dateSubmitted' | 'status'>) => void;
  selectedCategoryFilter: string;
}

export default function VacanciesSection({ vacancies, onAddApplication, selectedCategoryFilter }: VacanciesSectionProps) {
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Contract' | 'Temporary' | 'Permanent'>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>(selectedCategoryFilter || 'all');

  // Detail modal state
  const [selectedJob, setSelectedJob] = useState<JobVacancy | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  // Application form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [experience, setExperience] = useState<number>(2);
  const [education, setEducation] = useState('');
  const [skills, setSkills] = useState('');
  const [resumeSummary, setResumeSummary] = useState('');
  
  // File upload simulation
  const [file, setFile] = useState<File | null>(null);
  const [simulatedProgress, setSimulatedProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync category filter changes from parent tabs
  React.useEffect(() => {
    if (selectedCategoryFilter) {
      setCategoryFilter(selectedCategoryFilter);
    }
  }, [selectedCategoryFilter]);

  // Filtering logic
  const activeVacancies = vacancies.filter(v => v.status === 'Active');
  
  const filteredVacancies = activeVacancies.filter(v => {
    const matchesSearch = v.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          v.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.scopeOfWork.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'All' ? true : v.type === typeFilter;
    const matchesCategory = categoryFilter === 'all' ? true : v.category === categoryFilter;

    return matchesSearch && matchesType && matchesCategory;
  });

  // Handle Drag-n-drop simulated files
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = (selectedFile: File) => {
    setUploadError('');
    const extension = selectedFile.name.split('.').pop()?.toLowerCase();
    
    if (extension !== 'pdf' && extension !== 'docx' && extension !== 'doc') {
      setUploadError('Invalid type! We strictly accept .pdf or .doc/.docx resume formatting.');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) { // 10MB
      setUploadError('File size limits are capped at 10MB.');
      return;
    }

    setFile(selectedFile);
    setIsUploading(true);
    setSimulatedProgress(0);

    // Simulate steady upload progression
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

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    if (!fullName || !email || !phone || !education || !resumeSummary) {
      alert('Please fill out all mandatory demographic questions indicated.');
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
    // Clear state
    setTimeout(() => {
      setIsSubmitted(false);
      setIsApplying(false);
      setSelectedJob(null);
      resetForm();
    }, 2500);
  };

  const resetForm = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setExperience(2);
    setEducation('');
    setSkills('');
    setResumeSummary('');
    setFile(null);
    setSimulatedProgress(0);
    setUploadError('');
  };

  return (
    <div className="space-y-8 py-4 font-sans text-slate-900">
      
      {/* Search Filter Tools Toolbar */}
      <div className="bg-white p-6 border border-slate-200 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Text Input Search */}
          <div className="relative md:col-span-5">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="SEARCH KEYWORD, ROLE, OR SERVICE..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3.5 border border-slate-200 focus:outline-none focus:border-slate-900 text-xs font-bold uppercase tracking-wider bg-slate-50 focus:bg-white transition-all"
            />
          </div>

          {/* Category Selector dropdown */}
          <div className="md:col-span-4">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-3.5 border border-slate-200 focus:outline-none focus:border-slate-900 text-xs font-bold uppercase tracking-wider bg-slate-50 cursor-pointer text-slate-800"
            >
              <option value="all">ALL CATEGORIES</option>
              <option value="staffing">Contract, Temporary & Permanent Staffing</option>
              <option value="drivers_forklift">Drivers and Forklift Operators</option>
              <option value="hr_payroll font-sans">HR, Payroll and Statutory Compliance</option>
              <option value="painters_welders">Painters, Welders and Maintenance Operators</option>
              <option value="industrial_manpower">Skilled and Unskilled Industrial Manpower</option>
              <option value="facility_security">Security, Gardening and House Keeping</option>
              <option value="skill_development">Skill Development & Training Programs</option>
            </select>
          </div>

          {/* Employment Classification buttons */}
          <div className="md:col-span-3 flex border border-slate-200 bg-slate-100 p-1">
            {['All', 'Contract', 'Temporary', 'Permanent'].map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type as any)}
                className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  typeFilter === type
                    ? 'bg-slate-900 text-white font-black'
                    : 'text-slate-500 hover:text-slate-900 font-bold'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

        </div>

        {/* Counter indicator */}
        <div className="flex justify-between items-center text-xs text-slate-500 font-mono">
          <span>DISPLAYING {filteredVacancies.length} OPENINGS MATCHING YOUR CRITERIA</span>
          {(searchTerm || typeFilter !== 'All' || categoryFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setTypeFilter('All');
                setCategoryFilter('all');
              }}
              className="flex items-center space-x-1 text-primary-705 hover:text-slate-900 font-black uppercase tracking-wider cursor-pointer"
            >
              <FilterX className="h-3.5 w-3.5" />
              <span>Reset Queries</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid of job opportunities */}
      {filteredVacancies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredVacancies.map((vacancy) => (
            <div 
              key={vacancy.id}
              className="bg-white border border-slate-200 hover:border-slate-900 p-6 transition-all duration-150 flex flex-col justify-between group"
            >
              <div>
                
                {/* Header indicators */}
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div>
                    <span className="inline-block text-[9px] font-black tracking-widest uppercase text-white bg-slate-900 px-2.5 py-1">
                      {vacancy.type}
                    </span>
                    <span className="ml-2 inline-block text-[9px] font-bold tracking-widest uppercase text-slate-600 bg-slate-100 px-2.5 py-1 border border-slate-200">
                      {categoryDisplayLabels[vacancy.category] || vacancy.category}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono flex items-center uppercase tracking-wider font-bold">
                    <Calendar className="h-3 w-3 mr-1" />
                    {vacancy.datePosted}
                  </span>
                </div>

                <h3 className="text-base font-black text-slate-900 group-hover:text-primary-700 uppercase tracking-tight transition duration-150">
                  {vacancy.title}
                </h3>
                <p className="text-xs text-slate-550 font-bold uppercase tracking-wider mb-4">{vacancy.company}</p>

                <p className="text-xs text-slate-600 font-normal mb-5 line-clamp-3 leading-relaxed">
                  {vacancy.scopeOfWork}
                </p>

                {/* Sub features */}
                <div className="flex flex-wrap gap-y-1.5 gap-x-4 text-xs text-slate-550 border-t border-slate-100 pt-4 mb-6">
                  <span className="flex items-center">
                    <MapPin className="h-3.5 w-3.5 mr-1 text-gray-400" />
                    {vacancy.location}
                  </span>
                  <span className="flex items-center">
                    <IndianRupee className="h-3.5 w-3.5 mr-0.5 text-gray-400" />
                    {vacancy.salaryRange}
                  </span>
                </div>

              </div>

              {/* Action */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-900 font-bold uppercase tracking-wide">
                  {vacancy.applicantsCount} Applied Currently
                </span>
                <button
                  onClick={() => setSelectedJob(vacancy)}
                  className="flex items-center space-x-2 bg-slate-900 hover:bg-primary-700 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2.5 transition duration-150 cursor-pointer"
                >
                  <span>View Details</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 p-12 text-center space-y-4">
          <div className="bg-slate-100 text-slate-400 border border-slate-200 w-12 h-12 flex items-center justify-center mx-auto">
            <FilterX className="h-6 w-6" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-900">No matching listings found</h3>
            <p className="text-xs text-slate-500 font-normal">
              We update vacancies daily. Try adjusting search tags or submitting to the General Future Placement channel.
            </p>
          </div>
          <button
            onClick={() => {
              setSearchTerm('');
              setTypeFilter('All');
              setCategoryFilter('all');
            }}
            className="text-primary-700 hover:text-primary-800 text-xs font-bold uppercase tracking-widest cursor-pointer underline"
          >
            Clear All Criteria Filters
          </button>
        </div>
      )}

      {/* Detail Showcase & Application Drawer/Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/45 flex justify-center items-start p-4 sm:p-6 lg:p-10">
          <div className="bg-white w-full max-w-2xl border border-slate-300 my-auto overflow-hidden animate-slideUp">
            
            {/* Modal Head banner */}
            <div className="bg-slate-900 border-b border-slate-800 text-white p-6 relative">
              <button
                onClick={() => {
                  setSelectedJob(null);
                  setIsApplying(false);
                  resetForm();
                }}
                className="absolute right-4 top-4 text-white/70 hover:text-white p-2 border border-slate-800 bg-slate-950 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="space-y-1 pr-6">
                <span className="inline-block text-[9px] bg-primary-700 font-black tracking-widest uppercase px-3.5 py-1 text-white">
                  {selectedJob.type}
                </span>
                <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white mb-1">{selectedJob.title}</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{selectedJob.company}</p>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              
              {!isApplying ? (
                // Details Screen
                <div className="space-y-6">
                  
                  {/* Metadata Row */}
                  <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 border border-slate-200 text-xs text-slate-700">
                    <p className="font-medium">🌍 Location: <span className="font-normal text-gray-500">{selectedJob.location}</span></p>
                    <p className="font-medium">💰 Salary Range: <span className="font-normal text-gray-500">{selectedJob.salaryRange}</span></p>
                    <p className="font-medium">📅 Posted date: <span className="font-normal text-gray-500">{selectedJob.datePosted}</span></p>
                    <p className="font-medium">⚡ Stream: <span className="font-normal text-gray-500 capitalize">{categoryDisplayLabels[selectedJob.category] || selectedJob.category}</span></p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-gray-900 text-sm tracking-tight">Scope of Work & Objectives</h4>
                    <p className="text-sm text-gray-600 leading-relaxed font-light">{selectedJob.scopeOfWork}</p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-extrabold uppercase text-slate-900 text-xs tracking-wider font-sans">Role Requirements & Prerequisites</h4>
                    <ul className="space-y-2">
                      {selectedJob.serviceRequirements.map((req, idx) => (
                        <li key={idx} className="flex items-start space-x-2 text-xs text-gray-600">
                          <CheckCircle className="h-4 w-4 text-primary-700 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100">
                    <button
                      onClick={() => setSelectedJob(null)}
                      className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
                    >
                      Close View
                    </button>
                    <button
                      onClick={() => setIsApplying(true)}
                      className="bg-slate-900 hover:bg-primary-700 text-white text-xs font-bold uppercase tracking-widest px-6 py-2.5 transition cursor-pointer"
                    >
                      Apply Online Now
                    </button>
                  </div>

                </div>
              ) : isSubmitted ? (
                // Success message Screen
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto border border-green-200 shadow-sm animate-bounce">
                    <CheckCircle className="h-10 w-10" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-xl text-gray-900">Application Submitted!</h4>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto font-light leading-relaxed">
                      Thank you. Your candidate profile for <strong>{selectedJob.title}</strong> has been secured in the Express database. Our HR team conducts certification audits within 48 hours.
                    </p>
                  </div>
                  <p className="text-[10px] text-gray-400 font-mono">Closing applicant tracker window...</p>
                </div>
              ) : (
                // Application Form Screen
                <form onSubmit={handleApplySubmit} className="space-y-4">
                  
                  <div className="bg-slate-50 p-4 border border-slate-200 flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 text-primary-700 shrink-0" />
                    <p className="text-xs text-slate-700 font-normal">
                      Please submit accurate certificates. Background audits are conducted automatically under legal staffing policies.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-3 py-2 text-xs border border-slate-200 focus:outline-none focus:border-slate-900 bg-slate-50 font-bold uppercase tracking-wider"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full px-3 py-2 text-xs border border-slate-200 focus:outline-none focus:border-slate-900 bg-slate-50 font-bold uppercase tracking-wider"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Mobile Phone *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-3 py-2 text-xs border border-slate-200 focus:outline-none focus:border-slate-900 bg-slate-50 font-bold uppercase tracking-wider"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Relevant Experience (Years)</label>
                      <input
                        type="number"
                        min="0"
                        max="40"
                        value={experience}
                        onChange={(e) => setExperience(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs border border-slate-200 focus:outline-none focus:border-slate-900 bg-slate-50 font-bold uppercase tracking-wider"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Highest Education Level *</label>
                      <input
                        type="text"
                        required
                        value={education}
                        onChange={(e) => setEducation(e.target.value)}
                        placeholder="e.g. B.Sc. in Engineering, Vocational Certificate"
                        className="w-full px-3 py-2 text-xs border border-slate-200 focus:outline-none focus:border-slate-900 bg-slate-50 font-bold uppercase tracking-wider"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Coordinating Skills (Comma Separated)</label>
                      <input
                        type="text"
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        placeholder="e.g. Forklift Class IV, ISO 9001, Logistics, Safety"
                        className="w-full px-3 py-2 text-xs border border-slate-200 focus:outline-none focus:border-slate-900 bg-slate-50 font-bold uppercase tracking-wider"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Professional Cover Executive summary *</label>
                    <textarea
                      required
                      value={resumeSummary}
                      onChange={(e) => setResumeSummary(e.target.value)}
                      rows={3}
                      placeholder="Detail your industrial expertise, licenses held, or historical logistics duties brief summary..."
                      className="w-full px-3 py-2 text-xs border border-slate-200 focus:outline-none focus:border-slate-900 bg-slate-50 font-bold uppercase tracking-wider"
                    ></textarea>
                  </div>

                  {/* Drag-n-drop simulated Resume File Uploader */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Supporting File Resume CV Upload *</label>
                    
                    <div 
                      onDragOver={handleDragOver}
                      onDrop={handleFileDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-150 ${
                        file ? 'border-primary-700 bg-slate-50' : 'border-slate-200 hover:border-slate-900 bg-slate-50/50'
                      }`}
                    >
                      <input 
                        ref={fileInputRef}
                        type="file" 
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileSelect}
                        className="hidden" 
                      />
                      
                      <div className="flex flex-col items-center space-y-2">
                        <Upload className={`h-6 w-6 ${file ? 'text-green-500' : 'text-gray-400'}`} />
                        <div>
                          <p className="text-xs font-semibold text-gray-700">
                            {file ? `Resume: ${file.name}` : 'Drag & Drop your resume here, or click to browse'}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-1">Accepts PDF, DOC, DOCX files up to 10MB limit</p>
                        </div>
                      </div>
                    </div>

                    {isUploading && (
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] text-gray-400">
                          <span>Securing document parameters...</span>
                          <span>{simulatedProgress}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 overflow-hidden">
                          <div className="bg-slate-900 h-2 transition-all duration-150" style={{ width: `${simulatedProgress}%` }}></div>
                        </div>
                      </div>
                    )}

                    {uploadError && (
                      <p className="text-red-500 text-[10px] font-medium flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1 shrink-0" />
                        {uploadError}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsApplying(false)}
                      className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isUploading}
                      className={`bg-slate-900 hover:bg-primary-700 text-white text-xs font-bold uppercase tracking-widest px-6 py-2.5 transition cursor-pointer ${
                        isUploading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      Submit Candidate CV
                    </button>
                  </div>

                </form>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
