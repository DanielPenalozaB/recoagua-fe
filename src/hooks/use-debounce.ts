import { useState, useEffect } from 'react';

/**
 * Debounces a value based on a specified time interval.
 *
 * @param {string | undefined} value - The value to debounce
 * @param {number} ms - The time interval in milliseconds
 * @return {string | undefined} The debounced value
 */
export const useDebounce = (value: string | undefined, ms: number): string | undefined => {
  const [ debouncedValue, setDebouncedValue ] = useState(value);

  useEffect(() => {
    if (value === undefined) {
      setDebouncedValue(undefined);
    } else {
      const timerId = setTimeout(() => {
        setDebouncedValue(value);
      }, ms);

      // Cleanup function to clear the timer on unmount
      return () => {
        clearTimeout(timerId);
      };
    }
  }, [ value, ms ]);

  return debouncedValue;
};