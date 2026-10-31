import React from 'react';
import { X, Mail, Award, CheckCircle, ShieldCheck, Cpu, Code2, GraduationCap, Building } from 'lucide-react';

interface DeveloperProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeveloperProfileModal: React.FC<DeveloperProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Developer & Financial Architect Profile
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Profile Card */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 rounded-xl bg-slate-800/50 border border-slate-700/60">
            <div className="relative shrink-0">
              <img
                src="/assets/aistudio/Tuhin_Pic_6c5894de.jpeg"
                alt="Mohammad Towhidul Akbar Tuhin"
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl object-cover border-2 border-emerald-500 shadow-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/public/assets/aistudio/Tuhin_Pic_6c5894de.jpeg';
                }}
              />
              <span className="absolute -bottom-2 -right-2 bg-emerald-600 text-[10px] font-semibold text-white px-2 py-0.5 rounded-md border border-slate-900 shadow">
                Architect
              </span>
            </div>

            <div className="text-center sm:text-left space-y-2 flex-1">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Mohammad Towhidul Akbar Tuhin
                </h3>
                <p className="text-xs font-semibold text-emerald-400 flex items-center justify-center sm:justify-start gap-1.5 mt-0.5">
                  <Building className="w-3.5 h-3.5 shrink-0" />
                  Officer, Sammilito Islami Bank PLC
                </p>
                <p className="text-[11px] text-slate-400">
                  (Transferee of Assets & Liabilities of Union Bank PLC)
                </p>
              </div>

              {/* Degrees & Qualifications */}
              <div className="pt-1 space-y-1">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-slate-200">
                  <GraduationCap className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>BBA, Heriot Watt University, UK</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-slate-200">
                  <GraduationCap className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>MBA, University of Chittagong</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <a
                  href="mailto:tuhinakbar1993@gmail.com"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 text-xs font-medium border border-emerald-500/20 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  tuhinakbar1993@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Core System Standards - Section 76 Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              System Architecture & Section 76 Engine
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-800/30 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-slate-200 text-xs font-semibold">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Five Standard Statements
                </div>
                <p className="text-[11px] text-slate-400">
                  Income Statement, Balance Sheet, Statement of Cash Flows, Statement of Changes in Equity, and Schedule of Fixed Assets.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/30 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-slate-200 text-xs font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Statement of Cash Flows (IAS 7)
                </div>
                <p className="text-[11px] text-slate-400">
                  Indirect method with Operating, Investing, and Financing activities. Direct year-wise user entry preserved.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/30 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-slate-200 text-xs font-semibold">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  Configurable Projection Horizon
                </div>
                <p className="text-[11px] text-slate-400">
                  User-controlled projection horizon (1 to 20 years) with instant dynamic recalculation across all statements.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/30 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-slate-200 text-xs font-semibold">
                  <Code2 className="w-4 h-4 text-emerald-400" />
                  Multi-Format Export Suite
                </div>
                <p className="text-[11px] text-slate-400">
                  Export individual statements or the complete financial package to multi-sheet Excel (.xlsx), executive Word (.docx), and PDF (.pdf).
                </p>
              </div>
            </div>
          </div>

          {/* Audit Verification Note */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/30 text-xs text-slate-300">
            <span className="font-semibold text-emerald-400 block mb-1">
              Zero-Fabrication Accounting Integrity
            </span>
            The system adheres strictly to Section 76 mandates: financing cash flows are directly entered by the user for every year and are never fabricated or artificially balanced. Cash flow closing balances are explicitly reconciled against the Statement of Financial Position with full variance transparency.
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end px-6 py-3 border-t border-slate-800 bg-slate-900/60">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
