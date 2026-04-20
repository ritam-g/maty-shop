import React from 'react';
import { motion } from 'framer-motion';

const VariantCard = ({ variant, isSelected, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.02)' }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-3 rounded-2xl border transition-all duration-300 text-left ${
        isSelected 
        ? 'bg-indigo-500/10 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.15)]' 
        : 'bg-slate-900/40 border-white/5 hover:border-white/10'
      }`}
    >
      {/* Thumbnail */}
      <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-800 border border-white/5 flex-shrink-0">
        <img
          src={variant.images?.[0]?.url || 'https://via.placeholder.com/100'}
          alt={variant.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h4 className={`text-sm font-bold truncate ${isSelected ? 'text-indigo-400' : 'text-slate-200'}`}>
            {typeof variant.name === 'string' ? variant.name : variant.title || 'Standard'}
          </h4>
          <span className="text-sm font-bold text-white ml-2">
            {variant.currency} {typeof variant.price === 'object' ? variant.price.amount : variant.price}
          </span>
        </div>
        
        <div className="mt-1.5 flex items-center gap-3">
          <span className={`text-[10px] font-bold uppercase ${variant.stock <= 0 ? 'text-rose-500' : 'text-slate-500'}`}>
            {variant.stock <= 0 ? 'Out of Stock' : `${variant.stock} in stock`}
          </span>
          {/* Attributes Preview */}
          <div className="flex gap-1 overflow-hidden">
            {Object.entries(variant.attributes || {}).slice(0, 2).map(([key, value]) => (
              <span key={key} className="text-[9px] bg-white/5 px-1.5 py-0.5 rounded text-slate-400 whitespace-nowrap">
                {value}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Selection Indicator */}
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
        isSelected ? 'border-indigo-500 bg-indigo-500' : 'border-white/10'
      }`}>
        {isSelected && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
    </motion.button>
  );
};

export default React.memo(VariantCard);
