import React from 'react';
import { MaterialCategory } from '../types';
import { ClipboardList, CheckCircle2, Hammer } from 'lucide-react';

interface MaterialListProps {
  materials: MaterialCategory[] | null;
}

const MaterialList: React.FC<MaterialListProps> = ({ materials }) => {
  if (!materials) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 p-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
        <Hammer className="w-16 h-16 mb-4 opacity-20" />
        <p className="text-lg font-medium">Ready to Build?</p>
        <p className="text-sm">Enter your dimensions and click Generate to see your Bill of Materials.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-green-600" />
          Bill of Materials
        </h2>
        <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">AI Generated</span>
      </div>

      <div className="space-y-6">
        {materials.map((category, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-100">
              <h3 className="font-semibold text-slate-700">{category.categoryName}</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {category.items.map((item, itemIdx) => (
                <div key={itemIdx} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-slate-300 mt-0.5 flex-shrink-0" />
                        <span className="font-medium text-slate-800">{item.name}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 ml-6">{item.notes}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="block text-lg font-bold text-blue-600">{item.quantity}</span>
                      <span className="text-xs text-slate-400 uppercase font-medium">{item.unit}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800">
        <strong>Note:</strong> These are AI-generated estimates based on general building practices. Always verify with local building codes and a professional engineer before purchasing materials or starting construction.
      </div>
    </div>
  );
};

export default MaterialList;
