import { JobVacancy, CandidateProfile, ServiceDetail } from '../types';

export const initialServices: ServiceDetail[] = [
  {
    id: 's1',
    category: 'staffing',
    title: 'Contract, Temporary & Permanent Staffing',
    description: 'Comprehensive contract, temporary, and permanent workforce management tailored to commercial, industrial, and agricultural sectors. We manage the end-to-end recruitment lifecycle, worker inductions, and labor regulatory payroll.',
    subservices: [
      'Contractual Manpower Supply',
      'Temporary Seasonal Helpers',
      'Permanent Hiring Drives',
      'On-site Labor Management'
    ],
    icon: 'Briefcase'
  },
  {
    id: 's2',
    category: 'drivers_forklift',
    title: 'Drivers and Forklift Operators',
    description: 'Certified logistics specialists, warehouse stacker operators, heavy forklift drivers, and commercial delivery vehicle operators with pristine safety benchmarks and clean records.',
    subservices: [
      'Heavy Forklift Operators',
      'Battery Pallet Truck Operators',
      'Reach Truck Operators',
      'Commercial Rig & Logistics Drivers'
    ],
    icon: 'Truck'
  },
  {
    id: 's3',
    category: 'hr_payroll',
    title: 'HR, Payroll and Statutory Compliance',
    description: 'Assisting employers with comprehensive payroll administration, tax management, labor law compliance audits, and full EPF/ESIC regulatory contributions filing.',
    subservices: [
      'EPF & ESIC Contributions Filing',
      'Statutory Compliance Audits',
      'Salary Disbursements Management',
      'Labor Advisory Solutions'
    ],
    icon: 'FileText'
  },
  {
    id: 's4',
    category: 'painters_welders',
    title: 'Painters, Welders and Maintenance Operators',
    description: 'Experienced industry technicians including certified structural welders, industrial painters, blast operators, repair mechanic hands, and plant equipment helpers.',
    subservices: [
      'Certified MIG & TIG Welders',
      'Industrial Spray Painters',
      'Plant Equipment Mechanics',
      'General Maintenance Helpers'
    ],
    icon: 'Hammer'
  },
  {
    id: 's5',
    category: 'industrial_manpower',
    title: 'Skilled and Unskilled Industrial Manpower',
    description: 'High-availability skilled machine helpers, CNC operators, assembly line crews, stackers, loads-handlers, and flexible general labor for mills and heavy manufacturing hubs.',
    subservices: [
      'Skilled CNC & Assembly Helpers',
      'Unskilled Loading & Offloading Crews',
      'Factory Operations Helpers',
      'Temporary Yard Workers'
    ],
    icon: 'Users'
  },
  {
    id: 's6',
    category: 'facility_security',
    title: 'Security, Gardening and House Keeping',
    description: 'Non-core facilities operations support including 24/7 corporate and industrial site guarding, landscape gardening, and professional deep sanitization and janitorial housekeeping.',
    subservices: [
      'Industrial Security Guarding',
      'Estate & Factory Landscaping',
      'Commercial Janitorial Housekeeping',
      'Property Maintenance Helpers'
    ],
    icon: 'Shield'
  },
  {
    id: 's7',
    category: 'skill_development',
    title: 'Skill Development & Training Programs',
    description: 'Enhancing workforce capability through technical trades tutoring, safety drills, compliance certifications, and machine-operation training programs.',
    subservices: [
      'Vocational Technical Training',
      'Workforce Safety Certifications',
      'EPF/ESIC Compliance Inductions',
      'Advanced Machinery Operation Drills'
    ],
    icon: 'GraduationCap'
  }
];

