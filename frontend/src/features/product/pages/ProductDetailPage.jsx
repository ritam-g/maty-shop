import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { AlertTriangle, ArrowLeft, Loader2, RefreshCw, ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../../cart/hooks/useCart";
import { restoreItems, upsertItemOptimistic } from "../../cart/state/cart.slice.js";
import { getCartItemKey, getVariantStock, normalizeId } from "../../cart/utils/cart.utils.js";
import Container from "../components/layout/Container";
import Navbar from "../components/layout/Navbar";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { UseProduct } from "../hooks/useProduct";
import { getAllProducts } from "../services/product.api";
import {
  PRODUCT_FALLBACK_IMAGE,
  getProductImagesWithFallback,
  getValidProductImages,
  handleProductImageError,
} from "../utils/image.utils";

const HERO_IMAGE_TRANSITION = { duration: 0.55, ease: [0.16, 1, 0.3, 1] };
const HERO_AUTOPLAY_INTERVAL_MS = 3000;
const HERO_MANUAL_PAUSE_MS = 3000;

const formatPrice = (amount, currencyCode = "INR") => {
  const numValue = Number(amount);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currencyCode || "INR",
    maximumFractionDigits: 0,
  }).format(Number.isNaN(numValue) ? 0 : numValue);
};

const getPriceAmount = (priceValue) => (
  priceValue && typeof priceValue === "object" && priceValue.amount !== undefined
    ? Number(priceValue.amount)
    : Number(priceValue || 0)
);

const getPriceCurrency = (priceValue, fallbackCurrency) => (
  priceValue && typeof priceValue === "object" && priceValue.currency
    ? priceValue.currency
    : (fallbackCurrency || "INR")
);

const getStockMeta = (quantity) => {
  if (Number.isFinite(quantity) && quantity <= 0) return { label: "Out of Stock", variant: "error" };
  if (Number.isFinite(quantity) && quantity < 5) return { label: "Only Few Left", variant: "warning" };
  return { label: "In Stock", variant: "success" };
};

const getCartErrorMessage = (error) => {
  const responseMessage = error?.response?.data?.message;
  const fallbackMessage = error?.message;
  const rawMessage = responseMessage || fallbackMessage || "Failed to add to cart.";
  const normalized = String(rawMessage).toLowerCase();

  if (error?.response?.status === 401 || error?.response?.status === 403) {
    return "Session expired. Please login again and retry.";
  }

  if (normalized.includes("path `user` is required") || normalized.includes("path 'user' is required")) {
    return "Session issue detected. Please login again and retry.";
  }

  if (normalized.includes("validation failed")) {
    return "Could not add to cart right now. Please retry.";
  }

  if (normalized.includes("out of stock")) {
    return "This variant is out of stock.";
  }

  return rawMessage;
};

const getVariantAttributes = (variant) => {
  const attrs = variant?.attributes;
  if (!attrs) return [];
  if (attrs instanceof Map) return Array.from(attrs.entries());
  if (typeof attrs === "object") return Object.entries(attrs);
  return [];
};

const getVariantLabel = (variant, index) => {
  const attributes = getVariantAttributes(variant).map(([key, value]) => `${key}: ${value}`);
  if (attributes.length > 0) return attributes.join(" / ");
  return `Variant ${index + 1}`;
};

function ProductToast({ toast }) {
  if (!toast) return null;
  const palette = toast.type === "error"
    ? "border-rose-400/30 bg-rose-500/20 text-rose-100"
    : "border-emerald-400/30 bg-emerald-500/20 text-emerald-100";

  return (
    <Motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={`fixed top-6 right-6 z-[80] rounded-2xl border px-4 py-3 text-sm font-semibold backdrop-blur-xl shadow-2xl ${palette}`}
    >
      {toast.message}
    </Motion.div>
  );
}

