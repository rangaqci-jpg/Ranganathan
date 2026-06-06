import React, { useState, useRef } from 'react';
import { CandidateProfile } from '../types';
import { categoryDisplayLabels } from './VacanciesSection';
import { 
  FileCheck, 
  Upload, 
  Sparkles, 
  Milestone, 
  AlertCircle, 
  Layers, 
  User, 
  Mail, 
  PhoneCall, 
  GraduationCap, 
  Cpu, 
  Send 
} from 'lucide-react';

interface GeneralApplicationSectionProps {
  onAddGeneralApplication: (candidate: Omit<CandidateProfile, 'id' | 'dateSubmitted' | 'status'>) => void;
}

export default function GeneralApplicationSection({ onAddGeneralApplication }: GeneralApplicationSectionProps) {
  
  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredCategory, setPreferredCategory] = useState<string>('staffing');
  const [experience, setExperience] = useState<number>(3);
  const [education, setEducation] = useState('');
  const [skills, setSkills] = useState('');
  const [resumeSummary, setResumeSummary] = useState('');
  
  // File upload simulation
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorText, setErrorText] = useState('');
  const [success, setSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const validateAndProcessFile = (selectedFile: File) => {
    setErrorText('');
    const extension = selectedFile.name.split('.').pop()?.toLowerCase();
    
    if (extension !== 'pdf' && extension !== 'docx' && extension !== 'doc') {
      setErrorText('File type mismatch. Please submit a PDF (.pdf) or Word document (.doc/.docx).');
      return;
    }

    if (selectedFile.size > 12 * 1024 * 1024) { // 12MB limit
      setErrorText('Maximum supported resume files are capped at 12MB.');
      return;
    }

    setFile(selectedFile);
    setIsUploading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 20;
      });
    }, 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !email || !phone || !education || !resumeSummary) {
      alert('Please fill out all required demographic parameters.');
      return;
    }

    const skillsArray = skills.split(',').map(s => s.trim()).filter(s => s !== '');

    const categoryTextMap: Record<string, string> = {
      staffing: 'General Pool (Contract, Temporary & Permanent Staffing)',
      drivers_forklift: 'General Pool (Drivers and Forklift Operators)',
      hr_payroll: 'General Pool (HR, Payroll and Statutory Compliance)',
      painters_welders: 'General Pool (Painters, Welders and Maintenance Operators)',
      industrial_manpower: 'General Pool (Skilled and Unskilled Industrial Manpower)',
      facility_security: 'General Pool (Security, Gardening and House Keeping)',
      skill_development: 'General Pool (Skill Development & Training Programs)'
    };

    onAddGeneralApplication({
      fullName,
      email,
      phone,
      appliedJobId: 'general',
      appliedJobTitle: categoryTextMap[preferredCategory],
      resumeSummary,
      skills: skillsArray.length > 0 ? skillsArray : ['General Manpower', 'Adaptive learning'],
      experienceYears: Number(experience),
      education,
      resumeFileName: file ? file.name : 'General_Candidate_CV.pdf'
    });

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      resetForm();
    }, 3500);
  };

  const resetForm = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setPreferredCategory('staffing');
    setExperience(3);
    setEducation('');
    setSkills('');
    setResumeSummary('');
    setFile(null);
    setProgress(0);
    setErrorText('');
  };

  return (
    <div className="space-y-10 py-4 max-w-6xl mx-auto">
      
      {/* Intro Header */}
      <div className="bg-slate-900 border border-slate-800 text-white p-6 sm:p-10 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-800/20 pointer-events-none"></div>
        <div className="relative max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 bg-slate-950 px-3 py-1 font-mono text-[9px] font-black tracking-widest uppercase border border-slate-850 text-white">
            <Sparkles className="h-3.5 w-3.5" />
            <span>EXPRESS TALENT RESERVES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight">General Application Intake</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            Don&apos;t see a perfect vacancy alignment? We operate a dynamic candidate matching engine. 
            By submitting your profile, you register into our active talent pool. 
            Our hiring managers cross-index this database for future priority staffing initiatives.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Interactive Intake form (L-side) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 border border-slate-200">
          
          {success ? (
            <div className="py-16 text-center space-y-4 animate-scaleIn">
              <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto border border-green-100">
                <FileCheck className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h3 className="font-extrabold text-xl text-gray-900">Talent Record Activated!</h3>
                <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed font-light">
                  Excellent work, {fullName}. Your details are registered into our active Database. 
                  Our recruiting software processes skills records dynamically to match newly published listings.
                </p>
              </div>
              <button
                onClick={() => setSuccess(false)}
                className="text-primary-600 hover:text-primary-700 font-semibold text-xs cursor-pointer underline"
              >
                Submit another candidacy application
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <h3 className="text-lg font-bold text-gray-900 tracking-tight">Candidacy Portfolio Details</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jane Smith"
                    className="w-full px-4 py-3 text-xs border border-slate-200 focus:outline-none focus:border-slate-900 bg-slate-50 font-bold uppercase tracking-wider"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="janesmith@example.com"
                    className="w-full px-4 py-3 text-xs border border-slate-200 focus:outline-none focus:border-slate-900 bg-slate-50 font-bold uppercase tracking-wider"
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
                    placeholder="+1 (555) 776-8899"
                    className="w-full px-4 py-3 text-xs border border-slate-200 focus:outline-none focus:border-slate-900 bg-slate-50 font-bold uppercase tracking-wider"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    min="0"
                    max="45"
                    value={experience}
                    onChange={(e) => setExperience(Number(e.target.value))}
                    className="w-full px-4 py-3 text-xs border border-slate-200 focus:outline-none focus:border-slate-900 bg-slate-50 font-bold uppercase tracking-wider"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Preferred Solution Stream</label>
                  <select
                    value={preferredCategory}
                    onChange={(e) => setPreferredCategory(e.target.value)}
                    className="w-full px-4 py-3 text-xs border border-slate-200 focus:outline-none focus:border-slate-900 bg-slate-50 font-bold uppercase tracking-wider cursor-pointer text-slate-800"
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
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Highest Education Credential *</label>
                  <input
                    type="text"
                    required
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    placeholder="Vocational degree, Associate, etc."
                    className="w-full px-4 py-3 text-xs border border-slate-200 focus:outline-none focus:border-slate-900 bg-slate-50 font-bold uppercase tracking-wider"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Core Tech & Industrial Skill Tags (Comma Separated)</label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. Forklift, HVAC, Landscaping, Fire Safety, payroll accounting"
                  className="w-full px-4 py-3 text-xs border border-slate-200 focus:outline-none focus:border-slate-900 bg-slate-50 font-bold uppercase tracking-wider"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Professional Capability & CV Summary Statement *</label>
                <textarea
                  required
                  rows={4}
                  value={resumeSummary}
                  onChange={(e) => setResumeSummary(e.target.value)}
                  placeholder="Outline your background, certifications, scheduling availability, and how your competencies create opportunities here..."
                  className="w-full px-4 py-3 text-xs border border-slate-200 focus:outline-none focus:border-slate-900 bg-slate-50 font-bold uppercase tracking-wider"
                ></textarea>
              </div>

              {/* Secure file upload */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Attach Verified Curriculum Vitae (CV) *</label>
                <div 
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-150 ${
                    file ? 'border-primary-700 bg-slate-50' : 'border-slate-200 hover:border-slate-900 bg-slate-50/50'
                  }`}
                >
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx" 
                    className="hidden" 
                  />
                  <div className="flex flex-col items-center space-y-2">
                    <Upload className={`h-6 w-6 ${file ? 'text-slate-900' : 'text-slate-400'}`} />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">
                        {file ? `Resume Selected: ${file.name}` : 'Drag and Drop Resume CV, or click to pick file'}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-1">Accepts PDF, DOC, DOCX files up to 12MB</span>
                    </div>
                  </div>
                </div>

                {isUploading && (
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono">
                      <span>Uploading resume file streams...</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 overflow-hidden">
                      <div className="bg-slate-900 h-2 transition-all" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                )}

                {errorText && (
                  <p className="text-red-500 text-[10px] font-bold flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1 shrink-0" />
                    {errorText}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className="w-full flex items-center justify-center space-x-2 bg-slate-900 hover:bg-primary-700 text-white font-bold py-3.5 transition duration-150 cursor-pointer uppercase tracking-widest text-xs"
              >
                <Send className="h-4.5 w-4.5" />
                <span>Submit to Talent Pool Database</span>
              </button>

            </form>
          )}

        </div>

        {/* Real-time CV profile mock card preview (R-side) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-100 p-4 border border-slate-200">
            <h3 className="text-xs font-black text-slate-800 tracking-wider uppercase mb-1 font-mono">Interactive Portal Preview</h3>
            <p className="text-[10px] text-slate-505 font-normal font-mono">This shows exactly what administrators see dynamically in the candidate database.</p>
          </div>

          <div className="bg-white border border-slate-200 p-6 relative overflow-hidden space-y-6">
            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 border-b border-l border-slate-200"></div>

            {/* Profile heading */}
            <div className="flex items-start space-x-4 relative">
              <div className="w-12 h-12 bg-slate-900 text-white font-black flex items-center justify-center text-sm border border-slate-800">
                {fullName ? fullName.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : 'CV'}
              </div>
              <div>
                <h4 className="font-black text-base text-slate-900 uppercase tracking-tight">
                  {fullName || 'Your Full Name'}
                </h4>
                <p className="text-[10px] text-primary-700 font-bold uppercase tracking-wider font-mono">
                  {preferredCategory ? `Future ${categoryDisplayLabels[preferredCategory] || preferredCategory} Pool` : 'Preferred Solutions Pool'}
                </p>
              </div>
            </div>

            {/* Demographic Parameters */}
            <div className="space-y-2.5 text-xs text-gray-600 border-t border-b border-gray-50 py-4 font-light">
              <div className="flex items-center space-x-2">
                <User className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                <span>Status: <strong className="font-bold text-slate-900 bg-slate-100 px-2 py-1 tracking-wider uppercase text-[9px] border border-slate-200">Candidate Pool Intake</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                <span>{email || 'not.submitted@email.com'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <PhoneCall className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                <span>{phone || 'No phone provided'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                <span>{education || 'Education Details Pending'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Milestone className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                <span>{experience} years of structural experience</span>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="text-[10px] font-bold text-slate-400 tracking-wider uppercase flex items-center space-x-1">
                <Cpu className="h-3 w-3 text-primary-700 font-black" />
                <span>Candidate Competency tags</span>
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {skills ? skills.split(',').map((skill, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-900 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 border border-slate-200">
                    {skill.trim()}
                  </span>
                )) : (
                  <span className="text-slate-400 font-normal text-[10px]">No skill items filled...</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Executive Summary Statement</h5>
              <p className="text-xs text-gray-500 font-light leading-relaxed italic line-clamp-4">
                &ldquo;{resumeSummary || 'Provide a compelling resume statement highlighting your field experiences and background skills...'}&rdquo;
              </p>
            </div>

            {file && (
              <div className="flex items-center space-x-2 bg-slate-50 p-2.5 border border-slate-200 text-slate-900 text-xs font-mono">
                <FileCheck className="h-4 w-4 text-slate-900 shrink-0" />
                <span className="font-bold truncate uppercase">{file.name}</span>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
