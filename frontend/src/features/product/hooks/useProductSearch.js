import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useProductSearch — generic debounced search hook.
 *
 * Accepts an async `fetchFn(query)` and a debounce delay (default 300 ms).
 * Returns query state, results, loading flag, and a clear helper.
 *
 * @param {(query: string) => Promise<any[]>} fetchFn  - async function to call for suggestions
 * @param {number} [delay=300]                          - debounce delay in milliseconds
 */
export function useProductSearch(fetchFn, delay = 300) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  // Stable ref to avoid stale closures in the debounce timer.
  const fetchFnRef = useRef(fetchFn);
  useEffect(() => {
    fetchFnRef.current = fetchFn;
  }, [fetchFn]);

  // Timer ref so we can clear it on each keystroke.
  const timerRef = useRef(null);

  useEffect(() => {
    const trimmed = query.trim();

    // Clear previous results immediately when the input is cleared.
    if (!trimmed) {
      setResults([]);
      setError(null);
      return;
    }

    // Cancel the pending timer whenever the query changes.
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Schedule a new fetch after `delay` ms of silence.
    timerRef.current = setTimeout(async () => {
      setIsSearching(true);
      setError(null);
      try {
        const data = await fetchFnRef.current(trimmed);
        setResults(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err?.response?.data?.message || err?.message || 'Search failed');
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, delay);

    // Cleanup on unmount or next effect run.
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query, delay]);

  /** Clears the query and results (e.g. after a suggestion is selected). */
  const clearSearch = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setQuery('');
    setResults([]);
    setError(null);
    setIsSearching(false);
  }, []);

  return { query, setQuery, results, isSearching, error, clearSearch };
}