function VariantCard({ entry, isSelected, onSelect }) {
  const stockMeta = getStockMeta(entry.remaining);
  const attributes = getVariantAttributes(entry.variant);

  return (
    <Motion.button
      type="button"
      onClick={onSelect}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.99 }}
      className={`text-left rounded-[1.6rem] border p-4 transition-all duration-300 ${
        isSelected
          ? "border-indigo-400/70 bg-indigo-500/10 ring-1 ring-indigo-400/40"
          : "border-white/10 bg-slate-900/60 hover:border-indigo-400/40"
      }`}
    >
      <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-slate-950/60">
        <img
          src={entry.previewImage}
          alt={entry.label}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={handleProductImageError}
        />
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <h3 className="text-white font-bold text-sm leading-5">{entry.label}</h3>
        <Badge variant={stockMeta.variant} className="shrink-0">{stockMeta.label}</Badge>
      </div>

      {attributes.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {attributes.slice(0, 3).map(([key, value]) => (
            <span
              key={`${entry.id}-${key}`}
              className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-slate-300"
            >
              {key}: {value}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Price</p>
          <p className="text-lg font-black text-white">
            {formatPrice(entry.priceAmount, entry.priceCurrency)}
          </p>
        </div>
        <p className="text-xs font-semibold text-slate-300">
          {Number.isFinite(entry.remaining) ? `${Math.max(0, entry.remaining)} left` : "Available"}
        </p>
      </div>
    </Motion.button>
  );
}

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { getProductByIdHandeller } = UseProduct();
  const { handleAddToCart } = useCart();
  const cartItems = useSelector((state) => state.cart.items);

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeImage, setActiveImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [toast, setToast] = useState(null);
  const [isHeroHovered, setIsHeroHovered] = useState(false);
  const [lastManualInteractionAt, setLastManualInteractionAt] = useState(0);

  const selectedVariantRef = useRef("");
  const heroSectionRef = useRef(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadProductDetails() {
      if (!id) {
        setError("Invalid product id");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const [fetchedProduct, allProductsResponse] = await Promise.all([
          getProductByIdHandeller(id),
          getAllProducts(),
        ]);

        if (!fetchedProduct) {
          throw new Error("Product not found");
        }

        if (isCancelled) return;

        setProduct(fetchedProduct);

        const allProducts = Array.isArray(allProductsResponse?.products)
          ? allProductsResponse.products
          : [];

        const currentId = fetchedProduct?._id || fetchedProduct?.id;
        setRelatedProducts(
          allProducts.filter((item) => (item?._id || item?.id) !== currentId).slice(0, 4),
        );
      } catch (loadError) {
        if (isCancelled) return;
        const message = loadError?.response?.data?.message || loadError?.message || "Failed to load product details";
        setError(message);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadProductDetails();
    return () => {
      isCancelled = true;
    };
    // getProductByIdHandeller intentionally omitted to avoid refetch loops.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, retryCount]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const baseImages = useMemo(
    () => getProductImagesWithFallback(product?.images),
    [product?.images],
  );
  const productTitle = product?.title || product?.name || "Untitled Product";
  const productId = product?._id || product?.id;

  const variants = useMemo(
    () => (Array.isArray(product?.variants) ? product.variants : []),
    [product?.variants],
  );
  const hasVariants = variants.length > 0;

  const cartQuantityByVariant = useMemo(() => {
    const qtyMap = new Map();
    cartItems.forEach((item) => {
      const key = getCartItemKey(item);
      if (!key.startsWith(`${productId}::`)) return;
      const variantId = key.split("::")[1] || "";
      qtyMap.set(variantId, Math.max(0, Number(item?.quantity || 0)));
    });
    return qtyMap;
  }, [cartItems, productId]);

  const variantOptions = useMemo(() => (
    variants.map((variant, index) => {
      const variantId = normalizeId(variant?._id || variant?.id);
      const stock = getVariantStock(product, variantId);
      const inCartQty = cartQuantityByVariant.get(variantId) || 0;
      const remaining = Number.isFinite(stock) ? Math.max(0, stock - inCartQty) : Number.POSITIVE_INFINITY;
      const variantImages = getValidProductImages(variant?.images);
      const previewImage = variantImages[0] || baseImages[0] || PRODUCT_FALLBACK_IMAGE;
      const variantPrice = variant?.price || product?.price;

      return {
        id: variantId,
        label: getVariantLabel(variant, index),
        variant,
        remaining,
        isAvailable: !Number.isFinite(stock) || remaining > 0,
        previewImage,
        imageList: variantImages,
        priceAmount: getPriceAmount(variantPrice),
        priceCurrency: getPriceCurrency(variantPrice, product?.currency),
      };
    })
  ), [baseImages, cartQuantityByVariant, product, variants]);

  const firstAvailableVariantId = useMemo(
    () => variantOptions.find((entry) => entry.isAvailable)?.id || variantOptions[0]?.id || "",
    [variantOptions],
  );

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

  const selectedVariantOption = useMemo(
    () => variantOptions.find((entry) => entry.id === selectedVariantId) || null,
    [selectedVariantId, variantOptions],
  );
  const selectedVariant = selectedVariantOption?.variant || null;

  const selectedVariantImages = useMemo(
    () => getValidProductImages(selectedVariant?.images),
    [selectedVariant?.images],
  );

  const heroImages = useMemo(() => {
    const merged = [...selectedVariantImages, ...baseImages];
    const seen = new Set();
    const unique = merged.filter((image) => {
      if (!image) return false;
      const key = image.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return unique.length > 0 ? unique : [PRODUCT_FALLBACK_IMAGE];
  }, [baseImages, selectedVariantImages]);

  useEffect(() => {
    if (heroImages.length === 0) {
      setActiveImage("");
      return;
    }

    setActiveImage((previous) => (heroImages.includes(previous) ? previous : heroImages[0]));
  }, [heroImages]);

  useEffect(() => {
    if (selectedVariantImages.length === 0) return;
    setActiveImage((previous) => (selectedVariantImages.includes(previous) ? previous : selectedVariantImages[0]));
  }, [selectedVariantImages, selectedVariantId]);

  useEffect(() => {
    if (!isHeroHovered || heroImages.length < 2) return undefined;
    const elapsed = Date.now() - lastManualInteractionAt;
    const firstDelay = elapsed >= HERO_MANUAL_PAUSE_MS
      ? HERO_AUTOPLAY_INTERVAL_MS
      : HERO_MANUAL_PAUSE_MS - elapsed;

    let intervalId;
    const timeoutId = window.setTimeout(() => {
      setActiveImage((previous) => {
        const currentIndex = heroImages.indexOf(previous);
        const nextIndex = currentIndex >= 0
          ? (currentIndex + 1) % heroImages.length
          : 0;
        return heroImages[nextIndex];
      });

      intervalId = window.setInterval(() => {
        setActiveImage((previous) => {
          const currentIndex = heroImages.indexOf(previous);
          const nextIndex = currentIndex >= 0
            ? (currentIndex + 1) % heroImages.length
            : 0;
          return heroImages[nextIndex];
        });
      }, HERO_AUTOPLAY_INTERVAL_MS);
    }, Math.max(0, firstDelay));

    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [heroImages, isHeroHovered, lastManualInteractionAt]);

  const activePrice = selectedVariant?.price || product?.price;
  const activePriceAmount = getPriceAmount(activePrice);
  const activePriceCurrency = getPriceCurrency(activePrice, product?.currency);

  const stockForSelection = selectedVariantOption?.remaining
    ?? (() => {
      const fallback = product?.stock ?? product?.quantity;
      if (fallback === undefined || fallback === null) return Number.POSITIVE_INFINITY;
      return Number(fallback);
    })();
  const stockMeta = useMemo(() => getStockMeta(stockForSelection), [stockForSelection]);

  const totalRemainingStock = useMemo(() => {
    if (!hasVariants) {
      return Number.isFinite(stockForSelection) ? Math.max(0, stockForSelection) : Number.POSITIVE_INFINITY;
    }

    return variantOptions.reduce((sum, entry) => {
      if (!Number.isFinite(entry.remaining)) return sum;
      return sum + Math.max(0, entry.remaining);
    }, 0);
  }, [hasVariants, stockForSelection, variantOptions]);

  const selectedVariantAttributes = useMemo(
    () => getVariantAttributes(selectedVariant),
    [selectedVariant],
  );

  const showToast = (type, message) => {
    setToast({ id: Date.now(), type, message });
  };

  const bringHeroIntoFocus = () => {
    const heroElement = heroSectionRef.current;
    if (!heroElement) return;

    const rect = heroElement.getBoundingClientRect();
    const isInPrimaryView = rect.top >= 90 && rect.bottom <= window.innerHeight - 40;
    if (isInPrimaryView) return;

    heroElement.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const resolveVariantForAdd = () => {
    let variantId = selectedVariantRef.current || selectedVariantId || firstAvailableVariantId;
    if (!variantId) return "";

    const selectedOption = variantOptions.find((entry) => entry.id === variantId);
    if (selectedOption?.isAvailable) return variantId;

    const fallbackId = variantOptions.find((entry) => entry.isAvailable)?.id || "";
    if (fallbackId) {
      selectedVariantRef.current = fallbackId;
      setSelectedVariantId(fallbackId);
      showToast("success", "Switched to an available variant.");
    }
    return fallbackId;
  };

  const handleVariantSelect = (variantId) => {
    selectedVariantRef.current = variantId;
    setSelectedVariantId(variantId);
    setLastManualInteractionAt(Date.now());

    const entry = variantOptions.find((variantEntry) => variantEntry.id === variantId);
    if (entry?.previewImage) {
      setActiveImage(entry.previewImage);
    }

    bringHeroIntoFocus();
  };

  const handleVariantChange = (event) => {
    handleVariantSelect(event.target.value);
  };

  const handleAdd = async () => {
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
      await handleAddToCart({ productId, variantId: targetVariantId, quantity: 1 });
      showToast("success", "Added to cart successfully.");
    } catch (requestError) {
      dispatch(restoreItems(snapshot));
      showToast("error", getCartErrorMessage(requestError));
    } finally {
      setIsAdding(false);
    }
  };

  const canAddToCart = hasVariants && variantOptions.some((entry) => entry.isAvailable) && !isAdding;

  return (
    <div className="min-h-screen bg-slate-950 font-inter">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[46rem] h-[46rem] bg-indigo-600/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[46rem] h-[46rem] bg-violet-600/10 blur-[140px] rounded-full" />
      </div>

      <Navbar />

      <AnimatePresence>
        {toast && <ProductToast key={toast.id} toast={toast} />}
      </AnimatePresence>

      <main className="relative pt-28 pb-20">
        <Container>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          {isLoading && (
            <section className="space-y-6 animate-pulse">
              <div className="h-[20rem] rounded-[2rem] bg-slate-800/60 border border-white/10" />
              <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-6">
                <div className="h-[28rem] rounded-[2rem] bg-slate-800/60 border border-white/10" />
                <div className="h-[28rem] rounded-[2rem] bg-slate-800/60 border border-white/10" />
              </div>
            </section>
          )}

          {!isLoading && error && (
            <section className="rounded-[2rem] border border-red-500/20 bg-red-500/10 p-8 md:p-12 text-center">
              <div className="mx-auto mb-4 w-14 h-14 rounded-full border border-red-400/20 bg-red-500/20 text-red-200 flex items-center justify-center">
                <AlertTriangle size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Unable to load product</h2>
              <p className="text-red-100/80 mb-8">{error}</p>
              <Button
                variant="primary"
                onClick={() => setRetryCount((previous) => previous + 1)}
                className="inline-flex items-center gap-2"
              >
                <RefreshCw size={16} />
                Retry
              </Button>
            </section>
          )}

          {!isLoading && !error && product && (
            <>
              <section className="mb-8">
                <Motion.div
                  ref={heroSectionRef}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  onHoverStart={() => setIsHeroHovered(true)}
                  onHoverEnd={() => setIsHeroHovered(false)}
                  className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/60 min-h-[18rem] md:min-h-[24rem] shadow-[0_30px_80px_rgba(2,6,23,0.45)]"
                >
                  <AnimatePresence mode="wait">
                    <Motion.img
                      key={activeImage}
                      src={activeImage || PRODUCT_FALLBACK_IMAGE}
                      alt={productTitle}
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={HERO_IMAGE_TRANSITION}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={handleProductImageError}
                    />
                  </AnimatePresence>

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-slate-950/35" />

                  <div className="absolute top-4 left-4 right-4">
                    <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {heroImages.map((image, index) => {
                        const isActive = image === activeImage;
                        return (
                          <button
                            key={`${image}-${index}`}
                            type="button"
                            onMouseEnter={() => {
                              setActiveImage(image);
                              setLastManualInteractionAt(Date.now());
                            }}
                            onClick={() => {
                              setActiveImage(image);
                              setLastManualInteractionAt(Date.now());
                            }}
                            className={`shrink-0 w-15 h-15 rounded-xl overflow-hidden border transition-all ${
                              isActive
                                ? "border-indigo-300 ring-2 ring-indigo-400/50"
                                : "border-white/25 hover:border-indigo-300/70"
                            }`}
                          >
                            <img
                              src={image}
                              alt={`${productTitle} preview ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={handleProductImageError}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="absolute bottom-5 left-5 right-5 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] font-bold text-indigo-200/90">Curated Visuals</p>
                      <h2 className="mt-2 text-2xl md:text-4xl font-black tracking-tight text-white">{productTitle}</h2>
                    </div>

                    <div className="inline-flex items-center gap-3 rounded-2xl border border-white/20 bg-slate-950/45 backdrop-blur-xl px-4 py-2.5 text-xs font-semibold text-slate-100">
                      <span className="w-2 h-2 rounded-full bg-indigo-300 animate-pulse" />
                      {heroImages.length > 1 ? "Hover to auto-preview every 3s" : "Premium product gallery"}
                    </div>
                  </div>
                </Motion.div>
              </section>

              <section className="grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] gap-8 items-start">
                <article className="rounded-[2rem] border border-white/10 bg-slate-900/60 backdrop-blur p-6 md:p-8">
                  <Badge variant={stockMeta.variant}>{stockMeta.label}</Badge>

                  <h1 className="mt-4 text-3xl md:text-5xl font-black text-white tracking-tight leading-[1.02]">
                    {productTitle}
                  </h1>

                  <p className="mt-5 text-slate-300 leading-relaxed text-[15px]">
                    {product.description || "No description available"}
                  </p>

                  {hasVariants && (
                    <div className="mt-7">
                      <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">Choose Variant</p>
                      <select
                        value={selectedVariantId}
                        onChange={handleVariantChange}
                        className="w-full h-11 rounded-xl border border-white/10 bg-slate-950/50 px-3 text-sm text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/50"
                      >
                        {variantOptions.map((entry) => (
                          <option key={entry.id} value={entry.id} disabled={!entry.isAvailable}>
                            {entry.label} ({Number.isFinite(entry.remaining) ? `${entry.remaining} left` : "Available"})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedVariantAttributes.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {selectedVariantAttributes.map(([key, value]) => (
                        <span
                          key={`${selectedVariantId}-${key}`}
                          className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200"
                        >
                          {key}: {value}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                      <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Selected Stock</p>
                      <p className="mt-2 text-lg font-bold text-white">
                        {Number.isFinite(stockForSelection) ? `${Math.max(0, stockForSelection)} left` : "Available"}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                      <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Total Variant Stock</p>
                      <p className="mt-2 text-lg font-bold text-white">
                        {Number.isFinite(totalRemainingStock) ? Math.max(0, totalRemainingStock) : "Available"}
                      </p>
                    </div>
                  </div>
                </article>

                <aside className="lg:sticky lg:top-28 rounded-[2rem] border border-white/10 bg-slate-900/65 backdrop-blur-xl p-6 shadow-2xl">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-bold">Order Snapshot</p>
                  <p className="mt-3 text-4xl font-black text-white tracking-tight">
                    {formatPrice(activePriceAmount, activePriceCurrency)}
                  </p>

                  <p className="mt-4 text-sm text-slate-300">
                    {hasVariants
                      ? "Price and stock update instantly when you switch variants."
                      : "This item currently has no variant configured."}
                  </p>

                  <div className="mt-6">
                    <Button
                      variant="primary"
                      disabled={!canAddToCart}
                      onClick={handleAdd}
                      className="w-full h-12 inline-flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-widest rounded-2xl"
                    >
                      {isAdding ? <Loader2 size={18} className="animate-spin" /> : <ShoppingCart size={18} />}
                      Add to Cart
                    </Button>
                    {!hasVariants && (
                      <p className="mt-3 text-xs text-amber-300">Add a product variant in seller panel to enable purchase.</p>
                    )}
                  </div>
                </aside>
              </section>

              {hasVariants && (
                <section className="mt-12">
                  <div className="flex items-end justify-between gap-4 mb-6">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] font-bold text-slate-500">Variant Gallery</p>
                      <h2 className="mt-2 text-2xl md:text-3xl font-black tracking-tight text-white">Select Your Perfect Match</h2>
                    </div>
                    <p className="text-sm text-slate-400">Tap a card to preview and switch instantly.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
                    {variantOptions.map((entry) => (
                      <VariantCard
                        key={entry.id}
                        entry={entry}
                        isSelected={entry.id === selectedVariantId}
                        onSelect={() => handleVariantSelect(entry.id)}
                      />
                    ))}
                  </div>
                </section>
              )}

              {relatedProducts.length > 0 && (
                <section className="mt-16">
                  <h2 className="text-2xl md:text-3xl font-black text-white mb-6">Related Products</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {relatedProducts.map((item) => {
                      const relatedId = item?._id || item?.id;
                      const relatedImage = getProductImagesWithFallback(item?.images)[0];
                      const relatedTitle = item?.title || item?.name || "Untitled Product";

                      return (
                        <button
                          type="button"
                          key={relatedId || item?.name}
                          onClick={() => navigate(`/product/${relatedId}`)}
                          className="text-left rounded-2xl overflow-hidden bg-slate-900/60 border border-white/10 hover:border-indigo-500/40 transition-all duration-300"
                        >
                          <div className="aspect-[4/3] bg-slate-900">
                            {relatedImage ? (
                              <img
                                src={relatedImage}
                                alt={relatedTitle}
                                className="w-full h-full object-cover"
                                onError={handleProductImageError}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-500">
                                No image
                              </div>
                            )}
                          </div>
                          <div className="p-6">
                            <h3 className="text-white font-bold text-lg line-clamp-1">{relatedTitle}</h3>
                            <p className="text-slate-400 mt-2 font-black text-xl tracking-tight">
                              {formatPrice(getPriceAmount(item?.price), getPriceCurrency(item?.price, item?.currency))}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>
              )}
            </>
          )}
        </Container>
      </main>
    </div>
  );
}

export default ProductDetailPage;
