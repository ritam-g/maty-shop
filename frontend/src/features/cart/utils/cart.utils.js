const DEFAULT_CURRENCY = "INR";

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
  return items.map((item) => ({
    ...item,
    productId: getProductIdFromItem(item),
    variantId: getVariantIdFromItem(item),
    quantity: Math.max(1, Number(item?.quantity || 1)),
  }));
};

export const formatPrice = (amount, currencyCode = DEFAULT_CURRENCY) => {
  const value = Number(amount);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currencyCode || DEFAULT_CURRENCY,
    maximumFractionDigits: 0,
  }).format(Number.isNaN(value) ? 0 : value);
};

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
