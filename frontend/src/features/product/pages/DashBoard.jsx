import React, { useEffect, useMemo } from 'react';
import { UseProduct } from '../hooks/useProduct';
import { useSelector } from 'react-redux';
import { PackageX, ShoppingBag, Eye, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  getProductImagesWithFallback,
  handleProductImageError,
} from '../utils/image.utils';
import SellerSearchBar from '../components/seller/SellerSearchBar';
import TotalPriceCard from '../../dashboard/components/TotalPriceCard';
import RevenueCard from '../../dashboard/components/RevenueCard';

// Skeleton Loading Card
const ProductSkeleton = () => (
  <div className="bg-slate-900/60 border border-white/5 rounded-2xl overflow-hidden animate-pulse">
    <div className="aspect-[4/5] bg-slate-800/80 w-full" />
    <div className="p-5 space-y-4">
      <div className="space-y-2">
        <div className="h-4 bg-slate-800 rounded-full w-3/4" />
        <div className="h-3 bg-slate-800 rounded-full w-1/2" />
      </div>
      <div className="flex justify-between items-center pt-4 border-t border-white/5">
        <div className="h-5 bg-slate-800 rounded-full w-1/3" />
        <div className="h-6 w-12 bg-slate-800 rounded-full" />
      </div>
    </div>
  </div>
);

// Empty State Component
const EmptyState = () => (
  <div className="w-full py-32 flex flex-col items-center justify-center text-center space-y-6 col-span-full">
    <div className="relative">
      <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full" />
      <div className="w-24 h-24 relative bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center shadow-2xl text-slate-500">
        <PackageX size={40} strokeWidth={1} />
      </div>
    </div>
    <div className="space-y-2 max-w-sm">
      <h3 className="text-xl font-bold text-white tracking-tight">No Items Discovered</h3>
      <p className="text-slate-500 text-sm">Your atelier's vault is currently empty. Initialize a new creation to commence trading.</p>
    </div>
    <Link to="/seller/create-product" className="mt-4 px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white text-xs font-bold uppercase tracking-widest transition-colors backdrop-blur-sm">
      Create Listing
    </Link>
  </div>
);

const DashBoard = () => {
  const { getProductHandeler } = UseProduct();
  const { product, isLoading, error } = useSelector((state) => state.product);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user || user.role !== 'seller') return;
    getProductHandeler({ force: true });
  }, [getProductHandeler, user]);

  const productsList = useMemo(() => (
    Array.isArray(product) ? product : (product?.products || [])
  ), [product]);

  return (
    <div className="min-h-screen w-full bg-slate-950 px-4 sm:px-6 lg:px-12 py-16 font-inter relative overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[50rem] h-[50rem] bg-indigo-600/5 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20 text-violet-400">
                <TrendingUp size={20} />
              </div>
              <span className="text-violet-400 font-bold uppercase tracking-widest text-[10px]">Inventory</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tighter">Your Collection.</h1>
            <p className="text-slate-400 font-medium">Manage and monitor the artifacts in your commercial domain.</p>
          </div>
          {/* ─── Search bar ──────────────────────────────────── */}
          <SellerSearchBar className="flex-1 min-w-[220px] max-w-sm" />

          <Link to="/seller/create-product" className="group relative px-6 py-3.5 rounded-xl font-bold tracking-widest uppercase transition-all duration-300 shadow-lg bg-white text-slate-950 hover:scale-105 text-[10px] overflow-hidden flex items-center gap-2 shrink-0">
            <div className="absolute inset-0 bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative">Create New Item</span>
          </Link>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500/80 p-6 rounded-2xl text-center text-xs font-bold uppercase tracking-widest mb-12 flex flex-col items-center gap-2">
            <PackageX size={24} />
            <span>Transmission Error: {error}</span>
          </div>
        )}

        {/* --- Dashboard Metrics Widgets --- */}
        <div className="revenu grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <TotalPriceCard />
          <RevenueCard />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {isLoading ? (
            Array(8).fill(0).map((_, i) => (
              <ProductSkeleton key={`skeleton-${i}`} />
            ))
          ) : productsList.length === 0 ? (
            <EmptyState />
          ) : (
            productsList.map((item, index) => {
              const productTitle = item?.title || item?.name || 'Untitled Product';
              const cardImages = getProductImagesWithFallback(item?.images);
              const priceAmount = item.price?.amount ?? (typeof item.price === 'number' ? item.price : 0);
              const currency = item.price?.currency ?? item.currency ?? 'INR';
              const productKey = item?._id || item?.id || `${productTitle}-${index}`;

              return (
                <Link
                  to={`/seller/product/${item._id}`}
                  key={productKey}
                  className="group relative bg-slate-900/40 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden hover:bg-slate-800/40 hover:border-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(99,102,241,0.2)] flex flex-col cursor-pointer"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-slate-950">
                    {item.quantity <= 0 && (
                      <div className="absolute top-4 right-4 z-20 bg-red-500/90 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider text-white shadow-lg pointer-events-none">
                        Depleted
                      </div>
                    )}
                    <div className="absolute top-4 left-4 z-20 bg-slate-900/60 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider text-slate-300 border border-white/10 flex items-center gap-1.5 pointer-events-none">
                      <div className={`w-1.5 h-1.5 rounded-full ${item.quantity > 0 ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-red-500'}`} />
                      {item.quantity} QTY
                    </div>

                    {/* Only valid image URLs are mapped; fallback image is injected when none are valid. */}
                    <div className="w-full h-full flex overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                      {cardImages.map((imgUrl, imgIndex) => (
                        <div key={`${productKey}-image-${imgIndex}`} className="w-full h-full shrink-0 snap-center relative">
                          <img
                            src={imgUrl}
                            alt={`${productTitle} - Image ${imgIndex + 1}`}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                            onError={handleProductImageError}
                          />
                        </div>
                      ))}
                    </div>

                    {cardImages.length > 1 && (
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-20 pointer-events-none">
                        {cardImages.map((_, dotIndex) => (
                          <div key={`${productKey}-dot-${dotIndex}`} className="w-1.5 h-1.5 rounded-full bg-white/40 shadow-sm" />
                        ))}
                      </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl">
                        <Eye size={20} />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-indigo-400 transition-colors">
                        {productTitle}
                      </h3>
                      <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">
                        {item?.description || 'No description available'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-5 border-t border-white/5">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-1">Value</span>
                        <div className="flex items-baseline gap-1 text-white">
                          <span className="text-lg font-bold">
                            {Number(priceAmount).toLocaleString()}
                          </span>
                          <span className="text-xs font-semibold text-slate-400">
                            {currency}
                          </span>
                        </div>
                      </div>

                      <div className="w-8 h-8 rounded-full border border-slate-700/50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-500 group-hover:border-indigo-500 group-hover:text-white transition-all duration-300">
                        <ShoppingBag size={14} />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
