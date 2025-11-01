"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function NotFound() {
	const { back, push } = useRouter();

	return (
		<div className="h-svh">
			<div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
				<h1 className="text-[7rem] leading-tight font-bold">404</h1>
				<span className="font-medium">Ups! Página no encontrada!</span>
				<p className="text-muted-foreground text-center">
					Parece que la página que buscas no existe o ha sido eliminada.
				</p>
				<div className="mt-6 flex gap-4">
					<Button variant="outline" onClick={() => back()}>
						Atrás
					</Button>
					<Button onClick={() => push("/")}>Regresar al inicio</Button>
				</div>
			</div>
		</div>
	);
}
