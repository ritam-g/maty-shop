import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import Container from '../components/layout/Container';
import ProductPreview from '../components/ProductPreview';
import VariantSelector from '../components/VariantSelector';
import VariantForm from '../components/VariantForm';
import { UseProduct } from '../hooks/useProduct';

const SellerProductDetail = () => {
  const { productId } = useParams();
  const { getProductByIdHandeller } = UseProduct();
  const { product, isLoading, error } = useSelector((state) => state.product);
  
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

  // Derive display data based on selection
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
        {/* Navigation Breadcrumb */}
        <motion.nav 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 mb-10"
        >
          <span>Inventory Hub</span>
          <span className="text-slate-800">/</span>
          <span>Redesign Control</span>
          <span className="text-slate-800">/</span>
          <span className="text-indigo-400">{currentProduct?.name || 'Architectural Detail'}</span>
        </motion.nav>

        {/* redesigned 70/30 Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-10 items-start">
          
          {/* Main Content (70%) */}
          <div className="lg:col-span-7 space-y-10">
            <ProductPreview product={displayProductView} />
            <VariantSelector 
               variants={currentProduct?.variants} 
               selectedVariantId={selectedVariant?._id}
               onSelect={setSelectedVariant}
            />
          </div>

          {/* Sticky Panel (30%) */}
          <div className="lg:col-span-3">
             <VariantForm 
                productId={productId} 
                onVariantAdded={() => getProductByIdHandeller(productId)}
             />
          </div>
        </div>
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
