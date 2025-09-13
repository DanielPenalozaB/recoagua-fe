import { clsx, type ClassValue } from "clsx";
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
  return twMerge(clsx(inputs))
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
    .map(part => part.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2)
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