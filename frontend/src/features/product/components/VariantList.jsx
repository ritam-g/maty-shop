import React from 'react';
import VariantCard from './VariantCard';

const VariantList = ({ variants }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">Product Variants</h2>
        <span className="px-3 py-1 bg-slate-800 text-slate-400 text-xs font-medium rounded-lg border border-white/5">
          {variants?.length || 0} Total
        </span>
      </div>
      
      {variants && variants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {variants.map((variant, index) => (
            <VariantCard 
              key={variant._id || index} 
              variant={variant} 
              index={index} 
            />
          ))}
        </div>
      ) : (
        <div className="bg-slate-900/30 rounded-2xl p-12 border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-slate-300">No variants found</h3>
          <p className="text-slate-500 mt-1 max-w-xs">
            Start adding variants to this product to see them listed here.
          </p>
        </div>
      )}
    </div>
  );
};

export default VariantList;
