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
import { getProductImagesWithFallback, handleProductImageError } from "../utils/image.utils";

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
    ? priceValue.amount
    : priceValue
);

const getPriceCurrency = (priceValue, fallbackCurrency) => (
  priceValue && typeof priceValue === "object" && priceValue.currency
    ? priceValue.currency
    : fallbackCurrency
);

const getStockMeta = (quantity) => {
  if (Number.isFinite(quantity) && quantity <= 0) return { label: "Out of Stock", variant: "error" };
  if (Number.isFinite(quantity) && quantity < 5) return { label: "Only Few Left", variant: "warning" };
  return { label: "In Stock", variant: "success" };
};

const getVariantLabel = (variant, index) => {
  const attributes = variant?.attributes
    ? Object.entries(variant.attributes).map(([key, value]) => `${key}: ${value}`)
    : [];

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
  const selectedVariantRef = useRef("");

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

  const validImages = useMemo(
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

      return {
        id: variantId,
        label: getVariantLabel(variant, index),
        variant,
        remaining,
        isAvailable: !Number.isFinite(stock) || remaining > 0,
      };
    })
  ), [cartQuantityByVariant, product, variants]);

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

  useEffect(() => {
    setActiveImage(validImages[0] || "");
  }, [validImages, productId]);

  const selectedVariantOption = useMemo(
    () => variantOptions.find((entry) => entry.id === selectedVariantId) || null,
    [selectedVariantId, variantOptions],
  );
  const selectedVariant = selectedVariantOption?.variant || null;

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

  const showToast = (type, message) => {
    setToast({ id: Date.now(), type, message });
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

  const handleVariantChange = (event) => {
    const nextId = event.target.value;
    selectedVariantRef.current = nextId;
    setSelectedVariantId(nextId);
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
      showToast("error", requestError?.response?.data?.message || "Failed to add to cart.");
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
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-pulse">
              <div className="space-y-4">
                <div className="aspect-square rounded-[2rem] bg-slate-800/60 border border-white/10" />
                <div className="grid grid-cols-5 gap-3">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="aspect-square rounded-xl bg-slate-800/60 border border-white/10" />
                  ))}
                </div>
              </div>
              <div className="rounded-[2rem] border border-white/10 bg-slate-900/60 p-8">
                <div className="h-6 w-24 rounded-full bg-slate-800/80" />
                <div className="mt-6 h-10 w-2/3 rounded-xl bg-slate-800/80" />
                <div className="mt-4 h-20 w-full rounded-xl bg-slate-800/80" />
                <div className="mt-8 h-12 w-40 rounded-xl bg-slate-800/80" />
                <div className="mt-6 h-12 w-48 rounded-xl bg-slate-800/80" />
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
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-14">
                <div className="space-y-4">
                  <div className="aspect-square rounded-[2rem] overflow-hidden bg-slate-900/70 border border-white/10">
                    {activeImage ? (
                      <img
                        src={activeImage}
                        alt={productTitle}
                        className="w-full h-full object-cover"
                        onError={handleProductImageError}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500 font-semibold">
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
                            key={`${image}-${index}`}
                            type="button"
                            onClick={() => setActiveImage(image)}
                            onMouseEnter={() => setActiveImage(image)}
                            className={`aspect-square rounded-xl overflow-hidden border transition-all ${
                              isActive
                                ? "border-indigo-500 ring-2 ring-indigo-500/40"
                                : "border-white/10 hover:border-indigo-400/70"
                            }`}
                          >
                            <img
                              src={image}
                              alt={`${productTitle} ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={handleProductImageError}
                            />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <article className="rounded-[2rem] border border-white/10 bg-slate-900/60 backdrop-blur p-6 md:p-8 lg:p-10">
                  <Badge variant={stockMeta.variant}>{stockMeta.label}</Badge>

                  <h1 className="mt-4 text-3xl md:text-4xl font-black text-white tracking-tight">
                    {productTitle}
                  </h1>

                  <p className="mt-5 text-slate-300 leading-relaxed">
                    {product.description || "No description available"}
                  </p>

                  <div className="mt-8 pt-6 border-t border-white/10">
                    <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-1">Price</p>
                    <p className="text-4xl font-black text-white tracking-tight">
                      {formatPrice(activePriceAmount, activePriceCurrency)}
                    </p>
                  </div>

                  {hasVariants && (
                    <div className="mt-6">
                      <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">Variant</p>
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

                  <div className="mt-6">
                    <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">Stock</p>
                    {hasVariants ? (
                      <p className="mt-1 text-slate-200 font-semibold">
                        {Number.isFinite(stockForSelection) ? `${Math.max(0, stockForSelection)} left in selected variant` : "Available"}
                        {Number.isFinite(totalRemainingStock) && (
                          <span className="text-slate-400 font-medium"> | Total: {Math.max(0, totalRemainingStock)}</span>
                        )}
                      </p>
                    ) : (
                      <p className="mt-1 text-slate-200 font-semibold">
                        {Number.isFinite(stockForSelection) ? `${Math.max(0, stockForSelection)} available` : "Available"}
                      </p>
                    )}
                  </div>

                  <div className="mt-8">
                    <Button
                      variant="primary"
                      disabled={!canAddToCart}
                      onClick={handleAdd}
                      className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 text-sm font-bold uppercase tracking-widest"
                    >
                      {isAdding ? <Loader2 size={18} className="animate-spin" /> : <ShoppingCart size={18} />}
                      Add to Cart
                    </Button>
                    {!hasVariants && (
                      <p className="mt-3 text-xs text-amber-300">This item needs at least one variant before it can be added to cart.</p>
                    )}
                  </div>
                </article>
              </section>

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
