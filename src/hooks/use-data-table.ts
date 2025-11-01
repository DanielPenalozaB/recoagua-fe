"use client";

import { useMemo } from "react";
import {
	type TableState,
	type UseTableStateReturn,
	useTableState,
} from "./use-table-state";

export interface TableFilter<T = unknown> {
	columnId: string;
	value: T;
}

export interface UseDataTableOptions<TFilters> {
	defaultPageSize?: number;
	buildFilters: (tableState: TableState) => TFilters;
}

export interface UseDataTableReturn<TFilters> extends UseTableStateReturn {
	filters: TFilters;
}

/**
 * Generic hook for data tables with server-side filtering, pagination, and search
 *
 * @param options Configuration object
 * @param options.defaultPageSize Default page size for pagination
 * @param options.buildFilters Function to convert table state to API filter format
 *
 * @example
 * ```ts
 * // For users table
 * const table = useDataTable<UserFilterDto>({
 *   defaultPageSize: 10,
 *   buildFilters: (state) => ({
 *     page: state.pagination.pageIndex + 1,
 *     limit: state.pagination.pageSize,
 *     name: state.globalFilter || undefined,
 *     status: state.columnFilters.find(f => f.id === 'status')?.value,
 *     role: state.columnFilters.find(f => f.id === 'role')?.value,
 *   })
 * })
 *
 * // Use with API
 * const { data } = useUsers(table.filters)
 *
 * // Pass to table component
 * <UsersTable data={data.data} tableState={table} />
 * ```
 */
export function useDataTable<TFilters>(
	options: UseDataTableOptions<TFilters>,
): UseDataTableReturn<TFilters> {
	const { defaultPageSize = 10, buildFilters } = options;

	// Get table state management
	const tableState = useTableState({ defaultPageSize });

	// Build filters from current table state
	const filters = useMemo(() => {
		return buildFilters({
			pagination: tableState.pagination,
			columnFilters: tableState.columnFilters,
			globalFilter: tableState.globalFilter,
			sorting: {}, // Can be extended later
		});
	}, [
		tableState.pagination,
		tableState.columnFilters,
		tableState.globalFilter,
		buildFilters,
	]);

	return {
		...tableState,
		filters,
	};
}
