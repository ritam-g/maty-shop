export const PRODUCT_FALLBACK_IMAGE = '/placeholder-product.svg';

const SUPPORTED_IMAGE_EXTENSION_REGEX = /\.(jpe?g|png|webp|gif|avif|bmp|svg)$/i;

function extractImageUrl(image) {
  if (typeof image === 'string') {
    return image.trim();
  }

  if (image && typeof image === 'object' && typeof image.url === 'string') {
    return image.url.trim();
  }

  return '';
}

function stripUrlParams(url) {
  return url.split('?')[0].split('#')[0];
}

export function isSupportedImageUrl(url) {
  if (typeof url !== 'string' || url.trim() === '') {
    return false;
  }

  const cleanUrl = stripUrlParams(url.trim());
  return SUPPORTED_IMAGE_EXTENSION_REGEX.test(cleanUrl);
}

export function getValidProductImages(images) {
  if (!Array.isArray(images)) {
    return [];
  }

  const seenUrls = new Set();

  return images
    .map(extractImageUrl)
    .filter((url) => {
      if (!isSupportedImageUrl(url)) {
        return false;
      }

      const normalizedUrl = url.toLowerCase();
      if (seenUrls.has(normalizedUrl)) {
        return false;
      }

      seenUrls.add(normalizedUrl);
      return true;
    });
}

export function getProductImagesWithFallback(images) {
  const validImages = getValidProductImages(images);
  return validImages.length > 0 ? validImages : [PRODUCT_FALLBACK_IMAGE];
}

export function handleProductImageError(event) {
  const imageElement = event.currentTarget;

  if (imageElement.dataset.fallbackApplied === 'true') {
    return;
  }

  imageElement.dataset.fallbackApplied = 'true';
  imageElement.src = PRODUCT_FALLBACK_IMAGE;
}