export const initialVacancies: JobVacancy[] = [
  {
    id: 'job-101',
    title: 'Heavy Duty Forklift Operator',
    company: 'Express Logistics Hub',
    category: 'drivers_forklift',
    type: 'Contract',
    scopeOfWork: 'Operating premium hydraulic stackers and 15-ton diesel forklifts for high-volume pallet transfer. Performing basic pre-shift mechanic checks and ensuring zero-defect loading metrics inside strict storage rows.',
    serviceRequirements: [
      'Valid Class IV Forklift License authorized for heavy lifting',
      'Minimum of 3 years of experience operating in high-density cold warehouse units',
      'Clean safety record zero accidents in active shipping environments'
    ],
    location: 'Central Industrial Zone, West Chester',
    salaryRange: '₹250 - ₹350 / hour',
    status: 'Active',
    datePosted: '2026-06-01',
    applicantsCount: 5
  },
  {
    id: 'job-102',
    title: 'Senior MIG & TIG Welder',
    company: 'Precision Steel Fabrication Co.',
    category: 'painters_welders',
    type: 'Permanent',
    scopeOfWork: 'Reading high-precision technical blueprints and welding major structural modules under ASME Section IX protocols. Inspecting joins for structural completeness and reporting load metrics to team leads.',
    serviceRequirements: [
      'ASME Section IX Welding Certification',
      'Proven expertise with carbon steel and alloy fabrication setups',
      'Ability to translate layout diagrams and engineering schematics'
    ],
    location: 'Metals District, East River',
    salaryRange: '₹6,00,000 - ₹7,20,000 / year',
    status: 'Active',
    datePosted: '2026-06-02',
    applicantsCount: 3
  },
  {
    id: 'job-103',
    title: 'HR & Payroll Administrator',
    company: 'Express Corporate HQ',
    category: 'hr_payroll',
    type: 'Permanent',
    scopeOfWork: 'Processing monthly payroll runs for up to 450 contract personnel, checking statutory contributions, managing tax audits, and supporting client invoicing teams.',
    serviceRequirements: [
      'Degree in Human Resource Management or Accounting preferred',
      'Thorough understanding of regional labor standards and compliance rules',
      'Hands-on dashboard audit expertise with ERP payroll systems'
    ],
    location: 'Financial Quadrant, Downtown',
    salaryRange: '₹5,50,000 - ₹6,50,000 / year',
    status: 'Active',
    datePosted: '2026-05-28',
    applicantsCount: 8
  },
  {
    id: 'job-104',
    title: 'Corporate Security Supervisor',
    company: 'Capital Plaza Office Block',
    category: 'facility_security',
    type: 'Permanent',
    scopeOfWork: 'Supervising security patrols, orchestrating access control systems across 4 key parking checkpoints, monitoring real-time security systems, and executing emergency security plans.',
    serviceRequirements: [
      'State Guard Card and Security Management Certification',
      'Physical fitness and certified training in emergency first response',
      'Excellent verbal conflict resolution skills and control center experience'
    ],
    location: 'Financial Quadrant, Downtown',
    salaryRange: '₹4,80,000 - ₹5,40,000 / year',
    status: 'Active',
    datePosted: '2026-06-03',
    applicantsCount: 2
  },
  {
    id: 'job-105',
    title: 'Temporary Inventory Clerks (12 Openings)',
    company: 'Continental Retail Logistics',
    category: 'staffing',
    type: 'Temporary',
    scopeOfWork: 'Scanning barcode registries, sorting incoming inventory units, staging packing bays, and managing daily stock level adjustments using handheld RF scanners.',
    serviceRequirements: [
      'Basic numeric accuracy and physical capability to load inventory packs',
      'Previous experience in peak-season retail supply warehouses',
      'Strong time management and attendance reliability records'
    ],
    location: 'Central Industrial Zone, West Chester',
    salaryRange: '₹180 - ₹220 / hour',
    status: 'Active',
    datePosted: '2026-06-04',
    applicantsCount: 14
  }
];

