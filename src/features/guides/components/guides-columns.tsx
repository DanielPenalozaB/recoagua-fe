"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Star } from "lucide-react";
import { DataTableColumnHeader } from "@/components/data-table";
import { Badge } from "@/components/ui";
import { Checkbox } from "@/components/ui/checkbox";
import { LongText } from "@/components/ui/long-text";
import { cn } from "@/lib/utils";
import type { Guide } from "@/types/guide";
import { callTypes, statusTypeTranslation } from "../data/data";
import { DataTableRowActions } from "./data-table-row-actions";

export const guidesColumns: ColumnDef<Guide>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
				className="translate-y-[2px]"
			/>
		),
		meta: {
			className: cn("md:table-cell z-10 sticky rounded-tl-[inherit] start-0"),
		},
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Seleccionar fila"
				className="translate-y-[2px]"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "name",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Nombre" />
		),
		cell: ({ row }) => (
			<LongText className="ps-3 max-w-48">{row.getValue("name")}</LongText>
		),
		meta: {
			className: cn(
				"drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]",
				"sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none",
			),
		},
		enableHiding: false,
	},
	{
		accessorKey: "description",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Descripción" />
		),
		cell: ({ row }) => (
			<div className="w-fit text-nowrap">{row.getValue("description")}</div>
		),
	},
	{
		accessorKey: "score",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Puntaje" />
		),
		cell: ({ row }) => (
			<div className="flex items-center gap-1">
				<Star className="size-4 text-neutral-500" />
				{row.getValue("score")}
			</div>
		),
	},
	{
		accessorKey: "status",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Estado" />
		),
		cell: ({ row }) => {
			const { status } = row.original;
			const badgeColor = callTypes.get(status);
			return (
				<div className="flex space-x-2">
					<Badge variant="outline" className={cn("capitalize", badgeColor)}>
						{statusTypeTranslation.get(status)}
					</Badge>
				</div>
			);
		},
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id));
		},
		enableHiding: false,
		enableSorting: false,
	},
	{
		accessorKey: "createdAt",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Creación" />
		),
		cell: ({ row }) => {
			const date = new Date(row.original.createdAt);
			const day = String(date.getDate()).padStart(2, "0");
			const month = String(date.getMonth() + 1).padStart(2, "0");
			const year = date.getFullYear();
			return <div className="w-fit">{`${day}/${month}/${year}`}</div>;
		},
		enableSorting: true,
		enableHiding: true,
	},
	{
		accessorKey: "updatedAt",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Actualización" />
		),
		cell: ({ row }) => {
			const date = new Date(row.original.updatedAt);
			const day = String(date.getDate()).padStart(2, "0");
			const month = String(date.getMonth() + 1).padStart(2, "0");
			const year = date.getFullYear();
			return <div className="w-fit">{`${day}/${month}/${year}`}</div>;
		},
		enableSorting: true,
		enableHiding: true,
	},
	{
		id: "actions",
		cell: DataTableRowActions,
	},
];
