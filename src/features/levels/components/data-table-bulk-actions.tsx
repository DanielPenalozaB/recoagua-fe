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
import type { Level } from "@/types/level";
import { LevelsMultiDeleteDialog } from "./levels-multi-delete-dialog";

type DataTableBulkActionsProps<TData> = {
	readonly table: Table<TData>;
};

export function DataTableBulkActions<TData>({
	table,
}: DataTableBulkActionsProps<TData>) {
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const selectedRows = table.getFilteredSelectedRowModel().rows;

	const handleBulkStatusChange = (status: "active" | "inactive") => {
		const selectedUsers = selectedRows.map((row) => row.original as Level);
		toast.promise(sleep(2000), {
			loading: `${status === "active" ? "Activando" : "Desactivando"} niveles...`,
			success: () => {
				table.resetRowSelection();
				return `${status === "active" ? "Activado" : "Desactivado"} ${selectedUsers.length} nivel${selectedUsers.length > 1 ? "s" : ""}`;
			},
			error: `Error ${status === "active" ? "activando" : "desactivando"} niveles`,
		});
		table.resetRowSelection();
	};

	return (
		<>
			<BulkActionsToolbar table={table} entityName="nivel">
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="outline"
							size="icon"
							onClick={() => handleBulkStatusChange("active")}
							className="size-8"
							aria-label="Activar niveles seleccionados"
							title="Activar niveles seleccionados"
						>
							<UserCheck />
							<span className="sr-only">Activar niveles seleccionados</span>
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Activar niveles seleccionados</p>
					</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="outline"
							size="icon"
							onClick={() => handleBulkStatusChange("inactive")}
							className="size-8"
							aria-label="Desactivar niveles seleccionados"
							title="Desactivar niveles seleccionados"
						>
							<UserX />
							<span className="sr-only">Desactivar niveles seleccionados</span>
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Desactivar niveles seleccionados</p>
					</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="destructive"
							size="icon"
							onClick={() => setShowDeleteConfirm(true)}
							className="size-8"
							aria-label="Eliminar niveles seleccionados"
							title="Eliminar niveles seleccionados"
						>
							<Trash2 />
							<span className="sr-only">Eliminar niveles seleccionados</span>
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Eliminar niveles seleccionados</p>
					</TooltipContent>
				</Tooltip>
			</BulkActionsToolbar>

			<LevelsMultiDeleteDialog
				table={table}
				open={showDeleteConfirm}
				onOpenChange={setShowDeleteConfirm}
			/>
		</>
	);
}
