import React, { useState } from 'react';
import {
  FileSpreadsheet,
  FileText,
  Download,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Filter,
  Edit3,
  Check,
  RotateCcw,
  Plus,
  Trash2,
} from 'lucide-react';
import {
  CompanyProfile,
  IncomeStatementYear,
  BalanceSheetYear,
  CashFlowStatementYear,
  EquityStatementYear,
  ScheduleOfFixedAssetsYear,
  FinancialNoteItem,
  StatementConfigItem,
  ProjectionAssumptions,
  StatementCellOverrides,
  StatementLabelOverrides,
} from '../types/financial';
import {
  exportIncomeStatementExcel,
  exportBalanceSheetExcel,
  exportCashFlowExcel,
  exportEquityStatementExcel,
  exportFixedAssetsExcel,
  exportNotesExcel,
  exportDocumentWord,
  exportDocumentPdf,
  exportCompletePackageExcel,
  exportCompletePackageWord,
  exportCompletePackagePdf,
} from '../services/exportService';

interface StatementsViewerProps {
  companyProfile: CompanyProfile;
  incomeData: IncomeStatementYear[];
  balanceData: BalanceSheetYear[];
  cashFlowData: CashFlowStatementYear[];
  equityData: EquityStatementYear[];
  fixedAssetsData: ScheduleOfFixedAssetsYear[];
  notes: FinancialNoteItem[];
  statementConfig: StatementConfigItem[];
  assumptions?: ProjectionAssumptions;
  onUpdateAssumptions?: (updated: ProjectionAssumptions) => void;
  cellOverrides?: StatementCellOverrides;
  labelOverrides?: StatementLabelOverrides;
  onUpdateStatementValue?: (statement: string, field: string, year: number, val: number) => void;
  onUpdateStatementLabel?: (statement: string, field: string, newLabel: string) => void;
  onResetOverrides?: () => void;
  onUpdateNotes?: (updatedNotes: FinancialNoteItem[]) => void;
  onUpdateFixedAssetsCategory?: (catIndex: number, field: string, val: number | string) => void;
}

