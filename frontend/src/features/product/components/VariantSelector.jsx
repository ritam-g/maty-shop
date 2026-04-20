import React from 'react';
import VariantCard from './VariantCard';

const VariantSelector = ({ variants, selectedVariantId, onSelect }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white tracking-tight">Available Variants</h2>
          <p className="text-slate-500 text-xs font-medium">Select a variant to view or manage details</p>
        </div>
        <span className="px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {variants?.length || 0} Total
        </span>
      </div>
      
      {variants && variants.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          {variants.map((variant, index) => (
            <VariantCard 
              key={variant._id || index} 
              variant={variant} 
              isSelected={selectedVariantId === (variant._id || index)}
              onClick={() => onSelect(variant)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-slate-900/20 rounded-3xl p-10 border border-dashed border-white/5 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-slate-800/50 rounded-full flex items-center justify-center mb-3">
             <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9l-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
             </svg>
          </div>
          <h3 className="text-sm font-bold text-slate-400">Inventory Empty</h3>
          <p className="text-slate-600 text-xs mt-1">No variants have been initialized for this series.</p>
        </div>
      )}
    </div>
  );
};

export default VariantSelector;
