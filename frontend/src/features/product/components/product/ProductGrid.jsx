import React from 'react';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';

const ProductGrid = ({ products, isLoading }) => {
  if (isLoading) {
    return (
      <div

        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[...Array(8)].map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-4 border border-white/5">
          <span className="text-4xl">📦</span>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
        <p className="text-slate-400">We couldn't find any products in our catalog.</p>
      </div>
    );
  }
  
  

  return (
    <div
     
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {products.map((product) => (
        <ProductCard  key={product._id || product.name} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
