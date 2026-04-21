import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Search, X } from 'lucide-react';
import { searchSellerProducts } from '../../services/product.api';
import { useProductSearch } from '../../hooks/useProductSearch';
import { getProductImagesWithFallback } from '../../utils/image.utils';

/**
 * Function Name: SellerSearchBar
 * Purpose: Provide seller-only search suggestions that deep-link to seller product detail pages.
 * Props:
 * - className: Optional wrapper classes
 * Returns:
 * - Search input with seller inventory suggestions
 */
function SellerSearchBar({ className = '' }) {
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const fetchSuggestions = useCallback((searchText) => searchSellerProducts(searchText), []);

  const { query, setQuery, results, isSearching, error, clearSearch } =
    useProductSearch(fetchSuggestions, 300);

  // Open the dropdown only when the seller has entered search text.
  useEffect(() => {
    setIsOpen(Boolean(query.trim()));
  }, [query]);

  // Close the dropdown if the click happens outside the search component.
  useEffect(() => {
    const handlePointerDown = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  // Open the seller product details page after a suggestion is selected.
  const handleSelect = useCallback((product) => {
    const productId = product?._id || product?.id;

    if (!productId) return;

    clearSearch();
    setIsOpen(false);
    navigate(`/seller/product/${productId}`);
  }, [clearSearch, navigate]);

  // Escape only hides the suggestion box so the user can continue editing.
  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  }, []);

  /**
   * Function Name: getDisplayPrice
   * Purpose: Build short price text for seller search suggestions.
   * Params:
   * - product: Seller product result
   * Returns:
   * - Formatted price text or null
   */
  const getDisplayPrice = (product) => {
    const price = product?.price;
    const amount = price && typeof price === 'object' ? price.amount : price;
    const currency = price && typeof price === 'object'
      ? price.currency || 'INR'
      : product?.currency || 'INR';

    if (amount == null) return null;

    return `${Number(amount).toLocaleString()} ${currency}`;
  };

  /**
   * Function Name: stockColor
   * Purpose: Map stock quantity into a quick visual status color.
   * Params:
   * - qty: Numeric stock quantity
   * Returns:
   * - Tailwind text color class
   */
  const stockColor = (qty) => {
    if (!Number.isFinite(qty) || qty > 5) return 'text-emerald-400';
    if (qty > 0) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div ref={wrapperRef} className={`relative w-full max-w-sm ${className}`}>
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-800/70 px-4 py-2.5 backdrop-blur-xl transition-all duration-300 focus-within:border-indigo-500/60 focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.12)]">
        {isSearching ? (
          <Loader2 size={16} className="shrink-0 animate-spin text-indigo-400" />
        ) : (
          <Search size={16} className="shrink-0 text-slate-400" />
        )}

        <input
          id="seller-search-input"
          type="search"
          autoComplete="off"
          spellCheck={false}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search your products..."
          className="flex-1 min-w-0 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
          aria-label="Search seller products"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls="seller-search-listbox"
        />

        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              clearSearch();
              setIsOpen(false);
            }}
            className="shrink-0 text-slate-500 transition-colors hover:text-white"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {isOpen && (
        <ul
          id="seller-search-listbox"
          role="listbox"
          aria-label="Your product suggestions"
          className="absolute left-0 right-0 top-full z-[200] mt-2 max-h-[22rem] overflow-y-auto rounded-2xl border border-white/10 bg-slate-900/95 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl"
        >
          {/* Loading state while searching seller products. */}
          {isSearching && results.length === 0 && (
            <li className="flex items-center gap-3 px-4 py-5 text-sm text-slate-400">
              <Loader2 size={15} className="animate-spin text-indigo-400" />
              Searching your inventory...
            </li>
          )}

          {/* Error state if the seller search request fails. */}
          {!isSearching && error && (
            <li className="px-4 py-5 text-center text-sm text-red-300">
              {error}
            </li>
          )}

          {/* Empty state when no seller product matches the query. */}
          {!isSearching && !error && results.length === 0 && (
            <li className="px-4 py-5 text-center text-sm text-slate-400">
              No listings match <span className="font-semibold text-white">{query}</span>
            </li>
          )}

          {/* Matching seller products shown as quick suggestions. */}
          {results.map((product, index) => {
            const productId = product?._id || product?.id;
            const title = product?.title || product?.name || 'Untitled';
            const [image] = getProductImagesWithFallback(product?.images);
            const displayPrice = getDisplayPrice(product);
            const quantity = product?.quantity ?? product?.stock ?? null;

            return (
              <li
                key={productId || index}
                role="option"
                aria-selected={false}
                onClick={() => handleSelect(product)}
                className="group flex cursor-pointer items-center gap-3 border-b border-white/5 px-4 py-3 transition-colors last:border-b-0 hover:bg-indigo-500/10 active:bg-indigo-500/20"
              >
                <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-white/5 bg-slate-800">
                  <img
                    src={image}
                    alt={title}
                    className="h-full w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.src = '/placeholder-product.svg';
                    }}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white transition-colors group-hover:text-indigo-300">
                    {title}
                  </p>
                  <div className="mt-0.5 flex items-center gap-2">
                    {displayPrice && (
                      <span className="text-xs text-slate-400">{displayPrice}</span>
                    )}
                    {quantity !== null && (
                      <>
                        <span className="text-xs text-slate-700">-</span>
                        <span className={`text-[11px] font-semibold ${stockColor(quantity)}`}>
                          {quantity <= 0 ? 'Depleted' : `${quantity} in stock`}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default SellerSearchBar;
