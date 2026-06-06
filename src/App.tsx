import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import ServicesSection from './components/ServicesSection';
import VacanciesSection from './components/VacanciesSection';
import GeneralApplicationSection from './components/GeneralApplicationSection';
import AdminPortal from './components/AdminPortal';
import SchemaAndTechStack from './components/SchemaAndTechStack';

import { JobVacancy, CandidateProfile, ServiceDetail, ClientRequisition, AllocationCategory } from './types';
import { initialVacancies, initialCandidates, initialServices } from './data/initialData';

const defaultAllocationCategories: AllocationCategory[] = [
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

import { 
  Building2, 
  MapPin, 
  Mail, 
  Phone, 
  ShieldAlert, 
  Handshake, 
  Sparkles, 
  CheckCircle2,
  Home 
} from 'lucide-react';

export default function App() {
  // Navigation states
  const [currentTab, setCurrentTab] = useState<string>('services');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Core database states
  const [vacancies, setVacancies] = useState<JobVacancy[]>([]);
  const [candidates, setCandidates] = useState<CandidateProfile[]>([]);
  const [services, setServices] = useState<ServiceDetail[]>([]);
  const [requisitions, setRequisitions] = useState<ClientRequisition[]>([]);
  const [allocationCategories, setAllocationCategories] = useState<AllocationCategory[]>([]);

  // Load from LocalStorage or static seeds
  useEffect(() => {
    const storedVacancies = localStorage.getItem('express_vacancies');
    const storedCandidates = localStorage.getItem('express_candidates');
    const storedServices = localStorage.getItem('express_services');
    const storedRequisitions = localStorage.getItem('express_requisitions');
    const storedAllocationCategories = localStorage.getItem('express_allocation_categories');

    if (storedAllocationCategories) {
      setAllocationCategories(JSON.parse(storedAllocationCategories));
    } else {
      setAllocationCategories(defaultAllocationCategories);
      localStorage.setItem('express_allocation_categories', JSON.stringify(defaultAllocationCategories));
    }

    if (storedVacancies) {
      try {
        const parsed = JSON.parse(storedVacancies) as JobVacancy[];
        const migrated = parsed.map(v => {
          if (v.salaryRange && v.salaryRange.includes('$')) {
            let sal = v.salaryRange.replace(/\$/g, '₹');
            if (sal.includes('22.00') && sal.includes('26.00')) {
              sal = '₹250 - ₹350 / hour';
            } else if (sal.includes('60,000') && sal.includes('72,000')) {
              sal = '₹6,00,000 - ₹7,20,000 / year';
            } else if (sal.includes('55,000') && sal.includes('65,000')) {
              sal = '₹5,50,000 - ₹6,50,000 / year';
            } else if (sal.includes('48,000') && sal.includes('54,000')) {
              sal = '₹4,80,000 - ₹5,40,000 / year';
            } else if (sal.includes('18.50') && sal.includes('20.00')) {
              sal = '₹180 - ₹220 / hour';
            }
            return { ...v, salaryRange: sal };
          }
          return v;
        });
        setVacancies(migrated);
        localStorage.setItem('express_vacancies', JSON.stringify(migrated));
      } catch (err) {
        setVacancies(initialVacancies);
        localStorage.setItem('express_vacancies', JSON.stringify(initialVacancies));
      }
    } else {
      setVacancies(initialVacancies);
      localStorage.setItem('express_vacancies', JSON.stringify(initialVacancies));
    }

    if (storedCandidates) {
      setCandidates(JSON.parse(storedCandidates));
    } else {
      setCandidates(initialCandidates);
      localStorage.setItem('express_candidates', JSON.stringify(initialCandidates));
    }

    if (storedServices) {
      setServices(JSON.parse(storedServices));
    } else {
      setServices(initialServices);
      localStorage.setItem('express_services', JSON.stringify(initialServices));
    }

    if (storedRequisitions) {
      setRequisitions(JSON.parse(storedRequisitions));
    } else {
      const initialRequisitions: ClientRequisition[] = [
        {
          id: 'req-101',
          companyName: 'Northern Logistics & Port Authority',
          contactName: 'Sarah Jenkins',
          email: 'sjenkins@northernlogistics.com',
          phone: '+1 (555) 765-4321',
          location: 'East River Terminal, Block C',
          notes: 'Urgent demand for peak summer cargo flow handling. Immediate induction required.',
          requestedPositions: [
            { role: 'Forklift Operator', count: 10 },
            { role: 'Helpers', count: 12 },
            { role: 'Mechanic', count: 2 }
          ],
          status: 'Sourcing Personnel',
          dateSubmitted: '2026-06-03'
        },
        {
          id: 'req-102',
          companyName: 'Apex Precision Machine Works',
          contactName: 'David Vance',
          email: 'd.vance@apexmachining.com',
          phone: '+1 (555) 890-1234',
          location: 'Heavy Industrial Park, Sector 4',
          notes: 'Standard expansion of shift C machinery lines.',
          requestedPositions: [
            { role: 'Machinist', count: 6 },
            { role: 'Mechanic', count: 5 }
          ],
          status: 'Pending Review',
          dateSubmitted: '2026-06-05'
        }
      ];
      setRequisitions(initialRequisitions);
      localStorage.setItem('express_requisitions', JSON.stringify(initialRequisitions));
    }
  }, []);

  // Save changes to LocalStorage helpers
  const handleUpdateVacancies = (updated: JobVacancy[]) => {
    setVacancies(updated);
    localStorage.setItem('express_vacancies', JSON.stringify(updated));
  };

  const handleUpdateCandidates = (updated: CandidateProfile[]) => {
    setCandidates(updated);
    localStorage.setItem('express_candidates', JSON.stringify(updated));
  };

  const handleUpdateServices = (updated: ServiceDetail[]) => {
    setServices(updated);
    localStorage.setItem('express_services', JSON.stringify(updated));
  };

  const handleUpdateRequisitions = (updated: ClientRequisition[]) => {
    setRequisitions(updated);
    localStorage.setItem('express_requisitions', JSON.stringify(updated));
  };

  const handleUpdateAllocationCategories = (updated: AllocationCategory[]) => {
    setAllocationCategories(updated);
    localStorage.setItem('express_allocation_categories', JSON.stringify(updated));
  };

  const handleAddRequisition = (newReq: Omit<ClientRequisition, 'id' | 'dateSubmitted' | 'status'>) => {
    const randId = `req-${Math.floor(100 + Math.random() * 900)}`;
    const fullReq: ClientRequisition = {
      ...newReq,
      id: randId,
      status: 'Pending Review',
      dateSubmitted: new Date().toISOString().split('T')[0]
    };
    const nextList = [fullReq, ...requisitions];
    handleUpdateRequisitions(nextList);
  };

  // Add application submitted by candidates
  const handleAddApplication = (candidateInput: Omit<CandidateProfile, 'id' | 'dateSubmitted' | 'status'>) => {
    const randId = `cand-${Math.floor(100 + Math.random() * 900)}`;
    const newCandidate: CandidateProfile = {
      ...candidateInput,
      id: randId,
      status: 'Pending',
      dateSubmitted: new Date().toISOString().split('T')[0]
    };

    const nextCandidates = [newCandidate, ...candidates];
    handleUpdateCandidates(nextCandidates);

    // Update job vacancy matching ID applicantsCount counter as well
    if (candidateInput.appliedJobId !== 'general') {
      const nextVacancies = vacancies.map(v => {
        if (v.id === candidateInput.appliedJobId) {
          return { ...v, applicantsCount: v.applicantsCount + 1 };
        }
        return v;
      });
      handleUpdateVacancies(nextVacancies);
    }
  };

  // Switch tabs helpers
  const handleBrowseJobsCategory = (selectedCategory: string) => {
    setCategoryFilter(selectedCategory);
    setCurrentTab('vacancies');
  };

  const handleGoToGeneralApply = () => {
    setCurrentTab('general-apply');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-primary-500 selection:text-white">
      
      {/* Dynamic Navigation Header */}
      <Navigation 
        currentTab={currentTab} 
        onChangeTab={(tab) => {
          setCurrentTab(tab);
          // If moving away, reset quick stream query filter to all
          if (tab !== 'vacancies') {
            setCategoryFilter('all');
          }
        }} 
        onOpenAdminSecret={() => setCurrentTab('admin')}
      />

      {/* Main Container Workspace */}
      <main className="flex-grow w-full">
        
        {currentTab === 'services' && (
          <ServicesSection 
            services={services}
            vacancies={vacancies}
            allocationCategories={allocationCategories}
            onBrowseJobs={handleBrowseJobsCategory}
            onGeneralApply={handleGoToGeneralApply}
            onAddApplication={handleAddApplication}
            onAddRequisition={handleAddRequisition}
          />
        )}

        {currentTab === 'vacancies' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <VacanciesSection 
              vacancies={vacancies}
              onAddApplication={handleAddApplication}
              selectedCategoryFilter={categoryFilter}
            />
          </div>
        )}

        {currentTab === 'general-apply' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <GeneralApplicationSection 
              onAddGeneralApplication={handleAddApplication}
            />
          </div>
        )}

        {currentTab === 'schema-stack' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <SchemaAndTechStack />
          </div>
        )}

        {currentTab === 'admin' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AdminPortal 
              vacancies={vacancies}
              candidates={candidates}
              services={services}
              requisitions={requisitions}
              allocationCategories={allocationCategories}
              onUpdateVacancies={handleUpdateVacancies}
              onUpdateCandidates={handleUpdateCandidates}
              onUpdateServices={handleUpdateServices}
              onUpdateRequisitions={handleUpdateRequisitions}
              onUpdateAllocationCategories={handleUpdateAllocationCategories}
            />
          </div>
        )}

      </main>

      {/* Corporate Professional Slogan Footer */}
      <footer id="portal-footer" className="bg-primary-950 text-white border-t border-primary-900 mt-16 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Branding Slogan Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="bg-primary-500 text-white p-1.5 rounded-lg">
                  <Building2 className="h-5 w-5" />
                </div>
                <span className="font-extrabold text-lg uppercase tracking-tight">
                  EXPRESS <span className="text-primary-400">EMPLOYMENT</span>
                </span>
              </div>
              <p className="text-xs text-primary-200 leading-relaxed font-light">
                Premium recruitment solutions, manpower staffing, and legal compliance audits.
                Creating opportunities for commercial growth across heavy logistics, industry, and corporate facilities.
              </p>
              <div className="flex items-center space-x-1 pl-0.5 text-xs text-primary-400 font-bold">
                <Sparkles className="h-3.5 w-3.5" />
                <span className="uppercase tracking-wide">We Create Opportunities</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-3 pl-0 md:pl-8">
              <h4 className="text-xs font-bold text-primary-400 tracking-wider uppercase">Portal Navigation</h4>
              <ul className="space-y-1.5 text-xs text-primary-200 font-light">
                <li><button onClick={() => setCurrentTab('services')} className="hover:text-primary-300 transition text-left cursor-pointer">Services Range</button></li>
                <li><button onClick={() => handleBrowseJobsCategory('all')} className="hover:text-primary-300 transition text-left cursor-pointer">Open Vacancies</button></li>
                <li><button onClick={handleGoToGeneralApply} className="hover:text-primary-300 transition text-left cursor-pointer">General CV Intake</button></li>
                <li><button onClick={() => setCurrentTab('schema-stack')} className="hover:text-primary-300 transition text-left cursor-pointer">Architecture & Schema</button></li>
              </ul>
            </div>

            {/* Service Streams */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-primary-400 tracking-wider uppercase">Staffing Streams</h4>
              <ul className="space-y-1.5 text-xs text-primary-200 font-light">
                <li><button onClick={() => handleBrowseJobsCategory('staffing')} className="hover:text-primary-300 transition text-left cursor-pointer">Staffing & Payroll Solutions</button></li>
                <li><button onClick={() => handleBrowseJobsCategory('technical')} className="hover:text-primary-300 transition text-left cursor-pointer">Technical Personnel Placements</button></li>
                <li><button onClick={() => handleBrowseJobsCategory('facility')} className="hover:text-primary-300 transition text-left cursor-pointer">Facility Management Security</button></li>
                <li><button onClick={() => handleBrowseJobsCategory('corporate')} className="hover:text-primary-300 transition text-left cursor-pointer">Statutory Payroll Advisory</button></li>
              </ul>
            </div>

            {/* Official Contact Coordinates */}
            <div className="space-y-3 text-xs text-primary-200 font-light">
              <h4 className="text-xs font-bold text-primary-400 tracking-wider uppercase text-sans">Contact Us</h4>
              <div className="space-y-2">
                <p className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-primary-500 shrink-0" />
                  <span>+91-8939234120</span>
                </p>
                <p className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-primary-500 shrink-0" />
                  <span>expressemployment@outlook.in</span>
                </p>
                <p className="flex items-start leading-relaxed">
                  <Home className="h-4 w-4 mr-2 text-primary-500 shrink-0 mt-0.5" />
                  <span>NO. 114, CHITTI BABU STREET, OZHALUR, CHENGALPATTU, TAMIL NADU, PINCODE - 603111</span>
                </p>
              </div>
            </div>

          </div>

          {/* Subfooter licensing */}
          <div className="pt-6 border-t border-primary-900/60 flex flex-col sm:flex-row justify-between items-center text-[10px] text-primary-400 font-mono gap-4">
            <p>&copy; 2026 EXPRESS EMPLOYMENT Co. All statutory liabilities secured.</p>
            <div className="flex space-x-4">
              <span>GDPR & E-Verify Audits Certified</span>
              <span>•</span>
              <span>ISO 9001:2015 Registered Agency</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
