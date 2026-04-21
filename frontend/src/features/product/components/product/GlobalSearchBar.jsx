import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Search, X } from 'lucide-react';
import { searchProducts } from '../../services/product.api';
import { useProductSearch } from '../../hooks/useProductSearch';
import { getProductImagesWithFallback } from '../../utils/image.utils';

/**
 * Function Name: GlobalSearchBar
 * Purpose: Provide buyer-facing search suggestions in the navbar and navigate to product pages.
 * Returns:
 * - Search input with debounced suggestion dropdown
 */
function GlobalSearchBar() {
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const fetchSuggestions = useCallback((searchText) => searchProducts(searchText), []);

  const { query, setQuery, results, isSearching, error, clearSearch } =
    useProductSearch(fetchSuggestions, 300);

  // Open the dropdown only when the user has typed something.
  useEffect(() => {
    setIsOpen(Boolean(query.trim()));
  }, [query]);

  // Close the dropdown if the user clicks outside the search area.
  useEffect(() => {
    const handlePointerDown = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  // After picking a suggestion, go to that product page and reset the search UI.
  const handleSelect = useCallback((product) => {
    const productId = product?._id || product?.id;

    if (!productId) return;

    clearSearch();
    setIsOpen(false);
    navigate(`/product/${productId}`);
  }, [clearSearch, navigate]);

  const handleClear = useCallback(() => {
    clearSearch();
    setIsOpen(false);
  }, [clearSearch]);

  // Escape closes the dropdown without removing the typed value.
  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  }, []);

  /**
   * Function Name: getDisplayPrice
   * Purpose: Convert a product price object into a short suggestion-friendly label.
   * Params:
   * - product: Product object from search results
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

  return (
    <div ref={wrapperRef} className="relative w-52 sm:w-64 lg:w-80">
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-800/80 px-4 py-2.5 backdrop-blur-xl transition-all focus-within:border-indigo-500/60 focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.15)]">
        {isSearching ? (
          <Loader2 size={16} className="shrink-0 animate-spin text-indigo-400" />
        ) : (
          <Search size={16} className="shrink-0 text-slate-400" />
        )}

        <input
          id="global-search-input"
          type="search"
          value={query}
          autoComplete="off"
          spellCheck={false}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search products..."
          className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 outline-none"
          aria-label="Search products"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls="global-search-listbox"
        />

        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={handleClear}
            className="shrink-0 text-slate-500 transition-colors hover:text-white"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {isOpen && (
        <ul
          id="global-search-listbox"
          role="listbox"
          aria-label="Product suggestions"
          className="absolute left-0 right-0 top-full z-[200] mt-2 max-h-80 overflow-y-auto rounded-2xl border border-white/10 bg-slate-900/95 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl"
        >
          {/* Loading state while the debounced API request is running. */}
          {isSearching && results.length === 0 && (
            <li className="flex items-center gap-3 px-4 py-4 text-sm text-slate-400">
              <Loader2 size={15} className="animate-spin text-indigo-400" />
              Searching...
            </li>
          )}

          {/* Error state if the request fails. */}
          {!isSearching && error && (
            <li className="px-4 py-4 text-center text-sm text-red-300">
              {error}
            </li>
          )}

          {/* Empty state if no product matches the typed text. */}
          {!isSearching && !error && results.length === 0 && (
            <li className="px-4 py-4 text-center text-sm text-slate-400">
              No products found for <span className="font-semibold text-white">{query}</span>
            </li>
          )}

          {/* Matching products shown as clickable suggestions. */}
          {results.map((product, index) => {
            const productId = product?._id || product?.id;
            const title = product?.title || product?.name || 'Untitled';
            const [image] = getProductImagesWithFallback(product?.images);
            const displayPrice = getDisplayPrice(product);

            return (
              <li
                key={productId || index}
                role="option"
                aria-selected={false}
                onClick={() => handleSelect(product)}
                className="group flex cursor-pointer items-center gap-3 border-b border-white/5 px-4 py-3 transition-colors last:border-b-0 hover:bg-indigo-500/10"
              >
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-white/5 bg-slate-800">
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
                  {displayPrice && (
                    <p className="mt-0.5 text-xs text-slate-400">{displayPrice}</p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default GlobalSearchBar;
