import React from 'react';
import { motion } from 'framer-motion';

const VariantCard = ({ variant, index, isSelected, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      onClick={onClick}
      className={`group relative bg-slate-900/40 backdrop-blur-lg rounded-2xl p-5 border transition-all duration-300 shadow-xl cursor-pointer ${
        isSelected ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-white/5 hover:border-indigo-500/30'
      }`}
    >
      <div className="flex gap-5 items-center">
        {/* Variant Image */}
        <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-800 border border-white/10 flex-shrink-0">
          <img
            src={variant.images?.[0]?.url || 'https://via.placeholder.com/200'}
            alt={typeof variant.name === 'string' ? variant.name : variant.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Variant Main Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white truncate group-hover:text-indigo-400 transition-colors">
            {typeof variant.name === 'string' ? variant.name : variant.title || 'Standard Variant'}
          </h3>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-white">
              {variant.currency} {typeof variant.price === 'object' ? variant.price.amount : variant.price}
            </span>
          </div>
          <p className={`mt-1 text-sm font-bold uppercase tracking-tighter ${variant.stock <= 0 ? 'text-rose-500' : 'text-emerald-400'}`}>
            {variant.stock <= 0 ? 'Out of Stock' : `${variant.stock} in stock`}
          </p>
        </div>
      </div>

      {/* Attributes Badges */}
      {variant.attributes && Object.keys(variant.attributes).length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap gap-2">
          {Object.entries(variant.attributes).map(([key, value]) => (
            <span
              key={key}
              className="px-2.5 py-1 bg-slate-800/80 text-slate-300 text-[10px] font-bold uppercase tracking-wider rounded-md border border-white/5"
            >
              <span className="text-indigo-400 mr-1">{key}:</span> {value}
            </span>
          ))}
        </div>
      )}

      {/* Glossy Overlay effect on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.div>
  );
};

export default React.memo(VariantCard);
