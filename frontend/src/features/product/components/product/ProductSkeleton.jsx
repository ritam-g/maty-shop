import React from 'react';

const ProductSkeleton = () => {
  return (
    <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-4 animate-pulse">
      <div className="aspect-square bg-slate-800 rounded-2xl mb-4" />
      <div className="space-y-3">
        <div className="h-4 bg-slate-800 rounded w-3/4" />
        <div className="h-3 bg-slate-800 rounded w-full" />
        <div className="h-3 bg-slate-800 rounded w-5/6" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 bg-slate-800 rounded w-1/4" />
          <div className="h-8 bg-slate-800 rounded w-1/3" />
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
