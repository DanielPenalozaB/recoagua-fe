"use client";

import {
	flexRender,
	getCoreRowModel,
	type SortingState,
	useReactTable,
	type VisibilityState,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { DataTablePagination, DataTableToolbar } from "@/components/data-table";
import { NotFoundIcon } from "@/components/icons";
import { ClientOnly } from "@/components/layout/client-only";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useCities } from "@/features/cities/hooks/use-city";
import { useRegions } from "@/features/regions/hooks/use-region";
import { useDataTable } from "@/hooks/use-data-table";
import { cn } from "@/lib/utils";
import type { CityFilterDto } from "@/types/city";
import { citiesColumns as columns } from "./cities-columns";
import { DataTableBulkActions } from "./data-table-bulk-actions";

declare module "@tanstack/react-table" {
	interface ColumnMeta<TData, TValue> {
		className: string;
		// Phantom optional property to ensure the TData type parameter is used
		// and avoid "This type parameter TData is unused" compiler error.
		__typeData?: TData;
		__typeValue?: TValue;
	}
}

type CitiesTableProps = {
	readonly defaultPageSize?: number;
};

export function CitiesTable({ defaultPageSize = 10 }: CitiesTableProps = {}) {
	// Generic table state management with Cities-specific filter builder
	const table = useDataTable<CityFilterDto>({
		defaultPageSize,
		buildFilters: (state) => {
			const filters: CityFilterDto = {
				// Pagination
				page: state.pagination.pageIndex + 1,
				limit: state.pagination.pageSize,
			};

			// Global filter (name search)
			if (state.globalFilter.trim()) {
				filters.name = state.globalFilter.trim();
			}

			// Column filters
			for (const filter of state.columnFilters) {
				switch (filter.id) {
					case "region":
						filters.regionId = filter.value as number;
						break;
					case "name":
						filters.name = filter.value as string;
						break;
					// Add other filters as needed for your cities table
					default:
						console.warn(`Unknown column filter: ${filter.id}`);
						break;
				}
			}

			return filters;
		},
	});

	// Fetch cities with server-side filtering
	const { data, isLoading, error } = useCities(table.filters);
	const { data: regions } = useRegions();

	// Local UI-only states
	const [rowSelection, setRowSelection] = useState({});
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [sorting, setSorting] = useState<SortingState>([]);

	const reactTable = useReactTable({
		data: data?.data || [],
		columns,
		state: {
			sorting,
			pagination: table.pagination,
			rowSelection,
			columnFilters: table.columnFilters,
			columnVisibility,
			globalFilter: table.globalFilter,
		},
		enableRowSelection: true,
		onPaginationChange: table.onPaginationChange,
		onColumnFiltersChange: table.onColumnFiltersChange,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		onColumnVisibilityChange: setColumnVisibility,
		onGlobalFilterChange: table.onGlobalFilterChange,
		getCoreRowModel: getCoreRowModel(),
		// Server-side processing
		manualFiltering: true,
		manualPagination: true,
		manualSorting: true,
		// Provide server-side totals
		pageCount: data?.meta.totalPages || 0,
		rowCount: data?.meta.totalItems || 0,
	});

	// Reset to page 1 if current page exceeds available pages
	useEffect(() => {
		const pageCount = data?.meta.totalPages || 0;
		if (pageCount > 0 && table.pagination.pageIndex >= pageCount) {
			table.setPage(1);
		}
	}, [data?.meta.totalPages, table]);

	const renderTableBody = () => {
		if (error) {
			return (
				<TableRow>
					<TableCell
						colSpan={columns.length}
						className="py-4 h-24 text-neutral-600 text-center"
					>
						<NotFoundIcon className="mx-auto size-24" />
						Ocurrió un error al cargar los ciudades
					</TableCell>
				</TableRow>
			);
		}

		if (isLoading) {
			return (
				<TableRow>
					<TableCell colSpan={columns.length} className="h-24 text-center">
						Cargando ciudades...
					</TableCell>
				</TableRow>
			);
		}

		if (reactTable.getRowModel().rows?.length) {
			return reactTable.getRowModel().rows.map((row) => (
				<TableRow
					key={row.id}
					data-state={row.getIsSelected() && "selected"}
					className="group/row"
				>
					{row.getVisibleCells().map((cell) => (
						<TableCell
							key={cell.id}
							className={cn(
								"bg-background group-data-[state=selected]/row:bg-muted group-hover/row:bg-muted",
								cell.column.columnDef.meta?.className ?? "",
							)}
						>
							{flexRender(cell.column.columnDef.cell, cell.getContext())}
						</TableCell>
					))}
				</TableRow>
			));
		} else {
			return (
				<TableRow>
					<TableCell colSpan={columns.length} className="h-24 text-center">
						No hay resultados.
					</TableCell>
				</TableRow>
			);
		}
	};

	const getRegionsOptions = () => {
		return (
			regions?.data.map((region) => ({
				value: region.id.toString(),
				label: region.name,
			})) ?? []
		);
	};

	return (
		<div className='space-y-4 max-sm:has-[div[role="toolbar"]]:mb-16'>
			<ClientOnly
				fallback={
					<div className="flex justify-between items-center">
						<div className="flex flex-1 items-center space-x-2">
							<div className="bg-muted rounded w-[250px] h-8 animate-pulse" />
						</div>
						<div className="flex items-center space-x-2">
							<div className="bg-muted rounded w-[100px] h-8 animate-pulse" />
							<div className="bg-muted rounded w-[100px] h-8 animate-pulse" />
						</div>
					</div>
				}
			>
				<DataTableToolbar
					table={reactTable}
					searchPlaceholder="Filtrar ciudades..."
					filters={[
						{
							columnId: "region",
							title: "Región",
							options: getRegionsOptions(),
						},
					]}
				/>
			</ClientOnly>
			<div className="border rounded-md overflow-hidden">
				<Table>
					<TableHeader>
						{reactTable.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id} className="group/row">
								{headerGroup.headers.map((header) => {
									return (
										<TableHead
											key={header.id}
											colSpan={header.colSpan}
											className={cn(
												"bg-background group-data-[state=selected]/row:bg-muted group-hover/row:bg-muted",
												header.column.columnDef.meta?.className ?? "",
											)}
										>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>{renderTableBody()}</TableBody>
				</Table>
			</div>
			<ClientOnly
				fallback={
					<div className="flex justify-between items-center px-2">
						<div className="bg-muted rounded w-[200px] h-8 animate-pulse" />
						<div className="flex items-center space-x-6 lg:space-x-8">
							<div className="bg-muted rounded w-[100px] h-8 animate-pulse" />
							<div className="bg-muted rounded w-[150px] h-8 animate-pulse" />
						</div>
					</div>
				}
			>
				<DataTablePagination table={reactTable} />
			</ClientOnly>
			<ClientOnly>
				<DataTableBulkActions table={reactTable} />
			</ClientOnly>
		</div>
	);
}
