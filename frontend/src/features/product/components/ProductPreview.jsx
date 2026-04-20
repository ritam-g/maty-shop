import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductPreview = ({ product }) => {
  if (!product) return null;

  return (
    <div className="bg-slate-900/40 backdrop-blur-sm rounded-3xl border border-white/5 overflow-hidden">
      <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-white/5">
        {/* Main Product Image Section */}
        <div className="md:w-1/2 aspect-square relative group bg-slate-950">
          <AnimatePresence mode="wait">
            <motion.img
              key={product.images?.[0]?.url || 'placeholder'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              src={product.images?.[0]?.url || 'https://via.placeholder.com/600'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>
          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent pointer-events-none" />
        </div>

        {/* Selected Content Info */}
        <div className="md:w-1/2 p-8 flex flex-col justify-center space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.3em]">
              Product Overview
            </span>
            <h1 className="text-3xl font-bold text-white tracking-tight leading-tight">
              {product.name}
            </h1>
          </div>

          <div className="space-y-6 pt-4">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-white tracking-tighter">
                {product.currency} {typeof product.price === 'object' ? product.price.amount : product.price}
              </span>
              <span className="text-slate-500 text-sm font-medium uppercase tracking-widest">
                Unit Price
              </span>
            </div>

            <div className="flex items-center gap-6">
              <div className={`px-4 py-2 rounded-xl flex items-center gap-2 border ${
                product.stock <= 0 
                ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' 
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              }`}>
                <div className={`w-2 h-2 rounded-full ${product.stock <= 0 ? 'bg-rose-500' : 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]'}`} />
                <span className="text-xs font-bold uppercase tracking-widest">
                  {product.stock <= 0 ? 'Out of Stock' : `${product.stock} Units Available`}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5">
               <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                 {product.description}
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPreview;
