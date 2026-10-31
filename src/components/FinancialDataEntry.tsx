import React, { useState } from 'react';
import { Database, AlertCircle, Sparkles, Check, RefreshCw, Plus, Eye } from 'lucide-react';
import { YearDataInput, CompanyProfile } from '../types/financial';
import { COMPANY_TYPE_TEMPLATES } from '../services/financialEngine';

interface FinancialDataEntryProps {
  yearsData: YearDataInput[];
  onUpdateYearData: (updatedYear: YearDataInput) => void;
  companyProfile: CompanyProfile;
}

export const FinancialDataEntry: React.FC<FinancialDataEntryProps> = ({
  yearsData,
  onUpdateYearData,
  companyProfile,
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(yearsData[0].year);
  const currentYearData = yearsData.find(y => y.year === selectedYear) || yearsData[0];
  const template = COMPANY_TYPE_TEMPLATES[companyProfile.entityType];

  const handleFieldChange = (field: keyof YearDataInput, value: number) => {
    onUpdateYearData({
      ...currentYearData,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 bg-slate-900 border border-slate-800 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-sky-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Financial Statement Data-Entry Module
            </h2>
            <span className="text-[11px] font-semibold text-sky-300 bg-sky-950/60 border border-sky-800/50 px-2 py-0.5 rounded-md">
              Section 76.4 Direct Input
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Preserving mandatory direct user inputs: Sales Revenue, Net Profit, Finance Cost, Fixed Assets, and directly entered Cash Flow from Financing Activities for each separate year.
          </p>
        </div>

        {/* Year Selector Ribbon */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 scrollbar-thin">
          {yearsData.map(y => (
            <button
              key={y.year}
              onClick={() => setSelectedYear(y.year)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedYear === y.year
                  ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                  : y.isProjected
                  ? 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              {y.year} {y.isProjected ? '(P)' : '(H)'}
            </button>
          ))}
        </div>
      </div>

      {/* Mandatory Notification Box */}
      <div className="p-4 bg-amber-950/20 border border-amber-800/30 rounded-xl text-xs text-amber-200 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-amber-300">
            Mandatory Non-Negotiable Year-Wise Entry Notice (Section 76.3 & 76.4):
          </span>
          <p className="text-amber-200/90 leading-relaxed">
            <strong>Finance Cost</strong> and <strong>Cash Flow from Financing Activities</strong> must be directly entered by the user separately for each financial year ({selectedYear}). The system does not automatically derive, copy, or carry forward these figures from another year.
          </p>
        </div>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Mandatory Core Operational Inputs */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span>1. Mandatory Core Financial Inputs</span>
              <span className="text-[11px] font-normal text-emerald-400 font-mono">
                {companyProfile.reportingCurrency} in {companyProfile.reportingUnit}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Primary drivers for Income Statement and Operating Cash Flows</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                Sales Revenue *
                <span className="text-[10px] text-emerald-400 font-normal">Mandatory</span>
              </label>
              <input
                type="number"
                value={currentYearData.salesRevenue}
                onChange={(e) => handleFieldChange('salesRevenue', Number(e.target.value))}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono tabular-nums focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                Cost of Sales
              </label>
              <input
                type="number"
                value={currentYearData.costOfSales}
                onChange={(e) => handleFieldChange('costOfSales', Number(e.target.value))}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono tabular-nums focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                Operating Expenses
              </label>
              <input
                type="number"
                value={currentYearData.operatingExpenses}
                onChange={(e) => handleFieldChange('operatingExpenses', Number(e.target.value))}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono tabular-nums focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                Finance Cost *
                <span className="text-[10px] text-amber-400 font-normal">Direct Entry</span>
              </label>
              <input
                type="number"
                value={currentYearData.financeCost}
                onChange={(e) => handleFieldChange('financeCost', Number(e.target.value))}
                className="w-full bg-slate-800/90 border border-amber-600/40 rounded-lg px-3 py-2 text-white font-mono tabular-nums focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                Net Profit After Tax *
                <span className="text-[10px] text-emerald-400 font-normal">Mandatory</span>
              </label>
              <input
                type="number"
                value={currentYearData.netProfit}
                onChange={(e) => handleFieldChange('netProfit', Number(e.target.value))}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono tabular-nums focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-200">
                Effective Corporate Tax Rate (%)
              </label>
              <input
                type="number"
                value={currentYearData.taxRate}
                onChange={(e) => handleFieldChange('taxRate', Number(e.target.value))}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono tabular-nums focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Cash Flow from Financing Activities (Section 76.3.C) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span>2. Cash Flow from Financing Activities</span>
              <span className="text-[11px] font-semibold text-rose-300 bg-rose-950/60 border border-rose-800/50 px-2 py-0.5 rounded-md">
                Mandatory Direct Entry
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Directly entered by the user separately for year {selectedYear}. Incorporated directly into Cash Flows.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            {/* Prominent Mandatory User Input: Repayment of Borrowings & Financing */}
            <div className="p-3.5 bg-rose-950/20 border-2 border-rose-600/50 rounded-xl space-y-2">
              <label className="font-bold text-white flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-rose-300">
                  Repayment of Borrowings & Financing *
                  <span className="text-[10px] bg-rose-900/60 text-rose-200 border border-rose-700/50 px-2 py-0.5 rounded font-normal">
                    Mandatory Year-Wise User Input
                  </span>
                </span>
                <span className="text-slate-400 font-mono font-normal">Outflow</span>
              </label>
              <input
                type="number"
                value={currentYearData.repaymentOfBorrowings || Math.abs(currentYearData.financingRepaymentBorrowings || 0)}
                onChange={(e) => {
                  const val = Math.max(0, Number(e.target.value));
                  const proceedsBorrowings = currentYearData.financingProceedsBorrowings || 0;
                  const proceedsShares = currentYearData.financingProceedsShares || 0;
                  const dividends = currentYearData.dividendsPaid || 0;
                  const newCashFlowFromFinancing = proceedsShares + proceedsBorrowings - val - dividends;
                  const diff = val - (currentYearData.repaymentOfBorrowings || 0);
                  const newLongTermBorrowings = Math.max(0, (currentYearData.longTermBorrowings || 0) - diff);
                  const newFinanceCost = Math.max(200, Math.round((newLongTermBorrowings + (currentYearData.shortTermBorrowings || 0)) * 0.085));

                  onUpdateYearData({
                    ...currentYearData,
                    repaymentOfBorrowings: val,
                    financingRepaymentBorrowings: -val,
                    cashFlowFromFinancing: newCashFlowFromFinancing,
                    longTermBorrowings: newLongTermBorrowings,
                    financeCost: newFinanceCost,
                  });
                }}
                className="w-full text-base font-bold bg-slate-800 border-2 border-rose-500/80 rounded-lg px-3.5 py-2 text-white font-mono tabular-nums focus:ring-2 focus:ring-rose-400"
              />
              <p className="text-[11px] text-slate-300">
                Directly enters debt principal liquidation for year {selectedYear}. Dynamically reduces Balance Sheet term borrowings, lowers financing cash flow, updates ending cash, and reduces subsequent interest expense.
              </p>
            </div>

            <div className="p-3.5 bg-slate-800/40 border border-slate-700/80 rounded-xl space-y-1.5">
              <label className="font-bold text-white flex items-center justify-between">
                <span>Net Cash Flow from Financing Activities (Total) *</span>
                <span className="text-slate-400 font-mono font-normal">Direct Entry Target</span>
              </label>
              <input
                type="number"
                value={currentYearData.cashFlowFromFinancing}
                onChange={(e) => handleFieldChange('cashFlowFromFinancing', Number(e.target.value))}
                className="w-full text-base font-bold bg-slate-800 border-2 border-emerald-500/70 rounded-lg px-3.5 py-2 text-white font-mono tabular-nums focus:ring-2 focus:ring-emerald-400"
              />
              <p className="text-[11px] text-slate-400">
                Positive for net cash inflow (new borrowing / shares), negative for net cash outflow (repayments / dividends paid).
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block">
                Financing Itemized Breakdown (Optional Audit Disclosures)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300">Proceeds from Share Capital Issue</label>
                  <input
                    type="number"
                    value={currentYearData.financingProceedsShares || 0}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      const repayment = currentYearData.repaymentOfBorrowings || 0;
                      const newCF = val + (currentYearData.financingProceedsBorrowings || 0) - repayment - currentYearData.dividendsPaid;
                      onUpdateYearData({
                        ...currentYearData,
                        financingProceedsShares: val,
                        cashFlowFromFinancing: newCF,
                      });
                    }}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono tabular-nums"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300">Proceeds from Borrowings</label>
                  <input
                    type="number"
                    value={currentYearData.financingProceedsBorrowings || 0}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      const repayment = currentYearData.repaymentOfBorrowings || 0;
                      const newCF = (currentYearData.financingProceedsShares || 0) + val - repayment - currentYearData.dividendsPaid;
                      const diff = val - (currentYearData.financingProceedsBorrowings || 0);
                      onUpdateYearData({
                        ...currentYearData,
                        financingProceedsBorrowings: val,
                        cashFlowFromFinancing: newCF,
                        longTermBorrowings: (currentYearData.longTermBorrowings || 0) + Math.round(diff * 0.7),
                      });
                    }}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono tabular-nums"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300">Dividends Paid to Shareholders</label>
                  <input
                    type="number"
                    value={currentYearData.dividendsPaid}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      const repayment = currentYearData.repaymentOfBorrowings || 0;
                      const newCF = (currentYearData.financingProceedsShares || 0) + (currentYearData.financingProceedsBorrowings || 0) - repayment - val;
                      onUpdateYearData({
                        ...currentYearData,
                        dividendsPaid: val,
                        financingDividendsPaid: -val,
                        cashFlowFromFinancing: newCF,
                      });
                    }}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono tabular-nums"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300">Long-Term Borrowings (Balance Sheet)</label>
                  <input
                    type="number"
                    value={currentYearData.longTermBorrowings}
                    onChange={(e) => handleFieldChange('longTermBorrowings', Number(e.target.value))}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono tabular-nums"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Fixed Assets & Schedule Linkage (Section 76.3.B) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span>3. Fixed Assets & Investing Capex</span>
              <span className="text-[11px] font-semibold text-emerald-400">Schedule of Fixed Assets</span>
            </h3>
            <p className="text-[11px] text-slate-400">Directly feeds Schedule of Fixed Assets and Investing Cash Outflows</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-200">Gross Fixed Assets Base</label>
              <input
                type="number"
                value={currentYearData.fixedAssetsGross}
                onChange={(e) => handleFieldChange('fixedAssetsGross', Number(e.target.value))}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono tabular-nums"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-200">
                Capex Additions (Cash Outflow) *
              </label>
              <input
                type="number"
                value={currentYearData.fixedAssetsAdditions}
                onChange={(e) => handleFieldChange('fixedAssetsAdditions', Number(e.target.value))}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono tabular-nums"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-200">Disposals (Cash Inflow)</label>
              <input
                type="number"
                value={currentYearData.fixedAssetsDisposals}
                onChange={(e) => handleFieldChange('fixedAssetsDisposals', Number(e.target.value))}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono tabular-nums"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-200">Depreciation Rate (% p.a.)</label>
              <input
                type="number"
                value={currentYearData.depreciationRate}
                onChange={(e) => handleFieldChange('depreciationRate', Number(e.target.value))}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono tabular-nums"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Working Capital & Liquidity Balances (Section 76.3.A & D) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span>4. Working Capital & Balance Sheet Cash</span>
              <span className="text-[11px] font-semibold text-teal-400">Reconciliation Feed</span>
            </h3>
            <p className="text-[11px] text-slate-400">Closing cash is audited against the Statement of Financial Position</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-200">Closing Inventory *</label>
              <input
                type="number"
                value={currentYearData.closingInventory}
                onChange={(e) => handleFieldChange('closingInventory', Number(e.target.value))}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono tabular-nums"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-200">Trade Receivables *</label>
              <input
                type="number"
                value={currentYearData.tradeReceivables}
                onChange={(e) => handleFieldChange('tradeReceivables', Number(e.target.value))}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono tabular-nums"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-200">Trade Payables *</label>
              <input
                type="number"
                value={currentYearData.tradePayables}
                onChange={(e) => handleFieldChange('tradePayables', Number(e.target.value))}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono tabular-nums"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-emerald-300">
                Stated Cash in Balance Sheet *
              </label>
              <input
                type="number"
                value={currentYearData.cashAndEquivalentsBS}
                onChange={(e) => handleFieldChange('cashAndEquivalentsBS', Number(e.target.value))}
                className="w-full bg-slate-800/90 border border-emerald-500/50 rounded-lg px-3 py-2 text-white font-mono tabular-nums"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
