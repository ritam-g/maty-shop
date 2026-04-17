import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { useNavigate } from 'react-router';

const ProductCard = ({ product }) => {
  const { name, description, price, currency, images, quantity } = product;
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate()
  // Filter out PDFs and get valid images
  const validImages = Array.isArray(images) ? images.filter(img => typeof img === 'string' && !img.toLowerCase().endsWith('.pdf')) : [];
  const primaryImage = validImages.length > 0 ? validImages[0] : null;
  const hoverImage = validImages.length > 1 ? validImages[1] : primaryImage;
 
  const formatPrice = (amount, curr) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: curr || 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const stockStatus = () => {
    if (quantity > 10) return <Badge variant="success">In Stock</Badge>;
    if (quantity < 5 && quantity > 0) return <Badge variant="warning">Only few left</Badge>;
    if (quantity <= 10 && quantity >= 5) return <Badge variant="info">In Stock</Badge>;
    return <Badge variant="error">Out of Stock</Badge>;
  };


  return (
    <motion.div
   
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative bg-slate-900/40 border border-white/5 rounded-[2rem] overflow-hidden backdrop-blur-sm transition-all duration-500 hover:border-indigo-500/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
    >
      {/* Quick Action Buttons */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
        <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-slate-950 transition-colors">
          <Heart size={18} />
        </button>
        <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-slate-950 transition-colors">
          <Eye size={18} />
        </button>
      </div>

      {/* Image Section */}
      <div
      
      className="relative aspect-square overflow-hidden m-3 rounded-[1.5rem]">
        {primaryImage ? (
          <AnimatePresence mode="wait">
            <motion.img
           
              key={isHovered ? 'hover' : 'primary'}
              src={isHovered ? hoverImage : primaryImage}
              alt={name}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: isHovered ? 1.1 : 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
            <span className="text-slate-500 font-medium">No Image</span>
          </div>
        )}

        <div className="absolute bottom-4 left-4 z-10">
          {stockStatus()}
        </div>
      </div>

      {/* Content Section */}
      <div
       
      className="p-6 pt-2">

        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
            {name}
          </h3>
        </div>

        <p className="text-slate-400 text-sm mb-6 line-clamp-2 min-h-[2.5rem]">
          {description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Price</span>
            <span className="text-2xl font-black text-white tracking-tight">
              {formatPrice(price, currency)}
            </span>
          </div>

          <Button variant="primary" className="p-3 !rounded-2xl">
            <ShoppingCart size={20} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
