import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * A utility function to conditionally join multiple classnames together.
 *
 * The function takes any number of classnames, and returns a single string
 * with all the classnames that evaluate to a truthy value.
 *
 * @example
 * cn("block", "text-sm") // block text-sm
 * cn("block", false, "text-sm") // block text-sm
 * cn("block", true && "text-sm") // block text-sm
 * cn("block", true && "text-sm", 1 > 2 && "bg-red-500") // block text-sm bg-red-500
 *
 * @param {...ClassValue} inputs - The list of classnames to join.
 * @returns {string} The joined string of classnames.
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Returns the initials of a given string.
 *
 * The function takes a string and returns the first
 * two characters of the string, uppercased.
 *
 * @example
 * getInitials("John Doe") // JD
 * getInitials("Jane Smith") // JS
 *
 * @param {string} name - The input string.
 * @returns {string} The capitalized string.
 */
export function getInitials(name: string): string {
	return name
		.split(" ")
		.map((part) => part.charAt(0))
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

/**
 * Capitalizes the first letter of a string and makes the rest lowercase.
 *
 * @param {string} str - The input string.
 * @returns {string} The capitalized string.
 */
export function capitalize(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Returns a promise that resolves after a given amount of time.
 * The function takes an optional ms parameter, which defaults to 1000ms (1 second).
 * @param {number} [ms=1000] - The amount of time to wait, in milliseconds.
 * @returns {Promise<void>} A promise that resolves after the given amount of time.
 */
export function sleep(ms: number = 1000) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generates page numbers for pagination with ellipsis
 * @param currentPage - Current page number (1-based)
 * @param totalPages - Total number of pages
 * @returns Array of page numbers and ellipsis strings
 *
 * Examples:
 * - Small dataset (≤5 pages): [1, 2, 3, 4, 5]
 * - Near beginning: [1, 2, 3, 4, '...', 10]
 * - In middle: [1, '...', 4, 5, 6, '...', 10]
 * - Near end: [1, '...', 7, 8, 9, 10]
 */
export function getPageNumbers(currentPage: number, totalPages: number) {
	const maxVisiblePages = 5; // Maximum number of page buttons to show
	const rangeWithDots = [];

	if (totalPages <= maxVisiblePages) {
		// If total pages is 5 or less, show all pages
		for (let i = 1; i <= totalPages; i++) {
			rangeWithDots.push(i);
		}
	} else {
		// Always show first page
		rangeWithDots.push(1);

		if (currentPage <= 3) {
			// Near the beginning: [1] [2] [3] [4] ... [10]
			for (let i = 2; i <= 4; i++) {
				rangeWithDots.push(i);
			}
			rangeWithDots.push("...", totalPages);
		} else if (currentPage >= totalPages - 2) {
			// Near the end: [1] ... [7] [8] [9] [10]
			rangeWithDots.push("...");
			for (let i = totalPages - 3; i <= totalPages; i++) {
				rangeWithDots.push(i);
			}
		} else {
			// In the middle: [1] ... [4] [5] [6] ... [10]
			rangeWithDots.push("...");
			for (let i = currentPage - 1; i <= currentPage + 1; i++) {
				rangeWithDots.push(i);
			}
			rangeWithDots.push("...", totalPages);
		}
	}

	return rangeWithDots;
}
