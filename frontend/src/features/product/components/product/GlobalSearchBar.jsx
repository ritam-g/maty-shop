import React, { useCallback, useEffect, useRef, useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Search, X } from 'lucide-react';
import { searchProducts } from '../../services/product.api';
import { useProductSearch } from '../../hooks/useProductSearch';
import { getProductImagesWithFallback } from '../../utils/image.utils';

/**
 * GlobalSearchBar — buyer-facing search that queries all products.
 *
 * Designed to live inside the Navbar. Opens an inline dropdown of suggestions
 * that match the typed text. Clicking a suggestion navigates to its product
 * detail page and closes the dropdown.
 *
 * Optimisations:
 *  - Input changes are debounced (300 ms) via `useProductSearch`.
 *  - `useCallback` wraps the fetch so the hook never re-subscribes.
 *  - Click outside → close (pointer-down event on document).
 */
function GlobalSearchBar() {
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  // Panel visibility state is separate from query state so we can
  // open/close without clearing the typed text prematurely.
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Stable fetch function wrapped in useCallback to keep hook dependency stable.
  const fetchSuggestions = useCallback((q) => searchProducts(q), []);

  const { query, setQuery, results, isSearching, clearSearch } =
    useProductSearch(fetchSuggestions, 300);

  // Open the dropdown whenever there are results or a search is in flight.
  useEffect(() => {
    if (query.trim()) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [query, results]);

  // Close the dropdown when the user clicks outside the component.
  useEffect(() => {
    const handlePointerDown = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  /** Navigate to the selected product and reset search. */
  const handleSelect = useCallback((product) => {
    const id = product?._id || product?.id;
    if (!id) return;
    clearSearch();
    setIsOpen(false);
    setIsExpanded(false);
    navigate(`/product/${id}`);
  }, [navigate, clearSearch]);

  /** Clear the input and collapse the bar. */
  const handleClear = useCallback(() => {
    clearSearch();
    setIsOpen(false);
  }, [clearSearch]);

  /** Expand the search bar when the icon/button is clicked. */
  const handleExpand = useCallback(() => {
    setIsExpanded(true);
    // Focus the input on next tick after expansion animation begins.
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setIsExpanded(false);
      clearSearch();
    }
  }, [clearSearch]);

  /* ─── Helper: resolve the display price of a suggestion item ─── */
  const getDisplayPrice = (product) => {
    const p = product?.price;
    const amount = (p && typeof p === 'object') ? p.amount : p;
    const currency = (p && typeof p === 'object') ? (p.currency || 'INR') : (product?.currency || 'INR');
    if (amount == null) return null;
    return `${Number(amount).toLocaleString()} ${currency}`;
  };

  return (
    <div ref={wrapperRef} className="relative flex items-center">
      {/* ── Collapsed state: icon button ─────────────────────────── */}
      {!isExpanded && (
        <button
          id="global-search-toggle-btn"
          type="button"
          aria-label="Open search"
          onClick={handleExpand}
          className="p-2 text-slate-400 hover:text-white transition-colors"
        >
          <Search size={20} />
        </button>
      )}

      {/* ── Expanded state: full search input ────────────────────── */}
      {isExpanded && (
        <div className="relative flex items-center">
          <div
            className={`
              flex items-center gap-2 px-4 py-2 rounded-2xl
              bg-slate-800/80 backdrop-blur-xl border border-white/10
              focus-within:border-indigo-500/60 focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.15)]
              transition-all duration-300 w-[220px] md:w-[280px]
            `}
          >
            {isSearching
              ? <Loader2 size={16} className="text-indigo-400 animate-spin shrink-0" />
              : <Search size={16} className="text-slate-400 shrink-0" />}

            <input
              ref={inputRef}
              id="global-search-input"
              type="search"
              autoComplete="off"
              spellCheck={false}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => query.trim() && setIsOpen(true)}
              placeholder="Search products…"
              className="
                flex-1 min-w-0 bg-transparent text-sm text-white placeholder-slate-500
                outline-none border-none
              "
              aria-label="Search products"
              aria-autocomplete="list"
              aria-expanded={isOpen}
              aria-controls="global-search-listbox"
            />

            {/* Clear / collapse button */}
            <button
              type="button"
              aria-label="Clear search"
              onClick={handleClear}
              className="text-slate-500 hover:text-white transition-colors shrink-0"
            >
              <X size={15} />
            </button>
          </div>

          {/* ── Suggestions dropdown ──────────────────────────────── */}
          {isOpen && (
            <ul
              id="global-search-listbox"
              role="listbox"
              aria-label="Product suggestions"
              className="
                absolute top-full left-0 right-0 mt-2 z-[200]
                rounded-2xl overflow-hidden
                bg-slate-900/95 backdrop-blur-xl border border-white/10
                shadow-[0_20px_60px_rgba(0,0,0,0.6)]
                max-h-80 overflow-y-auto
              "
            >
              {isSearching && results.length === 0 && (
                <li className="flex items-center gap-3 px-4 py-5 text-slate-400 text-sm">
                  <Loader2 size={15} className="animate-spin text-indigo-400" />
                  Searching…
                </li>
              )}

              {!isSearching && results.length === 0 && (
                <li className="px-4 py-5 text-slate-400 text-sm text-center">
                  No products found for "<span className="text-white font-semibold">{query}</span>"
                </li>
              )}

              {results.map((product, idx) => {
                const id = product?._id || product?.id;
                const title = product?.title || product?.name || 'Untitled';
                const [thumb] = getProductImagesWithFallback(product?.images);
                const displayPrice = getDisplayPrice(product);

                return (
                  <li
                    key={id || idx}
                    role="option"
                    aria-selected={false}
                    onClick={() => handleSelect(product)}
                    className="
                      flex items-center gap-3 px-4 py-3 cursor-pointer
                      hover:bg-indigo-500/10 transition-colors duration-150
                      border-b border-white/5 last:border-b-0 group
                    "
                  >
                    {/* Thumbnail */}
                    <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-slate-800 border border-white/5">
                      <img
                        src={thumb}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => { e.currentTarget.src = '/placeholder-product.svg'; }}
                      />
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">
                        {title}
                      </p>
                      {displayPrice && (
                        <p className="text-xs text-slate-400 mt-0.5">{displayPrice}</p>
                      )}
                    </div>

                    {/* Arrow hint */}
                    <Search size={13} className="text-slate-600 group-hover:text-indigo-400 shrink-0 transition-colors" />
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default memo(GlobalSearchBar);
