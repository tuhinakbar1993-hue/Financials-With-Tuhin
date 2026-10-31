/**
 * Financial Types & Data Contracts for Financials with Tuhin
 * Section 76 Compliant Architecture
 */

export type EntityType = 
  | 'manufacturing'
  | 'trading'
  | 'service'
  | 'banking_conventional'
  | 'banking_islamic'
  | 'nbfi'
  | 'real_estate'
  | 'healthcare'
  | 'education'
  | 'ngo';

export type AccountingFramework = 'IFRS' | 'US_GAAP' | 'LOCAL_GAAP';

export type CurrencySymbol = '$' | '€' | '£' | '৳' | 'AED' | '₹' | '¥';

export type MultiplierUnit = 'Units' | 'Thousands' | 'Millions' | 'Billions';

export interface CompanyProfile {
  companyName: string;
  tradingName?: string;
  registrationNumber: string;
  taxId: string;
  registeredAddress: string;
  reportingCurrency: CurrencySymbol;
  reportingUnit: MultiplierUnit;
  entityType: EntityType;
  accountingFramework: AccountingFramework;
  financialYearEnd: string; // e.g. "31 December"
  auditorName: string;
  preparedBy: string; // "Tuhin Akbar, Lead Financial Architect"
}

export interface YearDataInput {
  year: number;
  isProjected: boolean;
  
  // Mandatory User Inputs (Section 76.4 & User Addition)
  salesRevenue: number;
  netProfit: number;
  financeCost: number; // Mandatory year-wise separate entry
  cashFlowFromFinancing: number; // Mandatory year-wise separate direct entry
  repaymentOfBorrowings: number; // Mandatory Year-Wise User Input: Repayment of Borrowings & Financing
  fixedAssetsGross: number;
  fixedAssetsAdditions: number;
  fixedAssetsDisposals: number;
  depreciationRate: number; // in percentage e.g. 10
  
  // Working Capital & Operating Inputs
  costOfSales: number;
  operatingExpenses: number;
  taxRate: number; // percentage e.g. 25
  closingInventory: number;
  tradeReceivables: number;
  otherReceivables: number;
  tradePayables: number;
  otherPayables: number;
  
  // Cash & Balance Sheet Inputs
  cashAndEquivalentsBS: number; // Stated in Balance Sheet
  otherCurrentAssets: number;
  intangibleAssets: number;
  otherNonCurrentAssets: number;
  shortTermBorrowings: number;
  longTermBorrowings: number;
  shareCapital: number;
  retainedEarningsOpening?: number;
  dividendsPaid: number;
  
  // Sector-specific inputs
  bankingDeposits?: number;
  bankingLoansAndAdvances?: number;
  islamicFinancingAssets?: number;
  mudarabaDeposits?: number;

  // Optional Financing detailed breakdown (if user enters them)
  financingProceedsShares?: number;
  financingProceedsBorrowings?: number;
  financingRepaymentBorrowings?: number;
  financingDividendsPaid?: number;
  financingLeasePaid?: number;
}

export interface FixedAssetCategory {
  name: string;
  costOpening: number;
  additions: number;
  disposals: number;
  costClosing: number;
  depOpening: number;
  depCharge: number;
  depDisposals: number;
  depClosing: number;
  netBookValue: number;
  depRate: number;
}

export interface ScheduleOfFixedAssetsYear {
  year: number;
  isProjected: boolean;
  categories: FixedAssetCategory[];
  totalCostOpening: number;
  totalAdditions: number;
  totalDisposals: number;
  totalCostClosing: number;
  totalDepOpening: number;
  totalDepCharge: number;
  totalDepDisposals: number;
  totalDepClosing: number;
  totalNetBookValue: number;
}

export interface IncomeStatementYear {
  year: number;
  isProjected: boolean;
  revenue: number;
  costOfSales: number;
  grossProfit: number;
  operatingExpenses: number;
  depreciationExpense: number;
  operatingProfit: number; // EBIT
  interestIncome: number;
  financeCost: number; // Mandatory user entered
  profitBeforeTax: number; // EBT
  taxExpense: number;
  netProfit: number; // Net Profit after Tax
}

export interface BalanceSheetYear {
  year: number;
  isProjected: boolean;
  
  // Assets
  cashAndEquivalents: number;
  tradeReceivables: number;
  otherReceivables: number;
  closingInventory: number;
  otherCurrentAssets: number;
  totalCurrentAssets: number;
  
