import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../../cart/hooks/useCart";
import { restoreItems, upsertItemOptimistic } from "../../cart/state/cart.slice.js";
import { getCartItemKey, getVariantStock, normalizeId } from "../../cart/utils/cart.utils.js";
import Container from "../components/layout/Container";
import Navbar from "../components/layout/Navbar";
import Button from "../components/ui/Button";
import ProductDetailContent from "../components/product-detail/ProductDetailContent";
import ProductImageGallery from "../components/product-detail/ProductImageGallery";
import ProductInfoPanel from "../components/product-detail/ProductInfoPanel";
import RelatedProductsGrid from "../components/product-detail/RelatedProductsGrid";
import { UseProduct } from "../hooks/useProduct";
import { getAllProducts } from "../services/product.api";
import {
  PRODUCT_FALLBACK_IMAGE,
  getProductImagesWithFallback,
  getValidProductImages,
} from "../utils/image.utils";

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

const getProductBadge = (product) => (
  product?.category || product?.brand || "Premium Product"
);

const buildHighlights = ({ product, selectedVariant, stockMeta, stockText }) => {
  const attributes = selectedVariant?.attributes || [];
  const description = product?.description || "";
  const summarySentences = description
    .split(".")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 2);

  const attributeHighlights = attributes.slice(0, 2).map(([key, value]) => ({
    title: key,
    description: String(value),
  }));

  const fallbackHighlights = [
    {
      title: "Product overview",
      description: summarySentences[0] || "Designed to feel premium, clear, and easy to purchase.",
    },
    {
      title: "Current availability",
      description: `${stockMeta.label}. ${stockText}`,
    },
    {
      title: "Variant-aware purchase",
      description: "Price, stock, and gallery update instantly when you switch variants.",
    },
  ];

  return [...attributeHighlights, ...fallbackHighlights].slice(0, 3);
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

