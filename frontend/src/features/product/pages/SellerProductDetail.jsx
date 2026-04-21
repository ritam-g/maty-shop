import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import Container from '../components/layout/Container';
import ProductPreview from '../components/ProductPreview';
import VariantSelector from '../components/VariantSelector';
import VariantForm from '../components/VariantForm';
import { UseProduct } from '../hooks/useProduct';
import { current } from '@reduxjs/toolkit';

/**
 * Component: SellerProductDetail
 * Purpose: Displays product details and allows seller to manage variants.
 */
const SellerProductDetail = () => {
  const { productId } = useParams();
  const { getProductByIdHandeller } = UseProduct();
  const { product, isLoading, error } = useSelector((state) => state.product);
  
  /**
   * State: selectedVariant
   * Purpose: Tracks the currently focused variant for preview and quick comparison.
   */
  const [selectedVariant, setSelectedVariant] = useState(null);
  
  // Default focus is null to show base product details initially
  useEffect(() => {
    if (productId) {
      getProductByIdHandeller(productId);
    }
  }, [productId, getProductByIdHandeller]);

  if (isLoading && !product) {
    return (
      <div className="min-h-screen bg-[#0b1326] flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto" />
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 animate-pulse">Syncing Inventory...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0b1326] flex items-center justify-center p-4">
        <div className="bg-rose-500/10 border border-white/5 p-8 rounded-[2rem] max-w-sm text-center space-y-4">
          <h2 className="text-xl font-bold text-white tracking-tight">System Outage</h2>
          <p className="text-slate-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const currentProduct = Array.isArray(product) ? product.find(p => p._id === productId) : product;

  /**
   * Derived Data: displayProductView
   * Purpose: Keeps preview logic unchanged while swapping image/price/stock based on selected variant.
   */
  const displayProductView = {
    ...currentProduct,
    images: selectedVariant ? selectedVariant.images : currentProduct?.images,
    price: selectedVariant ? selectedVariant.price : currentProduct?.price,
    stock: selectedVariant ? selectedVariant.stock : currentProduct?.stock,
    name: selectedVariant ? (typeof selectedVariant.name === 'string' ? selectedVariant.name : selectedVariant.title) : currentProduct?.name
  };

  return (
    <div className="min-h-screen bg-[#0b1326] text-slate-200 py-12 selection:bg-indigo-500/30 relative">
      <Container>
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="space-y-8"
        >
          {/* Navigation + Header */}
          <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/45 backdrop-blur-xl px-6 py-5 md:px-8 md:py-6">
            <motion.nav 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.05 }}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-slate-600"
            >
              <span>Inventory Hub</span>
              <span className="text-slate-800">/</span>
              <span>Variant Control</span>
              <span className="text-slate-800">/</span>
              <span className="text-indigo-400">{currentProduct?.name||currentProduct.title || 'Architectural Detail'}</span>
            </motion.nav>

            <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                  Seller Product Detail
                </h1>
                <p className="mt-2 text-sm text-slate-400">
                  Review product visuals and manage variants from one unified dashboard.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-2xl border border-indigo-400/20 bg-indigo-500/10 px-4 py-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-indigo-300">Variants</span>
                <span className="text-base font-black text-white">{currentProduct?.variants?.length || 0}</span>
              </div>
            </div>
          </div>

          {/* Top Full-Width Product Preview Card */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.4 }}
            whileHover={{ y: -2 }}
            className="rounded-[2rem] border border-white/10 bg-gradient-to-b from-slate-900/60 to-slate-900/40 p-2 shadow-[0_26px_70px_rgba(2,6,23,0.38)]"
          >
            <ProductPreview product={displayProductView} />
          </motion.div>

          {/* Balanced Variant Management Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14, duration: 0.45 }}
            className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-6 lg:gap-8 items-start"
          >
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ duration: 0.22 }}
              className="rounded-[2rem] border border-white/10 bg-slate-900/50 backdrop-blur-lg p-6 md:p-7 shadow-[0_20px_55px_rgba(2,6,23,0.35)]"
            >
              <div className="mb-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-500">Selection Panel</p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-white">Choose Active Variant</h2>
              </div>
              <VariantSelector 
                 variants={currentProduct?.variants} 
                 selectedVariantId={selectedVariant?._id}
                 onSelect={(variant) => setSelectedVariant(prev => prev?._id === variant._id ? null : variant)}
              />
            </motion.div>

            <motion.div
              whileHover={{ y: -2 }}
              transition={{ duration: 0.22 }}
              className="rounded-[2rem] border border-white/10 bg-slate-900/50 backdrop-blur-lg p-4 md:p-5 shadow-[0_20px_55px_rgba(2,6,23,0.35)]"
            >
              <div className="mb-4 px-2 pt-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-500">Creation Panel</p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-white">Add New Variant</h2>
              </div>
              <VariantForm 
                  productId={productId} 
                  onVariantAdded={() => getProductByIdHandeller(productId)}
              />
            </motion.div>
          </motion.div>
        </motion.section>
      </Container>
      
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-indigo-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[30rem] h-[30rem] bg-indigo-500/5 blur-[100px] rounded-full" />
      </div>
    </div>
  );
};

export default SellerProductDetail;
