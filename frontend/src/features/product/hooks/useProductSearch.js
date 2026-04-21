import { useCallback, useEffect, useState } from 'react';

/**
 * Shared search hook with a simple debounce flow.
 * Input changes -> wait -> fetch suggestions -> update results.
 */
export function useProductSearch(fetchFn, delay = 300) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const trimmedQuery = query.trim();

    // When the input is empty, clear the old results right away.
    if (!trimmedQuery) {
      setResults([]);
      setError('');
      setIsSearching(false);
      return undefined;
    }

    let isCancelled = false;

    // Wait a short time before searching so we do not call the API on every key press.
    const timeoutId = window.setTimeout(async () => {
      setIsSearching(true);
      setError('');

      try {
        const data = await fetchFn(trimmedQuery);

        if (!isCancelled) {
          setResults(Array.isArray(data) ? data : []);
        }
      } catch (requestError) {
        if (!isCancelled) {
          setResults([]);
          setError(
            requestError?.response?.data?.message
              || requestError?.message
              || 'Search failed',
          );
        }
      } finally {
        if (!isCancelled) {
          setIsSearching(false);
        }
      }
    }, delay);

    // Remove the pending timer if the user keeps typing or the component unmounts.
    return () => {
      isCancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [delay, fetchFn, query]);

  // Reset everything after clear button click or after selecting a suggestion.
  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setError('');
    setIsSearching(false);
  }, []);

  return { query, setQuery, results, isSearching, error, clearSearch };
}
