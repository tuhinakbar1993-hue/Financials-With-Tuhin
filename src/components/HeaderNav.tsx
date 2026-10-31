import React from 'react';
import { Download, FileSpreadsheet, FileText, UserCheck, Settings, Database, Sliders, Scale, Layers } from 'lucide-react';
import { CompanyProfile } from '../types/financial';

interface HeaderNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  companyProfile: CompanyProfile;
  onOpenProfileModal: () => void;
  onOpenDeveloperModal: () => void;
  onExportPackageExcel: () => void;
  onExportPackageWord: () => void;
  onExportPackagePdf: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeTab,
  setActiveTab,
  companyProfile,
  onOpenProfileModal,
  onOpenDeveloperModal,
  onExportPackageExcel,
  onExportPackageWord,
  onExportPackagePdf,
}) => {
  const [showExportMenu, setShowExportMenu] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => setActiveTab('statements')}
              className="text-left group flex items-center gap-2.5"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
                T
              </div>
              <div>
                <span className="text-base font-bold tracking-tight text-white whitespace-nowrap block group-hover:text-emerald-400 transition-colors">
                  Financials with Tuhin
                </span>
                <span className="text-[11px] text-slate-400 tracking-normal block -mt-0.5 truncate max-w-[200px]">
                  {companyProfile.companyName}
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Concise single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button
              onClick={() => setActiveTab('statements')}
              className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 py-1 ${
                activeTab === 'statements'
                  ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4 text-emerald-400" />
              Statements & Reports
            </button>
            <button
              onClick={() => setActiveTab('data-entry')}
              className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 py-1 ${
                activeTab === 'data-entry'
                  ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Database className="w-4 h-4 text-sky-400" />
              Financial Data Entry
            </button>
            <button
              onClick={() => setActiveTab('configuration')}
              className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 py-1 ${
                activeTab === 'configuration'
                  ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4 text-indigo-400" />
              Cash Flow Configuration
            </button>
            <button
              onClick={() => setActiveTab('projections')}
              className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 py-1 ${
                activeTab === 'projections'
                  ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Sliders className="w-4 h-4 text-amber-400" />
              Projections Engine
            </button>
            <button
              onClick={() => setActiveTab('reconciliation')}
              className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 py-1 ${
                activeTab === 'reconciliation'
                  ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Scale className="w-4 h-4 text-teal-400" />
              Cash Flow Audit Matrix
            </button>
          </nav>

          {/* Zone 3: Primary Action & Developer Identity */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenProfileModal}
              title="Configure Company Entity & Accounting Framework"
              className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors whitespace-nowrap hidden sm:inline-flex items-center gap-1.5"
            >
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              Entity Setup
            </button>

            {/* Combined Package Export Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="px-3.5 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                Export Package
              </button>

              {showExportMenu && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 text-xs"
                  onMouseLeave={() => setShowExportMenu(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-800 mb-1">
                    <p className="font-semibold text-slate-200">Complete Financial Package</p>
                    <p className="text-[11px] text-slate-400">All 5 Statements + Fixed Assets + Notes</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowExportMenu(false);
                      onExportPackageExcel();
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-800 rounded-lg text-slate-200 flex items-center gap-2.5 transition-colors"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="font-medium">Excel Workbook (.xlsx)</div>
                      <div className="text-[10px] text-slate-400">6 separate worksheets included</div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setShowExportMenu(false);
                      onExportPackageWord();
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-800 rounded-lg text-slate-200 flex items-center gap-2.5 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-blue-400" />
                    <div>
                      <div className="font-medium">Word Document (.docx)</div>
                      <div className="text-[10px] text-slate-400">Formatted executive statutory report</div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setShowExportMenu(false);
                      onExportPackagePdf();
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-800 rounded-lg text-slate-200 flex items-center gap-2.5 transition-colors"
                  >
                    <Download className="w-4 h-4 text-rose-400" />
                    <div>
                      <div className="font-medium">PDF Document (.pdf)</div>
                      <div className="text-[10px] text-slate-400">Print-ready multi-page report with cover</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Developer Avatar & Signature */}
            <button
              onClick={onOpenDeveloperModal}
              title="Developer Profile: Mohammad Towhidul Akbar Tuhin"
              className="flex items-center gap-2 pl-2 hover:opacity-90 transition-opacity"
            >
              <img
                src="/assets/aistudio/Tuhin_Pic_6c5894de.jpeg"
                alt="Mohammad Towhidul Akbar Tuhin"
                className="w-8 h-8 rounded-full object-cover border border-emerald-500/50 shadow-sm"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/public/assets/aistudio/Tuhin_Pic_6c5894de.jpeg';
                }}
              />
              <div className="hidden xl:block text-left text-xs">
                <span className="font-medium text-slate-200 block leading-tight truncate max-w-[170px]">
                  Mohammad T. Akbar Tuhin
                </span>
                <span className="text-[10px] text-emerald-400 block leading-tight truncate max-w-[170px]">
                  Officer, Sammilito Islami Bank
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
