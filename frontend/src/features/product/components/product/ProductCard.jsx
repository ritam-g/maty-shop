import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { Eye, Heart, Loader2, ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../cart/hooks/useCart";
import { restoreItems, upsertItemOptimistic } from "../../../cart/state/cart.slice.js";
import {
  formatPrice,
  getCartItemKey,
  getVariantStock,
  normalizeId,
} from "../../../cart/utils/cart.utils.js";
import {
  getProductImagesWithFallback,
  handleProductImageError,
} from "../../utils/image.utils";
import Badge from "../ui/Badge";

const CARD_ENTRY_TRANSITION = { duration: 0.45, ease: [0.16, 1, 0.3, 1] };
const IMAGE_SWAP_TRANSITION = { duration: 0.45, ease: [0.16, 1, 0.3, 1] };

const getPriceAmount = (priceValue) => (
  priceValue && typeof priceValue === "object" && priceValue.amount !== undefined
    ? priceValue.amount
    : priceValue
);

const getPriceCurrency = (priceValue, defaultCurrency) => (
  priceValue && typeof priceValue === "object" && priceValue.currency
    ? priceValue.currency
    : defaultCurrency
);

const renderStockStatus = (stock) => {
  if (Number.isFinite(stock) && stock <= 0) return <Badge variant="error">Out of Stock</Badge>;
  if (Number.isFinite(stock) && stock < 5) return <Badge variant="warning">Only Few Left</Badge>;
  return <Badge variant="success">In Stock</Badge>;
};

const getVariantLabel = (variant, index) => {
  const entries = variant?.attributes
    ? Object.entries(variant.attributes).map(([key, value]) => `${key}: ${value}`)
    : [];

  if (entries.length > 0) return entries.join(" / ");
  return `Variant ${index + 1}`;
};

function ProductToast({ toast }) {
  if (!toast) return null;
  const style = toast.type === "error"
    ? "border-rose-400/30 bg-rose-500/20 text-rose-100"
    : "border-emerald-400/30 bg-emerald-500/20 text-emerald-100";

  return (
    <Motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={`absolute left-3 right-3 top-3 z-30 rounded-xl border px-3 py-2 text-xs font-semibold backdrop-blur-xl ${style}`}
    >
      {toast.message}
    </Motion.div>
  );
}

function ProductCardComponent({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { handleAddToCart } = useCart();
  const cartItems = useSelector((state) => state.cart.items);

  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const selectedVariantRef = useRef("");

  const productId = product?._id || product?.id;
  const productTitle = product?.title || product?.name || "Untitled Product";
  const description = product?.description || "No description available";

  const variants = useMemo(
    () => (Array.isArray(product?.variants) ? product.variants : []),
    [product?.variants],
  );
  const hasVariants = variants.length > 0;

  const cartQuantityByVariant = useMemo(() => {
    const quantityMap = new Map();
    cartItems.forEach((item) => {
      const itemKey = getCartItemKey(item);
      if (!itemKey.startsWith(`${productId}::`)) return;
      const variantId = itemKey.split("::")[1] || "";
      quantityMap.set(variantId, Math.max(0, Number(item?.quantity || 0)));
    });
    return quantityMap;
  }, [cartItems, productId]);

  const variantOptions = useMemo(() => (
    variants.map((variant, index) => {
      const variantId = normalizeId(variant?._id || variant?.id);
      const stockValue = getVariantStock(product, variantId);
      const inCartQty = cartQuantityByVariant.get(variantId) || 0;
      const remainingStock = Number.isFinite(stockValue) ? Math.max(0, stockValue - inCartQty) : Number.POSITIVE_INFINITY;

      return {
        id: variantId,
        label: getVariantLabel(variant, index),
        variant,
        stock: stockValue,
        remaining: remainingStock,
        isAvailable: !Number.isFinite(stockValue) || remainingStock > 0,
      };
    })
  ), [cartQuantityByVariant, product, variants]);

  const firstAvailableVariantId = useMemo(() => (
    variantOptions.find((entry) => entry.isAvailable)?.id || variantOptions[0]?.id || ""
  ), [variantOptions]);

  useEffect(() => {
    if (!hasVariants) {
      selectedVariantRef.current = "";
      setSelectedVariantId("");
      return;
    }

    setSelectedVariantId((previousId) => {
      const stillExists = variantOptions.some((entry) => entry.id === previousId);
      const nextId = stillExists ? previousId : firstAvailableVariantId;
      selectedVariantRef.current = nextId;
      return nextId;
    });
  }, [firstAvailableVariantId, hasVariants, productId, variantOptions]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const selectedVariantOption = useMemo(
    () => variantOptions.find((entry) => entry.id === selectedVariantId) || null,
    [selectedVariantId, variantOptions],
  );
  const selectedVariant = selectedVariantOption?.variant || null;

  const activePrice = selectedVariant?.price || product?.price;
  const priceAmount = getPriceAmount(activePrice);
  const priceCurrency = getPriceCurrency(activePrice, product?.currency);

  const stock = selectedVariantOption?.remaining
    ?? (() => {
      const rawStock = product?.stock ?? product?.quantity;
      if (rawStock === undefined || rawStock === null) return Number.POSITIVE_INFINITY;
      return Number(rawStock);
    })();

  const imageSet = useMemo(
    () => getProductImagesWithFallback(product?.images),
    [product?.images],
  );

  const primaryImage = imageSet[0];
  const hoverImage = imageSet[1] || imageSet[0];
  const hasSecondaryImage = hoverImage !== primaryImage;
  const shouldShowHoverImage = isHovered && hasSecondaryImage;

  const showToast = (type, message) => {
    setToast({ type, message });
  };

  const handleCardClick = () => {
    if (!productId) return;
    navigate(`/product/${productId}`);
  };

  const handleCardKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCardClick();
    }
  };

  const handleVariantChange = (event) => {
    const nextId = event.target.value;
    selectedVariantRef.current = nextId;
    setSelectedVariantId(nextId);
  };

  const resolveVariantForAdd = () => {
    let variantId = selectedVariantRef.current || selectedVariantId || firstAvailableVariantId;
    if (!variantId) return "";

    const currentEntry = variantOptions.find((entry) => entry.id === variantId);
    if (currentEntry?.isAvailable) return variantId;

    const fallbackId = variantOptions.find((entry) => entry.isAvailable)?.id || "";
    if (fallbackId) {
      selectedVariantRef.current = fallbackId;
      setSelectedVariantId(fallbackId);
      showToast("success", "Switched to an available variant.");
    }

    return fallbackId;
  };

  const handleAdd = async (event) => {
    event.stopPropagation();

    if (!productId) {
      showToast("error", "Product is unavailable.");
      return;
    }

    if (!hasVariants) {
      showToast("error", "No purchasable variant is configured yet.");
      return;
    }

    const targetVariantId = resolveVariantForAdd();
    if (!targetVariantId) {
      showToast("error", "This product is currently out of stock.");
      return;
    }

    const targetEntry = variantOptions.find((entry) => entry.id === targetVariantId);
    if (!targetEntry?.isAvailable) {
      showToast("error", "Cannot exceed available stock.");
      return;
    }

    const optimisticPrice = targetEntry?.variant?.price || product?.price;
    const snapshot = cartItems.map((item) => ({ ...item }));

    dispatch(upsertItemOptimistic({
      product,
      productId,
      variantId: targetVariantId,
      varient: targetVariantId,
      quantity: 1,
      price: optimisticPrice,
    }));

    setIsAdding(true);
    try {
      await handleAddToCart({
        productId,
        variantId: targetVariantId,
        quantity: 1,
      });
      showToast("success", "Added to cart successfully.");
    } catch (requestError) {
      dispatch(restoreItems(snapshot));
      showToast("error", requestError?.response?.data?.message || "Failed to add to cart.");
    } finally {
      setIsAdding(false);
    }
  };

  const hasPurchasableVariant = variantOptions.some((entry) => entry.isAvailable);
  const addButtonDisabled = isAdding || !hasVariants || !hasPurchasableVariant;

  return (
    <Motion.div
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
      <AnimatePresence>
        {toast && <ProductToast toast={toast} />}
      </AnimatePresence>

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

      <div className="relative aspect-square overflow-hidden m-3 rounded-[1.5rem]">
        <Motion.img
          src={primaryImage}
          alt={productTitle}
          initial={false}
          animate={{ opacity: shouldShowHoverImage ? 0 : 1, scale: shouldShowHoverImage ? 1.04 : 1 }}
          transition={IMAGE_SWAP_TRANSITION}
          className="absolute inset-0 w-full h-full object-cover"
          onError={handleProductImageError}
        />

        {hasSecondaryImage && (
          <Motion.img
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
          {renderStockStatus(stock)}
        </div>
      </div>

      <div className="p-6 pt-2">
        <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
          {productTitle}
        </h3>

        <p className="text-slate-400 text-sm mt-2 mb-5 line-clamp-2 min-h-[2.5rem]">
          {description}
        </p>
        {/* not needed */}
        {/* {hasVariants && (
          <div className="mb-5 space-y-2" onClick={(event) => event.stopPropagation()}>
            <label className="sr-only" htmlFor={`variant-${productId}`}>Variant</label>
            <select
              id={`variant-${productId}`}
              value={selectedVariantId}
              onChange={handleVariantChange}
              className="w-full h-10 rounded-xl border border-white/10 bg-slate-950/50 px-3 text-sm text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              {variantOptions.map((entry) => (
                <option key={entry.id} value={entry.id} disabled={!entry.isAvailable}>
                  {entry.label} ({Number.isFinite(entry.remaining) ? `${entry.remaining} left` : "Available"})
                </option>
              ))}
            </select>
            {selectedVariantOption?.isAvailable && Number.isFinite(selectedVariantOption.remaining) && selectedVariantOption.remaining < 5 && (
              <p className="text-[11px] font-semibold text-amber-300">Only few units left in this variant.</p>
            )}
          </div>
        )} */}

        <div className="flex gap-2 items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Price</span>
            <span className="text-2xl font-black text-white tracking-tight">
              {formatPrice(priceAmount, priceCurrency)}
            </span>
          </div>

          <Motion.button
            whileHover={{ y: -1, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            type="button"
            disabled={addButtonDisabled}
            onClick={handleAdd}
            className=" h-5 cursor-pointer  py-2 px-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-[0.6rem] uppercase tracking-wider inline-flex items-center gap-2"
          >
            {isAdding ? <Loader2 size={16} className="animate-spin" /> : <ShoppingCart size={16} />}
            Add to Cart
          </Motion.button>
        </div>
      </div>
    </Motion.div>
  );
}

const ProductCard = memo(ProductCardComponent);

export default ProductCard;
