"use client";

import type { Table } from "@tanstack/react-table";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sleep } from "@/lib/utils";

type GuidesMultiDeleteDialogProps<TData> = {
	readonly open: boolean;
	readonly onOpenChange: (open: boolean) => void;
	readonly table: Table<TData>;
};

const CONFIRM_WORD = "DELETE";

export function GuidesMultiDeleteDialog<TData>({
	open,
	onOpenChange,
	table,
}: GuidesMultiDeleteDialogProps<TData>) {
	const [value, setValue] = useState("");

	const selectedRows = table.getFilteredSelectedRowModel().rows;

	const handleDelete = () => {
		if (value.trim() !== CONFIRM_WORD) {
			toast.error(`Por favor, escriba "${CONFIRM_WORD}" para confirmar.`);
			return;
		}

		onOpenChange(false);

		toast.promise(sleep(2000), {
			loading: "Eliminando guías...",
			success: () => {
				table.resetRowSelection();
				return `Eliminar ${selectedRows.length} ${
					selectedRows.length > 1 ? "guías" : "guía"
				}`;
			},
			error: "Error",
		});
	};

	return (
		<ConfirmDialog
			open={open}
			onOpenChange={onOpenChange}
			handleConfirm={handleDelete}
			disabled={value.trim() !== CONFIRM_WORD}
			title={
				<span className="text-destructive">
					<AlertTriangle
						className="inline-block stroke-destructive me-1"
						size={18}
					/>{" "}
					Eliminar {selectedRows.length}{" "}
					{selectedRows.length > 1 ? "guías" : "guía"}
				</span>
			}
			desc={
				<div className="space-y-4">
					<p className="mb-2">
						Estas seguro de eliminar {selectedRows.length} guías? <br />
						Esta acción no se puede deshacer.
					</p>

					<Label className="flex flex-col items-start gap-1.5 my-4">
						<span className="">Confirma escribiendo "{CONFIRM_WORD}":</span>
						<Input
							value={value}
							onChange={(e) => setValue(e.target.value)}
							placeholder={`Escribe "${CONFIRM_WORD}" para confirmar.`}
						/>
					</Label>

					<Alert variant="destructive">
						<AlertTitle>Cuidado!</AlertTitle>
						<AlertDescription>
							Por favor sé precavido, esta acción es irreversible.
						</AlertDescription>
					</Alert>
				</div>
			}
			confirmText="Eliminar"
			destructive
		/>
	);
}
