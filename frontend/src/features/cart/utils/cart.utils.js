const DEFAULT_CURRENCY = "INR";

/**
 * Function Name: normalizeId
 * Purpose: Convert string/object ids into one consistent string id.
 * Params:
 * - value: Raw id value
 * Returns:
 * - Normalized id string
 */
export const normalizeId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    return value._id || value.id || "";
  }
  return String(value);
};

export const getProductIdFromItem = (item) => (
  normalizeId(item?.productId || item?.product)
);

export const getVariantIdFromItem = (item) => (
  normalizeId(item?.variantId || item?.varient || item?.variant)
);

export const getCartItemKey = (item) => {
  const productId = getProductIdFromItem(item);
  const variantId = getVariantIdFromItem(item);
  return `${productId}::${variantId}`;
};

/**
 * Function Name: getProductTitle
 * Purpose: Safely resolve the best display title for cart and product UI.
 * Params:
 * - product: Product object
 * Returns:
 * - Title string with fallback
 */
export const getProductTitle = (product) => (
  product?.title || product?.name || "Untitled Product"
);

export const getProductImages = (product) => {
  if (!Array.isArray(product?.images)) return [];
  return product.images
    .map((entry) => (typeof entry === "string" ? entry : entry?.url))
    .filter(Boolean);
};

export const getPrimaryImage = (product) => {
  const images = getProductImages(product);
  return images[0] || "/placeholder-product.svg";
};

export const getVariantById = (product, variantId) => {
  if (!Array.isArray(product?.variants)) return null;
  return product.variants.find((variant) => normalizeId(variant?._id || variant?.id) === variantId) || null;
};

export const getPriceAmount = (priceValue) => {
  if (priceValue && typeof priceValue === "object" && priceValue.amount !== undefined) {
    return Number(priceValue.amount);
  }
  return Number(priceValue || 0);
};

export const getPriceCurrency = (priceValue, fallbackCurrency = DEFAULT_CURRENCY) => {
  if (priceValue && typeof priceValue === "object" && priceValue.currency) {
    return priceValue.currency;
  }
  return fallbackCurrency || DEFAULT_CURRENCY;
};

export const getUnitPrice = (item) => {
  const product = item?.product;
  const variantId = getVariantIdFromItem(item);
  const matchedVariant = getVariantById(product, variantId);

  if (matchedVariant?.price) {
    return {
      amount: getPriceAmount(matchedVariant.price),
      currency: getPriceCurrency(matchedVariant.price, product?.currency),
    };
  }

  if (item?.price) {
    return {
      amount: getPriceAmount(item.price),
      currency: getPriceCurrency(item.price, product?.currency),
    };
  }

  return {
    amount: getPriceAmount(product?.price),
    currency: getPriceCurrency(product?.price, product?.currency),
  };
};

/**
 * Function Name: getVariantStock
 * Purpose: Resolve stock for the active variant, falling back to product-level stock if needed.
 * Params:
 * - product: Product object
 * - variantId: Variant id
 * Returns:
 * - Numeric stock value or Infinity when stock is unknown
 */
export const getVariantStock = (product, variantId) => {
  const variant = getVariantById(product, variantId);
  if (variant && variant.stock !== undefined && variant.stock !== null) {
    return Number(variant.stock);
  }

  if (product?.stock !== undefined && product?.stock !== null) {
    return Number(product.stock);
  }

  if (product?.quantity !== undefined && product?.quantity !== null) {
    return Number(product.quantity);
  }

  return Number.POSITIVE_INFINITY;
};

export const getVariantLabel = (product, variantId) => {
  const variant = getVariantById(product, variantId);
  if (!variant) return "Default";

  const attrs = variant.attributes
    ? Object.entries(variant.attributes).map(([key, value]) => `${key}: ${value}`)
    : [];

  if (attrs.length > 0) return attrs.join(" / ");
  return "Default";
};

export const normalizeCartItems = (items) => {
  if (!Array.isArray(items)) return [];
  
  // Use a map to merge duplicate items based on their unique key (productId + variantId)
  const mergedMap = {};

  items.forEach((item) => {
    const normalizedItem = {
      ...item,
      productId: getProductIdFromItem(item),
      variantId: getVariantIdFromItem(item),
      // Ensure quantity is at least 1 and a valid number
      quantity: Math.max(1, Number(item?.quantity || 1)),
    };
    
    // Unique key for each cart item
    const key = getCartItemKey(normalizedItem);
    
    // If the item already exists in the cart, merge them by summing the quantities
    if (mergedMap[key]) {
      mergedMap[key].quantity += normalizedItem.quantity;
    } else {
      mergedMap[key] = normalizedItem;
    }
  });

  return Object.values(mergedMap);
};

export const formatPrice = (amount, currencyCode = DEFAULT_CURRENCY) => {
  const value = Number(amount);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currencyCode || DEFAULT_CURRENCY,
    maximumFractionDigits: 0,
  }).format(Number.isNaN(value) ? 0 : value);
};

/**
 * Function Name: getCartTotals
 * Purpose: Calculate item count and subtotal values for the cart summary panel.
 * Params:
 * - items: Cart item array
 * Returns:
 * - Totals object used by the UI
 */
export const getCartTotals = (items) => {
  const normalizedItems = normalizeCartItems(items);

  const totalItems = normalizedItems.reduce((sum, item) => (
    sum + Math.max(1, Number(item.quantity || 0))
  ), 0);

  const subtotal = normalizedItems.reduce((sum, item) => {
    const unit = getUnitPrice(item);
    return sum + (unit.amount * Math.max(1, Number(item.quantity || 0)));
  }, 0);

  return {
    totalItems,
    subtotal,
    discount: 0,
    total: subtotal,
  };
};
