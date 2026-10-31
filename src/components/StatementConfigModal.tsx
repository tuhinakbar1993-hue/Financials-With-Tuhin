import React, { useState } from 'react';
import { Settings, Plus, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, CheckSquare, Square, RefreshCw, Sparkles } from 'lucide-react';
import { StatementConfigItem } from '../types/financial';

interface StatementConfigViewProps {
  configItems: StatementConfigItem[];
  onUpdateConfig: (items: StatementConfigItem[]) => void;
  onResetDefaults: () => void;
}

export const StatementConfigView: React.FC<StatementConfigViewProps> = ({
  configItems,
  onUpdateConfig,
  onResetDefaults,
}) => {
  const [selectedSection, setSelectedSection] = useState<string>('All');
  const [newItemLabel, setNewItemLabel] = useState('');
  const [newItemSection, setNewItemSection] = useState('Operating Activities');
  const [previewActive, setPreviewActive] = useState(false);

  const sections = ['All', 'Operating Activities', 'Investing Activities', 'Financing Activities'];

  const filteredItems = configItems.filter(item => 
    selectedSection === 'All' ? true : item.section === selectedSection
  ).sort((a, b) => a.order - b.order);

  const toggleVisibility = (id: string) => {
    onUpdateConfig(
      configItems.map(item => {
        if (item.id === id) {
          if (item.isMandatory) return item; // protected
          return { ...item, isVisible: !item.isVisible };
        }
        return item;
      })
    );
  };

  const handleSelectAll = (select: boolean) => {
    onUpdateConfig(
      configItems.map(item => {
        if (item.isMandatory) return item;
        return { ...item, isVisible: select };
      })
    );
  };

  const handleLabelChange = (id: string, newLabel: string) => {
    onUpdateConfig(
      configItems.map(item => item.id === id ? { ...item, label: newLabel } : item)
    );
  };

  const handleMove = (id: string, direction: 'up' | 'down') => {
    const idx = configItems.findIndex(i => i.id === id);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= configItems.length) return;

    const newItems = [...configItems];
    const temp = newItems[idx];
    newItems[idx] = newItems[targetIdx];
    newItems[targetIdx] = temp;

    // re-index order
    const reindexed = newItems.map((item, i) => ({ ...item, order: i + 1 }));
    onUpdateConfig(reindexed);
  };

  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemLabel.trim()) return;

    const newItem: StatementConfigItem = {
      id: `custom_${Date.now()}`,
      statement: 'cashFlow',
      section: newItemSection,
      label: newItemLabel.trim(),
      isMandatory: false,
      isVisible: true,
      order: configItems.length + 1,
      isCustom: true,
    };

    onUpdateConfig([...configItems, newItem]);
    setNewItemLabel('');
  };

  const handleDeleteCustomItem = (id: string) => {
    onUpdateConfig(configItems.filter(i => i.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Configuration Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-slate-900 border border-slate-800 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Statement of Cash Flows Configuration Module
            </h2>
            <span className="text-[11px] font-semibold text-indigo-300 bg-indigo-950/60 border border-indigo-800/50 px-2 py-0.5 rounded-md">
              Section 76.6
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure line items, customize labels, reorder presentation, add sector-specific line items, and manage presentation subtotals. Mandatory accounting calculations remain protected.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onResetDefaults}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
        </div>
      </div>

      {/* Action Controls & Section Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-900/60 border border-slate-800 rounded-xl text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Activity Filter:</span>
          <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-lg border border-slate-700">
            {sections.map(sec => (
              <button
                key={sec}
                onClick={() => setSelectedSection(sec)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  selectedSection === sec
                    ? 'bg-emerald-600 text-white font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {sec}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSelectAll(true)}
            className="px-2.5 py-1 text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors flex items-center gap-1"
          >
            <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
            Select All
          </button>
          <button
            onClick={() => handleSelectAll(false)}
            className="px-2.5 py-1 text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors flex items-center gap-1"
          >
            <Square className="w-3.5 h-3.5 text-slate-400" />
            Deselect Optional
          </button>
        </div>
      </div>

      {/* Add Custom Item Widget */}
      <form onSubmit={handleAddCustomItem} className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-center gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-200 font-semibold shrink-0">
          <Plus className="w-4 h-4 text-emerald-400" />
          Add Custom Cash Flow Line:
        </div>
        <input
          type="text"
          placeholder="e.g. Movement in Sukuk Issuance Proceeds"
          value={newItemLabel}
          onChange={(e) => setNewItemLabel(e.target.value)}
          className="flex-1 w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
        <select
          value={newItemSection}
          onChange={(e) => setNewItemSection(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 shrink-0"
        >
          <option value="Operating Activities">Operating Activities</option>
          <option value="Investing Activities">Investing Activities</option>
          <option value="Financing Activities">Financing Activities</option>
        </select>
        <button
          type="submit"
          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors shrink-0"
        >
          Add Item
        </button>
      </form>

      {/* Item List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-300 border-b border-slate-700 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 w-12 text-center">Vis</th>
                <th className="py-3 px-4 w-16 text-center">Order</th>
                <th className="py-3 px-4">Statement Line Item Label</th>
                <th className="py-3 px-4 w-44">Activity Section</th>
                <th className="py-3 px-4 w-32">Classification</th>
                <th className="py-3 px-4 w-28 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredItems.map((item, idx) => (
                <tr 
                  key={item.id}
                  className={`hover:bg-slate-800/40 transition-colors ${!item.isVisible ? 'opacity-50 bg-slate-950/40' : ''}`}
                >
                  <td className="py-2.5 px-4 text-center">
                    <button
                      onClick={() => toggleVisibility(item.id)}
                      disabled={item.isMandatory}
                      title={item.isMandatory ? 'Mandatory item protected by accounting rules' : 'Toggle item visibility'}
                      className={`p-1 rounded-md transition-colors ${
                        item.isVisible 
                          ? 'text-emerald-400 hover:bg-emerald-950/40' 
                          : 'text-slate-500 hover:bg-slate-800'
                      } ${item.isMandatory ? 'cursor-not-allowed opacity-80' : ''}`}
                    >
                      {item.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </td>

                  <td className="py-2.5 px-4 text-center text-slate-400 font-mono">
                    {item.order}
                  </td>

                  <td className="py-2.5 px-4">
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => handleLabelChange(item.id, e.target.value)}
                      className="w-full bg-transparent hover:bg-slate-800 focus:bg-slate-800 border border-transparent focus:border-slate-700 rounded px-2 py-1 text-slate-100 font-medium transition-colors"
                    />
                  </td>

                  <td className="py-2.5 px-4">
                    <span className="text-[11px] text-slate-300">
                      {item.section}
                    </span>
                  </td>

                  <td className="py-2.5 px-4">
                    {item.isMandatory ? (
                      <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/50 border border-emerald-800/40 px-2 py-0.5 rounded">
                        Mandatory Protected
                      </span>
                    ) : item.isCustom ? (
                      <span className="text-[10px] font-semibold text-sky-400 bg-sky-950/50 border border-sky-800/40 px-2 py-0.5 rounded">
                        Custom User Item
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">
                        Configurable
                      </span>
                    )}
                  </td>

                  <td className="py-2.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleMove(item.id, 'up')}
                        disabled={idx === 0}
                        title="Move Up"
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-slate-800"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMove(item.id, 'down')}
                        disabled={idx === filteredItems.length - 1}
                        title="Move Down"
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-slate-800"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      {item.isCustom && (
                        <button
                          onClick={() => handleDeleteCustomItem(item.id)}
                          title="Delete Custom Item"
                          className="p-1 text-rose-400 hover:text-rose-300 rounded hover:bg-slate-800"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