export const StatementsViewer: React.FC<StatementsViewerProps> = ({
  companyProfile,
  incomeData,
  balanceData,
  cashFlowData,
  equityData,
  fixedAssetsData,
  notes,
  statementConfig,
  assumptions,
  onUpdateAssumptions,
  cellOverrides = {},
  labelOverrides = {},
  onUpdateStatementValue = () => {},
  onUpdateStatementLabel = () => {},
  onResetOverrides = () => {},
  onUpdateNotes = () => {},
  onUpdateFixedAssetsCategory = () => {},
}) => {
  const [activeStatement, setActiveStatement] = useState<string>('cashFlow');
  const [yearViewMode, setYearViewMode] = useState<'all' | 'historical' | 'projected' | 'comparative5'>('all');
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  // Filter year data based on yearViewMode
  const filterYears = <T extends { year: number; isProjected: boolean }>(items: T[]): T[] => {
    switch (yearViewMode) {
      case 'historical':
        return items.filter(i => !i.isProjected);
      case 'projected':
        return items.filter(i => i.isProjected);
      case 'comparative5':
        const hist = items.filter(i => !i.isProjected).slice(-2);
        const proj = items.filter(i => i.isProjected).slice(0, 3);
        return [...hist, ...proj];
      case 'all':
      default:
        return items;
    }
  };

  const filteredIncome = filterYears(incomeData);
  const filteredBalance = filterYears(balanceData);
  const filteredCashFlow = filterYears(cashFlowData);
  const filteredEquity = filterYears(equityData);
  const filteredFixedAssets = filterYears(fixedAssetsData);

  // Helper to get effective cell value (checks cellOverrides first, falls back to original)
  const getVal = (stmt: string, field: string, year: number, fallback: number): number => {
    const key = `${stmt}_${field}`;
    if (cellOverrides[key] && cellOverrides[key][year] !== undefined) {
      return cellOverrides[key][year];
    }
    return fallback;
  };

  // Helper to get effective label (checks labelOverrides first, falls back to default)
  const getLbl = (stmt: string, field: string, defaultLabel: string): string => {
    const key = `${stmt}_${field}`;
    if (labelOverrides[key] !== undefined) {
      return labelOverrides[key];
    }
    return defaultLabel;
  };

  // Individual Export Handlers (exports updated values & labels!)
  const handleExportExcel = () => {
    switch (activeStatement) {
      case 'income':
        exportIncomeStatementExcel(companyProfile, filteredIncome);
        break;
      case 'balanceSheet':
        exportBalanceSheetExcel(companyProfile, filteredBalance);
        break;
      case 'cashFlow':
        exportCashFlowExcel(companyProfile, filteredCashFlow);
        break;
      case 'equity':
        exportEquityStatementExcel(companyProfile, filteredEquity);
        break;
      case 'fixedAssets':
        exportFixedAssetsExcel(companyProfile, filteredFixedAssets);
        break;
      case 'notes':
        exportNotesExcel(companyProfile, notes);
        break;
      case 'complete':
        exportCompletePackageExcel(companyProfile, filteredIncome, filteredBalance, filteredCashFlow, filteredEquity, filteredFixedAssets, notes);
        break;
    }
  };

  const handleExportWord = () => {
    if (activeStatement === 'complete') {
      exportCompletePackageWord(companyProfile, filteredIncome, filteredBalance, filteredCashFlow, filteredEquity, filteredFixedAssets, notes);
      return;
    }
    const { title, headers, rows } = getTableDataForExport(activeStatement);
    exportDocumentWord(companyProfile, title, headers, rows, `${activeStatement}_Statement.docx`);
  };

  const handleExportPdf = () => {
    if (activeStatement === 'complete') {
      exportCompletePackagePdf(companyProfile, filteredIncome, filteredBalance, filteredCashFlow, filteredEquity, filteredFixedAssets, notes);
      return;
    }
    const { title, headers, rows } = getTableDataForExport(activeStatement);
    exportDocumentPdf(companyProfile, title, headers, rows, `${activeStatement}_Statement.pdf`);
  };

  function getTableDataForExport(stmt: string): { title: string; headers: string[]; rows: (string | number)[][] } {
    switch (stmt) {
      case 'income':
        return {
          title: 'Statement of Comprehensive Income',
          headers: ['Metric', ...filteredIncome.map(d => `${d.year}${d.isProjected ? ' (P)' : ''}`)],
          rows: [
            [getLbl('income', 'revenue', 'Sales Revenue'), ...filteredIncome.map(d => getVal('income', 'revenue', d.year, d.revenue))],
            [getLbl('income', 'costOfSales', 'Cost of Sales'), ...filteredIncome.map(d => -getVal('income', 'costOfSales', d.year, d.costOfSales))],
            [getLbl('income', 'grossProfit', 'Gross Profit'), ...filteredIncome.map(d => getVal('income', 'grossProfit', d.year, d.grossProfit))],
            [getLbl('income', 'operatingExpenses', 'Operating Expenses'), ...filteredIncome.map(d => -getVal('income', 'operatingExpenses', d.year, d.operatingExpenses))],
            [getLbl('income', 'depreciationExpense', 'Depreciation Expense'), ...filteredIncome.map(d => -getVal('income', 'depreciationExpense', d.year, d.depreciationExpense))],
            [getLbl('income', 'operatingProfit', 'Operating Profit (EBIT)'), ...filteredIncome.map(d => getVal('income', 'operatingProfit', d.year, d.operatingProfit))],
            [getLbl('income', 'financeCost', 'Finance Cost'), ...filteredIncome.map(d => -getVal('income', 'financeCost', d.year, d.financeCost))],
            [getLbl('income', 'profitBeforeTax', 'Profit Before Tax'), ...filteredIncome.map(d => getVal('income', 'profitBeforeTax', d.year, d.profitBeforeTax))],
            [getLbl('income', 'netProfit', 'Net Profit After Tax'), ...filteredIncome.map(d => getVal('income', 'netProfit', d.year, d.netProfit))],
          ],
        };
      case 'balanceSheet':
        return {
          title: 'Statement of Financial Position',
          headers: ['Line Item', ...filteredBalance.map(d => `${d.year}${d.isProjected ? ' (P)' : ''}`)],
          rows: [
            [getLbl('bs', 'cashAndEquivalents', 'Cash and Cash Equivalents'), ...filteredBalance.map(d => getVal('bs', 'cashAndEquivalents', d.year, d.cashAndEquivalents))],
            [getLbl('bs', 'tradeReceivables', 'Trade Receivables'), ...filteredBalance.map(d => getVal('bs', 'tradeReceivables', d.year, d.tradeReceivables))],
            [getLbl('bs', 'closingInventory', 'Closing Inventory'), ...filteredBalance.map(d => getVal('bs', 'closingInventory', d.year, d.closingInventory))],
            [getLbl('bs', 'totalCurrentAssets', 'Total Current Assets'), ...filteredBalance.map(d => getVal('bs', 'totalCurrentAssets', d.year, d.totalCurrentAssets))],
            [getLbl('bs', 'propertyPlantEquipment', 'Property, Plant & Equipment (NBV)'), ...filteredBalance.map(d => getVal('bs', 'propertyPlantEquipment', d.year, d.propertyPlantEquipment))],
            [getLbl('bs', 'totalAssets', 'TOTAL ASSETS'), ...filteredBalance.map(d => getVal('bs', 'totalAssets', d.year, d.totalAssets))],
            [getLbl('bs', 'totalCurrentLiabilities', 'Total Current Liabilities'), ...filteredBalance.map(d => getVal('bs', 'totalCurrentLiabilities', d.year, d.totalCurrentLiabilities))],
            [getLbl('bs', 'longTermBorrowings', 'Long-Term Borrowings'), ...filteredBalance.map(d => getVal('bs', 'longTermBorrowings', d.year, d.longTermBorrowings))],
            [getLbl('bs', 'totalLiabilities', 'TOTAL LIABILITIES'), ...filteredBalance.map(d => getVal('bs', 'totalLiabilities', d.year, d.totalLiabilities))],
            [getLbl('bs', 'totalEquity', 'TOTAL EQUITY'), ...filteredBalance.map(d => getVal('bs', 'totalEquity', d.year, d.totalEquity))],
            [getLbl('bs', 'totalLiabilitiesAndEquity', 'TOTAL LIABILITIES & EQUITY'), ...filteredBalance.map(d => getVal('bs', 'totalLiabilitiesAndEquity', d.year, d.totalLiabilitiesAndEquity))],
          ],
        };
      case 'cashFlow':
      default:
        return {
          title: 'Statement of Cash Flows (Indirect Method)',
          headers: ['Cash Flow Item', ...filteredCashFlow.map(d => `${d.year}${d.isProjected ? ' (P)' : ''}`)],
          rows: [
            [getLbl('cf', 'profitBeforeTax', 'Net Profit Before Tax'), ...filteredCashFlow.map(d => getVal('cf', 'profitBeforeTax', d.year, d.profitBeforeTax))],
            [getLbl('cf', 'adjDepreciation', 'Depreciation Adjustment'), ...filteredCashFlow.map(d => getVal('cf', 'adjDepreciation', d.year, d.adjDepreciation))],
            [getLbl('cf', 'adjFinanceCost', 'Finance Cost Adjustment'), ...filteredCashFlow.map(d => getVal('cf', 'adjFinanceCost', d.year, d.adjFinanceCost))],
            [getLbl('cf', 'operatingProfitBeforeWC', 'Operating Profit Before Working Capital'), ...filteredCashFlow.map(d => getVal('cf', 'operatingProfitBeforeWC', d.year, d.operatingProfitBeforeWC))],
            [getLbl('cf', 'netCashFromOperating', 'NET CASH FROM OPERATING ACTIVITIES'), ...filteredCashFlow.map(d => getVal('cf', 'netCashFromOperating', d.year, d.netCashFromOperating))],
            [getLbl('cf', 'purchasePPE', 'Purchase of PPE (Capex)'), ...filteredCashFlow.map(d => getVal('cf', 'purchasePPE', d.year, d.purchasePPE))],
            [getLbl('cf', 'netCashFromInvesting', 'NET CASH FROM / (USED IN) INVESTING'), ...filteredCashFlow.map(d => getVal('cf', 'netCashFromInvesting', d.year, d.netCashFromInvesting))],
            [getLbl('cf', 'financingProceedsBorrowings', 'Proceeds from Borrowings & Financing'), ...filteredCashFlow.map(d => getVal('cf', 'financingProceedsBorrowings', d.year, d.financingProceedsBorrowings))],
            [getLbl('cf', 'repaymentOfBorrowings', 'Repayment of Borrowings & Financing'), ...filteredCashFlow.map(d => -getVal('cf', 'repaymentOfBorrowings', d.year, d.repaymentOfBorrowings || Math.abs(d.financingRepaymentBorrowings)))],
            [getLbl('cf', 'financingDividendsPaid', 'Dividends Paid to Shareholders'), ...filteredCashFlow.map(d => getVal('cf', 'financingDividendsPaid', d.year, d.financingDividendsPaid))],
            [getLbl('cf', 'directlyEnteredFinancingCashFlow', 'Directly Entered Financing Cash Flow (Total)'), ...filteredCashFlow.map(d => getVal('cf', 'directlyEnteredFinancingCashFlow', d.year, d.directlyEnteredFinancingCashFlow))],
            [getLbl('cf', 'netCashFromFinancing', 'NET CASH FROM / (USED IN) FINANCING'), ...filteredCashFlow.map(d => getVal('cf', 'netCashFromFinancing', d.year, d.netCashFromFinancing))],
            [getLbl('cf', 'netChangeInCash', 'Net Increase / (Decrease) in Cash'), ...filteredCashFlow.map(d => getVal('cf', 'netChangeInCash', d.year, d.netChangeInCash))],
            [getLbl('cf', 'closingCashCalculated', 'Closing Cash & Cash Equivalents (Calculated)'), ...filteredCashFlow.map(d => getVal('cf', 'closingCashCalculated', d.year, d.closingCashCalculated))],
            [getLbl('cf', 'balanceSheetCash', 'Stated Cash in Balance Sheet'), ...filteredCashFlow.map(d => getVal('cf', 'balanceSheetCash', d.year, d.balanceSheetCash))],
          ],
        };
    }
  }

  const statementTabs = [
    { id: 'income', label: '1. Income Statement' },
    { id: 'balanceSheet', label: '2. Balance Sheet' },
    { id: 'cashFlow', label: '3. Statement of Cash Flows' },
    { id: 'equity', label: '4. Changes in Equity' },
    { id: 'fixedAssets', label: '5. Fixed Assets Schedule' },
    { id: 'notes', label: '6. Notes to Financials' },
    { id: 'complete', label: 'Complete Financial Package' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner, Edit Toggle & Export Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Five Standard Financial Statements & Schedules
            </h2>
            <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded-md">
              Section 76 & Editable
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {companyProfile.companyName} · {companyProfile.accountingFramework} · {companyProfile.reportingCurrency} in {companyProfile.reportingUnit}
          </p>
        </div>

        {/* Global Controls: Edit Mode Toggle & Export Strip */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Universal Edit Mode Button */}
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 shadow-sm ${
              isEditMode
                ? 'bg-amber-500 text-slate-950 border-amber-400 ring-2 ring-amber-500/30'
                : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border-slate-700 hover:text-white'
            }`}
            title="Toggle inline editing for every line item title and financial number"
          >
            <Edit3 className="w-3.5 h-3.5" />
            {isEditMode ? 'Finish Editing (Active)' : 'Edit Values & Labels'}
          </button>

          {isEditMode && (
            <button
              onClick={onResetOverrides}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:text-rose-300 bg-slate-800 hover:bg-slate-700/60 rounded-lg border border-slate-700 transition-colors flex items-center gap-1"
              title="Reset any custom numbers back to the calculation engine defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          )}

          {/* Individual Statement Export Options */}
          <div className="flex items-center gap-1 pl-2 border-l border-slate-800">
            <button
              onClick={handleExportExcel}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
              title="Export this statement to Microsoft Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              Excel
            </button>
            <button
              onClick={handleExportWord}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
              title="Export this statement to Microsoft Word (.docx)"
            >
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              Word
            </button>
            <button
              onClick={handleExportPdf}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
              title="Export this statement to Adobe PDF (.pdf)"
            >
              <Download className="w-3.5 h-3.5 text-rose-400" />
              PDF
            </button>
          </div>
        </div>
      </div>

      {/* Edit Mode Notification Banner */}
      {isEditMode && (
        <div className="p-3.5 bg-amber-950/30 border border-amber-800/40 rounded-xl text-xs text-amber-200 flex items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Direct Editing Enabled:</strong> You can edit any item label and any financial value for any year directly in the table cells below. Changes immediately update calculations and exports.
            </span>
          </div>
          <button
            onClick={() => setIsEditMode(false)}
            className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 rounded font-medium text-[11px] shrink-0 border border-amber-500/30"
          >
            Done Editing
          </button>
        </div>
      )}

      {/* Statement Tabs Bar & Horizon Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-thin">
          {statementTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveStatement(tab.id)}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeStatement === tab.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Year Filter Controls & Horizon Selector */}
        {activeStatement !== 'notes' && (
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs bg-slate-900 border border-slate-800 p-1 rounded-lg">
              <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
              <button
                onClick={() => setYearViewMode('all')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  yearViewMode === 'all' ? 'bg-slate-800 text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All (3H+{assumptions?.projectedYearsCount || 15}P)
              </button>
              <button
                onClick={() => setYearViewMode('historical')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  yearViewMode === 'historical' ? 'bg-slate-800 text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Historical (3Y)
              </button>
              <button
                onClick={() => setYearViewMode('comparative5')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  yearViewMode === 'comparative5' ? 'bg-slate-800 text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Comparative (5Y)
              </button>
              <button
                onClick={() => setYearViewMode('projected')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  yearViewMode === 'projected' ? 'bg-slate-800 text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Projected ({assumptions?.projectedYearsCount || 15}Y)
              </button>
            </div>

            {/* Direct Number of Projected Years Selector */}
            {assumptions && onUpdateAssumptions && (
              <div className="flex items-center gap-1.5 text-xs bg-slate-900 border border-slate-800 px-2 py-1 rounded-lg">
                <span className="text-slate-400 text-[11px] font-medium">Horizon:</span>
                <select
                  value={assumptions.projectedYearsCount}
                  onChange={(e) => onUpdateAssumptions({ ...assumptions, projectedYearsCount: Number(e.target.value) })}
                  className="bg-slate-800 text-emerald-400 font-bold rounded px-1.5 py-0.5 border border-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 18, 20].map(y => (
                    <option key={y} value={y}>{y} {y === 1 ? 'Year' : 'Years'}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Render Statement Body */}
      {activeStatement === 'cashFlow' && (
        <StatementOfCashFlowsTable
          cashFlowData={filteredCashFlow}
          currency={companyProfile.reportingCurrency}
          isEditMode={isEditMode}
          getVal={getVal}
          getLbl={getLbl}
          onUpdateValue={onUpdateStatementValue}
          onUpdateLabel={onUpdateStatementLabel}
        />
      )}

      {activeStatement === 'income' && (
        <IncomeStatementTable
          incomeData={filteredIncome}
          currency={companyProfile.reportingCurrency}
          isEditMode={isEditMode}
          getVal={getVal}
          getLbl={getLbl}
          onUpdateValue={onUpdateStatementValue}
          onUpdateLabel={onUpdateStatementLabel}
        />
      )}

      {activeStatement === 'balanceSheet' && (
        <BalanceSheetTable
          balanceData={filteredBalance}
          currency={companyProfile.reportingCurrency}
          isEditMode={isEditMode}
          getVal={getVal}
          getLbl={getLbl}
          onUpdateValue={onUpdateStatementValue}
          onUpdateLabel={onUpdateStatementLabel}
        />
      )}

      {activeStatement === 'equity' && (
        <EquityStatementTable
          equityData={filteredEquity}
          currency={companyProfile.reportingCurrency}
          isEditMode={isEditMode}
          getVal={getVal}
          getLbl={getLbl}
          onUpdateValue={onUpdateStatementValue}
          onUpdateLabel={onUpdateStatementLabel}
        />
      )}

      {activeStatement === 'fixedAssets' && (
        <FixedAssetsScheduleTable
          fixedAssetsData={filteredFixedAssets}
          currency={companyProfile.reportingCurrency}
          isEditMode={isEditMode}
          onUpdateCategory={onUpdateFixedAssetsCategory}
        />
      )}

      {activeStatement === 'notes' && (
        <NotesViewer
          notes={notes}
          currency={companyProfile.reportingCurrency}
          isEditMode={isEditMode}
          onUpdateNotes={onUpdateNotes}
        />
      )}

      {activeStatement === 'complete' && (
        <CompletePackagePreview
          companyProfile={companyProfile}
          incomeData={filteredIncome}
          balanceData={filteredBalance}
          cashFlowData={filteredCashFlow}
          equityData={filteredEquity}
          fixedAssetsData={filteredFixedAssets}
          notes={notes}
          onExportExcel={handleExportExcel}
          onExportWord={handleExportWord}
          onExportPdf={handleExportPdf}
        />
      )}
    </div>
  );
};

// ----------------- EDITABLE CELL COMPONENT ----------------- //
interface EditableCellProps {
  val: number;
  isEditMode: boolean;
  onSave: (newVal: number) => void;
  className?: string;
  isNegative?: boolean;
}

const EditableCell: React.FC<EditableCellProps> = ({
  val,
  isEditMode,
  onSave,
  className = '',
  isNegative = false,
}) => {
  const [localVal, setLocalVal] = useState<string>(String(val));
  const [isEditingSingle, setIsEditingSingle] = useState(false);

  React.useEffect(() => {
    setLocalVal(String(val));
  }, [val]);

  const handleBlur = () => {
    setIsEditingSingle(false);
    const num = Number(localVal);
    if (!isNaN(num)) {
      onSave(num);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  if (isEditMode || isEditingSingle) {
    return (
      <input
        type="number"
        value={localVal}
        onChange={(e) => setLocalVal(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoFocus={isEditingSingle}
        className="w-24 sm:w-28 bg-slate-950 border border-emerald-500/80 rounded px-1.5 py-0.5 text-right font-mono text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
      />
    );
  }

  return (
    <span
      onClick={() => setIsEditingSingle(true)}
      title="Click to edit value directly"
      className={`cursor-pointer hover:underline hover:text-emerald-300 transition-colors font-mono tabular-nums ${className}`}
    >
      {isNegative ? `(${Math.abs(val).toLocaleString()})` : val.toLocaleString()}
    </span>
  );
};

// ----------------- EDITABLE LABEL COMPONENT ----------------- //
interface EditableLabelProps {
  label: string;
  isEditMode: boolean;
  onSave: (newLabel: string) => void;
  className?: string;
}

const EditableLabel: React.FC<EditableLabelProps> = ({
  label,
  isEditMode,
  onSave,
  className = '',
}) => {
  const [localLabel, setLocalLabel] = useState(label);
  const [isEditingSingle, setIsEditingSingle] = useState(false);

  React.useEffect(() => {
    setLocalLabel(label);
  }, [label]);

  const handleBlur = () => {
    setIsEditingSingle(false);
    if (localLabel.trim()) {
      onSave(localLabel.trim());
    }
  };

  if (isEditMode || isEditingSingle) {
    return (
      <input
        type="text"
        value={localLabel}
        onChange={(e) => setLocalLabel(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
        autoFocus={isEditingSingle}
        className="w-full bg-slate-950 border border-emerald-500/80 rounded px-1.5 py-0.5 text-left text-xs font-medium text-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
      />
    );
  }

  return (
    <span
      onClick={() => setIsEditingSingle(true)}
      title="Click to edit row label"
      className={`cursor-pointer hover:text-emerald-300 transition-colors ${className}`}
    >
      {label}
    </span>
  );
};

// ----------------- STATEMENT OF CASH FLOWS TABLE (SECTION 76.3) ----------------- //
function StatementOfCashFlowsTable({
  cashFlowData,
  currency,
  isEditMode,
  getVal,
  getLbl,
  onUpdateValue,
  onUpdateLabel,
}: {
  cashFlowData: CashFlowStatementYear[];
  currency: string;
  isEditMode: boolean;
  getVal: (stmt: string, field: string, year: number, fallback: number) => number;
  getLbl: (stmt: string, field: string, defaultLabel: string) => string;
  onUpdateValue: (stmt: string, field: string, year: number, val: number) => void;
  onUpdateLabel: (stmt: string, field: string, newLabel: string) => void;
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm space-y-4">
      <div className="p-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white">
            Statement of Cash Flows (Indirect Method)
          </h3>
          <p className="text-[11px] text-slate-400">
            Section 76.3 & IAS 7 presentation · All line items and financial values are editable
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800/60 px-2 py-0.5 rounded-md font-medium">
            Operating · Investing · Financing
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-800/80 text-slate-300 border-b border-slate-700 text-[11px]">
            <tr>
              <th className="py-3 px-4 font-sans font-semibold text-white">Activity / Line Item</th>
              {cashFlowData.map(d => (
                <th key={d.year} className="py-3 px-3 text-right">
                  {d.year} {d.isProjected ? '(P)' : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 tabular-nums">
            {/* A. Operating Activities */}
            <tr className="bg-slate-800/50 font-sans font-bold text-emerald-400">
              <td colSpan={cashFlowData.length + 1} className="py-2.5 px-4 text-xs tracking-wider uppercase">
                A. Cash Flows from Operating Activities
              </td>
            </tr>

            <tr>
              <td className="py-2 px-4 font-sans text-slate-200">
                <EditableLabel
                  label={getLbl('cf', 'profitBeforeTax', 'Net Profit Before Tax')}
                  isEditMode={isEditMode}
                  onSave={(lbl) => onUpdateLabel('cf', 'profitBeforeTax', lbl)}
                />
              </td>
              {cashFlowData.map(d => (
                <td key={d.year} className="py-2 px-3 text-right text-slate-200">
                  <EditableCell
                    val={getVal('cf', 'profitBeforeTax', d.year, d.profitBeforeTax)}
                    isEditMode={isEditMode}
                    onSave={(val) => onUpdateValue('cf', 'profitBeforeTax', d.year, val)}
                  />
                </td>
              ))}
            </tr>

            <tr>
              <td className="py-2 px-4 font-sans text-slate-400 pl-6">
                <EditableLabel
                  label={getLbl('cf', 'adjDepreciation', 'Adjustments for Depreciation')}
                  isEditMode={isEditMode}
                  onSave={(lbl) => onUpdateLabel('cf', 'adjDepreciation', lbl)}
                />
              </td>
              {cashFlowData.map(d => (
                <td key={d.year} className="py-2 px-3 text-right text-slate-300">
                  <EditableCell
                    val={getVal('cf', 'adjDepreciation', d.year, d.adjDepreciation)}
                    isEditMode={isEditMode}
                    onSave={(val) => onUpdateValue('cf', 'adjDepreciation', d.year, val)}
                  />
                </td>
              ))}
            </tr>

            <tr>
              <td className="py-2 px-4 font-sans text-slate-400 pl-6">
                <EditableLabel
                  label={getLbl('cf', 'adjAmortization', 'Adjustments for Amortization')}
                  isEditMode={isEditMode}
                  onSave={(lbl) => onUpdateLabel('cf', 'adjAmortization', lbl)}
                />
              </td>
              {cashFlowData.map(d => (
                <td key={d.year} className="py-2 px-3 text-right text-slate-300">
                  <EditableCell
                    val={getVal('cf', 'adjAmortization', d.year, d.adjAmortization)}
                    isEditMode={isEditMode}
                    onSave={(val) => onUpdateValue('cf', 'adjAmortization', d.year, val)}
                  />
                </td>
              ))}
            </tr>

            <tr>
              <td className="py-2 px-4 font-sans text-slate-400 pl-6">
                <EditableLabel
                  label={getLbl('cf', 'adjFinanceCost', 'Finance Cost Adjustment')}
                  isEditMode={isEditMode}
                  onSave={(lbl) => onUpdateLabel('cf', 'adjFinanceCost', lbl)}
                />
              </td>
              {cashFlowData.map(d => (
                <td key={d.year} className="py-2 px-3 text-right text-slate-300">
                  <EditableCell
                    val={getVal('cf', 'adjFinanceCost', d.year, d.adjFinanceCost)}
                    isEditMode={isEditMode}
                    onSave={(val) => onUpdateValue('cf', 'adjFinanceCost', d.year, val)}
                  />
                </td>
              ))}
            </tr>

            <tr>
              <td className="py-2 px-4 font-sans text-slate-400 pl-6">
                <EditableLabel
                  label={getLbl('cf', 'adjInterestIncome', 'Interest & Investment Income')}
                  isEditMode={isEditMode}
                  onSave={(lbl) => onUpdateLabel('cf', 'adjInterestIncome', lbl)}
                />
              </td>
              {cashFlowData.map(d => (
                <td key={d.year} className="py-2 px-3 text-right text-slate-300">
                  <EditableCell
                    val={getVal('cf', 'adjInterestIncome', d.year, d.adjInterestIncome)}
                    isEditMode={isEditMode}
                    onSave={(val) => onUpdateValue('cf', 'adjInterestIncome', d.year, val)}
                  />
                </td>
              ))}
            </tr>

            <tr className="bg-slate-800/30 font-semibold text-slate-200">
              <td className="py-2 px-4 font-sans">
                <EditableLabel
                  label={getLbl('cf', 'operatingProfitBeforeWC', 'Operating Profit Before Working Capital Changes')}
                  isEditMode={isEditMode}
                  onSave={(lbl) => onUpdateLabel('cf', 'operatingProfitBeforeWC', lbl)}
                />
              </td>
              {cashFlowData.map(d => (
                <td key={d.year} className="py-2 px-3 text-right text-emerald-300 font-bold">
                  <EditableCell
                    val={getVal('cf', 'operatingProfitBeforeWC', d.year, d.operatingProfitBeforeWC)}
                    isEditMode={isEditMode}
                    onSave={(val) => onUpdateValue('cf', 'operatingProfitBeforeWC', d.year, val)}
                  />
                </td>
              ))}
            </tr>

            <tr>
              <td className="py-2 px-4 font-sans text-slate-400 pl-6">
                <EditableLabel
                  label={getLbl('cf', 'changeInInventory', '(Increase) / Decrease in Inventory')}
                  isEditMode={isEditMode}
                  onSave={(lbl) => onUpdateLabel('cf', 'changeInInventory', lbl)}
                />
              </td>
              {cashFlowData.map(d => (
                <td key={d.year} className="py-2 px-3 text-right text-slate-300">
                  <EditableCell
                    val={getVal('cf', 'changeInInventory', d.year, d.changeInInventory)}
                    isEditMode={isEditMode}
                    onSave={(val) => onUpdateValue('cf', 'changeInInventory', d.year, val)}
                  />
                </td>
              ))}
            </tr>

            <tr>
              <td className="py-2 px-4 font-sans text-slate-400 pl-6">
                <EditableLabel
                  label={getLbl('cf', 'changeInReceivables', '(Increase) / Decrease in Trade Receivables')}
                  isEditMode={isEditMode}
                  onSave={(lbl) => onUpdateLabel('cf', 'changeInReceivables', lbl)}
                />
              </td>
              {cashFlowData.map(d => (
                <td key={d.year} className="py-2 px-3 text-right text-slate-300">
                  <EditableCell
                    val={getVal('cf', 'changeInReceivables', d.year, d.changeInReceivables)}
                    isEditMode={isEditMode}
                    onSave={(val) => onUpdateValue('cf', 'changeInReceivables', d.year, val)}
                  />
                </td>
              ))}
            </tr>

            <tr>
              <td className="py-2 px-4 font-sans text-slate-400 pl-6">
                <EditableLabel
                  label={getLbl('cf', 'changeInPayables', 'Increase / (Decrease) in Trade Payables')}
                  isEditMode={isEditMode}
                  onSave={(lbl) => onUpdateLabel('cf', 'changeInPayables', lbl)}
                />
              </td>
              {cashFlowData.map(d => (
                <td key={d.year} className="py-2 px-3 text-right text-slate-300">
                  <EditableCell
                    val={getVal('cf', 'changeInPayables', d.year, d.changeInPayables)}
                    isEditMode={isEditMode}
                    onSave={(val) => onUpdateValue('cf', 'changeInPayables', d.year, val)}
                  />
                </td>
              ))}
            </tr>

            <tr>
              <td className="py-2 px-4 font-sans text-slate-400 pl-6">
                <EditableLabel
                  label={getLbl('cf', 'incomeTaxPaid', 'Income Tax Paid')}
                  isEditMode={isEditMode}
                  onSave={(lbl) => onUpdateLabel('cf', 'incomeTaxPaid', lbl)}
                />
              </td>
              {cashFlowData.map(d => (
                <td key={d.year} className="py-2 px-3 text-right text-rose-300">
                  <EditableCell
                    val={getVal('cf', 'incomeTaxPaid', d.year, d.incomeTaxPaid)}
                    isEditMode={isEditMode}
                    onSave={(val) => onUpdateValue('cf', 'incomeTaxPaid', d.year, val)}
                    isNegative
                  />
                </td>
              ))}
            </tr>

            <tr className="bg-slate-800/60 font-bold border-t border-slate-700">
              <td className="py-2.5 px-4 font-sans text-emerald-400">
                <EditableLabel
                  label={getLbl('cf', 'netCashFromOperating', 'Net Cash Generated from / (Used in) Operating Activities')}
                  isEditMode={isEditMode}
                  onSave={(lbl) => onUpdateLabel('cf', 'netCashFromOperating', lbl)}
                />
              </td>
              {cashFlowData.map(d => (
                <td key={d.year} className={`py-2.5 px-3 text-right ${d.netCashFromOperating >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  <EditableCell
                    val={getVal('cf', 'netCashFromOperating', d.year, d.netCashFromOperating)}
                    isEditMode={isEditMode}
                    onSave={(val) => onUpdateValue('cf', 'netCashFromOperating', d.year, val)}
                  />
                </td>
              ))}
            </tr>

            {/* B. Investing Activities */}
            <tr className="bg-slate-800/50 font-sans font-bold text-sky-400">
              <td colSpan={cashFlowData.length + 1} className="py-2.5 px-4 text-xs tracking-wider uppercase">
                B. Cash Flows from Investing Activities
              </td>
            </tr>

            <tr>
              <td className="py-2 px-4 font-sans text-slate-400 pl-6">
                <EditableLabel
                  label={getLbl('cf', 'purchasePPE', 'Purchase of Property, Plant & Equipment (Capex)')}
                  isEditMode={isEditMode}
                  onSave={(lbl) => onUpdateLabel('cf', 'purchasePPE', lbl)}
                />
              </td>
              {cashFlowData.map(d => (
                <td key={d.year} className="py-2 px-3 text-right text-rose-300">
                  <EditableCell
                    val={getVal('cf', 'purchasePPE', d.year, d.purchasePPE)}
                    isEditMode={isEditMode}
                    onSave={(val) => onUpdateValue('cf', 'purchasePPE', d.year, val)}
                    isNegative
                  />
                </td>
              ))}
            </tr>

            <tr>
              <td className="py-2 px-4 font-sans text-slate-400 pl-6">
                <EditableLabel
                  label={getLbl('cf', 'salePPE', 'Proceeds from Sale of Fixed Assets')}
                  isEditMode={isEditMode}
                  onSave={(lbl) => onUpdateLabel('cf', 'salePPE', lbl)}
                />
              </td>
              {cashFlowData.map(d => (
                <td key={d.year} className="py-2 px-3 text-right text-slate-300">
                  <EditableCell
                    val={getVal('cf', 'salePPE', d.year, d.salePPE)}
                    isEditMode={isEditMode}
                    onSave={(val) => onUpdateValue('cf', 'salePPE', d.year, val)}
                  />
                </td>
              ))}
            </tr>

            <tr className="bg-slate-800/60 font-bold border-t border-slate-700">
              <td className="py-2.5 px-4 font-sans text-sky-400">
                <EditableLabel
                  label={getLbl('cf', 'netCashFromInvesting', 'Net Cash Generated from / (Used in) Investing Activities')}
                  isEditMode={isEditMode}
                  onSave={(lbl) => onUpdateLabel('cf', 'netCashFromInvesting', lbl)}
                />
              </td>
              {cashFlowData.map(d => (
                <td key={d.year} className={`py-2.5 px-3 text-right ${d.netCashFromInvesting >= 0 ? 'text-sky-400' : 'text-rose-400'}`}>
                  <EditableCell
                    val={getVal('cf', 'netCashFromInvesting', d.year, d.netCashFromInvesting)}
                    isEditMode={isEditMode}
                    onSave={(val) => onUpdateValue('cf', 'netCashFromInvesting', d.year, val)}
                  />
                </td>
              ))}
            </tr>

            {/* C. Financing Activities */}
            <tr className="bg-slate-800/50 font-sans font-bold text-amber-400">
              <td colSpan={cashFlowData.length + 1} className="py-2.5 px-4 text-xs tracking-wider uppercase flex items-center justify-between">
                <span>C. Cash Flows from Financing Activities</span>
                <span className="text-[10px] font-normal normal-case text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-800/50">
                  Mandatory Direct User Input
                </span>
              </td>
            </tr>

            <tr>
              <td className="py-2 px-4 font-sans text-slate-300 pl-6">
                <EditableLabel
                  label={getLbl('cf', 'financingProceedsBorrowings', 'Proceeds from Borrowings & Financing')}
                  isEditMode={isEditMode}
                  onSave={(lbl) => onUpdateLabel('cf', 'financingProceedsBorrowings', lbl)}
                />
              </td>
              {cashFlowData.map(d => (
                <td key={d.year} className="py-2 px-3 text-right text-slate-200">
                  <EditableCell
                    val={getVal('cf', 'financingProceedsBorrowings', d.year, d.financingProceedsBorrowings)}
                    isEditMode={isEditMode}
                    onSave={(val) => onUpdateValue('cf', 'financingProceedsBorrowings', d.year, val)}
                  />
                </td>
              ))}
            </tr>

            <tr className="bg-rose-950/20 font-medium">
              <td className="py-2.5 px-4 font-sans text-rose-300 pl-6 flex items-center gap-1.5">
                <EditableLabel
                  label={getLbl('cf', 'repaymentOfBorrowings', 'Repayment of Borrowings & Financing (Outflow) *')}
                  isEditMode={isEditMode}
                  onSave={(lbl) => onUpdateLabel('cf', 'repaymentOfBorrowings', lbl)}
                />
                <span className="text-[10px] bg-rose-900/60 text-rose-200 border border-rose-700/50 px-1.5 py-0.2 rounded font-normal">
                  User Input
                </span>
              </td>
              {cashFlowData.map(d => {
                const repVal = getVal('cf', 'repaymentOfBorrowings', d.year, d.repaymentOfBorrowings || Math.abs(d.financingRepaymentBorrowings));
                return (
                  <td key={d.year} className="py-2.5 px-3 text-right text-rose-300 font-bold">
                    <EditableCell
                      val={repVal}
                      isEditMode={isEditMode}
                      onSave={(val) => onUpdateValue('cf', 'repaymentOfBorrowings', d.year, val)}
                      isNegative
                    />
                  </td>
                );
              })}
            </tr>

            <tr>
              <td className="py-2 px-4 font-sans text-slate-300 pl-6">
                <EditableLabel
                  label={getLbl('cf', 'financingDividendsPaid', 'Dividends Paid to Shareholders')}
                  isEditMode={isEditMode}
                  onSave={(lbl) => onUpdateLabel('cf', 'financingDividendsPaid', lbl)}
                />
              </td>
              {cashFlowData.map(d => (
                <td key={d.year} className="py-2 px-3 text-right text-rose-300">
                  <EditableCell
                    val={getVal('cf', 'financingDividendsPaid', d.year, d.financingDividendsPaid)}
                    isEditMode={isEditMode}
                    onSave={(val) => onUpdateValue('cf', 'financingDividendsPaid', d.year, val)}
                    isNegative
                  />
                </td>
              ))}
            </tr>

            <tr className="bg-amber-950/20 font-semibold border-t border-slate-800">
              <td className="py-2 px-4 font-sans text-amber-300">
                <EditableLabel
                  label={getLbl('cf', 'directlyEnteredFinancingCashFlow', 'Directly Entered Cash Flow from Financing Activities *')}
                  isEditMode={isEditMode}
                  onSave={(lbl) => onUpdateLabel('cf', 'directlyEnteredFinancingCashFlow', lbl)}
                />
              </td>
              {cashFlowData.map(d => (
                <td key={d.year} className="py-2 px-3 text-right text-amber-300 font-bold">
                  <EditableCell
                    val={getVal('cf', 'directlyEnteredFinancingCashFlow', d.year, d.directlyEnteredFinancingCashFlow)}
                    isEditMode={isEditMode}
                    onSave={(val) => onUpdateValue('cf', 'directlyEnteredFinancingCashFlow', d.year, val)}
                  />
                </td>
              ))}
            </tr>

            <tr className="bg-slate-800/60 font-bold border-t border-slate-700">
              <td className="py-2.5 px-4 font-sans text-amber-400">
                <EditableLabel
                  label={getLbl('cf', 'netCashFromFinancing', 'Net Cash Generated from / (Used in) Financing Activities')}
                  isEditMode={isEditMode}
                  onSave={(lbl) => onUpdateLabel('cf', 'netCashFromFinancing', lbl)}
                />
              </td>
              {cashFlowData.map(d => (
                <td key={d.year} className="py-2.5 px-3 text-right text-amber-400">
                  <EditableCell
                    val={getVal('cf', 'netCashFromFinancing', d.year, d.netCashFromFinancing)}
                    isEditMode={isEditMode}
                    onSave={(val) => onUpdateValue('cf', 'netCashFromFinancing', d.year, val)}
                  />
                </td>
              ))}
            </tr>

            {/* D. Net Increase / Decrease in Cash */}
            <tr className="bg-slate-800 font-bold text-white border-t-2 border-slate-600">
              <td className="py-3 px-4 font-sans">
                <EditableLabel
                  label={getLbl('cf', 'netChangeInCash', 'Net Increase / (Decrease) in Cash and Cash Equivalents')}
                  isEditMode={isEditMode}
                  onSave={(lbl) => onUpdateLabel('cf', 'netChangeInCash', lbl)}
                />
              </td>
              {cashFlowData.map(d => (
                <td key={d.year} className={`py-3 px-3 text-right ${d.netChangeInCash >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                  <EditableCell
                    val={getVal('cf', 'netChangeInCash', d.year, d.netChangeInCash)}
                    isEditMode={isEditMode}
                    onSave={(val) => onUpdateValue('cf', 'netChangeInCash', d.year, val)}
                  />
                </td>
              ))}
            </tr>

            <tr>
              <td className="py-2 px-4 font-sans text-slate-400">
                <EditableLabel
                  label={getLbl('cf', 'openingCash', 'Opening Cash and Cash Equivalents')}
                  isEditMode={isEditMode}
                  onSave={(lbl) => onUpdateLabel('cf', 'openingCash', lbl)}
                />
              </td>
              {cashFlowData.map(d => (
                <td key={d.year} className="py-2 px-3 text-right text-slate-300">
                  <EditableCell
                    val={getVal('cf', 'openingCash', d.year, d.openingCash)}
                    isEditMode={isEditMode}
                    onSave={(val) => onUpdateValue('cf', 'openingCash', d.year, val)}
                  />
                </td>
              ))}
            </tr>

            <tr className="font-bold text-emerald-400 bg-slate-800/40">
              <td className="py-2.5 px-4 font-sans">
                <EditableLabel
                  label={getLbl('cf', 'closingCashCalculated', 'Closing Cash and Cash Equivalents (Calculated)')}
                  isEditMode={isEditMode}
                  onSave={(lbl) => onUpdateLabel('cf', 'closingCashCalculated', lbl)}
                />
              </td>
              {cashFlowData.map(d => (
                <td key={d.year} className="py-2.5 px-3 text-right">
                  <EditableCell
                    val={getVal('cf', 'closingCashCalculated', d.year, d.closingCashCalculated)}
                    isEditMode={isEditMode}
                    onSave={(val) => onUpdateValue('cf', 'closingCashCalculated', d.year, val)}
                  />
                </td>
              ))}
            </tr>

            <tr className="font-semibold text-sky-400">
              <td className="py-2.5 px-4 font-sans">
                <EditableLabel
                  label={getLbl('cf', 'balanceSheetCash', 'Stated Cash in Statement of Financial Position')}
                  isEditMode={isEditMode}
                  onSave={(lbl) => onUpdateLabel('cf', 'balanceSheetCash', lbl)}
                />
              </td>
              {cashFlowData.map(d => (
                <td key={d.year} className="py-2.5 px-3 text-right">
                  <EditableCell
                    val={getVal('cf', 'balanceSheetCash', d.year, d.balanceSheetCash)}
                    isEditMode={isEditMode}
                    onSave={(val) => onUpdateValue('cf', 'balanceSheetCash', d.year, val)}
                  />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ----------------- INCOME STATEMENT TABLE ----------------- //
function IncomeStatementTable({
  incomeData,
  currency,
  isEditMode,
  getVal,
  getLbl,
  onUpdateValue,
  onUpdateLabel,
}: {
  incomeData: IncomeStatementYear[];
  currency: string;
  isEditMode: boolean;
  getVal: (stmt: string, field: string, year: number, fallback: number) => number;
  getLbl: (stmt: string, field: string, defaultLabel: string) => string;
  onUpdateValue: (stmt: string, field: string, year: number, val: number) => void;
  onUpdateLabel: (stmt: string, field: string, newLabel: string) => void;
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white">Statement of Comprehensive Income (Income Statement)</h3>
          <p className="text-[11px] text-slate-400">All revenues, cost lines, finance cost, and profit figures are editable</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-800/80 text-slate-300 border-b border-slate-700 text-[11px]">
            <tr>
              <th className="py-3 px-4 font-sans font-semibold text-white">Line Item</th>
              {incomeData.map(d => (
                <th key={d.year} className="py-3 px-3 text-right">
                  {d.year} {d.isProjected ? '(P)' : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 tabular-nums">
            <tr className="font-semibold text-white">
              <td className="py-2.5 px-4 font-sans">
                <EditableLabel
                  label={getLbl('income', 'revenue', 'Sales Revenue')}
                  isEditMode={isEditMode}
                  onSave={(lbl) => onUpdateLabel('income', 'revenue', lbl)}
                />
              </td>
              {incomeData.map(d => (
                <td key={d.year} className="py-2.5 px-3 text-right text-emerald-400 font-bold">
                  <EditableCell
                    val={getVal('income', 'revenue', d.year, d.revenue)}
                    isEditMode={isEditMode}
                    onSave={(val) => onUpdateValue('income', 'revenue', d.year, val)}
                  />
                </td>
              ))}
            </tr>

            <tr>
              <td className="py-2 px-4 font-sans text-slate-400 pl-6">
                <EditableLabel
                  label={getLbl('income', 'costOfSales', 'Cost of Goods Sold / Cost of Sales')}
                  isEditMode={isEditMode}
                  onSave={(lbl) => onUpdateLabel('income', 'costOfSales', lbl)}
                />
              </td>
              {incomeData.map(d => (
                <td key={d.year} className="py-2 px-3 text-right text-rose-300">
                  <EditableCell
                    val={getVal('income', 'costOfSales', d.year, d.costOfSales)}
                    isEditMode={isEditMode}
                    onSave={(val) => onUpdateValue('income', 'costOfSales', d.year, val)}
                    isNegative
                  />
                </td>
              ))}
            </tr>

            <tr className="bg-slate-800/40 font-bold text-slate-100">
              <td className="py-2.5 px-4 font-sans">
                <EditableLabel
                  label={getLbl('income', 'grossProfit', 'Gross Profit')}
                  isEditMode={isEditMode}
                  onSave={(lbl) => onUpdateLabel('income', 'grossProfit', lbl)}
                />
              </td>
              {incomeData.map(d => (
                <td key={d.year} className="py-2.5 px-3 text-right text-white">
                  <EditableCell
                    val={getVal('income', 'grossProfit', d.year, d.grossProfit)}
                    isEditMode={isEditMode}
                    onSave={(val) => onUpdateValue('income', 'grossProfit', d.year, val)}
                  />
                </td>
              ))}
            </tr>

            <tr>
              <td className="py-2 px-4 font-sans text-slate-400 pl-6">
                <EditableLabel
                  label={getLbl('income', 'operatingExpenses', 'Operating Expenses (Admin & Selling)')}
                  isEditMode={isEditMode}
                  onSave={(lbl) => onUpdateLabel('income', 'operatingExpenses', lbl)}
                />
              </td>
              {incomeData.map(d => (
                <td key={d.year} className="py-2 px-3 text-right text-rose-300">
                  <EditableCell
                    val={getVal('income', 'operatingExpenses', d.year, d.operatingExpenses)}
                    isEditMode={isEditMode}
                    onSave={(val) => onUpdateValue('income', 'operatingExpenses', d.year, val)}
                    isNegative
                  />
                </td>
              ))}
            </tr>

            <tr>
              <td className="py-2 px-4 font-sans text-slate-400 pl-6">
                <EditableLabel
                  label={getLbl('income', 'depreciationExpense', 'Depreciation Expense (Schedule of Fixed Assets)')}
                  isEditMode={isEditMode}
                  onSave={(lbl) => onUpdateLabel('income', 'depreciationExpense', lbl)}
                />
              </td>
              {incomeData.map(d => (
                <td key={d.year} className="py-2 px-3 text-right text-rose-300">
                  <EditableCell
                    val={getVal('income', 'depreciationExpense', d.year, d.depreciationExpense)}
                    isEditMode={isEditMode}
                    onSave={(val) => onUpdateValue('income', 'depreciationExpense', d.year, val)}
                    isNegative
                  />
                </td>
              ))}
            </tr>

            <tr className="bg-slate-800/50 font-bold text-sky-300">
              <td className="py-2.5 px-4 font-sans">
                <EditableLabel
                  label={getLbl('income', 'operatingProfit', 'Operating Profit (EBIT)')}
                  isEditMode={isEditMode}
                  onSave={(lbl) => onUpdateLabel('income', 'operatingProfit', lbl)}
                />
              </td>
              {incomeData.map(d => (
                <td key={d.year} className="py-2.5 px-3 text-right">
                  <EditableCell
                    val={getVal('income', 'operatingProfit', d.year, d.operatingProfit)}
                    isEditMode={isEditMode}
                    onSave={(val) => onUpdateValue('income', 'operatingProfit', d.year, val)}
                  />
                </td>
              ))}
            </tr>

            <tr className="bg-amber-950/20 font-semibold">
              <td className="py-2 px-4 font-sans text-amber-300 pl-6">
                <EditableLabel
                  label={getLbl('income', 'financeCost', 'Finance Cost (Mandatory Direct Entry)')}
                  isEditMode={isEditMode}
                  onSave={(lbl) => onUpdateLabel('income', 'financeCost', lbl)}
                />
              </td>
              {incomeData.map(d => (
                <td key={d.year} className="py-2 px-3 text-right text-amber-300">
                  <EditableCell
                    val={getVal('income', 'financeCost', d.year, d.financeCost)}
                    isEditMode={isEditMode}
                    onSave={(val) => onUpdateValue('income', 'financeCost', d.year, val)}
                    isNegative
                  />
                </td>
              ))}
            </tr>

            <tr className="font-bold text-slate-100">
              <td className="py-2.5 px-4 font-sans">
                <EditableLabel
                  label={getLbl('income', 'profitBeforeTax', 'Profit Before Tax (EBT)')}
                  isEditMode={isEditMode}
                  onSave={(lbl) => onUpdateLabel('income', 'profitBeforeTax', lbl)}
                />
              </td>
              {incomeData.map(d => (
                <td key={d.year} className="py-2.5 px-3 text-right">
                  <EditableCell
                    val={getVal('income', 'profitBeforeTax', d.year, d.profitBeforeTax)}
                    isEditMode={isEditMode}
                    onSave={(val) => onUpdateValue('income', 'profitBeforeTax', d.year, val)}
                  />
                </td>
              ))}
            </tr>

            <tr className="bg-emerald-950/40 font-bold text-emerald-400 border-t-2 border-emerald-600">
              <td className="py-3 px-4 font-sans text-emerald-400 text-sm">
                <EditableLabel
                  label={getLbl('income', 'netProfit', 'Net Profit After Tax')}
                  isEditMode={isEditMode}
                  onSave={(lbl) => onUpdateLabel('income', 'netProfit', lbl)}
                />
              </td>
              {incomeData.map(d => (
                <td key={d.year} className="py-3 px-3 text-right text-emerald-400 text-sm">
                  <EditableCell
                    val={getVal('income', 'netProfit', d.year, d.netProfit)}
                    isEditMode={isEditMode}
                    onSave={(val) => onUpdateValue('income', 'netProfit', d.year, val)}
                  />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ----------------- BALANCE SHEET TABLE ----------------- //
function BalanceSheetTable({
  balanceData,
  currency,
  isEditMode,
  getVal,
  getLbl,
  onUpdateValue,
  onUpdateLabel,
}: {
  balanceData: BalanceSheetYear[];
  currency: string;
  isEditMode: boolean;
  getVal: (stmt: string, field: string, year: number, fallback: number) => number;
  getLbl: (stmt: string, field: string, defaultLabel: string) => string;
  onUpdateValue: (stmt: string, field: string, year: number, val: number) => void;
  onUpdateLabel: (stmt: string, field: string, newLabel: string) => void;
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-4 bg-slate-850 border-b border-slate-800">
        <h3 className="text-sm font-bold text-white">Statement of Financial Position (Balance Sheet)</h3>
        <p className="text-[11px] text-slate-400">All current assets, non-current assets, liabilities, and equity items are editable</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-800/80 text-slate-300 border-b border-slate-700 text-[11px]">
            <tr>
              <th className="py-3 px-4 font-sans font-semibold text-white">Item</th>
              {balanceData.map(d => (
                <th key={d.year} className="py-3 px-3 text-right">
                  {d.year} {d.isProjected ? '(P)' : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 tabular-nums">
            <tr className="bg-slate-800/40 font-sans font-bold text-sky-400">
              <td colSpan={balanceData.length + 1} className="py-2 px-4 uppercase text-[11px]">Current Assets</td>
            </tr>

            <tr>
              <td className="py-2 px-4 font-sans text-slate-200">
                <EditableLabel
                  label={getLbl('bs', 'cashAndEquivalents', 'Cash and Cash Equivalents')}
                  isEditMode={isEditMode}
                  onSave={(lbl) => onUpdateLabel('bs', 'cashAndEquivalents', lbl)}
                />
              </td>
              {balanceData.map(d => (
                <td key={d.year} className="py-2 px-3 text-right text-sky-300 font-medium">
                  <EditableCell
                    val={getVal('bs', 'cashAndEquivalents', d.year, d.cashAndEquivalents)}
                    isEditMode={isEditMode}
                    onSave={(val) => onUpdateValue('bs', 'cashAndEquivalents', d.year, val)}
                  />
                </td>
              ))}
            </tr>

            <tr>
              <td className="py-2 px-4 font-sans text-slate-300">
                <EditableLabel
                  label={getLbl('bs', 'tradeReceivables', 'Trade Receivables')}
                  isEditMode={isEditMode}
                  onSave={(lbl) => onUpdateLabel('bs', 'tradeReceivables', lbl)}
                />
              </td>
              {balanceData.map(d => (
                <td key={d.year} className="py-2 px-3 text-right">
                  <EditableCell
                    val={getVal('bs', 'tradeReceivables', d.year, d.tradeReceivables)}
                    isEditMode={isEditMode}
                    onSave={(val) => onUpdateValue('bs', 'tradeReceivables', d.year, val)}
                  />
                </td>
              ))}
            </tr>

            <tr>
              <td className="py-2 px-4 font-sans text-slate-300">
                <EditableLabel
                  label={getLbl('bs', 'closingInventory', 'Closing Inventory')}
                  isEditMode={isEditMode}
                  onSave={(lbl) => onUpdateLabel('bs', 'closingInventory', lbl)}
                />
              </td>
              {balanceData.map(d => (
                <td key={d.year} className="py-2 px-3 text-right">
                  <EditableCell
                    val={getVal('bs', 'closingInventory', d.year, d.closingInventory)}
                    isEditMode={isEditMode}
                    onSave={(val) => onUpdateValue('bs', 'closingInventory', d.year, val)}
                  />
                </td>
              ))}
            </tr>

            <tr className="bg-slate-800/30 font-semibold text-slate-100">
              <td className="py-2 px-4 font-sans">
                <EditableLabel
                  label={getLbl('bs', 'totalCurrentAssets', 'Total Current Assets')}
                  isEditMode={isEditMode}
                  onSave={(lbl) => onUpdateLabel('bs', 'totalCurrentAssets', lbl)}
                />
              </td>
              {balanceData.map(d => (
                <td key={d.year} className="py-2 px-3 text-right font-bold text-sky-300">
                  <EditableCell
                    val={getVal('bs', 'totalCurrentAssets', d.year, d.totalCurrentAssets)}
                    isEditMode={isEditMode}
                    onSave={(val) => onUpdateValue('bs', 'totalCurrentAssets', d.year, val)}
                  />
                </td>
              ))}
            </tr>

            <tr className="bg-slate-800/40 font-sans font-bold text-sky-400">
              <td colSpan={balanceData.length + 1} className="py-2 px-4 uppercase text-[11px]">Non-Current Assets</td>
            </tr>

            <tr>
              <td className="py-2 px-4 font-sans text-slate-200">
                <EditableLabel
                  label={getLbl('bs', 'propertyPlantEquipment', 'Property, Plant and Equipment (NBV)')}
                  isEditMode={isEditMode}
                  onSave={(lbl) => onUpdateLabel('bs', 'propertyPlantEquipment', lbl)}
                />
              </td>
              {balanceData.map(d => (
                <td key={d.year} className="py-2 px-3 text-right text-emerald-300">
                  <EditableCell
                    val={getVal('bs', 'propertyPlantEquipment', d.year, d.propertyPlantEquipment)}
                    isEditMode={isEditMode}
                    onSave={(val) => onUpdateValue('bs', 'propertyPlantEquipment', d.year, val)}
                  />
                </td>
              ))}
            </tr>

            <tr className="bg-sky-950/40 font-bold text-sky-400 border-t-2 border-sky-600">
              <td className="py-2.5 px-4 font-sans text-sm">
                <EditableLabel
                  label={getLbl('bs', 'totalAssets', 'TOTAL ASSETS')}
                  isEditMode={isEditMode}
                  onSave={(lbl) => onUpdateLabel('bs', 'totalAssets', lbl)}
                />
              </td>
              {balanceData.map(d => (
                <td key={d.year} className="py-2.5 px-3 text-right text-sm font-bold text-sky-400">
                  <EditableCell
                    val={getVal('bs', 'totalAssets', d.year, d.totalAssets)}
                    isEditMode={isEditMode}
                    onSave={(val) => onUpdateValue('bs', 'totalAssets', d.year, val)}
                  />
                </td>
              ))}
            </tr>

            {/* Liabilities */}
            <tr className="bg-slate-800/40 font-sans font-bold text-rose-400">
              <td colSpan={balanceData.length + 1} className="py-2 px-4 uppercase text-[11px]">Liabilities</td>
            </tr>

            <tr>
              <td className="py-2 px-4 font-sans text-slate-300">
                <EditableLabel
                  label={getLbl('bs', 'tradePayables', 'Trade Payables')}
                  isEditMode={isEditMode}
                  onSave={(lbl) => onUpdateLabel('bs', 'tradePayables', lbl)}
                />
              </td>
              {balanceData.map(d => (
                <td key={d.year} className="py-2 px-3 text-right">
                  <EditableCell
                    val={getVal('bs', 'tradePayables', d.year, d.tradePayables)}
                    isEditMode={isEditMode}
                    onSave={(val) => onUpdateValue('bs', 'tradePayables', d.year, val)}
                  />
                </td>
              ))}
            </tr>

            <tr>
              <td className="py-2 px-4 font-sans text-slate-300">
                <EditableLabel
                  label={getLbl('bs', 'longTermBorrowings', 'Long-Term Borrowings')}
                  isEditMode={isEditMode}
                  onSave={(lbl) => onUpdateLabel('bs', 'longTermBorrowings', lbl)}
                />
              </td>
              {balanceData.map(d => (
                <td key={d.year} className="py-2 px-3 text-right">
                  <EditableCell
                    val={getVal('bs', 'longTermBorrowings', d.year, d.longTermBorrowings)}
                    isEditMode={isEditMode}
                    onSave={(val) => onUpdateValue('bs', 'longTermBorrowings', d.year, val)}
                  />
                </td>
              ))}
            </tr>

            {/* Equity */}
            <tr className="bg-slate-800/40 font-sans font-bold text-teal-400">
              <td colSpan={balanceData.length + 1} className="py-2 px-4 uppercase text-[11px]">Shareholders Equity</td>
            </tr>

            <tr>
              <td className="py-2 px-4 font-sans text-slate-300">
                <EditableLabel
                  label={getLbl('bs', 'shareCapital', 'Share Capital')}
                  isEditMode={isEditMode}
                  onSave={(lbl) => onUpdateLabel('bs', 'shareCapital', lbl)}
                />
              </td>
              {balanceData.map(d => (
                <td key={d.year} className="py-2 px-3 text-right">
                  <EditableCell
                    val={getVal('bs', 'shareCapital', d.year, d.shareCapital)}
                    isEditMode={isEditMode}
                    onSave={(val) => onUpdateValue('bs', 'shareCapital', d.year, val)}
                  />
                </td>
              ))}
            </tr>

            <tr>
              <td className="py-2 px-4 font-sans text-slate-300">
                <EditableLabel
                  label={getLbl('bs', 'retainedEarnings', 'Retained Earnings')}
                  isEditMode={isEditMode}
                  onSave={(lbl) => onUpdateLabel('bs', 'retainedEarnings', lbl)}
                />
              </td>
              {balanceData.map(d => (
                <td key={d.year} className="py-2 px-3 text-right">
                  <EditableCell
                    val={getVal('bs', 'retainedEarnings', d.year, d.retainedEarnings)}
                    isEditMode={isEditMode}
                    onSave={(val) => onUpdateValue('bs', 'retainedEarnings', d.year, val)}
                  />
                </td>
              ))}
            </tr>

            <tr className="bg-slate-800 font-bold text-white border-t-2 border-slate-600">
              <td className="py-2.5 px-4 font-sans text-sm">
                <EditableLabel
                  label={getLbl('bs', 'totalLiabilitiesAndEquity', 'TOTAL LIABILITIES & EQUITY')}
                  isEditMode={isEditMode}
                  onSave={(lbl) => onUpdateLabel('bs', 'totalLiabilitiesAndEquity', lbl)}
                />
              </td>
              {balanceData.map(d => (
                <td key={d.year} className="py-2.5 px-3 text-right text-sm">
                  <EditableCell
                    val={getVal('bs', 'totalLiabilitiesAndEquity', d.year, d.totalLiabilitiesAndEquity)}
                    isEditMode={isEditMode}
                    onSave={(val) => onUpdateValue('bs', 'totalLiabilitiesAndEquity', d.year, val)}
                  />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ----------------- CHANGES IN EQUITY TABLE ----------------- //
function EquityStatementTable({
  equityData,
  currency,
  isEditMode,
  getVal,
  getLbl,
  onUpdateValue,
  onUpdateLabel,
}: {
  equityData: EquityStatementYear[];
  currency: string;
  isEditMode: boolean;
  getVal: (stmt: string, field: string, year: number, fallback: number) => number;
  getLbl: (stmt: string, field: string, defaultLabel: string) => string;
  onUpdateValue: (stmt: string, field: string, year: number, val: number) => void;
  onUpdateLabel: (stmt: string, field: string, newLabel: string) => void;
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-4 bg-slate-850 border-b border-slate-800">
        <h3 className="text-sm font-bold text-white">Statement of Changes in Equity</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-800/80 text-slate-300 border-b border-slate-700 text-[11px]">
            <tr>
              <th className="py-3 px-4 font-sans font-semibold text-white">Component</th>
              {equityData.map(d => (
                <th key={d.year} className="py-3 px-3 text-right">
                  {d.year} {d.isProjected ? '(P)' : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 tabular-nums">
            <tr>
              <td className="py-2 px-4 font-sans text-slate-300">
                <EditableLabel
                  label={getLbl('eq', 'openingShareCapital', 'Opening Share Capital')}
                  isEditMode={isEditMode}
                  onSave={(lbl) => onUpdateLabel('eq', 'openingShareCapital', lbl)}
                />
              </td>
              {equityData.map(d => (
                <td key={d.year} className="py-2 px-3 text-right">
                  <EditableCell
                    val={getVal('eq', 'openingShareCapital', d.year, d.openingShareCapital)}
                    isEditMode={isEditMode}
                    onSave={(val) => onUpdateValue('eq', 'openingShareCapital', d.year, val)}
                  />
                </td>
              ))}
            </tr>

            <tr>
              <td className="py-2 px-4 font-sans text-slate-400 pl-6">
                <EditableLabel
                  label={getLbl('eq', 'shareCapitalIssued', 'Share Capital Issued during Year')}
                  isEditMode={isEditMode}
                  onSave={(lbl) => onUpdateLabel('eq', 'shareCapitalIssued', lbl)}
                />
              </td>
              {equityData.map(d => (
                <td key={d.year} className="py-2 px-3 text-right">
                  <EditableCell
                    val={getVal('eq', 'shareCapitalIssued', d.year, d.shareCapitalIssued)}
                    isEditMode={isEditMode}
                    onSave={(val) => onUpdateValue('eq', 'shareCapitalIssued', d.year, val)}
                  />
                </td>
              ))}
            </tr>

            <tr>
              <td className="py-2 px-4 font-sans text-slate-400 pl-6">
                <EditableLabel
                  label={getLbl('eq', 'netProfitForYear', 'Net Profit for the Year')}
                  isEditMode={isEditMode}
                  onSave={(lbl) => onUpdateLabel('eq', 'netProfitForYear', lbl)}
                />
              </td>
              {equityData.map(d => (
                <td key={d.year} className="py-2 px-3 text-right text-emerald-400">
                  <EditableCell
                    val={getVal('eq', 'netProfitForYear', d.year, d.netProfitForYear)}
                    isEditMode={isEditMode}
                    onSave={(val) => onUpdateValue('eq', 'netProfitForYear', d.year, val)}
                  />
                </td>
              ))}
            </tr>

            <tr>
              <td className="py-2 px-4 font-sans text-slate-400 pl-6">
                <EditableLabel
                  label={getLbl('eq', 'dividendsPaid', 'Dividends Paid to Shareholders')}
                  isEditMode={isEditMode}
                  onSave={(lbl) => onUpdateLabel('eq', 'dividendsPaid', lbl)}
                />
              </td>
              {equityData.map(d => (
                <td key={d.year} className="py-2 px-3 text-right text-rose-300">
                  <EditableCell
                    val={getVal('eq', 'dividendsPaid', d.year, d.dividendsPaid)}
                    isEditMode={isEditMode}
                    onSave={(val) => onUpdateValue('eq', 'dividendsPaid', d.year, val)}
                    isNegative
                  />
                </td>
              ))}
            </tr>

            <tr className="bg-emerald-950/40 font-bold text-emerald-400 border-t-2 border-emerald-600 text-sm">
              <td className="py-3 px-4 font-sans">
                <EditableLabel
                  label={getLbl('eq', 'totalClosingEquity', 'TOTAL CLOSING SHAREHOLDERS EQUITY')}
                  isEditMode={isEditMode}
                  onSave={(lbl) => onUpdateLabel('eq', 'totalClosingEquity', lbl)}
                />
              </td>
              {equityData.map(d => (
                <td key={d.year} className="py-3 px-3 text-right">
                  <EditableCell
                    val={getVal('eq', 'totalClosingEquity', d.year, d.totalClosingEquity)}
                    isEditMode={isEditMode}
                    onSave={(val) => onUpdateValue('eq', 'totalClosingEquity', d.year, val)}
                  />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ----------------- SCHEDULE OF FIXED ASSETS TABLE ----------------- //
function FixedAssetsScheduleTable({
  fixedAssetsData,
  currency,
  isEditMode,
  onUpdateCategory,
}: {
  fixedAssetsData: ScheduleOfFixedAssetsYear[];
  currency: string;
  isEditMode: boolean;
  onUpdateCategory: (catIndex: number, field: string, val: number | string) => void;
}) {
  const latest = fixedAssetsData[fixedAssetsData.length - 1];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm space-y-4">
      <div className="p-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white">Schedule of Fixed Assets (Property, Plant & Equipment)</h3>
          <p className="text-[11px] text-slate-400">All categories, additions, disposals, and depreciation figures are editable</p>
        </div>
        <span className="text-xs text-emerald-400 font-semibold font-mono">
          Reporting Cycle: {latest.year} {latest.isProjected ? '(Projected)' : '(Historical)'}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-800/80 text-slate-300 border-b border-slate-700 text-[11px]">
            <tr>
              <th className="py-3 px-4 font-sans font-semibold text-white">Asset Class</th>
              <th className="py-3 px-2 text-right">Dep %</th>
              <th className="py-3 px-3 text-right">Opening Cost</th>
              <th className="py-3 px-3 text-right text-emerald-400">Additions</th>
              <th className="py-3 px-3 text-right text-rose-300">Disposals</th>
              <th className="py-3 px-3 text-right text-white">Closing Cost</th>
              <th className="py-3 px-3 text-right">Opening Dep</th>
              <th className="py-3 px-3 text-right text-rose-300">Charge</th>
              <th className="py-3 px-3 text-right text-white">Closing Dep</th>
              <th className="py-3 px-4 text-right text-emerald-400 font-bold">Net Book Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 tabular-nums">
            {latest.categories.map((c, idx) => (
              <tr key={c.name} className="hover:bg-slate-800/30">
                <td className="py-2.5 px-4 font-sans text-slate-200 font-medium">
                  {isEditMode ? (
                    <input
                      type="text"
                      value={c.name}
                      onChange={(e) => onUpdateCategory(idx, 'name', e.target.value)}
                      className="bg-slate-950 border border-emerald-500/80 rounded px-1.5 py-0.5 text-xs text-white w-full"
                    />
                  ) : (
                    c.name
                  )}
                </td>
                <td className="py-2.5 px-2 text-right text-slate-400">{c.depRate}%</td>
                <td className="py-2.5 px-3 text-right text-slate-300">
                  <EditableCell
                    val={c.costOpening}
                    isEditMode={isEditMode}
                    onSave={(v) => onUpdateCategory(idx, 'costOpening', v)}
                  />
                </td>
                <td className="py-2.5 px-3 text-right text-emerald-400">
                  <EditableCell
                    val={c.additions}
                    isEditMode={isEditMode}
                    onSave={(v) => onUpdateCategory(idx, 'additions', v)}
                  />
                </td>
                <td className="py-2.5 px-3 text-right text-rose-300">
                  <EditableCell
                    val={c.disposals}
                    isEditMode={isEditMode}
                    onSave={(v) => onUpdateCategory(idx, 'disposals', v)}
                  />
                </td>
                <td className="py-2.5 px-3 text-right text-white font-semibold">
                  {c.costClosing.toLocaleString()}
                </td>
                <td className="py-2.5 px-3 text-right text-slate-400">
                  <EditableCell
                    val={c.depOpening}
                    isEditMode={isEditMode}
                    onSave={(v) => onUpdateCategory(idx, 'depOpening', v)}
                  />
                </td>
                <td className="py-2.5 px-3 text-right text-rose-300">
                  <EditableCell
                    val={c.depCharge}
                    isEditMode={isEditMode}
                    onSave={(v) => onUpdateCategory(idx, 'depCharge', v)}
                  />
                </td>
                <td className="py-2.5 px-3 text-right text-slate-300">
                  {c.depClosing.toLocaleString()}
                </td>
                <td className="py-2.5 px-4 text-right text-emerald-400 font-bold">
                  {c.netBookValue.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ----------------- NOTES VIEWER ----------------- //
function NotesViewer({
  notes,
  currency,
  isEditMode,
  onUpdateNotes,
}: {
  notes: FinancialNoteItem[];
  currency: string;
  isEditMode: boolean;
  onUpdateNotes: (updated: FinancialNoteItem[]) => void;
}) {
  const handleNoteTextChange = (noteNumber: number, text: string) => {
    onUpdateNotes(
      notes.map(n => n.noteNumber === noteNumber ? { ...n, textDescription: text } : n)
    );
  };

  const handleNoteTitleChange = (noteNumber: number, title: string) => {
    onUpdateNotes(
      notes.map(n => n.noteNumber === noteNumber ? { ...n, title } : n)
    );
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white">
            Notes to the Financial Statements (Notes 1 to 12)
          </h3>
          <p className="text-xs text-slate-400">
            Mandatory disclosures, accounting policies, and cash flow reconciliations (All editable)
          </p>
        </div>
        <span className="text-xs text-emerald-400 font-medium">12 Statutory Notes</span>
      </div>

      <div className="space-y-4">
        {notes.map(note => (
          <div key={note.noteNumber} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="text-xs font-bold text-white flex items-center gap-2 flex-1">
                <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center text-[10px] shrink-0">
                  {note.noteNumber}
                </span>
                {isEditMode ? (
                  <input
                    type="text"
                    value={note.title}
                    onChange={(e) => handleNoteTitleChange(note.noteNumber, e.target.value)}
                    className="bg-slate-950 border border-emerald-500/80 rounded px-2 py-0.5 text-xs font-bold text-white flex-1"
                  />
                ) : (
                  <span>Note {note.noteNumber}: {note.title}</span>
                )}
              </h4>
              <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded ml-2 shrink-0">
                {note.category}
              </span>
            </div>

            {isEditMode ? (
              <textarea
                value={note.textDescription}
                onChange={(e) => handleNoteTextChange(note.noteNumber, e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-emerald-500/80 rounded p-2 text-xs text-slate-200 font-sans focus:outline-none focus:ring-1 focus:ring-emerald-400"
              />
            ) : (
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {note.textDescription}
              </p>
            )}

            {note.tableData && (
              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-800/80 text-slate-300 text-[11px]">
                    <tr>
                      {note.tableData.headers.map((h, i) => (
                        <th key={i} className={`py-2 px-3 ${i === 0 ? 'text-left font-sans' : 'text-right'}`}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 tabular-nums">
                    {note.tableData.rows.map((r, ri) => (
                      <tr key={ri} className="hover:bg-slate-800/20">
                        <td className="py-2 px-3 font-sans text-slate-300">{r.label}</td>
                        {r.values.map((v, vi) => (
                          <td key={vi} className="py-2 px-3 text-right text-slate-200">{v}</td>
                        ))}
                      </tr>
                    ))}
                    {note.tableData.totalRow && (
                      <tr className="bg-slate-800/50 font-bold border-t border-slate-700">
                        <td className="py-2 px-3 font-sans text-white">{note.tableData.totalRow.label}</td>
                        {note.tableData.totalRow.values.map((v, vi) => (
                          <td key={vi} className="py-2 px-3 text-right text-emerald-400">{v}</td>
                        ))}
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ----------------- COMPLETE PACKAGE PREVIEW ----------------- //
function CompletePackagePreview({
  companyProfile,
  incomeData,
  balanceData,
  cashFlowData,
  equityData,
  fixedAssetsData,
  notes,
  onExportExcel,
  onExportWord,
  onExportPdf,
}: {
  companyProfile: CompanyProfile;
  incomeData: IncomeStatementYear[];
  balanceData: BalanceSheetYear[];
  cashFlowData: CashFlowStatementYear[];
  equityData: EquityStatementYear[];
  fixedAssetsData: ScheduleOfFixedAssetsYear[];
  notes: FinancialNoteItem[];
  onExportExcel: () => void;
  onExportWord: () => void;
  onExportPdf: () => void;
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">
            Section 76.11 Export Engine
          </span>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Export Complete Financial Statements Package
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Generate one master consolidated report containing all five standard financial statements, fixed assets schedule, and twelve notes. All edited figures and custom labels are preserved in the export.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onExportExcel}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Excel Workbook (6 Sheets)
          </button>
          <button
            onClick={onExportWord}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Word Document (.docx)
          </button>
          <button
            onClick={onExportPdf}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            PDF Package (.pdf)
          </button>
        </div>
      </div>

      {/* Package Contents Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
        <div className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-xl space-y-1">
          <span className="text-slate-200 font-bold block">1. Income Statement</span>
          <p className="text-slate-400">Revenue, cost of sales, operating expenses, EBIT, finance cost, and net profit.</p>
        </div>
        <div className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-xl space-y-1">
          <span className="text-slate-200 font-bold block">2. Balance Sheet</span>
          <p className="text-slate-400">Statement of Financial Position: Current & Non-Current Assets, Liabilities, and Equity.</p>
        </div>
        <div className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-xl space-y-1">
          <span className="text-slate-200 font-bold block">3. Statement of Cash Flows</span>
          <p className="text-slate-400">Indirect method, operating, capex investing, and directly entered financing cash flows.</p>
        </div>
        <div className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-xl space-y-1">
          <span className="text-slate-200 font-bold block">4. Statement of Changes in Equity</span>
          <p className="text-slate-400">Share capital movement, retained earnings, comprehensive reserves, and dividends.</p>
        </div>
        <div className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-xl space-y-1">
          <span className="text-slate-200 font-bold block">5. Schedule of Fixed Assets</span>
          <p className="text-slate-400">Category-wise gross carrying amounts, additions, disposals, depreciation, and NBV.</p>
        </div>
        <div className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-xl space-y-1">
          <span className="text-slate-200 font-bold block">6. Notes to Financials (1 to 12)</span>
          <p className="text-slate-400">Accounting policies, statutory disclosures, and cash flow balance sheet audit reconciliations.</p>
        </div>
      </div>
    </div>
  );
}
