import React, { memo, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Eye, Loader2 } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../cart/hooks/useCart';
import {
  getProductImagesWithFallback,
  handleProductImageError,
} from '../../utils/image.utils';

const CARD_ENTRY_TRANSITION = { duration: 0.45, ease: [0.16, 1, 0.3, 1] };
const IMAGE_SWAP_TRANSITION = { duration: 0.45, ease: [0.16, 1, 0.3, 1] };

const getPriceAmount = (priceValue) => (
  priceValue && typeof priceValue === 'object' && priceValue.amount !== undefined
    ? priceValue.amount
    : priceValue
);

const getPriceCurrency = (priceValue, defaultCurrency) => (
  priceValue && typeof priceValue === 'object' && priceValue.currency
    ? priceValue.currency
    : defaultCurrency
);

const formatPrice = (amount, currencyCode) => {
  const numValue = Number(amount);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currencyCode || 'INR',
    maximumFractionDigits: 0,
  }).format(Number.isNaN(numValue) ? 0 : numValue);
};

const renderStockStatus = (quantity) => {
  if (quantity > 10) return <Badge variant="success">In Stock</Badge>;
  if (quantity > 0 && quantity < 5) return <Badge variant="warning">Only few left</Badge>;
  if (quantity > 0) return <Badge variant="info">In Stock</Badge>;
  return <Badge variant="error">Out of Stock</Badge>;
};

function ProductCardComponent({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const productId = product?._id || product?.id;
  const productTitle = product?.title || product?.name || 'Untitled Product';
  const description = product?.description || 'No description available';
  const quantity = Number(product?.quantity ?? 0);
  const priceAmount = getPriceAmount(product?.price);
  const priceCurrency = getPriceCurrency(product?.price, product?.currency);

  const imageSet = useMemo(
    () => getProductImagesWithFallback(product?.images),
    [product?.images],
  );

  const primaryImage = imageSet[0];
  const hoverImage = imageSet[1] || imageSet[0];
  const hasSecondaryImage = hoverImage !== primaryImage;
  const shouldShowHoverImage = isHovered && hasSecondaryImage;

  const handleCardClick = () => {
    if (!productId) return;
    navigate(`/product/${productId}`);
  };

  const handleCardKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCardClick();
    }
  };

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={CARD_ENTRY_TRANSITION}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      role="button"
      tabIndex={0}
      className="group relative bg-slate-900/40 border border-white/5 rounded-[2rem] overflow-hidden backdrop-blur-sm transition-all duration-500 hover:border-indigo-500/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60"
    >
      {/* Quick Action Buttons */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
        <button
          type="button"
          onClick={(event) => event.stopPropagation()}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-slate-950 transition-colors"
        >
          <Heart size={18} />
        </button>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            handleCardClick();
          }}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-slate-950 transition-colors"
        >
          <Eye size={18} />
        </button>
      </div>

      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden m-3 rounded-[1.5rem]">
        <motion.img
          src={primaryImage}
          alt={productTitle}
          initial={false}
          animate={{ opacity: shouldShowHoverImage ? 0 : 1, scale: shouldShowHoverImage ? 1.04 : 1 }}
          transition={IMAGE_SWAP_TRANSITION}
          className="absolute inset-0 w-full h-full object-cover"
          onError={handleProductImageError}
        />

        {hasSecondaryImage && (
          <motion.img
            src={hoverImage}
            alt={`${productTitle} alternate view`}
            initial={false}
            animate={{ opacity: shouldShowHoverImage ? 1 : 0, scale: shouldShowHoverImage ? 1.1 : 1.04 }}
            transition={IMAGE_SWAP_TRANSITION}
            className="absolute inset-0 w-full h-full object-cover"
            onError={handleProductImageError}
            aria-hidden
          />
        )}

        <div className="absolute bottom-4 left-4 z-10">
          {renderStockStatus(quantity)}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 pt-2">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
            {productTitle}
          </h3>
        </div>

        <p className="text-slate-400 text-sm mb-6 line-clamp-2 min-h-[2.5rem]">
          {description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Price</span>
            <span className="text-2xl font-black text-white tracking-tight">
              {formatPrice(priceAmount, priceCurrency)}
            </span>
          </div>

          <Button
            variant="primary"
            className="p-3 !rounded-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <ShoppingCart size={20} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

const ProductCard = memo(ProductCardComponent);

export default ProductCard;
