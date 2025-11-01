"use client";

import { MapPinned } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function RegionsPrimaryButtons() {
	return (
		<div className="flex gap-2">
			<Link href="/admin/regions/create" className="flex items-center gap-2">
				<Button className="space-x-1">
					<span>Crear región</span> <MapPinned size={18} />
				</Button>
			</Link>
		</div>
	);
}
