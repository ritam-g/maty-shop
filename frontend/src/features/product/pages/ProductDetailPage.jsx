import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ArrowLeft, RefreshCw, ShoppingCart } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Container from '../components/layout/Container';
import Navbar from '../components/layout/Navbar';
import { UseProduct } from '../hooks/useProduct';
import { getAllProducts } from '../services/product.api';
import {
  getProductImagesWithFallback,
  handleProductImageError,
} from '../utils/image.utils';

const formatPrice = (amount, currencyCode = 'INR') => {
  const numValue = Number(amount);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currencyCode || 'INR',
    maximumFractionDigits: 0,
  }).format(isNaN(numValue) ? 0 : numValue);
};

const getPriceAmount = (p) => (p && typeof p === 'object' && p.amount !== undefined) ? p.amount : p;
const getPriceCurrency = (p, defaultCurr) => (p && typeof p === 'object' && p.currency) ? p.currency : defaultCurr;

const getStockMeta = (quantity = 0) => {
  if (quantity > 10) return { label: 'In Stock', variant: 'success' };
  if (quantity > 0 && quantity < 5) return { label: 'Only Few Left', variant: 'warning' };
  if (quantity > 0) return { label: 'In Stock', variant: 'info' };
  return { label: 'Out of Stock', variant: 'error' };
};

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductByIdHandeller } = UseProduct();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeImage, setActiveImage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isCancelled = false;

    async function loadProductDetails() {
      if (!id) {
        setError('Invalid product id');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError('');

        // Fetch selected product and catalog together for better perceived performance.
        const [fetchedProduct, allProductsResponse] = await Promise.all([
          getProductByIdHandeller(id),
          getAllProducts(),
        ]);

        if (!fetchedProduct) {
          throw new Error('Product not found');
        }

        if (isCancelled) return;

        setProduct(fetchedProduct);

        const allProducts = Array.isArray(allProductsResponse?.products)
          ? allProductsResponse.products
          : [];

        const currentId = fetchedProduct?._id || fetchedProduct?.id;
        setRelatedProducts(
          allProducts
            .filter((item) => (item?._id || item?.id) !== currentId)
            .slice(0, 4)
        );
      } catch (loadError) {
        if (isCancelled) return;
        const message = loadError?.response?.data?.message || loadError?.message || 'Failed to load product details';
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
    // getProductByIdHandeller is intentionally omitted to avoid refetch loops.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, retryCount]);

  const validImages = useMemo(
    () => getProductImagesWithFallback(product?.images),
    [product?.images],
  );
  const stockMeta = useMemo(() => getStockMeta(product?.quantity), [product?.quantity]);
  const productTitle = product?.title || product?.name || 'Untitled Product';

  useEffect(() => {
    setActiveImage(validImages[0] || '');
  }, [validImages, product?._id, product?.id]);

  return (
    <div className="min-h-screen bg-slate-950 font-inter">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[46rem] h-[46rem] bg-indigo-600/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[46rem] h-[46rem] bg-violet-600/10 blur-[140px] rounded-full" />
      </div>

      <Navbar />

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
                onClick={() => setRetryCount((prev) => prev + 1)}
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
                                ? 'border-indigo-500 ring-2 ring-indigo-500/40'
                                : 'border-white/10 hover:border-indigo-400/70'
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
                    {product.description || 'No description available'}
                  </p>

                  <div className="mt-8 pt-6 border-t border-white/10 flex items-end justify-between">
                     <div>
                      <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-1">Price</p>
                      <p className="text-4xl font-black text-white tracking-tight">
                        {formatPrice(getPriceAmount(product.price), getPriceCurrency(product.price, product.currency))}
                      </p>
                     </div>
                  </div>
                  <div className="mt-6">
                    <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">Stock</p>
                    <p className="mt-1 text-slate-200 font-semibold">{product.quantity ?? 0} available</p>
                  </div>

                  <div className="mt-8">
                    <Button
                      variant="primary"
                      disabled={(product.quantity ?? 0) <= 0}
                      className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 text-sm font-bold uppercase tracking-widest"
                    >
                      <ShoppingCart size={18} />
                      {(product.quantity ?? 0) > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
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
                      const relatedTitle = item?.title || item?.name || 'Untitled Product';

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
                            <h3 className="text-white font-bold text-lg group-hover:text-indigo-400 transition-colors line-clamp-1">{relatedTitle}</h3>
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