  propertyPlantEquipment: number; // NBV from Schedule
  intangibleAssets: number;
  otherNonCurrentAssets: number;
  totalNonCurrentAssets: number;
  totalAssets: number;
  
  // Liabilities
  tradePayables: number;
  otherPayables: number;
  shortTermBorrowings: number;
  currentTaxPayable: number;
  totalCurrentLiabilities: number;
  
  longTermBorrowings: number;
  otherNonCurrentLiabilities: number;
  totalNonCurrentLiabilities: number;
  totalLiabilities: number;
  
  // Equity
  shareCapital: number;
  retainedEarnings: number;
  reserves: number;
  totalEquity: number;
  
  totalLiabilitiesAndEquity: number;
  balanceCheck: number; // totalAssets - totalLiabilitiesAndEquity
}

export interface CashFlowStatementYear {
  year: number;
  isProjected: boolean;
  
  // A. Operating Activities (Indirect Method)
  profitBeforeTax: number;
  adjDepreciation: number;
  adjAmortization: number;
  adjFinanceCost: number;
  adjInterestIncome: number;
  adjLossGainDisposal: number;
  operatingProfitBeforeWC: number;
  
  changeInInventory: number;
  changeInReceivables: number;
  changeInOtherReceivables: number;
  changeInPayables: number;
  changeInOtherPayables: number;
  cashGeneratedFromOperations: number;
  
  incomeTaxPaid: number;
  financeCostPaid: number;
  netCashFromOperating: number;
  
  // B. Investing Activities
  purchasePPE: number;
  salePPE: number;
  purchaseIntangibles: number;
  interestReceived: number;
  dividendsReceived: number;
  netCashFromInvesting: number;
  
  // C. Financing Activities (User Directly Entered preserved)
  directlyEnteredFinancingCashFlow: number; // Mandatory user-entered
  financingProceedsShares: number;
  financingProceedsBorrowings: number;
  financingRepaymentBorrowings: number;
  repaymentOfBorrowings: number; // Repayment of Borrowings & Financing (Cash outflow)
  financingDividendsPaid: number;
  netCashFromFinancing: number;
  isFinancingBreakdownComplete: boolean;
  
  // D. Net Increase / Decrease in Cash & Reconciliation
  netChangeInCash: number;
  openingCash: number;
  closingCashCalculated: number;
  balanceSheetCash: number;
  reconciliationDifference: number; // closingCashCalculated - balanceSheetCash
  reconciliationStatus: 'RECONCILED' | 'VARIANCE_IDENTIFIED';
  reconciliationExplanation?: string;
}

export interface EquityStatementYear {
  year: number;
  isProjected: boolean;
  openingShareCapital: number;
  shareCapitalIssued: number;
  closingShareCapital: number;
  
  openingRetainedEarnings: number;
  netProfitForYear: number;
  dividendsPaid: number;
  closingRetainedEarnings: number;
  
  openingReserves: number;
  otherComprehensiveIncome: number;
  closingReserves: number;
  
  totalOpeningEquity: number;
  totalClosingEquity: number;
}

export interface FinancialNoteItem {
  noteNumber: number;
  title: string;
  category: string;
  textDescription: string;
  tableData?: {
    headers: string[];
    rows: { label: string; values: (string | number)[] }[];
    totalRow?: { label: string; values: (string | number)[] };
  };
}

export interface StatementConfigItem {
  id: string;
  statement: 'income' | 'balanceSheet' | 'cashFlow' | 'equity' | 'fixedAssets';
  section: string;
  label: string;
  isMandatory: boolean;
  isVisible: boolean;
  order: number;
  isCustom?: boolean;
}

export interface ProjectionAssumptions {
  historicalYearsCount: number; // default 3
  projectedYearsCount: number; // default 15
  revenueGrowthRate: number; // % e.g. 8.5
  grossMarginPct: number; // % e.g. 38.0
  opexPctOfRevenue: number; // % e.g. 18.0
  taxRatePct: number; // % e.g. 25.0
  capexPctOfRevenue: number; // % e.g. 6.0
  depreciationRatePct: number; // % e.g. 10.0
  receivableDays: number; // DSO e.g. 45
  inventoryDays: number; // DIO e.g. 60
  payableDays: number; // DPO e.g. 40
  dividendPayoutRatio: number; // % e.g. 30
  projectedFinancingCashFlowGrowth: number; // % e.g. -5% (deleveraging)
}

export type StatementCellOverrides = Record<string, Record<number, number>>;
export type StatementLabelOverrides = Record<string, string>;
