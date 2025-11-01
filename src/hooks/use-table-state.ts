"use client";

import type {
	ColumnFiltersState,
	OnChangeFn,
	PaginationState,
} from "@tanstack/react-table";
import { useCallback, useState } from "react";

export interface TableFilter {
	columnId: string;
	value: unknown;
}

export interface TableState {
	pagination: PaginationState;
	columnFilters: ColumnFiltersState;
	globalFilter: string;
	sorting: { field?: string; direction?: "asc" | "desc" };
}

export interface UseTableStateOptions {
	defaultPageSize?: number;
	onStateChange?: (state: TableState) => void;
}

export interface UseTableStateReturn {
	// Current state
	pagination: PaginationState;
	columnFilters: ColumnFiltersState;
	globalFilter: string;

	// State setters for react-table
	onPaginationChange: OnChangeFn<PaginationState>;
	onColumnFiltersChange: OnChangeFn<ColumnFiltersState>;
	onGlobalFilterChange: OnChangeFn<string>;

	// Manual control methods
	setPage: (page: number) => void;
	setPageSize: (pageSize: number) => void;
	setFilter: (columnId: string, value: unknown) => void;
	removeFilter: (columnId: string) => void;
	setGlobalFilter: (filter: string) => void;
	resetFilters: () => void;
	resetPagination: () => void;
	resetAll: () => void;
}

export function useTableState(
	options: UseTableStateOptions = {},
): UseTableStateReturn {
	const { defaultPageSize = 10, onStateChange } = options;

	// Internal state
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: defaultPageSize,
	});

	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [globalFilter, setGlobalFilterState] = useState<string>("");

	// Notify parent of state changes
	const notifyStateChange = useCallback(
		(
			newPagination: PaginationState,
			newColumnFilters: ColumnFiltersState,
			newGlobalFilter: string,
		) => {
			if (onStateChange) {
				onStateChange({
					pagination: newPagination,
					columnFilters: newColumnFilters,
					globalFilter: newGlobalFilter,
					sorting: {}, // Can be extended later
				});
			}
		},
		[onStateChange],
	);

	// React-table compatible handlers
	const onPaginationChange: OnChangeFn<PaginationState> = useCallback(
		(updater) => {
			const newPagination =
				typeof updater === "function" ? updater(pagination) : updater;
			setPagination(newPagination);
			notifyStateChange(newPagination, columnFilters, globalFilter);
		},
		[pagination, columnFilters, globalFilter, notifyStateChange],
	);

	const onColumnFiltersChange: OnChangeFn<ColumnFiltersState> = useCallback(
		(updater) => {
			const newColumnFilters =
				typeof updater === "function" ? updater(columnFilters) : updater;
			setColumnFilters(newColumnFilters);
			// Reset to first page when filters change
			const resetPagination = { ...pagination, pageIndex: 0 };
			setPagination(resetPagination);
			notifyStateChange(resetPagination, newColumnFilters, globalFilter);
		},
		[columnFilters, pagination, globalFilter, notifyStateChange],
	);

	const onGlobalFilterChange: OnChangeFn<string> = useCallback(
		(updater) => {
			const newGlobalFilter =
				typeof updater === "function" ? updater(globalFilter) : updater;
			setGlobalFilterState(newGlobalFilter);
			// Reset to first page when global filter changes
			const resetPagination = { ...pagination, pageIndex: 0 };
			setPagination(resetPagination);
			notifyStateChange(resetPagination, columnFilters, newGlobalFilter);
		},
		[globalFilter, pagination, columnFilters, notifyStateChange],
	);

	// Manual control methods
	const setPage = useCallback(
		(page: number) => {
			const newPagination = { ...pagination, pageIndex: Math.max(0, page - 1) };
			setPagination(newPagination);
			notifyStateChange(newPagination, columnFilters, globalFilter);
		},
		[pagination, columnFilters, globalFilter, notifyStateChange],
	);

	const setPageSize = useCallback(
		(pageSize: number) => {
			const newPagination = { pageIndex: 0, pageSize };
			setPagination(newPagination);
			notifyStateChange(newPagination, columnFilters, globalFilter);
		},
		[columnFilters, globalFilter, notifyStateChange],
	);

	const setFilter = useCallback(
		(columnId: string, value: unknown) => {
			const newColumnFilters = columnFilters.filter((f) => f.id !== columnId);
			if (
				value !== undefined &&
				value !== null &&
				value !== "" &&
				!(Array.isArray(value) && value.length === 0)
			) {
				newColumnFilters.push({ id: columnId, value });
			}
			setColumnFilters(newColumnFilters);
			// Reset to first page when filters change
			const resetPagination = { ...pagination, pageIndex: 0 };
			setPagination(resetPagination);
			notifyStateChange(resetPagination, newColumnFilters, globalFilter);
		},
		[columnFilters, pagination, globalFilter, notifyStateChange],
	);

	const removeFilter = useCallback(
		(columnId: string) => {
			const newColumnFilters = columnFilters.filter((f) => f.id !== columnId);
			setColumnFilters(newColumnFilters);
			const resetPagination = { ...pagination, pageIndex: 0 };
			setPagination(resetPagination);
			notifyStateChange(resetPagination, newColumnFilters, globalFilter);
		},
		[columnFilters, pagination, globalFilter, notifyStateChange],
	);

	const setGlobalFilter = useCallback(
		(filter: string) => {
			setGlobalFilterState(filter);
			const resetPagination = { ...pagination, pageIndex: 0 };
			setPagination(resetPagination);
			notifyStateChange(resetPagination, columnFilters, filter);
		},
		[pagination, columnFilters, notifyStateChange],
	);

	const resetFilters = useCallback(() => {
		setColumnFilters([]);
		setGlobalFilterState("");
		const resetPagination = { ...pagination, pageIndex: 0 };
		setPagination(resetPagination);
		notifyStateChange(resetPagination, [], "");
	}, [pagination, notifyStateChange]);

	const resetPagination = useCallback(() => {
		const newPagination = { ...pagination, pageIndex: 0 };
		setPagination(newPagination);
		notifyStateChange(newPagination, columnFilters, globalFilter);
	}, [pagination, columnFilters, globalFilter, notifyStateChange]);

	const resetAll = useCallback(() => {
		const newPagination = { pageIndex: 0, pageSize: defaultPageSize };
		setPagination(newPagination);
		setColumnFilters([]);
		setGlobalFilterState("");
		notifyStateChange(newPagination, [], "");
	}, [defaultPageSize, notifyStateChange]);

	return {
		// Current state
		pagination,
		columnFilters,
		globalFilter,

		// React-table handlers
		onPaginationChange,
		onColumnFiltersChange,
		onGlobalFilterChange,

		// Manual control
		setPage,
		setPageSize,
		setFilter,
		removeFilter,
		setGlobalFilter,
		resetFilters,
		resetPagination,
		resetAll,
	};
}
