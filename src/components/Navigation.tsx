import React, { useState } from 'react';
import { Menu, X, Globe, Layers, Briefcase, FileText, Database, Lock } from 'lucide-react';

interface NavigationProps {
  currentTab: string;
  onChangeTab: (tab: string) => void;
  onOpenAdminSecret: () => void;
}

export default function Navigation({ currentTab, onChangeTab, onOpenAdminSecret }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Tablet photo exact navigational links
  const menuItems = [
    { id: 'services', label: 'HOME' },
    { id: 'services_our', label: 'OUR SERVICES' },
    { id: 'vacancies', label: 'VACANCIES' },
    { id: 'general-apply', label: 'GENERAL APPLY' },
    { id: 'contact', label: 'CONTACT US' },
  ];

  return (
    <header className="sticky top-0 z-50 h-20 border-b border-slate-200 relative overflow-hidden">
      {/* TWO-COLOR SLANTED FRAME BACKGROUNDS (Full bleed!) */}
      <div className="absolute inset-0 flex z-0 pointer-events-none">
        {/* Left Side: White Background - extended to fit the larger prominent branding */}
        <div className="w-[60%] sm:w-[50%] md:w-[45%] lg:w-[42%] bg-white relative h-full">
          {/* Exact diagonal sharp slanted cut dividing boundaries */}
          <div className="absolute right-[-16px] top-0 bottom-0 w-8 bg-white transform -skew-x-[15deg] z-10 border-r-2 border-slate-200"></div>
        </div>
        {/* Right Side: Deep Corporate Navy Board */}
        <div className="flex-1 bg-[#0d233a] h-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full relative z-10">
        <div className="flex justify-between items-center h-full">
          
          {/* Brand Logo & Slogan - Scaled Bigger & Polished */}
          <div className="flex items-center gap-3 sm:gap-4 cursor-pointer select-none py-2 relative z-10 pl-0 pr-[10px] ml-0" onClick={() => onChangeTab('services')}>
            <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-[4.5rem] md:h-[4.5rem] flex items-center justify-center shrink-0 transition-transform hover:scale-105 duration-300">
              <svg viewBox="0 0 100 100" className="w-full h-full select-none pl-0 ml-[-100px]" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Left Shape (Navy Blue) */}
                <path
                  d="M 45 28 C 45 12, 19 12, 19 28 L 10 58 L 31 95 L 50 61 L 21 68 Z"
                  fill="#0d233a"
                />
                {/* Right Shape (Teal Blue) */}
                <path
                  d="M 45 28 C 45 12, 19 12, 19 28 L 10 58 L 31 95 L 50 61 L 21 68 Z"
                  fill="#2362a2"
                  transform="rotate(180 50 50)"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl md:text-3xl font-black tracking-tighter text-slate-900 leading-none uppercase animate-fade-in pl-0 ml-[-50px]">
                EXPRESS <span className="text-[#2362a2]">EMPLOYMENT</span>
              </span>
              <span className="text-[8px] sm:text-[10px] font-sans font-extrabold uppercase tracking-widest text-[#2362a2] mt-1 sm:mt-1.5 leading-none">
                We Create Opportunities
              </span>
            </div>
          </div>

          {/* Desktop Right slanted banner holding exact labels as per tablet image */}
          <div className="hidden lg:flex items-center h-full relative pl-8">
            <nav className="flex items-center space-x-2 h-full text-white px-8 py-2 z-10">
              {menuItems.map((item, idx) => {
                const isItemActive = currentTab === item.id || (item.id === 'services_our' && currentTab === 'services');
                return (
                  <React.Fragment key={item.id}>
                    {idx > 0 && <span className="text-slate-500 select-none text-[10px]">|</span>}
                    <button
                      onClick={() => {
                        if (item.id === 'services_our') {
                          onChangeTab('services');
                          setTimeout(() => {
                            const el = document.getElementById('manpower-solutions-head');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }, 100);
                        } else if (item.id === 'contact') {
                          const el = document.getElementById('portal-footer');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        } else {
                          onChangeTab(item.id);
                        }
                      }}
                      className={`text-[11px] font-black tracking-widest uppercase transition-colors px-1 py-1 cursor-pointer hover:text-[#45a3f8] ${
                        isItemActive ? 'text-[#45a3f8]' : 'text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  </React.Fragment>
                );
              })}
              
              <span className="text-slate-600 select-none text-[10px]">•</span>
              
              {/* Secondary administration tabs for AI Studio system configuration and schema checks */}
              <button 
                onClick={() => onChangeTab('schema-stack')}
                className={`text-[9px] font-extrabold tracking-wider uppercase border border-slate-700 px-2 py-1 transition-all hover:bg-slate-800 ${
                  currentTab === 'schema-stack' ? 'bg-slate-800 border-indigo-400 text-indigo-200' : 'text-slate-300'
                }`}
              >
                SCHEMA
              </button>
              <button 
                onClick={onOpenAdminSecret}
                className={`text-[9px] font-extrabold tracking-wider uppercase border border-red-950 px-2 py-1 transition-all bg-red-950/30 hover:bg-red-900/40 ${
                  currentTab === 'admin' ? 'bg-red-900/60 border-red-700 text-red-200 animate-pulse' : 'text-red-400'
                }`}
              >
                ADMIN
              </button>
            </nav>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center relative z-20">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 text-white hover:text-[#45a3f8] hover:bg-slate-800/50 focus:outline-none border border-slate-700"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-5 w-5" /> : <Menu className="block h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-[#0d233a] border-b border-slate-800 text-white shadow-xl">
          <div className="px-2 pt-2 pb-4 space-y-1">
            {menuItems.map((item) => {
              const isItemActive = currentTab === item.id || (item.id === 'services_our' && currentTab === 'services');
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setIsOpen(false);
                    if (item.id === 'services_our') {
                      onChangeTab('services');
                      setTimeout(() => {
                        const el = document.getElementById('manpower-solutions-head');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    } else if (item.id === 'contact') {
                      const el = document.getElementById('portal-footer');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      onChangeTab(item.id);
                    }
                  }}
                  className={`flex items-center space-x-3 w-full px-4 py-3 text-xs font-black uppercase tracking-wider transition-all ${
                    isItemActive
                      ? 'bg-[#1b4e85] text-white border-l-4 border-l-[#45a3f8]'
                      : 'text-slate-200 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
            
            <div className="border-t border-slate-800 pt-2 px-4 flex gap-4">
              <button 
                onClick={() => {
                  setIsOpen(false);
                  onChangeTab('schema-stack');
                }}
                className="text-[9px] font-black uppercase tracking-wider text-slate-300 hover:text-white"
              >
                System Schema
              </button>
              <button 
                onClick={() => {
                  setIsOpen(false);
                  onOpenAdminSecret();
                }}
                className="text-[9px] font-black uppercase tracking-wider text-red-400 hover:text-red-300"
              >
                Admin Center
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
