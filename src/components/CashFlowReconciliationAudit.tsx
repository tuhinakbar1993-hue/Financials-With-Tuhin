import React from 'react';
import { Scale, CheckCircle2, AlertTriangle, Info, ArrowRight } from 'lucide-react';
import { CashFlowStatementYear, BalanceSheetYear, CompanyProfile } from '../types/financial';

interface CashFlowReconciliationAuditProps {
  cashFlowYears: CashFlowStatementYear[];
  balanceSheetYears: BalanceSheetYear[];
  companyProfile: CompanyProfile;
}

export const CashFlowReconciliationAudit: React.FC<CashFlowReconciliationAuditProps> = ({
  cashFlowYears,
  balanceSheetYears,
  companyProfile,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-teal-400" />
          <h2 className="text-lg font-bold text-white tracking-tight">
            Statement of Cash Flows & Balance Sheet Reconciliation Audit Matrix
          </h2>
          <span className="text-[11px] font-semibold text-teal-300 bg-teal-950/60 border border-teal-800/50 px-2 py-0.5 rounded-md">
            Section 76.3 & 76.4
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Rigorous reconciliation between the Statement of Cash Flows closing cash and the Statement of Financial Position stated cash. The engine strictly avoids inventing unsupported transactions to force a balance.
        </p>
      </div>

      {/* Accounting Methodology Callout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <div className="text-slate-200 font-semibold flex items-center gap-1.5">
            <Info className="w-4 h-4 text-sky-400" />
            1. Operating Cash Flow
          </div>
          <p className="text-slate-400 leading-relaxed">
            Derived via the <strong>Indirect Method</strong> from Net Profit Before Tax, adjusting for non-cash depreciation, finance cost, and working capital shifts (Inventory, Receivables, Payables).
          </p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <div className="text-slate-200 font-semibold flex items-center gap-1.5">
            <Info className="w-4 h-4 text-indigo-400" />
            2. Investing Cash Flow
          </div>
          <p className="text-slate-400 leading-relaxed">
            Linked to the <strong>Schedule of Fixed Assets</strong> capital expenditure additions, disposals, and financial investment movements.
          </p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <div className="text-slate-200 font-semibold flex items-center gap-1.5">
            <Info className="w-4 h-4 text-amber-400" />
            3. Financing Cash Flow
          </div>
          <p className="text-slate-400 leading-relaxed">
            Preserved as a <strong>mandatory direct user entry</strong> separately for every historical and projected financial year. Never auto-derived or assumed.
          </p>
        </div>
      </div>

      {/* Reconciliation Audit Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 bg-slate-800/40 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Multi-Year Cash Flow Audit Reconciliation Schedule ({companyProfile.reportingCurrency} in {companyProfile.reportingUnit})
          </h3>
          <span className="text-[11px] text-slate-400">
            {cashFlowYears.length} Financial Years Audited
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-800/80 text-slate-300 border-b border-slate-700 text-[11px]">
              <tr>
                <th className="py-3 px-4 font-sans">Audit Parameter</th>
                {cashFlowYears.map(cf => (
                  <th key={cf.year} className="py-3 px-3 text-right">
                    {cf.year} {cf.isProjected ? '(P)' : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 tabular-nums">
              <tr className="bg-slate-900/50">
                <td className="py-2.5 px-4 font-sans text-slate-200 font-medium">A. Operating Cash Flow (Calculated)</td>
                {cashFlowYears.map(cf => (
                  <td key={cf.year} className={`py-2.5 px-3 text-right ${cf.netCashFromOperating >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {cf.netCashFromOperating.toLocaleString()}
                  </td>
                ))}
              </tr>
              <tr className="bg-slate-900/50">
                <td className="py-2.5 px-4 font-sans text-slate-200 font-medium">B. Investing Cash Flow (Calculated)</td>
                {cashFlowYears.map(cf => (
                  <td key={cf.year} className={`py-2.5 px-3 text-right ${cf.netCashFromInvesting >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {cf.netCashFromInvesting.toLocaleString()}
                  </td>
                ))}
              </tr>
              <tr className="bg-slate-800/40 font-semibold">
                <td className="py-2.5 px-4 font-sans text-amber-300 flex items-center gap-1.5">
                  <span>C. Financing Cash Flow (Direct User Entry)</span>
                  <span className="text-[9px] font-sans bg-amber-950 text-amber-400 border border-amber-800 px-1.5 py-0.2 rounded">Mandatory</span>
                </td>
                {cashFlowYears.map(cf => (
                  <td key={cf.year} className="py-2.5 px-3 text-right text-amber-300">
                    {cf.directlyEnteredFinancingCashFlow.toLocaleString()}
                  </td>
                ))}
              </tr>
              <tr className="border-t border-slate-700 font-semibold bg-slate-800/60">
                <td className="py-2.5 px-4 font-sans text-white">Net Change in Cash (A + B + C)</td>
                {cashFlowYears.map(cf => (
                  <td key={cf.year} className={`py-2.5 px-3 text-right ${cf.netChangeInCash >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                    {cf.netChangeInCash.toLocaleString()}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-sans text-slate-400">Opening Cash & Cash Equivalents</td>
                {cashFlowYears.map(cf => (
                  <td key={cf.year} className="py-2.5 px-3 text-right text-slate-300">
                    {cf.openingCash.toLocaleString()}
                  </td>
                ))}
              </tr>
              <tr className="font-bold text-white bg-slate-800/50">
                <td className="py-2.5 px-4 font-sans text-emerald-400">Closing Cash Derived (Opening + Net Change)</td>
                {cashFlowYears.map(cf => (
                  <td key={cf.year} className="py-2.5 px-3 text-right text-emerald-400">
                    {cf.closingCashCalculated.toLocaleString()}
                  </td>
                ))}
              </tr>
              <tr className="font-semibold text-slate-200">
                <td className="py-2.5 px-4 font-sans text-sky-400">Stated Cash in Balance Sheet</td>
                {cashFlowYears.map(cf => (
                  <td key={cf.year} className="py-2.5 px-3 text-right text-sky-400">
                    {cf.balanceSheetCash.toLocaleString()}
                  </td>
                ))}
              </tr>
              <tr className="font-bold border-t-2 border-slate-700">
                <td className="py-3 px-4 font-sans text-white flex items-center gap-1.5">
                  <span>Reconciliation Difference</span>
                  <span className="text-[10px] text-slate-400 font-normal font-sans">(Derived - Stated)</span>
                </td>
                {cashFlowYears.map(cf => {
                  const isZero = cf.reconciliationDifference === 0;
                  return (
                    <td key={cf.year} className={`py-3 px-3 text-right ${isZero ? 'text-emerald-400' : 'text-amber-400 font-bold'}`}>
                      {cf.reconciliationDifference > 0 ? `+${cf.reconciliationDifference.toLocaleString()}` : cf.reconciliationDifference.toLocaleString()}
                    </td>
                  );
                })}
              </tr>
              <tr className="bg-slate-900 font-sans">
                <td className="py-2.5 px-4 text-slate-400 text-[11px]">Audit Verdict</td>
                {cashFlowYears.map(cf => {
                  const isZero = cf.reconciliationDifference === 0;
                  return (
                    <td key={cf.year} className="py-2.5 px-3 text-right">
                      {isZero ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Reconciled
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-400">
                          <AlertTriangle className="w-3.5 h-3.5" /> Variance
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