/**
 * Function Name: ProductDetailPage
 * Purpose: Render the buyer product detail page, selected variant state, and add-to-cart flow.
 * Returns:
 * - Full product detail experience with gallery, variant selection, and related products
 */
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
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [toast, setToast] = useState(null);

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
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [id]);

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
        attributes: getVariantAttributes(variant),
        remaining,
        isAvailable: !Number.isFinite(stock) || remaining > 0,
        previewImage,
        imageList: variantImages,
        priceAmount: getPriceAmount(variantPrice),
        priceCurrency: getPriceCurrency(variantPrice, product?.currency),
        priceText: formatPrice(getPriceAmount(variantPrice), getPriceCurrency(variantPrice, product?.currency)),
      };
    })
  ), [baseImages, cartQuantityByVariant, product, variants]);

  const firstAvailableVariantId = useMemo(
    () => variantOptions.find((entry) => entry.isAvailable)?.id || variantOptions[0]?.id || "",
    [variantOptions],
  );

  useEffect(() => {
    if (!hasVariants) {
      setSelectedVariant(null);
      return;
    }

    setSelectedVariant((previousVariant) => {
      const previousId = previousVariant?.id || "";
      return (
        variantOptions.find((entry) => entry.id === previousId)
        || variantOptions.find((entry) => entry.id === firstAvailableVariantId)
        || null
      );
    });
  }, [firstAvailableVariantId, hasVariants, productId, variantOptions]);

  const selectedVariantImages = useMemo(
    () => getValidProductImages(selectedVariant?.variant?.images),
    [selectedVariant?.variant?.images],
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
  }, [selectedVariantImages, selectedVariant]);

  const activePrice = selectedVariant?.variant?.price || product?.price;
  const activePriceAmount = getPriceAmount(activePrice);
  const activePriceCurrency = getPriceCurrency(activePrice, product?.currency);

  const stockForSelection = selectedVariant?.remaining
    ?? (() => {
      const fallback = product?.stock ?? product?.quantity;
      if (fallback === undefined || fallback === null) return Number.POSITIVE_INFINITY;
      return Number(fallback);
    })();
  const stockMeta = useMemo(() => getStockMeta(stockForSelection), [stockForSelection]);

  const selectedVariantAttributes = useMemo(
    () => selectedVariant?.attributes || [],
    [selectedVariant],
  );
  const priceText = useMemo(
    () => formatPrice(activePriceAmount, activePriceCurrency),
    [activePriceAmount, activePriceCurrency],
  );
  const stockText = useMemo(() => {
    if (!Number.isFinite(stockForSelection)) return "Available for order";
    if (stockForSelection <= 0) return "Currently unavailable";
    return `${Math.max(0, stockForSelection)} units ready to ship`;
  }, [stockForSelection]);
  const pageHighlights = useMemo(
    () => buildHighlights({ product, selectedVariant, stockMeta, stockText }),
    [product, selectedVariant, stockMeta, stockText],
  );
  const relatedItems = useMemo(() => (
    relatedProducts.map((item) => ({
      id: item?._id || item?.id,
      title: item?.title || item?.name || "Untitled Product",
      image: getProductImagesWithFallback(item?.images)[0],
      priceText: formatPrice(getPriceAmount(item?.price), getPriceCurrency(item?.price, item?.currency)),
    }))
  ), [relatedProducts]);

  /**
   * Function Name: showToast
   * Purpose: Display a short-lived success or error message for product actions.
   */
  const showToast = (type, message) => {
    setToast({ id: Date.now(), type, message });
  };

  /**
   * Function Name: resolveVariantForAdd
   * Purpose: Ensure add-to-cart uses an available variant, falling back when the selected one is unavailable.
   * Returns:
   * - Variant id to send to cart API
   */
  const resolveVariantForAdd = () => {
    let variantId = selectedVariant?.id || firstAvailableVariantId;
    if (!variantId) return "";

    const selectedOption = variantOptions.find((entry) => entry.id === variantId);
    if (selectedOption?.isAvailable) return variantId;

    const fallbackId = variantOptions.find((entry) => entry.isAvailable)?.id || "";
    if (fallbackId) {
      setSelectedVariant(variantOptions.find((entry) => entry.id === fallbackId) || null);
      showToast("success", "Switched to an available variant.");
    }
    return fallbackId;
  };

  /**
   * Function Name: handleVariantChange
   * Purpose: Update the selected variant object and sync the hero image immediately.
   * Params:
   * - variantEntry: Selected normalized variant option
   */
  const handleVariantChange = (variantEntry) => {
    if (!variantEntry) return;
    setSelectedVariant(variantEntry);
    setActiveImage(variantEntry.previewImage || variantEntry.imageList?.[0] || PRODUCT_FALLBACK_IMAGE);
  };

  /**
   * Function Name: handleAdd
   * Purpose: Optimistically add the selected variant to cart, then replace local state with backend truth.
   */
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
              <section className="grid items-start gap-8 lg:grid-cols-[1.08fr_0.92fr]">
                <ProductImageGallery
                  title={productTitle}
                  images={heroImages}
                  activeImage={activeImage || PRODUCT_FALLBACK_IMAGE}
                  onImageSelect={setActiveImage}
                />
                <ProductInfoPanel
                  badgeText={getProductBadge(product)}
                  productTitle={productTitle}
                  description={product.description || "No description available."}
                  priceText={priceText}
                  stockMeta={stockMeta}
                  stockText={stockText}
                  selectedVariantAttributes={selectedVariantAttributes}
                  variantOptions={variantOptions}
                  selectedVariant={selectedVariant}
                  onVariantChange={handleVariantChange}
                  onAddToCart={handleAdd}
                  canAddToCart={canAddToCart}
                  isAdding={isAdding}
                  hasVariants={hasVariants}
                />
              </section>

              <div className="mt-14">
                <ProductDetailContent
                  description={product.description || "No description available."}
                  highlights={pageHighlights}
                  variantOptions={variantOptions}
                  selectedVariant={selectedVariant}
                  onVariantChange={handleVariantChange}
                />
              </div>

              <RelatedProductsGrid
                products={relatedItems}
                onProductClick={(productId) => navigate(`/product/${productId}`)}
              />
            </>
          )}
        </Container>
      </main>
    </div>
  );
}

export default ProductDetailPage;