export const initialCandidates: CandidateProfile[] = [
  {
    id: 'cand-001',
    fullName: 'Robert Miller',
    email: 'robert.miller@example.com',
    phone: '+1 (555) 342-9988',
    appliedJobId: 'job-101',
    appliedJobTitle: 'Heavy Duty Forklift Operator',
    resumeSummary: 'Experienced Class IV loader driver with 5 years working in logistics yards. Specialized in deep-freeze logistics operations, cargo loading compliance, and maintaining strict safety benchmarks.',
    skills: ['Forklift Operation', 'Warehouse Safety', 'RF Scanning', 'Inventory Checking'],
    experienceYears: 5,
    education: 'Technical Safety Certificate',
    status: 'Interviewing',
    dateSubmitted: '2026-06-02',
    resumeFileName: 'Robert_Miller_Forklift_Operator.pdf'
  },
  {
    id: 'cand-002',
    fullName: 'Sarah Jenkins',
    email: 's.jenkins@example.com',
    phone: '+1 (555) 887-2341',
    appliedJobId: 'job-103',
    appliedJobTitle: 'HR & Payroll Administrator',
    resumeSummary: 'Certified payroll processor with extensive focus on multi-tier contract employee disbursements. Highly knowledgeable in tax withholding reports, labor law updates, and staff onboarding.',
    skills: ['Payroll Audit', 'Statutory Compliance', 'Labor Relations', 'ERP Software'],
    experienceYears: 6,
    education: 'B.Sc. in Human Resource Management',
    status: 'Shortlisted',
    dateSubmitted: '2026-05-30',
    resumeFileName: 'Sarah_Jenkins_HR_Resume.pdf'
  },
  {
    id: 'cand-003',
    fullName: 'Arjun Mehta',
    email: 'amehta@example.com',
    phone: '+1 (555) 761-0940',
    appliedJobId: 'general',
    appliedJobTitle: 'General Pool (Technical Staff)',
    resumeSummary: 'General mechanical troubleshooter and electrical hand. Experienced in plant system audits, industrial painting, and conveyor system support. Proactively looking for temporary or contract roles.',
    skills: ['Industrial Maintenance', 'Pneumatics', 'Welding Support', 'Basic Electrical'],
    experienceYears: 4,
    education: 'High School Diploma & Vocational Welding Training',
    status: 'Under Review',
    dateSubmitted: '2026-06-03',
    resumeFileName: 'Arjun_Mehta_General_Technical.pdf'
  },
  {
    id: 'cand-004',
    fullName: 'Clara Ross',
    email: 'clara.ross@example.com',
    phone: '+1 (555) 438-1293',
    appliedJobId: 'job-104',
    appliedJobTitle: 'Corporate Security Supervisor',
    resumeSummary: 'Ex-military officer serving 8 years in commercial security teams. Armed guard credentials, certified first-responder supervisor, expert in multi-checkpoint CCTV integrations.',
    skills: ['Security Management', 'CCTV Monitoring', 'Crisis Management', 'Access Control'],
    experienceYears: 10,
    education: 'Advanced Diploma in Security & Risk Management',
    status: 'Pending',
    dateSubmitted: '2026-06-03',
    resumeFileName: 'Clara_Ross_Security_Resume.pdf'
  },
  {
    id: 'cand-005',
    fullName: 'Marcus Vane',
    email: 'mvane@example.com',
    phone: '+1 (555) 238-7654',
    appliedJobId: 'general',
    appliedJobTitle: 'General Pool (Corporate / Admin)',
    resumeSummary: 'Meticulous inventory desk operator and data clerk. Excel automation expert. Reliable customer services lead, wishing to step into dispatch administration or corporate HR support.',
    skills: ['Excel Automation', 'Data Administration', 'Invoicing Support', 'Record Management'],
    experienceYears: 2,
    education: 'Associate Degree in Business Administration',
    status: 'Pending',
    dateSubmitted: '2026-06-04',
    resumeFileName: 'Marcus_Vane_Admin_General.pdf'
  }
];

export const techStackBlueprint = {
  frontend: [
    { name: 'React 18/19 & TypeScript', description: 'Core framework powering reactive components, strict types mapping schemas, and clean state handling.' },
    { name: 'Tailwind CSS v4', description: 'Advanced UI styling providing responsive grid controls, fast rendering performance, and high visual polish.' },
    { name: 'Lucide React', description: 'Clean, professional vector icon markers reflecting corporate HR and facility symbols.' },
    { name: 'Motion', description: 'Subtle high-fidelity animations and visual transition fades to guide focus throughout dashboard sections.' }
  ],
  backend: [
    { name: 'Node.js & Express API', description: 'Scalable service logic hosting endpoints for vacancies, resumes upload streams, and search utilities.' },
    { name: 'Statutory compliance validation middleware', description: 'Automated validators for candidate phone structures, email checks, and required certification uploads.' },
    { name: 'Token-based Route Guards', description: 'Secure controls protecting Candidate view APIs and vacancy update actions from unauthorized access.' }
  ],
  database: [
    { name: 'Cloud SQL for PostgreSQL', description: 'Highly secure, relational transactional database for structured schemas with strong foreign key joins between vacancies & candidate files.' },
    { name: 'Cloud Storage Bucket', description: 'S3-compatible persistent storage storing PDF/Word resume files, references generated links containing unique IDs.' },
    { name: 'Active Indexing engine', description: 'Optimized full-text indexes across `skills` and `resumeSummary` text fields to support real-time recruiting searches.' }
  ],
  security: [
    { name: 'Data Encryption', description: 'AES-256 encryption at rest for core Candidate Details and SSL/TLS 1.3 encryption in transit of documents.' },
    { name: 'Role-Based Access (RBAC)', description: 'Granular permissions restricting client vacancies view vs Candidate information accesses to certified users.' }
  ]
};
