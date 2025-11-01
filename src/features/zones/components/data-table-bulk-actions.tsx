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
import type { Zone } from "@/types/zone";
import { ZonesMultiDeleteDialog } from "./zones-multi-delete-dialog";

type DataTableBulkActionsProps<TData> = {
	readonly table: Table<TData>;
};

export function DataTableBulkActions<TData>({
	table,
}: DataTableBulkActionsProps<TData>) {
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const selectedRows = table.getFilteredSelectedRowModel().rows;

	const handleBulkStatusChange = (status: "active" | "inactive") => {
		const selectedUsers = selectedRows.map((row) => row.original as Zone);
		toast.promise(sleep(2000), {
			loading: `${status === "active" ? "Activando" : "Desactivando"} zonas...`,
			success: () => {
				table.resetRowSelection();
				return `${status === "active" ? "Activado" : "Desactivado"} ${selectedUsers.length} zona${selectedUsers.length > 1 ? "s" : ""}`;
			},
			error: `Error ${status === "active" ? "activando" : "desactivando"} zonas`,
		});
		table.resetRowSelection();
	};

	return (
		<>
			<BulkActionsToolbar table={table} entityName="zona">
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="outline"
							size="icon"
							onClick={() => handleBulkStatusChange("active")}
							className="size-8"
							aria-label="Activar zonas seleccionados"
							title="Activar zonas seleccionados"
						>
							<UserCheck />
							<span className="sr-only">Activar zonas seleccionados</span>
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Activar zonas seleccionados</p>
					</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="outline"
							size="icon"
							onClick={() => handleBulkStatusChange("inactive")}
							className="size-8"
							aria-label="Desactivar zonas seleccionados"
							title="Desactivar zonas seleccionados"
						>
							<UserX />
							<span className="sr-only">Desactivar zonas seleccionados</span>
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Desactivar zonas seleccionados</p>
					</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="destructive"
							size="icon"
							onClick={() => setShowDeleteConfirm(true)}
							className="size-8"
							aria-label="Eliminar zonas seleccionados"
							title="Eliminar zonas seleccionados"
						>
							<Trash2 />
							<span className="sr-only">Eliminar zonas seleccionados</span>
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Eliminar zonas seleccionados</p>
					</TooltipContent>
				</Tooltip>
			</BulkActionsToolbar>

			<ZonesMultiDeleteDialog
				table={table}
				open={showDeleteConfirm}
				onOpenChange={setShowDeleteConfirm}
			/>
		</>
	);
}
