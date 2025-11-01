"use client";

import type { Row } from "@tanstack/react-table";
import { Ellipsis, Trash2, UserPen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User } from "@/types/user";
import { useUsers } from "./users-provider";

type DataTableRowActionsProps = {
	readonly row: Row<User>;
};

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
	const { setOpen, setCurrentRow } = useUsers();

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="flex data-[state=open]:bg-muted p-0 w-8 h-8"
				>
					<Ellipsis className="w-4 h-4" />
					<span className="sr-only">Open menu</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-[160px]">
				<Link href={`/admin/users/${row.original.id}`}>
					<DropdownMenuItem>
						Editar
						<DropdownMenuShortcut>
							<UserPen size={16} />
						</DropdownMenuShortcut>
					</DropdownMenuItem>
				</Link>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={() => {
						setCurrentRow(row.original);
						setOpen("delete");
					}}
					className="text-red-500!"
				>
					Eliminar
					<DropdownMenuShortcut>
						<Trash2 size={16} />
					</DropdownMenuShortcut>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
