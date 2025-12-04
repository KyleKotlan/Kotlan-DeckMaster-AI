import React from 'react';
import { DeckDimensions, DeckMaterial } from '../types';
import { MATERIAL_OPTIONS } from '../constants';
import { Ruler, ArrowUpFromLine, Trees, MessageSquarePlus } from 'lucide-react';

interface InputFormProps {
  dimensions: DeckDimensions;
  onChange: (newDimensions: DeckDimensions) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ dimensions, onChange, onSubmit, isLoading }) => {
  
  const handleChange = (field: keyof DeckDimensions, value: any) => {
    onChange({
      ...dimensions,
      [field]: value
    });
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="border-b border-slate-100 pb-4 mb-4">
        <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
          <Ruler className="w-5 h-5 text-blue-600" />
          Dimensions
        </h2>
        <p className="text-sm text-slate-500 mt-1">Define the size of your dream deck.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Length Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Length (ft)</label>
          <div className="relative">
            <input
              type="number"
              min="4"
              max="100"
              value={dimensions.length}
              onChange={(e) => handleChange('length', Number(e.target.value))}
              className="w-full pl-3 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            <span className="absolute right-3 top-2 text-slate-400 text-sm">ft</span>
          </div>
          <input 
            type="range" 
            min="4" 
            max="40" 
            value={dimensions.length} 
            onChange={(e) => handleChange('length', Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        {/* Width Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Width (ft)</label>
          <div className="relative">
            <input
              type="number"
              min="4"
              max="100"
              value={dimensions.width}
              onChange={(e) => handleChange('width', Number(e.target.value))}
              className="w-full pl-3 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            <span className="absolute right-3 top-2 text-slate-400 text-sm">ft</span>
          </div>
          <input 
            type="range" 
            min="4" 
            max="30" 
            value={dimensions.width} 
            onChange={(e) => handleChange('width', Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-50">
        {/* Height Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
             <ArrowUpFromLine className="w-4 h-4 text-slate-400" />
             Height Off Ground (in)
          </label>
          <div className="relative">
            <input
              type="number"
              min="4"
              max="120"
              value={dimensions.height}
              onChange={(e) => handleChange('height', Number(e.target.value))}
              className="w-full pl-3 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            <span className="absolute right-3 top-2 text-slate-400 text-sm">in</span>
          </div>
          <p className="text-xs text-slate-500">Heights &gt; 30in typically require railings.</p>
        </div>

        {/* Material Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
            <Trees className="w-4 h-4 text-slate-400" />
            Deck Surface
          </label>
          <select
            value={dimensions.material}
            onChange={(e) => handleChange('material', e.target.value as DeckMaterial)}
            className="w-full pl-3 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
          >
            {MATERIAL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2 pt-4 border-t border-slate-50">
        <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
          <MessageSquarePlus className="w-4 h-4 text-slate-400" />
          Additional Details (Optional)
        </label>
        <textarea
          value={dimensions.additionalDetails || ''}
          onChange={(e) => handleChange('additionalDetails', e.target.value)}
          placeholder="e.g., I want a wrap-around staircase, a spot for a hot tub, or picture frame border."
          className="w-full pl-3 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all min-h-[80px]"
        />
      </div>

      <div className="pt-4">
        <button
          onClick={onSubmit}
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-lg text-white font-medium text-lg shadow-md transition-all flex items-center justify-center gap-2
            ${isLoading 
              ? 'bg-slate-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:transform active:scale-[0.98]'
            }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Calculating Materials...
            </>
          ) : (
            'Generate Material List'
          )}
        </button>
      </div>
    </div>
  );
};

export default InputForm;