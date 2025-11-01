"use client";

import type { Table } from "@tanstack/react-table";
import { Trash2, UserCheck, UserX } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DataTableBulkActions as BulkActionsToolbar } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { sleep } from "@/lib/utils";
import type { Region } from "@/types/region";
import { RegionsMultiDeleteDialog } from "./regions-multi-delete-dialog";

type DataTableBulkActionsProps<TData> = {
	readonly table: Table<TData>;
};

export function DataTableBulkActions<TData>({
	table,
}: DataTableBulkActionsProps<TData>) {
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const selectedRows = table.getFilteredSelectedRowModel().rows;

	const handleBulkStatusChange = (status: "active" | "inactive") => {
		const selectedUsers = selectedRows.map((row) => row.original as Region);
		toast.promise(sleep(2000), {
			loading: `${status === "active" ? "Activando" : "Desactivando"} regiones...`,
			success: () => {
				table.resetRowSelection();
				return `${status === "active" ? "Activado" : "Desactivado"} ${selectedUsers.length} región${selectedUsers.length > 1 ? "s" : ""}`;
			},
			error: `Error ${status === "active" ? "activando" : "desactivando"} regiones`,
		});
		table.resetRowSelection();
	};

	return (
		<>
			<BulkActionsToolbar table={table} entityName="región">
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="outline"
							size="icon"
							onClick={() => handleBulkStatusChange("active")}
							className="size-8"
							aria-label="Activar regiones seleccionados"
							title="Activar regiones seleccionados"
						>
							<UserCheck />
							<span className="sr-only">Activar regiones seleccionados</span>
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Activar regiones seleccionados</p>
					</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="outline"
							size="icon"
							onClick={() => handleBulkStatusChange("inactive")}
							className="size-8"
							aria-label="Desactivar regiones seleccionados"
							title="Desactivar regiones seleccionados"
						>
							<UserX />
							<span className="sr-only">Desactivar regiones seleccionados</span>
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Desactivar regiones seleccionados</p>
					</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="destructive"
							size="icon"
							onClick={() => setShowDeleteConfirm(true)}
							className="size-8"
							aria-label="Eliminar regiones seleccionados"
							title="Eliminar regiones seleccionados"
						>
							<Trash2 />
							<span className="sr-only">Eliminar regiones seleccionados</span>
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Eliminar regiones seleccionados</p>
					</TooltipContent>
				</Tooltip>
			</BulkActionsToolbar>

			<RegionsMultiDeleteDialog
				table={table}
				open={showDeleteConfirm}
				onOpenChange={setShowDeleteConfirm}
			/>
		</>
	);
}
