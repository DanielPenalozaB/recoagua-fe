"use client";

import { Flag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ZonesPrimaryButtons() {
	return (
		<div className="flex gap-2">
			<Link href="/admin/zones/create" className="flex items-center gap-2">
				<Button className="space-x-1">
					<span>Crear zona</span> <Flag size={18} />
				</Button>
			</Link>
		</div>
	);
}
