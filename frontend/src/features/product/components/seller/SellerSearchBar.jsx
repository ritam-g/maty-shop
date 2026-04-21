import React, { useCallback, useEffect, useRef, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Search, X } from 'lucide-react';
import { searchSellerProducts } from '../../services/product.api';
import { useProductSearch } from '../../hooks/useProductSearch';
import { getProductImagesWithFallback } from '../../utils/image.utils';

/**
 * SellerSearchBar — searches only the logged-in seller's products.
 *
 * Designed to drop into the DashBoard header row.
 * - Debounced via `useProductSearch` (300 ms).
 * - `useCallback` keeps the fetch reference stable across renders.
 * - Dropdown closes on outside click and on Escape.
 * - Clicking a suggestion navigates to the seller product detail route.
 *
 * @param {object}   props
 * @param {string}  [props.className]  - extra classes for outer wrapper
 */
function SellerSearchBar({ className = '' }) {
  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  // Stable fetch — seller-scoped endpoint.
  const fetchSuggestions = useCallback((q) => searchSellerProducts(q), []);

  const { query, setQuery, results, isSearching, clearSearch } =
    useProductSearch(fetchSuggestions, 300);

  const isOpen = Boolean(query.trim());

  // Close dropdown on outside pointer down.
  useEffect(() => {
    const handlePointerDown = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        clearSearch();
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [clearSearch]);

  /** Navigate to seller product detail and reset. */
  const handleSelect = useCallback((product) => {
    const id = product?._id || product?.id;
    if (!id) return;
    clearSearch();
    navigate(`/seller/product/${id}`);
  }, [navigate, clearSearch]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') clearSearch();
  }, [clearSearch]);

  /* ─── Helper: format price for display ──────────────────────── */
  const getDisplayPrice = (product) => {
    const p = product?.price;
    const amount = p && typeof p === 'object' ? p.amount : p;
    const currency = p && typeof p === 'object' ? (p.currency || 'INR') : (product?.currency || 'INR');
    if (amount == null) return null;
    return `${Number(amount).toLocaleString()} ${currency}`;
  };

  /* ─── Stock indicator colour ─────────────────────────────────── */
  const stockColor = (qty) => {
    if (!Number.isFinite(qty) || qty > 5) return 'text-emerald-400';
    if (qty > 0) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div ref={wrapperRef} className={`relative w-full max-w-sm ${className}`}>
      {/* ── Input ──────────────────────────────────────────────── */}
      <div
        className={`
          flex items-center gap-3 px-4 py-2.5 rounded-2xl
          bg-slate-800/70 backdrop-blur-xl border border-white/8
          focus-within:border-indigo-500/60
          focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.12)]
          transition-all duration-300
        `}
      >
        {isSearching
          ? <Loader2 size={16} className="text-indigo-400 animate-spin shrink-0" />
          : <Search size={16} className="text-slate-400 shrink-0" />}

        <input
          id="seller-search-input"
          type="search"
          autoComplete="off"
          spellCheck={false}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search your products…"
          className="
            flex-1 min-w-0 bg-transparent text-sm text-white
            placeholder-slate-500 outline-none border-none
          "
          aria-label="Search seller products"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls="seller-search-listbox"
        />

        {/* Clear button — only visible while there's a query */}
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={clearSearch}
            className="text-slate-500 hover:text-white transition-colors shrink-0"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* ── Suggestions dropdown ────────────────────────────────── */}
      {isOpen && (
        <ul
          id="seller-search-listbox"
          role="listbox"
          aria-label="Your product suggestions"
          className="
            absolute top-full left-0 right-0 mt-2 z-[200]
            rounded-2xl overflow-hidden
            bg-slate-900/95 backdrop-blur-xl border border-white/10
            shadow-[0_20px_60px_rgba(0,0,0,0.6)]
            max-h-[22rem] overflow-y-auto
          "
        >
          {/* Loading shimmer */}
          {isSearching && results.length === 0 && (
            <li className="flex items-center gap-3 px-4 py-5 text-slate-400 text-sm">
              <Loader2 size={15} className="animate-spin text-indigo-400" />
              Searching your inventory…
            </li>
          )}

          {/* Empty state */}
          {!isSearching && results.length === 0 && (
            <li className="px-4 py-5 text-slate-400 text-sm text-center">
              No listings match&nbsp;
              <span className="text-white font-semibold">"{query}"</span>
            </li>
          )}

          {/* Result rows */}
          {results.map((product, idx) => {
            const id = product?._id || product?.id;
            const title = product?.title || product?.name || 'Untitled';
            const [thumb] = getProductImagesWithFallback(product?.images);
            const displayPrice = getDisplayPrice(product);
            const qty = product?.quantity ?? product?.stock ?? null;

            return (
              <li
                key={id || idx}
                role="option"
                aria-selected={false}
                onClick={() => handleSelect(product)}
                className="
                  flex items-center gap-3 px-4 py-3 cursor-pointer
                  hover:bg-indigo-500/10 active:bg-indigo-500/20
                  transition-colors duration-150
                  border-b border-white/5 last:border-b-0 group
                "
              >
                {/* Thumbnail */}
                <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 bg-slate-800 border border-white/5">
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
                  <div className="flex items-center gap-2 mt-0.5">
                    {displayPrice && (
                      <span className="text-xs text-slate-400">{displayPrice}</span>
                    )}
                    {qty !== null && (
                      <>
                        <span className="text-slate-700 text-xs">·</span>
                        <span className={`text-[11px] font-semibold ${stockColor(qty)}`}>
                          {qty <= 0 ? 'Depleted' : `${qty} in stock`}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Chevron */}
                <svg
                  className="text-slate-600 group-hover:text-indigo-400 transition-colors shrink-0"
                  width="14" height="14" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default memo(SellerSearchBar);
