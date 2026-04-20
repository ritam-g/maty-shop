import React from 'react';
import { motion } from 'framer-motion';

const ProductHeader = ({ product }) => {
  if (!product) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-white/5 shadow-2xl overflow-hidden"
    >
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Product Image Section */}
        <div className="w-full md:w-1/3 aspect-square rounded-2xl overflow-hidden bg-slate-800 border border-white/10 group">
          <img 
            src={product.images?.[0]?.url || 'https://via.placeholder.com/400'} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Product Info Section */}
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider rounded-full">
              Product Overview
            </span>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              {product.name}
            </h1>
          </div>

          <p className="text-slate-400 text-lg leading-relaxed max-w-2xl text-justify">
            {product.description}
          </p>

          <div className="pt-6 flex flex-wrap gap-6 items-center">
            <div className="space-y-1">
              <p className="text-slate-500 text-sm uppercase tracking-widest font-medium">Base Price</p>
              <p className="text-2xl font-semibold text-white">
                {product.currency} {product.price?.toLocaleString()}
              </p>
            </div>
            
            <div className="h-10 w-px bg-white/10 hidden md:block" />

            <div className="space-y-1">
              <p className="text-slate-500 text-sm uppercase tracking-widest font-medium">Variants</p>
              <p className="text-2xl font-semibold text-white">
                {product.variants?.length || 0} Available
              </p>
            </div>
            
            <div className="h-10 w-px bg-white/10 hidden md:block" />

            <div className="space-y-1">
              <p className="text-slate-500 text-sm uppercase tracking-widest font-medium">Total Stock</p>
              <p className="text-2xl font-semibold text-emerald-400">
                {product.variants?.reduce((acc, curr) => acc + curr.stock, 0) || product.stock || 0} Units
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductHeader;
