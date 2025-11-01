import { useEffect, useState } from "react";

/**
 * A custom hook to debounce a value.
 * @param value The value to debounce.
 * @param delay The debounce delay in milliseconds.
 * @returns The debounced value.
 *
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
 *
 * useEffect(() => {
 * // Perform a search with the debounced term
 * api.search(debouncedSearchTerm);
 * }, [debouncedSearchTerm]);
 */
export function useDebounce<T>(value: T, delay: number): T {
	// State to store the debounced value
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		// Set up a timer to update the debounced value after the specified delay
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		// Clean up the timer if the value changes before the delay has passed.
		// This is the core of the debouncing logic.
		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]); // Re-run the effect only if the value or delay changes

	return debouncedValue;
}
