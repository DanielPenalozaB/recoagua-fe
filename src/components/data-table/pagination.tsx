"use client";

import type { Table } from "@tanstack/react-table";
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn, getPageNumbers } from "@/lib/utils";

type DataTablePaginationProps<TData> = {
	readonly table: Table<TData>;
};

export function DataTablePagination<TData>({
	table,
}: DataTablePaginationProps<TData>) {
	const currentPage = table.getState().pagination.pageIndex + 1;
	const totalPages = table.getPageCount();
	const pageNumbers = getPageNumbers(currentPage, totalPages);

	return (
		<div
			className={cn(
				"flex justify-between items-center px-2 overflow-clip",
				"@max-2xl/content:flex-col-reverse @max-2xl/content:gap-4",
			)}
			style={{ overflowClipMargin: 1 }}
		>
			<div className="flex justify-between items-center mr-4 w-full">
				<div className="@2xl/content:hidden flex justify-center items-center w-[100px] font-medium text-sm">
					Página {currentPage} de {totalPages}
				</div>
				<div className="flex @max-2xl/content:flex-row-reverse items-center gap-2">
					<Select
						value={`${table.getState().pagination.pageSize}`}
						onValueChange={(value) => {
							table.setPageSize(Number(value));
						}}
					>
						<SelectTrigger className="w-[70px] h-8">
							<SelectValue placeholder={table.getState().pagination.pageSize} />
						</SelectTrigger>
						<SelectContent side="top">
							{[10, 20, 30, 40, 50].map((pageSize) => (
								<SelectItem key={pageSize} value={`${pageSize}`}>
									{pageSize}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<p className="hidden sm:block font-medium text-sm">
						Filas por p&aacute;gina
					</p>
				</div>
			</div>
			<div className="flex items-center sm:space-x-6 lg:space-x-8">
				<div className="flex items-center space-x-2">
					<Button
						variant="outline"
						className="@max-md/content:hidden p-0 size-8"
						onClick={() => table.setPageIndex(0)}
						disabled={!table.getCanPreviousPage()}
					>
						<span className="sr-only">Primer p&aacute;gina</span>
						<ChevronsLeft className="w-4 h-4" />
					</Button>
					<Button
						variant="outline"
						className="p-0 size-8"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						<span className="sr-only">Página anterior</span>
						<ChevronLeft className="w-4 h-4" />
					</Button>
					{/* Page number buttons */}
					{pageNumbers.map((pageNumber, index) => (
						<div
							key={`${pageNumber}-${index.toString()}`}
							className="flex items-center"
						>
							{pageNumber === "..." ? (
								<span className="px-1 text-muted-foreground text-sm">...</span>
							) : (
								<Button
									variant={currentPage === pageNumber ? "default" : "outline"}
									className="px-2 min-w-8 h-8"
									onClick={() => table.setPageIndex((pageNumber as number) - 1)}
								>
									<span className="sr-only">
										Ir a la p&aacute;gina {pageNumber}
									</span>
									{pageNumber}
								</Button>
							)}
						</div>
					))}
					<Button
						variant="outline"
						className="p-0 size-8"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						<span className="sr-only">Página siguiente</span>
						<ChevronRight className="w-4 h-4" />
					</Button>
					<Button
						variant="outline"
						className="@max-md/content:hidden p-0 size-8"
						onClick={() => table.setPageIndex(table.getPageCount() - 1)}
						disabled={!table.getCanNextPage()}
					>
						<span className="sr-only">Última p&aacute;gina</span>
						<ChevronsRight className="w-4 h-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
