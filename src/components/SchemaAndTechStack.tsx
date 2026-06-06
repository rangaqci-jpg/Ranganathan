import React, { useState } from 'react';
import { 
  Database, 
  Layers, 
  Map, 
  Cpu, 
  Server, 
  ShieldCheck, 
  Key, 
  GitBranch, 
  Terminal, 
  Check, 
  HelpCircle,
  TrendingUp,
  Workflow,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';

export default function SchemaAndTechStack() {
  const [activeSubTab, setActiveSubTab] = useState<'erd' | 'stack' | 'flow'>('erd');
  const [selectedTable, setSelectedTable] = useState<string>('vacancies');

  const databaseTables = {
    vacancies: {
      name: 'vacancies',
      title: 'Job Vacancies Table',
      description: 'Maintains all published, temporary, contract, or permanent staffing and manpower opportunities requested by enterprise clients.',
      columns: [
        { name: 'id', type: 'VARCHAR(50)', constraint: 'PRIMARY KEY', description: 'Unique alphanumeric identifier (e.g. job-101).' },
        { name: 'title', type: 'VARCHAR(150)', constraint: 'NOT NULL', description: 'Detailed name of job/placement position.' },
        { name: 'company', type: 'VARCHAR(100)', constraint: 'NOT NULL', description: 'Enterprise client requesting staffing.' },
        { name: 'category', type: 'VARCHAR(50)', constraint: 'NOT NULL', description: 'staffing | technical | facility | corporate.' },
        { name: 'type', type: 'VARCHAR(30)', constraint: 'NOT NULL', description: 'Position type: Contract, Temporary, or Permanent.' },
        { name: 'scope_of_work', type: 'TEXT', constraint: 'NOT NULL', description: 'Operational targets and shifts schedules.' },
        { name: 'service_requirements', type: 'TEXT[]', constraint: 'NOT NULL DEFAULT \'{}\'', description: 'Certified license lists and prerequisites.' },
        { name: 'location', type: 'VARCHAR(150)', constraint: 'NOT NULL', description: 'Work site coordinates.' },
        { name: 'salary_range', type: 'VARCHAR(80)', constraint: 'NULL', description: 'Base salary or contractor rate.' },
        { name: 'status', type: 'VARCHAR(20)', constraint: 'DEFAULT \'Active\'', description: 'To control page publishing feeds (Active/Draft).' },
        { name: 'date_posted', type: 'DATE', constraint: 'DEFAULT CURRENT_DATE', description: 'Date the vacancy was published.' }
      ],
      sql: `CREATE TABLE vacancies (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  company VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('staffing', 'technical', 'facility', 'corporate')),
  type VARCHAR(30) NOT NULL CHECK (type IN ('Contract', 'Temporary', 'Permanent')),
  scope_of_work TEXT NOT NULL,
  service_requirements TEXT[] NOT NULL DEFAULT '{}',
  location VARCHAR(150) NOT NULL,
  salary_range VARCHAR(80),
  status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Draft')),
  date_posted DATE DEFAULT CURRENT_DATE
);`
    },
    candidates: {
      name: 'candidates',
      title: 'Candidates & Applicants Table',
      description: 'Records profiles submitted via open vacancies or general database. Secured with personal compliance hash checking.',
      columns: [
        { name: 'id', type: 'VARCHAR(50)', constraint: 'PRIMARY KEY', description: 'Generated unique applicant UUID.' },
        { name: 'full_name', type: 'VARCHAR(150)', constraint: 'NOT NULL', description: 'Candidate identifier name.' },
        { name: 'email', type: 'VARCHAR(120)', constraint: 'NOT NULL UNIQUE', description: 'Secure contact channel.' },
        { name: 'phone', type: 'VARCHAR(30)', constraint: 'NOT NULL', description: 'Mobile channel verified code.' },
        { name: 'applied_job_id', type: 'VARCHAR(50)', constraint: 'FOREIGN KEY REFERENCES vacancies(id) ON DELETE SET NULL', description: 'Connected job code ("general" for speculative resumes).' },
        { name: 'resume_summary', type: 'TEXT', constraint: 'NOT NULL', description: 'Executive summary detailing previous industrial experiences.' },
        { name: 'skills', type: 'TEXT[]', constraint: 'NOT NULL DEFAULT \'{}\'', description: 'Full-text indexed tags representing certified capabilities.' },
        { name: 'experience_years', type: 'INTEGER', constraint: 'NOT NULL DEFAULT 0', description: 'Number of years working in equivalent role.' },
        { name: 'education', type: 'VARCHAR(200)', constraint: 'NOT NULL', description: 'Highest certificate or degree earned.' },
        { name: 'status', type: 'VARCHAR(30)', constraint: 'DEFAULT \'Pending\'', description: 'Hiring stage: Pending | Under Review | Interviewing | Shortlisted | Rejected.' },
        { name: 'resume_file_name', type: 'VARCHAR(250)', constraint: 'NULL', description: 'File tracking reference located on secure Cloud bucket.' },
        { name: 'date_submitted', type: 'TIMESTAMP', constraint: 'DEFAULT CURRENT_TIMESTAMP', description: 'Chronology submission index.' }
      ],
      sql: `CREATE TABLE candidates (
  id VARCHAR(50) PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  phone VARCHAR(30) NOT NULL,
  applied_job_id VARCHAR(50) REFERENCES vacancies(id) ON DELETE SET NULL,
  resume_summary TEXT NOT NULL,
  skills TEXT[] NOT NULL DEFAULT '{}',
  experience_years INTEGER NOT NULL DEFAULT 0 CHECK (experience_years >= 0),
  education VARCHAR(200) NOT NULL,
  status VARCHAR(30) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Under Review', 'Interviewing', 'Shortlisted', 'Rejected')),
  resume_file_name VARCHAR(250),
  date_submitted TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`
    },
    services_content: {
      name: 'services_content',
      title: 'Company Services & Solutions Table',
      description: 'Drives dynamic content on the homepage service cards, editable by administrators.',
      columns: [
        { name: 'id', type: 'VARCHAR(30)', constraint: 'PRIMARY KEY', description: 'Unique structural key (e.g. s1, s2).' },
        { name: 'category', type: 'VARCHAR(40)', constraint: 'NOT NULL UNIQUE', description: 'The connected branch category mapping.' },
        { name: 'title', type: 'VARCHAR(100)', constraint: 'NOT NULL', description: 'Display name shown in headers.' },
        { name: 'description', type: 'TEXT', constraint: 'NOT NULL', description: 'Corporate division capabilities narrative.' },
        { name: 'subservices', type: 'TEXT[]', constraint: 'NOT NULL DEFAULT \'{}\'', description: 'Nested disciplines list rendered inside card bullets.' }
      ],
      sql: `CREATE TABLE services_content (
  id VARCHAR(30) PRIMARY KEY,
  category VARCHAR(40) NOT NULL UNIQUE,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  subservices TEXT[] NOT NULL DEFAULT '{}'
);`
    },
    statutory_audits: {
      name: 'statutory_audits',
      title: 'Compliance & Audit Logs Table',
      description: 'Records critical security checks, statutory compliance assessments, and resume certifications audits for client liability protection.',
      columns: [
        { name: 'log_id', type: 'BIGSERIAL', constraint: 'PRIMARY KEY', description: 'Incrementing chronologic log sequence.' },
        { name: 'candidate_id', type: 'VARCHAR(50)', constraint: 'FOREIGN KEY REFERENCES candidates(id) ON DELETE CASCADE', description: 'Verified candidate.' },
        { name: 'auditor_credentials', type: 'VARCHAR(100)', constraint: 'NOT NULL', description: 'Admin ID authorizing the check.' },
        { name: 'statutory_check_passed', type: 'BOOLEAN', constraint: 'NOT NULL DEFAULT FALSE', description: 'Boolean confirming compliance validation.' },
        { name: 'regulatory_notes', type: 'TEXT', constraint: 'NULL', description: 'Legal audit findings and license confirmations notes.' },
        { name: 'audit_timestamp', type: 'TIMESTAMP', constraint: 'DEFAULT CURRENT_TIMESTAMP', description: 'Log time.' }
      ],
      sql: `CREATE TABLE statutory_audits (
  log_id BIGSERIAL PRIMARY KEY,
  candidate_id VARCHAR(50) REFERENCES candidates(id) ON DELETE CASCADE,
  auditor_credentials VARCHAR(100) NOT NULL,
  statutory_check_passed BOOLEAN NOT NULL DEFAULT FALSE,
  regulatory_notes TEXT,
  audit_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`
    }
  };

  const selectedTableData = databaseTables[selectedTable as keyof typeof databaseTables];

  return (
    <div className="space-y-10 py-4 max-w-7xl mx-auto">
      
      {/* Banner introduction with Sparkles */}
      <div className="bg-primary-950 text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-primary-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center space-x-2 bg-primary-900/40 text-primary-300 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border border-primary-800/50">
            <Cpu className="h-3.5 w-3.5" />
            <span>EXPRESS ARCHITECTURE CENTER</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">System Core Blueprints</h2>
          <p className="text-xs sm:text-sm text-primary-200 leading-relaxed font-light">
            Interactive schema blueprints, recommended database relation tables, and flow diagrams mapping how Express Employment connects businesses with talents.
          </p>
        </div>

        {/* Sub-navigation selectors */}
        <div className="flex bg-white/10 p-1.5 rounded-2xl border border-white/10 uppercase font-mono tracking-wider shrink-0 gap-1.5 text-xs w-full sm:w-auto">
          <button
            onClick={() => setActiveSubTab('erd')}
            className={`flex-1 sm:flex-none uppercase px-4 py-2 rounded-xl transition font-bold text-center cursor-pointer ${
              activeSubTab === 'erd' ? 'bg-primary-500 text-white shadow-sm' : 'text-primary-300 hover:text-white'
            }`}
          >
            ERD DB Schema
          </button>
          <button
            onClick={() => setActiveSubTab('stack')}
            className={`flex-1 sm:flex-none uppercase px-4 py-2 rounded-xl transition font-bold text-center cursor-pointer ${
              activeSubTab === 'stack' ? 'bg-primary-500 text-white shadow-sm' : 'text-primary-300 hover:text-white'
            }`}
          >
            Enterprise Stack
          </button>
          <button
            onClick={() => setActiveSubTab('flow')}
            className={`flex-1 sm:flex-none uppercase px-4 py-2 rounded-xl transition font-bold text-center cursor-pointer ${
              activeSubTab === 'flow' ? 'bg-primary-500 text-white shadow-sm' : 'text-primary-300 hover:text-white'
            }`}
          >
            Slogan Wireframe Map
          </button>
        </div>
      </div>

      {/* RENDER ACTIVE TAB */}

      {activeSubTab === 'erd' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Visual representations: Table ERD nodes mapping */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="font-bold text-base text-gray-900 tracking-tight">Relational Database Schemas (ERD)</h3>
            <p className="text-xs text-gray-500 font-light">
              We recommend schema normalization using PostgreSQL inside Google Cloud SQL. Choose a node below to review its columns definitions and SQL creation scripts.
            </p>

            <div className="space-y-3.5 pt-2">
              {Object.values(databaseTables).map((tbl) => {
                const isActive = selectedTable === tbl.name;
                return (
                  <button
                    key={tbl.name}
                    onClick={() => setSelectedTable(tbl.name)}
                    className={`w-full text-left p-4 rounded-2xl border cursor-pointer transition-all duration-150 relative overflow-hidden group ${
                      isActive 
                        ? 'bg-primary-50 border-primary-500 shadow-sm' 
                        : 'bg-white border-gray-100 hover:border-gray-200 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-xl ${isActive ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                        <Database className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-400 font-mono block">TABLE</span>
                        <h4 className="font-extrabold text-sm text-gray-900 tracking-tight">{tbl.name}</h4>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 font-light line-clamp-2 leading-relaxed">
                      {tbl.description}
                    </p>
                    
                    {/* Visual relation markers overlay */}
                    {tbl.name === 'vacancies' && (
                      <span className="absolute right-4 top-4 bg-primary-100 text-primary-700 text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase">
                        Parent (1:N)
                      </span>
                    )}
                    {tbl.name === 'candidates' && (
                      <span className="absolute right-4 top-4 bg-green-100 text-green-700 text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase">
                        Inbound Keys
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive SQL and Field Specifications Viewer */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              
              <div className="flex items-center space-x-3 pb-4 border-b border-gray-50">
                <div className="p-3 bg-primary-50 rounded-2xl text-primary-500">
                  <Terminal className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-gray-900 tracking-tight">{selectedTableData.title}</h3>
                  <code className="text-[10px] bg-gray-100 px-2 py-0.5 rounded font-mono text-gray-500">
                    SCHEMA RELATION NAME: {selectedTableData.name}
                  </code>
                </div>
              </div>

              {/* Table description */}
              <p className="text-xs sm:text-sm text-gray-650 leading-relaxed font-light font-sans">
                {selectedTableData.description}
              </p>

              {/* Column specifications list */}
              <div className="space-y-3.5">
                <h4 className="text-[10px] font-extrabold text-gray-400 tracking-wider uppercase">Fields Definitions Details</h4>
                <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-gray-100 border-b border-gray-100 font-bold text-gray-500 uppercase tracking-widest text-[9px]">
                        <th className="px-4 py-2.5">Field</th>
                        <th className="px-4 py-2.5">SQL Type</th>
                        <th className="px-4 py-2.5">Attribute / Rule</th>
                        <th className="px-4 py-2.5">Description Constraints</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-mono text-[11px] text-gray-700">
                      {selectedTableData.columns.map((col, idx) => (
                        <tr key={idx} className="hover:bg-gray-200/20">
                          <td className="px-4 py-2.5 font-bold text-gray-900">{col.name}</td>
                          <td className="px-4 py-2.5 text-primary-600">{col.type}</td>
                          <td className="px-4 py-2.5 text-yellow-700 font-semibold">{col.constraint || 'NULLABLE'}</td>
                          <td className="px-4 py-2.5 font-sans text-xs font-light text-gray-500">{col.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pure PostgreSQL Generation query */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-extrabold text-gray-400 tracking-wider uppercase">Postgres SQL DDL Statement</h4>
                <div className="bg-gray-950 text-gray-100 font-mono text-[11px] p-5 rounded-2xl overflow-x-auto relative shadow-inner">
                  <div className="absolute right-4 top-3 text-[9px] uppercase font-bold text-gray-500">POSTGRES DDL</div>
                  <pre className="mt-2 text-primary-200">{selectedTableData.sql}</pre>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {activeSubTab === 'stack' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">Recommended Enterprise Tech Stack</h3>
            <p className="text-sm text-gray-500 font-light">
              Highly secure, cloud-enabled infrastructure architecture mapping designed to handle massive payroll distributions and candidate pools confidential documents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            
            {/* FRONTEND BLUEPRINT */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-5">
              <div className="flex items-center space-x-3 pb-3 border-b border-gray-50">
                <div className="bg-primary-50 text-primary-600 p-2.5 rounded-xl">
                  <Layers className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-gray-900">1. Client Interaction tier (Frontend)</h4>
                  <p className="text-[10px] text-gray-400 font-mono font-bold uppercase inline-block">SPA Interface Profile</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { title: 'React SPA Engine (v18/v19)', role: 'Drives high-fidelity interactive user pages with modular container splits for vacancies searching & dynamic uploader profiles.' },
                  { title: 'Tailwind CSS Stylist', role: 'Advanced responsive design utilities delivering frictionless layout transitions across smartphones, tablets, and desktop workstations.' },
                  { title: 'Typescript strict safety', role: 'Maintains zero-leak structural mapping schemas and robust contract validator checks before api endpoints submit fields.' },
                  { title: 'Motion Animation library', role: 'Orchestrates directional slide-ins and modal entrances to increase applicant retention and focus.' }
                ].map((item, id) => (
                  <div key={id} className="flex items-start space-x-3">
                    <Check className="h-4.5 w-4.5 text-primary-500 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-gray-900">{item.title}</h5>
                      <p className="text-xs text-gray-500 font-light leading-relaxed mt-0.5">{item.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BACKEND & SERVICES BLUEPRINT */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-5">
              <div className="flex items-center space-x-3 pb-3 border-b border-gray-50">
                <div className="bg-primary-50 text-primary-600 p-2.5 rounded-xl">
                  <Server className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-gray-900">2. Business logic API Tier (Backend)</h4>
                  <p className="text-[10px] text-gray-400 font-mono font-bold uppercase inline-block font-sans">RESTful microservice architecture</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { title: 'Node.js & Express framework API', title_sm: 'Deployable on secure Google Cloud Run docker containers, auto-scaling instantly based on active payroll loads.' },
                  { title: 'Resume PDF CV parser worker', title_sm: 'Parses incoming resumes via machine intelligence, instantly generating indexer strings and extracting candidate capabilities.' },
                  { title: 'Statutory compliance validation filters', title_sm: 'Automatic preprocessors guarding background checks, withholding rates, and certificate expiration indexes.' },
                  { title: 'OAuth Authenticator middleware', title_sm: 'Secures candidate information databases, permitting administrative actions exclusively under signed session tokens.' }
                ].map((item, id) => (
                  <div key={id} className="flex items-start space-x-3">
                    <Check className="h-4.5 w-4.5 text-primary-500 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-gray-900">{item.title}</h5>
                      <p className="text-xs text-gray-500 font-light leading-relaxed mt-0.5">{item.title_sm}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DATABASE BLUEPRINT */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-5">
              <div className="flex items-center space-x-3 pb-3 border-b border-gray-50">
                <div className="bg-primary-50 text-primary-600 p-2.5 rounded-xl">
                  <Database className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-gray-900">3. Durable Persistence & Storage</h4>
                  <p className="text-[10px] text-gray-400 font-mono font-bold uppercase inline-block">Cloud database mapping</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { title: 'Google Cloud SQL for PostgreSQL', body: 'ACID transactional relational base driving strong relational constraints between vacancies and applicants candidate records.' },
                  { title: 'Cloud GCS document buckets', body: 'Hosts sensitive uploaded resumes CV PDFs, generating time-bound secure URLs referenced recursively inside candidates base tables.' },
                  { title: 'Optimized fulltext indexes', body: 'Index tables on vectors fields to support lightning fast candidate skills search by recruiting executives.' },
                  { title: 'Automated DB backup routines', body: 'Incremental hourly point-in-time recovery setups safeguarding state against emergency server hardware outages.' }
                ].map((item, id) => (
                  <div key={id} className="flex items-start space-x-3">
                    <Check className="h-4.5 w-4.5 text-primary-500 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-gray-900">{item.title}</h5>
                      <p className="text-xs text-gray-500 font-light leading-relaxed mt-0.5">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECURITY & LEGAL COMPLIANCE */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-5">
              <div className="flex items-center space-x-3 pb-3 border-b border-gray-50">
                <div className="bg-primary-50 text-primary-600 p-2.5 rounded-xl">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-gray-900">4. Statutory Compliance & Protection</h4>
                  <p className="text-[10px] text-gray-400 font-mono font-bold uppercase inline-block">Data safety measures</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { title: 'Encrypted candidate data (AES-256)', r: 'Critical demographic phone and validation elements are ciphered securely to adhere to regional data regulations.' },
                  { title: 'Role Based Access Control (RBAC)', r: 'Strict separation of employee views, securing sensitive candidate files which only certified HR managers can access.' },
                  { title: 'Statutory Audits History Logs', r: 'Tracks changes made in candidate stage variables, generating an audit history trails to secure the firm liability.' },
                  { title: 'Isolated Sandbox Environments', r: 'Full environments containment prevents penetration test failures or horizontal container intrusion attacks.' }
                ].map((item, id) => (
                  <div key={id} className="flex items-start space-x-3">
                    <Check className="h-4.5 w-4.5 text-primary-500 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-gray-900">{item.title}</h5>
                      <p className="text-xs text-gray-500 font-light leading-relaxed mt-0.5">{item.r}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {activeSubTab === 'flow' && (
        <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-10 shadow-sm space-y-10 animate-fadeIn">
          
          <div className="max-w-xl space-y-2">
            <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">
              &ldquo;We Create Opportunities&rdquo; Journey flows
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed text-sans">
              A comprehensive wireframe schematic illustrating how our candidate matching pipeline executes recruitment drives from initial clients corporate needs to permanent professional placement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start relative pt-4">
            
            {/* STAGE 1 */}
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-3 relative group hover:border-primary-300 transition duration-150">
              <span className="text-[10px] font-mono bg-primary-100 text-primary-600 px-2 py-0.5 rounded font-bold">STAGE 1</span>
              <h4 className="font-bold text-sm text-primary-950">Clients Corporate Request</h4>
              <p className="text-xs text-gray-500 font-light leading-relaxed">
                Enterprise partner uploads technical requirements, license qualifications, and compensation budgets inside the Admin Secure portal.
              </p>
              <div className="text-[10px] font-mono text-gray-400 pt-2 border-t border-gray-200">
                Action: <span className="text-primary-600 font-bold">Write to vacancies Table</span>
              </div>
            </div>

            {/* STAGE 2 */}
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-3 relative group hover:border-primary-300 transition duration-150">
              <span className="text-[10px] font-mono bg-primary-100 text-primary-600 px-2 py-0.5 rounded font-bold">STAGE 2</span>
              <h4 className="font-bold text-sm text-primary-950">Applicant Intake Portal</h4>
              <p className="text-xs text-gray-500 font-light leading-relaxed">
                Candidates select matching listings, or upload speculative profiles in the General Pool, dragging resume PDFs with skill specifications.
              </p>
              <div className="text-[10px] font-mono text-gray-400 pt-2 border-t border-gray-200">
                Action: <span className="text-primary-600 font-bold">Store in candidates Table</span>
              </div>
            </div>

            {/* STAGE 3 */}
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-3 relative group hover:border-primary-300 transition duration-150">
              <span className="text-[10px] font-mono bg-primary-100 text-primary-600 px-2 py-0.5 rounded font-bold">STAGE 3</span>
              <h4 className="font-bold text-sm text-primary-950">Skills Audit Engine</h4>
              <p className="text-xs text-gray-500 font-light leading-relaxed">
                Recruiting automated filters parse skills array, verifying required forklift licenses and structural experience levels.
              </p>
              <div className="text-[10px] font-mono text-gray-400 pt-2 border-t border-gray-200">
                Action: <span className="text-primary-600 font-bold">Indexed skills query filters</span>
              </div>
            </div>

            {/* STAGE 4 */}
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-3 relative group hover:border-primary-300 transition duration-150">
              <span className="text-[10px] font-mono bg-primary-100 text-primary-600 px-2 py-0.5 rounded font-bold">STAGE 4</span>
              <h4 className="font-bold text-sm text-primary-950">Statutory Compliance Audit</h4>
              <p className="text-xs text-gray-500 font-light leading-relaxed">
                Executive HR managers execute manual certification reviews and background clearing audits, confirming legal compliance before placement.
              </p>
              <div className="text-[10px] font-mono text-gray-400 pt-2 border-t border-gray-200">
                Action: <span className="text-primary-600 font-bold">Update statutory_audits Log</span>
              </div>
            </div>

          </div>

          <div className="bg-primary-50 p-5 rounded-2xl border border-primary-100 text-center max-w-xl mx-auto space-y-1">
            <h4 className="font-bold text-sm text-primary-950 flex items-center justify-center space-x-1">
              <Sparkles className="h-4.5 w-4.5 text-primary-500" />
              <span>Result: Opportunities Created.</span>
            </h4>
            <p className="text-xs text-primary-700 font-light">
              This structural flow ensures client-agency compliance and places qualified candidates into long-term commercial careers safely.
            </p>
          </div>

        </div>
      )}

    </div>
  );
}
