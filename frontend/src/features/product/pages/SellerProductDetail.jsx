import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Container from '../components/layout/Container';
import ProductHeader from '../components/ProductHeader';
import VariantList from '../components/VariantList';
import VariantForm from '../components/VariantForm';
import { UseProduct } from '../hooks/useProduct';
import { motion } from 'framer-motion';

const SellerProductDetail = () => {
  const { productId } = useParams();
  const { getProductByIdHandeller } = UseProduct();
  const { product, isLoading, error } = useSelector((state) => state.product);
  
  useEffect(() => {
    if (productId) {
      getProductByIdHandeller(productId);
    }
  }, [productId, getProductByIdHandeller]);

  if (isLoading && !product) {
    return (
      <div className="min-h-screen bg-[#060e20] flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 font-medium animate-pulse">Loading Product Architecture...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#060e20] flex items-center justify-center p-4">
        <div className="bg-rose-500/10 border border-rose-500/20 p-8 rounded-3xl max-w-md text-center space-y-4">
          <div className="w-16 h-16 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto text-rose-500 text-3xl font-bold">!</div>
          <h2 className="text-2xl font-bold text-white">System Error</h2>
          <p className="text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  const currentProduct = Array.isArray(product) ? product.find(p => p._id === productId) : product;

  return (
    <div className="min-h-screen bg-[#060e20] text-slate-200 py-12 selection:bg-indigo-500/30">
      <Container className="space-y-12">
        {/* Navigation Breadcrumb */}
        <motion.nav 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-sm text-slate-500"
        >
          <span>Dashboard</span>
          <span>/</span>
          <span>Products</span>
          <span>/</span>
          <span className="text-indigo-400 font-medium">{currentProduct?.name || 'Product Details'}</span>
        </motion.nav>

        {/* Top Product Header */}
        <ProductHeader product={currentProduct} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Variants Listing (Col 7) */}
          <div className="lg:col-span-7 space-y-12">
             <VariantList variants={currentProduct?.variants} />
          </div>

          {/* Right: Add Variant Form (Col 5) */}
          <div className="lg:col-span-5 h-fit lg:sticky lg:top-8">
            <VariantForm 
              productId={productId} 
              onVariantAdded={() => getProductByIdHandeller(productId)}
            />
          </div>
        </div>
      </Container>
      
      {/* Dynamic Background Accents */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>
    </div>
  );
};

export default SellerProductDetail;
