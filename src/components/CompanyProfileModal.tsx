import React, { useState } from 'react';
import { X, Building2, Globe, Check } from 'lucide-react';
import { CompanyProfile, EntityType, AccountingFramework, CurrencySymbol, MultiplierUnit } from '../types/financial';
import { COMPANY_TYPE_TEMPLATES } from '../services/financialEngine';

interface CompanyProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CompanyProfile;
  onSave: (updated: CompanyProfile) => void;
}

export const CompanyProfileModal: React.FC<CompanyProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  const [formData, setFormData] = useState<CompanyProfile>(profile);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Reporting Entity & Accounting Configuration
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-200">Company Legal Name *</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-200">Trading / Brand Name</label>
              <input
                type="text"
                value={formData.tradingName || ''}
                onChange={(e) => setFormData({ ...formData, tradingName: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-200">Registration / Incorporated No.</label>
              <input
                type="text"
                value={formData.registrationNumber}
                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-200">Tax Identification Number (TIN)</label>
              <input
                type="text"
                value={formData.taxId}
                onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="font-semibold text-slate-200">Registered Corporate Address *</label>
              <input
                type="text"
                value={formData.registeredAddress}
                onChange={(e) => setFormData({ ...formData, registeredAddress: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-200">Entity Type (Section 76.5) *</label>
              <select
                value={formData.entityType}
                onChange={(e) => setFormData({ ...formData, entityType: e.target.value as EntityType })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {Object.entries(COMPANY_TYPE_TEMPLATES).map(([key, item]) => (
                  <option key={key} value={key}>{item.title}</option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400">
                {COMPANY_TYPE_TEMPLATES[formData.entityType]?.desc}
              </p>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-200">Accounting Framework *</label>
              <select
                value={formData.accountingFramework}
                onChange={(e) => setFormData({ ...formData, accountingFramework: e.target.value as AccountingFramework })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="IFRS">IFRS / IAS 7 (International Financial Reporting Standards)</option>
                <option value="US_GAAP">US GAAP / ASC 230 (Financial Accounting Standards)</option>
                <option value="LOCAL_GAAP">Local Statutory GAAP / National Accounting Standards</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-200">Reporting Currency</label>
              <select
                value={formData.reportingCurrency}
                onChange={(e) => setFormData({ ...formData, reportingCurrency: e.target.value as CurrencySymbol })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="$">US Dollar ($ USD)</option>
                <option value="€">Euro (€ EUR)</option>
                <option value="£">British Pound (£ GBP)</option>
                <option value="৳">Bangladeshi Taka (৳ BDT)</option>
                <option value="AED">UAE Dirham (AED)</option>
                <option value="₹">Indian Rupee (₹ INR)</option>
                <option value="¥">Japanese Yen (¥ JPY)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-200">Unit of Presentation</label>
              <select
                value={formData.reportingUnit}
                onChange={(e) => setFormData({ ...formData, reportingUnit: e.target.value as MultiplierUnit })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="Units">Exact Units (1)</option>
                <option value="Thousands">In Thousands (000)</option>
                <option value="Millions">In Millions (M)</option>
                <option value="Billions">In Billions (B)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-200">Financial Year End</label>
              <input
                type="text"
                value={formData.financialYearEnd}
                onChange={(e) => setFormData({ ...formData, financialYearEnd: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="e.g. 31 December"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-200">Independent Statutory Auditors</label>
              <input
                type="text"
                value={formData.auditorName}
                onChange={(e) => setFormData({ ...formData, auditorName: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors font-medium flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Save Entity Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
