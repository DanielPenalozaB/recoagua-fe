// src/components/ui/pagination.tsx
"use client";

import * as React from "react";
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	MoreHorizontalIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PaginationProps extends React.ComponentProps<"nav"> {
	readonly currentPage: number;
	readonly totalPages: number;
	readonly onPageChange: (page: number) => void;
	readonly siblingCount?: number;
}

export function Pagination({
	className,
	currentPage,
	totalPages,
	onPageChange,
	siblingCount = 1,
	...props
}: PaginationProps) {
	const paginationRange = React.useMemo(() => {
		const totalPageNumbers = siblingCount * 2 + 3;

		if (totalPages <= totalPageNumbers) {
			return Array.from({ length: totalPages }, (_, i) => i + 1);
		}

		const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
		const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

		const shouldShowLeftDots = leftSiblingIndex > 2;
		const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

		if (!shouldShowLeftDots && shouldShowRightDots) {
			const leftRange = Array.from(
				{ length: 3 + 2 * siblingCount },
				(_, i) => i + 1,
			);
			return [...leftRange, "ellipsis", totalPages];
		}

		if (shouldShowLeftDots && !shouldShowRightDots) {
			const rightRange = Array.from(
				{ length: 3 + 2 * siblingCount },
				(_, i) => totalPages - i,
			).reverse();
			return [1, "ellipsis", ...rightRange];
		}

		if (shouldShowLeftDots && shouldShowRightDots) {
			const middleRange = Array.from(
				{ length: rightSiblingIndex - leftSiblingIndex + 1 },
				(_, i) => leftSiblingIndex + i,
			);
			return [1, "ellipsis", ...middleRange, "ellipsis", totalPages];
		}

		return Array.from({ length: totalPages }, (_, i) => i + 1);
	}, [currentPage, totalPages, siblingCount]);

	if (totalPages <= 1) {
		return null;
	}

	return (
		<nav
			role="navigation"
			aria-label="pagination"
			className={cn("mx-auto flex w-full justify-center", className)}
			{...props}
		>
			<ul className="flex flex-row items-center gap-1">
				<li>
					<Button
						variant="outline"
						size="sm"
						onClick={() => onPageChange(currentPage - 1)}
						disabled={currentPage === 1}
						className="gap-1 px-2.5"
					>
						<ChevronLeftIcon className="h-4 w-4" />
						<span className="hidden sm:block">Anterior</span>
					</Button>
				</li>

				{paginationRange.map((pageNumber, index) => (
					<li key={`pagination-${index.toString()}`}>
						{pageNumber === "ellipsis" ? (
							<span className="flex h-9 w-9 items-center justify-center">
								<MoreHorizontalIcon className="h-4 w-4" />
								<span className="sr-only">Más páginas</span>
							</span>
						) : (
							<Button
								variant={currentPage === pageNumber ? "default" : "outline"}
								size="sm"
								onClick={() => onPageChange(pageNumber as number)}
								className="h-9 w-9 p-0"
							>
								{pageNumber}
							</Button>
						)}
					</li>
				))}

				<li>
					<Button
						variant="outline"
						size="sm"
						onClick={() => onPageChange(currentPage + 1)}
						disabled={currentPage === totalPages}
						className="gap-1 px-2.5"
					>
						<span className="hidden sm:block">Siguiente</span>
						<ChevronRightIcon className="h-4 w-4" />
					</Button>
				</li>
			</ul>
		</nav>
	);
}
