"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Unauthorized() {
	const { back } = useRouter();

	return (
		<main id="main-content" className="h-svh">
			<div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
				<p aria-hidden="true" className="text-[7rem] leading-tight font-bold">401</p>
				<h1 className="text-2xl font-bold">Acceso no autorizado</h1>
				<p className="text-muted-foreground text-center">
					Por favor inicia sesión con las credenciales adecuadas <br /> para
					acceder a este recurso
				</p>
				<div className="mt-6 flex gap-4">
					<Button variant="outline" onClick={() => back()}>
						Atrás
					</Button>
					<Button asChild>
						<Link href="/">Regresar al inicio</Link>
					</Button>
				</div>
			</div>
		</main>
	);
}
