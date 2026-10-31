/**
 * Financials with Tuhin
 * Section 76: Statement of Cash Flows and Expanded Financial Statement Generation & Export Facility
 * Lead Developer & Financial Architect: Mohammad Towhidul Akbar Tuhin
 * Officer, Sammilito Islami Bank PLC (Transferee of Assets & Liabilities of Union Bank PLC)
 * BBA, Heriot Watt University, UK · MBA, University of Chittagong
 */

import React, { useState, useMemo } from 'react';
import { HeaderNav } from './components/HeaderNav';
import { DeveloperFirstLookCard } from './components/DeveloperFirstLookCard';
import { StatementsViewer } from './components/StatementsViewer';
import { FinancialDataEntry } from './components/FinancialDataEntry';
import { StatementConfigView } from './components/StatementConfigModal';
import { ProjectionEngineView } from './components/ProjectionEngineView';
import { CashFlowReconciliationAudit } from './components/CashFlowReconciliationAudit';
import { CompanyProfileModal } from './components/CompanyProfileModal';
import { DeveloperProfileModal } from './components/DeveloperProfileModal';
import {
  INITIAL_COMPANY_PROFILE,
  DEFAULT_PROJECTION_ASSUMPTIONS,
  INITIAL_HISTORICAL_INPUTS,
  DEFAULT_STATEMENT_CONFIG_ITEMS,
  generateProjectedYears,
  calculateScheduleOfFixedAssets,
  calculateIncomeStatement,
  calculateCashFlowStatement,
  calculateEquityStatement,
  calculateBalanceSheet,
  generateNotesToFinancialStatements,
} from './services/financialEngine';
import {
  exportCompletePackageExcel,
  exportCompletePackageWord,
  exportCompletePackagePdf,
} from './services/exportService';
import {
  CompanyProfile,
  YearDataInput,
  ProjectionAssumptions,
  StatementConfigItem,
  StatementCellOverrides,
  StatementLabelOverrides,
  FinancialNoteItem,
} from './types/financial';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('statements');
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>(INITIAL_COMPANY_PROFILE);
  const [assumptions, setAssumptions] = useState<ProjectionAssumptions>(DEFAULT_PROJECTION_ASSUMPTIONS);
  const [historicalInputs, setHistoricalInputs] = useState<YearDataInput[]>(INITIAL_HISTORICAL_INPUTS);
  const [customProjectedOverrides, setCustomProjectedOverrides] = useState<Record<number, YearDataInput>>({});
  const [statementConfig, setStatementConfig] = useState<StatementConfigItem[]>(DEFAULT_STATEMENT_CONFIG_ITEMS);

  // Statement-level cell & label overrides for universal inline editing
  const [cellOverrides, setCellOverrides] = useState<StatementCellOverrides>({});
  const [labelOverrides, setLabelOverrides] = useState<StatementLabelOverrides>({});
  const [customNotes, setCustomNotes] = useState<FinancialNoteItem[] | null>(null);

  // Modals state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isDeveloperModalOpen, setIsDeveloperModalOpen] = useState(false);

  // Derived: Generate Projected Years based on user's selected projectedYearsCount
  const baseYearInput = historicalInputs[historicalInputs.length - 1];
  const generatedProjected = useMemo(() => {
    const raw = generateProjectedYears(baseYearInput, assumptions);
    return raw.map(y => customProjectedOverrides[y.year] || y);
  }, [baseYearInput, assumptions, customProjectedOverrides]);

  // Combined All Years (Historical + Projected)
  const allYearsInputs = useMemo(() => {
    return [...historicalInputs, ...generatedProjected];
  }, [historicalInputs, generatedProjected]);

  // Five Standard Financial Statements + Schedule of Fixed Assets Calculations
  const fixedAssetsSchedule = useMemo(() => {
    return calculateScheduleOfFixedAssets(allYearsInputs);
  }, [allYearsInputs]);

  const incomeStatements = useMemo(() => {
    return calculateIncomeStatement(allYearsInputs, fixedAssetsSchedule);
  }, [allYearsInputs, fixedAssetsSchedule]);

  const cashFlowStatements = useMemo(() => {
    return calculateCashFlowStatement(allYearsInputs, incomeStatements, fixedAssetsSchedule);
  }, [allYearsInputs, incomeStatements, fixedAssetsSchedule]);

  const equityStatements = useMemo(() => {
    return calculateEquityStatement(allYearsInputs, incomeStatements);
  }, [allYearsInputs, incomeStatements]);

  const balanceSheets = useMemo(() => {
    return calculateBalanceSheet(allYearsInputs, equityStatements, fixedAssetsSchedule, cashFlowStatements);
  }, [allYearsInputs, equityStatements, fixedAssetsSchedule, cashFlowStatements]);

  const defaultNotes = useMemo(() => {
    return generateNotesToFinancialStatements(
      companyProfile,
      allYearsInputs.map(y => y.year),
      incomeStatements,
      balanceSheets,
      cashFlowStatements,
      fixedAssetsSchedule
    );
  }, [companyProfile, allYearsInputs, incomeStatements, balanceSheets, cashFlowStatements, fixedAssetsSchedule]);

  const effectiveNotes = customNotes || defaultNotes;

  // Handler: Update Year Input
  const handleUpdateYearData = (updated: YearDataInput) => {
    if (!updated.isProjected) {
      setHistoricalInputs(prev => prev.map(y => y.year === updated.year ? updated : y));
    } else {
      setCustomProjectedOverrides(prev => ({
        ...prev,
        [updated.year]: updated,
      }));
    }
  };

  // Handler: Direct inline editing of ANY statement cell value
  const handleUpdateStatementValue = (statement: string, field: string, year: number, val: number) => {
    const key = `${statement}_${field}`;
    setCellOverrides(prev => ({
      ...prev,
      [key]: {
        ...(prev[key] || {}),
        [year]: val,
      },
    }));

    // Feed back into the core calculation engine if this corresponds to an underlying financial parameter
    const fieldMapping: Record<string, keyof YearDataInput> = {
      'revenue': 'salesRevenue',
      'salesRevenue': 'salesRevenue',
      'costOfSales': 'costOfSales',
      'operatingExpenses': 'operatingExpenses',
      'financeCost': 'financeCost',
      'adjFinanceCost': 'financeCost',
      'netProfit': 'netProfit',
      'cashFlowFromFinancing': 'cashFlowFromFinancing',
      'directlyEnteredFinancingCashFlow': 'cashFlowFromFinancing',
      'repaymentOfBorrowings': 'repaymentOfBorrowings',
      'financingRepaymentBorrowings': 'repaymentOfBorrowings',
      'financingProceedsBorrowings': 'financingProceedsBorrowings',
      'financingProceedsShares': 'financingProceedsShares',
      'purchasePPE': 'fixedAssetsAdditions',
      'salePPE': 'fixedAssetsDisposals',
      'closingInventory': 'closingInventory',
      'tradeReceivables': 'tradeReceivables',
      'otherReceivables': 'otherReceivables',
      'tradePayables': 'tradePayables',
      'otherPayables': 'otherPayables',
      'cashAndEquivalents': 'cashAndEquivalentsBS',
      'balanceSheetCash': 'cashAndEquivalentsBS',
      'shortTermBorrowings': 'shortTermBorrowings',
      'longTermBorrowings': 'longTermBorrowings',
      'shareCapital': 'shareCapital',
      'dividendsPaid': 'dividendsPaid',
    };

    const targetField = fieldMapping[field];
    if (targetField) {
      const yearObj = allYearsInputs.find(y => y.year === year);
      if (yearObj) {
        const updatedYear: YearDataInput = {
          ...yearObj,
          [targetField]: field === 'purchasePPE' || field === 'dividendsPaid' ? Math.abs(val) : val,
        };

        // When Repayment of Borrowings is modified, cascade to Financing Cash Flow, Debt and Interest Cost
        if (targetField === 'repaymentOfBorrowings') {
          const absVal = Math.abs(val);
          const diff = absVal - (yearObj.repaymentOfBorrowings || 0);
          updatedYear.repaymentOfBorrowings = absVal;
          updatedYear.financingRepaymentBorrowings = -absVal;
          updatedYear.cashFlowFromFinancing = 
            (updatedYear.financingProceedsShares || 0) + 
            (updatedYear.financingProceedsBorrowings || 0) - 
            absVal - 
            updatedYear.dividendsPaid;
          updatedYear.longTermBorrowings = Math.max(0, (yearObj.longTermBorrowings || 0) - diff);
          updatedYear.cashAndEquivalentsBS = Math.max(0, (yearObj.cashAndEquivalentsBS || 0) - diff);
          updatedYear.financeCost = Math.max(200, Math.round((updatedYear.longTermBorrowings + updatedYear.shortTermBorrowings) * 0.085));
        }

        handleUpdateYearData(updatedYear);
      }
    }
  };

  // Handler: Direct inline editing of ANY statement item label
  const handleUpdateStatementLabel = (statement: string, field: string, newLabel: string) => {
    setLabelOverrides(prev => ({
      ...prev,
      [`${statement}_${field}`]: newLabel,
    }));
  };

  // Reset all custom overrides back to pure calculation engine defaults
  const handleResetOverrides = () => {
    setCellOverrides({});
    setLabelOverrides({});
    setCustomNotes(null);
  };

  // Handler: Export Complete Package
  const handleExportPackageExcel = () => {
    exportCompletePackageExcel(
      companyProfile,
      incomeStatements,
      balanceSheets,
      cashFlowStatements,
      equityStatements,
      fixedAssetsSchedule,
      effectiveNotes
    );
  };

  const handleExportPackageWord = () => {
    exportCompletePackageWord(
      companyProfile,
      incomeStatements,
      balanceSheets,
      cashFlowStatements,
      equityStatements,
      fixedAssetsSchedule,
      effectiveNotes
    );
  };

  const handleExportPackagePdf = () => {
    exportCompletePackagePdf(
      companyProfile,
      incomeStatements,
      balanceSheets,
      cashFlowStatements,
      equityStatements,
      fixedAssetsSchedule,
      effectiveNotes
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* 3-Zone Header Contract */}
      <HeaderNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        companyProfile={companyProfile}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenDeveloperModal={() => setIsDeveloperModalOpen(true)}
        onExportPackageExcel={handleExportPackageExcel}
        onExportPackageWord={handleExportPackageWord}
        onExportPackagePdf={handleExportPackagePdf}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* First Look Developer Showcase Card with Interactive Horizon Controller */}
        <DeveloperFirstLookCard
          assumptions={assumptions}
          onUpdateAssumptions={setAssumptions}
          onOpenDeveloperModal={() => setIsDeveloperModalOpen(true)}
          companyProfile={companyProfile}
          baseYear={baseYearInput.year}
        />

        {activeTab === 'statements' && (
          <StatementsViewer
            companyProfile={companyProfile}
            incomeData={incomeStatements}
            balanceData={balanceSheets}
            cashFlowData={cashFlowStatements}
            equityData={equityStatements}
            fixedAssetsData={fixedAssetsSchedule}
            notes={effectiveNotes}
            statementConfig={statementConfig}
            assumptions={assumptions}
            onUpdateAssumptions={setAssumptions}
            cellOverrides={cellOverrides}
            labelOverrides={labelOverrides}
            onUpdateStatementValue={handleUpdateStatementValue}
            onUpdateStatementLabel={handleUpdateStatementLabel}
            onResetOverrides={handleResetOverrides}
            onUpdateNotes={setCustomNotes}
          />
        )}

        {activeTab === 'data-entry' && (
          <FinancialDataEntry
            yearsData={allYearsInputs}
            onUpdateYearData={handleUpdateYearData}
            companyProfile={companyProfile}
          />
        )}

        {activeTab === 'configuration' && (
          <StatementConfigView
            configItems={statementConfig}
            onUpdateConfig={setStatementConfig}
            onResetDefaults={() => setStatementConfig(DEFAULT_STATEMENT_CONFIG_ITEMS)}
          />
        )}

        {activeTab === 'projections' && (
          <ProjectionEngineView
            assumptions={assumptions}
            onUpdateAssumptions={setAssumptions}
            onApplyAndRecalculate={() => setActiveTab('statements')}
            onResetDefaults={() => setAssumptions(DEFAULT_PROJECTION_ASSUMPTIONS)}
          />
        )}

        {activeTab === 'reconciliation' && (
          <CashFlowReconciliationAudit
            cashFlowYears={cashFlowStatements}
            balanceSheetYears={balanceSheets}
            companyProfile={companyProfile}
          />
        )}
      </main>

      {/* Modals */}
      <CompanyProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={companyProfile}
        onSave={setCompanyProfile}
      />

      <DeveloperProfileModal
        isOpen={isDeveloperModalOpen}
        onClose={() => setIsDeveloperModalOpen(false)}
      />

      {/* Quiet Professional Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">Financials with Tuhin</span>
            <span aria-hidden="true">·</span>
            <span>Section 76 Compliance Architecture</span>
            <span aria-hidden="true">·</span>
            <span>Five Standard Statements & Notes</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setIsDeveloperModalOpen(true)}
              className="text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Developer: Mohammad Towhidul Akbar Tuhin (Officer, Sammilito Islami Bank PLC)
            </button>
            <span aria-hidden="true">·</span>
            <span>BBA (Heriot-Watt, UK) · MBA (CU)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
