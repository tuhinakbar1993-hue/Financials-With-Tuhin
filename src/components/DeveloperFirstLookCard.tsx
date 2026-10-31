import React from 'react';
import { Mail, GraduationCap, Building, Award, Calendar, ChevronRight, Sliders, Sparkles } from 'lucide-react';
import { ProjectionAssumptions, CompanyProfile } from '../types/financial';

interface DeveloperFirstLookCardProps {
  assumptions: ProjectionAssumptions;
  onUpdateAssumptions: (updated: ProjectionAssumptions) => void;
  onOpenDeveloperModal: () => void;
  companyProfile: CompanyProfile;
  baseYear: number;
}

export const DeveloperFirstLookCard: React.FC<DeveloperFirstLookCardProps> = ({
  assumptions,
  onUpdateAssumptions,
  onOpenDeveloperModal,
  companyProfile,
  baseYear,
}) => {
  const quickHorizons = [1, 3, 5, 7, 10, 12, 15, 20];

  const handleSetHorizon = (years: number) => {
    onUpdateAssumptions({
      ...assumptions,
      projectedYearsCount: years,
    });
  };

  const endProjectedYear = baseYear + assumptions.projectedYearsCount;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 shadow-xl">
      {/* Subtle architectural ambient accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative p-5 sm:p-6 lg:p-7">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          {/* Developer Identity Block (First Look Feature) */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {/* Developer Photograph with Executive Framing */}
            <div className="relative shrink-0 group cursor-pointer" onClick={onOpenDeveloperModal}>
              <div className="relative p-1 rounded-2xl bg-gradient-to-tr from-emerald-500/60 via-slate-700 to-emerald-400/80 shadow-lg shadow-emerald-950/40">
                <img
                  src="/assets/aistudio/Tuhin_Pic_6c5894de.jpeg"
                  alt="Mohammad Towhidul Akbar Tuhin"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/public/assets/aistudio/Tuhin_Pic_6c5894de.jpeg';
                  }}
                />
              </div>
              <span className="absolute -bottom-2 inset-x-0 mx-auto w-max bg-emerald-600 text-[10px] font-semibold text-white px-2 py-0.5 rounded-full shadow border border-slate-900 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                Architect
              </span>
            </div>

            {/* Developer Bio & Qualifications */}
            <div className="text-center sm:text-left space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                  Mohammad Towhidul Akbar Tuhin
                </h1>
                <span className="text-[10px] font-medium text-emerald-300 bg-emerald-950/70 border border-emerald-800/60 px-2 py-0.5 rounded-md">
                  Software Author & Lead Architect
                </span>
              </div>

              {/* Designation & Organization */}
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-slate-200 flex items-center justify-center sm:justify-start gap-1.5">
                  <Building className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Officer, Sammilito Islami Bank PLC</span>
                </p>
                <p className="text-[11px] text-slate-400">
                  (Transferee of Assets & Liabilities of Union Bank PLC)
                </p>
              </div>

              {/* Academic Degrees */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 text-xs text-slate-300 pt-0.5">
                <span className="inline-flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  BBA, Heriot Watt University, UK
                </span>
                <span className="text-slate-600 hidden sm:inline" aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  MBA, University of Chittagong
                </span>
              </div>

              {/* Contact Link */}
              <div className="pt-1 flex items-center justify-center sm:justify-start gap-3">
                <a
                  href="mailto:tuhinakbar1993@gmail.com"
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <Mail className="w-3 h-3" />
                  tuhinakbar1993@gmail.com
                </a>
                <span className="text-slate-600" aria-hidden="true">·</span>
                <button
                  onClick={onOpenDeveloperModal}
                  className="text-[11px] text-slate-400 hover:text-slate-200 underline underline-offset-2 transition-colors"
                >
                  View Full Profile & Credentials
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Projection Horizon Control (Requirement 1) */}
          <div className="w-full lg:w-auto bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3 shrink-0">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white tracking-tight">
                  Select Projection Horizon
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                {assumptions.projectedYearsCount} Years ({baseYear + 1}–{endProjectedYear})
              </span>
            </div>

            {/* Quick Horizon Buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              {quickHorizons.map(years => (
                <button
                  key={years}
                  onClick={() => handleSetHorizon(years)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                    assumptions.projectedYearsCount === years
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  {years}Y
                </button>
              ))}
            </div>

            {/* Custom Slider / Fine Tuning */}
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Custom Years:</span>
                <span className="font-mono text-slate-200">{assumptions.projectedYearsCount} Projected Years</span>
              </div>
              <input
                type="range"
                min={1}
                max={20}
                value={assumptions.projectedYearsCount}
                onChange={(e) => handleSetHorizon(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>1 Year</span>
                <span>5 Years</span>
                <span>10 Years</span>
                <span>15 Years</span>
                <span>20 Years</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
