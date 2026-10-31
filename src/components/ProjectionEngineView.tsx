import React from 'react';
import { Sliders, TrendingUp, Calendar, Zap, Shield, RotateCcw } from 'lucide-react';
import { ProjectionAssumptions } from '../types/financial';

interface ProjectionEngineViewProps {
  assumptions: ProjectionAssumptions;
  onUpdateAssumptions: (updated: ProjectionAssumptions) => void;
  onApplyAndRecalculate: () => void;
  onResetDefaults: () => void;
}

export const ProjectionEngineView: React.FC<ProjectionEngineViewProps> = ({
  assumptions,
  onUpdateAssumptions,
  onApplyAndRecalculate,
  onResetDefaults,
}) => {
  const handleChange = (field: keyof ProjectionAssumptions, val: number) => {
    onUpdateAssumptions({
      ...assumptions,
      [field]: val,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-slate-900 border border-slate-800 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              15-Year Financial Projection & Assumptions Engine
            </h2>
            <span className="text-[11px] font-semibold text-amber-300 bg-amber-950/60 border border-amber-800/50 px-2 py-0.5 rounded-md">
              Section 76.8
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Standard baseline: Previous 3 Historical Years + Next 15 Projected Years. Dynamically models revenue escalation, cost structures, and working capital cycles across all five financial statements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onResetDefaults}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Baseline
          </button>
          <button
            onClick={onApplyAndRecalculate}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5" />
            Run Projection Engine
          </button>
        </div>
      </div>

      {/* Assumptions Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card 1: Time Horizon */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-slate-200 text-xs font-bold border-b border-slate-800 pb-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            Projection Horizon Configuration
          </div>
          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium flex justify-between">
                <span>Select Projected Years Horizon (1 to 20 Years)</span>
                <span className="font-mono text-emerald-400 font-bold">{assumptions.projectedYearsCount} Years</span>
              </label>
              <input
                type="range"
                min={1}
                max={20}
                value={assumptions.projectedYearsCount}
                onChange={(e) => handleChange('projectedYearsCount', Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>1 Year</span>
                <span>5 Years</span>
                <span>10 Years</span>
                <span>15 Years</span>
                <span>20 Years</span>
              </div>
            </div>

            {/* Quick buttons */}
            <div className="flex flex-wrap gap-1 pt-1">
              {[1, 3, 5, 7, 10, 12, 15, 20].map(yr => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => handleChange('projectedYearsCount', yr)}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                    assumptions.projectedYearsCount === yr
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {yr}Y
                </button>
              ))}
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium flex justify-between">
                <span>Historical Years Stored</span>
                <span className="font-mono text-slate-200">{assumptions.historicalYearsCount} Years</span>
              </label>
              <input
                type="number"
                disabled
                value={assumptions.historicalYearsCount}
                className="w-full bg-slate-800/60 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-400 font-mono"
              />
              <span className="text-[10px] text-slate-500">Default: Previous 3 Years (2023–2025)</span>
            </div>
          </div>
        </div>

        {/* Card 2: Revenue & Margin Projections */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-slate-200 text-xs font-bold border-b border-slate-800 pb-2">
            <TrendingUp className="w-4 h-4 text-sky-400" />
            Revenue & Profit Margins
          </div>
          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium flex justify-between">
                <span>Annual Revenue Growth Rate</span>
                <span className="font-mono text-sky-400 font-bold">{assumptions.revenueGrowthRate}%</span>
              </label>
              <input
                type="number"
                step="0.1"
                value={assumptions.revenueGrowthRate}
                onChange={(e) => handleChange('revenueGrowthRate', Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono tabular-nums"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium flex justify-between">
                <span>Target Gross Profit Margin (%)</span>
                <span className="font-mono text-slate-200">{assumptions.grossMarginPct}%</span>
              </label>
              <input
                type="number"
                step="0.1"
                value={assumptions.grossMarginPct}
                onChange={(e) => handleChange('grossMarginPct', Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono tabular-nums"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium flex justify-between">
                <span>Operating Expenses (% of Revenue)</span>
                <span className="font-mono text-slate-200">{assumptions.opexPctOfRevenue}%</span>
              </label>
              <input
                type="number"
                step="0.1"
                value={assumptions.opexPctOfRevenue}
                onChange={(e) => handleChange('opexPctOfRevenue', Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono tabular-nums"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Working Capital & Capex Cycles */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-slate-200 text-xs font-bold border-b border-slate-800 pb-2">
            <Shield className="w-4 h-4 text-teal-400" />
            Working Capital & Capex Metrics
          </div>
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">DSO (Receivables)</label>
                <input
                  type="number"
                  value={assumptions.receivableDays}
                  onChange={(e) => handleChange('receivableDays', Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-white font-mono tabular-nums text-center"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">DIO (Inventory)</label>
                <input
                  type="number"
                  value={assumptions.inventoryDays}
                  onChange={(e) => handleChange('inventoryDays', Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-white font-mono tabular-nums text-center"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">DPO (Payables)</label>
                <input
                  type="number"
                  value={assumptions.payableDays}
                  onChange={(e) => handleChange('payableDays', Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-white font-mono tabular-nums text-center"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium flex justify-between">
                <span>Capex Additions (% of Revenue)</span>
                <span className="font-mono text-slate-200">{assumptions.capexPctOfRevenue}%</span>
              </label>
              <input
                type="number"
                step="0.1"
                value={assumptions.capexPctOfRevenue}
                onChange={(e) => handleChange('capexPctOfRevenue', Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono tabular-nums"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium flex justify-between">
                <span>Dividend Payout Ratio (%)</span>
                <span className="font-mono text-slate-200">{assumptions.dividendPayoutRatio}%</span>
              </label>
              <input
                type="number"
                value={assumptions.dividendPayoutRatio}
                onChange={(e) => handleChange('dividendPayoutRatio', Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono tabular-nums"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
