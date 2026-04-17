import React, { useEffect, useMemo, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const formatPrice = (amount, currencyCode = 'INR') => (
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 0,
  }).format(amount || 0)
);

const getStockMeta = (quantity = 0) => {
  if (quantity > 10) return { label: 'In Stock', variant: 'success' };
  if (quantity > 0 && quantity < 5) return { label: 'Only Few Left', variant: 'warning' };
  if (quantity > 0) return { label: 'In Stock', variant: 'info' };
  return { label: 'Out of Stock', variant: 'error' };
};

const filterValidImages = (images) => (
  Array.isArray(images)
    ? images.filter((img) => typeof img === 'string' && !img.toLowerCase().endsWith('.pdf'))
    : []
);

function ProductDetailsView({ product }) {
  const {
    name,
    description,
    price,
    currency,
    quantity = 0,
    images,
  } = product || {};

  const validImages = useMemo(() => filterValidImages(images), [images]);
  const [activeImage, setActiveImage] = useState(validImages[0] || null);
  const stockMeta = getStockMeta(quantity);

  // Reset selected image whenever the product changes.
  useEffect(() => {
    setActiveImage(validImages[0] || null);
  }, [validImages, product?._id, product?.id]);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-14">
      <div className="space-y-4">
        <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-slate-900/70 border border-white/10">
          {activeImage ? (
            <img
              src={activeImage}
              alt={name || 'Product image'}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center text-slate-500 font-semibold">
              No image available
            </div>
          )}
        </div>

        {validImages.length > 1 && (
          <div className="grid grid-cols-5 gap-3">
            {validImages.map((image, index) => {
              const isActive = image === activeImage;

              return (
                <button
                  type="button"
                  key={`${image}-${index}`}
                  onClick={() => setActiveImage(image)}
                  onMouseEnter={() => setActiveImage(image)}
                  className={`aspect-square rounded-xl overflow-hidden border transition-all ${
                    isActive
                      ? 'border-indigo-500 ring-2 ring-indigo-500/40'
                      : 'border-white/10 hover:border-indigo-400/70'
                  }`}
                >
                  <img src={image} alt={`${name || 'Product'} thumbnail ${index + 1}`} className="h-full w-full object-cover" />
                </button>
              );
            })}
          </div>
        )}
      </div>

      <article className="rounded-[2rem] border border-white/10 bg-slate-900/60 backdrop-blur p-6 md:p-8 lg:p-10">
        <div className="mb-5">
          <Badge variant={stockMeta.variant}>{stockMeta.label}</Badge>
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
          {name || 'Untitled Product'}
        </h1>

        <p className="mt-5 text-slate-300 leading-relaxed">
          {description || 'No description available for this product yet.'}
        </p>

        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">Price</p>
          <p className="mt-1 text-4xl font-black text-white">
            {formatPrice(price, currency)}
          </p>
        </div>

        <div className="mt-6 text-sm text-slate-300">
          <span className="text-slate-500 uppercase tracking-widest text-xs font-bold">Stock Quantity</span>
          <p className="mt-1 font-semibold">{quantity}</p>
        </div>

        <div className="mt-8">
          <Button
            variant="primary"
            disabled={quantity <= 0}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 text-sm uppercase tracking-widest font-bold"
          >
            <ShoppingCart size={18} />
            {quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </article>
    </section>
  );
}

export default ProductDetailsView;
