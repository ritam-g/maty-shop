import React, { memo, useMemo } from 'react';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';

function ProductGrid({ products, isLoading }) {
  const productList = useMemo(() => (Array.isArray(products) ? products : []), [products]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[...Array(8)].map((_, i) => (
          <ProductSkeleton key={`skeleton-${i}`} />
        ))}
      </div>
    );
  }

  if (productList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-4 border border-white/5">
          <span className="text-sm font-bold text-slate-300">BOX</span>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
        <p className="text-slate-400">We couldn't find any products in our catalog.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {productList.map((product, index) => {
        const productKey = product?._id || product?.id || `${product?.title || product?.name || 'product'}-${index}`;
        return <ProductCard key={productKey} product={product} />;
      })}
    </div>
  );
}

export default memo(ProductGrid);
